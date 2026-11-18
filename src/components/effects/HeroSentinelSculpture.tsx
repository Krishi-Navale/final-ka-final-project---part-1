import React, { useState, useRef } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

interface HeroSentinelSculptureProps {
  examinerName?: string;
  badge?: string;
  onActivate?: () => void;
  variant?: 'orbital-glass' | 'obsidian-sentinel';
}

export const HeroSentinelSculpture: React.FC<HeroSentinelSculptureProps> = ({
  examinerName = 'Dr. Bibi Zohara',
  badge = 'DEL-CY-0842',
  onActivate,
  variant = 'orbital-glass',
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [pulseActive, setPulseActive] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -ny * 12, y: nx * 14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleClick = () => {
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 900);
    onActivate?.();
  };

  if (variant === 'orbital-glass') {
    return (
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="relative w-full max-w-[440px] h-[340px] sm:h-[420px] mx-auto flex items-center justify-center cursor-pointer select-none"
        style={{ perspective: '1200px' }}
        title="Click to cycle verified F.I.P Examiner signature"
      >
        <div
          className={`relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out ${
            pulseActive ? 'scale-[1.03]' : ''
          }`}
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <svg
            viewBox="0 0 460 440"
            className="w-full h-full drop-shadow-[0_26px_44px_rgba(13,13,16,0.16)]"
            aria-label="FIP Chrome Glass and Burnt Amber Orbital Custody Core"
          >
            <defs>
              {/* Smoked Chrome Glass Outer Vessel */}
              <linearGradient id="glassShell" x1="15%" y1="5%" x2="85%" y2="95%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.96)" />
                <stop offset="28%" stopColor="rgba(235,235,240,0.52)" />
                <stop offset="65%" stopColor="rgba(160,164,174,0.28)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.85)" />
              </linearGradient>

              <linearGradient id="chromeRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#9CA3AF" />
                <stop offset="70%" stopColor="#27272A" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>

              {/* Volcanic Obsidian WORM Core Sphere */}
              <radialGradient id="obsidianCore" cx="38%" cy="32%" r="68%">
                <stop offset="0%" stopColor="#4B4B55" />
                <stop offset="36%" stopColor="#1D1D22" />
                <stop offset="78%" stopColor="#09090B" />
                <stop offset="100%" stopColor="#3B1406" />
              </radialGradient>

              {/* Molten Burnt Amber Metallic Orb */}
              <radialGradient id="amberOrb" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFD0A8" />
                <stop offset="22%" stopColor="#FF7528" />
                <stop offset="62%" stopColor="#C93702" />
                <stop offset="92%" stopColor="#461000" />
                <stop offset="100%" stopColor="#FF884D" />
              </radialGradient>

              {/* Copper Orbital Ring Gradient */}
              <linearGradient id="copperOrbit" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF7A45" />
                <stop offset="50%" stopColor="#52525B" />
                <stop offset="100%" stopColor="#FF4D15" />
              </linearGradient>

              <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(13,13,16,0.22)" />
                <stop offset="70%" stopColor="rgba(13,13,16,0.06)" />
                <stop offset="100%" stopColor="rgba(13,13,16,0)" />
              </radialGradient>
            </defs>

            {/* Studio Ground Contact Shadow */}
            <ellipse cx="220" cy="392" rx="115" ry="18" fill="url(#floorShadow)" />

            {/* Outer Frosted Chrome Glass Cradle */}
            <path
              d="M 185 38 C 265 24, 326 95, 298 182 C 276 250, 294 316, 224 358 C 142 396, 86 308, 114 218 C 138 140, 128 52, 185 38 Z"
              fill="url(#glassShell)"
              stroke="url(#chromeRim)"
              strokeWidth="2.5"
              transform="rotate(-14 220 210)"
            />

            {/* Back Wireframe Orbital Trajectory */}
            <ellipse
              cx="232"
              cy="220"
              rx="154"
              ry="72"
              fill="none"
              stroke="url(#copperOrbit)"
              strokeWidth="2"
              transform="rotate(-48 232 220)"
            />

            {/* Textured Obsidian Cryptographic Sphere */}
            <circle cx="195" cy="264" r="76" fill="url(#obsidianCore)" />
            {/* Subtle Surface Strata Lines on Obsidian Sphere */}
            <path
              d="M 134 252 Q 195 232 256 260"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.2"
            />
            <path
              d="M 128 278 Q 195 302 262 276"
              fill="none"
              stroke="rgba(255,77,21,0.28)"
              strokeWidth="1.4"
            />
            <path
              d="M 152 214 Q 204 268 182 332"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />

            {/* Glossy Specular Glass Lens Ring Over Sphere */}
            <ellipse
              cx="210"
              cy="176"
              rx="74"
              ry="130"
              fill="rgba(255,255,255,0.14)"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2"
              transform="rotate(-22 210 176)"
            />

            {/* Molten Translucent Burnt Amber Sphere (RFC-3161 Stamp Core) */}
            <circle cx="298" cy="194" r="46" fill="url(#amberOrb)" />
            {/* Crisp Specular Highlight on Amber Sphere */}
            <ellipse
              cx="282"
              cy="176"
              rx="14"
              ry="9"
              fill="rgba(255,255,255,0.72)"
              transform="rotate(-30 282 176)"
            />

            {/* Foreground Orbital Ring Slice + Micro Chrome Node */}
            <path
              d="M 124 316 C 175 372, 310 300, 344 185"
              fill="none"
              stroke="#FF4D15"
              strokeWidth="1.8"
            />
            <circle cx="310" cy="82" r="9" fill="url(#obsidianCore)" stroke="#FFFFFF" strokeWidth="1.2" />
            <circle cx="307" cy="79" r="2.5" fill="#FFFFFF" />
            <circle cx="230" cy="368" r="10" fill="url(#amberOrb)" />
            <circle cx="227" cy="365" r="2.5" fill="#FFFFFF" />
          </svg>

          {/* Crisp Verification Capsule Overlay */}
          <div
            className="absolute bottom-4 right-2 sm:right-4 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-black/10 flex items-center gap-2 text-[11px] font-mono-code text-[#0D0D10] shadow-md"
            style={{ transform: 'translateZ(26px)' }}
          >
            {examinerName.toLowerCase().includes('zohara') ? (
              <img
                src="/assets/aistudio/image_acc490cb.png"
                alt={examinerName}
                className="w-4 h-4 rounded-full object-cover object-top border border-[#FF4D15]"
              />
            ) : (
              <Lock className="w-3 h-3 text-[#FF4D15]" />
            )}
            <span className="font-semibold tracking-tight tabular-nums">{badge}</span>
            <span className="text-zinc-400">·</span>
            <span className="text-zinc-700 truncate max-w-[120px]">{examinerName}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF4D15]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="relative w-[270px] sm:w-[340px] lg:w-[380px] h-[340px] sm:h-[420px] lg:h-[460px] mx-auto flex items-center justify-center cursor-pointer select-none"
      style={{ perspective: '1100px' }}
    >
      <div
        className={`absolute inset-4 rounded-full transition-all duration-500 pointer-events-none ${
          pulseActive ? 'scale-110 opacity-100' : 'opacity-90'
        }`}
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(255, 77, 21, 0.85) 0%, rgba(255, 59, 0, 0.4) 42%, transparent 72%)',
          filter: 'blur(36px)',
        }}
      />
      <div
        className="relative w-full h-full flex flex-col items-center justify-end transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <svg viewBox="0 0 400 480" className="w-full h-full" aria-label="Obsidian Sentinel">
          <defs>
            <linearGradient id="obsidianDomeLegacy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B1B22" />
              <stop offset="45%" stopColor="#070709" />
              <stop offset="100%" stopColor="#180A05" />
            </linearGradient>
          </defs>
          <path
            d="M 102 185 C 102 82, 146 42, 200 42 C 254 42, 298 82, 298 185 C 298 240, 272 266, 200 266 C 128 266, 102 240, 102 185 Z"
            fill="url(#obsidianDomeLegacy)"
            stroke="#FF4D15"
            strokeWidth="4"
          />
        </svg>
      </div>
    </div>
  );
};

