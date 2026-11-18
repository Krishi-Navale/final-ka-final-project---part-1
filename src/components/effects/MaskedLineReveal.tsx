import React, { useEffect, useRef, useState } from 'react';

interface MaskedLineRevealProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  immediate?: boolean;
}

export const MaskedLineReveal: React.FC<MaskedLineRevealProps> = ({
  children,
  delayMs = 0,
  className = '',
  immediate = false,
}) => {
  const [isVisible, setIsVisible] = useState(immediate);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (immediate) {
      setIsVisible(true);
      return;
    }
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div
        style={{
          transform: isVisible ? 'translateY(0%)' : 'translateY(108%)',
          opacity: isVisible ? 1 : 0,
          transition: `transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </div>
    </div>
  );
};
