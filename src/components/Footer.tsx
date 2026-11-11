import React from 'react';
import { ArrowUpRight, PhoneCall, ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenReportDrawer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenReportDrawer }) => {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 text-xs py-14 px-4 sm:px-8 lg:px-12 xl:px-16 font-sans">
      <div className="max-w-[1760px] 2xl:max-w-[1880px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          
          {/* Brand Info: "fip." */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-950 tracking-tight font-sans">
                fip<span className="text-[#FF5A1F]">.</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Forensic Investigation Platform
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm text-xs">
              National cyber incident intake and tamper-proof evidence custody infrastructure. Empowering citizens to secure digital proof under Write-Once-Read-Many (WORM) rules with SHA-256 cryptographic hashes.
            </p>
            <div className="text-[11px] font-mono-code text-slate-400">
              Compliant with Section 65B Indian Evidence Act · RFC 3161 · ISO/IEC 27037
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-bold uppercase tracking-wider text-slate-900 text-xs">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-slate-950 transition-colors">
                  Home Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('learning')} className="hover:text-slate-950 transition-colors">
                  Awareness Hub & URL Inspector
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-slate-950 transition-colors">
                  How It Works (SHA-256 Sandbox)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portals')} className="hover:text-slate-950 transition-colors">
                  Global Portals (Top 7 India + 9 Global)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('incidents')} className="hover:text-slate-950 transition-colors">
                  Custody Vault & 65B Certificate
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency 1930 Hotline */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-bold uppercase tracking-wider text-slate-900 text-xs">
              National Financial Helpline
            </div>
            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#FF5A1F] flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Dial 1930 Free</span>
                </span>
                <span className="text-[10px] font-mono-code font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                  2-Hour Golden Window
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Connects directly to nodal banking managers across 250+ banks to halt stolen fund transit.
              </p>
              <div className="pt-2 border-t border-orange-200/40 flex items-center justify-between text-[11px]">
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-slate-800 font-semibold hover:underline">
                  cybercrime.gov.in ↗
                </a>
                <button onClick={onOpenReportDrawer} className="text-[#FF5A1F] font-bold hover:underline">
                  Lock WORM Hash ↗
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Forensic Investigation Platform (FIP). All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 font-mono-code">
            <span>SHA-256 IMMUTABILITY</span>
            <span>·</span>
            <span>COURT ADMISSIBLE PROOF</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
