import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Hash, CheckCircle2, RefreshCw, FileText, Database } from 'lucide-react';

export const HeroDeviceMockup: React.FC<{ onOpenReport: () => void }> = ({ onOpenReport }) => {
  const [currentHashIndex, setCurrentHashIndex] = useState(0);
  const sampleHashes = [
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    '8f4b2a71d93021fe3a105bc93847291a27e01b3489ca0128491829bc019382aa',
    '3f78a2e1904b6c810427a19c5b2067e8890284b1a459bca40277884102839912'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHashIndex((prev) => (prev + 1) % sampleHashes.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px] select-none perspective-1000">
      {/* Radiant Glow Behind Device */}
      <div className="absolute -inset-10 aura-glow-warm pointer-events-none rounded-full opacity-80" />
      
      {/* 3D Phone Shell */}
      <div className="relative z-10 bg-[#070709] p-3 sm:p-4 rounded-[42px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_40px_rgba(255,77,21,0.22)] border-[5px] border-white/15 ring-1 ring-white/20 transition-transform duration-500 hover:scale-[1.02]">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111115] ring-1 ring-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D15] animate-pulse" />
        </div>

        {/* Device Screen Content */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-[#111115] via-[#070709] to-black text-white p-5 pt-10 min-h-[500px] flex flex-col justify-between border border-white/10">
          
          {/* Subtle Screen Ambient Mesh */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF4D15]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status & Shield */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                <Database className="w-3.5 h-3.5 text-[#FF4D15]" />
                WORM Ledger #RFC-3161
              </span>
              <span className="text-emerald-400 font-mono-code font-semibold">100% Immutable</span>
            </div>

            {/* Evidence Header Card */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Live Incident Payload</div>
                  <div className="text-sm font-bold text-white tracking-tight">CFC-2026-849102 · Phishing Evidence</div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Untampered snapshot sealed into Write-Once-Read-Many block. Cryptographic chain verified.
              </p>
            </div>

            {/* Cryptographic SHA-256 Box */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#111115] to-[#070709] border border-[#FF4D15]/30 shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-[#FF4D15] font-semibold mb-1.5">
                <span className="flex items-center gap-1 font-mono-code">
                  <Hash className="w-3 h-3 text-[#FF4D15]" />
                  SHA-256 Cryptographic Digest
                </span>
                <span className="text-[10px] text-zinc-400">256-bit</span>
              </div>
              <div className="font-mono-code text-[11px] text-zinc-200 break-all bg-black/50 p-2.5 rounded-xl border border-white/10 leading-relaxed">
                {sampleHashes[currentHashIndex]}
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/10 text-zinc-300">
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  WORM Tamper Rule
                </span>
                <span className="text-emerald-400 font-semibold">Write-Once Locked</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/10 text-zinc-300">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF4D15]" />
                  Senior Officer Audit
                </span>
                <span className="text-zinc-300 font-mono-code">CYBER-DEL-0842</span>
              </div>
            </div>
          </div>

          {/* Action Button inside mockup */}
          <div className="relative z-10 pt-4">
            <button
              onClick={onOpenReport}
              className="w-full py-3 px-4 rounded-xl bg-[#FF4D15] hover:bg-[#E03E0B] text-white font-semibold text-xs shadow-[0_0_24px_rgba(255,77,21,0.35)] flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Simulate Evidence Hash Lock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
