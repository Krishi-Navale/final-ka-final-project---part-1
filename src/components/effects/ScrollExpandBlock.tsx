import React, { useEffect, useRef } from 'react';

interface ScrollExpandBlockProps {
  children: React.ReactNode;
  className?: string;
  minScale?: number;
}

/**
 * High-fluidity 60/120fps scroll-driven expansion container using direct GPU transform lerp.
 * Zero React re-renders during scroll for butter-smooth end-to-end scale transitions.
 */
export const ScrollExpandBlock: React.FC<ScrollExpandBlockProps> = ({
  children,
  className = '',
  minScale = 0.94,
}) => {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let currentScale = minScale;
    let currentY = 26;
    let currentOpacity = 0.35;
    let rafId: number | null = null;
    let isRunning = true;

    const tick = () => {
      if (!isRunning || !el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 900;

      // Normalized reveal window as block enters viewport
      const start = vh * 0.98;
      const end = vh * 0.3;
      const raw = (start - rect.top) / (start - end);
      const clamped = Math.max(0, Math.min(1, raw));
      const eased = 1 - Math.pow(1 - clamped, 3);

      const targetScale = minScale + (1 - minScale) * eased;
      const targetY = (1 - eased) * 26;
      const targetOpacity = 0.3 + 0.7 * eased;

      // Smooth damped interpolation
      currentScale += (targetScale - currentScale) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      currentOpacity += (targetOpacity - currentOpacity) * 0.18;

      el.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0) scale(${currentScale.toFixed(4)})`;
      el.style.opacity = currentOpacity.toFixed(3);

      if (
        Math.abs(targetScale - currentScale) > 0.0005 ||
        Math.abs(targetY - currentY) > 0.05 ||
        Math.abs(targetOpacity - currentOpacity) > 0.002
      ) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const kick = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(tick);
      }
    };

    kick();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick, { passive: true });

    return () => {
      isRunning = false;
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [minScale]);

  return (
    <div ref={elRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};
