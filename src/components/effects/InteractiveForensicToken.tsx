import React, { useState, useRef, useEffect } from 'react';
import { Shield, Lock, Hash, Sparkles, CheckCircle2, Award, Key, Cpu, Zap } from 'lucide-react';

interface InteractiveForensicTokenProps {
  activeExaminerName?: string;
  activeBadge?: string;
}

export const InteractiveForensicToken: React.FC<InteractiveForensicTokenProps> = ({
  activeExaminerName = 'Krishi N',
  activeBadge = 'I4C-NAT-7721'
}) => {
  const [rotation, setRotation] = useState({ x: -12, y: 18 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'SEAL' | 'HASH' | 'KEY' | 'AFFIDAVIT'>('SEAL');
  const [isSealed, setIsSealed] = useState(true);
  const [sealPulse, setSealPulse] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialRotationRef = useRef({ x: -12, y: 18 });
  const lastPosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialRotationRef.current = { ...rotation };
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    setRotation({
      x: Math.max(-45, Math.min(45, initialRotationRef.current.x - dy * 0.45)),
      y: initialRotationRef.current.y + dx * 0.45
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    initialRotationRef.current = { ...rotation };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;

    setRotation({
      x: Math.max(-45, Math.min(45, initialRotationRef.current.x - dy * 0.45)),
      y: initialRotationRef.current.y + dx * 0.45
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Gentle idle float
  useEffect(() => {
    if (isDragging) return;
    let animId: number;
    let time = 0;

    const autoFloat = () => {
      time += 0.02;
      setRotation(prev => ({
        x: prev.x * 0.96 + Math.sin(time) * 3 * 0.04,
        y: prev.y + 0.1
      }));
      animId = requestAnimationFrame(autoFloat);
    };

    animId = requestAnimationFrame(autoFloat);
    return () => cancelAnimationFrame(animId);
  }, [isDragging]);

  const handleTriggerSealBurst = () => {
    setSealPulse(true);
    setTimeout(() => setSealPulse(false), 1200);
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      
      {/* Layer Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs mb-4 text-[11px] font-mono-code font-bold">
        {(['SEAL', 'HASH', 'KEY', 'AFFIDAVIT'] as const).map((layer) => (
          <button
            key={layer}
            onClick={() => setActiveLayer(layer)}
            className={`px-3 py-1 rounded-xl transition-all ${
              activeLayer === layer
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* 3D Holographic Vault Medallion Container */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative cursor-grab active:cursor-grabbing p-4 flex flex-col items-center justify-center perspective-1000"
        style={{ touchAction: 'none' }}
        data-cursor="3D ROTATE"
      >
        {/* Holographic Concentric Ambient Rings */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FF5A1F]/20 pointer-events-none animate-spin-slow" />
        <div className="absolute -inset-4 rounded-full border border-slate-200 pointer-events-none" />

        {/* 3D Rotating Custody Token */}
        <div
          className={`relative w-64 h-64 sm:w-76 sm:h-76 rounded-full p-2.5 transition-transform duration-75 transform-style-3d ${
            sealPulse ? 'ring-8 ring-emerald-400/40 scale-105' : ''
          }`}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            background: 'radial-gradient(circle at 30% 30%, #FFF3EC 0%, #FFDEC9 45%, #FF814A 80%, #B4380B 100%)',
            boxShadow: '0 25px 50px -12px rgba(255, 90, 31, 0.35), 0 0 25px rgba(255, 140, 50, 0.2)',
          }}
        >
          {/* Outer Glass Ring */}
          <div className="absolute -inset-2.5 rounded-full border-4 border-white/60 pointer-events-none transform-style-3d" style={{ transform: 'translateZ(16px)' }} />

          {/* Inner Token Core (Crisp Government White/Slate styling!) */}
          <div 
            className="w-full h-full rounded-full bg-white p-5 flex flex-col items-center justify-between text-center relative overflow-hidden border-2 border-slate-200 shadow-inner"
            style={{ transform: 'translateZ(24px)' }}
          >
            {/* Ambient inner gradient */}
            <div className="absolute -top-10 -left-10 w-28 h-28 bg-orange-100/60 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-amber-100/60 rounded-full blur-xl pointer-events-none" />

            {/* Top Indicator */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono-code font-bold text-[#FF5A1F] pt-1">
              <Lock className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>WORM CUSTODY TOKEN</span>
            </div>

            {/* Center Dynamic Content Based on Layer */}
            <div className="space-y-1 my-auto">
              {activeLayer === 'SEAL' && (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF5A1F] to-amber-500 mx-auto flex items-center justify-center text-white shadow-md">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div className="text-slate-950 font-black text-sm sm:text-base tracking-tight leading-tight mt-1">
                    Section 65B Seal
                  </div>
                  <div className="text-[10px] font-mono-code text-slate-500 font-bold">
                    Officer: {activeExaminerName}
                  </div>
                </>
              )}

              {activeLayer === 'HASH' && (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-300 mx-auto flex items-center justify-center shadow-md font-mono-code font-black text-lg">
                    #256
                  </div>
                  <div className="text-slate-950 font-black text-sm tracking-tight mt-1">
                    SHA-256 Digest
                  </div>
                  <div className="text-[9px] font-mono-code text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    Zero Byte Alteration ✓
                  </div>
                </>
              )}

              {activeLayer === 'KEY' && (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 mx-auto flex items-center justify-center shadow-md">
                    <Key className="w-7 h-7" />
                  </div>
                  <div className="text-slate-950 font-black text-sm tracking-tight mt-1">
                    ECDSA Key Pair
                  </div>
                  <div className="text-[9px] font-mono-code text-slate-500 font-bold">
                    Badge: {activeBadge}
                  </div>
                </>
              )}

              {activeLayer === 'AFFIDAVIT' && (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center shadow-md">
                    <Award className="w-7 h-7" />
                  </div>
                  <div className="text-slate-950 font-black text-sm tracking-tight mt-1">
                    Court Admissible
                  </div>
                  <div className="text-[9px] font-mono-code text-slate-500 font-bold">
                    ISO/IEC 27037 Attested
                  </div>
                </>
              )}
            </div>

            {/* Bottom Hash Watermark Bar */}
            <div className="w-full bg-slate-100 py-1 px-2.5 rounded-lg border border-slate-200 text-[9px] font-mono-code text-slate-700 truncate font-semibold">
              SHA: e3b0c44298fc1c149af...
            </div>
          </div>

          {/* Floating Badges */}
          <div
            className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-extrabold shadow-lg pointer-events-none border border-slate-700"
            style={{ transform: 'translateZ(38px)' }}
          >
            100% Immutable ✨
          </div>

          <div
            className="absolute -bottom-2 -left-2 px-3 py-1 rounded-full bg-white text-[#FF5A1F] text-[10px] font-mono-code font-bold shadow-lg border border-orange-200 pointer-events-none"
            style={{ transform: 'translateZ(34px)' }}
          >
            TOUCH & DRAG 3D 🔄
          </div>
        </div>

      </div>

      {/* Interactive Stamp Trigger Button */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleTriggerSealBurst}
          className="px-4 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-mono-code font-bold text-slate-700 shadow-2xs transition-colors flex items-center gap-1.5 active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 text-[#FF5A1F]" />
          <span>Test Verification Seal Pulse</span>
        </button>
      </div>

    </div>
  );
};
