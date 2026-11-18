import React from 'react';
import { PhoneCall } from 'lucide-react';
import { UserProfile } from '../types';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenReportDrawer: () => void;
  currentUser?: UserProfile;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenReportDrawer,
  currentUser,
}) => {
  const isSeniorInvestigator = currentUser?.role === 'senior_investigator';

  return (
    <footer className="bg-[#0B0B0E] border-t border-white/10 text-zinc-400 text-xs pt-16 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full">
        {/* Clean Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Contact / Compliance & Mentorship */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="text-[11px] font-mono-code uppercase tracking-wider text-zinc-500">
              F.I.P Platform Architecture
            </div>
            <p className="text-zinc-300 leading-relaxed max-w-sm text-xs">
              National cyber incident intake, AI cross-case syndicate correlation, and tamper-proof evidence custody infrastructure. Secures digital proof under Write-Once-Read-Many (WORM) rules with SHA-256 cryptographic hashes.
            </p>
            <div className="text-[11px] font-mono-code text-zinc-500">
              Section 65B Indian Evidence Act · RFC 3161 · NFSU Dharwad Field Study
            </div>
            <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-400">
              <span className="font-mono-code text-[#FF4D15] font-bold">Guide:</span>
              <span className="text-white font-semibold">Mr. Shantlingappa Deshmukh</span>
              <span className="text-zinc-600">·</span>
              <span className="font-mono-code text-[#FF4D15] font-bold">Team:</span>
              <span>Bibi Zohara, Balchandra, Afsheen S &amp; Krishi</span>
            </div>
            <div className="pt-0.5 flex items-center gap-2 text-[11px] text-zinc-400">
              <img
                src="/assets/aistudio/image_526c1ede.png"
                alt="Krishi"
                className="w-4 h-4 rounded-full object-cover object-top border border-[#FF4D15]/70"
              />
              <span>
                Platform Designed &amp; Engineered by{' '}
                <strong className="text-white font-semibold">Krishi</strong>
              </span>
            </div>
          </div>

          {/* Navigation Column (Synced 1:1 with Top Navbar) */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[11px] font-mono-code uppercase tracking-wider text-zinc-500">
              Platform Navigation
            </div>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#FF4D15] transition-colors cursor-pointer"
                >
                  Home (3D Noir Desk &amp; Overview)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('incidents')}
                  className="hover:text-[#FF4D15] transition-colors cursor-pointer"
                >
                  Crime Stories &amp; Custody Vault
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('learning')}
                  className="hover:text-[#FF4D15] transition-colors cursor-pointer"
                >
                  Suspense Stories &amp; URL Inspector
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-[#FF4D15] transition-colors cursor-pointer"
                >
                  About Us (Guide, Team &amp; NFSU Dharwad)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portals')}
                  className="hover:text-[#FF4D15] transition-colors cursor-pointer"
                >
                  Global Links (Top 7 India + 9 Global)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-[#FF4D15] transition-colors cursor-pointer"
                >
                  Citizen Dossier &amp; 65B Certificates
                </button>
              </li>
              {isSeniorInvestigator && (
                <li>
                  <button
                    onClick={() => onNavigate('investigator')}
                    className="text-[#FF4D15] font-semibold hover:underline transition-colors cursor-pointer"
                  >
                    Workstation · AI Syndicate Engine
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Emergency 1930 Card */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-[11px] font-mono-code uppercase tracking-wider text-zinc-500">
              National Financial Helpline
            </div>
            <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#FF4D15] flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Dial 1930 Free</span>
                </span>
                <span className="text-[10px] font-mono-code font-bold text-zinc-300">
                  2-Hour Golden Window
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Connects directly to nodal banking managers across 250+ institutions to halt stolen fund transit.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-semibold hover:text-[#FF4D15] transition-colors"
                >
                  cybercrime.gov.in ↗
                </a>
                <button
                  onClick={onOpenReportDrawer}
                  className="text-[#FF4D15] font-bold hover:underline cursor-pointer"
                >
                  Lock WORM Hash ↗
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Monumental Architectural Wordmark matching reference footer */}
        <div className="pt-8 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10">
          <div className="text-6xl sm:text-8xl font-black tracking-tighter text-white leading-none select-none">
            F.I.P<span className="text-[#FF4D15]">.</span>
          </div>
          <div className="text-left sm:text-right space-y-1 text-[11px] text-zinc-500">
            <div>
              © {new Date().getFullYear()} F.I.P — Forensic Investigation Platform · Interface Designed by{' '}
              <span className="text-zinc-300 font-semibold">Krishi</span>
            </div>
            <div className="font-mono-code text-zinc-400">
              SHA-256 IMMUTABILITY · AI SYNDICATE ENGINE · COURT ADMISSIBLE PROOF
            </div>
          </div>
        </div>

        {/* Extreme Bottom Highlighted Notice: Used for Testing Purpose */}
        <div className="pt-6 pb-2">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FF4D15]/20 via-amber-500/15 to-[#FF4D15]/20 border-2 border-[#FF4D15]/60 shadow-[0_0_30px_rgba(255,77,21,0.18)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <span className="w-3 h-3 rounded-full bg-[#FF4D15] animate-ping shrink-0 mt-1 sm:mt-0" />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#FF4D15] text-white text-[10px] font-mono-code font-black uppercase tracking-widest">
                    HIGHLIGHTED NOTICE
                  </span>
                  <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Used for Testing Purpose — Live Forensic Evaluation &amp; Demonstration Environment
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-200 leading-relaxed">
                  This hosted F.I.P. instance is actively configured and <strong className="text-amber-300 font-semibold">used for testing purpose</strong>, academic forensic demonstration, and real-time workflow verification (Zero-Identity Share a Problem Gateway, SHA-256 Evidence Locker, Citizen Crime Story PDF Verification, and Senior Investigator Workstation).
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
              <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-amber-400/50 text-amber-300 text-[10px] font-mono-code font-bold uppercase tracking-widest">
                TEST &amp; EVALUATION BUILD READY
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
