import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Search,
  Network,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Volume2,
  VolumeX,
  Film,
} from 'lucide-react';
import noirOffice4KUrl from '../../assets/images/noir_detective_office_4k_1794721651909.jpg';

const FORENSIC_BOARD_VIDEO_URL =
  '/assets/aistudio/3c4d501a5ec7fdae120e2822250a246b_720w_0cc98656.mp4';

interface DetectiveDeskScrollHeroProps {
  onOpenReportDrawer: () => void;
  onNavigate: (tab: string) => void;
  onScrollToTestbench: () => void;
}

interface DustMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

interface RainDrop {
  x: number;
  y: number;
  len: number;
  speed: number;
  alpha: number;
  thickness: number;
}

interface CityWindowLight {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  phase: number;
}

/**
 * Professional 4-Stage Cinema Scroll Hero:
 * Stage 1 (0.00 - 0.20): Wide 4K Noir Detective Office Establishing Shot + Headline.
 * Stage 2 (0.20 - 0.42): Camera Dives into Desk Section 01 (Open Forensic Papers, Magnifying Glass & Case Binders).
 * Stage 3 (0.42 - 0.58): Camera Dives Deeper into Desk Section 02 (The Corkboard Evidence Wall: "EVIDENCE #2" & "WHO?").
 * Stage 4 (0.58 - 1.00): Seamless Match-Cut Transition into the Live Forensic Evidence Board Cinema Video
 *                        (/assets/aistudio/3c4d501a5ec7fdae120e2822250a246b_720w_0cc98656.mp4),
 *                        followed immediately by the next section of the Home screen on further scroll.
 */
