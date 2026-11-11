import React, { useState } from 'react';
import { Shield, CheckCircle2, Award } from 'lucide-react';

interface Investigator {
  id: string;
  name: string;
  title: string;
  agency: string;
  jurisdiction: string;
  badge: string;
  casesVerified: number;
  avatarColor: string;
}

const INVESTIGATORS: Investigator[] = [
  {
    id: 'inv-1',
    name: 'Bibi Zohara',
    title: 'Lead Cyber Forensic Examiner',
    agency: 'IFSO Special Cell, Delhi Police',
    jurisdiction: 'India',
    badge: 'DEL-CY-0842',
    casesVerified: 2420,
    avatarColor: 'from-orange-500 to-amber-600'
  },
  {
    id: 'inv-2',
    name: 'Balchandra K',
    title: 'Senior Evidence Verification Inspector',
    agency: 'Maharashtra Cyber Crime Directorate',
    jurisdiction: 'India',
    badge: 'MAH-CY-1109',
    casesVerified: 2180,
    avatarColor: 'from-rose-600 to-orange-700'
  },
  {
    id: 'inv-3',
    name: 'Afsheen S',
    title: 'Lead Malware Reverse Engineer',
    agency: 'INTERPOL Cyber Directorate',
    jurisdiction: 'Global / Lyon',
    badge: 'INT-CY-4902',
    casesVerified: 2890,
    avatarColor: 'from-purple-700 to-indigo-800'
  },
  {
    id: 'inv-4',
    name: 'Krishi N',
    title: 'Chief Forensic Interdiction Officer',
    agency: 'National Cyber Crime Hub (I4C)',
    jurisdiction: 'India',
    badge: 'I4C-NAT-7721',
    casesVerified: 3640,
    avatarColor: 'from-emerald-600 to-teal-800'
  }
];

export const InvestigatorCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(3);

  return (
    <div className="w-full py-12 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <div className="text-xs font-semibold tracking-wider uppercase text-rose-600 mb-2">
          Verified Chain of Custody Guardians
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Senior Forensic Investigators on the Platform
        </h3>
        <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
          Every citizen hash is independently authenticated by accredited cyber forensic inspectors before submission to magistrate courts.
        </p>
      </div>

      {/* 3D Curved / Arched Perspective Showcase */}
      <div className="relative max-w-6xl mx-auto px-4 flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-6 no-scrollbar">
        {INVESTIGATORS.map((inv, index) => {
          const offset = index - activeIndex;
          const isCenter = offset === 0;
          const absOffset = Math.abs(offset);
          
          return (
            <div
              key={inv.id}
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 cursor-pointer rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                isCenter
                  ? 'w-56 sm:w-64 p-5 bg-slate-900 text-white shadow-2xl scale-105 border border-rose-500/30 ring-2 ring-rose-500/20'
                  : 'w-40 sm:w-48 p-4 bg-white text-slate-800 shadow-sm border border-slate-200/80 hover:border-slate-300 hover:shadow-md'
              }`}
              style={{
                transform: `perspective(800px) rotateY(${offset * -8}deg) translateY(${absOffset * 8}px)`,
                opacity: absOffset > 3 ? 0.4 : 1
              }}
            >
              {/* Badge & Avatar Header */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${inv.avatarColor} p-0.5 shadow-md mb-3 flex items-center justify-center text-white relative`}
                >
                  <div className="w-full h-full rounded-[14px] bg-slate-950/20 backdrop-blur-sm flex items-center justify-center font-bold text-xl sm:text-2xl">
                    {inv.name.split(' ')[1] ? inv.name.split(' ')[1][0] : inv.name[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>

                <div className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${isCenter ? 'text-rose-400' : 'text-slate-500'}`}>
                  {inv.jurisdiction}
                </div>
                
                <h4 className={`font-bold tracking-tight text-sm sm:text-base leading-snug line-clamp-1 ${isCenter ? 'text-white' : 'text-slate-900'}`}>
                  {inv.name}
                </h4>

                <div className={`text-[11px] leading-tight mt-1 line-clamp-1 ${isCenter ? 'text-slate-300' : 'text-slate-500'}`}>
                  {inv.title}
                </div>

                <div className={`mt-3 pt-3 border-t w-full text-center text-[10px] ${isCenter ? 'border-white/10 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                  <div className="font-mono-code font-semibold">{inv.badge}</div>
                  <div className="mt-0.5">{inv.casesVerified.toLocaleString()} Cases Authenticated</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center gap-2 mt-4 text-xs text-slate-500">
        <span>Click any investigator card to inspect jurisdiction & credential</span>
      </div>
    </div>
  );
};
