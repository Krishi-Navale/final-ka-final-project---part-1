import React, { useEffect, useState, useRef } from 'react';

export const FloatingCursorBadge: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [badgeText, setBadgeText] = useState('fip · 256');
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const badgeElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only enable on pointer fine devices (desktops/laptops with mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Check what element is under the cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, textarea, [data-cursor]');
        if (interactive) {
          setIsHoveringClickable(true);
          const customText = interactive.getAttribute('data-cursor');
          setBadgeText(customText || 'CLICK ↗');
        } else {
          setIsHoveringClickable(false);
          setBadgeText('fip · 256');
        }
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.body.addEventListener('mouseleave', handleMouseLeave);

    // Smooth Lerp animation loop
    let animId: number;
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const updatePosition = () => {
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.18);
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.18);

      if (badgeElementRef.current) {
        badgeElementRef.current.style.transform = `translate3d(${posRef.current.x + 14}px, ${posRef.current.y + 14}px, 0)`;
      }

      animId = requestAnimationFrame(updatePosition);
    };

    animId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={badgeElementRef}
      className="fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-200"
      style={{ willChange: 'transform' }}
    >
      <div
        className={`px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold tracking-wider uppercase transition-all duration-200 backdrop-blur-md shadow-lg flex items-center gap-1.5 ${
          isHoveringClickable
            ? 'bg-[#FF5A1F] text-white scale-110 shadow-orange-500/30'
            : 'bg-slate-900/80 text-amber-200/90 scale-95 border border-white/20'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{badgeText}</span>
      </div>
    </div>
  );
};
