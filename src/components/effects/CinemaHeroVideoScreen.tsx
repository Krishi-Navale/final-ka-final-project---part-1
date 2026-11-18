import React, { useEffect, useRef } from 'react';
import sentinelImgSrc from '../../assets/images/fip_hero_sentinel_1794686949937.jpg';
import secureMindImgSrc from '../../assets/images/fip_secure_mind_profile_1794687580593.jpg';

export type CinemaSceneMode = 'sentinel-imax' | 'securemind-studio' | 'global-interdiction';

interface CinemaHeroVideoScreenProps {
  sceneMode: CinemaSceneMode;
  isPlaying: boolean;
  onFrameTick?: (timecode: string) => void;
}

interface StarParticle {
  x: number;
  y: number;
  z: number;
  speed: number;
  hex: string;
  color: string;
}

const HEX_TOKENS = [
  'SHA256',
  '0x9F4A',
  '65B-OK',
  'WORM',
  '1930',
  '0xE8C1',
  'RFC3161',
  '0x7B2D',
  'IFSO',
  'I4C',
];

/**
 * Full-Viewport 60FPS Animated Cinema Video Screen
 * Renders a real-time procedural cinema film onto a high-DPI backing canvas AND pipes
 * `canvas.captureStream(60)` directly into a full-bleed HTML5 <video> element covering
 * the entire Hero section layout edge-to-edge like an IMAX cinema screen.
 */
