import React, { useState } from 'react';
import { HardDrive, ShieldCheck, Lock, Cpu, CheckCircle2, Zap, AlertCircle, RefreshCw } from 'lucide-react';

export const HardwareVault3D: React.FC = () => {
  const [isWriteBlocked, setIsWriteBlocked] = useState(true);
  const [activePort, setActivePort] = useState<'USB3' | 'SATA' | 'NVMe'>('USB3');
  const [isSimulating, setIsSimulating] = useState(false);
  const [acqProgress, setAcqProgress] = useState(100);

  const handleSimulateAcquisition = () => {
    setIsSimulating(true);
    setAcqProgress(0);
    let curr = 0;
    const interval = setInterval(() => {
      curr += 20;
      if (curr >= 100) {
        setAcqProgress(100);
        setIsSimulating(false);
        clearInterval(interval);
      } else {
        setAcqProgress(curr);
      }
    }, 250);
  };

  return (
    <div className="w-full bg-white text-slate-900 rounded-[44px] p-6 sm:p-12 border border-slate-200 shadow-xl overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Information */}
        <div className="space-y-4 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-orange-50 text-[#FF5A1F] text-[11px] font-mono-code font-bold uppercase tracking-wider border border-orange-200">
              Hardware Custody Bridge
            </span>
            <span className="text-[11px] font-mono-code text-slate-500">ISO/IEC 27037 Standard</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 leading-tight">
            Physical Write-Blocker <br />
            & Hardware Vault Bridge
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Forensic labs utilize physical hardware write-blockers to prevent the operating system from writing even 1 single bit (such as access timestamps or thumbnail caches) back to the suspect storage media.
          </p>

          {/* Interactive controls */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsWriteBlocked(!isWriteBlocked)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono-code font-bold transition-all flex items-center gap-2 border ${
                isWriteBlocked
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                  : 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Write-Block Switch: {isWriteBlocked ? 'ENGAGED (READ-ONLY)' : 'DISENGAGED (UNSAFE)'}</span>
            </button>

            <button
              onClick={handleSimulateAcquisition}
              disabled={isSimulating}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono-code font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-[#FF5A1F]' : ''}`} />
              <span>{isSimulating ? `Cloning Bitstream ${acqProgress}%` : 'Test Raw Bitstream Clone (dd)'}</span>
            </button>
          </div>
        </div>

        {/* Right 3D Hardware Visualizer Box */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col items-center">
          
          <div 
            className="w-72 sm:w-88 rounded-3xl p-6 bg-slate-50 border-2 border-slate-200 shadow-lg relative transform transition-transform duration-300 hover:scale-[1.02]"
            style={{
              boxShadow: isWriteBlocked
                ? '0 20px 40px -15px rgba(16, 185, 129, 0.15)'
                : '0 20px 40px -15px rgba(244, 63, 94, 0.15)'
            }}
          >
            {/* Top LED Indicator Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500" />
                <span className="text-[11px] font-mono-code font-bold text-slate-800">TABLEAU-FIP T8U</span>
              </div>
              <span className={`text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded ${
                isWriteBlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {isWriteBlocked ? 'WORM LOCKED' : 'MUTABLE'}
              </span>
            </div>

            {/* Port Selectors */}
            <div className="my-5 grid grid-cols-3 gap-2">
              {(['USB3', 'SATA', 'NVMe'] as const).map((port) => (
                <button
                  key={port}
                  onClick={() => setActivePort(port)}
                  className={`py-2 px-2 rounded-xl text-center text-xs font-mono-code font-bold transition-all border ${
                    activePort === port
                      ? 'bg-white text-[#FF5A1F] border-[#FF5A1F] shadow-sm'
                      : 'bg-white/60 text-slate-500 border-slate-200 hover:text-slate-800'
                  }`}
                >
                  {port} PORT
                </button>
              ))}
            </div>

            {/* Acquisition Progress Stream */}
            <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200 font-mono-code text-[11px]">
              <div className="flex items-center justify-between text-slate-500">
                <span>Bitstream Format:</span>
                <span className="text-slate-900 font-bold">RAW .DD / E01 EXPERT</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Verification Hash:</span>
                <span className="text-emerald-700 font-bold">SHA-256 MATCH ✓</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Throughput:</span>
                <span className="text-slate-700">520 MB/s (Zero Byte Alteration)</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-gradient-to-r from-[#FF5A1F] to-emerald-500 h-full transition-all duration-200"
                  style={{ width: `${acqProgress}%` }}
                />
              </div>
            </div>

            {/* Bottom Hardware Cert */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono-code text-slate-500">
              <span>NIST CFTT Validated</span>
              <span className="text-emerald-700 font-bold">100% Zero-Write Proof</span>
            </div>
          </div>

          <div className="mt-3 text-[11px] font-mono-code text-slate-500 flex items-center gap-1.5 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive hardware write-blocker simulation</span>
          </div>

        </div>

      </div>
    </div>
  );
};
