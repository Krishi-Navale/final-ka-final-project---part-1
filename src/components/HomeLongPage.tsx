import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Lock, 
  Hash, 
  Database, 
  FileText, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  PhoneCall, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Radio, 
  Eye, 
  Copy, 
  Check, 
  Cpu, 
  Activity, 
  FileCheck, 
  ShieldAlert, 
  Compass, 
  ExternalLink,
  Key,
  BadgeAlert,
  Sliders,
  Terminal,
  Upload,
  HardDrive,
  FileCode,
  AlertOctagon,
  HelpCircle,
  Clock,
  Zap,
  Globe,
  Award
} from 'lucide-react';
import { computeSHA256 } from '../utils/crypto';
import { HeroCanvasTracker } from './effects/HeroCanvasTracker';
import { SonarGridCanvas } from './effects/SonarGridCanvas';
import { MagneticButton } from './effects/MagneticButton';
import { ScrollReveal } from './effects/ScrollReveal';
import { InvestigatorCarousel } from './InvestigatorCarousel';
import { HardwareVault3D } from './effects/HardwareVault3D';
import { InteractiveForensicToken } from './effects/InteractiveForensicToken';

interface HomeLongPageProps {
  onOpenReportDrawer: () => void;
  onNavigate: (tab: string) => void;
}

// Sample Payload Files for the Testbench
interface SamplePayload {
  id: string;
  filename: string;
  category: string;
  sizeBytes: number;
  content: string;
  icon: string;
  badge: string;
}

const SAMPLE_PAYLOADS: SamplePayload[] = [
  {
    id: 'pay-1',
    filename: 'BijliBill_Update_v2.4.apk',
    category: 'Electricity Scam Trojan',
    sizeBytes: 4892010,
    content: 'APK-BINARY-HEADER: PK\x03\x04 AndroidManifest.xml package="com.bijlibill.update" uses-permission="android.permission.RECEIVE_SMS" uses-permission="android.permission.BIND_ACCESSIBILITY_SERVICE" C2_HOST="185.220.101.42:8443" EXFILTRATE_BANK_OTP=true',
    icon: '⚡',
    badge: 'SMS Trojan'
  },
  {
    id: 'pay-2',
    filename: 'cbi_courtroom_skype_arrest.mp4',
    category: 'Digital Arrest Deepfake Call',
    sizeBytes: 18400290,
    content: 'AUDIO-VIDEO-CONTAINER: ftypisom VideoTrack: H.264 1080p 30fps AudioTrack: AAC 48kHz Impersonator="Inspector General Alok Verma" ExtortionDemand="Transfer ₹25,00,000 to RBI Clearance Account to stay arrest warrant"',
    icon: '👮',
    badge: 'Video Extortion'
  },
  {
    id: 'pay-3',
    filename: 'telegram_task_utr_debit.pdf',
    category: 'Telegram Task VIP Escrow Slip',
    sizeBytes: 1104820,
    content: 'BANK-TRANSACTION-SLIP: UTR="IN-948102837190" Debited="₹1,48,500.00" Beneficiary_UPI="powerelectric99@axl" Mule_Account="5010049281920" IFSC="HDFC0000492" Timestamp="2026-10-08 14:22:10 UTC" Status="FLAGGED_1930"',
    icon: '💸',
    badge: 'Mule Slip'
  },
  {
    id: 'pay-4',
    filename: 'whatsapp_blackmail_threat.png',
    category: 'Coercive Threat Chat & EXIF',
    sizeBytes: 842100,
    content: 'IMAGE-EXIF-STREAM: PNG-IHDR width=1080 height=2400 EXIF_DEVICE="OnePlus Nord" ThreatText="Pay ₹50,000 in 30 minutes or this morphed video will be sent to all your LinkedIn contacts" Sender="+91-98210-44912"',
    icon: '📱',
    badge: 'Chat EXIF'
  },
  {
    id: 'pay-5',
    filename: 'ransomware_decrypt_readme.txt',
    category: 'Ransomware Extortion Memo',
    sizeBytes: 14200,
    content: 'RANSOM-NOTE: LockBit 3.0 / All your accounting files and client database are encrypted with AES-256-GCM. Personal ID: 94810-DEL-CYBER. TOR Portal: http://lockbit77...onion Deposit: 0.85 BTC',
    icon: '🔒',
    badge: 'Ransom Memo'
  }
];

