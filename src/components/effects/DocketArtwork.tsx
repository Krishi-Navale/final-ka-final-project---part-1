import React from 'react';

export type DocketArtVariant = 'apk-trojan' | 'deepfake-call' | 'mule-slip' | 'chat-exif';

/**
 * Distinct bespoke animated SVG artwork per forensic docket card
 * ensuring every card in Evidence Dockets looks unique and dynamic.
 */
export const DocketArtwork: React.FC<{ variant: DocketArtVariant }> = ({ variant }) => {
  if (variant === 'apk-trojan') {
    return (
      <svg viewBox="0 0 280 120" className="w-full h-full" aria-label="Android APK Binary Intercept Visual">
        <defs>
          <linearGradient id="apkBeam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,77,21,0)" />
            <stop offset="50%" stopColor="#FF4D15" />
            <stop offset="100%" stopColor="rgba(255,77,21,0)" />
          </linearGradient>
        </defs>
        <rect x="28" y="16" width="224" height="88" rx="14" fill="#0B0B10" stroke="rgba(255,255,255,0.12)" />
        <circle cx="88" cy="60" r="28" fill="none" stroke="rgba(255,77,21,0.3)" strokeDasharray="4 4">
          <animateTransform attributeName="transform" type="rotate" from="0 88 60" to="360 88 60" dur="9s" repeatCount="indefinite" />
        </circle>
        <circle cx="88" cy="60" r="18" fill="none" stroke="#FF4D15" strokeWidth="1.5" strokeDasharray="16 8">
          <animateTransform attributeName="transform" type="rotate" from="360 88 60" to="0 88 60" dur="6s" repeatCount="indefinite" />
        </circle>
        <polygon points="88,46 100,53 100,67 88,74 76,67 76,53" fill="rgba(255,77,21,0.22)" stroke="#FFFFFF" strokeWidth="1.2" />
        {[34, 48, 62, 76].map((y, idx) => (
          <g key={y}>
            <rect x="134" y={y} width={76 - idx * 8} height="6" rx="3" fill="rgba(255,255,255,0.12)" />
            <rect x="134" y={y} width="26" height="6" rx="3" fill="#FF4D15">
              <animate attributeName="x" values="134;182;134" dur={`${2.4 + idx * 0.4}s`} repeatCount="indefinite" />
            </rect>
          </g>
        ))}
        <line x1="28" y1="22" x2="252" y2="22" stroke="url(#apkBeam)" strokeWidth="1.5">
          <animate attributeName="y1" values="20;98;20" dur="3.6s" repeatCount="indefinite" />
          <animate attributeName="y2" values="20;98;20" dur="3.6s" repeatCount="indefinite" />
        </line>
      </svg>
    );
  }

  if (variant === 'deepfake-call') {
    return (
      <svg viewBox="0 0 280 120" className="w-full h-full" aria-label="Synthetic Audio-Video Frame Mesh Visual">
        <defs>
          <radialGradient id="deepfakeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,77,21,0.45)" />
            <stop offset="100%" stopColor="rgba(255,77,21,0)" />
          </radialGradient>
        </defs>
        <circle cx="140" cy="60" r="52" fill="url(#deepfakeGlow)" />
        <path d="M 24 60 Q 70 20 140 60 T 256 60" fill="none" stroke="#FF4D15" strokeWidth="2">
          <animate
            attributeName="d"
            values="M 24 60 Q 70 18 140 60 T 256 60; M 24 60 Q 70 98 140 60 T 256 60; M 24 60 Q 70 18 140 60 T 256 60"
            dur="3.4s"
            repeatCount="indefinite"
          />
        </path>
        <path d="M 24 60 Q 70 95 140 60 T 256 60" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2">
          <animate
            attributeName="d"
            values="M 24 60 Q 70 92 140 60 T 256 60; M 24 60 Q 70 26 140 60 T 256 60; M 24 60 Q 70 92 140 60 T 256 60"
            dur="2.8s"
            repeatCount="indefinite"
          />
        </path>
        <ellipse cx="140" cy="60" rx="28" ry="28" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeDasharray="6 4">
          <animateTransform attributeName="transform" type="rotate" from="0 140 60" to="360 140 60" dur="10s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="140" cy="60" r="9" fill="#FF4D15">
          <animate attributeName="r" values="7;11;7" dur="2.2s" repeatCount="indefinite" />
        </circle>
      </svg>
    );
  }

  if (variant === 'mule-slip') {
    return (
      <svg viewBox="0 0 280 120" className="w-full h-full" aria-label="Banking Mule Ledger Transfer Graph Visual">
        <defs>
          <linearGradient id="prismFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF884D" />
            <stop offset="100%" stopColor="#9A2700" />
          </linearGradient>
        </defs>
        <path d="M 48 80 C 92 22, 188 22, 232 80" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeDasharray="5 5" />
        <path d="M 48 44 C 102 96, 178 96, 232 44" fill="none" stroke="rgba(255,77,21,0.5)" strokeWidth="1.5" />
        <circle r="4.5" fill="#FF4D15">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 48 80 C 92 22, 188 22, 232 80" />
        </circle>
        <circle r="3.5" fill="#FFFFFF">
          <animateMotion dur="2.6s" repeatCount="indefinite" path="M 232 44 C 178 96, 102 96, 48 44" />
        </circle>
        <rect x="34" y="52" width="24" height="24" rx="6" fill="#181820" stroke="#FFFFFF" strokeOpacity="0.4" />
        <rect x="124" y="42" width="32" height="36" rx="8" fill="url(#prismFace)" stroke="#FFFFFF" strokeOpacity="0.6" />
        <rect x="222" y="52" width="24" height="24" rx="6" fill="#181820" stroke="#FF4D15" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 280 120" className="w-full h-full" aria-label="EXIF Glass Shard Metadata Extraction Visual">
      <defs>
        <linearGradient id="glassCard" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.26)" />
          <stop offset="100%" stopColor="rgba(255,77,21,0.18)" />
        </linearGradient>
      </defs>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 -3; 0 4; 0 -3" dur="4.2s" repeatCount="indefinite" />
        <rect x="64" y="24" width="120" height="66" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" />
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 4; 0 -4; 0 4" dur="3.6s" repeatCount="indefinite" />
        <rect x="96" y="34" width="124" height="64" rx="10" fill="url(#glassCard)" stroke="#FF4D15" strokeWidth="1.2" />
        <line x1="112" y1="54" x2="196" y2="54" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.65" />
        <line x1="112" y1="68" x2="174" y2="68" stroke="#FF4D15" strokeWidth="1.5" />
      </g>
      <path d="M 30 28 L 42 28 M 30 28 L 30 40" stroke="#FF4D15" strokeWidth="1.8" />
      <path d="M 250 92 L 238 92 M 250 92 L 250 80" stroke="#FFFFFF" strokeWidth="1.8" />
    </svg>
  );
};