export const ForensicRibbonSculpture: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg
    viewBox="0 0 520 260"
    className={className}
    aria-label="FIP Chrome and Molten Amber Ribbon"
  >
    <defs>
      <linearGradient id="chromeBand" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="35%" stopColor="#D4D4D8" />
        <stop offset="70%" stopColor="#3F3F46" />
        <stop offset="100%" stopColor="#FAFAFA" />
      </linearGradient>
      <linearGradient id="amberFold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2A0A00" />
        <stop offset="42%" stopColor="#E64A0E" />
        <stop offset="75%" stopColor="#FF884D" />
        <stop offset="100%" stopColor="#FFFFFF" />
      </linearGradient>
      <radialGradient id="miniOrb" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFE1C6" />
        <stop offset="50%" stopColor="#FF5214" />
        <stop offset="100%" stopColor="#3A0C00" />
      </radialGradient>
    </defs>

    {/* Ambient Chrome Sweep */}
    <path
      d="M 40 205 C 120 45, 285 24, 345 148 C 392 246, 470 218, 495 110 C 445 182, 385 155, 348 76 C 296 -28, 128 10, 40 205 Z"
      fill="url(#chromeBand)"
    />
    {/* Inner Molten Amber Architectural Fold */}
    <path
      d="M 110 185 C 175 84, 275 82, 326 172 C 362 232, 424 222, 468 158 C 415 204, 368 182, 336 122 C 282 28, 178 44, 110 185 Z"
      fill="url(#amberFold)"
      opacity="0.92"
    />
    {/* Fine Kinetic Axis + Floating Proof Satellite */}
    <line x1="65" y1="218" x2="452" y2="54" stroke="rgba(13,13,16,0.22)" strokeWidth="1" />
    <circle cx="96" cy="148" r="12" fill="url(#miniOrb)" />
    <circle cx="92" cy="144" r="3" fill="#FFFFFF" />
  </svg>
);