export const HomeLongPage: React.FC<HomeLongPageProps> = ({
  onOpenReportDrawer,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'results' | 'stories'>('results');
  const [selectedExaminerIndex, setSelectedExaminerIndex] = useState(0);

  // ==========================================
  // SECTION 2: DIGITAL EVIDENCE TESTBENCH STATE (CLEAN GOVERNMENT THEME)
  // ==========================================
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [workbenchContent, setWorkbenchContent] = useState(SAMPLE_PAYLOADS[0].content);
  const [workbenchHash, setWorkbenchHash] = useState('d41d8cd98f00b204e9800998ecf8427e990b7a819c43a027bc91024849182310');
  const [workbenchCopied, setWorkbenchCopied] = useState(false);
  const [tamperOffset, setTamperOffset] = useState<number>(0);
  const [isTamperedByte, setIsTamperedByte] = useState<boolean>(false);
  const [isSignedSeal, setIsSignedSeal] = useState<boolean>(false);

  // Shannon Entropy
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

  const shannonEntropy = useMemo(() => calculateEntropy(workbenchContent), [workbenchContent]);

  // First 16 bytes hex dump
  const hexDump = useMemo(() => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(workbenchContent).slice(0, 16);
    return Array.from(bytes).map((b, i) => ({
      index: i,
      hex: b.toString(16).padStart(2, '0').toUpperCase(),
      char: b >= 32 && b <= 126 ? String.fromCharCode(b) : '·',
      isTampered: isTamperedByte && i === tamperOffset
    }));
  }, [workbenchContent, isTamperedByte, tamperOffset]);

  // Handle switching sample file in workbench
  const handleSelectSample = async (idx: number) => {
    setActiveSampleIndex(idx);
    const sample = SAMPLE_PAYLOADS[idx];
    setWorkbenchContent(sample.content);
    setIsTamperedByte(false);
    setIsSignedSeal(false);
    const h = await computeSHA256(sample.content);
    setWorkbenchHash(h);
  };

  const handleWorkbenchTextChange = async (val: string) => {
    setWorkbenchContent(val);
    setIsTamperedByte(false);
    const h = await computeSHA256(val);
    setWorkbenchHash(h);
  };

  const handleSimulateTamperSlider = async (offset: number) => {
    setTamperOffset(offset);
    setIsTamperedByte(true);
    const chars = workbenchContent.split('');
    const targetIdx = Math.min(offset, chars.length - 1);
    chars[targetIdx] = chars[targetIdx] === 'X' ? 'Y' : 'X';
    const mutated = chars.join('');
    setWorkbenchContent(mutated);
    const h = await computeSHA256(mutated);
    setWorkbenchHash(h);
  };

  const handleResetWorkbench = async () => {
    const orig = SAMPLE_PAYLOADS[activeSampleIndex].content;
    setWorkbenchContent(orig);
    setIsTamperedByte(false);
    setIsSignedSeal(false);
    const h = await computeSHA256(orig);
    setWorkbenchHash(h);
  };

  // ==========================================
  // SECTION 3: TACTICAL INTERDICTION RADAR STATE (CLEAN GOVERNMENT THEME)
  // ==========================================
  const [selectedCellNode, setSelectedCellNode] = useState<'DEL' | 'MAH' | 'INT' | 'I4C'>('I4C');
  const [radarFilter, setRadarFilter] = useState<'ALL' | 'MULE' | 'APK' | 'ARREST'>('ALL');
  const [activeMuleIncident, setActiveMuleIncident] = useState<{
    id: string;
    target: string;
    amount: string;
    bank: string;
    officer: string;
    hash: string;
  } | null>({
    id: '1930-IN-948102',
    target: 'powerelectric99@axl',
    amount: '₹1,48,500 INR',
    bank: 'HDFC Mule Node (Branch 0492)',
    officer: 'Bibi Zohara (DEL-CY-0842)',
    hash: '8f4b2a71d93021fe3a10599bb1049281aef42019'
  });

  const CYBER_CELLS = [
    { id: 'I4C', name: 'I4C National Coordination Hub', lead: 'Krishi N', badge: 'I4C-NAT-7721', streams: '14,200 Citizen Claims', color: 'text-emerald-700 bg-emerald-50' },
    { id: 'DEL', name: 'IFSO Special Cell, Delhi Police', lead: 'Bibi Zohara', badge: 'DEL-CY-0842', streams: '42 Active Triage Streams', color: 'text-orange-700 bg-orange-50' },
    { id: 'MAH', name: 'Maharashtra Cyber Directorate', lead: 'Balchandra K', badge: 'MAH-CY-1109', streams: '58 Active Triage Streams', color: 'text-rose-700 bg-rose-50' },
    { id: 'INT', name: 'INTERPOL Cyber Gateway / Lyon', lead: 'Afsheen S', badge: 'INT-CY-4902', streams: '19 Red Notice Interdictions', color: 'text-purple-700 bg-purple-50' },
  ];

  const MULE_FEED = [
    { id: '1930-IN-948102', target: 'powerelectric99@axl', amount: '₹1,48,500', bank: 'HDFC Mule 0492', officer: 'Bibi Zohara', type: 'MULE', hash: '8f4b2a71d93021fe3a10599bb1049281aef42019' },
    { id: '1930-IN-889104', target: 'fastloan88@ybl', amount: '₹2,50,000', bank: 'SBI Nodal 1109', officer: 'Balchandra K', type: 'APK', hash: '3a71b9948210492faefb90192840192938104281' },
    { id: '1930-IN-774102', target: 'cbiofficer.verify@icici', amount: '₹25,00,000', bank: 'ICICI Escrow 4902', officer: 'Krishi N', type: 'ARREST', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4' },
    { id: 'INT-LYON-00214', target: 'lockbit-payout-btc-09', amount: '$420,000', bank: 'Crypto Gate Lyon', officer: 'Afsheen S', type: 'MULE', hash: '11e4f29019283746501928374650192837465019' },
  ];

  const filteredMuleFeed = useMemo(() => {
    if (radarFilter === 'ALL') return MULE_FEED;
    return MULE_FEED.filter(m => m.type === radarFilter);
  }, [radarFilter]);

  // ==========================================
  // SECTION 10: COURTROOM READINESS CALCULATOR
  // ==========================================
  const [calcAnswers, setCalcAnswers] = useState({
    calculatedPreFiling: true,
    wormTimestampRFC: true,
    writeBlockedHardware: false,
    unbrokenCustodyLog: true,
    examinerAffidavit: true,
  });

  const readinessScore = useMemo(() => {
    let score = 0;
    if (calcAnswers.calculatedPreFiling) score += 20;
    if (calcAnswers.wormTimestampRFC) score += 20;
    if (calcAnswers.writeBlockedHardware) score += 20;
    if (calcAnswers.unbrokenCustodyLog) score += 20;
    if (calcAnswers.examinerAffidavit) score += 20;
    return score;
  }, [calcAnswers]);

  // Accredited Examiners List
  const examinersList = [
    {
      id: 'ex-1',
      name: 'Bibi Zohara',
      role: 'Lead Cyber Forensic Examiner',
      agency: 'IFSO Special Cell, Delhi Police',
      badge: 'DEL-CY-0842',
      cases: '2,420 Verified',
      color: 'from-orange-500 to-amber-600',
      tag: 'Lead Examiner',
      jurisdiction: 'National Capital Region / Delhi',
      pubKeyFingerprint: '4E8A:29B1:77C4:F021:AA83',
      specialty: 'Mobile APK Trojans, WhatsApp Extortion & Bit-level Memory Dumps'
    },
    {
      id: 'ex-2',
      name: 'Balchandra K',
      role: 'Evidence & Custody Inspector',
      agency: 'Maharashtra Cyber Crime Directorate',
      badge: 'MAH-CY-1109',
      cases: '2,180 Verified',
      color: 'from-rose-600 to-orange-700',
      tag: 'Custody Chief',
      jurisdiction: 'Western Zone / Mumbai',
      pubKeyFingerprint: '77D1:90FA:22C3:BB48:0912',
      specialty: 'Financial Mule Ring Tracking, Bank UTR Interdiction & Section 65B Affidavits'
    },
    {
      id: 'ex-3',
      name: 'Afsheen S',
      role: 'Malware Reverse Engineer',
      agency: 'INTERPOL Cyber Directorate',
      badge: 'INT-CY-4902',
      cases: '2,890 Verified',
      color: 'from-purple-600 to-indigo-800',
      tag: 'Binary Analyst',
      jurisdiction: 'Global Liaison / Lyon HQ',
      pubKeyFingerprint: '91AA:334E:B720:DD19:55F2',
      specialty: 'Cross-Border Ransomware, Botnet C2 Disruption & Remote Access Trojans'
    },
    {
      id: 'ex-4',
      name: 'Krishi N',
      role: 'Chief Forensic Interdiction Officer',
      agency: 'National Cyber Crime Hub (I4C)',
      badge: 'I4C-NAT-7721',
      cases: '3,640 Verified',
      color: 'from-emerald-600 to-teal-800',
      tag: 'Sec 65B Certifier',
      jurisdiction: 'Ministry of Home Affairs / India',
      pubKeyFingerprint: '11B8:44A0:9981:FE33:78C9',
      specialty: '1930 Nodal Golden Hour Freezes, Deepfake Voice Biometrics & Courtroom Attestation'
    }
  ];

  const currentExaminer = examinersList[selectedExaminerIndex];

  // Bento Stages
  const bentoStages = [
    {
      num: '01',
      title: 'Volatile RAM & Client-Side SHA-256 Hashing',
      subtitle: 'NIST FIPS 180-4 Engine',
      desc: 'Before bits touch a public transmission socket, the client browser calculates a 256-bit cryptographic digest. This establishes the baseline ground truth of raw evidence bits.',
      metric: '0.04s Execution',
      code: 'crypto.subtle.digest("SHA-256", buffer)'
    },
    {
      num: '02',
      title: 'Write-Once-Read-Many (WORM) Storage & RFC 3161',
      subtitle: 'Immutable Archival Invariant',
      desc: 'The cryptographic digest is permanently anchored in append-only storage with trusted NTP atomic clocks. No administrative database privilege or court subpoena can overwrite historical bytes.',
      metric: '100% Immutable',
      code: 'WORM_SEAL_LOCKED_FOREVER'
    },
    {
      num: '03',
      title: 'Accredited Senior Examiner Attestation',
      subtitle: 'Cyber Forensics Wings',
      desc: 'Bibi Zohara, Balchandra K, Afsheen S, and Krishi N independently hash the raw payload and sign off using certified ECDSA cryptographic keys.',
      metric: 'Bibi, Balchandra, Afsheen, Krishi',
      code: 'INSPECTOR_ECDSA_SIGNATURE'
    },
    {
      num: '04',
      title: 'Section 65B & Section 63 BSA Judicial Certificate',
      subtitle: 'Statutory Admissibility',
      desc: 'Generates an unassailable electronic evidence affidavit citing Supreme Court precedents (Arjun Panditrao Khotkar) that is admitted directly by magistrate judges.',
      metric: 'Magistrate Certified',
      code: 'SEC_65B_4_AFFIDAVIT_SEAL'
    }
  ];

  return (
    <div className="w-full bg-[#FAFAFC] text-slate-900 overflow-hidden font-sans">
      
      {/* =========================================================================
          SECTION 1: HERO SECTION (SCREEN-FILLING, AESTHETIC & DYNAMIC)
      ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 pb-20 px-4 sm:px-8 lg:px-12 xl:px-16 w-full max-w-[1760px] 2xl:max-w-[1880px] mx-auto overflow-hidden">
        
        {/* Interactive Canvas Background & Cursor Tracker */}
        <HeroCanvasTracker />

        {/* Dynamic Radiant Ambient Blobs */}
        <div className="absolute top-10 left-10 w-[550px] h-[550px] bg-amber-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-10 w-[650px] h-[650px] bg-orange-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Header Row of Hero with Staggered Scroll-Driven Pop-Up */}
        <ScrollReveal yOffset={50} delayMs={0} className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm w-fit">
            <span>🛡️ National Forensic Evidence Custody Infrastructure</span>
            <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-ping" />
            <span className="text-[#FF5A1F] font-mono-code font-bold">WORM RFC-3161</span>
          </div>
          
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 font-mono-code bg-white px-4 py-2 rounded-full border border-slate-200 shadow-2xs">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sec. 65B & Sec. 63 BSA Compliant
            </span>
            <span>·</span>
            <span className="text-slate-800 font-bold">4 Senior Inspectors</span>
            <span>·</span>
            <span className="text-[#FF5A1F] font-bold">100% Immutable</span>
          </div>
        </ScrollReveal>

        {/* Big Bold Headline with Funky Orange Sticker Badge */}
        <ScrollReveal yOffset={50} delayMs={80} className="relative z-10 mb-10">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem] font-black tracking-tight text-slate-950 leading-[0.94]">
            Forensic Investigation <br />
            Evidence Custody <br />
            <span className="badge-sticker-orange px-6 py-2.5 inline-block text-4xl sm:text-6xl md:text-8xl lg:text-9xl mt-3 tracking-tight shadow-orange-500/30">
              PLATFORM
            </span>
          </h1>

          <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
            <div className="space-y-2 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A1F] bg-orange-50 px-4 py-1.5 rounded-full border border-orange-200 w-fit inline-flex items-center gap-2 shadow-2xs font-mono-code">
                <Sparkles className="w-3 h-3 text-[#FF5A1F]" />
                <span>Audited by Bibi Zohara · Balchandra K · Afsheen S · Krishi N</span>
              </span>
              <p className="text-base sm:text-xl text-slate-600 leading-relaxed font-medium">
                Citizens safely report cyber incidents by locking screenshots, audio recordings, bank slips, and APK trojans into 
                <strong> tamper-proof SHA-256 cryptographic digests</strong> under <strong>Write-Once-Read-Many (WORM)</strong> rules for magistrate court admissibility.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Dynamic Holographic Telemetry Strip */}
        <ScrollReveal yOffset={50} delayMs={140} className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center font-bold font-mono-code">
              #256
            </div>
            <div>
              <div className="text-[10px] font-mono-code uppercase font-bold text-slate-400">Hashing Invariant</div>
              <div className="text-xs sm:text-sm font-black text-slate-900">SHA-256 Bit-Level</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code uppercase font-bold text-slate-400">Legal Standard</div>
              <div className="text-xs sm:text-sm font-black text-slate-900">Section 65B(4) Certified</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code uppercase font-bold text-slate-400">Examiner Council</div>
              <div className="text-xs sm:text-sm font-black text-slate-900">4 Accredited Inspectors</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code uppercase font-bold text-slate-400">Emergency Interdiction</div>
              <div className="text-xs sm:text-sm font-black text-slate-900">1930 Nodal Link Active</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Hero Interactive 3D Forensic Token Console (REPLACING THE PLAIN CIRCLE) */}
        <ScrollReveal yOffset={50} delayMs={180} className="relative z-10 bg-white rounded-[44px] p-6 sm:p-12 border border-slate-200 shadow-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Mission & Senior Inspectors */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-mono-code font-bold">
                <span>Active Forensic Examiner Community</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                Authenticating Digital Proof <br />
                Before It Reaches The Courtroom
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                In every cyber fraud case, corrupt actors delete chats, wipe servers, or claim the victim's screenshots were faked in Photoshop. ForensiCrypt establishes mathematical immutability before trial proceedings begin.
              </p>

              {/* 4 Inspector Cards Mini-Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {examinersList.map((ex, idx) => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExaminerIndex(idx)}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      selectedExaminerIndex === idx
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="text-xs font-black truncate">{ex.name}</div>
                    <div className="text-[10px] opacity-75 truncate">{ex.agency.split(',')[0]}</div>
                    <div className="text-[10px] font-mono-code text-[#FF5A1F] font-bold mt-1">{ex.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: NEW INTERACTIVE 3D FORENSIC TOKEN CONSOLE */}
            <div className="lg:col-span-5 flex flex-col items-center bg-slate-50 p-6 rounded-3xl border border-slate-200">
              <InteractiveForensicToken
                activeExaminerName={currentExaminer.name}
                activeBadge={currentExaminer.badge}
              />
            </div>

          </div>
        </ScrollReveal>

      </section>


      {/* =========================================================================
          SECTION 2: DIGITAL EVIDENCE INVESTIGATION TESTBENCH
          (CLEAN GOVERNMENT WHITE/SLATE THEME - NO BLACK BACKGROUND VOID!)
      ========================================================================= */}
      <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-16 w-full max-w-[1760px] 2xl:max-w-[1880px] mx-auto">
        <ScrollReveal yOffset={50}>
          <div className="bg-white text-slate-900 rounded-[44px] p-6 sm:p-14 border border-slate-200 shadow-xl relative overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#FF5A1F] flex items-center gap-2 mb-2">
                  <Terminal className="w-4 h-4 text-[#FF5A1F]" />
                  <span>Digital Forensics Laboratory Testbench</span>
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950">
                  Live Evidence Ingestion & Byte Inspector
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl font-medium">
                  Test authentic evidence payloads across multiple file types. Inspect raw hex bytes, measure Shannon entropy, and simulate bit-level tampering in real time.
                </p>
              </div>

              {/* Entropy Metric Pill */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-5 shrink-0 shadow-2xs">
                <div>
                  <div className="text-[10px] font-mono-code text-slate-500 uppercase font-bold">Shannon Entropy</div>
                  <div className="text-xl font-mono-code font-black text-slate-900">
                    {shannonEntropy.toFixed(3)} <span className="text-xs font-normal text-slate-500">bits/byte</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono-code text-slate-500 uppercase font-bold">Byte Length</div>
                  <div className="text-xl font-mono-code font-black text-emerald-700">
                    {new TextEncoder().encode(workbenchContent).length} B
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1: Payload File Selector Tabs */}
            <div className="mb-6 space-y-2">
              <div className="text-xs font-mono-code font-bold text-slate-500 uppercase">
                Select Raw Evidence Payload To Mount:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {SAMPLE_PAYLOADS.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectSample(idx)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      activeSampleIndex === idx
                        ? 'bg-orange-50/70 border-[#FF5A1F] ring-1 ring-[#FF5A1F] text-slate-950 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-base mb-1">
                      <span>{p.icon}</span>
                      <span className="text-[9px] font-mono-code font-bold px-1.5 py-0.5 rounded bg-white text-slate-800 border border-slate-200">
                        {p.badge}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 truncate">{p.filename}</div>
                    <div className="text-[10px] text-slate-500 truncate">{p.category}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Split Screen: Hex Dump Matrix & Editable Raw Byte Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
              
              {/* Left Column (lg:col-span-7): Raw Stream Editor */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono-code font-bold">Raw Payload Stream Buffer:</span>
                  <button
                    onClick={handleResetWorkbench}
                    className="text-[11px] font-mono-code text-[#FF5A1F] hover:underline font-bold"
                  >
                    Reset Original Bytes
                  </button>
                </div>
                
                <textarea
                  value={workbenchContent}
                  onChange={(e) => handleWorkbenchTextChange(e.target.value)}
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono-code text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:bg-white leading-relaxed shadow-inner"
                />

                {/* Interactive Tamper Slider */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-code">
                    <span className="text-slate-700 flex items-center gap-1.5 font-bold">
                      <Sliders className="w-3.5 h-3.5 text-[#FF5A1F]" />
                      <span>Tamper Slider: Alter Byte at Offset [{tamperOffset}]</span>
                    </span>
                    <span className={`font-bold ${isTamperedByte ? 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded' : 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded'}`}>
                      {isTamperedByte ? 'MUTATED BYTE DETECTED' : 'UNALTERED VAULT BYTES'}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={Math.min(32, workbenchContent.length - 1)}
                    value={tamperOffset}
                    onChange={(e) => handleSimulateTamperSlider(Number(e.target.value))}
                    className="w-full accent-[#FF5A1F] cursor-pointer"
                  />

                  <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-500">
                    <span>Byte 0</span>
                    <span>Slide to introduce single-bit mutation and watch hash flip</span>
                    <span>Byte 32</span>
                  </div>
                </div>

              </div>

              {/* Right Column (lg:col-span-5): 16-Byte Hex Dump Visualizer */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs font-mono-code text-slate-500 flex items-center justify-between">
                  <span className="font-bold">Hex Dump (First 16 Bytes):</span>
                  <span className="text-[10px] text-emerald-700 font-bold">NIST Memory View</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono-code text-xs space-y-3 shadow-inner">
                  <div className="grid grid-cols-8 gap-2 text-center text-[11px]">
                    {hexDump.map((item) => (
                      <div
                        key={item.index}
                        className={`p-1.5 rounded-lg border transition-all ${
                          item.isTampered
                            ? 'bg-rose-100 border-rose-400 text-rose-800 font-bold animate-pulse'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-bold">{item.hex}</div>
                        <div className="text-[9px] text-slate-500">{item.char}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between font-bold">
                    <span>Endianness: Little-Endian</span>
                    <span>Checksum: CRC32 + SHA-256</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Computed SHA-256 Digest Box & Senior Examiner Sign-Off */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="font-mono-code font-bold text-slate-900 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[#FF5A1F]" />
                  <span>Computed SHA-256 WORM Digest:</span>
                </span>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold uppercase ${
                    isTamperedByte ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isTamperedByte ? 'TAMPER ALERT: HASH DIVERGED' : 'COURT VALIDATED INVARIANT'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white font-mono-code text-xs text-slate-900 font-bold break-all rounded-2xl border border-slate-200 leading-relaxed shadow-inner">
                {workbenchHash}
              </div>

              {/* Senior Examiner Sign-Off Seal Bar */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsSignedSeal(!isSignedSeal)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition-all flex items-center gap-2 border ${
                      isSignedSeal
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isSignedSeal ? 'Sealed by Krishi N · DEL-CY-0842 ✓' : 'Click To Apply Examiner Cryptographic Seal'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(workbenchHash);
                      setWorkbenchCopied(true);
                      setTimeout(() => setWorkbenchCopied(false), 2000);
                    }}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono-code font-semibold transition-colors flex items-center gap-1.5"
                  >
                    {workbenchCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{workbenchCopied ? 'Copied' : 'Copy Digest'}</span>
                  </button>

                  <button
                    onClick={onOpenReportDrawer}
                    className="px-5 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04B14] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
                  >
                    <span>Commit Payload To Vault ↗</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </ScrollReveal>
      </section>


      {/* =========================================================================
          SECTION 3: LIVE CYBER INCIDENT MONITOR GRID & RADAR
          (CLEAN GOVERNMENT WHITE/SLATE THEME - NO BLACK BACKGROUND VOID!)
      ========================================================================= */}
      <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-16 w-full max-w-[1760px] 2xl:max-w-[1880px] mx-auto">
        <ScrollReveal yOffset={50}>
          <div className="bg-white text-slate-900 rounded-[44px] p-6 sm:p-14 border border-slate-200 shadow-xl relative overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#FF5A1F] flex items-center gap-2">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>National Cyber Interdiction Radar & Operations Grid</span>
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 mt-1">
                  Live Incident Telemetry & 1930 Mule Feed
                </h2>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-mono-code">
                {(['ALL', 'MULE', 'APK', 'ARREST'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setRadarFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      radarFilter === filter ? 'bg-[#FF5A1F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Screen Grid: LEFT COMMAND CONSOLE + RIGHT SONAR CANVAS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN (lg:col-span-7): STATE CYBER CELL HUBS & LIVE MULE STREAM */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 4 State Cyber Cell Quick Selectors */}
                <div className="grid grid-cols-2 gap-3">
                  {CYBER_CELLS.map((cell) => (
                    <div
                      key={cell.id}
                      onClick={() => setSelectedCellNode(cell.id as any)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        selectedCellNode === cell.id
                          ? 'bg-orange-50/60 border-[#FF5A1F] shadow-sm ring-1 ring-[#FF5A1F]/30'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={`font-mono-code font-bold px-2 py-0.5 rounded ${cell.color}`}>{cell.id} NODE</span>
                        <span className="text-[10px] text-slate-500 font-mono-code">{cell.badge}</span>
                      </div>
                      <div className="font-bold text-xs text-slate-900 truncate">{cell.name}</div>
                      <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
                        <span>Lead: {cell.lead}</span>
                        <span className="text-[#FF5A1F] text-[10px] font-mono-code font-bold">{cell.streams}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Flagged Mule Interdiction Stream Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-code text-slate-500">
                    <span className="font-bold uppercase tracking-wider text-slate-800">
                      Live 1930 Financial Interdictions ({filteredMuleFeed.length}):
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">Golden Hour Active</span>
                  </div>

                  <div className="space-y-2">
                    {filteredMuleFeed.map((mule) => (
                      <div
                        key={mule.id}
                        onClick={() => setActiveMuleIncident(mule)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          activeMuleIncident?.id === mule.id
                            ? 'bg-orange-50/40 border-[#FF5A1F] shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono-code font-bold text-slate-900">{mule.id}</span>
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                              {mule.amount}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono-code">[{mule.type}]</span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 truncate">{mule.target}</div>
                          <div className="text-[11px] text-slate-500">{mule.bank} · Examiner: {mule.officer}</div>
                        </div>

                        <button className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono-code shrink-0 self-start sm:self-auto transition-colors font-bold">
                          Inspect Hash →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Mule Inspection Drawer Box */}
                {activeMuleIncident && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono-code space-y-2">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[#FF5A1F] font-bold">ACTIVE AUDIT RECORD: {activeMuleIncident.id}</span>
                      <span className="text-emerald-700 font-bold">1930 Nodal Freeze In Progress</span>
                    </div>
                    <div className="text-slate-800">
                      <strong>WORM Evidence Digest:</strong> {activeMuleIncident.hash}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Assigned Forensic Officer: <strong>{activeMuleIncident.officer}</strong> · Bank Branch: {activeMuleIncident.bank}
                    </div>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN (lg:col-span-5): LIVE SONAR RADAR CANVAS (CLEAN GOVERNMENT THEME) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-200">
                <SonarGridCanvas />

                <div className="mt-6 w-full space-y-3 pt-4 border-t border-slate-200 text-xs text-slate-700">
                  <div className="flex items-center justify-between font-mono-code">
                    <span className="text-slate-500">Radar Scan Mode:</span>
                    <span className="text-slate-900 font-bold">SWEEP 360° · 0.022 RAD/S</span>
                  </div>
                  <div className="flex items-center justify-between font-mono-code">
                    <span className="text-slate-500">Target Resolution:</span>
                    <span className="text-emerald-700 font-bold">SHA-256 BIT INVARIANT</span>
                  </div>
                  <div className="flex items-center justify-between font-mono-code">
                    <span className="text-slate-500">Connected Hubs:</span>
                    <span className="text-slate-900 font-bold">Delhi IFSO · Maha Cyber · Interpol · I4C</span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onOpenReportDrawer}
                      className="w-full py-3 rounded-xl bg-[#FF5A1F] hover:bg-[#E04B14] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                    >
                      Submit Threat To Radar Feed ↗
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </ScrollReveal>
      </section>


      {/* =========================================================================
          SECTION 4: 3D HARDWARE WRITE-BLOCKER VAULT (CLEAN GOVERNMENT THEME)
      ========================================================================= */}
      <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-12 w-full max-w-[1760px] 2xl:max-w-[1880px] mx-auto">
        <ScrollReveal yOffset={50}>
          <HardwareVault3D />
        </ScrollReveal>
      </section>


      {/* =========================================================================
          SECTION 5: 3D PERSPECTIVE INVESTIGATOR CAROUSEL
      ========================================================================= */}
      <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-12 w-full max-w-[1760px] 2xl:max-w-[1880px] mx-auto">
        <ScrollReveal yOffset={50}>
          <div className="bg-white rounded-[44px] p-6 sm:p-12 border border-slate-200/90 shadow-xl">
            <InvestigatorCarousel />
          </div>
        </ScrollReveal>
      </section>


      {/* =========================================================================
          SECTION 6: SCROLL-DRIVEN PINNING & BENTO GRID
      ========================================================================= */}
      <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-20 w-full max-w-[1760px] 2xl:max-w-[1880px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Pinned Left Column */}
          <ScrollReveal yOffset={50} className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
            <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider font-mono-code">
              Scroll-Driven Pinning
            </span>
            <h2 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight">
              Sovereign Chain <br />
              Of Custody Bento
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Explore the four immutable pillars that protect citizen electronic records from suppression, modification, or defense falsification claims.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              {bentoStages.map((st, i) => (
                <button
                  key={st.num}
                  onClick={() => setSelectedExaminerIndex(i)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedExaminerIndex === i
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.num} · {st.subtitle}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Morphing Bento Grid Stack */}
          <div className="lg:col-span-7 space-y-6">
            {bentoStages.map((stage, idx) => (
              <ScrollReveal key={stage.num} yOffset={50} delayMs={idx * 80}>
                <div className="p-8 sm:p-12 rounded-[40px] bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-black font-mono-code text-slate-900">
                      {stage.num}
                    </span>
                    <span className="px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5A1F] text-xs font-mono-code font-bold">
                      {stage.metric}
                    </span>
                  </div>

                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono-code">
                    {stage.subtitle}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mb-3">
                    {stage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {stage.desc}
                  </p>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="font-mono-code text-slate-500 text-[11px]">{stage.code}</span>
                    <span className="text-[#FF5A1F]">ISO/IEC 27037 Standard →</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 7: COMPREHENSIVE CYBERCRIME TAXONOMY & FORENSIC PROTOCOLS
      ========================================================================= */}
      <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-16 w-full max-w-[1760px] 2xl:max-w-[1880px] mx-auto">
        <ScrollReveal yOffset={50}>
          <div className="bg-white rounded-[44px] p-8 sm:p-14 border border-slate-200 shadow-xl">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider font-mono-code">
                Forensic Preservation Playbooks
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-950 mt-1">
                Preservation Guides For 6 Common Cybercrimes
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
                Follow these precise evidence collection steps before filing to ensure 100% judicial admissibility.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Digital Arrest */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold w-fit mb-3 inline-block">
                    👮 Digital Arrest & Video Extortion
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Fake Police/CBI Video Calls</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Never delete Skype/WhatsApp call logs. Screen record the entire video call showing caller ID and profile handle. Save bogus summon PDFs in original formats with headers.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-mono-code text-[#FF5A1F] font-semibold">
                  Rule: No agency conducts arrests via Skype
                </div>
              </div>

              {/* Card 2: Electricity APK */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold w-fit mb-3 inline-block">
                    ⚡ Electricity Bill Malicious APKs
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Trojan SMS & APK Binaries</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Do not uninstall the APK immediately. Take screenshots of app permissions (`RECEIVE_SMS`, `ACCESSIBILITY`). Export the `.apk` file for reverse engineering by <strong>Afsheen S</strong>.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-mono-code text-[#FF5A1F] font-semibold">
                  Rule: Power utilities never send `.apk` links
                </div>
              </div>

              {/* Card 3: Telegram Task Fraud */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold w-fit mb-3 inline-block">
                    💸 Telegram VIP Rating Task Fraud
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Fake Escrow Ponzi Rings</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Export full Telegram chat history with JSON metadata. Preserve bank UTR numbers, UPI IDs, and recipient account numbers for 1930 nodal freezing by <strong>Balchandra K</strong>.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-mono-code text-[#FF5A1F] font-semibold">
                  Rule: 120-minute Golden Hour freeze protocol
                </div>
              </div>

              {/* Card 4: Sextortion */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold w-fit mb-3 inline-block">
                    📱 Sextortion & Video Blackmail
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Deepfake Nude Synthesis</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Do not pay ransom (scammers demand more). Capture timestamps, phone numbers, and threat voice notes. Hash files in ForensiCrypt for immediate takedown via NCRP & Delhi IFSO.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-mono-code text-[#FF5A1F] font-semibold">
                  Rule: Zero ransom payment policy
                </div>
              </div>

              {/* Card 5: SIM Swap */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold w-fit mb-3 inline-block">
                    📶 SIM Swap & eSIM Hijacking
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Cellular Signal Neutralization</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Note the exact minute your phone lost network bars. Contact telecom operator for eSIM QR activation logs and physical SIM replacement timestamps to establish timeline.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-mono-code text-[#FF5A1F] font-semibold">
                  Rule: Notify bank immediately upon signal loss
                </div>
              </div>

              {/* Card 6: Ransomware */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-[11px] font-bold w-fit mb-3 inline-block">
                    💾 Corporate Ransomware
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Extortion Notes & C2 Domains</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Isolate network immediately. Preserve volatile RAM using LiME or DumpIt. Hash encrypted sample files and the extortion memo for CERT-In incident reporting.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-mono-code text-[#FF5A1F] font-semibold">
                  Rule: Volatile memory capture prior to reboot
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>


      {/* =========================================================================
          SECTION 8: STATUTORY LEGAL ADMISSIBILITY STUDIO (SUPREME COURT PRECEDENTS)
      ========================================================================= */}
      <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-16 w-full max-w-[1760px] 2xl:max-w-[1880px] mx-auto">
        <ScrollReveal yOffset={50}>
          <div className="bg-white text-slate-900 rounded-[44px] p-8 sm:p-14 border border-slate-200 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#FF5A1F] flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#FF5A1F]" />
                  <span>Statutory Legal Framework</span>
                </span>

                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-950">
                  Section 65B(4) & Section 63 BSA 2023 Admissibility
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  Under the landmark judgment of the Supreme Court of India in <em>Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal (2020) 7 SCC 1</em>, a certificate under Section 65B(4) of the Evidence Act is a mandatory condition precedent to the admissibility of electronic record evidence.
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono-code text-slate-700">
                  <div className="text-slate-950 font-bold">Mandatory Statutory Criteria Fulfilled By ForensiCrypt:</div>
                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                    <li>• Computer output produced during regular lawful operation.</li>
                    <li>• Cryptographic SHA-256 hash proves non-tampering of source media.</li>
                    <li>• Signed by accredited forensic officer (Bibi Zohara / Krishi N).</li>
                    <li>• Conforms to ISO/IEC 27037:2012 Guidelines for digital evidence custody.</li>
                  </ul>
                </div>
              </div>

              {/* Certificate Mockup Preview Card */}
              <div className="lg:col-span-5 bg-slate-50 text-slate-950 p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Certificate Sample</span>
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-500 font-bold">CERT-65B-2026-DEL</span>
                </div>

                <div className="space-y-2 text-xs font-mono-code">
                  <div className="text-[11px] text-slate-500 font-bold">ELECTRONIC RECORD AFFIDAVIT:</div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-[11px] leading-relaxed shadow-2xs">
                    "I hereby certify that the electronic record bearing SHA-256 hash <span className="font-bold text-rose-600">e3b0c44298fc1c14...</span> was generated by hardware operating properly and locked under WORM protocol."
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Attesting Officer:</span>
                    <span className="font-bold text-slate-900">Krishi N (I4C-NAT-7721)</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('incidents')}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Inspect Active Vault Certificates →
                </button>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>


      {/* =========================================================================
          SECTION 9: INTERACTIVE COURTROOM EVIDENCE READINESS CALCULATOR
      ========================================================================= */}
      <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-16 w-full max-w-[1760px] 2xl:max-w-[1880px] mx-auto">
        <ScrollReveal yOffset={50}>
          <div className="bg-white rounded-[44px] p-8 sm:p-14 border border-slate-200 shadow-xl">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider font-mono-code">
                Interactive Judicial Calculator
              </span>
              <h3 className="text-3xl sm:text-5xl font-black text-slate-950 mt-1">
                Courtroom Evidence Readiness Score
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
                Check whether your digital proof satisfies court admissibility requirements under Section 65B.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: 5 Questions */}
              <div className="lg:col-span-8 space-y-3">
                {[
                  { key: 'calculatedPreFiling', title: 'Did you compute the SHA-256 hash before submitting to police or lawyers?', weight: '20%' },
                  { key: 'wormTimestampRFC', title: 'Is the proof anchored in a Write-Once-Read-Many (WORM) storage ledger?', weight: '20%' },
                  { key: 'writeBlockedHardware', title: 'Was storage media cloned using a hardware write-blocker (Tableau)?', weight: '20%' },
                  { key: 'unbrokenCustodyLog', title: 'Does an unbroken chain-of-custody audit log exist with UTC timestamps?', weight: '20%' },
                  { key: 'examinerAffidavit', title: 'Is the evidence supported by an accredited forensic examiner certificate?', weight: '20%' },
                ].map((q) => (
                  <div
                    key={q.key}
                    onClick={() => setCalcAnswers(prev => ({ ...prev, [q.key]: !prev[q.key as keyof typeof calcAnswers] }))}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      calcAnswers[q.key as keyof typeof calcAnswers]
                        ? 'bg-emerald-50/70 border-emerald-300 text-slate-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        calcAnswers[q.key as keyof typeof calcAnswers] ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}>
                        {calcAnswers[q.key as keyof typeof calcAnswers] ? '✓' : ''}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold">{q.title}</span>
                    </div>
                    <span className="text-xs font-mono-code font-bold text-slate-400 shrink-0">{q.weight}</span>
                  </div>
                ))}
              </div>

              {/* Right Column: Score Gauge & Recommendation */}
              <div className="lg:col-span-4 p-8 rounded-3xl bg-slate-50 text-slate-900 border border-slate-200 text-center space-y-4 shadow-sm">
                <div className="text-xs font-mono-code uppercase font-bold text-slate-500">Judicial Admissibility Score</div>
                
                <div className="text-6xl font-black font-mono-code text-slate-950">
                  {readinessScore}%
                </div>

                <div className="text-xs font-semibold">
                  {readinessScore >= 80 ? (
                    <span className="text-emerald-700">High Court Trial Ready: Defense objections will be overruled.</span>
                  ) : (
                    <span className="text-amber-700">At Risk: Opposing counsel can dispute evidence chain integrity.</span>
                  )}
                </div>

                <button
                  onClick={onOpenReportDrawer}
                  className="w-full py-3.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04B14] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  Upgrade Evidence To 100% WORM
                </button>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>


      {/* =========================================================================
          SECTION 10: CITIZEN TESTIMONIALS & COURT CASE VERDICTS
      ========================================================================= */}
      <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-20 w-full max-w-[1760px] 2xl:max-w-[1880px] mx-auto border-t border-slate-200">
        <ScrollReveal yOffset={50} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950">
              Trusted By Courts That <br />
              Demand More Than Screenshots
            </h2>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-full bg-slate-100 text-xs font-bold">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-5 py-2 rounded-full transition-all ${
                activeTab === 'results' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
              }`}
            >
              Results
            </button>
            <button
              onClick={() => setActiveTab('stories')}
              className={`px-5 py-2 rounded-full transition-all ${
                activeTab === 'stories' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
              }`}
            >
              Stories
            </button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <ScrollReveal yOffset={50} delayMs={0}>
            <div className="p-7 rounded-[32px] bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-full">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                "When I was blackmailed with deepfake video calls during a 'digital arrest', ForensiCrypt allowed me to hash the Skype recording immediately. Examiner <strong>Bibi Zohara</strong> verified the hash in 15 minutes."
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Dr. Ananya Sen</span>
                <span className="text-emerald-700 font-bold font-mono-code bg-emerald-50 px-2.5 py-0.5 rounded">Saved ₹25L</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal yOffset={50} delayMs={80}>
            <div className="p-7 rounded-[32px] bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-full">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                "The defense lawyer claimed our APK screenshots were fabricated in Photoshop. We presented the Section 65B ForensiCrypt certificate verified by <strong>Balchandra K</strong> and <strong>Krishi N</strong>, and the court accepted the evidence outright."
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Advocate S. Mehra</span>
                <span className="text-emerald-700 font-bold font-mono-code bg-emerald-50 px-2.5 py-0.5 rounded">Verdict Upheld</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal yOffset={50} delayMs={160}>
            <div className="p-7 rounded-[32px] bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-full">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                "Dialing 1930 and locking transaction UTRs in the WORM ledger with <strong>Afsheen S</strong> helped freeze ₹1.48 lakhs before the scammers could cash it out at an ATM mule."
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Rahul Verma</span>
                <span className="text-emerald-700 font-bold font-mono-code bg-emerald-50 px-2.5 py-0.5 rounded">100% Recovered</span>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>


      {/* =========================================================================
          SECTION 11: NATIONWIDE 24X7 EMERGENCY HOTLINES & ACTION BANNER
      ========================================================================= */}
      <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-6 w-full max-w-[1760px] 2xl:max-w-[1880px] mx-auto">
        <ScrollReveal yOffset={50}>
          <div className="rounded-[40px] bg-gradient-to-r from-[#FF5A1F] via-[#FF6A33] to-[#FF814A] p-8 sm:p-12 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200 font-mono-code">
                National Cybercrime Emergency Gateway
              </span>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                Immediate Financial Interdiction Network
              </h3>
              <p className="text-sm sm:text-base text-white/95 max-w-2xl font-medium">
                Dial <strong>1930</strong> immediately to freeze recipient accounts within 120 minutes, then lock your evidence slips in ForensiCrypt for court trial.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <a
                href="tel:1930"
                className="px-8 py-4 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors shadow-lg flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-[#FF5A1F]" />
                <span>Call 1930 Helpline</span>
              </a>
              
              <MagneticButton
                onClick={onOpenReportDrawer}
                data-cursor="LOCK WORM"
                className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2"
              >
                <span>File Evidence ↗</span>
              </MagneticButton>
            </div>
          </div>
        </ScrollReveal>
      </section>


      {/* =========================================================================
          SECTION 12: SCREEN-FILLING BOTTOM MAGNETIC CTA (CLEAN GOVERNMENT STYLE)
      ========================================================================= */}
      <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-16 w-full max-w-[1760px] 2xl:max-w-[1880px] mx-auto">
        <ScrollReveal yOffset={50}>
          <div className="rounded-[44px] bg-white text-slate-950 p-8 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-slate-200 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#FF5A1F]">
                Tamper-Proof WORM Custody
              </span>
              <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                Ready To Lock Your Incident Evidence?
              </h3>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-medium">
                Do not let critical proof get deleted. Convert screenshots, voice calls, APK binaries, and transaction slips into tamper-proof SHA-256 hashes right now.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <MagneticButton
                onClick={onOpenReportDrawer}
                data-cursor="START WORM"
                className="px-8 py-5 rounded-full bg-[#FF5A1F] hover:bg-[#E04B14] text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>File Evidence Complaint</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </MagneticButton>

              <button
                onClick={() => onNavigate('incidents')}
                className="px-8 py-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
              >
                <span>View Custody Vault ↗</span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};
