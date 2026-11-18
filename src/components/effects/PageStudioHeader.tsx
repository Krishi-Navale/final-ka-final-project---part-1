import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { MaskedLineReveal } from './MaskedLineReveal';
import { MagneticButton } from './MagneticButton';
import { HeroSentinelSculpture } from './HeroSentinelSculpture';

interface PageStudioHeaderProps {
  kicker: string;
  title: string;
  subtitle: string;
  nodeLabel?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  showOrb?: boolean;
  children?: React.ReactNode;
}

/**
 * Shared Architectural Cinema Studio Header Band across all F.I.P inner pages
 * Features a live 60fps ambient cryptographic wave canvas, hairline dividers,
 * balanced display typography, and interactive 3D Orbital Sentinel sculpture.
 */
export const PageStudioHeader: React.FC<PageStudioHeaderProps> = ({
  kicker,
  title,
  subtitle,
  nodeLabel = 'SHA-256 · WORM · SECTION 65B',
  ctaLabel,
  onCtaClick,
  showOrb = false,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 320;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      t += 0.015;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Subtle animated harmonic wave ribbons across the studio header
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 18) {
          const y =
            h * 0.55 +
            Math.sin(x * 0.004 + t + wave * 1.1) * (18 + wave * 8) +
            Math.cos(x * 0.009 - t * 0.7) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle =
          wave === 0
            ? 'rgba(255, 77, 21, 0.14)'
            : wave === 1
            ? 'rgba(13, 13, 16, 0.06)'
            : 'rgba(56, 189, 248, 0.10)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative w-full bg-[#F5F5F7] text-[#0D0D10] border-b border-black/10 pt-10 sm:pt-14 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Live 60FPS Ambient Studio Wave Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
      />

      <div className="relative z-10 w-full space-y-8">
        {/* Clean Unboxed Hairline Top Metadata Strip */}
        <div className="py-2.5 border-y border-black/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-code text-zinc-500">
          <span>fip. · National Forensic Custody Platform</span>
          <span className="hidden sm:inline">{nodeLabel}</span>
          <span className="text-[#FF4D15] font-semibold tabular-nums">RFC-3161 WORM Node 2026</span>
        </div>

        {/* Main Asymmetric Title Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className={showOrb ? 'lg:col-span-6 space-y-3' : 'lg:col-span-7 space-y-3'}>
            <div className="text-xs font-mono-code text-[#FF4D15] font-semibold">
              {kicker}
            </div>
            <MaskedLineReveal immediate delayMs={30}>
              <h1
                className="text-4xl sm:text-5xl xl:text-[3.75rem] font-semibold tracking-tight text-[#0D0D10] leading-[1.04]"
                style={{ textWrap: 'balance' }}
              >
                {title}
              </h1>
            </MaskedLineReveal>
          </div>

          <div
            className={`${
              showOrb ? 'lg:col-span-4' : 'lg:col-span-5'
            } lg:pb-1 space-y-4 max-w-lg lg:ml-auto`}
          >
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-medium">
              {subtitle}
            </p>
            {ctaLabel && onCtaClick && (
              <MagneticButton
                onClick={onCtaClick}
                className="px-6 py-3 rounded-full bg-[#0D0D10] hover:bg-[#FF4D15] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap shrink-0"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticButton>
            )}
          </div>

          {showOrb && (
            <div className="hidden lg:flex lg:col-span-2 justify-end h-36">
              <div className="w-36 h-36">
                <HeroSentinelSculpture variant="orbital-glass" />
              </div>
            </div>
          )}
        </div>

        {children && <div className="pt-2">{children}</div>}
      </div>
    </section>
  );
};
