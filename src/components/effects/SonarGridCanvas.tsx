import React, { useEffect, useRef, useState } from 'react';

interface Blip {
  angle: number;
  dist: number;
  label: string;
  intensity: number;
}

export const SonarGridCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    const speed = 0.022;

    const blips: Blip[] = [
      { angle: 0.8, dist: 0.35, label: 'IFSO-DEL-94812', intensity: 0 },
      { angle: 2.2, dist: 0.65, label: 'MAH-CY-84019', intensity: 0 },
      { angle: 3.7, dist: 0.5, label: '1930-FREEZE-BLR', intensity: 0 },
      { angle: 5.1, dist: 0.75, label: 'INT-LYON-0021', intensity: 0 },
    ];

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(cx, cy) - 14;

      ctx.clearRect(0, 0, w, h);

      // Radar Concentric Circles (Professional Slate / Government Navy style)
      ctx.strokeStyle = 'rgba(255, 90, 31, 0.22)';
      ctx.lineWidth = 1;
      const rings = [0.25, 0.5, 0.75, 1];
      rings.forEach((ratio) => {
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * ratio, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshair Axes
      ctx.strokeStyle = 'rgba(255, 90, 31, 0.18)';
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.stroke();

      // Rotating Sonar Sweep Arc
      angle = (angle + speed) % (Math.PI * 2);

      const sweepGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      sweepGradient.addColorStop(0, 'rgba(255, 90, 31, 0.28)');
      sweepGradient.addColorStop(1, 'rgba(255, 90, 31, 0.03)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, angle - 0.45, angle);
      ctx.closePath();
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Leading Sweep Beam
      ctx.strokeStyle = 'rgba(255, 90, 31, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.stroke();
      ctx.restore();

      // Blip points
      blips.forEach((b) => {
        const bx = cx + Math.cos(b.angle) * (maxR * b.dist);
        const by = cy + Math.sin(b.angle) * (maxR * b.dist);

        // Check if sweep passed over this angle
        const diff = Math.abs((angle % (Math.PI * 2)) - b.angle);
        if (diff < 0.08) {
          b.intensity = 1;
        } else {
          b.intensity = Math.max(0, b.intensity - 0.012);
        }

        // Draw blip
        const alpha = 0.35 + b.intensity * 0.65;
        ctx.fillStyle = `rgba(255, 90, 31, ${alpha})`;
        ctx.beginPath();
        ctx.arc(bx, by, 3.5 + b.intensity * 3, 0, Math.PI * 2);
        ctx.fill();

        // Expanding ping ring if hit
        if (b.intensity > 0.4) {
          ctx.strokeStyle = `rgba(255, 90, 31, ${b.intensity * 0.6})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(bx, by, (1 - b.intensity) * 22, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Label if active
        if (b.intensity > 0.5) {
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.fillText(b.label, bx + 10, by - 4);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={340}
        height={340}
        className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] cursor-crosshair rounded-full border-2 border-orange-500/30 bg-slate-50 shadow-xl backdrop-blur-md"
      />
      <div className="mt-3 flex items-center gap-2 text-[10px] font-mono-code text-slate-600 font-bold uppercase tracking-wider">
        <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
        <span>National Cyber Crime Radar · Active Sonar Sweep</span>
      </div>
    </div>
  );
};