export const CinemaHeroVideoScreen: React.FC<CinemaHeroVideoScreenProps> = ({
  sceneMode,
  isPlaying,
  onFrameTick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const sceneModeRef = useRef<CinemaSceneMode>(sceneMode);
  const isPlayingRef = useRef<boolean>(isPlaying);

  useEffect(() => {
    sceneModeRef.current = sceneMode;
  }, [sceneMode]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Preload both cinema centerpiece images for zero-flicker canvas compositing
    const sentinelImg = new Image();
    sentinelImg.crossOrigin = 'anonymous';
    sentinelImg.src = sentinelImgSrc;

    const secureMindImg = new Image();
    secureMindImg.crossOrigin = 'anonymous';
    secureMindImg.src = secureMindImgSrc;

    let animId: number;
    let frameCount = 0;
    let elapsed = 0;

    // Initialize 3D volumetric particles
    const particles: StarParticle[] = Array.from({ length: 85 }, (_, i) => ({
      x: (Math.random() - 0.5) * 2400,
      y: (Math.random() - 0.5) * 1400,
      z: Math.random() * 1000 + 50,
      speed: 3.2 + (i % 5) * 1.1,
      hex: HEX_TOKENS[i % HEX_TOKENS.length],
      color: i % 3 === 0 ? '#FF4D15' : i % 3 === 1 ? '#FFB088' : '#38BDF8',
    }));

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Pipe live 60fps canvas stream into the full-bleed <video> element
    if (video && typeof (canvas as any).captureStream === 'function') {
      try {
        const stream = (canvas as any).captureStream(60);
        video.srcObject = stream;
        video.play().catch(() => {});
      } catch {
        // Fallback to direct canvas display if captureStream is restricted
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      mouseRef.current.targetX = e.clientX / w;
      mouseRef.current.targetY = e.clientY / h;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      if (isPlayingRef.current) {
        elapsed += 0.016;
        frameCount++;
      }

      // Smooth camera parallax lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5 + (mouseRef.current.x - 0.5) * w * 0.045;
      const cy = h * 0.5 + (mouseRef.current.y - 0.5) * h * 0.045;
      const mode = sceneModeRef.current;

      if (mode === 'sentinel-imax') {
        // =====================================================================
        // SCENE 01: IMAX OBSIDIAN SENTINEL & MOLTEN WORM VORTEX
        // =====================================================================
        const bgGrad = ctx.createRadialGradient(cx, cy * 0.92, w * 0.04, cx, cy, w * 0.78);
        bgGrad.addColorStop(0, '#2B0D04');
        bgGrad.addColorStop(0.38, '#0D0604');
        bgGrad.addColorStop(0.75, '#050508');
        bgGrad.addColorStop(1, '#020204');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Volumetric Cinema God-Rays & Molten Nebula Waves
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let ray = 0; ray < 6; ray++) {
          const angle = elapsed * 0.22 + (ray * Math.PI) / 3;
          const rx = cx + Math.cos(angle) * w * 0.35;
          const ry = cy + Math.sin(angle) * h * 0.35;
          const rayGrad = ctx.createRadialGradient(
            cx,
            cy,
            w * 0.02,
            rx,
            ry,
            w * 0.42
          );
          rayGrad.addColorStop(0, 'rgba(255, 77, 21, 0.20)');
          rayGrad.addColorStop(0.5, 'rgba(255, 120, 45, 0.07)');
          rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, w * 0.48, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Architectural 3D Perspective Floor & Ceiling Grid
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 77, 21, 0.11)';
        ctx.lineWidth = 1;
        const horizonY = cy;
        for (let i = -10; i <= 10; i++) {
          const xSpread = i * (w * 0.14);
          ctx.beginPath();
          ctx.moveTo(cx + xSpread * 0.08, horizonY);
          ctx.lineTo(cx + xSpread, h);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cx + xSpread * 0.08, horizonY);
          ctx.lineTo(cx + xSpread, 0);
          ctx.stroke();
        }
        ctx.restore();

        // Centerpiece Obsidian Sentinel Portrait Composite with Radial Feathering
        if (sentinelImg.complete && sentinelImg.naturalWidth > 0) {
          const targetH = h * 0.92;
          const aspect = sentinelImg.naturalWidth / sentinelImg.naturalHeight;
          const targetW = targetH * aspect;
          const imgX = cx - targetW * 0.5;
          const imgY = h - targetH + Math.sin(elapsed * 1.6) * 8;

          ctx.save();
          ctx.globalCompositeOperation = 'lighten';
          ctx.globalAlpha = 0.92;
          ctx.drawImage(sentinelImg, imgX, imgY, targetW, targetH);
          ctx.restore();

          // Soft cinema vignette around portrait edges so it blends 100% into the widescreen video
          const edgeBlend = ctx.createRadialGradient(
            cx,
            cy,
            Math.min(w, h) * 0.18,
            cx,
            cy,
            Math.max(w, h) * 0.56
          );
          edgeBlend.addColorStop(0, 'rgba(5, 5, 8, 0)');
          edgeBlend.addColorStop(0.68, 'rgba(5, 5, 8, 0.42)');
          edgeBlend.addColorStop(1, 'rgba(3, 3, 6, 0.95)');
          ctx.fillStyle = edgeBlend;
          ctx.fillRect(0, 0, w, h);
        }

        // Concentric Holographic WORM Telemetry Rings
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let r = 0; r < 5; r++) {
          const phase = (elapsed * 0.35 + r * 0.2) % 1;
          const radius = (0.14 + phase * 0.44) * Math.min(w, h);
          const alpha = Math.sin(phase * Math.PI) * 0.45;
          ctx.strokeStyle =
            r % 2 === 0
              ? `rgba(255, 77, 21, ${alpha})`
              : `rgba(255, 185, 130, ${alpha * 0.7})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy * 0.95, radius, elapsed * (r % 2 === 0 ? 0.6 : -0.5), elapsed * (r % 2 === 0 ? 0.6 : -0.5) + Math.PI * 1.45);
          ctx.stroke();
        }

        // Anamorphic Horizontal Cinema Lens Flare
        const flareY = cy * 0.88 + Math.sin(elapsed * 1.3) * (h * 0.12);
        const flareGrad = ctx.createLinearGradient(0, flareY, w, flareY);
        flareGrad.addColorStop(0, 'rgba(255, 77, 21, 0)');
        flareGrad.addColorStop(0.35, 'rgba(255, 110, 45, 0.18)');
        flareGrad.addColorStop(0.5, 'rgba(255, 230, 200, 0.55)');
        flareGrad.addColorStop(0.65, 'rgba(56, 189, 248, 0.18)');
        flareGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = flareGrad;
        ctx.fillRect(0, flareY - 2, w, 4);
        ctx.restore();
      } else if (mode === 'securemind-studio') {
        // =====================================================================
        // SCENE 02: SECUREMIND NEURAL HOLOGRAPHIC STUDIO (Light Cinema Mode)
        // =====================================================================
        const bgGrad = ctx.createRadialGradient(cx, cy, w * 0.05, cx, cy, w * 0.8);
        bgGrad.addColorStop(0, '#FFFFFF');
        bgGrad.addColorStop(0.55, '#F4F5F8');
        bgGrad.addColorStop(1, '#E4E7EE');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Subtle Architectural Swiss Grid in Studio Light
        ctx.save();
        ctx.strokeStyle = 'rgba(13, 13, 16, 0.045)';
        ctx.lineWidth = 1;
        const step = 64;
        for (let x = 0; x < w; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
        ctx.restore();

        // Centerpiece SecureMind Profile Composite with Seamless Multiply Blend
        if (secureMindImg.complete && secureMindImg.naturalWidth > 0) {
          const targetH = h * 0.94;
          const aspect = secureMindImg.naturalWidth / secureMindImg.naturalHeight;
          const targetW = targetH * aspect;
          const imgX = cx - targetW * 0.5;
          const imgY = h - targetH + Math.sin(elapsed * 1.4) * 6;

          ctx.save();
          ctx.globalCompositeOperation = 'multiply';
          ctx.drawImage(secureMindImg, imgX, imgY, targetW, targetH);
          ctx.restore();
        }

        // Animated Neural Padlock & Circuit Waves Radiating Across Studio Screen
        ctx.save();
        const brainCx = cx - w * 0.015;
        const brainCy = cy * 0.72;
        for (let ring = 0; ring < 5; ring++) {
          const phase = (elapsed * 0.4 + ring * 0.2) % 1;
          const r = phase * Math.min(w, h) * 0.42 + 24;
          const alpha = Math.sin(phase * Math.PI) * 0.38;
          ctx.strokeStyle =
            ring % 2 === 0
              ? `rgba(255, 77, 21, ${alpha})`
              : `rgba(14, 165, 233, ${alpha})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(brainCx, brainCy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      } else {
        // =====================================================================
        // SCENE 03: 1930 GOLDEN WINDOW GLOBAL INTERDICTION MATRIX
        // =====================================================================
        const bgGrad = ctx.createRadialGradient(cx, cy * 1.1, w * 0.05, cx, cy, w * 0.85);
        bgGrad.addColorStop(0, '#0D192B');
        bgGrad.addColorStop(0.5, '#070B12');
        bgGrad.addColorStop(1, '#030407');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Planetary Curvature Lat/Long Matrix
        const globeRadius = Math.min(w, h) * 0.55;
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
        ctx.lineWidth = 1.2;
        for (let lat = 1; lat <= 6; lat++) {
          ctx.beginPath();
          ctx.ellipse(
            cx,
            cy,
            globeRadius,
            globeRadius * (lat / 6),
            elapsed * 0.08,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }

        // Ballistic Interdiction Arcs
        for (let arc = 0; arc < 5; arc++) {
          const a1 = elapsed * 0.35 + arc * 1.25;
          const a2 = a1 + 1.8;
          const x1 = cx + Math.cos(a1) * globeRadius * 0.65;
          const y1 = cy + Math.sin(a1) * globeRadius * 0.42;
          const x2 = cx + Math.cos(a2) * globeRadius * 0.65;
          const y2 = cy + Math.sin(a2) * globeRadius * 0.42;
          const ctrlX = (x1 + x2) * 0.5;
          const ctrlY = Math.min(y1, y2) - h * 0.16;

          ctx.strokeStyle = arc % 2 === 0 ? 'rgba(255, 77, 21, 0.7)' : 'rgba(56, 189, 248, 0.65)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
          ctx.stroke();

          // Pulse node at destination
          ctx.fillStyle = '#FF4D15';
          ctx.beginPath();
          ctx.arc(x2, y2, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // =======================================================================
      // 3D VOLUMETRIC SHA-256 PARTICLE & HEX STREAM (Active Across All Scenes)
      // =======================================================================
      const fov = 420;
      const isLightScene = mode === 'securemind-studio';
      ctx.save();
      ctx.font = '600 11px "JetBrains Mono", monospace';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (isPlayingRef.current) {
          p.z -= p.speed;
          if (p.z <= 10) {
            p.z = 1000;
            p.x = (Math.random() - 0.5) * 2400;
            p.y = (Math.random() - 0.5) * 1400;
          }
        }

        const scale = fov / (fov + p.z);
        const sx = cx + p.x * scale;
        const sy = cy + p.y * scale;
        const alpha = Math.min(1, (1000 - p.z) / 700) * (isLightScene ? 0.45 : 0.72);

        if (sx >= 0 && sx <= w && sy >= 0 && sy <= h) {
          ctx.fillStyle =
            p.color === '#FF4D15'
              ? `rgba(255, 77, 21, ${alpha})`
              : isLightScene
              ? `rgba(13, 13, 16, ${alpha * 0.6})`
              : `rgba(255, 255, 255, ${alpha * 0.75})`;

          const dotRadius = Math.max(1.2, 3.2 * scale);
          ctx.beginPath();
          ctx.arc(sx, sy, dotRadius, 0, Math.PI * 2);
          ctx.fill();

          if (i % 7 === 0 && scale > 0.45) {
            ctx.fillText(p.hex, sx + 6, sy + 3);
          }
        }
      }
      ctx.restore();

      // Update SMPTE Cinema Timecode every 4 frames
      if (onFrameTick && frameCount % 4 === 0) {
        const totalSec = Math.floor(elapsed);
        const mins = String(Math.floor(totalSec / 60)).padStart(2, '0');
        const secs = String(totalSec % 60).padStart(2, '0');
        const frames = String(frameCount % 60).padStart(2, '0');
        onFrameTick(`01:${mins}:${secs}:${frames}`);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onFrameTick]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* High-DPI Backing Cinema Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Full-Bleed Live HTML5 Video Stream Element (Captured at 60fps from Cinema Canvas) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        aria-label="F.I.P Live Widescreen Cinema Stream"
        className="absolute inset-0 w-full h-full object-cover opacity-95"
      />
    </div>
  );
};
