import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { MaskedLineReveal } from './effects/MaskedLineReveal';

interface Investigator {
  id: string;
  name: string;
  title: string;
  agency: string;
  jurisdiction: string;
  badge: string;
  casesVerified: number;
  avatarColor: string;
  avatarUrl?: string;
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
    avatarColor: 'from-[#FF4D15] to-orange-700',
    avatarUrl: '/assets/aistudio/image_acc490cb.png'
  },
  {
    id: 'inv-2',
    name: 'Balchandra K',
    title: 'Senior Evidence Verification Inspector',
    agency: 'Maharashtra Cyber Crime Directorate',
    jurisdiction: 'India',
    badge: 'MAH-CY-1109',
    casesVerified: 2180,
    avatarColor: 'from-[#FF4D15] to-red-800',
    avatarUrl: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg'
  },
  {
    id: 'inv-3',
    name: 'Afsheen S',
    title: 'Lead Malware Reverse Engineer',
    agency: 'INTERPOL Cyber Directorate',
    jurisdiction: 'Global / Lyon',
    badge: 'INT-CY-4902',
    casesVerified: 2890,
    avatarColor: 'from-zinc-700 to-zinc-900',
    avatarUrl: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg'
  },
  {
    id: 'inv-4',
    name: 'Krishi N',
    title: 'Chief Forensic Interdiction Officer',
    agency: 'National Cyber Crime Hub (I4C)',
    jurisdiction: 'India',
    badge: 'I4C-NAT-7721',
    casesVerified: 3640,
    avatarColor: 'from-[#FF4D15] to-amber-700',
    avatarUrl: '/assets/aistudio/image_526c1ede.png'
  }
];

export const InvestigatorCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <div className="w-full py-10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <div className="text-xs font-mono-code font-semibold tracking-wider uppercase text-[#FF4D15] mb-2">
          Verified Chain of Custody Guardians
        </div>
        <MaskedLineReveal>
          <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Senior Forensic Investigators on the Platform
          </h3>
        </MaskedLineReveal>
        <p className="mt-3 text-sm text-zinc-400 max-w-xl mx-auto">
          Every citizen hash is independently authenticated by accredited cyber forensic inspectors before submission to magistrate courts.
        </p>
      </div>

      {/* 3D Curved / Arched Perspective Showcase */}
      <div className="relative max-w-6xl mx-auto px-4 flex items-center justify-center gap-3 sm:gap-5 overflow-x-auto py-8 no-scrollbar">
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
                  ? 'w-56 sm:w-64 p-5 bg-[#16161C] text-white shadow-[0_20px_50px_rgba(255,77,21,0.22)] scale-105 border border-[#FF4D15]/60'
                  : 'w-44 sm:w-52 p-4 bg-[#111115] text-zinc-200 border border-white/10 hover:border-white/25'
              }`}
              style={{
                transform: `perspective(800px) rotateY(${offset * -8}deg) translateY(${absOffset * 8}px)`,
                opacity: absOffset > 3 ? 0.45 : 1
              }}
            >
              {/* Badge & Avatar Header */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${inv.avatarColor} p-0.5 shadow-md mb-3 flex items-center justify-center text-white relative`}
                >
                  {inv.avatarUrl ? (
                    <img
                      src={inv.avatarUrl}
                      alt={inv.name}
                      className="w-full h-full rounded-[14px] object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[14px] bg-[#070709]/40 backdrop-blur-sm flex items-center justify-center font-bold text-xl sm:text-2xl">
                      {inv.name.split(' ')[1] ? inv.name.split(' ')[1][0] : inv.name[0]}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#FF4D15] border-2 border-[#111115] flex items-center justify-center text-white">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>

                <div className={`text-[11px] font-mono-code font-semibold uppercase tracking-wider mb-0.5 ${isCenter ? 'text-[#FF4D15]' : 'text-zinc-400'}`}>
                  {inv.jurisdiction}
                </div>
                
                <h4 className="font-bold tracking-tight text-sm sm:text-base leading-snug line-clamp-1 text-white">
                  {inv.name}
                </h4>

                <div className="text-[11px] leading-tight mt-1 line-clamp-1 text-zinc-400">
                  {inv.title}
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 w-full text-center text-[10px] text-zinc-400">
                  <div className="font-mono-code font-semibold text-white">{inv.badge}</div>
                  <div className="mt-0.5">{inv.casesVerified.toLocaleString()} Cases Authenticated</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center gap-2 mt-4 text-xs text-zinc-500">
        <span>Click any investigator card to inspect jurisdiction &amp; credential</span>
      </div>
    </div>
  );
};