export const DetectiveDeskScrollHero: React.FC<DetectiveDeskScrollHeroProps> = ({
  onOpenReportDrawer,
  onNavigate,
  onScrollToTestbench,
}) => {
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const leftHeroTextRef = useRef<HTMLDivElement | null>(null);
  const deskSectorHudRef = useRef<HTMLDivElement | null>(null);
  const videoStageRef = useRef<HTMLDivElement | null>(null);
  const primaryVideoRef = useRef<HTMLVideoElement | null>(null);
  const ambientVideoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const [stagePhase, setStagePhase] = useState<
    'wide' | 'desk_papers' | 'desk_board' | 'cinema_video'
  >('wide');
  const [uvLampMode, setUvLampMode] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoFitMode, setVideoFitMode] = useState<'cinema' | 'cover'>('cover');
  const [videoTimeProgress, setVideoTimeProgress] = useState(0);
  const [videoCurrentSec, setVideoCurrentSec] = useState(0);
  const [videoDurationSec, setVideoDurationSec] = useState(34);

  // High-frequency refs for 60/120fps canvas loop
  const uvModeRef = useRef(false);
  const scrollProgressRef = useRef(0);
  const mouseOffsetRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const hasAutoTriggeredVideoRef = useRef(false);

  useEffect(() => {
    uvModeRef.current = uvLampMode;
  }, [uvLampMode]);

  // Frame-rate-independent scroll & 3D camera trajectory loop
  useEffect(() => {
    let animId: number;
    let currentProgress = 0;
    let targetProgress = 0;
    let lastTime = performance.now();

    const updateTargetScroll = () => {
      const track = scrollTrackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const totalScrollable = Math.max(1, track.offsetHeight - window.innerHeight);
      const scrolled = -rect.top;
      targetProgress = Math.min(1, Math.max(0, scrolled / totalScrollable));
    };

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      const ny = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
      mouseOffsetRef.current.targetX = nx;
      mouseOffsetRef.current.targetY = ny;
    };

    window.addEventListener('scroll', updateTargetScroll, { passive: true });
    window.addEventListener('resize', updateTargetScroll);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    updateTargetScroll();

    const smootherstep = (edge0: number, edge1: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - edge0) / Math.max(0.0001, edge1 - edge0)));
      return t * t * t * (t * (t * 6 - 15) + 10);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      // Exponential time-corrected damping
      const scrollLerp = 1 - Math.exp(-8.0 * dt);
      currentProgress += (targetProgress - currentProgress) * scrollLerp;
      if (Math.abs(targetProgress - currentProgress) < 0.0002) {
        currentProgress = targetProgress;
      }
      scrollProgressRef.current = currentProgress;

      const mouseLerp = 1 - Math.exp(-6.0 * dt);
      mouseOffsetRef.current.x +=
        (mouseOffsetRef.current.targetX - mouseOffsetRef.current.x) * mouseLerp;
      mouseOffsetRef.current.y +=
        (mouseOffsetRef.current.targetY - mouseOffsetRef.current.y) * mouseLerp;

      // Update discrete stage phase indicator
      if (currentProgress < 0.18) {
        setStagePhase((prev) => (prev !== 'wide' ? 'wide' : prev));
      } else if (currentProgress < 0.4) {
        setStagePhase((prev) => (prev !== 'desk_papers' ? 'desk_papers' : prev));
      } else if (currentProgress < 0.56) {
        setStagePhase((prev) => (prev !== 'desk_board' ? 'desk_board' : prev));
      } else {
        setStagePhase((prev) => (prev !== 'cinema_video' ? 'cinema_video' : prev));
      }

      // 1. Left Noir Headline smooth exit (`0.00 -> 0.22`)
      if (leftHeroTextRef.current) {
        const textExit = smootherstep(0.02, 0.22, currentProgress);
        const textAlpha = 1 - textExit;
        const shiftX = -textExit * 90;
        const shiftY = -textExit * 16;
        const scaleText = 1 - textExit * 0.05;
        leftHeroTextRef.current.style.opacity = textAlpha.toFixed(3);
        leftHeroTextRef.current.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0) scale(${scaleText.toFixed(3)})`;
        leftHeroTextRef.current.style.pointerEvents = textAlpha > 0.25 ? 'auto' : 'none';
      }

      // 2. Desk Deep-Dive Telemetry HUD (`0.18 -> 0.55`)
      if (deskSectorHudRef.current) {
        const hudEnter = smootherstep(0.16, 0.26, currentProgress);
        const hudExit = smootherstep(0.48, 0.57, currentProgress);
        const hudAlpha = Math.max(0, hudEnter - hudExit);
        const translateY = (1 - hudEnter) * 28 - hudExit * 24;
        deskSectorHudRef.current.style.opacity = hudAlpha.toFixed(3);
        deskSectorHudRef.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        deskSectorHudRef.current.style.pointerEvents = hudAlpha > 0.35 ? 'auto' : 'none';
      }

      // 3. Cinema Forensic Video Stage (`0.52 -> 0.64` match-cut entry)
      if (videoStageRef.current) {
        const videoAlpha = smootherstep(0.51, 0.62, currentProgress);
        const videoScale = 0.92 + videoAlpha * 0.08;
        videoStageRef.current.style.opacity = videoAlpha.toFixed(3);
        videoStageRef.current.style.transform = `scale(${videoScale.toFixed(4)})`;
        videoStageRef.current.style.pointerEvents = videoAlpha > 0.45 ? 'auto' : 'none';

        // Auto-start playback when the camera dives into the evidence board video zone
        const pVid = primaryVideoRef.current;
        const aVid = ambientVideoRef.current;
        if (videoAlpha > 0.25) {
          if (!hasAutoTriggeredVideoRef.current && pVid) {
            hasAutoTriggeredVideoRef.current = true;
            pVid.currentTime = 0;
            if (aVid) aVid.currentTime = 0;
            pVid.play().catch(() => {});
            aVid?.play().catch(() => {});
            setIsPlayingVideo(true);
          } else if (pVid && pVid.paused && isPlayingVideo) {
            pVid.play().catch(() => {});
            aVid?.play().catch(() => {});
          }
        } else if (videoAlpha <= 0.05) {
          hasAutoTriggeredVideoRef.current = false;
          if (pVid && !pVid.paused) {
            pVid.pause();
            aVid?.pause();
          }
        }
      }

      // 4. Scroll telemetry progress bar
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${(currentProgress * 100).toFixed(1)}%`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', updateTargetScroll);
      window.removeEventListener('resize', updateTargetScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlayingVideo]);

  // 60FPS Native Retina Canvas Renderer (Multi-Section Desk Dive: Wide Office -> Desk Papers & Magnifier -> Corkboard Evidence Wall)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const bgImg = new Image();
    bgImg.decoding = 'async';
    bgImg.src = noirOffice4KUrl;

    const motes: DustMote[] = Array.from({ length: 68 }, () => ({
      x: 0.46 + Math.random() * 0.48,
      y: 0.24 + Math.random() * 0.72,
      vx: (Math.random() - 0.5) * 0.0003,
      vy: -0.00018 - Math.random() * 0.00032,
      size: 1.0 + Math.random() * 2.0,
      alpha: 0.3 + Math.random() * 0.65,
    }));

    const rain: RainDrop[] = Array.from({ length: 78 }, () => ({
      x: Math.random() * 0.6,
      y: Math.random() * 0.64,
      len: 16 + Math.random() * 26,
      speed: 0.0065 + Math.random() * 0.008,
      alpha: 0.1 + Math.random() * 0.18,
      thickness: 0.8 + Math.random() * 0.9,
    }));

    const cityLights: CityWindowLight[] = Array.from({ length: 36 }, () => ({
      x: 0.07 + Math.random() * 0.48,
      y: 0.24 + Math.random() * 0.32,
      w: 0.0022 + Math.random() * 0.0028,
      h: 0.003 + Math.random() * 0.004,
      speed: 1.5 + Math.random() * 3.5,
      phase: Math.random() * Math.PI * 2,
    }));

    let animId: number;
    let t = 0;

    const smootherstep = (edge0: number, edge1: number, x: number) => {
      const k = Math.min(1, Math.max(0, (x - edge0) / Math.max(0.0001, edge1 - edge0)));
      return k * k * k * (k * (k * 6 - 15) + 10);
    };

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      t += 0.016;
      const w = canvas.width;
      const h = canvas.height;
      const isPortraitMobile = w / h < 0.95;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.fillStyle = '#050507';
      ctx.fillRect(0, 0, w, h);

      const p = scrollProgressRef.current;

      // Multi-stage camera trajectory through the desk sections:
      // Segment A (0.02 -> 0.36): Wide Room -> Dive onto Wooden Desk Papers & Magnifying Glass (nx: 0.68, ny: 0.82)
      // Segment B (0.36 -> 0.58): Desk Papers -> Glide & Zoom Deeper into Corkboard Evidence Wall (nx: 0.78, ny: 0.42)
      const segA = smootherstep(0.02, 0.36, p);
      const segB = smootherstep(0.35, 0.58, p);

      const baseScale = 1.0;
      const deskScale = isPortraitMobile ? 2.15 : 2.45;
      const boardScale = isPortraitMobile ? 3.05 : 3.45;
      const scale =
        baseScale +
        segA * (deskScale - baseScale) +
        segB * (boardScale - deskScale);

      const mx = mouseOffsetRef.current.x;
      const my = mouseOffsetRef.current.y;

      // Interpolate camera focal point from Desk Surface (0.68, 0.82) up into the Evidence Corkboard (0.78, 0.43)
      const deskFocusX = isPortraitMobile ? w * 0.62 : w * 0.685;
      const deskFocusY = isPortraitMobile ? h * 0.79 : h * 0.825;
      const boardFocusX = isPortraitMobile ? w * 0.72 : w * 0.785;
      const boardFocusY = isPortraitMobile ? h * 0.46 : h * 0.435;

      const focusX = deskFocusX + (boardFocusX - deskFocusX) * segB;
      const focusY = deskFocusY + (boardFocusY - deskFocusY) * segB;

      const panX =
        (isPortraitMobile ? -segA * w * 0.08 : -segA * w * 0.15) +
        mx * w * (0.012 * (1 - segA * 0.5));
      const panY =
        -segA * h * 0.08 +
        segB * h * 0.05 +
        my * h * (0.01 * (1 - segA * 0.5));

      ctx.save();
      ctx.translate(focusX + panX, focusY + panY);
      ctx.scale(scale, scale);
      ctx.translate(-focusX, -focusY);

      // 1. Draw the 4K Photorealistic Noir Detective Office
      let drawX = 0;
      let drawY = 0;
      let drawW = w;
      let drawH = h;

      if (bgImg.complete && bgImg.naturalWidth > 0) {
        const imgAspect = bgImg.naturalWidth / bgImg.naturalHeight;
        const canvasAspect = w / h;

        if (canvasAspect > imgAspect) {
          drawW = w;
          drawH = w / imgAspect;
          drawX = 0;
          drawY = (h - drawH) * 0.48;
        } else {
          drawH = h;
          drawW = h * imgAspect;
          drawX = (w - drawW) * (isPortraitMobile ? 0.62 : 0.52);
          drawY = 0;
        }

        ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
      }

      const ix = (nx: number) => drawX + nx * drawW;
      const iy = (ny: number) => drawY + ny * drawH;

      // 2. Distant Storm Cloud Sheet-Lightning & Twinkling Skyscraper Windows
      const lightningFlash =
        Math.pow(Math.max(0, Math.sin(t * 0.9) * Math.sin(t * 3.7)), 14) * 0.18;
      if (lightningFlash > 0.005) {
        const skyGlow = ctx.createRadialGradient(
          ix(0.32),
          iy(0.18),
          drawW * 0.02,
          ix(0.32),
          iy(0.22),
          drawW * 0.28
        );
        skyGlow.addColorStop(0, `rgba(210, 230, 255, ${lightningFlash})`);
        skyGlow.addColorStop(1, 'rgba(210, 230, 255, 0)');
        ctx.fillStyle = skyGlow;
        ctx.fillRect(ix(0.02), iy(0.02), drawW * 0.58, drawH * 0.55);
      }

      for (let i = 0; i < cityLights.length; i++) {
        const cl = cityLights[i];
        const pulse = 0.35 + 0.65 * Math.sin(t * cl.speed + cl.phase);
        if (pulse > 0.65) {
          ctx.fillStyle = `rgba(255, 232, 175, ${(pulse - 0.5) * 0.45})`;
          ctx.fillRect(ix(cl.x), iy(cl.y), cl.w * drawW, cl.h * drawH);
        }
      }

      // 3. Live 60FPS Rain Streaks on the Night City Window Glass
      ctx.save();
      ctx.beginPath();
      ctx.rect(ix(0.01), iy(0.01), drawW * 0.6, drawH * 0.62);
      ctx.clip();

      for (let i = 0; i < rain.length; i++) {
        const r = rain[i];
        r.y += r.speed;
        r.x -= r.speed * 0.16;
        if (r.y > 0.63) {
          r.y = -0.04;
          r.x = Math.random() * 0.6;
        }
        const rx = ix(r.x);
        const ry = iy(r.y);
        const grad = ctx.createLinearGradient(
          rx,
          ry,
          rx - r.len * 0.22,
          ry + r.len
        );
        grad.addColorStop(0, 'rgba(200, 225, 255, 0)');
        grad.addColorStop(0.5, `rgba(200, 225, 255, ${r.alpha})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = r.thickness;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - r.len * 0.22, ry + r.len);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Subtle Forensic Target Reticles on Desk Sections (Magnifier & Evidence #2 Corkboard)
      if (segA > 0.08) {
        const pulseRing = 0.55 + 0.45 * Math.sin(t * 3.6);
        // Desk Magnifying Lens & Open Case Report Reticle (nx: 0.69, ny: 0.835)
        const magX = ix(0.69);
        const magY = iy(0.835);
        const magAlpha = Math.max(0, segA * (1 - segB * 0.9));
        if (magAlpha > 0.02) {
          ctx.save();
          ctx.strokeStyle = `rgba(255, 190, 95, ${magAlpha * 0.65 * pulseRing})`;
          ctx.lineWidth = Math.max(1, drawW * 0.0012);
          ctx.beginPath();
          ctx.arc(magX, magY, drawW * 0.038, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Corkboard Evidence #2 & Suspect Photos Reticle (nx: 0.785, ny: 0.445)
        if (segB > 0.05) {
          const boardX = ix(0.785);
          const boardY = iy(0.445);
          ctx.save();
          ctx.strokeStyle = `rgba(229, 25, 42, ${segB * 0.75 * pulseRing})`;
          ctx.lineWidth = Math.max(1.2, drawW * 0.0014);
          ctx.strokeRect(
            boardX - drawW * 0.085,
            boardY - drawH * 0.11,
            drawW * 0.17,
            drawH * 0.22
          );
          ctx.restore();
        }
      }

      // 5. Volumetric Desk Lamp Light Cone & Glowing Bulb (`nx: 0.622, ny: 0.502`)
      const bulbX = ix(0.622);
      const bulbY = iy(0.502);
      const flicker =
        0.94 + Math.sin(t * 6.5) * 0.025 + Math.cos(t * 17.3) * 0.012;
      const isUv = uvModeRef.current;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const bulbGlow = ctx.createRadialGradient(
        bulbX,
        bulbY,
        drawW * 0.004,
        bulbX,
        bulbY,
        drawW * 0.12
      );
      if (isUv) {
        bulbGlow.addColorStop(0, `rgba(225, 200, 255, ${0.92 * flicker})`);
        bulbGlow.addColorStop(0.38, `rgba(139, 92, 246, ${0.48 * flicker})`);
        bulbGlow.addColorStop(1, 'rgba(139, 92, 246, 0)');
      } else {
        bulbGlow.addColorStop(0, `rgba(255, 250, 225, ${0.88 * flicker})`);
        bulbGlow.addColorStop(0.35, `rgba(255, 195, 100, ${0.38 * flicker})`);
        bulbGlow.addColorStop(1, 'rgba(255, 150, 40, 0)');
      }
      ctx.fillStyle = bulbGlow;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, drawW * 0.12, 0, Math.PI * 2);
      ctx.fill();

      // Volumetric Light Cone onto the Wooden Desk
      const coneTargetX = ix(0.685 + mx * 0.012);
      const coneTargetY = iy(0.84);
      const coneGrad = ctx.createRadialGradient(
        bulbX,
        bulbY,
        drawW * 0.01,
        coneTargetX,
        coneTargetY,
        drawW * 0.37
      );
      if (isUv) {
        coneGrad.addColorStop(0, `rgba(167, 139, 250, ${(0.32 + segA * 0.12) * flicker})`);
        coneGrad.addColorStop(0.55, `rgba(56, 189, 248, ${0.16 * flicker})`);
        coneGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        coneGrad.addColorStop(0, `rgba(255, 218, 148, ${(0.26 + segA * 0.12) * flicker})`);
        coneGrad.addColorStop(0.55, `rgba(255, 168, 75, ${0.14 * flicker})`);
        coneGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(bulbX - drawW * 0.024, bulbY);
      ctx.lineTo(bulbX + drawW * 0.034, bulbY - drawH * 0.015);
      ctx.lineTo(ix(0.96), iy(0.99));
      ctx.lineTo(ix(0.42), iy(0.99));
      ctx.closePath();
      ctx.fill();

      // 6. Floating Golden / UV Dust Motes inside the Lamp Beam
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.x += m.vx + Math.sin(t * 1.3 + i) * 0.0001;
        m.y += m.vy;
        if (m.y < 0.22 || m.x < 0.44 || m.x > 0.95) {
          m.x = 0.52 + Math.random() * 0.36;
          m.y = 0.88 + Math.random() * 0.09;
        }
        const moteX = ix(m.x);
        const moteY = iy(m.y);
        const twinkle = 0.45 + 0.55 * Math.sin(t * 3.2 + i * 1.7);
        ctx.fillStyle = isUv
          ? `rgba(196, 181, 253, ${m.alpha * twinkle})`
          : `rgba(255, 228, 168, ${m.alpha * twinkle})`;
        ctx.beginPath();
        ctx.arc(moteX, moteY, m.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. Rising Wispy Steam Curls from the Desk Coffee Mug (`nx: 0.848, ny: 0.775`)
      const mugX = ix(0.848);
      const mugY = iy(0.775);
      for (let s = 0; s < 4; s++) {
        const phase = (t * 0.32 + s * 0.25) % 1;
        const steamY = mugY - phase * (drawH * 0.15);
        const steamX =
          mugX + Math.sin(phase * Math.PI * 2.2 + t * 1.4 + s) * (drawW * 0.011);
        const steamAlpha = Math.sin(phase * Math.PI) * 0.18;
        const steamRadius = drawW * (0.016 + phase * 0.018);
        const steamGrad = ctx.createRadialGradient(
          steamX,
          steamY,
          1,
          steamX,
          steamY,
          steamRadius
        );
        steamGrad.addColorStop(0, `rgba(255, 250, 240, ${steamAlpha})`);
        steamGrad.addColorStop(1, 'rgba(255, 250, 240, 0)');
        ctx.fillStyle = steamGrad;
        ctx.beginPath();
        ctx.arc(steamX, steamY, steamRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 8. Red String Syndicate Pulse on the Evidence Corkboard (`WHO?` & `EVIDENCE #2`)
      const nodes = [
        { x: ix(0.708), y: iy(0.205) },
        { x: ix(0.785), y: iy(0.132) },
        { x: ix(0.888), y: iy(0.335) },
        { x: ix(0.932), y: iy(0.478) },
        { x: ix(0.738), y: iy(0.585) },
      ];
      for (let seg = 0; seg < nodes.length - 1; seg++) {
        const n1 = nodes[seg];
        const n2 = nodes[seg + 1];
        const pulsePos = (t * 0.48 + seg * 0.27) % 1;
        const px = n1.x + (n2.x - n1.x) * pulsePos;
        const py = n1.y + (n2.y - n1.y) * pulsePos;

        const pinGlow = ctx.createRadialGradient(
          px,
          py,
          0.5,
          px,
          py,
          drawW * 0.012
        );
        pinGlow.addColorStop(0, 'rgba(255, 60, 75, 0.9)');
        pinGlow.addColorStop(1, 'rgba(229, 25, 42, 0)');
        ctx.fillStyle = pinGlow;
        ctx.beginPath();
        ctx.arc(px, py, drawW * 0.012, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore(); // Restore from screen blend
      ctx.restore(); // Restore from camera zoom & pan matrix

      // Subtle nocturnal vignette on the left edge at wide view
      const wideFactor = Math.max(0, 1 - segA * 1.4);
      if (wideFactor > 0.01) {
        const leftVignette = ctx.createLinearGradient(
          0,
          0,
          w * (isPortraitMobile ? 0.95 : 0.46),
          0
        );
        leftVignette.addColorStop(0, `rgba(4, 5, 8, ${0.68 * wideFactor})`);
        leftVignette.addColorStop(0.65, `rgba(4, 5, 8, ${0.32 * wideFactor})`);
        leftVignette.addColorStop(1, 'rgba(4, 5, 8, 0)');
        ctx.fillStyle = leftVignette;
        ctx.fillRect(0, 0, w, h);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Smoothly scroll to a specific stage along the hero track
  const scrollToPhase = (targetRatio: number) => {
    const track = scrollTrackRef.current;
    if (!track) return;
    const trackTop = track.offsetTop;
    const totalScrollable = track.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: trackTop + totalScrollable * targetRatio,
      behavior: 'smooth',
    });
  };

  // Scroll past the hero track into the next section of the Home page
  const scrollToNextHomeSection = () => {
    const track = scrollTrackRef.current;
    if (!track) return;
    const nextTop = track.offsetTop + track.offsetHeight - 40;
    window.scrollTo({
      top: nextTop,
      behavior: 'smooth',
    });
  };

  const togglePlayPauseVideo = () => {
    const pVid = primaryVideoRef.current;
    const aVid = ambientVideoRef.current;
    if (!pVid) return;
    if (pVid.paused) {
      pVid.play().catch(() => {});
      aVid?.play().catch(() => {});
      setIsPlayingVideo(true);
    } else {
      pVid.pause();
      aVid?.pause();
      setIsPlayingVideo(false);
    }
  };

  const handleReplayVideo = () => {
    const pVid = primaryVideoRef.current;
    const aVid = ambientVideoRef.current;
    if (!pVid) return;
    pVid.currentTime = 0;
    if (aVid) aVid.currentTime = 0;
    pVid.play().catch(() => {});
    aVid?.play().catch(() => {});
    setIsPlayingVideo(true);
  };

  const toggleMuteVideo = () => {
    const pVid = primaryVideoRef.current;
    if (!pVid) return;
    pVid.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      ref={scrollTrackRef}
      className="relative w-full h-[380vh] sm:h-[420vh] bg-[#050507] select-none"
    >
      {/* STICKY CAMERA VIEWPORT — Fits 100% Laptop Ratio (100dvh - 56px) and Mobile Ratio */}
      <div className="sticky top-14 w-full h-[calc(100vh-56px)] supports-[height:100dvh]:h-[calc(100dvh-56px)] overflow-hidden bg-[#050507]">
        {/* ===================================================================
            NATIVE RETINA 4K CANVAS STAGE (Wide Office -> Desk Papers -> Corkboard Dive)
        =================================================================== */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />

        {/* Interactive Desk Lamp Head Click Target */}
        <button
          onClick={() => setUvLampMode((prev) => !prev)}
          className="hidden sm:block absolute left-[56%] top-[36%] w-24 h-24 rounded-full z-20 cursor-pointer group focus:outline-none"
          title="Click Desk Lamp to toggle UV Forensic Blacklight"
        >
          <span className="sr-only">Toggle Desk Lamp UV Light</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1 rounded bg-black/85 border border-white/20 text-[10px] font-mono-code text-amber-300 whitespace-nowrap absolute -top-7 left-1/2 -translate-x-1/2">
            {uvLampMode ? 'Switch to Tungsten Bulb' : 'Toggle UV Forensic Lamp'}
          </span>
        </button>

        {/* ===================================================================
            STAGE 01 OVERLAY: WIDE NOIR HEADLINE & CTA (0% - 22% Scroll)
        =================================================================== */}
        <div
          ref={leftHeroTextRef}
          className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-5 sm:px-10 lg:px-16 w-full max-w-2xl pb-10 sm:pb-0 will-change-transform"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 border border-white/15 text-[11px] font-mono-code text-amber-300 w-fit mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#E5192A] animate-pulse" />
            <span>F.I.P · FORENSIC INVESTIGATION PLATFORM</span>
          </div>

          <div className="space-y-1">
            <h1
              className="font-noir-display font-bold uppercase tracking-tight leading-[1.05] drop-shadow-[0_6px_28px_rgba(0,0,0,0.95)]"
              style={{ fontSize: 'clamp(2.35rem, 4.8vw, 4.35rem)' }}
            >
              <span className="block text-white">CRIME STORIES</span>
              <span className="block text-white">MURDER MYSTERIES.</span>
              <span className="block text-[#E5192A] mt-0.5">SUSPENSE STORIES</span>
            </h1>
          </div>

          <p className="font-noir-typewriter text-xs sm:text-sm text-zinc-200 leading-relaxed max-w-md mt-4 sm:mt-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            Dive into the darkest crime stories, murder mysteries, and suspense stories that keep you on the edge. Scroll down to dive across the investigator&apos;s desk and into the live forensic evidence board.
          </p>

          <div className="pt-5 sm:pt-6 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => scrollToPhase(0.32)}
              className="px-6 sm:px-7 py-3 sm:py-3.5 bg-[#E5192A] hover:bg-[#C81020] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2.5 shadow-[0_10px_30px_rgba(229,25,42,0.45)] transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Explore Stories</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToPhase(0.68)}
              className="px-4 sm:px-5 py-3 sm:py-3.5 bg-black/75 hover:bg-white hover:text-black text-zinc-200 border border-white/20 text-xs font-mono-code transition-colors cursor-pointer whitespace-nowrap shrink-0 backdrop-blur-md flex items-center gap-2"
            >
              <Film className="w-3.5 h-3.5 text-[#E5192A]" />
              <span>Watch Evidence Board</span>
            </button>
          </div>
        </div>

        {/* ===================================================================
            STAGES 02 & 03 OVERLAY: DEEP-DIVE INTO DESK SECTIONS HUD (20% - 55% Scroll)
            Clean, non-blocking cinema telemetry while camera glides across the
            Desk Magnifying Lens, Case Binders, and Corkboard Evidence Wall
        =================================================================== */}
        <div
          ref={deskSectorHudRef}
          style={{ opacity: 0, pointerEvents: 'none' }}
          className="absolute inset-x-0 bottom-12 z-20 px-4 sm:px-8 lg:px-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4 will-change-transform"
        >
          <div className="max-w-xl p-5 sm:p-6 rounded-2xl bg-[#09090D]/85 backdrop-blur-xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.9)] space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#E5192A] text-white text-[10px] font-mono-code font-bold uppercase tracking-wider">
                {stagePhase === 'desk_board'
                  ? 'DESK SECTOR 02 · EVIDENCE PINBOARD WALL'
                  : 'DESK SECTOR 01 · FORENSIC CASE BINDERS & LENS'}
              </span>
              <span className="text-[11px] font-mono-code text-amber-300 font-semibold">
                {stagePhase === 'desk_board'
                  ? 'ENTERING CORKBOARD REEL...'
                  : 'OPTICAL MAGNIFIER LOCK'}
              </span>
            </div>

            <h2 className="font-noir-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
              {stagePhase === 'desk_board'
                ? 'Evidence #2 · Suspect Pinboard & Red String Links'
                : 'On The Investigator’s Desk · Case Files & Magnifying Lens'}
            </h2>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {stagePhase === 'desk_board'
                ? 'Camera locking onto the detective’s corkboard wall ("EVIDENCE #2", "Suspect fit", "WHO?"). Keep scrolling to launch the live forensic evidence board cinema sequence.'
                : 'Inspecting the walnut desk worktop under the tungsten lamp—archival case binders, open newspaper clippings, and the optical magnifying glass.'}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2">
              <button
                onClick={() => scrollToPhase(0.68)}
                className="px-4 py-2 rounded-lg bg-[#E5192A] hover:bg-[#c81222] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Dive Into Evidence Video</span>
              </button>
              <button
                onClick={() => setUvLampMode((prev) => !prev)}
                className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono-code text-amber-300 transition-colors cursor-pointer"
              >
                {uvLampMode ? 'UV Light: ON' : 'Toggle UV Lamp'}
              </button>
            </div>
          </div>

          {/* Right Sector Coordinates Card */}
          <div className="hidden md:flex flex-col gap-2 p-4 rounded-2xl bg-[#09090D]/85 backdrop-blur-xl border border-white/15 font-mono-code text-[11px] text-zinc-300 min-w-[240px]">
            <div className="flex items-center justify-between text-amber-300 font-bold border-b border-white/10 pb-1.5">
              <span>CAMERA DOLLY TELEMETRY</span>
              <Eye className="w-3.5 h-3.5 text-[#E5192A]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">SECTOR 01:</span>
              <span className={stagePhase === 'desk_papers' ? 'text-white font-bold' : 'text-emerald-400'}>
                Desk Papers &amp; Lens ✓
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">SECTOR 02:</span>
              <span className={stagePhase === 'desk_board' ? 'text-[#E5192A] font-bold' : 'text-zinc-400'}>
                Evidence #2 Corkboard
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">NEXT STAGE:</span>
              <span className="text-amber-300">Live Forensic Video Reel ↓</span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            STAGE 04 OVERLAY: FULL-HERO BLEED F.I.P EVIDENCE REEL
            (/assets/aistudio/3c4d501a5ec7fdae120e2822250a246b_720w_0cc98656.mp4)
            Covers 100% of the Hero Section viewport edge-to-edge as the user dives into the desk
        =================================================================== */}
        <div
          ref={videoStageRef}
          style={{ opacity: 0, pointerEvents: 'none' }}
          className="absolute inset-0 z-30 bg-[#050507] overflow-hidden will-change-transform"
        >
          {/* Ambient Anamorphic Backdrop Layer */}
          <video
            ref={ambientVideoRef}
            src={FORENSIC_BOARD_VIDEO_URL}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60"
          />

          {/* Full-Hero Edge-to-Edge Primary F.I.P Evidence Reel */}
          <video
            ref={primaryVideoRef}
            src={FORENSIC_BOARD_VIDEO_URL}
            muted={isMuted}
            loop
            playsInline
            preload="auto"
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              const dur = v.duration || 34;
              setVideoCurrentSec(v.currentTime);
              setVideoDurationSec(dur);
              setVideoTimeProgress((v.currentTime / dur) * 100);
            }}
            className={`absolute inset-0 w-full h-full transition-all duration-500 ${
              videoFitMode === 'cover' ? 'object-cover' : 'object-contain'
            }`}
          />

          {/* Subtle Top & Bottom Cinema Gradient Vignette so HUD remains crisp without blocking the video */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(5,5,7,0.72) 0%, rgba(5,5,7,0.08) 22%, rgba(5,5,7,0.08) 72%, rgba(5,5,7,0.88) 100%)',
            }}
          />

          {/* Top Full-Width Cinema Telemetry Strip */}
          <div className="absolute top-4 left-4 right-4 sm:left-8 sm:right-8 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#E5192A]/50 text-white text-[10px] sm:text-xs font-mono-code font-bold uppercase tracking-wider shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5192A] animate-ping" />
              <span>F.I.P EVIDENCE REEL · FULL-HERO FORENSIC ARCHIVE</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono-code text-amber-300 font-bold tabular-nums">
                TIMECODE 00:{String(Math.floor(videoCurrentSec)).padStart(2, '0')} / 00:
                {String(Math.floor(videoDurationSec)).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Bottom Floating Full-Hero HUD & Playback Bar */}
          <div className="absolute bottom-12 inset-x-4 sm:inset-x-8 lg:inset-x-12 z-20 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            {/* Left Compact Overlay Caption */}
            <div className="max-w-lg p-4 sm:p-5 rounded-2xl bg-[#09090D]/80 backdrop-blur-xl border border-white/15 shadow-2xl space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono-code uppercase tracking-widest text-amber-300 font-bold">
                <span>STAGE 04 · INSIDE THE DETECTIVE&apos;S EVIDENCE BOARD</span>
              </div>
              <h2 className="font-noir-display text-xl sm:text-3xl font-bold uppercase tracking-tight text-white leading-tight">
                F.I.P Forensic Case Board &amp; Suspect Correlation Reel
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Full-screen forensic evidence reel examining the case report, anatomical post-mortem findings, and suspect red-string correlation. Scroll down to enter the platform modules.
              </p>
              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden pt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#E5192A] to-amber-400 transition-all duration-150"
                  style={{ width: `${Math.min(100, Math.max(0, videoTimeProgress))}%` }}
                />
              </div>
            </div>

            {/* Right Playback & Continue Controls */}
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#09090D]/85 backdrop-blur-xl border border-white/15 shadow-2xl">
              <button
                type="button"
                onClick={togglePlayPauseVideo}
                className="px-4 py-2.5 rounded-xl bg-[#E5192A] hover:bg-[#c81222] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isPlayingVideo ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReplayVideo}
                className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-200 text-xs font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Replay Evidence Reel"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>

              <button
                type="button"
                onClick={toggleMuteVideo}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-200 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4 text-amber-300" />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  setVideoFitMode((prev) => (prev === 'cover' ? 'cinema' : 'cover'))
                }
                className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-200 text-xs font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Toggle Full-Bleed Cover vs Fit Frame"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{videoFitMode === 'cover' ? 'Full Screen' : 'Fit Frame'}</span>
              </button>

              <button
                type="button"
                onClick={scrollToNextHomeSection}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-[#09090D] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
              >
                <span>Continue ↓</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================
            BOTTOM CINEMA TELEMETRY & 4-STAGE PROGRESS BAR
        =================================================================== */}
        <div className="absolute bottom-0 inset-x-0 z-40 h-10 bg-gradient-to-t from-black/95 via-black/75 to-transparent px-4 sm:px-8 flex items-center justify-between text-[10px] sm:text-[11px] font-mono-code text-zinc-300">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E5192A] animate-pulse" />
            <span className="uppercase tracking-wider font-semibold text-white">
              {stagePhase === 'wide' && '01 / 04 · WIDE DETECTIVE OFFICE'}
              {stagePhase === 'desk_papers' && '02 / 04 · DESK PAPERS & MAGNIFYING LENS'}
              {stagePhase === 'desk_board' && '03 / 04 · CORKBOARD EVIDENCE WALL'}
              {stagePhase === 'cinema_video' && '04 / 04 · LIVE EVIDENCE BOARD REEL'}
            </span>
          </div>

          {/* Center Scroll Progress Track */}
          <div className="hidden md:flex items-center gap-3 w-72">
            <span className="text-[9px] text-zinc-400 uppercase">Room</span>
            <div className="flex-1 h-1 bg-white/15 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-[#E5192A] rounded-full"
                style={{ width: '0%' }}
              />
            </div>
            <span className="text-[9px] text-amber-300 uppercase font-bold">Desk → Video</span>
          </div>

          <button
            onClick={() => {
              if (stagePhase === 'wide') scrollToPhase(0.32);
              else if (stagePhase === 'desk_papers') scrollToPhase(0.48);
              else if (stagePhase === 'desk_board') scrollToPhase(0.72);
              else scrollToNextHomeSection();
            }}
            className="flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors cursor-pointer font-semibold"
          >
            <span>
              {stagePhase === 'cinema_video' ? 'Next Home Section ↓' : 'Dive Deeper ↓'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>
    </div>
  );
};
