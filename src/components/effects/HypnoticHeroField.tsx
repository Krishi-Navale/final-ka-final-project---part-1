import React, { useEffect, useRef } from 'react';

/**
 * Continuous 60fps Hypnotic Concentric Vortex & Liquid Photon Field
 * Renders seamlessly over the Hero video backdrop for an emerging live feel.
 */
export const HypnoticHeroField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.48, active: false });

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
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
        active: true,
      };
    };

    const parent = canvas.parentElement;
    parent?.addEventListener('mousemove', onMouseMove);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.012;

      ctx.clearRect(0, 0, w, h);

      const targetCx = w * (0.58 + (mouseRef.current.active ? (mouseRef.current.x - 0.5) * 0.08 : 0));
      const targetCy = h * (0.48 + (mouseRef.current.active ? (mouseRef.current.y - 0.5) * 0.08 : 0));
      const maxDim = Math.max(w, h);

      // 1. Hypnotic Concentric Harmonic Rings
      const ringCount = 9;
      for (let i = 0; i < ringCount; i++) {
        const phase = (t * 0.45 + i / ringCount) % 1;
        const radius = (0.08 + phase * 0.62) * maxDim;
        const alpha = Math.sin(phase * Math.PI) * 0.34;

        ctx.beginPath();
        const segments = 96;
        for (let s = 0; s <= segments; s++) {
          const a = (s / segments) * Math.PI * 2;
          const wave =
            Math.sin(a * 4 + t * 2.1 + i * 0.7) * (8 + phase * 18) +
            Math.cos(a * 2 - t * 1.4) * 6;
          const r = radius + wave;
          const px = targetCx + Math.cos(a) * r;
          const py = targetCy + Math.sin(a) * r * 0.86;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle =
          i % 2 === 0
            ? `rgba(255, 77, 21, ${alpha})`
            : `rgba(255, 196, 148, ${alpha * 0.65})`;
        ctx.lineWidth = 1.25;
        ctx.stroke();
      }

      // 2. Sweeping Molten Amber Spiral Petals
      for (let arm = 0; arm < 3; arm++) {
        const baseAngle = t * 0.55 + (arm * Math.PI * 2) / 3;
        ctx.beginPath();
        for (let step = 0; step < 50; step++) {
          const ratio = step / 50;
          const spiralR = ratio * maxDim * 0.52;
          const theta = baseAngle + ratio * Math.PI * 2.2 + Math.sin(t + ratio * 3) * 0.25;
          const sx = targetCx + Math.cos(theta) * spiralR;
          const sy = targetCy + Math.sin(theta) * spiralR * 0.85;
          if (step === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        const grad = ctx.createLinearGradient(
          targetCx,
          targetCy,
          targetCx + Math.cos(baseAngle + 2) * maxDim * 0.45,
          targetCy + Math.sin(baseAngle + 2) * maxDim * 0.45
        );
        grad.addColorStop(0, 'rgba(255, 110, 48, 0.32)');
        grad.addColorStop(0.6, 'rgba(255, 77, 21, 0.14)');
        grad.addColorStop(1, 'rgba(255, 77, 21, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 3. Emerging Orbital Photons
      for (let p = 0; p < 18; p++) {
        const speed = 0.35 + (p % 4) * 0.12;
        const angle = t * speed + p * 0.9;
        const orbitR = ((p * 47 + t * 22) % (maxDim * 0.55)) + 30;
        const px = targetCx + Math.cos(angle) * orbitR;
        const py = targetCy + Math.sin(angle) * orbitR * 0.84;

        ctx.beginPath();
        ctx.arc(px, py, 1.8 + (p % 3) * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = p % 3 === 0 ? 'rgba(255,255,255,0.65)' : 'rgba(255, 95, 36, 0.72)';
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      parent?.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-90"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
