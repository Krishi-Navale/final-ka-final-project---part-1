import React, { useState, useRef, useEffect } from 'react';
import { Shield, Lock, Hash, Sparkles } from 'lucide-react';

export const TouchDragRotation: React.FC = () => {
  const [rotation, setRotation] = useState({ x: -10, y: 15 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialRotationRef = useRef({ x: -10, y: 15 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mouse drag handlers
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
    
    velocityRef.current = {
      x: e.clientX - lastPosRef.current.x,
      y: e.clientY - lastPosRef.current.y
    };
    lastPosRef.current = { x: e.clientX, y: e.clientY };

    setRotation({
      x: Math.max(-50, Math.min(50, initialRotationRef.current.x - dy * 0.45)),
      y: initialRotationRef.current.y + dx * 0.45
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    initialRotationRef.current = { ...rotation };
    lastPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;

    velocityRef.current = {
      x: touch.clientX - lastPosRef.current.x,
      y: touch.clientY - lastPosRef.current.y
    };
    lastPosRef.current = { x: touch.clientX, y: touch.clientY };

    setRotation({
      x: Math.max(-50, Math.min(50, initialRotationRef.current.x - dy * 0.45)),
      y: initialRotationRef.current.y + dx * 0.45
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Idle gentle float when not dragging
  useEffect(() => {
    if (isDragging) return;
    let animId: number;
    let time = 0;

    const autoFloat = () => {
      time += 0.02;
      setRotation(prev => ({
        x: prev.x * 0.96 + Math.sin(time) * 4 * 0.04,
        y: prev.y + 0.12
      }));
      animId = requestAnimationFrame(autoFloat);
    };

    animId = requestAnimationFrame(autoFloat);
    return () => cancelAnimationFrame(animId);
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative select-none cursor-grab active:cursor-grabbing p-6 sm:p-10 flex flex-col items-center justify-center perspective-1000"
      style={{ touchAction: 'none' }}
      data-cursor="DRAG 3D"
    >
      {/* 3D Rotating Custody Seal */}
      <div
        className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-3 transition-transform duration-75 transform-style-3d"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          background: 'radial-gradient(circle at 35% 35%, #FF814A 0%, #FF5A1F 45%, #B4380B 85%, #1E120A 100%)',
          boxShadow: '0 30px 60px -15px rgba(255, 90, 31, 0.45), 0 0 35px rgba(255, 140, 50, 0.3)',
        }}
      >
        {/* Outer 3D Torus Ring with Metallic Finish */}
        <div className="absolute -inset-4 rounded-full border-[6px] border-white/30 pointer-events-none transform-style-3d" style={{ transform: 'translateZ(18px)' }} />
        
        {/* Inner Seal Face */}
        <div 
          className="w-full h-full rounded-full bg-slate-950 p-6 flex flex-col items-center justify-between text-center relative overflow-hidden border-4 border-amber-300/40 shadow-inner"
          style={{ transform: 'translateZ(24px)' }}
        >
          {/* Subtle glow mesh inside */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-orange-500/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Status */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono-code font-bold text-amber-300">
            <Lock className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>WORM CUSTODY TOKEN</span>
          </div>

          {/* Center Emblem & Text */}
          <div className="space-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF5A1F] to-amber-400 mx-auto flex items-center justify-center text-white shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <div className="text-white font-extrabold text-sm sm:text-base tracking-tight leading-tight mt-1">
              Section 65B Certified
            </div>
            <div className="text-[10px] text-slate-400 font-mono-code">
              NIST FIPS 180-4 · RFC 3161
            </div>
          </div>

          {/* Bottom Hash Watermark */}
          <div className="w-full bg-black/60 py-1.5 px-3 rounded-lg border border-white/10 text-[9px] font-mono-code text-emerald-400 truncate">
            SHA256: 8f4b2a71d93021fe3a105...
          </div>
        </div>

        {/* Orbiting Funky Pill Badges in 3D */}
        <div
          className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-white text-slate-950 text-[10px] font-extrabold shadow-xl border border-slate-200 pointer-events-none"
          style={{ transform: 'translateZ(42px)' }}
        >
          100% Immutable ✨
        </div>

        <div
          className="absolute -bottom-2 -left-3 px-3 py-1 rounded-full bg-[#1E293B] text-amber-200 text-[10px] font-mono-code font-bold shadow-xl border border-white/20 pointer-events-none"
          style={{ transform: 'translateZ(38px)' }}
        >
          DRAG TO ROTATE 🔄
        </div>
      </div>

      <div className="mt-4 text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
        <span>Click & drag or swipe to inspect 3D cryptographic token</span>
      </div>
    </div>
  );
};
