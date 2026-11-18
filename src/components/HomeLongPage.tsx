import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Hash,
  Lock,
  PhoneCall,
  Globe,
  FileCheck2,
  Fingerprint,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { computeSHA256 } from '../utils/crypto';
import { MagneticButton } from './effects/MagneticButton';
import { KineticMarquee } from './effects/KineticMarquee';
import { MaskedLineReveal } from './effects/MaskedLineReveal';
import { StaggeredGrid } from './effects/StaggeredGrid';
import { ScrollReveal } from './effects/ScrollReveal';
import { ScrollExpandBlock } from './effects/ScrollExpandBlock';
import { HardwareVault3D } from './effects/HardwareVault3D';
import { SonarGridCanvas } from './effects/SonarGridCanvas';
import { ForensicRibbonSculpture } from './effects/HeroSentinelSculpture';
import { DetectiveDeskScrollHero } from './effects/DetectiveDeskScrollHero';
import {
  DocketArtwork,
  DocketArtVariant,
  ChainTrustKineticArtwork,
} from './effects/DocketArtwork';

interface HomeLongPageProps {
  onOpenReportDrawer: () => void;
  onNavigate: (tab: string) => void;
}

interface SamplePayload {
  id: string;
  year: string;
  filename: string;
  category: string;
  summary: string;
  sizeBytes: number;
  content: string;
  badge: string;
  artVariant: DocketArtVariant;
}

interface ExaminerProfile {
  name: string;
  role: string;
  agency: string;
  jurisdiction: string;
  badge: string;
  initials: string;
  casesVerified: number;
  summary: string;
  accentGradient: string;
  specialty: string;
  avatarUrl?: string;
}

const SAMPLE_PAYLOADS: SamplePayload[] = [
  {
    id: 'pay-1',
    year: '2026',
    filename: 'BijliBill_Update_v2.4.apk',
    category: 'Electricity Scam Trojan',
    summary: 'Malicious Android APK binary intercepting SMS banking OTP streams.',
    sizeBytes: 4892010,
    content:
      'APK-BINARY-HEADER: PK\\x03\\x04 AndroidManifest.xml package="com.bijlibill.update" uses-permission="android.permission.RECEIVE_SMS" C2_HOST="185.220.101.42:8443" EXFILTRATE_BANK_OTP=true',
    badge: 'SMS Trojan',
    artVariant: 'apk-trojan',
  },
  {
    id: 'pay-2',
    year: '2025',
    filename: 'cbi_courtroom_skype_arrest.mp4',
    category: 'Digital Arrest Extortion',
    summary: 'Synthetic video call impersonating judicial officers under coerced transfer.',
    sizeBytes: 18400290,
    content:
      'AUDIO-VIDEO-CONTAINER: ftypisom VideoTrack: H.264 1080p 30fps Impersonator="Inspector General Alok Verma" ExtortionDemand="Transfer INR 25,00,000 to RBI Clearance Account"',
    badge: 'Video Extortion',
    artVariant: 'deepfake-call',
  },
  {
    id: 'pay-3',
    year: '2024',
    filename: 'telegram_task_utr_debit.pdf',
    category: 'Task Fraud Mule Slip',
    summary: 'Coordinated UPI mule settlement trail verified across 1930 nodal freeze.',
    sizeBytes: 1104820,
    content:
      'BANK-TRANSACTION-SLIP: UTR="IN-948102837190" Debited="INR 1,48,500.00" Beneficiary_UPI="powerelectric99@axl" Mule_Account="5010049281920"',
    badge: 'Mule Slip',
    artVariant: 'mule-slip',
  },
  {
    id: 'pay-4',
    year: '2023',
    filename: 'whatsapp_blackmail_threat.png',
    category: 'Coercive Chat & EXIF',
    summary: 'Original header metadata and uncropped threat frames sealed under WORM.',
    sizeBytes: 842100,
    content:
      'IMAGE-EXIF-STREAM: PNG-IHDR width=1080 height=2400 EXIF_DEVICE="OnePlus Nord" ThreatText="Pay INR 50,000 in 30 minutes or this morphed video will be sent"',
    badge: 'Chat EXIF',
    artVariant: 'chat-exif',
  },
];

const EXAMINERS: ExaminerProfile[] = [
  {
    name: 'Dr. Bibi Zohara',
    role: 'Lead Cyber Forensic Examiner',
    agency: 'IFSO Special Cell, Delhi Police',
    jurisdiction: 'IFSO Special Cell · India',
    badge: 'DEL-CY-0842',
    initials: 'BZ',
    casesVerified: 2420,
    specialty: 'Section 65B Affidavits & Binary Dissection',
    accentGradient: 'from-[#2A2A32] via-[#131318] to-[#08080B]',
    avatarUrl: '/assets/aistudio/image_acc490cb.png',
    summary:
      'Oversees cryptographic affidavits, APK reverse engineering, and bit-exact WORM validation for high-priority magistrate court filings.',
  },
  {
    name: 'Balchandra K',
    role: 'Senior Financial Freeze Inspector',
    agency: 'Maharashtra Cyber Directorate',
    jurisdiction: 'Mumbai · India',
    badge: 'MAH-CY-1109',
    initials: 'BK',
    casesVerified: 2180,
    specialty: '1930 Golden Window & NPCI Tracebacks',
    accentGradient: 'from-[#1D1D25] via-[#121218] to-[#260E06]',
    avatarUrl: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg',
    summary:
      'Coordinates 2-hour Golden Window fund interdiction and real-time NPCI / 1930 mule account tracebacks across banking nodes.',
  },
  {
    name: 'Afsheen S',
    role: 'Lead Malware Reverse Engineer',
    agency: 'INTERPOL Cyber Directorate',
    jurisdiction: 'Global · Lyon',
    badge: 'INT-CY-4902',
    initials: 'AS',
    casesVerified: 2890,
    specialty: 'Deepfake & C2 Domain Attribution',
    accentGradient: 'from-[#181820] via-[#2B0E04] to-[#C93A08]/80',
    avatarUrl: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg',
    summary:
      'Executes cross-border registrar takedowns, deepfake synthetic stream attribution, and global criminal infrastructure profiling.',
  },
  {
    name: 'Krishi N',
    role: 'Chief Forensic Interdiction Officer',
    agency: 'National Cyber Crime Hub (I4C)',
    jurisdiction: 'I4C Command · National',
    badge: 'I4C-NAT-7721',
    initials: 'KN',
    casesVerified: 3640,
    specialty: 'WORM Ledger & RFC-3161 Arbitration',
    accentGradient: 'from-[#121217] via-[#1E1E26] to-[#FF4D15]/40',
    avatarUrl: '/assets/aistudio/image_526c1ede.png',
    summary:
      'Commands national multi-state chain-of-custody verification, RFC-3161 time-stamping compliance, and nodal judicial escalation.',
  },
];

