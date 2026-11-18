import React, { useState, useEffect } from 'react';
import { computeSHA256 } from '../utils/crypto';
import {
  Hash,
  ShieldCheck,
  Scale,
  AlertOctagon,
  CheckCircle2,
  FileText,
  Database,
  Copy,
  Cpu,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { StaggeredGrid } from './effects/StaggeredGrid';
import { ScrollExpandBlock } from './effects/ScrollExpandBlock';
import { PageStudioHeader } from './effects/PageStudioHeader';
import { KineticMarquee } from './effects/KineticMarquee';
import { MagneticButton } from './effects/MagneticButton';

interface TeamMemberProfile {
  step: string;
  id: string;
  name: string;
  role: string;
  badge: string;
  clearance: string;
  headlineQuestion: string;
  bio: string;
  quote: string;
  align: 'left' | 'right';
  terminalPath: string;
  metrics: { label: string; value: string }[];
  interactiveRows: {
    id: string;
    label: string;
    sublabel: string;
    detail: string;
    iconType: 'shield' | 'cpu' | 'scale';
  }[];
  techStack: string[];
  avatarUrl?: string;
}

const FIP_TEAM_MEMBERS: TeamMemberProfile[] = [
  {
    step: 'MEMBER 01',
    id: 'bibi-zohara',
    name: 'Bibi Zohara',
    role: 'Lead Forensic Architect & Cryptographic Custody Lead',
    badge: 'FIP-ARCH-0842',
    clearance: 'LEVEL-5 WORM CUSTODY',
    headlineQuestion: 'Cryptographic SHA-256 & WORM Vault Engine',
    bio: 'Spearheaded the client-side WebCrypto SHA-256 hashing pipeline, Write-Once-Read-Many (WORM) evidence locker, and bit-level tamper detection engine ensuring every citizen artifact remains mathematically unalterable from intake to trial.',
    quote: 'Every single byte of citizen evidence deserves mathematical certainty before a magistrate.',
    align: 'left',
    terminalPath: 'fip://core-team/01-bibi-zohara.worm',
    avatarUrl: '/assets/aistudio/image_acc490cb.png',
    metrics: [
      { label: 'Hash Precision', value: '256-Bit NIST' },
      { label: 'Tamper Immunity', value: '100% WORM' },
      { label: 'Modules Built', value: '14 Core Units' },
    ],
    interactiveRows: [
      {
        id: 'row-1',
        label: 'SHA-256 Bitstream Intake',
        sublabel: 'Client-side zero-mutation hashing',
        detail: 'Engineered instant browser-native SHA-256 digest computation and avalanche verification before cloud transmission.',
        iconType: 'shield',
      },
      {
        id: 'row-2',
        label: 'WORM Evidence Repository',
        sublabel: 'RFC-3161 immutable timestamping',
        detail: 'Designed append-only citizen evidence folders that prevent even privileged administrators from overwriting raw files.',
        iconType: 'cpu',
      },
      {
        id: 'row-3',
        label: 'Hash Key Comparison Gate',
        sublabel: 'Dual-ledger cryptographic audit',
        detail: 'Built the mandatory Works Dashboard vs. Vault Ledger hash verification protocol for Senior Investigators.',
        iconType: 'scale',
      },
    ],
    techStack: ['SHA-256 WebCrypto', 'RFC-3161 WORM', 'React / TypeScript', 'Tamper Audit'],
  },
  {
    step: 'MEMBER 02',
    id: 'balchandra',
    name: 'Balchandra',
    role: '1930 Nodal Interdiction & Financial Forensics Lead',
    badge: 'FIP-NODAL-1109',
    clearance: 'LEVEL-5 FINANCIAL TRACE',
    headlineQuestion: 'Golden-Hour Banking Lien & Mule Freeze Grid',
    bio: 'Architected the Golden-Hour 1930 financial interdiction workflows, suspect UPI/UTR extraction pipelines, and sovereign cyber portal routing grid connecting citizens and investigators to national banking switches.',
    quote: 'Intercepting fraudulent transit within the Golden Hour is the difference between loss and recovery.',
    align: 'right',
    terminalPath: 'fip://core-team/02-balchandra.nodal',
    avatarUrl: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg',
    metrics: [
      { label: 'Golden Window', value: '< 120 Mins' },
      { label: 'Sovereign Nodes', value: '16 Global + India' },
      { label: 'UTR Extraction', value: 'Real-Time OCR' },
    ],
    interactiveRows: [
      {
        id: 'row-1',
        label: '1930 Golden-Hour Triage',
        sublabel: 'Rapid UPI & NEFT mule account freeze',
        detail: 'Constructed emergency financial fraud intake pipelines that prioritize bank UTR numbers and suspect beneficiary accounts.',
        iconType: 'shield',
      },
      {
        id: 'row-2',
        label: 'Global Links Sovereign Grid',
        sublabel: 'Top 7 India + 9 Global cyber bureaus',
        detail: 'Curated cryptographically verified routing to MHA I4C, CERT-In, RBI Sachet, IC3, Europol, and Interpol nodes.',
        iconType: 'cpu',
      },
      {
        id: 'row-3',
        label: 'Two-Way Investigator Dispatch',
        sublabel: 'Real-time citizen custody alerts',
        detail: 'Implemented live SSE notification dispatches between investigating officers and citizen dossier holders.',
        iconType: 'scale',
      },
    ],
    techStack: ['1930 Lien Protocol', 'UTR / UPI Trace', 'SSE Real-Time', 'Sovereign APIs'],
  },
  {
    step: 'MEMBER 03',
    id: 'afsheen-s',
    name: 'Afsheen S',
    role: 'Principal Digital Forensics & Section 65B Specialist',
    badge: 'FIP-SEC65B-4402',
    clearance: 'LEVEL-5 JUDICIAL SEAL',
    headlineQuestion: 'Photo ELA Forensics & Section 65B Certification',
    bio: 'Designed the Photo Forensic Investigation Lab with Error Level Analysis (ELA), EXIF sensor metadata verification, OCR payload extraction, and automated Section 65B Judicial Admissibility Certificate generation.',
    quote: 'Digital proof is only as strong as its statutory admissibility in a court of law.',
    align: 'left',
    terminalPath: 'fip://core-team/03-afsheen-s.sec65b',
    avatarUrl: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg',
    metrics: [
      { label: 'ELA Precision', value: '99.4% Auth' },
      { label: 'Statutory Standard', value: 'Sec 65B(4) IEA' },
      { label: 'Artifact Formats', value: 'IMG · PDF · APK' },
    ],
    interactiveRows: [
      {
        id: 'row-1',
        label: 'Section 65B Affidavit Engine',
        sublabel: 'Court-ready cryptographic certificates',
        detail: 'Automated statutory electronic evidence certificates binding SHA-256 Merkle roots to examiner digital signatures.',
        iconType: 'scale',
      },
      {
        id: 'row-2',
        label: 'Photo ELA & Deepfake Scanner',
        sublabel: 'Pixel compression & forged warrant audit',
        detail: 'Built the interactive Photo Forensic Lab to expose doctored WhatsApp arrest warrants and spoofed payment receipts.',
        iconType: 'cpu',
      },
      {
        id: 'row-3',
        label: 'Native Evidence Gallery',
        sublabel: 'Zero-recompression artifact viewer',
        detail: 'Preserves original bitstreams for images, audio spectrograms, and decompiled APK manifests without byte alteration.',
        iconType: 'shield',
      },
    ],
    techStack: ['Section 65B Engine', 'Photo ELA Lab', 'EXIF / OCR Audit', 'Merkle Trees'],
  },
  {
    step: 'MEMBER 04 · LEAD PLATFORM DESIGNER',
    id: 'krishi',
    name: 'Krishi',
    role: 'Lead UI/UX Platform Designer & AI Syndicate Command Architect',
    badge: 'FIP-DESIGN-7721',
    clearance: 'LEAD DESIGNER & AI COMMAND',
    headlineQuestion: 'Platform UI/UX Design, 3D Noir Experience & AI Syndicate Engine',
    bio: 'Designed and architected the complete F.I.P visual experience, interactive 3D Noir scroll storytelling, Senior Investigator Workstation, and the AI Cross-Case Hidden Pattern & Syndicate Correlation Engine.',
    quote: 'Great forensic design turns complex cryptographic proof into effortless clarity.',
    align: 'right',
    terminalPath: 'fip://core-team/04-krishi.designer-syndicate',
    avatarUrl: '/assets/aistudio/image_526c1ede.png',
    metrics: [
      { label: 'Platform Role', value: 'Lead UI/UX' },
      { label: 'Correlation Speed', value: '12ms AI Graph' },
      { label: 'Workstation Views', value: '8 Command Suites' },
    ],
    interactiveRows: [
      {
        id: 'row-1',
        label: 'AI Syndicate Pattern Engine',
        sublabel: 'Cross-case hidden link correlation',
        detail: 'Automatically cross-references every active docket against historical archives to detect repeat UPI handles, bank accounts, and C2 IPs.',
        iconType: 'cpu',
      },
      {
        id: 'row-2',
        label: 'Senior Investigator Workstation',
        sublabel: 'Multi-officer command console',
        detail: 'Built the unified command center featuring interactive shift calendars, custody alert feeds, and live progress steppers.',
        iconType: 'shield',
      },
      {
        id: 'row-3',
        label: 'Cinematic 3D Noir Experience',
        sublabel: 'Interactive spatial scroll storytelling',
        detail: 'Crafted the high-DPI detective office scroll-zoom camera engine and responsive forensic UI architecture.',
        iconType: 'scale',
      },
    ],
    techStack: ['AI Pattern Graph', 'Syndicate Engine', 'Workstation UI', '3D Canvas Physics'],
  },
];

export const HowItWorksPage: React.FC<{ onOpenReportDrawer: () => void }> = ({
  onOpenReportDrawer,
}) => {
  const [inputText, setInputText] = useState(
    'Payment of ₹1,48,500 transferred to suspect account 5010049281920 at 14:22 UTC'
  );
  const [originalHash, setOriginalHash] = useState('');
  const [tamperedText, setTamperedText] = useState('');
  const [tamperedHash, setTamperedHash] = useState('');
  const [, setAuditStatus] = useState<'idle' | 'matching' | 'mismatch'>('idle');
  const [copied, setCopied] = useState(false);

  // Interactive state for the 4-Card Circuit Team Showcase
  const [hoveredMemberIdx, setHoveredMemberIdx] = useState<number>(0);
  const [blinkingMemberId, setBlinkingMemberId] = useState<string | null>(null);
  const [selectedRowByMember, setSelectedRowByMember] = useState<Record<string, number>>({
    'bibi-zohara': 0,
    balchandra: 0,
    'afsheen-s': 0,
    krishi: 0,
  });

  const triggerMemberBlink = (memberId: string, idx: number, scrollCardIntoView = false) => {
    setHoveredMemberIdx(idx);
    setBlinkingMemberId(null);
    setTimeout(() => {
      setBlinkingMemberId(memberId);
    }, 15);
    if (scrollCardIntoView) {
      const el = document.getElementById(`fip-architect-card-${memberId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    setTimeout(() => {
      setBlinkingMemberId((prev) => (prev === memberId ? null : prev));
    }, 1650);
  };

  useEffect(() => {
    computeSHA256(inputText).then((hash) => {
      setOriginalHash(hash);
      if (!tamperedText) {
        setTamperedText(inputText);
        setTamperedHash(hash);
      }
    });
  }, [inputText]);

  const handleTamperTextChange = async (val: string) => {
    setTamperedText(val);
    const newHash = await computeSHA256(val);
    setTamperedHash(newHash);
  };

  const handleSimulateTamper = async () => {
    const altered = inputText.includes('1,48,500')
      ? inputText.replace('1,48,500', '1,48,501')
      : inputText + ' [altered]';
    setTamperedText(altered);
    const newHash = await computeSHA256(altered);
    setTamperedHash(newHash);
    setAuditStatus('mismatch');
  };

  const handleResetToMatch = async () => {
    setTamperedText(inputText);
    const hash = await computeSHA256(inputText);
    setTamperedHash(hash);
    setAuditStatus('matching');
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lifecycleStages = [
    {
      step: '01',
      title: 'Citizen Incident Submission',
      desc: 'The browser reads raw byte streams from uploaded screenshots, voice logs, APKs, or bank receipts directly in volatile memory.',
      icon: FileText,
    },
    {
      step: '02',
      title: 'SHA-256 Cryptographic Hashing',
      desc: 'NIST FIPS 180-4 produces a unique, irreversible 256-bit digest mathematically bound to every byte.',
      icon: Hash,
    },
    {
      step: '03',
      title: 'WORM Ledger Commitment',
      desc: 'Digests append under Write-Once-Read-Many enforcement with RFC-3161 UTC timestamps that cannot be deleted.',
      icon: Database,
    },
    {
      step: '04',
      title: 'Examiner Bit Verification',
      desc: 'Accredited forensic examiners independently hash evidence streams and confirm zero deviation.',
      icon: ShieldCheck,
    },
    {
      step: '05',
      title: 'Judicial Section 65B Seal',
      desc: 'Issues a magistrate-admissible certificate of electronic evidence shielding filings against tampering disputes.',
      icon: Scale,
    },
  ];

  return (
    <div className="w-full bg-[#F5F5F7] text-[#0D0D10] min-h-screen font-sans">
      <PageStudioHeader
        kicker="About F.I.P · Visionary Mentorship & Core Engineering Team"
        title="The Minds Behind F.I.P."
        subtitle="Built under distinguished academic and technical mentorship to establish sovereign, tamper-proof SHA-256 cyber-forensic custody and AI-driven syndicate correlation."
        ctaLabel="File Protected Evidence"
        onCtaClick={onOpenReportDrawer}
        showOrb
      />

      {/* =====================================================================
          SECTION 1: DISTINGUISHED PROJECT GUIDE & MENTORSHIP SPOTLIGHT
          Featuring Mr. Shantlingappa Deshmukh (/assets/aistudio/image_3c7f1f39.png)
      ===================================================================== */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-10 bg-[#08080C] text-white border-b border-white/10 relative overflow-hidden">
        {/* Ambient Warm Glow */}
        <div
          className="pointer-events-none absolute -top-40 right-1/4 w-[520px] h-[520px] rounded-full opacity-20 blur-[130px]"
          style={{
            background: 'radial-gradient(circle, #FF5A1F 0%, rgba(255,90,31,0) 70%)',
          }}
        />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF5A1F]/15 border border-[#FF5A1F]/40 text-[#FF7A45] text-[11px] font-mono-code uppercase tracking-widest font-bold">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>01 · Distinguished Project Guide &amp; Chief Mentor</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]">
                Guided by Excellence. Engineered for Humanity.
              </h2>
            </div>
            <div className="text-xs font-mono-code text-zinc-400 uppercase tracking-wider">
              IEEE Advancing Technology Standards · F.I.P Architecture
            </div>
          </div>

          {/* Guide Master Showcase Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch bg-[#101016] rounded-[32px] border border-[#FF5A1F]/35 p-6 sm:p-8 lg:p-10 shadow-[0_0_70px_rgba(255,90,31,0.12)]">
            {/* Left Column (5 Cols): High-Clarity Portrait Frame */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#07070A] shadow-2xl group h-full min-h-[380px] sm:min-h-[460px]">
                <img
                  src="/assets/aistudio/image_3c7f1f39.png"
                  alt="Mr. Shantlingappa Deshmukh — Project Guide & Mentor"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                />
                {/* Subtle bottom gradient for legible caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/25 to-transparent" />

                {/* Top Corner IEEE & Mentorship Seal */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#FF5A1F]/50 text-[#FF7A45] text-[10px] font-mono-code font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
                    Chief Project Guide
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-zinc-200 text-[10px] font-mono-code font-semibold">
                    IEEE Mentor
                  </span>
                </div>

                {/* Bottom Overlay Nameplate */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0D0D12]/90 backdrop-blur-xl border border-white/15 space-y-1">
                  <div className="text-[10px] font-mono-code uppercase tracking-widest text-[#FF6B2B] font-bold">
                    Visionary Mentor &amp; Project Guide
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Mr. Shantlingappa Deshmukh
                  </div>
                  <div className="text-xs text-zinc-300 font-medium">
                    Faculty Guide · Cyber Forensics &amp; Systems Engineering
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (7 Cols): Tribute, Mentorship Impact & Milestones */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 text-[#FF7A45] text-xs font-mono-code font-bold">
                    PILLAR OF OUR SUCCESS
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono-code">
                    F.I.P (Forensic Investigation Platform)
                  </span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
                  Mr. Shantlingappa Deshmukh
                </h3>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  Behind the architecture and real-world precision of the{' '}
                  <strong className="text-white font-semibold">
                    F.I.P (Forensic Investigation Platform)
                  </strong>{' '}
                  stands the constant encouragement, deep technical insight, and visionary mentorship of our respected project guide,{' '}
                  <strong className="text-[#FF7A45] font-semibold">
                    Mr. Shantlingappa Deshmukh
                  </strong>
                  . Under his guidance, our team transformed an ambitious forensic concept into a complete, court-admissible cyber investigation ecosystem.
                </p>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  From the earliest design reviews to the implementation of{' '}
                  <span className="text-zinc-200 font-medium">
                    NIST FIPS 180-4 SHA-256 cryptographic hashing
                  </span>
                  ,{' '}
                  <span className="text-zinc-200 font-medium">
                    Write-Once-Read-Many (WORM) evidence custody
                  </span>
                  , and the{' '}
                  <span className="text-zinc-200 font-medium">
                    AI Cross-Case Hidden Pattern &amp; Syndicate Correlation Engine
                  </span>
                  , his rigorous engineering standards challenged us to build software that advances technology for humanity and stands up to judicial scrutiny under Section 65B.
                </p>

                {/* Highlight Quote Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FF5A1F]/15 via-[#16161F] to-[#121218] border-l-4 border-[#FF5A1F] space-y-2">
                  <p className="text-xs sm:text-sm italic text-zinc-100 leading-relaxed">
                    &ldquo;Under the inspiring mentorship of Mr. Shantlingappa Deshmukh, our team achieved a level of architectural depth, cryptographic rigor, and forensic reliability that we are immensely proud of. His belief in our potential guided every milestone of this platform.&rdquo;
                  </p>
                  <div className="text-[11px] font-mono-code text-[#FF7A45] font-bold uppercase tracking-wider flex flex-wrap items-center gap-2 pt-1">
                    <span>— The F.I.P Engineering Team (</span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-[#FF6B2B]/40 text-white normal-case font-sans font-bold">
                      <img
                        src="/assets/aistudio/image_acc490cb.png"
                        alt="Bibi Zohara"
                        className="w-4 h-4 rounded-full object-cover object-top border border-[#FF6B2B]"
                      />
                      <span>Bibi Zohara</span>
                    </span>
                    <span>,</span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-[#FF6B2B]/40 text-white normal-case font-sans font-bold">
                      <img
                        src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg"
                        alt="Balchandra"
                        className="w-4 h-4 rounded-full object-cover object-top border border-[#FF6B2B]"
                      />
                      <span>Balchandra</span>
                    </span>
                    <span>,</span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-[#FF6B2B]/40 text-white normal-case font-sans font-bold">
                      <img
                        src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg"
                        alt="Afsheen S"
                        className="w-4 h-4 rounded-full object-cover object-top border border-[#FF6B2B]"
                      />
                      <span>Afsheen S</span>
                    </span>
                    <span>&amp;</span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-[#FF6B2B]/40 text-white normal-case font-sans font-bold">
                      <img
                        src="/assets/aistudio/image_526c1ede.png"
                        alt="Krishi"
                        className="w-4 h-4 rounded-full object-cover object-top border border-[#FF6B2B]"
                      />
                      <span>Krishi</span>
                    </span>
                    <span>)</span>
                  </div>
                </div>
              </div>

              {/* 3 Mentorship Impact Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                {[
                  {
                    code: 'MENTORSHIP 01',
                    title: 'Architectural Rigor',
                    desc: 'Guided zero-trust WORM storage & bit-exact SHA-256 verification standards.',
                  },
                  {
                    code: 'MENTORSHIP 02',
                    title: 'AI Research Direction',
                    desc: 'Directed cross-case syndicate pattern recognition & graph correlation.',
                  },
                  {
                    code: 'MENTORSHIP 03',
                    title: 'Real-World Impact',
                    desc: 'Aligned platform workflows with 1930 Golden-Hour & Section 65B law.',
                  },
                ].map((pillar) => (
                  <div
                    key={pillar.code}
                    className="p-4 rounded-2xl bg-[#16161E] border border-white/10 hover:border-[#FF5A1F]/50 transition-colors space-y-1.5"
                  >
                    <div className="text-[10px] font-mono-code text-[#FF6B2B] font-bold">
                      {pillar.code}
                    </div>
                    <div className="text-sm font-bold text-white">{pillar.title}</div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: 4-CARD CONNECTED CIRCUIT TEAM ANIMATION
          Modeled directly on /public/assets/aistudio/image_c3a7f5bf.png
          Hover / scroll cursor over any card to illuminate the orange circuit
          and reveal complete member information & interactive sub-modules
      ===================================================================== */}
      <section className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-10 bg-[#07070A] text-white border-b border-white/10 relative overflow-hidden">
        {/* Subtle Radial Ambient Glow matching reference image */}
        <div
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[780px] rounded-full opacity-20 blur-[150px]"
          style={{
            background: 'radial-gradient(circle, #FF6B2B 0%, rgba(255,107,43,0) 70%)',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10 space-y-14">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6B2B]/15 border border-[#FF6B2B]/40 text-[#FF854D] text-[11px] font-mono-code uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>02 · Interactive Core Team Circuit Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              The 4 Architects of F.I.P.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Move your cursor over any of the 4 connected forensic nodes below to energize the circuit trace and inspect complete member credentials, engineered modules, and live forensic specializations.
            </p>

            {/* Quick Member Selector Pills (Click any architect to blink & focus their node) */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              {FIP_TEAM_MEMBERS.map((m, idx) => {
                const isActive = hoveredMemberIdx === idx;
                const isBlinking = blinkingMemberId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onMouseEnter={() => setHoveredMemberIdx(idx)}
                    onClick={() => triggerMemberBlink(m.id, idx, true)}
                    className={`px-4 py-1.5 rounded-full text-xs font-mono-code font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isBlinking
                        ? 'animate-ping bg-white text-black ring-4 ring-[#FF6B2B] shadow-[0_0_40px_#FF6B2B]'
                        : isActive
                        ? 'bg-[#FF6B2B] text-black shadow-[0_0_25px_rgba(255,107,43,0.6)]'
                        : 'bg-[#14141A] text-zinc-300 border border-white/10 hover:border-[#FF6B2B]/50'
                    }`}
                  >
                    {m.avatarUrl ? (
                      <img
                        src={m.avatarUrl}
                        alt={m.name}
                        className="w-5 h-5 rounded-full object-cover object-top border border-black/40 shrink-0"
                      />
                    ) : (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-black' : 'bg-[#FF6B2B]'
                        }`}
                      />
                    )}
                    <span>
                      0{idx + 1}. {m.name}
                    </span>
                    {m.id === 'krishi' && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-sans font-extrabold ${
                          isActive
                            ? 'bg-black/20 text-black'
                            : 'bg-[#FF6B2B]/20 text-[#FF854D] border border-[#FF6B2B]/40'
                        }`}
                      >
                        Designer
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4-Card Staggered Circuit Canvas (Matching attached reference image_c3a7f5bf.png) */}
          <style>{`
            @keyframes fipNodeBlinkPulse {
              0%, 100% {
                box-shadow: 0 0 55px rgba(255,107,43,0.28);
                border-color: #FF6B2B;
                transform: scale(1.01);
                filter: brightness(1);
              }
              15%, 45%, 75% {
                box-shadow: 0 0 110px rgba(255,107,43,0.95), 0 0 45px rgba(255,255,255,0.75), inset 0 0 55px rgba(255,107,43,0.45);
                border-color: #FFFFFF;
                transform: scale(1.028);
                filter: brightness(1.32);
              }
              30%, 60% {
                box-shadow: 0 0 20px rgba(255,107,43,0.2);
                border-color: #FF6B2B;
                transform: scale(0.995);
                filter: brightness(0.92);
              }
            }
            .fip-card-blink-active {
              animation: fipNodeBlinkPulse 1.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }
          `}</style>
          <div className="relative space-y-0">
            {FIP_TEAM_MEMBERS.map((member, index) => {
              const isHovered = hoveredMemberIdx === index;
              const isCardBlinking = blinkingMemberId === member.id;
              const activeRowIdx = selectedRowByMember[member.id] ?? 0;
              const activeRow = member.interactiveRows[activeRowIdx];
              const isLeftCard = index % 2 === 0;

              return (
                <React.Fragment key={member.id}>
                  {/* Card Row Alignment (Staggered Left / Right on Desktop like image_c3a7f5bf.png) */}
                  <div
                    id={`fip-architect-card-${member.id}`}
                    className={`w-full flex ${
                      isLeftCard ? 'lg:justify-start' : 'lg:justify-end'
                    } justify-center`}
                  >
                    <div
                      onMouseEnter={() => setHoveredMemberIdx(index)}
                      onClick={() => triggerMemberBlink(member.id, index, false)}
                      className={`w-full lg:w-[76%] rounded-[26px] bg-[#121216] transition-all duration-500 relative cursor-pointer select-none overflow-hidden ${
                        isCardBlinking
                          ? 'border-2 border-white fip-card-blink-active'
                          : isHovered
                          ? 'border-2 border-[#FF6B2B] shadow-[0_0_55px_rgba(255,107,43,0.28)] scale-[1.01]'
                          : 'border border-white/12 hover:border-[#FF6B2B]/60 opacity-90'
                      }`}
                    >
                      {/* Blinking Flash Overlay */}
                      {isCardBlinking && (
                        <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-r from-[#FF6B2B]/25 via-white/15 to-[#FF6B2B]/25 animate-pulse" />
                      )}

                      {/* Subtle Internal Orange Glow on Active Card */}
                      <div
                        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                          isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                          background:
                            'radial-gradient(600px circle at 15% 0%, rgba(255,107,43,0.14), transparent 70%)',
                        }}
                      />

                      {/* Window Top Bar (Traffic Light Dots + Address Pill like Step 1 in reference image) */}
                      <div className="px-6 py-3.5 bg-[#18181F] border-b border-white/10 flex items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block" />
                          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block" />
                          <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block" />
                        </div>
                        <div className="flex-1 max-w-md px-4 py-1 rounded-full bg-[#22222B] text-[11px] font-mono-code text-zinc-400 truncate text-center">
                          {member.terminalPath}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold ${
                              isHovered
                                ? 'bg-[#FF6B2B] text-black shadow-[0_0_15px_rgba(255,107,43,0.6)]'
                                : 'bg-white/10 text-zinc-300'
                            }`}
                          >
                            {member.badge}
                          </span>
                        </div>
                      </div>

                      {/* Main Card Body (2-Column Split like Step 2 & Step 3 in reference image) */}
                      <div className="p-6 sm:p-8 lg:p-9 grid grid-cols-1 md:grid-cols-12 gap-7 items-center relative z-10">
                        {/* Left Info Column (6 Cols) */}
                        <div className="md:col-span-6 space-y-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-[#FF6B2B]">
                              {member.step}
                            </span>
                            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                              {member.clearance}
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            {member.avatarUrl && (
                              <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#FF6B2B] shadow-[0_0_30px_rgba(255,107,43,0.35)] bg-[#070709] shrink-0 group/avatar">
                                <img
                                  src={member.avatarUrl}
                                  alt={member.name}
                                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/avatar:scale-105"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/80 to-transparent" />
                                <span className="absolute bottom-1 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-black" />
                              </div>
                            )}
                            <div>
                              <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                                {member.name}
                              </h3>
                              <p className="text-xs sm:text-sm font-medium text-[#FF8A54] mt-1">
                                {member.role}
                              </p>
                            </div>
                          </div>

                          <div className="h-px w-full bg-white/10" />

                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-zinc-200">
                              {member.headlineQuestion}
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {member.bio}
                            </p>
                          </div>

                          {/* Metrics Strip */}
                          <div className="grid grid-cols-3 gap-2 pt-1">
                            {member.metrics.map((m) => (
                              <div
                                key={m.label}
                                className="p-2.5 rounded-xl bg-[#0B0B0E] border border-white/10"
                              >
                                <div className="text-[10px] text-zinc-500 font-mono-code truncate">
                                  {m.label}
                                </div>
                                <div className="text-xs font-bold text-white font-mono-code mt-0.5 truncate">
                                  {m.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right Interactive Selector Column (6 Cols — Exact match to STEP 2 radio-pill boxes in image_c3a7f5bf.png) */}
                        <div className="md:col-span-6 space-y-3">
                          <div className="text-[10px] font-mono-code uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                            <span>Hover or Click Module to Inspect</span>
                            <span className="text-[#FF6B2B] font-bold">LIVE DOSSIER</span>
                          </div>

                          {member.interactiveRows.map((row, rIdx) => {
                            const isRowSelected = activeRowIdx === rIdx;
                            return (
                              <div
                                key={row.id}
                                onMouseEnter={(e) => {
                                  e.stopPropagation();
                                  setHoveredMemberIdx(index);
                                  setSelectedRowByMember((prev) => ({
                                    ...prev,
                                    [member.id]: rIdx,
                                  }));
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHoveredMemberIdx(index);
                                  setSelectedRowByMember((prev) => ({
                                    ...prev,
                                    [member.id]: rIdx,
                                  }));
                                }}
                                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer ${
                                  isRowSelected
                                    ? 'bg-[#1B1614] border-[#FF6B2B] shadow-[0_0_25px_rgba(255,107,43,0.22)]'
                                    : 'bg-[#17171D] border-white/10 hover:border-white/25'
                                }`}
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  {/* Glowing Radio Circle matching image_c3a7f5bf.png */}
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                      isRowSelected
                                        ? 'border-2 border-[#FF6B2B] shadow-[0_0_10px_#FF6B2B]'
                                        : 'border border-zinc-600'
                                    }`}
                                  >
                                    {isRowSelected && (
                                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B2B]" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div
                                      className={`text-xs sm:text-sm font-semibold truncate ${
                                        isRowSelected ? 'text-white' : 'text-zinc-300'
                                      }`}
                                    >
                                      {row.label}
                                    </div>
                                    <div className="text-[11px] text-zinc-400 truncate">
                                      {row.sublabel}
                                    </div>
                                  </div>
                                </div>

                                {/* Right Line Icon matching image_c3a7f5bf.png */}
                                <div
                                  className={`shrink-0 ${
                                    isRowSelected ? 'text-[#FF6B2B]' : 'text-zinc-500'
                                  }`}
                                >
                                  {row.iconType === 'shield' && <ShieldCheck className="w-4 h-4" />}
                                  {row.iconType === 'cpu' && <Cpu className="w-4 h-4" />}
                                  {row.iconType === 'scale' && <Scale className="w-4 h-4" />}
                                </div>
                              </div>
                            );
                          })}

                          {/* Dynamic Expanded Detail Panel + Warm Peach CTA Button (matching Step 3 in image_c3a7f5bf.png) */}
                          <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-[#FF6B2B]/30 space-y-3">
                            <p className="text-xs text-zinc-300 leading-relaxed">
                              <strong className="text-[#FF854D]">{activeRow.label}: </strong>
                              {activeRow.detail}
                            </p>
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {member.techStack.map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono-code text-zinc-300"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>

                              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#FF9E6D] text-[#0B0B0E] text-[11px] font-bold shadow-[0_0_20px_rgba(255,158,109,0.35)]">
                                <span>Verified Architect</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ===============================================================
                      GLOWING ORANGE RIGHT-ANGLE CIRCUIT CONNECTOR BETWEEN CARDS
                      Exact match to the orange elbow lines & terminal dots in image_c3a7f5bf.png
                  =============================================================== */}
                  {index < FIP_TEAM_MEMBERS.length - 1 && (
                    <div className="w-full flex justify-center relative py-1">
                      {/* Desktop Right-Angled SVG Elbow Connector */}
                      <svg
                        viewBox="0 0 800 110"
                        className="hidden lg:block w-full max-w-5xl h-28 overflow-visible"
                        fill="none"
                      >
                        <defs>
                          <filter
                            id={`orangeGlow-${index}`}
                            x="-30%"
                            y="-30%"
                            width="160%"
                            height="160%"
                          >
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        {isLeftCard ? (
                          <>
                            {/* Card 1 (Left) -> Card 2 (Right) Elbow Path */}
                            <path
                              d="M 240 6 L 240 66 Q 240 94 268 94 L 540 94"
                              stroke="#FF6B2B"
                              strokeOpacity={
                                hoveredMemberIdx === index || hoveredMemberIdx === index + 1
                                  ? '1'
                                  : '0.45'
                              }
                              strokeWidth="3"
                              strokeLinecap="round"
                              filter={`url(#orangeGlow-${index})`}
                            />
                            {/* Top Terminal Node */}
                            <circle
                              cx="240"
                              cy="6"
                              r="7"
                              fill="#FF854D"
                              filter={`url(#orangeGlow-${index})`}
                            />
                            {/* Bottom Target Terminal Node */}
                            <circle
                              cx="540"
                              cy="94"
                              r="7"
                              fill="#FF854D"
                              filter={`url(#orangeGlow-${index})`}
                            />
                          </>
                        ) : (
                          <>
                            {/* Card 2 (Right) -> Card 3 (Left) Elbow Path */}
                            <path
                              d="M 560 6 L 560 66 Q 560 94 532 94 L 260 94"
                              stroke="#FF6B2B"
                              strokeOpacity={
                                hoveredMemberIdx === index || hoveredMemberIdx === index + 1
                                  ? '1'
                                  : '0.45'
                              }
                              strokeWidth="3"
                              strokeLinecap="round"
                              filter={`url(#orangeGlow-${index})`}
                            />
                            {/* Top Terminal Node */}
                            <circle
                              cx="560"
                              cy="6"
                              r="7"
                              fill="#FF854D"
                              filter={`url(#orangeGlow-${index})`}
                            />
                            {/* Bottom Target Terminal Node */}
                            <circle
                              cx="260"
                              cy="94"
                              r="7"
                              fill="#FF854D"
                              filter={`url(#orangeGlow-${index})`}
                            />
                          </>
                        )}
                      </svg>

                      {/* Mobile / Tablet Vertical Glowing Orange Connector */}
                      <div className="lg:hidden flex flex-col items-center py-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#FF7A3D] shadow-[0_0_14px_#FF6B2B]" />
                        <div className="w-0.5 h-12 bg-gradient-to-b from-[#FF6B2B] via-[#FF854D] to-[#FF6B2B] shadow-[0_0_12px_#FF6B2B]" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#FF7A3D] shadow-[0_0_14px_#FF6B2B]" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: FIELD RESEARCH EXPEDITION — NFSU DHARWAD
          Featuring /assets/aistudio/image_e1333a98.png (National Forensic Sciences University, Dharwad)
      ===================================================================== */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-10 bg-[#0B0B10] text-white border-b border-white/10 relative overflow-hidden">
        <div
          className="pointer-events-none absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-[130px]"
          style={{
            background: 'radial-gradient(circle, #FF6B2B 0%, rgba(255,107,43,0) 70%)',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center bg-[#12121A] rounded-[32px] border border-white/12 p-6 sm:p-8 lg:p-10 shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
            {/* Left Column (6 Cols): NFSU Dharwad Campus Photograph */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#07070A] shadow-2xl group aspect-[16/10]">
                <img
                  src="/assets/aistudio/image_e1333a98.png"
                  alt="National Forensic Sciences University, Dharwad — Field Visit by the F.I.P Team"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070A]/90 via-transparent to-black/20" />

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#FF6B2B]/50 text-[#FF854D] text-[10px] font-mono-code font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B2B] animate-pulse" />
                    Field Research · Dharwad
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-zinc-200 text-[10px] font-mono-code font-semibold">
                    NFSU · Ministry of Home Affairs
                  </span>
                </div>

                {/* Bottom Caption */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3.5 rounded-xl bg-[#0D0D12]/90 backdrop-blur-md border border-white/15 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#FF7A45] font-bold">
                      National Forensic Sciences University (NFSU)
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white">
                      Dharwad Campus · Academic Consultation &amp; Forensic Field Study
                    </div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-[#FF6B2B] shrink-0" />
                </div>
              </div>
            </div>

            {/* Right Column (6 Cols): Sweet & Short Field Journey Story */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6B2B]/15 border border-[#FF6B2B]/40 text-[#FF854D] text-[11px] font-mono-code uppercase tracking-widest font-bold">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>03 · Beyond the Classroom · Dharwad Expedition</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Learning from the Experts at NFSU, Dharwad.
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                To make <strong className="text-white">F.I.P</strong> truly practical and grounded in real investigative science, all four of us traveled together to{' '}
                <strong className="text-[#FF854D]">Dharwad</strong> and visited the prestigious{' '}
                <strong className="text-white">
                  National Forensic Sciences University (NFSU)
                </strong>
                .
              </p>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Meeting and interacting with experienced forensic professors gave our team invaluable insights into how digital evidence is examined in real laboratories, how chain-of-custody protocols are preserved without tampering, and what courts expect under Section 65B. That memorable journey directly shaped the heart of this platform.
              </p>

              {/* All 4 Members Travelling Together Pill Box */}
              <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-white/10 space-y-2.5">
                <div className="text-[10px] font-mono-code uppercase tracking-widest text-zinc-400 font-bold">
                  4-Member Field Research Delegation · Dharwad Visit
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { name: 'Bibi Zohara', img: '/assets/aistudio/image_acc490cb.png' },
                    {
                      name: 'Balchandra',
                      img: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg',
                    },
                    {
                      name: 'Afsheen S',
                      img: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg',
                    },
                    { name: 'Krishi', img: '/assets/aistudio/image_526c1ede.png' },
                  ].map((m) => (
                    <span
                      key={m.name}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161F] border border-[#FF6B2B]/40 text-xs font-bold text-white"
                    >
                      <img
                        src={m.img}
                        alt={m.name}
                        className="w-5 h-5 rounded-full object-cover object-top border border-[#FF6B2B]"
                      />
                      <span>{m.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: 5-STEP CRYPTOGRAPHIC CUSTODY PIPELINE & AVALANCHE SANDBOX
      ===================================================================== */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-black/10">
        <ScrollExpandBlock minScale={0.95} className="w-full space-y-14">
          <div className="max-w-3xl space-y-2">
            <div className="text-[11px] font-mono-code uppercase tracking-wider text-[#FF4D15] font-bold">
              04 · Platform Cryptographic Workflow
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#0D0D10]">
              How F.I.P Protects Digital Evidence.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Every artifact uploaded to F.I.P passes through a 5-stage statutory preservation lifecycle.
            </p>
          </div>

          <StaggeredGrid staggerMs={90} className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {lifecycleStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.step}
                  className="p-6 rounded-3xl bg-[#F5F5F7] hover:bg-[#0D0D10] hover:text-white border border-black/10 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono-code font-bold text-[#FF4D15]">
                        STEP {stage.step}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-white group-hover:bg-[#1C1C22] border border-black/10 flex items-center justify-center text-[#FF4D15]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold mb-2 leading-snug">{stage.title}</h3>
                    <p className="text-xs text-zinc-600 group-hover:text-zinc-300 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-black/10 group-hover:border-white/10 text-[10px] font-mono-code text-zinc-500 group-hover:text-zinc-400">
                    RFC-3161 COMPLIANT
                  </div>
                </div>
              );
            })}
          </StaggeredGrid>

          {/* Interactive Cryptographic Avalanche Sandbox */}
          <div className="rounded-3xl bg-[#F5F5F7] border border-black/10 p-6 sm:p-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl space-y-2">
                <div className="text-[11px] font-mono-code uppercase tracking-wider text-[#FF4D15] font-bold">
                  Live Browser Avalanche Sandbox
                </div>
                <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#0D0D10]">
                  Witness the 1-Byte Avalanche Effect
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600">
                  Alter even a single digit below to observe complete 256-bit digest divergence between WORM evidence and a tampered claim.
                </p>
              </div>
              {copied && (
                <span className="text-xs font-mono-code text-[#FF4D15] font-bold">
                  SHA-256 Digest Copied ✓
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Crisp White Original Box */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-[#0D0D10]">01. Original Citizen Stream</span>
                    <span className="text-[11px] font-mono-code text-[#FF4D15] font-bold">
                      WORM LOCKED
                    </span>
                  </div>

                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={3}
                    className="w-full p-4 rounded-2xl bg-[#F5F5F7] border border-black/10 text-xs text-[#0D0D10] font-mono-code focus:outline-none focus:ring-2 focus:ring-[#FF4D15] mb-4"
                  />

                  <div className="text-[11px] text-zinc-500 uppercase font-mono-code mb-1.5">
                    Original SHA-256 Digest
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0D0D10] text-white font-mono-code text-xs break-all relative group pr-10">
                    {originalHash}
                    <button
                      onClick={() => copyHash(originalHash)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-[#FF4D15] text-white transition-colors"
                      title="Copy Digest"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-[11px] font-mono-code text-zinc-500">
                  Computed Client-Side via WebCrypto API
                </div>
              </div>

              {/* Matte Obsidian Audited Box */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0D10] text-white flex flex-col justify-between space-y-4 shadow-xl">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
                    <span className="font-bold text-[#FF4D15]">02. Audited Evidence Payload</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSimulateTamper}
                        className="px-3 py-1 rounded-full bg-[#FF4D15] hover:bg-[#E03E0B] text-white text-[11px] font-bold transition-colors"
                      >
                        Alter 1 Byte
                      </button>
                      <button
                        onClick={handleResetToMatch}
                        className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-zinc-200 text-[11px] font-semibold transition-colors"
                      >
                        Reset Match
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={tamperedText}
                    onChange={(e) => handleTamperTextChange(e.target.value)}
                    rows={3}
                    className="w-full p-4 rounded-2xl bg-[#16161C] border border-white/15 text-xs text-zinc-100 font-mono-code focus:outline-none focus:ring-2 focus:ring-[#FF4D15] mb-4"
                  />

                  <div className="text-[11px] text-zinc-400 uppercase font-mono-code mb-1.5">
                    Audited SHA-256 Digest
                  </div>
                  <div
                    className={`p-4 rounded-2xl border font-mono-code text-xs break-all ${
                      originalHash === tamperedHash
                        ? 'bg-[#16161C] border-emerald-500/50 text-emerald-300'
                        : 'bg-[#2A0900] border-[#FF4D15] text-[#FF884D]'
                    }`}
                  >
                    {tamperedHash}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  {originalHash === tamperedHash ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>BIT-FOR-BIT MATCH CONFIRMED · CHAIN INTACT</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-[#FF4D15] font-semibold">
                      <AlertOctagon className="w-4 h-4 shrink-0" />
                      <span>TAMPERING EXPOSED · HASH DIGEST DIVERGED</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollExpandBlock>
      </section>

      <KineticMarquee
        theme="dark"
        variant="band"
        items={[
          'GUIDED BY MR. SHANTLINGAPPA DESHMUKH',
          'F.I.P CORE ARCHITECTS',
          'WRITE-ONCE-READ-MANY',
          'SECTION 65B AFFIDAVIT',
        ]}
      />

      {/* Matte Obsidian Principles Band */}
      <section className="w-full bg-[#0B0B0E] text-white py-20 px-4 sm:px-6 lg:px-8">
        <ScrollExpandBlock minScale={0.95} className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="text-[11px] font-mono-code uppercase tracking-wider text-[#FF4D15] font-bold">
              Legal &amp; Technical Invariants
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
              Why Write-Once-Read-Many matters in court.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
              Traditional mutable databases allow administrative overwrites. F.I.P (Forensic Investigation Platform) enforces append-only WORM storage and cryptographic chaining so opposing counsel cannot challenge authenticity.
            </p>
            <MagneticButton
              onClick={onOpenReportDrawer}
              className="px-7 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-[#0B0B0E] text-xs font-bold transition-colors"
            >
              Lock Your Case Evidence Now →
            </MagneticButton>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-code text-xs">
            {[
              {
                num: '01',
                title: 'Zero Mutability',
                desc: 'Append-only ledger blocks with zero update/delete pathways.',
              },
              {
                num: '02',
                title: 'UTC Time Token',
                desc: 'RFC-3161 proof establishing pre-litigation timestamp.',
              },
              {
                num: '03',
                title: 'Examiner Counter-Sign',
                desc: 'Dual digital verification by accredited cyber officers.',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="p-6 rounded-3xl bg-[#141418] border border-white/10 space-y-2"
              >
                <div className="text-[#FF4D15] font-bold">{item.num}</div>
                <div className="text-sm font-sans font-bold text-white">{item.title}</div>
                <p className="text-[11px] font-sans text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollExpandBlock>
      </section>
    </div>
  );
};
