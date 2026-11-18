import React, { useEffect, useRef } from 'react';

interface KineticMarqueeProps {
  items?: string[];
  className?: string;
  speed?: number;
  variant?: 'overlay' | 'band';
  theme?: 'dark' | 'light';
}

export const KineticMarquee: React.FC<KineticMarqueeProps> = ({
  items = [
    'F.I.P · FORENSIC INVESTIGATION PLATFORM',
    'SHA-256 WORM LEDGER',
    'SECTION 65B CERTIFIED',
    '1930 INTERDICTION',
    'CHAIN OF CUSTODY',
    'RFC-3161 IMMUTABLE',
  ],
  className = '',
  speed = 0.65,
  variant = 'band',
  theme = 'dark',
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef<number>(0);
  const lastScrollYRef = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const velocityRef = useRef<number>(0);

  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;
      lastScrollYRef.current = currentY;
      velocityRef.current += delta * 0.18;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      velocityRef.current *= 0.92;
      offsetRef.current -=
        speed + Math.abs(velocityRef.current) * 0.45 * Math.sign(velocityRef.current || 1);

      const track = trackRef.current;
      if (track) {
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          if (offsetRef.current <= -halfWidth) {
            offsetRef.current += halfWidth;
          } else if (offsetRef.current >= 0) {
            offsetRef.current -= halfWidth;
          }
        }
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  const repeatedItems = [...items, ...items, ...items, ...items];

  const isLight = theme === 'light';

  return (
    <div
      className={`w-full overflow-hidden select-none pointer-events-none ${
        variant === 'overlay'
          ? isLight
            ? 'py-3 border-y border-black/10 bg-[#F5F5F7]/80 backdrop-blur-sm'
            : 'py-3 border-y border-white/10 bg-[#070709]/60 backdrop-blur-sm'
          : isLight
          ? 'py-7 border-y border-black/10 bg-[#EAEAEF]'
          : 'py-8 border-y border-white/10 bg-[#0A0A0D]'
      } ${className}`}
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        className="flex items-center whitespace-nowrap will-change-transform"
      >
        {repeatedItems.map((text, idx) => (
          <div key={idx} className="flex items-center shrink-0">
            <span
              className={`font-black uppercase tracking-tighter px-6 sm:px-10 ${
                variant === 'overlay'
                  ? isLight
                    ? 'text-4xl sm:text-6xl lg:text-7xl text-[#0D0D10]/90'
                    : 'text-4xl sm:text-6xl lg:text-7xl text-white/90'
                  : isLight
                  ? 'text-4xl sm:text-6xl lg:text-7xl text-[#0D0D10]'
                  : 'text-5xl sm:text-7xl lg:text-8xl text-white'
              }`}
            >
              {text}
            </span>
            <span className="text-[#FF4D15] text-3xl sm:text-5xl font-black">/</span>
          </div>
        ))}
      </div>
    </div>
  );
};