const PIPELINE_STEPS = [
  {
    step: '01',
    icon: Fingerprint,
    title: '01. Zero-Touch Capture',
    desc: 'Raw device binaries, APK packages, audio/video captures, and bank slips are hashed directly in browser memory before transit.',
    metric: 'SHA-256 Client Hash',
  },
  {
    step: '02',
    icon: Lock,
    title: '02. RFC-3161 WORM Seal',
    desc: 'Write-Once-Read-Many anchoring pairs your digest with immutable UTC time tokens and accredited forensic examiner signatures.',
    metric: 'Zero Bit Mutation',
  },
  {
    step: '03',
    icon: Scale,
    title: '03. 1930 Freeze & Sec 65B',
    desc: 'Rapid interdiction dispatches bank lien alerts within the 2-hour Golden Window while issuing court-ready Section 65B certificates.',
    metric: 'Magistrate Admissible',
  },
];

export const HomeLongPage: React.FC<HomeLongPageProps> = ({
  onOpenReportDrawer,
  onNavigate,
}) => {
  const [selectedExaminerIndex, setSelectedExaminerIndex] = useState(0);
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [workbenchContent, setWorkbenchContent] = useState(SAMPLE_PAYLOADS[0].content);
  const [workbenchHash, setWorkbenchHash] = useState(
    'd41d8cd98f00b204e9800998ecf8427e990b7a819c43a027bc91024849182310'
  );
  const [isTamperedBit, setIsTamperedBit] = useState(false);

  const [calcAnswers, setCalcAnswers] = useState({
    calculatedPreFiling: true,
    wormTimestampRFC: true,
    writeBlockedHardware: false,
    unbrokenCustodyLog: true,
    examinerAffidavit: true,
  });

  const calculateEntropy = (str: string): number => {
    if (!str || str.length === 0) return 0;
    const freqs: { [key: string]: number } = {};
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      freqs[c] = (freqs[c] || 0) + 1;
    }
    let entropy = 0;
    for (const c in freqs) {
      const p = freqs[c] / str.length;
      entropy -= p * Math.log2(p);
    }
    return Math.min(8, Math.max(0, entropy));
  };

  const shannonEntropy = useMemo(
    () => calculateEntropy(workbenchContent),
    [workbenchContent]
  );

  const hexDump = useMemo(() => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(workbenchContent).slice(0, 16);
    return Array.from(bytes).map((b, i) => ({
      index: i,
      hex: b.toString(16).padStart(2, '0').toUpperCase(),
      char: b >= 32 && b <= 126 ? String.fromCharCode(b) : '·',
    }));
  }, [workbenchContent]);

  const handleSelectSample = async (idx: number) => {
    setActiveSampleIndex(idx);
    setIsTamperedBit(false);
    const sample = SAMPLE_PAYLOADS[idx];
    setWorkbenchContent(sample.content);
    const h = await computeSHA256(sample.content);
    setWorkbenchHash(h);
  };

  const handleToggleOneBitTamper = async () => {
    const base = SAMPLE_PAYLOADS[activeSampleIndex].content;
    const nextTampered = !isTamperedBit;
    const nextVal = nextTampered ? `${base} [1-BIT-MUTATED]` : base;
    setIsTamperedBit(nextTampered);
    setWorkbenchContent(nextVal);
    const h = await computeSHA256(nextVal);
    setWorkbenchHash(h);
  };

  const scrollToTestbench = (idx?: number) => {
    if (typeof idx === 'number') {
      handleSelectSample(idx);
    }
    const el = document.getElementById('forensic-testbench');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const readinessScore = useMemo(() => {
    let score = 0;
    if (calcAnswers.calculatedPreFiling) score += 20;
    if (calcAnswers.wormTimestampRFC) score += 20;
    if (calcAnswers.writeBlockedHardware) score += 20;
    if (calcAnswers.unbrokenCustodyLog) score += 20;
    if (calcAnswers.examinerAffidavit) score += 20;
    return score;
  }, [calcAnswers]);

  const currentExaminer = EXAMINERS[selectedExaminerIndex];

  return (
    <div className="w-full bg-[#050508] text-white overflow-x-clip font-sans selection:bg-[#E5192A] selection:text-white">
      {/* =========================================================================
          BAND 1: PHOTOREALISTIC NOIR DETECTIVE OFFICE HERO WITH SCROLL-TO-DESK CAMERA
          - Scroll = 0%: Matches attached Noir Detective Office image edge-to-edge
          - Scroll = 15%..85%: Smoothly dollies & zooms onto the Investigator's Desk
          - Scroll > 85%: Unpins & transitions into the rest of the Home screen
      ========================================================================= */}
      <DetectiveDeskScrollHero
        onOpenReportDrawer={onOpenReportDrawer}
        onNavigate={onNavigate}
        onScrollToTestbench={() => scrollToTestbench()}
      />

      {/* =========================================================================
          BAND 2: FULL-BLEED KINETIC VELOCITY MARQUEE
      ========================================================================= */}
      <KineticMarquee
        theme="light"
        variant="band"
        speed={0.85}
        items={[
          'F.I.P · FORENSIC INVESTIGATION PLATFORM',
          'SHA-256 WORM LEDGER',
          'SECTION 65B CERTIFIED',
          '1930 INTERDICTION',
          'CHAIN OF CUSTODY',
          'RFC-3161 IMMUTABLE',
        ]}
      />

      {/* =========================================================================
          BAND 3: ASYMMETRIC ARCHITECTURAL SHOWCASE
      ========================================================================= */}
      <section className="w-full bg-[#0B0B0E] text-white py-28 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <ScrollExpandBlock minScale={0.94} className="w-full space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10 items-start">
            <div className="lg:col-span-3 space-y-3">
              <div className="text-xs font-mono-code text-zinc-400">
                01. Core Mandate
              </div>
              <MaskedLineReveal>
                <div className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.04] text-white">
                  Capture.
                  <br />
                  Hash.
                  <br />
                  <span className="text-[#FF4D15]">Verify.</span>
                </div>
              </MaskedLineReveal>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <MaskedLineReveal delayMs={80}>
                <h2
                  className="text-3xl sm:text-5xl xl:text-6xl font-semibold tracking-tight text-white leading-[1.05]"
                  style={{ textWrap: 'balance' }}
                >
                  Different threats. One immutable chain.
                </h2>
              </MaskedLineReveal>
              <p className="text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed max-w-2xl">
                Whether mitigating an active UPI mule drain, archiving coerced video calls, or dissecting a malicious APK payload, every artifact obeys the same cryptographic Section 65B discipline.
              </p>
            </div>

            <div className="lg:col-span-3 lg:text-right space-y-5">
              <div className="text-xl sm:text-2xl font-semibold text-white">
                Your case integrity starts here.
              </div>
              <MagneticButton
                onClick={onOpenReportDrawer}
                className="px-8 py-4 rounded-full bg-white hover:bg-[#FF4D15] hover:text-white text-[#0B0B0E] text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-xl whitespace-nowrap shrink-0"
              >
                <span>File Evidence Complaint</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-3 flex flex-col items-center md:items-start">
              <div className="w-56 h-56 rounded-full border border-white/15 flex items-center justify-center p-7 text-center bg-[#101014] hover:border-[#FF4D15] hover:scale-105 transition-all duration-300 shadow-2xl group relative overflow-hidden">
                <div className="space-y-2 relative z-10">
                  <div className="text-base font-bold text-white">Zero byte deviation.</div>
                  <div className="text-xs text-zinc-400 leading-snug">
                    SHA-256 flags a 1-bit flip immediately before court submission.
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-6">
              <div
                onClick={() => scrollToTestbench()}
                className="cursor-pointer group rounded-full bg-[#141418] border border-white/12 hover:border-[#FF4D15]/70 h-56 sm:h-64 px-8 flex items-center justify-center overflow-hidden relative transition-all duration-300 shadow-2xl"
                title="Jump to Live SHA-256 Forensic Testbench"
              >
                <div className="w-full h-full max-w-2xl group-hover:scale-105 transition-transform duration-500">
                  <ForensicRibbonSculpture className="w-full h-full" />
                </div>
                <span className="absolute bottom-5 right-8 text-xs font-mono-code text-zinc-200 bg-[#0B0B0E]/90 px-4 py-2 rounded-full border border-white/15 group-hover:border-[#FF4D15] transition-colors">
                  Run Bit-Exact Hash ↗
                </span>
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col items-center md:items-end text-center md:text-right space-y-4">
              <button
                onClick={() => onNavigate('portals')}
                className="w-48 h-48 rounded-full border border-white/15 bg-[#121216] hover:border-[#FF4D15] flex flex-col items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 group shadow-2xl"
              >
                <Globe className="w-8 h-8 text-[#FF4D15] group-hover:rotate-45 transition-transform duration-300" />
                <span className="text-xs font-mono-code text-zinc-200 font-semibold">
                  1930 &amp; Global Nodes
                </span>
              </button>
              <div className="text-sm font-medium text-white max-w-[240px]">
                Judicial admissibility that holds under cross-examination.
              </div>
            </div>
          </div>
        </ScrollExpandBlock>
      </section>

      {/* =========================================================================
          BAND 4: SEE THE CHAIN. TRUST THE HASH.
      ========================================================================= */}
      <KineticMarquee
        theme="dark"
        variant="band"
        speed={0.95}
        items={[
          'SEE THE CHAIN',
          'TRUST THE HASH',
          'RFC-3161 TIME TOKENS',
          'ZERO TAMPER TOLERANCE',
        ]}
      />

      <section className="w-full bg-[#FFFFFF] text-[#0D0D10] border-b border-black/10 py-28 sm:py-36 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <ScrollExpandBlock minScale={0.94} className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-6 space-y-8">
            <div className="text-xs font-mono-code text-zinc-500 font-semibold">
              02. Continuous Cryptographic Integrity Pipeline
            </div>
            <MaskedLineReveal>
              <h2
                className="text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-[#0D0D10] leading-[1.02]"
                style={{ textWrap: 'balance' }}
              >
                See the chain.
                <br />
                Trust the hash.
              </h2>
            </MaskedLineReveal>
            <p className="text-sm sm:text-base lg:text-lg text-zinc-600 max-w-2xl leading-relaxed">
              Every block in your evidentiary timeline is chained cryptographically from raw acquisition through RFC-3161 anchoring and Section 65B court validation.
            </p>

            <StaggeredGrid staggerMs={110} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {PIPELINE_STEPS.map((stage) => {
                const Icon = stage.icon;
                return (
                  <div
                    key={stage.step}
                    onClick={() => onNavigate('how-it-works')}
                    className="cursor-pointer group rounded-3xl bg-[#F5F5F7] hover:bg-[#0D0D10] hover:text-white border border-black/10 p-6 transition-all duration-200 hover:-translate-y-1.5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono-code font-bold text-[#FF4D15]">
                        Step {stage.step}
                      </span>
                      <Icon className="w-5 h-5 text-[#FF4D15] group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <div className="text-base font-bold leading-snug">{stage.title}</div>
                    <div className="text-xs text-zinc-500 group-hover:text-zinc-300 mt-2 font-mono-code">
                      {stage.metric}
                    </div>
                  </div>
                );
              })}
            </StaggeredGrid>

            <div className="pt-2">
              <MagneticButton
                onClick={() => onNavigate('learning')}
                className="px-8 py-4 rounded-full bg-[#0D0D10] hover:bg-[#FF4D15] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-lg whitespace-nowrap shrink-0"
              >
                <span>Open Awareness &amp; URL Hub</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>

          <div className="lg:col-span-6 h-80 sm:h-[440px] flex items-center justify-center">
            <ChainTrustKineticArtwork />
          </div>
        </ScrollExpandBlock>
      </section>

      {/* =========================================================================
          BAND 5: ELITE 4-MEMBER EXAMINER OVERSIGHT CARDS
      ========================================================================= */}
      <section className="w-full bg-[#F5F5F7] text-[#0D0D10] py-28 sm:py-36 px-4 sm:px-6 lg:px-8 border-b border-black/10">
        <ScrollExpandBlock minScale={0.94} className="w-full space-y-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="text-xs font-mono-code text-zinc-500 font-semibold">
                03. Accredited Oversight Council
              </div>
              <MaskedLineReveal>
                <h2
                  className="text-4xl sm:text-6xl font-semibold tracking-tight text-[#0D0D10] leading-tight"
                  style={{ textWrap: 'balance' }}
                >
                  The examiners. The oversight.
                </h2>
              </MaskedLineReveal>
            </div>
            <p className="text-sm sm:text-base text-zinc-600 max-w-lg">
              All four accredited cyber forensic command leads supervise evidence validation. Select any officer card to assign their digital signature.
            </p>
          </div>

          <StaggeredGrid
            staggerMs={100}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-end"
          >
            {EXAMINERS.map((examiner, idx) => {
              const isSelected = selectedExaminerIndex === idx;
              const staggeredHeight =
                idx === 2
                  ? 'xl:min-h-[500px]'
                  : idx === 1
                  ? 'xl:min-h-[450px]'
                  : idx === 0
                  ? 'xl:min-h-[475px]'
                  : 'xl:min-h-[425px]';

              return (
                <div
                  key={examiner.badge}
                  onClick={() => setSelectedExaminerIndex(idx)}
                  className={`cursor-pointer group rounded-3xl overflow-hidden border flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 relative ${staggeredHeight} ${
                    isSelected
                      ? 'border-[#0D0D10] bg-white shadow-2xl ring-2 ring-[#FF4D15]/45'
                      : 'border-black/10 bg-white hover:border-black/30 shadow-sm'
                  }`}
                >
                  <div
                    className={`bg-gradient-to-br ${examiner.accentGradient} p-7 flex flex-col justify-between min-h-[230px] relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono-code text-zinc-300 z-10">
                      <span>{examiner.badge}</span>
                      <span className="text-[#FF4D15] font-bold tabular-nums">
                        {examiner.casesVerified.toLocaleString()} Sealed
                      </span>
                    </div>

                    <div className="my-5 flex items-center justify-center z-10">
                      {examiner.avatarUrl ? (
                        <div className="w-28 h-28 rounded-full border-2 border-[#FF4D15] bg-[#070709] overflow-hidden shadow-[0_0_30px_rgba(255,77,21,0.45)] group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={examiner.avatarUrl}
                            alt={examiner.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full border border-white/25 bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl font-black text-white shadow-xl group-hover:scale-105 transition-transform duration-300">
                          {examiner.initials}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono-code text-zinc-300 z-10">
                      <span>{examiner.jurisdiction}</span>
                      <span className={isSelected ? 'text-[#FF4D15] font-bold' : ''}>
                        {isSelected ? 'Active Signer' : 'Assign →'}
                      </span>
                    </div>
                  </div>

                  <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="text-xs font-mono-code text-[#FF4D15] font-semibold">
                        {examiner.specialty}
                      </div>
                      <div className="flex items-center gap-2.5">
                        {examiner.avatarUrl && (
                          <img
                            src={examiner.avatarUrl}
                            alt={examiner.name}
                            className="w-7 h-7 rounded-full object-cover object-top border border-[#FF4D15]"
                          />
                        )}
                        <h3 className="text-xl font-bold text-[#0D0D10]">{examiner.name}</h3>
                      </div>
                      <div className="text-xs font-semibold text-zinc-700">{examiner.role}</div>
                      <div className="text-xs text-zinc-500">{examiner.agency}</div>
                    </div>

                    <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed pt-3 border-t border-black/8">
                      {examiner.summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </StaggeredGrid>
        </ScrollExpandBlock>
      </section>

      {/* =========================================================================
          BAND 6: EVIDENCE DOCKETS — DISTINCT THREATS
      ========================================================================= */}
      <section className="w-full bg-white text-[#0D0D10] py-28 sm:py-36 px-4 sm:px-6 lg:px-8 border-b border-black/10">
        <ScrollExpandBlock minScale={0.94} className="w-full space-y-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-4">
              <button
                onClick={() => onNavigate('incidents')}
                className="px-7 py-3.5 rounded-full bg-[#0D0D10] hover:bg-[#FF4D15] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-md whitespace-nowrap shrink-0"
              >
                <span>Open Full Custody Vault</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-xs font-mono-code text-zinc-500 font-semibold">
                04. Featured Cases 2023 – 2026
              </div>
            </div>

            <div className="max-w-3xl">
              <MaskedLineReveal>
                <h2
                  className="text-3xl sm:text-5xl xl:text-6xl font-semibold tracking-tight text-[#0D0D10] leading-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Evidence dockets — distinct threats, one verified proof.
                </h2>
              </MaskedLineReveal>
              <p className="text-sm sm:text-base text-zinc-600 mt-3">
                Each docket carries a bespoke threat signature. Click any card to stream its payload directly into the SHA-256 variance testbench.
              </p>
            </div>
          </div>

          <StaggeredGrid
            staggerMs={110}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end"
          >
            {SAMPLE_PAYLOADS.map((item, idx) => {
              const isSelected = activeSampleIndex === idx;
              const staggeredHeight =
                idx === 2
                  ? 'lg:min-h-[480px]'
                  : idx === 1
                  ? 'lg:min-h-[430px]'
                  : idx === 0
                  ? 'lg:min-h-[385px]'
                  : 'lg:min-h-[405px]';

              return (
                <div
                  key={item.id}
                  onClick={() => scrollToTestbench(idx)}
                  className={`cursor-pointer group rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 border hover:-translate-y-2 relative overflow-hidden ${staggeredHeight} ${
                    isSelected
                      ? 'bg-[#0D0D10] text-white border-[#FF4D15] shadow-2xl'
                      : 'bg-[#141418] text-white border-black/15 hover:border-[#FF4D15]/70 shadow-lg'
                  }`}
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between text-xs font-mono-code">
                      <span className="text-zinc-300 font-semibold">{item.badge}</span>
                      <span className="text-[#FF4D15] font-bold tabular-nums">{item.year}</span>
                    </div>

                    <div className="h-36 sm:h-40 w-full rounded-2xl bg-[#09090C] border border-white/10 overflow-hidden p-3 group-hover:border-[#FF4D15]/50 transition-colors">
                      <DocketArtwork variant={item.artVariant} />
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#FF4D15] transition-colors">
                      {item.category}
                    </h3>
                    <div className="text-xs font-mono-code text-zinc-400 truncate">
                      {item.filename}
                    </div>
                    <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed line-clamp-2">
                      {item.summary}
                    </p>
                    <div className="pt-3.5 border-t border-white/10 flex items-center justify-between text-xs font-mono-code">
                      <span className="text-zinc-400 tabular-nums">
                        {(item.sizeBytes / 1024).toFixed(0)} KB
                      </span>
                      <span className="text-white font-semibold group-hover:text-[#FF4D15] inline-flex items-center gap-1">
                        <span>Inspect Hash</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </StaggeredGrid>
        </ScrollExpandBlock>
      </section>

      {/* =========================================================================
          BAND 7: SHA-256 VARIANCE TESTBENCH
      ========================================================================= */}
      <section
        id="forensic-testbench"
        className="w-full bg-[#F5F5F7] text-[#0D0D10] py-28 sm:py-36 px-4 sm:px-6 lg:px-8 border-b border-black/10"
      >
        <ScrollExpandBlock minScale={0.94} className="w-full space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <div className="text-xs font-mono-code text-[#FF4D15] font-semibold mb-2">
                05. Bit-Level SHA-256 Variance Engine
              </div>
              <MaskedLineReveal>
                <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight text-[#0D0D10]">
                  Test invariance in real time.
                </h2>
              </MaskedLineReveal>
            </div>
            <div className="lg:col-span-5 lg:text-right text-sm sm:text-base text-zinc-600 font-medium">
              Flip a single character below to witness instantaneous cryptographic hash avalanche across every byte.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 rounded-3xl bg-white border border-black/10 p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono-code font-bold text-[#0D0D10]">
                    01. Raw Stream Payload
                  </span>
                  <button
                    onClick={handleToggleOneBitTamper}
                    className={`px-4 py-2 rounded-full text-xs font-mono-code font-bold inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
                      isTamperedBit
                        ? 'bg-[#FF4D15] text-white'
                        : 'bg-[#F5F5F7] hover:bg-[#0D0D10] hover:text-white text-[#0D0D10] border border-black/10'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isTamperedBit ? 'Restore Original Bit' : 'Flip 1 Bit (Tamper Test)'}</span>
                  </button>
                </div>

                <span className="text-xs font-mono-code font-semibold text-[#0D0D10] tabular-nums">
                  Entropy: {shannonEntropy.toFixed(2)} bits/byte
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {SAMPLE_PAYLOADS.map((sample, idx) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(idx)}
                    className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      activeSampleIndex === idx
                        ? 'bg-[#0D0D10] text-white shadow-sm'
                        : 'bg-[#F5F5F7] text-zinc-700 border border-black/10 hover:border-black/30'
                    }`}
                  >
                    {sample.badge}
                  </button>
                ))}
              </div>

              <textarea
                value={workbenchContent}
                onChange={async (e) => {
                  const val = e.target.value;
                  setWorkbenchContent(val);
                  setIsTamperedBit(false);
                  const h = await computeSHA256(val);
                  setWorkbenchHash(h);
                }}
                rows={4}
                className="w-full p-5 rounded-2xl bg-[#F5F5F7] border border-black/10 text-xs sm:text-sm font-mono-code text-[#0D0D10] focus:outline-none focus:ring-2 focus:ring-[#FF4D15] transition-all resize-none"
              />

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono-code font-semibold text-zinc-500">
                  <span>First 16 Bytes Hex Matrix</span>
                  <span>{isTamperedBit ? 'Avalanche Detected' : 'Clean Stream'}</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 p-4 rounded-2xl bg-[#0D0D10] text-white font-mono-code text-xs text-center">
                  {hexDump.map((item) => (
                    <div key={item.index} className="p-2 rounded-lg bg-[#18181E]">
                      <div className="text-[#FF4D15] font-bold tabular-nums">{item.hex}</div>
                      <div className="text-[10px] text-zinc-400">{item.char}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div
                className="flex-1 rounded-3xl text-white p-8 sm:p-10 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden"
                style={{
                  background: isTamperedBit
                    ? 'linear-gradient(135deg, #2A0900 0%, #6D1D03 55%, #FF4D15 100%)'
                    : 'linear-gradient(135deg, #0D0D10 0%, #191920 65%, #3B1406 100%)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-code font-bold text-[#FF4D15] flex items-center gap-1.5">
                    <Hash className="w-4 h-4" />
                    <span>SHA-256 Digest Result</span>
                  </span>
                  <span className="text-xs font-mono-code text-zinc-300">RFC-3161</span>
                </div>

                <div className="p-5 rounded-2xl bg-black/45 border border-white/15 font-mono-code text-xs sm:text-sm text-white break-all tabular-nums leading-relaxed">
                  {workbenchHash}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white/8 border border-white/10">
                    <div className="text-[11px] font-mono-code text-zinc-400">Custody Status</div>
                    <div className="font-bold text-white mt-1 text-sm">
                      {isTamperedBit ? 'Hash Diverged' : 'RFC-3161 Sealed'}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/8 border border-white/10">
                    <div className="text-[11px] font-mono-code text-zinc-400">Examiner Signer</div>
                    <div className="font-bold text-white mt-1 text-sm truncate">
                      {currentExaminer.badge}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-black/10 p-8 flex flex-col justify-between space-y-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-mono-code text-zinc-500">
                      02. Section 65B Issuance
                    </div>
                    <div className="text-xl font-bold text-[#0D0D10]">
                      Seal Artifact Under WORM Custody
                    </div>
                  </div>
                  <FileCheck2 className="w-7 h-7 text-[#FF4D15]" />
                </div>

                <MagneticButton
                  onClick={onOpenReportDrawer}
                  className="w-full py-4 rounded-full bg-[#0D0D10] hover:bg-[#FF4D15] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Lock Evidence In Vault</span>
                  <ArrowUpRight className="w-4 h-4" />
                </MagneticButton>
              </div>
            </div>
          </div>
        </ScrollExpandBlock>
      </section>

      {/* =========================================================================
          BAND 8: HARDWARE WRITE-BLOCKER + ACTIVE SONAR RADAR
      ========================================================================= */}
      <section className="w-full bg-[#07070A] text-white py-28 sm:py-36 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <ScrollExpandBlock minScale={0.94} className="w-full space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="text-xs font-mono-code text-[#FF4D15] font-semibold">
                06. Hardware Custody &amp; Telemetry
              </div>
              <MaskedLineReveal>
                <h2
                  className="text-3xl sm:text-5xl xl:text-6xl font-semibold tracking-tight text-white"
                  style={{ textWrap: 'balance' }}
                >
                  Physical Write-Block Bridge &amp; Active Cyber Radar
                </h2>
              </MaskedLineReveal>
            </div>
            <p className="text-sm sm:text-base text-zinc-400 max-w-lg">
              Inspect hardware-enforced read-only imaging alongside real-time interdiction sweeps across Delhi IFSO, Maharashtra Cyber, and INTERPOL Lyon.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
            <div className="xl:col-span-8">
              <HardwareVault3D />
            </div>
            <div className="xl:col-span-4 rounded-[36px] bg-[#111115] border border-white/10 p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-2xl">
              <SonarGridCanvas />
              <p className="mt-5 text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
                Continuous automated sweeps correlate suspicious UPI mule accounts and malicious C2 endpoints against active F.I.P custody dockets.
              </p>
            </div>
          </div>
        </ScrollExpandBlock>
      </section>

      {/* =========================================================================
          BAND 9: PLATFORM IN FOCUS BENTO + READINESS CALCULATOR
          Matches the "The studio, in focus." 12-column Bento layout from Reference #1
      ========================================================================= */}
      <section className="w-full bg-[#F5F5F7] text-[#0D0D10] py-28 sm:py-36 px-4 sm:px-8 lg:px-12">
        <ScrollExpandBlock minScale={0.96} className="w-full space-y-14">
          {/* Header Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-6 border-b border-black/10">
            <div className="lg:col-span-7 space-y-2">
              <div className="text-xs font-mono-code text-[#FF4D15] font-semibold uppercase tracking-wider">
                07. Operational Metrics
              </div>
              <MaskedLineReveal>
                <h2 className="text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-[#0D0D10] leading-[1.02]">
                  The platform, in focus.
                </h2>
              </MaskedLineReveal>
              <p className="text-xs sm:text-sm font-mono-code text-zinc-500 pt-1">
                A live snapshot of our cryptographic custody practice.
              </p>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <p className="text-lg sm:text-2xl font-semibold tracking-tight text-[#0D0D10] leading-snug">
                Verified dockets, sovereign partnerships, and years of judicial custody practice.
              </p>
            </div>
          </div>

          {/* 12-Column Architectural Bento Grid (Row 1: 4+4+4, Row 2: 8+4) */}
          <StaggeredGrid
            staggerMs={90}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch"
          >
            {/* Card 1 (Cols 1-4): Editorial Mandate Card ("Small by choice. Close to the work." layout) */}
            <div className="md:col-span-6 lg:col-span-4 rounded-3xl bg-white border border-black/10 p-8 sm:p-10 flex flex-col justify-between min-h-[320px] hover:border-black/30 transition-all shadow-sm">
              <div className="space-y-4">
                <div className="text-[11px] font-mono-code text-zinc-400 uppercase tracking-wider font-semibold">
                  01 / Core Mandate
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#0D0D10] tracking-tight leading-snug">
                  Zero alteration.
                  <br />
                  Preserved from first capture.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  A focused cryptographic architecture built for citizens, legal counsel, and cyber crime investigating officers under a unified WORM audit log.
                </p>
              </div>
              <div className="pt-8 flex items-center justify-between border-t border-black/8">
                <div className="text-3xl sm:text-4xl font-mono-code font-bold tracking-tight text-[#FF4D15]">
                  [ fip. ]
                </div>
                <span className="text-xs font-mono-code text-zinc-400">
                  SHA-256 · Sec 65B
                </span>
              </div>
            </div>

            {/* Card 2 (Cols 5-8): Obsidian Metric Card ("24+ Projects brought to life." layout) */}
            <div
              onClick={() => onNavigate('incidents')}
              className="cursor-pointer group md:col-span-6 lg:col-span-4 rounded-3xl bg-[#0D0D10] text-white p-8 sm:p-10 flex flex-col justify-between min-h-[320px] shadow-xl hover:border-[#FF4D15]/60 border border-white/10 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-mono-code text-zinc-400 uppercase tracking-wider font-semibold">
                    02 / WORM Custody Ledger
                  </div>
                  <div className="text-5xl sm:text-7xl font-semibold tracking-tight tabular-nums pt-2">
                    14,000<span className="text-[#FF4D15]">+</span>
                  </div>
                </div>
                <span className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#FF4D15] flex items-center justify-center transition-colors shrink-0">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </span>
              </div>

              <div className="space-y-2 pt-8 border-t border-white/10">
                <div className="text-lg sm:text-xl font-semibold text-white">
                  Verified Evidence Hashes
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Across malicious APK binaries, coerced extortion streams, and UTR slips — anchored under immutable RFC-3161 timestamps.
                </p>
              </div>
            </div>

            {/* Card 3 (Cols 9-12): Sculptural 3D Chrome & Amber Glass Card ("6 Years of considered work." layout) */}
            <div
              onClick={() => onNavigate('portals')}
              className="cursor-pointer group md:col-span-12 lg:col-span-4 rounded-3xl text-white p-8 sm:p-10 flex flex-col justify-between min-h-[320px] relative overflow-hidden shadow-xl border border-black/15"
              style={{
                background:
                  'radial-gradient(circle at 82% 28%, rgba(255, 115, 35, 0.55) 0%, rgba(45, 17, 7, 0.92) 48%, #0E0E13 100%)',
              }}
            >
              {/* Sculptural Chrome & Amber Orb Visual Layer */}
              <div className="absolute -right-8 -top-8 w-56 h-56 pointer-events-none opacity-85 group-hover:scale-105 transition-transform duration-500">
                <ForensicRibbonSculpture className="w-full h-full" />
              </div>

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-mono-code text-amber-200/80 uppercase tracking-wider font-semibold">
                    03 / Golden Window
                  </div>
                  <div className="text-5xl sm:text-7xl font-semibold tracking-tight tabular-nums pt-2">
                    1930
                  </div>
                </div>
                <PhoneCall className="w-7 h-7 text-[#FF884D] shrink-0" />
              </div>

              <div className="relative z-10 space-y-2 pt-8 border-t border-white/15">
                <div className="text-lg sm:text-xl font-semibold text-white">
                  2-Hour Golden Window Interdiction
                </div>
                <p className="text-xs sm:text-sm text-zinc-200/90 leading-relaxed">
                  Direct nodal banking lien escalation halts fraudulent outward transfers before mule dispersal.
                </p>
              </div>
            </div>

            {/* Card 4 (Cols 1-8): Wide Partnerships Card ("12 Client partnerships." layout with 4 sub-cards) */}
            <div className="md:col-span-12 lg:col-span-8 rounded-3xl bg-white border border-black/10 p-8 sm:p-10 flex flex-col justify-between min-h-[290px] shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="text-5xl sm:text-7xl font-semibold tracking-tight text-[#0D0D10] tabular-nums">
                    250<span className="text-[#FF4D15]">+</span>
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-semibold text-[#0D0D10]">
                      Connected banking &amp; cyber command nodes.
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500">
                      Committed to sub-second lien freezes and cross-jurisdiction syndicate correlation.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('portals')}
                  className="text-xs font-mono-code font-bold text-[#FF4D15] hover:text-[#0D0D10] inline-flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                >
                  <span>View All Portals</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                {[
                  {
                    code: '01 / NATIONAL GRID',
                    name: 'I4C Command',
                    meta: '1930 Citizen & Lien API',
                    dark: false,
                  },
                  {
                    code: '02 / SPECIAL CELL',
                    name: 'Delhi IFSO',
                    meta: 'Sec 65B Judicial Bench',
                    dark: false,
                  },
                  {
                    code: '03 / NODAL FREEZE',
                    name: 'FIU-IND Nodal',
                    meta: '250+ Scheduled Banks',
                    dark: false,
                  },
                  {
                    code: '04 / GLOBAL DESK',
                    name: 'INTERPOL Cyber',
                    meta: 'Cross-Border Syndicate',
                    dark: true,
                  },
                ].map((node) => (
                  <div
                    key={node.name}
                    onClick={() => onNavigate('portals')}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[108px] ${
                      node.dark
                        ? 'bg-[#0D0D10] text-white border-[#0D0D10] hover:border-[#FF4D15]'
                        : 'bg-[#F5F5F7] text-[#0D0D10] border-black/8 hover:border-black/25 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`text-[10px] font-mono-code font-semibold ${
                        node.dark ? 'text-[#FF4D15]' : 'text-zinc-500'
                      }`}
                    >
                      {node.code}
                    </div>
                    <div className="pt-3">
                      <div className="text-sm font-bold">{node.name}</div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          node.dark ? 'text-zinc-400' : 'text-zinc-500'
                        }`}
                      >
                        {node.meta}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 5 (Cols 9-12): Admissibility Benchmark Card ("96% Client satisfaction." layout) */}
            <div className="md:col-span-12 lg:col-span-4 rounded-3xl bg-white border border-black/10 p-8 sm:p-10 flex flex-col justify-between min-h-[290px] shadow-sm hover:border-black/30 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono-code text-zinc-400 uppercase tracking-wider font-semibold">
                    05 / Judicial Admissibility
                  </span>
                  <ShieldCheck className="w-6 h-6 text-[#FF4D15]" />
                </div>
                <div className="text-5xl sm:text-7xl font-semibold tracking-tight text-[#0D0D10] tabular-nums pt-2">
                  100<span className="text-[#FF4D15]">%</span>
                </div>
              </div>

              <div className="space-y-2 pt-8 border-t border-black/8">
                <div className="text-lg sm:text-xl font-semibold text-[#0D0D10]">
                  Section 65B Audit Alignment
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Automated magistrate certificate generation and unbroken SHA-256 verification for every case docket.
                </p>
              </div>
            </div>
          </StaggeredGrid>


          <ScrollReveal className="rounded-3xl bg-white border border-black/10 p-8 sm:p-12 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="text-xs font-mono-code font-semibold text-[#FF4D15]">
                  08. Judicial Admissibility Diagnostic
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-[#0D0D10] tracking-tight">
                  Courtroom Readiness Audit Calculator
                </h3>
                <p className="text-sm text-zinc-600">
                  Toggle each verification safeguard to evaluate whether your evidence survives Section 65B scrutiny.
                </p>
              </div>

              <div className="px-9 py-6 rounded-2xl bg-[#0D0D10] text-white text-center font-mono-code shrink-0 shadow-lg">
                <div className="text-xs text-zinc-400">Readiness Score</div>
                <div className="text-4xl sm:text-5xl font-black text-[#FF4D15] tabular-nums">
                  {readinessScore}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-3">
                {[
                  {
                    key: 'calculatedPreFiling',
                    title: 'Did you compute the SHA-256 hash prior to third-party transmission?',
                    weight: '20%',
                  },
                  {
                    key: 'wormTimestampRFC',
                    title: 'Is the proof anchored inside a Write-Once-Read-Many (WORM) ledger?',
                    weight: '20%',
                  },
                  {
                    key: 'writeBlockedHardware',
                    title: 'Was physical media imaged via a hardware write-blocker (Tableau)?',
                    weight: '20%',
                  },
                  {
                    key: 'unbrokenCustodyLog',
                    title: 'Does an unbroken UTC audit log track every custody transfer?',
                    weight: '20%',
                  },
                  {
                    key: 'examinerAffidavit',
                    title: 'Is the file certified by an accredited cyber forensic examiner?',
                    weight: '20%',
                  },
                ].map((q) => {
                  const active = calcAnswers[q.key as keyof typeof calcAnswers];
                  return (
                    <div
                      key={q.key}
                      onClick={() =>
                        setCalcAnswers((prev) => ({
                          ...prev,
                          [q.key]: !prev[q.key as keyof typeof calcAnswers],
                        }))
                      }
                      className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        active
                          ? 'bg-[#0D0D10] border-[#0D0D10] text-white'
                          : 'bg-[#F5F5F7] border-black/10 text-zinc-700 hover:border-black/30'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            active ? 'bg-[#FF4D15] text-white' : 'bg-white border border-black/20'
                          }`}
                        >
                          {active ? '✓' : ''}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{q.title}</span>
                      </div>
                      <span className="text-xs font-mono-code font-bold text-[#FF4D15] tabular-nums shrink-0">
                        {q.weight}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-4 p-8 sm:p-10 rounded-2xl bg-[#F5F5F7] border border-black/10 space-y-6">
                <div className="text-xs font-mono-code font-semibold text-zinc-500">
                  Compliance Verdict
                </div>
                <div className="text-base font-semibold leading-relaxed text-[#0D0D10]">
                  {readinessScore >= 80
                    ? 'High Court Trial Ready: Chain-of-custody safeguards meet Section 65B(4) evidentiary standards.'
                    : 'Integrity Exposure: Defense counsel may challenge unsealed artifacts as mutable.'}
                </div>
                <MagneticButton
                  onClick={onOpenReportDrawer}
                  className="w-full py-4 rounded-full bg-[#FF4D15] hover:bg-[#E03E0B] text-white font-bold text-xs transition-colors shadow-lg"
                >
                  Upgrade To 100% WORM Proof
                </MagneticButton>
              </div>
            </div>
          </ScrollReveal>
        </ScrollExpandBlock>
      </section>

      {/* =========================================================================
          BAND 10: END-TO-END OBSIDIAN FINALE CTA
      ========================================================================= */}
      <section className="w-full bg-[#0B0B0E] text-white py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <ScrollReveal className="w-full space-y-7">
          <div className="text-xs font-mono-code text-zinc-500 font-semibold">
            09. Immediate Custody Protection
          </div>
          <MaskedLineReveal>
            <h2
              className="text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-white max-w-4xl leading-[1.03]"
              style={{ textWrap: 'balance' }}
            >
              Let&apos;s lock your evidence with certainty.
            </h2>
          </MaskedLineReveal>
          <p className="text-sm sm:text-base lg:text-lg text-zinc-400 max-w-xl">
            Preserve mobile APKs, extortion recordings, and UTR transaction slips under immutable SHA-256 custody right now.
          </p>
          <div className="pt-2">
            <MagneticButton
              onClick={onOpenReportDrawer}
              className="px-9 py-4 rounded-full bg-white hover:bg-[#FF4D15] hover:text-white text-[#0B0B0E] font-bold text-xs sm:text-sm inline-flex items-center gap-2.5 transition-colors shadow-2xl whitespace-nowrap shrink-0"
            >
              <span>Initialize Evidence Docket</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