/**
 * Continuously morphing orbital infinity chain visualization
 * for the animated "See the chain. Trust the hash." section.
 */
export const ChainTrustKineticArtwork: React.FC = () => {
  return (
    <svg
      viewBox="0 0 560 320"
      className="w-full h-full drop-shadow-[0_28px_48px_rgba(13,13,16,0.18)]"
      aria-label="Continuous Cryptographic Hash Chain Orbit"
    >
      <defs>
        <linearGradient id="kineticChrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#D4D4D8" />
          <stop offset="72%" stopColor="#27272A" />
          <stop offset="100%" stopColor="#FAFAFA" />
        </linearGradient>
        <linearGradient id="kineticAmber" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#380E00" />
          <stop offset="48%" stopColor="#FF4D15" />
          <stop offset="85%" stopColor="#FFB47D" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <radialGradient id="amberNode" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFE1C6" />
          <stop offset="52%" stopColor="#FF4D15" />
          <stop offset="100%" stopColor="#2B0900" />
        </radialGradient>
      </defs>

      <ellipse
        cx="280"
        cy="160"
        rx="230"
        ry="96"
        fill="none"
        stroke="rgba(13,13,16,0.16)"
        strokeWidth="1.5"
        strokeDasharray="8 6"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="-12 280 160"
          to="348 280 160"
          dur="28s"
          repeatCount="indefinite"
        />
      </ellipse>

      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 -6; 0 6; 0 -6"
          dur="5.5s"
          repeatCount="indefinite"
        />
        <path
          d="M 65 225 C 135 55, 295 35, 360 168 C 408 265, 488 232, 512 122 C 460 198, 400 170, 362 92 C 308 -18, 145 18, 65 225 Z"
          fill="url(#kineticChrome)"
        />
        <path
          d="M 122 204 C 190 98, 292 98, 344 190 C 380 250, 444 238, 488 172 C 435 220, 386 196, 354 136 C 298 38, 194 54, 122 204 Z"
          fill="url(#kineticAmber)"
          opacity="0.92"
        />
      </g>

      <circle r="13" fill="url(#amberNode)">
        <animateMotion
          dur="6.5s"
          repeatCount="indefinite"
          path="M 55 160 A 225 94 0 1 1 505 160 A 225 94 0 1 1 55 160"
        />
      </circle>
      <circle r="8" fill="#0D0D10" stroke="#FFFFFF" strokeWidth="1.5">
        <animateMotion
          dur="4.8s"
          repeatCount="indefinite"
          path="M 505 160 A 225 94 0 1 0 55 160 A 225 94 0 1 0 505 160"
        />
      </circle>
    </svg>
  );
};
