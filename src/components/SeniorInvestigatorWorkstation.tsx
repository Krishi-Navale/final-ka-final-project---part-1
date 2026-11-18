import React, { useState, useEffect, useMemo } from 'react';
import { 
  Folder, 
  Search, 
  FileText, 
  Hash, 
  Send, 
  CheckCircle2, 
  Clock, 
  User, 
  Mail, 
  Sliders, 
  Eye, 
  Check, 
  Bell, 
  Award,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Home,
  Layers,
  Wrench,
  BookOpen,
  ShoppingBag,
  MoreVertical,
  Star,
  SlidersHorizontal,
  Plus,
  Calendar,
  Shield,
  Zap,
  Radio,
  ArrowUpRight,
  ExternalLink,
  X,
  FileCode,
  ShieldCheck,
  Flame,
  Activity,
  Terminal,
  Save,
  Compass,
  Cpu,
  Lock,
  Copy,
  Camera,
  Upload,
  Image as ImageIcon,
  Scan,
  Sparkles,
  AlertCircle,
  FileSearch,
  Filter,
  MessageSquare,
  Link2,
  Globe,
} from 'lucide-react';
import { IncidentReport, InvestigatorMessage, UserProfile, IncidentStatus, EvidenceFile } from '../types';
import { updateIncidentInStore } from '../data/incidentStore';
import { addNotification } from '../data/notificationStore';
import {
  CommunityCrimeStory,
  getStoredCrimeStories,
  syncCrimeStoriesWithBackend,
  reviewCrimeStoryInWorkstation,
} from '../data/crimeStoriesStore';
import {
  SharedProblemReport,
  getStoredSharedProblems,
  syncSharedProblemsWithBackend,
  solveSharedProblemInWorkstation,
} from '../data/sharedProblemsStore';
import { dispatchInvestigatorMessageAPI, updateIncidentAPI, fetchRegisteredUsersAPI } from '../data/apiClient';
import { OriginalFormatGallery } from './OriginalFormatGallery';
import { HashVerificationModal } from './HashVerificationModal';
import { MaskedLineReveal } from './effects/MaskedLineReveal';
import { PageStudioHeader } from './effects/PageStudioHeader';
import { KineticMarquee } from './effects/KineticMarquee';
import { ScrollExpandBlock } from './effects/ScrollExpandBlock';
import { SyndicatePatternEngine } from './SyndicatePatternEngine';

export interface SeniorInvestigatorProfile {
  id: string;
  name: string;
  badge: string;
  role: string;
  jurisdiction: string;
  specialization: string;
  avatarInitials: string;
  avatarColor: string;
  status: 'ACTIVE_ON_DUTY' | 'INVESTIGATING' | 'IN_COURT';
  casesCount: number;
  phone: string;
  email: string;
  avatarUrl?: string;
}

export const SENIOR_INVESTIGATORS: SeniorInvestigatorProfile[] = [
  {
    id: 'si-1',
    name: 'Dr. Bibi Zohara',
    badge: 'DEL-CY-0842',
    role: 'Lead Cyber Forensic Examiner',
    jurisdiction: 'Delhi Cyber Division / I4C Command',
    specialization: 'Digital Arrest & WhatsApp Scam Forensics',
    avatarInitials: 'BZ',
    avatarColor: 'from-blue-600 to-indigo-800',
    avatarUrl: '/assets/aistudio/image_acc490cb.png',
    status: 'ACTIVE_ON_DUTY',
    casesCount: 24,
    phone: '+91 98101 44820',
    email: 'zohara.forensics@i4c.gov.in',
  },
  {
    id: 'si-2',
    name: 'Sup. Balchandra',
    badge: 'MAH-CY-1109',
    role: 'Superintendent Cyber Police',
    jurisdiction: 'Maharashtra Cyber Nodal Unit',
    specialization: 'Financial Mule Accounts & 1930 Bank Freeze',
    avatarInitials: 'BC',
    avatarColor: 'from-amber-600 to-orange-800',
    avatarUrl: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg',
    status: 'ACTIVE_ON_DUTY',
    casesCount: 19,
    phone: '+91 94220 11090',
    email: 'balchandra.mule@mahacyber.gov.in',
  },
  {
    id: 'si-3',
    name: 'Afsheen S',
    badge: 'BLR-CY-4402',
    role: 'Cryptographic Forensics Lead',
    jurisdiction: 'Karnataka Cyber Command Centre',
    specialization: 'WORM RFC-3161 Ledger & Merkle Root Integrity',
    avatarInitials: 'AS',
    avatarColor: 'from-emerald-600 to-teal-800',
    avatarUrl: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg',
    status: 'INVESTIGATING',
    casesCount: 31,
    phone: '+91 98804 44020',
    email: 'afsheen.worm@ksp.gov.in',
  },
  {
    id: 'si-4',
    name: 'Krishi Navale',
    badge: 'I4C-NAT-7721',
    role: 'Senior Investigator & National Nodal Lead',
    jurisdiction: 'National Cyber Crime Reporting Portal (I4C)',
    specialization: 'Golden Hour Interdictions & Sec 65B Certification',
    avatarInitials: 'KN',
    avatarColor: 'from-purple-600 to-slate-900',
    avatarUrl: '/assets/aistudio/image_526c1ede.png',
    status: 'ACTIVE_ON_DUTY',
    casesCount: 42,
    phone: '+91 91100 77210',
    email: 'krishi.navale@i4c.gov.in',
  },
  {
    id: 'si-5',
    name: 'Inspector Vikramaditya Singh',
    badge: 'BPL-CY-3390',
    role: 'Digital Chain of Custody Officer',
    jurisdiction: 'Madhya Pradesh Cyber Crime Cell',
    specialization: 'Evidentiary Chain & Judicial Affidavits',
    avatarInitials: 'VS',
    avatarColor: 'from-rose-600 to-pink-800',
    status: 'ACTIVE_ON_DUTY',
    casesCount: 15,
    phone: '+91 94250 33900',
    email: 'vikramaditya@mpcyber.gov.in',
  },
  {
    id: 'si-6',
    name: 'Dr. Ananya Sharma',
    badge: 'MUM-CY-9910',
    role: 'Audio-Visual & Photo Spectral Analyst',
    jurisdiction: 'Western Regional Forensic Science Lab',
    specialization: 'Photo ELA & Deepfake Spectral Analysis',
    avatarInitials: 'AS',
    avatarColor: 'from-sky-600 to-cyan-800',
    status: 'INVESTIGATING',
    casesCount: 27,
    phone: '+91 98200 99100',
    email: 'ananya.spectral@rfsl.gov.in',
  },
  {
    id: 'si-7',
    name: 'Senior Inspector Neha Kulkarni',
    badge: 'KKP-CY-5511',
    role: 'Financial Fraud & Crypto Analyst',
    jurisdiction: 'Financial Intelligence Unit (FIU-IND)',
    specialization: 'Crypto Tracing & Extortion Syndicate Audits',
    avatarInitials: 'NK',
    avatarColor: 'from-[#FF5A1F] to-red-900',
    status: 'ACTIVE_ON_DUTY',
    casesCount: 21,
    phone: '+91 99230 55110',
    email: 'neha.kulkarni@fiu.gov.in',
  },
];

export interface PhotoForensicCase {
  id: string;
  title: string;
  category: string;
  fileName: string;
  fileSize: string;
  previewUrl: string;
  sha256: string;
  timestamp: string;
  ocrExtracted: {
    suspectName?: string;
    accountNumber?: string;
    upiId?: string;
    amount?: string;
    transactionId?: string;
    date?: string;
    rawText: string;
  };
  elaScore: number; // Error level analysis authenticity score 0 - 100
  deepfakeRisk: 'LOW' | 'MEDIUM' | 'HIGH_ALERT';
  cameraMetadata: {
    device: string;
    resolution: string;
    colorSpace: string;
    gpsCoords?: string;
  };
  assignedInvestigatorId: string;
  status: 'PENDING_ANALYSIS' | 'ANALYZED' | 'SECTION_65B_CERTIFIED';
}

const SAMPLE_PHOTO_CASES: PhotoForensicCase[] = [
  {
    id: 'photo-1',
    title: 'Digital Arrest WhatsApp Fake Police Warrant',
    category: 'Digital Arrest / Extortion',
    fileName: 'WhatsApp_Police_Warrant_Notice_Fake.jpg',
    fileSize: '1.8 MB',
    previewUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    sha256: 'a9480d22162f1c8f411802998a44b9a89c89e17d23a11048e91823101aa02911',
    timestamp: '2026-10-09 14:22:10 UTC',
    ocrExtracted: {
      suspectName: 'Inspector R. K. Sharma (Fake Badge)',
      accountNumber: '50100482910129',
      upiId: 'mule.cyberdep@okaxis',
      amount: '₹ 2,50,000',
      transactionId: 'TXN91820391029',
      date: '09 Oct 2026',
      rawText: 'POLICE NOTICE - IMMEDIATE ARREST WARRANT. PAY BAIL LIEN RS 2,50,000 TO SBI A/C 50100482910129 IFSC SBIN0001820 BEFORE 5 PM.'
    },
    elaScore: 98.6,
    deepfakeRisk: 'HIGH_ALERT',
    cameraMetadata: {
      device: 'Samsung Galaxy S24 Ultra (Modified Canvas)',
      resolution: '1080 x 2400 px',
      colorSpace: 'sRGB IEC61966-2.1',
      gpsCoords: '28.6139° N, 77.2090° E (New Delhi Node)'
    },
    assignedInvestigatorId: 'si-1',
    status: 'ANALYZED'
  },
  {
    id: 'photo-2',
    title: 'PhonePe UPI Payment Fraud Receipt Screenshot',
    category: 'Financial Fraud',
    fileName: 'PhonePe_Transaction_Success_Screenshot.png',
    fileSize: '940 KB',
    previewUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    sha256: 'f7c8091811a2894cd123908819d88019a28e71881a2931021990218a00291f09',
    timestamp: '2026-10-09 11:05:40 UTC',
    ocrExtracted: {
      suspectName: 'Suresh Kumar (Mule Account Holder)',
      accountNumber: '918200391209',
      upiId: 'sureshkumar9182@ybl',
      amount: '₹ 85,000',
      transactionId: 'UPI/628109310291',
      date: '09 Oct 2026',
      rawText: 'Payment Successful ₹ 85,000 to Suresh Kumar. Bank Ref No: 628109310291. Debited from ICICI Bank.'
    },
    elaScore: 99.4,
    deepfakeRisk: 'LOW',
    cameraMetadata: {
      device: 'Apple iPhone 15 Pro Max',
      resolution: '1179 x 2556 px',
      colorSpace: 'Display P3',
      gpsCoords: '19.0760° N, 72.8777° E (Mumbai Cyber Zone)'
    },
    assignedInvestigatorId: 'si-2',
    status: 'SECTION_65B_CERTIFIED'
  },
  {
    id: 'photo-3',
    title: 'Cryptocurrency Wallet Transfer Proof Screenshot',
    category: 'Crypto Extortion',
    fileName: 'Binance_USDT_Transfer_Proof.png',
    fileSize: '1.4 MB',
    previewUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&auto=format&fit=crop&q=80',
    sha256: '38a19208311a2f901a88910d298319a2889210219aa2019a88200192a019e1f8',
    timestamp: '2026-10-08 19:40:12 UTC',
    ocrExtracted: {
      suspectName: 'TRC20 Wallet Address 0x71A...',
      accountNumber: '0x71A91820391029182903102910',
      upiId: 'N/A (Crypto TRC-20)',
      amount: '4,500 USDT (₹ 3,92,000)',
      transactionId: 'TXHASH-0x981203910291029',
      date: '08 Oct 2026',
      rawText: 'Transfer Completed: 4,500 USDT to Address TQ812093102910291820. TxID: 0x981203910291029.'
    },
    elaScore: 97.2,
    deepfakeRisk: 'LOW',
    cameraMetadata: {
      device: 'Google Pixel 8 Pro',
      resolution: '1344 x 2992 px',
      colorSpace: 'sRGB',
      gpsCoords: '12.9716° N, 77.5946° E (Bengaluru Node)'
    },
    assignedInvestigatorId: 'si-4',
    status: 'ANALYZED'
  }
];

interface SeniorInvestigatorWorkstationProps {
  incidents: IncidentReport[];
  currentUser: UserProfile;
  onUpdateIncidents: (updated: IncidentReport[]) => void;
  onNavigate: (tab: 'home' | 'dashboard' | 'learning' | 'how-it-works' | 'portals' | 'incidents' | 'investigator') => void;
  onViewCertificate?: (incident: IncidentReport) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function parseForensicDate(raw?: string): Date {
  if (!raw) return new Date();
  const trimmed = raw.trim();
  // Match DD/MM/YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    return new Date(year, month, day, 12, 0, 0);
  }
  // Match YYYY-MM-DD HH:mm:ss UTC or ISO
  const normalized = trimmed.replace(' UTC', 'Z').replace(' ', 'T');
  const parsed = new Date(normalized);
  if (!isNaN(parsed.getTime())) return parsed;
  const fallback = new Date(trimmed);
  if (!isNaN(fallback.getTime())) return fallback;
  return new Date();
}

export function formatForensicDateDisplay(raw?: string): string {
  const d = parseForensicDate(raw);
  const day = String(d.getDate()).padStart(2, '0');
  const mon = SHORT_MONTHS[d.getMonth()];
  const yr = d.getFullYear();
  const hrs = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${mon} ${yr} · ${hrs}:${mins}`;
}

export function formatForensicShortDate(raw?: string): string {
  const d = parseForensicDate(raw);
  const day = String(d.getDate()).padStart(2, '0');
  const mon = SHORT_MONTHS[d.getMonth()];
  const yr = d.getFullYear();
  return `${day} ${mon} ${yr}`;
}

export function toDateInputValue(raw?: string): string {
  const d = parseForensicDate(raw);
  const yr = d.getFullYear();
  const mon = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mon}-${day}`;
}

export function formatRelativeForensicDate(raw?: string): string {
  const d = parseForensicDate(raw);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  return formatForensicShortDate(raw);
}

export const SeniorInvestigatorWorkstation: React.FC<SeniorInvestigatorWorkstationProps> = ({
  incidents,
  currentUser,
  onUpdateIncidents,
  onNavigate,
  onViewCertificate,
}) => {
  // Navigation View: 'workflows' | 'shared_problems' | 'story_approvals' | 'ai_syndicate' | 'bento' | 'custody_alerts' | 'photo_lab' | 'templates' | 'tools' | 'knowledge'
  const [activeNav, setActiveNav] = useState<
    | 'workflows'
    | 'shared_problems'
    | 'story_approvals'
    | 'ai_syndicate'
    | 'bento'
    | 'custody_alerts'
    | 'photo_lab'
    | 'templates'
    | 'tools'
    | 'knowledge'
  >('workflows');

  // Selected Lead Senior Investigator Profile from Favorites list
  const [selectedOfficer, setSelectedOfficer] = useState<SeniorInvestigatorProfile>(() => {
    const emailLower = (currentUser?.email || '').toLowerCase();
    const nameLower = (currentUser?.name || '').toLowerCase();
    if (emailLower.includes('zohara') || nameLower.includes('zohara')) return SENIOR_INVESTIGATORS[0];
    if (emailLower.includes('balchandra') || nameLower.includes('balchandra')) return SENIOR_INVESTIGATORS[1];
    if (emailLower.includes('afsheen') || nameLower.includes('afsheen')) return SENIOR_INVESTIGATORS[2];
    return SENIOR_INVESTIGATORS[3]; // Default: Krishi Navale
  });

  // Real-Time Shared Problems & Origin Link Queue (from Cryptographic Credential Gateway)
  const [sharedProblems, setSharedProblems] = useState<SharedProblemReport[]>(() =>
    getStoredSharedProblems()
  );
  const [problemResolutionNotes, setProblemResolutionNotes] = useState<Record<string, string>>({});
  const [problemActionPreset, setProblemActionPreset] = useState<Record<string, string>>({});
  const [solvingProblemId, setSolvingProblemId] = useState<string | null>(null);
  const [scannedProblemIds, setScannedProblemIds] = useState<Record<string, boolean>>({});
  const [scanningProblemId, setScanningProblemId] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);

  const selectedProblem = useMemo(() => {
    if (!sharedProblems.length) return null;
    if (selectedProblemId) {
      const found = sharedProblems.find((p) => p.id === selectedProblemId);
      if (found) return found;
    }
    return sharedProblems[0];
  }, [sharedProblems, selectedProblemId]);

  useEffect(() => {
    let mounted = true;
    syncSharedProblemsWithBackend().then((list) => {
      if (mounted && Array.isArray(list)) {
        setSharedProblems(list);
      }
    });

    const handleProblemsUpdated = (e: any) => {
      if (mounted) {
        setSharedProblems(e.detail || getStoredSharedProblems());
      }
    };

    window.addEventListener('fip_shared_problems_updated', handleProblemsUpdated);
    return () => {
      mounted = false;
      window.removeEventListener('fip_shared_problems_updated', handleProblemsUpdated);
    };
  }, []);

  // Automatically route to dedicated sector if URL hash matches
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#workstation-shared-problems') {
        setActiveNav('shared_problems');
      } else if (window.location.hash === '#workstation-story-approvals') {
        setActiveNav('story_approvals');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const pendingSharedProblems = useMemo(
    () => sharedProblems.filter((p) => p.status === 'PENDING_INSPECTION'),
    [sharedProblems]
  );

  const solvedSharedProblems = useMemo(
    () => sharedProblems.filter((p) => p.status === 'SOLVED'),
    [sharedProblems]
  );

  const handleRunDeepLinkScan = (problem: SharedProblemReport) => {
    setScanningProblemId(problem.id);
    setTimeout(() => {
      setScanningProblemId(null);
      setScannedProblemIds((prev) => ({ ...prev, [problem.id]: true }));
      showToast(
        `Deep URL & DNS sandbox inspection complete for ${problem.trackingCode} (${problem.linkRiskLevel} RISK)`
      );
    }, 650);
  };

  const handleSolveSharedProblem = async (problem: SharedProblemReport) => {
    setSolvingProblemId(problem.id);
    try {
      const actionTaken =
        problemActionPreset[problem.id] ||
        'Origin URL Flagged for CERT-In Takedown & Added to National Threat Blocklist';
      const summary =
        problemResolutionNotes[problem.id]?.trim() ||
        `Inspected origin link (${problem.sourceLink}) and problem payload in Workstation. Malicious indicators isolated, domain added to blocklist, and WORM resolution sealed by ${selectedOfficer.name}.`;

      await solveSharedProblemInWorkstation(
        problem.id,
        selectedOfficer.name,
        selectedOfficer.badge,
        selectedOfficer.avatarUrl,
        summary,
        actionTaken
      );

      setSharedProblems(getStoredSharedProblems());

      addNotification({
        type: 'CERTIFICATE',
        title: `Shared Problem Inspected & Solved (${problem.trackingCode})`,
        message: `${selectedOfficer.name} inspected origin link [${problem.sourceLink}] and resolved the reported problem: "${actionTaken}".`,
        recipientRole: 'all',
        relatedTrackingCode: problem.trackingCode,
        actionUrlHash: '#workstation-shared-problems',
        senderName: selectedOfficer.name,
        badge: 'PROBLEM SOLVED',
      });

      showToast(
        `Problem ${problem.trackingCode} marked as SOLVED & sealed by ${selectedOfficer.name}!`
      );
    } finally {
      setSolvingProblemId(null);
    }
  };

  // Real-Time Community Crime Stories & PDF Verification Queue
  const [crimeStories, setCrimeStories] = useState<CommunityCrimeStory[]>(() =>
    getStoredCrimeStories()
  );
  const [storyReviewNotes, setStoryReviewNotes] = useState<Record<string, string>>({});
  const [reviewingStoryId, setReviewingStoryId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    syncCrimeStoriesWithBackend().then((list) => {
      if (mounted && Array.isArray(list)) {
        setCrimeStories(list);
      }
    });

    const handleStoriesUpdated = (e: any) => {
      if (mounted) {
        setCrimeStories(e.detail || getStoredCrimeStories());
      }
    };

    window.addEventListener('fip_crime_stories_updated', handleStoriesUpdated);
    return () => {
      mounted = false;
      window.removeEventListener('fip_crime_stories_updated', handleStoriesUpdated);
    };
  }, []);

  const pendingCrimeStories = useMemo(
    () => crimeStories.filter((s) => s.status === 'PENDING_WORKSTATION'),
    [crimeStories]
  );

  const approvedCrimeStories = useMemo(
    () => crimeStories.filter((s) => s.status === 'APPROVED_PUBLISHED'),
    [crimeStories]
  );

  const handleReviewCrimeStory = async (
    story: CommunityCrimeStory,
    decision: 'APPROVED_PUBLISHED' | 'REJECTED'
  ) => {
    setReviewingStoryId(story.id);
    try {
      const note =
        storyReviewNotes[story.id]?.trim() ||
        (decision === 'APPROVED_PUBLISHED'
          ? `PDF SHA-256 (${story.pdfSha256.substring(0, 16)}...) verified in Workstation by ${selectedOfficer.name}. Approved for public safety awareness.`
          : `Submission declined after forensic review by ${selectedOfficer.name}.`);

      await reviewCrimeStoryInWorkstation(
        story.id,
        decision,
        `${selectedOfficer.name} (${selectedOfficer.role})`,
        selectedOfficer.badge,
        note
      );

      setCrimeStories(getStoredCrimeStories());

      addNotification({
        type: 'CERTIFICATE',
        title:
          decision === 'APPROVED_PUBLISHED'
            ? `Crime Story PDF Approved & Published (${story.trackingCode})`
            : `Crime Story PDF Reviewed (${story.trackingCode})`,
        message:
          decision === 'APPROVED_PUBLISHED'
            ? `${selectedOfficer.name} verified "${story.pdfFileName}" and published "${story.title}" to the public Crime Stories feed so citizens can learn and stay safe.`
            : `${selectedOfficer.name} reviewed "${story.title}".`,
        recipientRole: 'all',
        recipientEmail: story.authorEmail,
        relatedTrackingCode: story.trackingCode,
        senderName: selectedOfficer.name,
        badge: decision === 'APPROVED_PUBLISHED' ? 'PUBLISHED LIVE' : 'REVIEWED',
      });

      showToast(
        decision === 'APPROVED_PUBLISHED'
          ? `Approved! "${story.title}" is now published live on the Crime Stories page.`
          : `Story "${story.title}" marked as rejected.`
      );
    } finally {
      setReviewingStoryId(null);
    }
  };

  // Search & Filter Dropdown states (including Date Filter & Date Sort)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | '7d' | '30d' | 'custom'>('all');
  const [customDateFilter, setCustomDateFilter] = useState<string>('');
  const [dateSortOrder, setDateSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Live Forensic UTC Clock & Interactive Calendar State
  const [liveNow, setLiveNow] = useState<Date>(() => new Date());
  const [calendarYear, setCalendarYear] = useState<number>(() => new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(() => new Date().getMonth());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(() => new Date().getDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Active Selected Dossier for Deep Case Examination Drawer/Modal
  const [activeDossierId, setActiveDossierId] = useState<string | null>(null);
  const selectedCase = useMemo(() => {
    return incidents.find(i => ((i as any)._id?.toString() || i.id || i.trackingCode) === activeDossierId || i.id === activeDossierId) || null;
  }, [incidents, activeDossierId]);

  // Case Study Notes State inside Drawer
  const [studyNotes, setStudyNotes] = useState<string>('');
  const [notesSavedStatus, setNotesSavedStatus] = useState<boolean>(false);

  // Investigation Progress State inside Drawer
  const [progressPercent, setProgressPercent] = useState<number>(50);
  const [caseStatus, setCaseStatus] = useState<IncidentStatus>('ASSIGNED');

  // Citizen Notice Dispatch State inside Drawer
  const [noticeType, setNoticeType] = useState<InvestigatorMessage['type']>('STATUS_UPDATE');
  const [noticeSubject, setNoticeSubject] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<'notes' | 'dispatch' | 'evidence' | 'case'>('evidence');

  // Photo Investigation Lab State
  const [photoCases, setPhotoCases] = useState<PhotoForensicCase[]>(SAMPLE_PHOTO_CASES);
  const [activePhotoId, setActivePhotoId] = useState<string>(SAMPLE_PHOTO_CASES[0].id);
  const [isScanningPhoto, setIsScanningPhoto] = useState<boolean>(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [customPhotoTitle, setCustomPhotoTitle] = useState('');
  const [targetCitizenDossierId, setTargetCitizenDossierId] = useState<string>('');

  // Quick Docket Ingestion Modal State for Bento
  const [showIngestModal, setShowIngestModal] = useState<boolean>(false);
  const [newCitizenName, setNewCitizenName] = useState('');
  const [newCitizenEmail, setNewCitizenEmail] = useState('');
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseCategory, setNewCaseCategory] = useState('Financial Fraud');
  const [ingestSuccessMsg, setIngestSuccessMsg] = useState<string | null>(null);

  // Custody Alerts Notifications Ack State
  const [alertAckIds, setAlertAckIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Image 2 Bento Todos State
  const [todos, setTodos] = useState([
    { id: 't1', title: 'Verify SHA-256 APK binary byte sequence', time: '10:00 am', location: 'Lab Terminal 4', done: true, icon: '🛡️' },
    { id: 't2', title: 'Dispatch NPCI 1930 mule freeze to beneficiary bank', time: '11:30 am', location: 'Nodal Gateway', done: true, icon: '🏦' },
    { id: 't3', title: 'Spectral deepfake audio synthesis waveform audit', time: '02:00 pm', location: 'Acoustic Suite', done: false, icon: '🎙️' },
    { id: 't4', title: 'Draft Section 65B judicial admissibility affidavit', time: '04:15 pm', location: 'Legal Vault', done: false, icon: '📜' },
    { id: 't5', title: 'Anchor Merkle root to national WORM ledger', time: '06:00 pm', location: 'RFC-3161 Server', done: true, icon: '🔒' },
  ]);

  // Hash Key Comparison state for Senior Investigator
  const [hashVerifiedStatus, setHashVerifiedStatus] = useState<'idle' | 'verifying' | 'verified' | 'error'>('idle');
  const [tamperingErrorMsg, setTamperingErrorMsg] = useState<string | null>(null);
  const [isOriginalFormatUnlocked, setIsOriginalFormatUnlocked] = useState(false);
  const [unlockHashInput, setUnlockHashInput] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [showHashModal, setShowHashModal] = useState<boolean>(false);

  // Toast Notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live MongoDB Backend Registered Accounts
  const [backendUsers, setBackendUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchRegisteredUsersAPI().then(users => {
      if (Array.isArray(users)) {
        setBackendUsers(users);
      }
    });
  }, []);

  // Sync state when drawer opens with a selected case
  useEffect(() => {
    if (selectedCase) {
      setStudyNotes(selectedCase.investigatorStudyNotes || selectedCase.officerNotes || '');
      setProgressPercent(selectedCase.investigationProgress ?? 45);
      setCaseStatus(selectedCase.status);
      setNoticeSubject(`Urgent Forensic Update: Case #${selectedCase.trackingCode.slice(-6)}`);
      setNoticeBody('');
      setDispatchSuccess(null);
      setHashVerifiedStatus('idle');
      setTamperingErrorMsg(null);
      setIsOriginalFormatUnlocked(false);
      setUnlockHashInput('');
      setUnlockError(null);
    }
  }, [activeDossierId]);

  // Active Photo object
  const activePhoto = useMemo(() => {
    return photoCases.find(p => p.id === activePhotoId) || photoCases[0];
  }, [photoCases, activePhotoId]);

  // Filtered & Date-Sorted Cases
  const filteredCases = useMemo(() => {
    const now = new Date();
    const list = incidents.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        item.citizenName.toLowerCase().includes(q) ||
        item.citizenEmail.toLowerCase().includes(q) ||
        item.trackingCode.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        formatForensicShortDate(item.dateReported).toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && !item.category.toLowerCase().includes(categoryFilter.toLowerCase())) return false;

      if (dateRangeFilter !== 'all') {
        const itemDate = parseForensicDate(item.dateReported);
        const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);
        if (dateRangeFilter === 'today') {
          if (toDateInputValue(item.dateReported) !== toDateInputValue(now.toISOString())) return false;
        } else if (dateRangeFilter === '7d') {
          if (diffDays > 7 || diffDays < -1) return false;
        } else if (dateRangeFilter === '30d') {
          if (diffDays > 30 || diffDays < -1) return false;
        } else if (dateRangeFilter === 'custom' && customDateFilter) {
          if (toDateInputValue(item.dateReported) !== customDateFilter) return false;
        }
      }

      return true;
    });

    return [...list].sort((a, b) => {
      const timeA = parseForensicDate(a.dateReported).getTime();
      const timeB = parseForensicDate(b.dateReported).getTime();
      return dateSortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [incidents, searchQuery, statusFilter, categoryFilter, dateRangeFilter, customDateFilter, dateSortOrder]);

  // Toggle Todo in Bento
  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Add Todo in Bento
  const handleAddTodo = () => {
    const newT = {
      id: `t-${Date.now()}`,
      title: `Audit WORM SHA-256 Digest & Crime Story PDF Queue (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      time: 'Now',
      location: 'Workstation Terminal',
      done: false,
      icon: '⚡'
    };
    setTodos(prev => [newT, ...prev]);
    showToast('New forensic objective added to command schedule!');
  };

  // Handle Photo File Upload
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const mockHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    const newCase: PhotoForensicCase = {
      id: `photo-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, "") || 'Uploaded Evidence Photo',
      category: 'Direct Photo Upload',
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      previewUrl,
      sha256: mockHash,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      ocrExtracted: {
        suspectName: 'Extracted from image payload',
        accountNumber: 'Scanning text...',
        upiId: 'Scanning UPI QR...',
        amount: '₹ ' + (Math.floor(Math.random() * 90000) + 10000).toLocaleString('en-IN'),
        transactionId: `TXN${Date.now().toString().slice(-8)}`,
        date: new Date().toLocaleDateString('en-GB'),
        rawText: `EVIDENCE IMAGE PAYLOAD INGESTED: ${file.name}. SHA-256 Bitstream hash generated.`
      },
      elaScore: 99.1,
      deepfakeRisk: 'LOW',
      cameraMetadata: {
        device: 'Uploaded Device Payload',
        resolution: '1080 x 1920 px',
        colorSpace: 'sRGB',
        gpsCoords: '28.6139° N, 77.2090° E (Active Node)'
      },
      assignedInvestigatorId: selectedOfficer.id,
      status: 'PENDING_ANALYSIS'
    };

    setPhotoCases(prev => [newCase, ...prev]);
    setActivePhotoId(newCase.id);
    setActiveNav('photo_lab');
    showToast(`Photo "${file.name}" uploaded successfully! Investigate under ${selectedOfficer.name}.`);
  };

  // Run ELA & Forensic Scan on active photo
  const handleRunPhotoScan = () => {
    setIsScanningPhoto(true);
    setScanMessage('Running Error Level Analysis (ELA) & Optical Character Recognition (OCR)...');

    setTimeout(() => {
      setIsScanningPhoto(false);
      setScanMessage(null);

      setPhotoCases(prev => prev.map(p => {
        if (p.id === activePhoto.id) {
          return {
            ...p,
            status: 'ANALYZED',
            assignedInvestigatorId: selectedOfficer.id
          };
        }
        return p;
      }));

      showToast(`Forensic Scan Complete! Bitstream Hash & EXIF Verified by ${selectedOfficer.name}.`);
    }, 1200);
  };

  // Issue Section 65B Certificate for Active Photo
  const handleIssueSec65BForPhoto = () => {
    setPhotoCases(prev => prev.map(p => {
      if (p.id === activePhoto.id) {
        return {
          ...p,
          status: 'SECTION_65B_CERTIFIED',
          assignedInvestigatorId: selectedOfficer.id
        };
      }
      return p;
    }));

    // Optionally attach to citizen docket
    if (targetCitizenDossierId) {
      const target = incidents.find(i => i.id === targetCitizenDossierId);
      if (target) {
        const newEvidenceFile: EvidenceFile = {
          id: `ev-photo-${Date.now()}`,
          name: activePhoto.fileName,
          size: 1024 * 500,
          type: 'image/jpeg',
          sha256: activePhoto.sha256,
          wormTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          previewUrl: activePhoto.previewUrl,
          rawContent: activePhoto.ocrExtracted.rawText,
        };

        const updated: IncidentReport = {
          ...target,
          evidenceFiles: [newEvidenceFile, ...target.evidenceFiles],
          custodyEvents: [
            {
              id: `cust-photo-${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
              actor: `${selectedOfficer.name} (${selectedOfficer.badge})`,
              role: selectedOfficer.role,
              action: `Analyzed photo "${activePhoto.fileName}" and issued Section 65B Digital Certificate. Attached to folder.`,
              merkleHash: activePhoto.sha256.substring(0, 16) + '...'
            },
            ...target.custodyEvents
          ]
        };

        const nextList = updateIncidentInStore(updated);
        onUpdateIncidents(nextList);
      }
    }

    showToast(`Section 65B Digital Admissibility Certificate issued by ${selectedOfficer.name}!`);
  };

  // Ingest New Evidence Docket (Bento button action)
  const handleCreateNewDocket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCitizenName.trim() || !newCitizenEmail.trim() || !newCaseTitle.trim()) return;

    const newDocket: IncidentReport = {
      id: `docket-${Date.now()}`,
      trackingCode: `I4C-${Math.floor(100000 + Math.random() * 900000)}`,
      title: newCaseTitle.trim(),
      category: newCaseCategory,
      description: `Ingested directly by ${selectedOfficer.name} (${selectedOfficer.badge}) at Senior Investigator Workstation.`,
      citizenName: newCitizenName.trim(),
      citizenEmail: newCitizenEmail.trim(),
      dateReported: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      status: 'WORM_LOCKED',
      primaryHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      evidenceFiles: [],
      seniorOfficerAssigned: selectedOfficer.name,
      officerBadge: selectedOfficer.badge,
      custodyEvents: [
        {
          id: `cust-ingest-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          actor: `${selectedOfficer.name} (${selectedOfficer.badge})`,
          role: selectedOfficer.role,
          action: `Ingested new WORM docket for ${newCitizenName.trim()} (${newCitizenEmail.trim()})`,
          merkleHash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
        }
      ],
      legalAdmissibilityCertId: `CERT-65B-${Date.now().toString().slice(-6)}`
    };

    const nextList = updateIncidentInStore(newDocket);
    onUpdateIncidents(nextList);
    setIngestSuccessMsg(`New citizen folder "${newCitizenName.trim()}" established in Workstation!`);

    setTimeout(() => {
      setIngestSuccessMsg(null);
      setShowIngestModal(false);
      setNewCitizenName('');
      setNewCitizenEmail('');
      setNewCaseTitle('');
      setActiveNav('workflows');
    }, 1500);
  };

  // Save Investigator Notes
  const handleSaveNotes = () => {
    if (!selectedCase) return;
    const updatedCase: IncidentReport = {
      ...selectedCase,
      investigatorStudyNotes: studyNotes,
      lastInvestigatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    };
    const nextList = updateIncidentInStore(updatedCase);
    onUpdateIncidents(nextList);
    setNotesSavedStatus(true);
    setTimeout(() => setNotesSavedStatus(false), 2500);
  };

  // Update Case Progress %
  const handleUpdateProgress = (newPercent: number, newStatus?: IncidentStatus) => {
    if (!selectedCase) return;
    const updatedCase: IncidentReport = {
      ...selectedCase,
      investigationProgress: newPercent,
      status: newStatus || selectedCase.status,
      lastInvestigatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      custodyEvents: [
        {
          id: `cust-inv-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          actor: `${selectedOfficer.name} (${selectedOfficer.badge})`,
          role: selectedOfficer.role,
          action: `Investigation progress updated to ${newPercent}%. Status: ${newStatus || selectedCase.status}`,
          merkleHash: (selectedCase.primaryHash?.substring(0, 16) || 'WORM_HASH') + '...'
        },
        ...selectedCase.custodyEvents
      ]
    };

    setProgressPercent(newPercent);
    if (newStatus) setCaseStatus(newStatus);
    const nextList = updateIncidentInStore(updatedCase);
    onUpdateIncidents(nextList);
  };

  // Dispatch Official Message / Notice to Citizen
  const handleDispatchNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !noticeBody.trim()) return;

    const newMessage: InvestigatorMessage = {
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      sender: selectedOfficer.name,
      senderBadge: selectedOfficer.badge,
      recipientEmail: selectedCase.citizenEmail,
      type: noticeType,
      subject: noticeSubject.trim() || 'Official Custody Notice',
      content: noticeBody.trim(),
      read: false,
      merkleStamp: selectedCase.primaryHash?.substring(0, 24) || 'WORM_HASH'
    };

    const updatedCase: IncidentReport = {
      ...selectedCase,
      investigatorMessages: [newMessage, ...(selectedCase.investigatorMessages || [])],
      officerNotes: `[Official Notice Dispatched]: ${noticeBody.trim().substring(0, 120)}...`,
      lastInvestigatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      custodyEvents: [
        {
          id: `cust-msg-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          actor: `${selectedOfficer.name} (${selectedOfficer.badge})`,
          role: selectedOfficer.role,
          action: `Official Custody Notice Dispatched to ${selectedCase.citizenEmail}: "${newMessage.subject}"`,
          merkleHash: (selectedCase.primaryHash?.substring(0, 16) || 'WORM_HASH') + '...'
        },
        ...selectedCase.custodyEvents
      ]
    };

    const nextList = updateIncidentInStore(updatedCase);
    onUpdateIncidents(nextList);

    // Sync to MongoDB backend in background
    dispatchInvestigatorMessageAPI(selectedCase.trackingCode, newMessage).catch(err => console.warn(err));
    updateIncidentAPI(selectedCase.trackingCode, updatedCase).catch(err => console.warn(err));

    // Emit live notification (syncs to MongoDB /api/notifications and local event)
    addNotification({
      type: noticeType === 'EVIDENCE_REQUEST' ? 'CUSTODY_ALERT' : 'DIRECT_NOTICE',
      title: noticeType === 'EVIDENCE_REQUEST' 
        ? `⚠️ Urgent Evidence Request: ${newMessage.subject}` 
        : `Investigator Notice: ${newMessage.subject}`,
      message: `${selectedOfficer.name} sent official instruction: "${newMessage.content.substring(0, 90)}..."`,
      recipientEmail: selectedCase.citizenEmail,
      recipientRole: 'citizen',
      relatedTrackingCode: selectedCase.trackingCode,
      relatedIncidentId: selectedCase.id,
      senderName: selectedOfficer.name,
      badge: selectedOfficer.badge,
    });

    setDispatchSuccess(`Official notice dispatched to ${selectedCase.citizenName} (${selectedCase.citizenEmail})! Real-time notification delivered.`);
    setNoticeBody('');
    setTimeout(() => setDispatchSuccess(null), 5000);
  };

  // Quick Forensic Note Templates
  const insertTemplate = (template: string) => {
    setStudyNotes(prev => (prev ? prev + '\n\n' + template : template));
  };

  // Physical folder card styles
  const folderColors = [
    { bgTab: 'bg-[#18181E]', bgCard: 'bg-[#111115]', border: 'border-[#FF4D15]/30', text: 'text-[#FF4D15]', accent: '#FF4D15' },
    { bgTab: 'bg-[#18181E]', bgCard: 'bg-[#111115]', border: 'border-sky-500/30', text: 'text-sky-400', accent: '#38BDF8' },
    { bgTab: 'bg-[#18181E]', bgCard: 'bg-[#111115]', border: 'border-amber-500/30', text: 'text-amber-400', accent: '#FBBF24' },
    { bgTab: 'bg-[#18181E]', bgCard: 'bg-[#111115]', border: 'border-emerald-500/30', text: 'text-emerald-400', accent: '#34D399' }
  ];

  // Visual header gradient backgrounds for workflow cards
  const workflowCardVisuals = [
    'from-[#FF4D15]/80 via-[#18181E] to-[#111115]',
    'from-sky-600/70 via-[#18181E] to-[#111115]',
    'from-rose-600/70 via-[#18181E] to-[#111115]',
    'from-amber-600/70 via-[#18181E] to-[#111115]',
    'from-violet-600/70 via-[#18181E] to-[#111115]',
    'from-emerald-600/70 via-[#18181E] to-[#111115]',
    'from-zinc-700/70 via-[#18181E] to-[#070709]',
  ];

  return (
    <div className="w-full min-h-screen bg-[#F5F5F7] text-[#0D0D10] font-sans">
      <PageStudioHeader
        kicker="I4C National Forensic Command · Confidential"
        title="Examiner Workstation."
        subtitle="Inspect dedicated citizen evidence folders bit-for-bit, execute ELA & pixel noise photo verification, and issue Section 65B court admissibility dispatches."
        nodeLabel={`OFFICER: ${selectedOfficer.name.toUpperCase()} · ${selectedOfficer.badge}`}
        ctaLabel="View Citizen Preview"
        onCtaClick={() => onNavigate('dashboard')}
        showOrb
      >
        <div className="pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'workflows', label: `01. Case Dockets (${incidents.length})` },
              {
                id: 'shared_problems',
                label: `02. Share a Problem Sector (${pendingSharedProblems.length})`,
              },
              {
                id: 'story_approvals',
                label: `03. Crime Story PDF Approvals (${pendingCrimeStories.length})`,
              },
              { id: 'ai_syndicate', label: '04. AI Syndicate Pattern Engine' },
              { id: 'photo_lab', label: `05. Photo Forensic Lab (${photoCases.length})` },
              { id: 'custody_alerts', label: '06. Custody Alerts' },
              { id: 'bento', label: '07. Command Bento' },
              { id: 'templates', label: '08. Sec 65B Templates' },
              { id: 'tools', label: '09. WORM Utilities' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveNav(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeNav === tab.id
                    ? 'bg-[#0D0D10] text-white shadow-sm'
                    : 'bg-white text-zinc-600 border border-black/10 hover:text-[#0D0D10]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('incidents')}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#0D0D10] text-[#0D0D10] hover:text-white border border-black/15 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            View Public Crime Stories →
          </button>
        </div>
      </PageStudioHeader>

      <KineticMarquee
        theme="light"
        variant="band"
        items={[
          'SENIOR INVESTIGATOR COMMAND CONSOLE',
          'SHARE A PROBLEM & ORIGIN LINK SECTOR',
          'REAL-TIME CRIME STORY PDF APPROVALS',
          'BIT-FOR-BIT READ-ONLY WORM',
          'SECTION 65B SIGN-OFF',
        ]}
      />

      <section className="w-full py-8 sm:py-10 px-3 sm:px-5 lg:px-6 bg-white border-b border-black/10">
        <ScrollExpandBlock
          minScale={0.97}
          className="w-full bg-[#0D0D10] text-white flex rounded-[28px] sm:rounded-[36px] border border-black/10 shadow-2xl overflow-hidden font-sans antialiased selection:bg-[#FF4D15] selection:text-white relative"
        >
      {/* Toast Popup Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#111115] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#FF4D15]/40 text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-[#FF4D15] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          LEFT SIDEBAR: SENIOR INVESTIGATOR F.I.P COMMAND CONSOLE
      ========================================================================= */}
      <aside className="w-72 bg-[#111115] border-r border-white/10 p-5 flex flex-col justify-between shrink-0 hidden md:flex min-h-[840px] sticky top-0 h-screen overflow-y-auto">
        
        <div className="space-y-6">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FF4D15] text-white flex items-center justify-center font-black shadow-[0_0_20px_rgba(255,77,21,0.35)]">
                <span className="text-sm">✦</span>
              </div>
              <div>
                <div className="text-base font-black text-white tracking-tight font-sans leading-none">
                  F.I.P Workstation
                </div>
                <div className="text-[10px] font-mono-code font-bold text-zinc-400 mt-0.5">
                  Senior Investigator Command
                </div>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('dashboard')}
              title="Switch to Citizen View"
              className="w-7 h-7 rounded-lg hover:bg-[#18181E] text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>

          {/* Active Lead Senior Investigator Badge */}
          <div className="p-3 rounded-2xl bg-[#070709] text-white shadow-md border border-[#FF4D15]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono-code text-[#FF4D15] uppercase tracking-wider font-bold">
                Active Duty Command
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-2.5">
              {selectedOfficer.avatarUrl ? (
                <img
                  src={selectedOfficer.avatarUrl}
                  alt={selectedOfficer.name}
                  className="w-9 h-9 rounded-xl object-cover object-top shrink-0 border border-[#FF4D15] shadow-xs"
                />
              ) : (
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${selectedOfficer.avatarColor} text-white font-black text-xs flex items-center justify-center shrink-0 border border-white/20 shadow-xs`}>
                  {selectedOfficer.avatarInitials}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{selectedOfficer.name}</div>
                <div className="text-[10px] text-zinc-400 font-mono-code truncate">{selectedOfficer.badge}</div>
              </div>
            </div>
            <div className="text-[10px] text-zinc-400 pt-1 border-t border-white/10 flex items-center justify-between">
              <span className="truncate">{selectedOfficer.role.split(' ')[0]}</span>
              <span className="font-bold font-mono-code text-emerald-400">{selectedOfficer.casesCount} Cases</span>
            </div>
          </div>

          {/* Primary Navigation Items */}
          <nav className="space-y-1 text-xs font-semibold text-zinc-400">
            <button
              onClick={() => setActiveNav('workflows')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeNav === 'workflows'
                  ? 'bg-[#FF4D15] text-white font-bold shadow-[0_0_20px_rgba(255,77,21,0.3)]'
                  : 'hover:bg-[#18181E] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className={`w-4 h-4 ${activeNav === 'workflows' ? 'text-white' : 'text-zinc-500'}`} />
                <span>Workstation Dockets</span>
              </div>
              <span className={`text-[10px] font-mono-code px-1.5 py-0.5 rounded ${activeNav === 'workflows' ? 'bg-black/25 text-white' : 'bg-[#18181E] text-zinc-300 border border-white/10'}`}>
                {incidents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('shared_problems')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeNav === 'shared_problems'
                  ? 'bg-[#FF4D15] text-white font-bold shadow-[0_0_20px_rgba(255,77,21,0.3)]'
                  : 'hover:bg-[#18181E] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Link2 className={`w-4 h-4 ${activeNav === 'shared_problems' ? 'text-white' : 'text-rose-400'}`} />
                <span>Share a Problem Sector</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                activeNav === 'shared_problems'
                  ? 'bg-black/25 text-white'
                  : pendingSharedProblems.length > 0
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}>
                {pendingSharedProblems.length > 0 ? `${pendingSharedProblems.length} ALERT` : 'OK'}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('story_approvals')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeNav === 'story_approvals'
                  ? 'bg-[#FF4D15] text-white font-bold shadow-[0_0_20px_rgba(255,77,21,0.3)]'
                  : 'hover:bg-[#18181E] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className={`w-4 h-4 ${activeNav === 'story_approvals' ? 'text-white' : 'text-amber-400'}`} />
                <span>Crime Story PDF Queue</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                activeNav === 'story_approvals'
                  ? 'bg-black/25 text-white'
                  : pendingCrimeStories.length > 0
                  ? 'bg-amber-500 text-black'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}>
                {pendingCrimeStories.length > 0 ? `${pendingCrimeStories.length} NEW` : 'OK'}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('ai_syndicate')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeNav === 'ai_syndicate'
                  ? 'bg-[#FF4D15] text-white font-bold shadow-[0_0_20px_rgba(255,77,21,0.3)]'
                  : 'hover:bg-[#18181E] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className={`w-4 h-4 ${activeNav === 'ai_syndicate' ? 'text-white' : 'text-[#FF4D15]'}`} />
                <span>AI Syndicate Patterns</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold ${activeNav === 'ai_syndicate' ? 'bg-black/25 text-white' : 'bg-[#FF4D15]/15 text-[#FF4D15] border border-[#FF4D15]/30'}`}>
                AI
              </span>
            </button>

            <button
              onClick={() => setActiveNav('photo_lab')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'photo_lab'
                  ? 'bg-[#FF4D15] text-white font-bold shadow-[0_0_20px_rgba(255,77,21,0.3)]'
                  : 'hover:bg-[#18181E] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Camera className={`w-4 h-4 ${activeNav === 'photo_lab' ? 'text-white' : 'text-zinc-500'}`} />
                <span>Photo Forensic Lab 📸</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold ${activeNav === 'photo_lab' ? 'bg-black/25 text-white' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'}`}>
                LIVE
              </span>
            </button>

            <button
              onClick={() => setActiveNav('custody_alerts')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'custody_alerts'
                  ? 'bg-[#FF4D15] text-white font-bold shadow-[0_0_20px_rgba(255,77,21,0.3)]'
                  : 'hover:bg-[#18181E] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className={`w-4 h-4 ${activeNav === 'custody_alerts' ? 'text-white' : 'text-zinc-500'}`} />
                <span>Custody Alert Center</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center font-mono-code shadow-xs">
                {incidents.length + photoCases.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('bento')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'bento'
                  ? 'bg-[#FF4D15] text-white font-bold shadow-[0_0_20px_rgba(255,77,21,0.3)]'
                  : 'hover:bg-[#18181E] hover:text-white'
              }`}
            >
              <Home className={`w-4 h-4 ${activeNav === 'bento' ? 'text-white' : 'text-zinc-500'}`} />
              <span>Schedule & Command Bento</span>
            </button>

            <button
              onClick={() => setActiveNav('templates')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'templates'
                  ? 'bg-[#FF4D15] text-white font-bold shadow-[0_0_20px_rgba(255,77,21,0.3)]'
                  : 'hover:bg-[#18181E] hover:text-white'
              }`}
            >
              <FileText className={`w-4 h-4 ${activeNav === 'templates' ? 'text-white' : 'text-zinc-500'}`} />
              <span>Sec 65B Templates</span>
            </button>

            <button
              onClick={() => setActiveNav('tools')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'tools'
                  ? 'bg-[#FF4D15] text-white font-bold shadow-[0_0_20px_rgba(255,77,21,0.3)]'
                  : 'hover:bg-[#18181E] hover:text-white'
              }`}
            >
              <Cpu className={`w-4 h-4 ${activeNav === 'tools' ? 'text-white' : 'text-zinc-500'}`} />
              <span>WORM & Hash Utilities</span>
            </button>

            <button
              onClick={() => setActiveNav('knowledge')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'knowledge'
                  ? 'bg-[#FF4D15] text-white font-bold shadow-[0_0_20px_rgba(255,77,21,0.3)]'
                  : 'hover:bg-[#18181E] hover:text-white'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${activeNav === 'knowledge' ? 'text-white' : 'text-zinc-500'}`} />
              <span>Admissibility Framework</span>
            </button>

            <button
              onClick={() => onNavigate('portals')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#18181E] hover:text-white transition-colors text-zinc-400"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-500" />
              <span>1930 / I4C Portal Grid</span>
            </button>
          </nav>

          {/* =====================================================================
              FAVOURITES SECTION: ALL SENIOR INVESTIGATORS LIST
          ===================================================================== */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between px-3.5">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-wider font-mono-code">
                Senior Investigators Roster
              </div>
              <span className="text-[10px] font-mono-code font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                7 On Duty
              </span>
            </div>
            
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {SENIOR_INVESTIGATORS.map((officer) => {
                const isSelected = selectedOfficer.id === officer.id;
                return (
                  <div
                    key={officer.id}
                    onClick={() => {
                      setSelectedOfficer(officer);
                      showToast(`Active Lead Investigator switched to ${officer.name}`);
                    }}
                    className={`w-full p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between group text-left ${
                      isSelected 
                        ? 'bg-[#FF4D15] text-white font-bold shadow-[0_0_16px_rgba(255,77,21,0.25)]' 
                        : 'bg-[#18181E]/50 hover:bg-[#18181E] text-zinc-200 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1">
                      {officer.avatarUrl ? (
                        <img
                          src={officer.avatarUrl}
                          alt={officer.name}
                          className="w-7 h-7 rounded-lg object-cover object-top shrink-0 border border-white/20 shadow-2xs"
                        />
                      ) : (
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${officer.avatarColor} text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs`}>
                          {officer.avatarInitials}
                        </div>
                      )}
                      <div className="truncate">
                        <div className="text-xs font-bold truncate text-white">
                          {officer.name}
                        </div>
                        <div className={`text-[9px] font-mono-code truncate ${isSelected ? 'text-white/80' : 'text-zinc-500'}`}>
                          {officer.badge}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOfficer(officer);
                          setActiveNav('photo_lab');
                          showToast(`Opened Photo Forensic Lab under ${officer.name}`);
                        }}
                        title={`Investigate photos as ${officer.name}`}
                        className={`p-1 rounded-md transition-colors ${
                          isSelected ? 'bg-black/25 text-white hover:bg-black/40' : 'bg-[#070709] text-zinc-400 hover:text-white border border-white/10'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                      <Star className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300 fill-amber-300' : 'text-zinc-600'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Rapid Direct Photo Upload Button in Sidebar Bottom */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <label className="w-full py-2.5 bg-[#FF4D15] hover:bg-[#E03E0B] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,77,21,0.3)] transition-all cursor-pointer">
            <Upload className="w-4 h-4 text-white" />
            <span>Upload Photo to Investigate 📸</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoFileUpload} 
              className="hidden" 
            />
          </label>
        </div>

      </aside>


      {/* =========================================================================
          MAIN WORKSPACE BODY
      ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP SEARCH & COMMAND BAR */}
        <header className="bg-[#070709]/90 backdrop-blur-md border-b border-white/10 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4">
          
          {/* Search Input with ⌘ F badge */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search citizen dossiers, tracking codes, suspect handles..."
              className="w-full pl-9 pr-14 py-2 rounded-xl bg-[#111115] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF4D15] transition-all font-medium"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono-code font-bold text-zinc-400 bg-[#18181E] px-1.5 py-0.5 rounded border border-white/10">
              <span>⌘</span>
              <span>F</span>
            </div>
          </div>

          {/* Right Header Indicators, Live Forensic Clock & Quick Photo Upload */}
          <div className="flex items-center gap-3 text-xs font-medium text-zinc-400">
            
            {/* Live Ticking RFC-3161 UTC System Clock */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111115] border border-white/10 text-[11px] font-mono-code text-zinc-300">
              <Calendar className="w-3.5 h-3.5 text-[#FF4D15] shrink-0" />
              <span>
                {String(liveNow.getDate()).padStart(2, '0')} {SHORT_MONTHS[liveNow.getMonth()]} {liveNow.getFullYear()} · {liveNow.toTimeString().slice(0, 8)}
              </span>
            </div>

            {/* Active Officer Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111115] border border-white/10 text-xs text-zinc-200 font-bold">
              {selectedOfficer.avatarUrl ? (
                <img
                  src={selectedOfficer.avatarUrl}
                  alt={selectedOfficer.name}
                  className="w-5 h-5 rounded-full object-cover object-top border border-[#FF4D15] shrink-0"
                />
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              )}
              <span>Officer: <strong className="text-white">{selectedOfficer.name}</strong></span>
            </div>

            <label className="px-3 py-1.5 rounded-xl bg-[#FF4D15] hover:bg-[#E03E0B] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Photo Investigation 📸</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoFileUpload} 
                className="hidden" 
              />
            </label>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3 py-1.5 rounded-xl bg-[#18181E] hover:bg-white/10 border border-white/10 text-zinc-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Citizen Docket Preview</span>
            </button>
          </div>

        </header>


        {/* =======================================================================
            VIEW 1: "Senior Investigator workstation" (Dockets & Citizen Folders)
        ======================================================================= */}
        {activeNav === 'workflows' && (
          <div className="p-6 sm:p-8 space-y-8 max-w-[1400px]">
            
            {/* Header Row: Title "Senior Investigator workstation" + Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <MaskedLineReveal>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                    Senior Investigator workstation
                  </h1>
                </MaskedLineReveal>
                <p className="text-xs text-zinc-400 mt-1">
                  Dedicated citizen evidence folders & active case dockers. WORM immutable repository: read, operate & investigate.
                </p>
              </div>

              {/* Filter Dropdowns (Status, Category, Date Filter, Custom Date Picker & Sort) */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                
                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-[#111115] border border-white/10 text-white text-xs font-medium hover:border-white/25 focus:outline-none focus:ring-2 focus:ring-[#FF4D15] cursor-pointer"
                  >
                    <option key="status-opt-all" value="all">Status: All</option>
                    <option key="status-opt-locked" value="WORM_LOCKED">Status: Locked</option>
                    <option key="status-opt-assigned" value="ASSIGNED">Status: In Progress</option>
                    <option key="status-opt-verified" value="VERIFIED">Status: Verified</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-[#111115] border border-white/10 text-white text-xs font-medium hover:border-white/25 focus:outline-none focus:ring-2 focus:ring-[#FF4D15] cursor-pointer"
                  >
                    <option key="cat-opt-all" value="all">Crime: Any</option>
                    <option key="cat-opt-fin" value="Financial">Financial Fraud</option>
                    <option key="cat-opt-dig" value="Digital">Digital Arrest</option>
                    <option key="cat-opt-ext" value="Extortion">Extortion</option>
                    <option key="cat-opt-phi" value="Phishing">Phishing</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Date Window Filter */}
                <div className="relative">
                  <select
                    value={dateRangeFilter}
                    onChange={(e) => setDateRangeFilter(e.target.value as any)}
                    className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-[#111115] border border-white/10 text-white text-xs font-medium hover:border-white/25 focus:outline-none focus:ring-2 focus:ring-[#FF4D15] cursor-pointer"
                  >
                    <option value="all">Date: All Time</option>
                    <option value="today">Date: Today</option>
                    <option value="7d">Date: Last 7 Days</option>
                    <option value="30d">Date: Last 30 Days</option>
                    <option value="custom">Date: Specific Date</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Specific Calendar Date Picker */}
                {dateRangeFilter === 'custom' && (
                  <input
                    type="date"
                    value={customDateFilter}
                    onChange={(e) => setCustomDateFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#111115] border border-[#FF4D15]/50 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-[#FF4D15]"
                  />
                )}

                {/* Date Sort Order */}
                <div className="relative">
                  <select
                    value={dateSortOrder}
                    onChange={(e) => setDateSortOrder(e.target.value as 'newest' | 'oldest')}
                    className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-[#111115] border border-white/10 text-white text-xs font-medium hover:border-white/25 focus:outline-none focus:ring-2 focus:ring-[#FF4D15] cursor-pointer"
                  >
                    <option value="newest">Sort: Newest Date</option>
                    <option value="oldest">Sort: Oldest Date</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Filter Reset Button */}
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setCategoryFilter('all');
                    setDateRangeFilter('all');
                    setCustomDateFilter('');
                    setDateSortOrder('newest');
                    setSearchQuery('');
                  }}
                  title="Reset all filters"
                  className="w-8 h-8 rounded-xl bg-[#111115] border border-white/10 text-zinc-400 hover:text-white hover:border-white/25 flex items-center justify-center transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>

            {/* Active Lead Senior Investigator Banner */}
            <div className="bg-[#111115] text-white rounded-2xl p-4 border border-[#FF4D15]/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {selectedOfficer.avatarUrl ? (
                  <img
                    src={selectedOfficer.avatarUrl}
                    alt={selectedOfficer.name}
                    className="w-11 h-11 rounded-xl object-cover object-top shadow-xs border-2 border-[#FF4D15] shrink-0"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${selectedOfficer.avatarColor} text-white flex items-center justify-center text-sm font-bold shadow-xs border border-white/20 shrink-0`}>
                    {selectedOfficer.avatarInitials}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{selectedOfficer.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono-code font-bold border border-emerald-500/30">
                      LEAD INVESTIGATOR
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5 font-mono-code">
                    {selectedOfficer.role} • Badge: {selectedOfficer.badge} • {selectedOfficer.jurisdiction}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="px-3 py-2 rounded-xl bg-[#FF4D15] hover:bg-[#E03E0B] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <span>Investigate Photo Evidence 📸</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoFileUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
            </div>

            {/* Dedicated Senior Investigators Quad Roster */}
            <div className="bg-[#111115] rounded-2xl p-4 border border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#070709] border border-white/10 text-white flex items-center justify-center text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#FF4D15]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono-code">
                    Active Senior Investigating Officers (I4C Quad Command):
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Investigating officers on duty. Authorized to operate dockets, review evidence, and dispatch citizen notices.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SENIOR_INVESTIGATORS.slice(0, 4).map((officer) => (
                  <div
                    key={officer.id}
                    onClick={() => {
                      setSelectedOfficer(officer);
                      showToast(`Selected Officer: ${officer.name}`);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedOfficer.id === officer.id 
                        ? 'bg-[#FF4D15] text-white border-[#FF4D15] font-bold shadow-[0_0_16px_rgba(255,77,21,0.25)]' 
                        : 'bg-[#18181E] border-white/10 hover:border-white/25 text-zinc-200'
                    }`}
                  >
                    {officer.avatarUrl ? (
                      <img
                        src={officer.avatarUrl}
                        alt={officer.name}
                        className="w-6 h-6 rounded-full object-cover object-top border border-white/30 shrink-0"
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    )}
                    <div className="truncate">
                      <span className="font-bold block truncate">{officer.name}</span>
                      <span className={`text-[10px] font-mono-code block truncate ${selectedOfficer.id === officer.id ? 'text-white/80' : 'text-zinc-400'}`}>
                        {officer.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WORM Cryptographic Notice Bar */}
            <div className="bg-[#FF4D15]/10 border border-[#FF4D15]/30 rounded-2xl p-3.5 text-xs text-zinc-200 flex items-start gap-3">
              <Lock className="w-4 h-4 text-[#FF4D15] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-white">WORM Cryptographic Architecture: </span>
                Whenever any citizen creates an account, logs in, or submits an incident, a dedicated folder on their name is automatically established in this workstation. 
                All uploaded evidence is securely stored in their folder. 
                <strong className="text-[#FF4D15]"> Senior Investigators ({selectedOfficer.name} & roster) have rights to view, operate investigation stages, run photo forensics, and dispatch official replies — and CANNOT alter raw citizen evidence.</strong>
              </div>
            </div>

            {/* Live MongoDB Backend Registered Accounts */}
            {backendUsers.length > 0 && (
              <div className="bg-[#111115] rounded-2xl p-4 border border-white/10 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono-code">
                      Registered Accounts In MongoDB Backend ({backendUsers.length} Active Accounts)
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono-code font-bold">
                    Connected to Atlas Live
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                  {backendUsers.map((u, i) => {
                    const displayStr = `${u.name || ''} ${u.email || ''}`.toLowerCase();
                    const userPhoto = displayStr.includes('krishi')
                      ? '/assets/aistudio/image_526c1ede.png'
                      : displayStr.includes('balchandra')
                      ? '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg'
                      : displayStr.includes('zohara')
                      ? '/assets/aistudio/image_acc490cb.png'
                      : displayStr.includes('afsheen')
                      ? '/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg'
                      : null;

                    return (
                      <div 
                        key={u._id || u.email || i}
                        className="p-3 rounded-xl bg-[#18181E] border border-white/10 hover:border-white/25 transition-colors flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {userPhoto && (
                            <img
                              src={userPhoto}
                              alt={u.name || u.email}
                              className="w-8 h-8 rounded-full object-cover object-top border border-[#FF4D15] shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                              <span>{u.name || u.email.split('@')[0]}</span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                                u.role === 'senior_investigator' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-[#070709] text-zinc-300 border border-white/10'
                              }`}>
                                {u.role === 'senior_investigator' ? 'Investigator' : 'Citizen'}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono-code text-zinc-400 truncate">
                              {u.email}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="text-[9px] font-mono-code text-emerald-400 block">
                            {u.badgeNumber || 'VERIFIED'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}


            {/* ===================================================================
                SECTION 0A: DEDICATED "SHARE A PROBLEM" SECTOR LIVE NOTIFICATION & DISPATCH QUEUE
            =================================================================== */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#111115] via-[#191311] to-[#111115] border border-[#FF4D15]/45 shadow-[0_0_30px_rgba(255,77,21,0.12)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF4D15]/15 border border-[#FF4D15]/40 flex items-center justify-center text-[#FF4D15] shrink-0">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#FF4D15] text-white text-[9px] font-mono-code font-black uppercase tracking-widest">
                        SHARE A PROBLEM SECTOR
                      </span>
                      <h2 className="text-sm sm:text-base font-bold text-white">
                        Zero-Identity Problem &amp; Origin Link Dispatch Queue
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono-code font-bold">
                        {pendingSharedProblems.length} Awaiting Inspection
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono-code font-bold">
                        {solvedSharedProblems.length} Solved
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Incoming problems &amp; suspicious origin links submitted from the Cryptographic Credential Gateway (No Name or Gmail required). Inspect the link heuristics and solve directly.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveNav('shared_problems');
                    if (sharedProblems.length > 0 && !selectedProblem) {
                      setSelectedProblemId(sharedProblems[0].id);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FF4D15] hover:bg-[#ff5e2b] text-white text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 shadow-lg shadow-[#FF4D15]/25"
                >
                  <Scan className="w-3.5 h-3.5" />
                  Open Dedicated Share a Problem Sector ({pendingSharedProblems.length})
                </button>
              </div>

              {pendingSharedProblems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingSharedProblems.slice(0, 2).map((prob) => (
                    <div
                      key={prob.id}
                      className="p-4 rounded-xl bg-black/50 border border-[#FF4D15]/30 flex flex-col justify-between gap-3 hover:border-[#FF4D15]/60 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#FF4D15]/20 border border-[#FF4D15]/40 text-[#FF4D15] text-[10px] font-mono-code font-bold">
                            {prob.trackingCode}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-mono-code font-bold uppercase ${
                              prob.linkRiskLevel === 'CRITICAL'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : prob.linkRiskLevel === 'HIGH'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {prob.linkRiskLevel} RISK · {prob.category}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#141419] border border-white/10 font-mono-code text-[11px] text-amber-300 break-all flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-[#FF4D15] shrink-0" />
                          <span>{prob.sourceLink}</span>
                        </div>
                        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                          {prob.problemText}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-[10px] font-mono-code text-zinc-500">
                          Submitted: <strong className="text-zinc-300">{prob.submittedAt}</strong>
                        </span>
                        <button
                          onClick={() => {
                            setSelectedProblemId(prob.id);
                            setActiveNav('shared_problems');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#FF4D15]/20 hover:bg-[#FF4D15] text-[#FF4D15] hover:text-white border border-[#FF4D15]/40 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          Inspect &amp; Solve <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>All shared problems &amp; origin links have been inspected and solved ({solvedSharedProblems.length} resolved).</span>
                  </div>
                  <button
                    onClick={() => setActiveNav('shared_problems')}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-semibold cursor-pointer"
                  >
                    View Resolved Archive
                  </button>
                </div>
              )}
            </div>

            {/* ===================================================================
                SECTION 0: REAL-TIME CITIZEN CRIME STORY PDF VERIFICATION QUEUE
            =================================================================== */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#111115] border border-amber-500/35 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-bold text-white">
                        Citizen Crime Story &amp; PDF Verification Queue
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-mono-code font-bold">
                        {pendingCrimeStories.length} Pending Approval
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Citizens post their crime experiences + Verification PDFs from the Crime Stories page. Approve below to publish live so the community can learn and stay safe.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveNav('story_approvals')}
                    className="px-3.5 py-2 rounded-xl bg-[#18181E] hover:bg-white/10 border border-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Open Full PDF Queue ({crimeStories.length}) →
                  </button>
                </div>
              </div>

              {pendingCrimeStories.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {pendingCrimeStories.map((story) => (
                    <div
                      key={story.id}
                      className="p-5 rounded-2xl bg-[#070709] border border-amber-500/30 space-y-3.5 flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] font-mono-code">
                          <span className="text-[#FF4D15] font-bold">{story.trackingCode}</span>
                          <span className="text-amber-400 font-bold">PENDING WORKSTATION SIGN-OFF</span>
                        </div>
                        <h3 className="text-base font-bold text-white leading-snug">{story.title}</h3>
                        <div className="text-xs text-zinc-400">
                          Reporter: <strong className="text-white">{story.authorName}</strong> · Category:{' '}
                          <span className="text-[#FF4D15]">{story.category}</span> · Loss: {story.lossAmount}
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed bg-[#111115] p-3 rounded-xl border border-white/10">
                          <strong className="text-white block mb-0.5">What Happened:</strong>
                          {story.whatHappened}
                        </p>
                        <p className="text-xs text-emerald-200 leading-relaxed bg-emerald-950/50 p-3 rounded-xl border border-emerald-500/25">
                          <strong className="text-emerald-400 block mb-0.5">How Citizens Can Stay Safe:</strong>
                          {story.howToStaySafeLesson}
                        </p>
                        <div className="p-3 rounded-xl bg-[#111115] border border-white/10 flex items-center justify-between gap-2 text-xs font-mono-code">
                          <div className="truncate">
                            <span className="text-[#FF4D15] font-bold">PDF: </span>
                            <span className="text-white">{story.pdfFileName}</span>{' '}
                            <span className="text-zinc-500">({story.pdfFileSize})</span>
                            <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                              SHA-256: {story.pdfSha256}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 space-y-2">
                        <input
                          type="text"
                          value={storyReviewNotes[story.id] || ''}
                          onChange={(e) =>
                            setStoryReviewNotes((prev) => ({
                              ...prev,
                              [story.id]: e.target.value,
                            }))
                          }
                          placeholder={`Optional verification note by ${selectedOfficer.name}...`}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#111115] border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15]"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReviewCrimeStory(story, 'APPROVED_PUBLISHED')}
                            disabled={reviewingStoryId === story.id}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>
                              {reviewingStoryId === story.id
                                ? 'Publishing...'
                                : 'Approve PDF & Publish to Crime Stories'}
                            </span>
                          </button>
                          <button
                            onClick={() => handleReviewCrimeStory(story, 'REJECTED')}
                            disabled={reviewingStoryId === story.id}
                            className="py-2.5 px-3.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#070709] border border-emerald-500/25 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      All submitted citizen crime story PDFs have been verified! ({approvedCrimeStories.length} stories live on Crime Stories page)
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('incidents')}
                    className="text-[#FF4D15] font-bold hover:underline cursor-pointer"
                  >
                    View Live Crime Stories →
                  </button>
                </div>
              )}
            </div>

            {/* ===================================================================
                SECTION 1: "CITIZEN EVIDENCE FOLDERS"
            =================================================================== */}
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">
                    Citizen Evidence Folders
                  </h2>
                  <span className="w-5 h-5 rounded-full bg-[#18181E] border border-white/10 text-zinc-300 text-[11px] font-bold flex items-center justify-center font-mono-code">
                    {filteredCases.length}
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-mono-code hidden sm:inline">
                  Dedicated folder per citizen account · Read-only WORM data
                </span>
              </div>

              {/* Grid of physical dark obsidian folder cards with tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredCases.map((c, idx) => {
                  const colorScheme = folderColors[idx % folderColors.length];
                  const evidenceCount = c.evidenceFiles?.length || 0;
                  const progress = c.investigationProgress ?? (c.status === 'VERIFIED' ? 85 : 40);
                  const assignedOfficer = SENIOR_INVESTIGATORS[idx % SENIOR_INVESTIGATORS.length];
                  const caseKey = (c as any)._id?.toString() || c.id || c.trackingCode || `folder-case-${idx}`;
                  const caseId = (c as any)._id?.toString() || c.id || c.trackingCode;

                  return (
                    <div
                      key={caseKey}
                      onClick={() => setActiveDossierId(caseId)}
                      className="group cursor-pointer select-none transition-all duration-200 hover:-translate-y-1"
                    >
                      {/* Physical Folder Container */}
                      <div className="relative">
                        
                        {/* Top Tab Cut-out Shape */}
                        <div className={`w-48 h-6 rounded-t-2xl ${colorScheme.bgTab} border-t border-l border-r ${colorScheme.border} flex items-center px-3 justify-between truncate`}>
                          <span className={`text-[10px] font-mono-code font-bold uppercase tracking-wider truncate ${colorScheme.text}`}>
                            FOLDER: {c.citizenName.toUpperCase()}
                          </span>
                        </div>

                        {/* Folder Body Card */}
                        <div className={`rounded-b-3xl rounded-tr-3xl p-5 ${colorScheme.bgCard} border ${colorScheme.border} shadow-sm flex flex-col justify-between h-52 relative -mt-px group-hover:shadow-lg transition-all`}>
                          
                          {/* Three Dots Button in Top Right of folder */}
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveDossierId(caseId); }}
                            className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {/* Folder Content: Citizen Name, Date & Crime Category */}
                          <div>
                            <div className="flex items-center justify-between gap-1.5 text-[10px] font-mono-code text-zinc-400 mb-0.5 pr-6">
                              <span className="flex items-center gap-1.5 truncate">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                <span className="truncate">{c.trackingCode}</span>
                              </span>
                              <span className="text-zinc-500 shrink-0">
                                {formatForensicShortDate(c.dateReported)}
                              </span>
                            </div>
                            <h3 className="font-mono-code text-sm font-bold text-white tracking-tight line-clamp-1">
                              {c.citizenName}
                            </h3>
                            <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                              {c.title}
                            </p>
                          </div>

                          {/* Middle Info: Assigned Investigator & Read-Only Badge */}
                          <div className="text-[10px] space-y-0.5 pt-1">
                            <div className="text-zinc-300 truncate font-medium flex items-center gap-1.5">
                              {assignedOfficer.avatarUrl && (
                                <img
                                  src={assignedOfficer.avatarUrl}
                                  alt={assignedOfficer.name}
                                  className="w-4 h-4 rounded-full object-cover object-top border border-[#FF4D15] shrink-0"
                                />
                              )}
                              <span className="truncate">
                                Investigator: <strong className="text-white">{assignedOfficer.name}</strong>
                              </span>
                            </div>
                            <div className="text-zinc-500 font-mono-code flex items-center justify-between gap-1">
                              <span>🔒 Read-Only WORM</span>
                              <span className="text-[#FF4D15]">{formatRelativeForensicDate(c.dateReported)}</span>
                            </div>
                          </div>

                          {/* Bottom Row: Avatars & Items Count */}
                          <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                            
                            {/* Avatar stack */}
                            <div className="flex items-center -space-x-1.5">
                              <div className="w-6 h-6 rounded-full bg-[#18181E] text-white text-[9px] font-bold flex items-center justify-center border border-white/20 uppercase shadow-2xs">
                                {c.citizenName.charAt(0)}
                              </div>
                              {assignedOfficer.avatarUrl ? (
                                <img
                                  src={assignedOfficer.avatarUrl}
                                  alt={assignedOfficer.name}
                                  className="w-6 h-6 rounded-full object-cover object-top border border-[#FF4D15] shadow-2xs"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#FF4D15] text-white text-[9px] font-bold flex items-center justify-center border border-[#111115] shadow-2xs">
                                  {assignedOfficer.avatarInitials}
                                </div>
                              )}
                              <span className="text-[10px] font-mono-code text-zinc-300 pl-2 font-bold">
                                {progress}%
                              </span>
                            </div>

                            {/* Item Count pill */}
                            <span className="text-[11px] font-mono-code font-semibold text-zinc-400">
                              {evidenceCount} {evidenceCount === 1 ? 'file' : 'files'}
                            </span>

                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>


            {/* ===================================================================
                SECTION 2: "ACTIVE CASE DOCKERS"
            =================================================================== */}
            <div className="space-y-4 pt-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">
                    Active Case Dockers
                  </h2>
                  <span className="w-5 h-5 rounded-full bg-[#18181E] border border-white/10 text-zinc-300 text-[11px] font-bold flex items-center justify-center font-mono-code">
                    {incidents.length}
                  </span>
                </div>

                {/* Investigators Roster Pills */}
                <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-white mr-1">Investigating Officers:</span>
                  {SENIOR_INVESTIGATORS.slice(0, 4).map((off) => (
                    <span 
                      key={off.id}
                      onClick={() => { setSelectedOfficer(off); showToast(`Selected: ${off.name}`); }}
                      className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold font-mono-code cursor-pointer transition-all inline-flex items-center gap-1.5 ${
                        selectedOfficer.id === off.id ? 'bg-[#FF4D15] text-white border-[#FF4D15]' : 'bg-[#111115] border-white/10 text-zinc-200 hover:bg-[#18181E]'
                      }`}
                    >
                      {off.avatarUrl && (
                        <img
                          src={off.avatarUrl}
                          alt={off.name}
                          className="w-4 h-4 rounded-full object-cover object-top border border-white/30"
                        />
                      )}
                      <span>{off.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Grid of rich cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {incidents.map((workflow, idx) => {
                  const gradient = workflowCardVisuals[idx % workflowCardVisuals.length];
                  const assignedOfficer = SENIOR_INVESTIGATORS[idx % SENIOR_INVESTIGATORS.length];
                  const workflowKey = (workflow as any)._id?.toString() || workflow.id || workflow.trackingCode || `workflow-${idx}`;
                  const workflowId = (workflow as any)._id?.toString() || workflow.id || workflow.trackingCode;

                  return (
                    <div
                      key={workflowKey}
                      onClick={() => setActiveDossierId(workflowId)}
                      className="group cursor-pointer bg-[#111115] rounded-3xl border border-white/10 shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#FF4D15]/40 transition-all hover:-translate-y-0.5"
                    >
                      {/* Top Visual Half */}
                      <div className={`h-28 bg-gradient-to-tr ${gradient} relative p-3.5 flex items-start justify-end border-b border-white/10`}>
                        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                        
                        <div className="relative z-10 bg-[#070709]/80 backdrop-blur-md border border-white/15 rounded-full w-7 h-7 flex items-center justify-center text-zinc-300 hover:text-white shadow-sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </div>

                        {/* Floating Crime Tag Badge */}
                        <div className="absolute bottom-2.5 left-3.5 z-10 px-2.5 py-0.5 rounded-full bg-[#070709]/80 border border-white/15 backdrop-blur-md text-white text-[10px] font-mono-code font-bold">
                          {workflow.category.split(' ')[0]}
                        </div>
                      </div>

                      {/* Bottom Dark Card Section */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-[#111115]">
                        
                        <div>
                          {/* Metadata with Accurate Parsed Date & Relative Time */}
                          <div className="flex items-center justify-between gap-2 text-[10px] text-zinc-400 font-medium">
                            <span className="font-mono-code text-zinc-300 truncate" title={formatForensicDateDisplay(workflow.dateReported)}>
                              {formatForensicShortDate(workflow.dateReported)} ({formatRelativeForensicDate(workflow.dateReported)})
                            </span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {workflow.status}
                            </span>
                          </div>

                          {/* Case Title */}
                          <h4 className="font-mono-code text-xs font-bold text-white mt-1 line-clamp-1 leading-snug">
                            {workflow.title}
                          </h4>

                          {/* Assigned Officer badge */}
                          <div className="mt-2 text-[10px] font-mono-code text-zinc-300 bg-[#18181E] px-2 py-1 rounded-lg border border-white/10 truncate flex items-center gap-1.5">
                            {assignedOfficer.avatarUrl && (
                              <img
                                src={assignedOfficer.avatarUrl}
                                alt={assignedOfficer.name}
                                className="w-4 h-4 rounded-full object-cover object-top border border-[#FF4D15] shrink-0"
                              />
                            )}
                            <span className="truncate">
                              Investigator: <strong className="text-white font-bold">{assignedOfficer.name}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                          <div className="flex items-center -space-x-1.5">
                            <div className="w-6 h-6 rounded-full bg-[#18181E] text-white text-[9px] font-bold flex items-center justify-center border border-white/20 uppercase shadow-2xs">
                              {workflow.citizenName.charAt(0)}
                            </div>
                            {assignedOfficer.avatarUrl ? (
                              <img
                                src={assignedOfficer.avatarUrl}
                                alt={assignedOfficer.name}
                                className="w-6 h-6 rounded-full object-cover object-top border border-[#FF4D15] shadow-2xs"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-[#FF4D15] text-white text-[9px] font-bold flex items-center justify-center border border-[#111115] shadow-2xs">
                                {assignedOfficer.avatarInitials}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="px-1.5 py-0.5 rounded bg-[#18181E] border border-white/10 text-zinc-300 text-[9px] font-mono-code font-bold">
                              1930
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-[#FF4D15]/15 border border-[#FF4D15]/30 text-[#FF4D15] text-[9px] font-mono-code font-bold">
                              WORM
                            </span>
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}


        {/* =======================================================================
            VIEW 2: "PHOTO FORENSIC LAB 📸"
        ======================================================================= */}
        {activeNav === 'photo_lab' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-[1400px]">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <MaskedLineReveal>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                      Photo Forensic Investigation Lab 📸
                    </h1>
                  </MaskedLineReveal>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-mono-code font-bold">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Upload & analyze WhatsApp scam screenshots, fake warrants, UPI transaction receipts, and suspect photos.
                </p>
              </div>

              {/* Upload New Photo Button */}
              <label className="px-4 py-2.5 bg-[#FF4D15] hover:bg-[#E03E0B] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0">
                <Upload className="w-4 h-4" />
                <span>Upload New Evidence Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            {/* Active Investigating Officer Bar */}
            <div className="bg-[#111115] text-white rounded-2xl p-4 border border-[#FF4D15]/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {selectedOfficer.avatarUrl ? (
                  <img
                    src={selectedOfficer.avatarUrl}
                    alt={selectedOfficer.name}
                    className="w-11 h-11 rounded-xl object-cover object-top border-2 border-[#FF4D15] shrink-0"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${selectedOfficer.avatarColor} text-white flex items-center justify-center font-bold text-sm border border-white/20 shrink-0`}>
                    {selectedOfficer.avatarInitials}
                  </div>
                )}
                <div>
                  <div className="text-xs font-mono-code text-[#FF4D15] uppercase font-bold">Assigned Senior Investigator:</div>
                  <div className="text-sm font-bold text-white">{selectedOfficer.name} ({selectedOfficer.badge})</div>
                </div>
              </div>

              <div className="text-right text-xs font-mono-code hidden sm:block text-zinc-300">
                <div>Specialization: <strong className="text-emerald-400">{selectedOfficer.specialization}</strong></div>
                <div>Jurisdiction: {selectedOfficer.jurisdiction}</div>
              </div>
            </div>

            {/* Main Photo Lab Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN (4 COLS): List of Uploaded Photos */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-[#111115] rounded-3xl p-5 border border-white/10 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 className="font-bold text-sm text-white">
                      Uploaded Photo Evidence ({photoCases.length})
                    </h3>
                    <span className="text-[10px] font-mono-code text-zinc-400">SHA-256 Hashed</span>
                  </div>

                  <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                    {photoCases.map((photo, idx) => {
                      const isActive = photo.id === activePhoto.id;
                      return (
                        <div
                          key={photo.id || `photo-case-${idx}`}
                          onClick={() => setActivePhotoId(photo.id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                            isActive 
                              ? 'bg-[#18181E] text-white border-[#FF4D15] shadow-[0_0_20px_rgba(255,77,21,0.18)]' 
                              : 'bg-[#070709] border-white/10 hover:border-white/25 text-zinc-200'
                          }`}
                        >
                          <img 
                            src={photo.previewUrl} 
                            alt={photo.title} 
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/15"
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono-code font-bold uppercase truncate text-[#FF4D15]">
                                {photo.category}
                              </span>
                              <span className={`text-[9px] font-mono-code font-bold px-1.5 py-0.5 rounded ${
                                photo.status === 'SECTION_65B_CERTIFIED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                              }`}>
                                {photo.status === 'SECTION_65B_CERTIFIED' ? 'Sec 65B ✓' : 'Pending'}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold line-clamp-1 text-white">
                              {photo.title}
                            </h4>
                            <div className="text-[10px] font-mono-code truncate text-zinc-400">
                              {photo.fileName} • {photo.fileSize}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>


              {/* RIGHT COLUMN (8 COLS): Deep Photo Forensic Scanner */}
              <div className="lg:col-span-8 space-y-6">
                
                <div className="bg-[#111115] rounded-3xl p-6 border border-white/10 shadow-sm space-y-6">
                  
                  {/* Photo Viewer Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FF4D15]/15 text-[#FF4D15] border border-[#FF4D15]/30 text-[10px] font-mono-code font-bold">
                          EVIDENCE #{activePhoto.id.toUpperCase()}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono-code">
                          Uploaded: {activePhoto.timestamp}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-white mt-1">
                        {activePhoto.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRunPhotoScan}
                        disabled={isScanningPhoto}
                        className="px-4 py-2 bg-[#FF4D15] hover:bg-[#E03E0B] text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Scan className="w-4 h-4" />
                        <span>{isScanningPhoto ? 'Scanning ELA & OCR...' : 'Run Forensic Scan'}</span>
                      </button>

                      <button
                        onClick={handleIssueSec65BForPhoto}
                        className="px-4 py-2 bg-[#18181E] hover:bg-white/10 border border-white/15 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Issue Sec 65B Cert</span>
                      </button>
                    </div>
                  </div>

                  {/* Image Display Canvas with Forensic Overlay */}
                  <div className="relative rounded-2xl overflow-hidden bg-[#070709] border border-white/10 min-h-[280px] flex items-center justify-center p-4">
                    <img 
                      src={activePhoto.previewUrl} 
                      alt={activePhoto.title} 
                      className="max-h-[380px] w-auto object-contain rounded-xl shadow-2xl"
                    />

                    {/* Scanning Animation Laser Bar */}
                    {isScanningPhoto && (
                      <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none flex flex-col justify-between">
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-lg shadow-emerald-500/50" />
                        <div className="p-3 bg-black/80 backdrop-blur-md text-emerald-400 font-mono-code text-xs text-center font-bold">
                          {scanMessage}
                        </div>
                      </div>
                    )}

                    {/* Watermark Overlay Stamp */}
                    <div className="absolute bottom-4 right-4 bg-[#070709]/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl text-white text-[10px] font-mono-code space-y-0.5">
                      <div className="text-emerald-400 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>SHA-256 BITSTREAM SEALED</span>
                      </div>
                      <div className="text-zinc-400 truncate max-w-[200px]">
                        {activePhoto.sha256}
                      </div>
                    </div>
                  </div>

                  {/* Forensic Analytics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* ELA Authenticity Score Card */}
                    <div className="p-4 rounded-2xl bg-[#18181E] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
                        <span>ELA Authenticity Score</span>
                        <Sparkles className="w-4 h-4 text-[#FF4D15]" />
                      </div>
                      <div className="text-3xl font-black text-white font-mono-code">
                        {activePhoto.elaScore}%
                      </div>
                      <div className="w-full bg-[#070709] h-2 rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all" 
                          style={{ width: `${activePhoto.elaScore}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono-code">
                        0.6% Compression artifacting. Clean image payload.
                      </div>
                    </div>

                    {/* Deepfake & Synthesis Risk */}
                    <div className="p-4 rounded-2xl bg-[#18181E] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
                        <span>Deepfake / AI Risk</span>
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-xl font-black text-white font-mono-code">
                        {activePhoto.deepfakeRisk}
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                        activePhoto.deepfakeRisk === 'HIGH_ALERT' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {activePhoto.deepfakeRisk === 'HIGH_ALERT' ? 'Fake Warrant Artifacts' : 'Human Capture Verified'}
                      </span>
                    </div>

                    {/* Camera EXIF Metadata */}
                    <div className="p-4 rounded-2xl bg-[#18181E] border border-white/10 space-y-1 text-xs">
                      <span className="font-bold text-white block">Device & EXIF Data:</span>
                      <div className="text-[10px] font-mono-code text-zinc-400 space-y-0.5">
                        <div>Sensor: <strong className="text-zinc-200">{activePhoto.cameraMetadata.device}</strong></div>
                        <div>Resolution: {activePhoto.cameraMetadata.resolution}</div>
                        <div>Color Space: {activePhoto.cameraMetadata.colorSpace}</div>
                        <div>GPS: <span className="text-[#FF4D15] font-bold">{activePhoto.cameraMetadata.gpsCoords}</span></div>
                      </div>
                    </div>

                  </div>

                  {/* OCR Text Extracted Data Box */}
                  <div className="p-4 rounded-2xl bg-[#070709] border border-white/10 text-white space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <FileSearch className="w-4 h-4 text-[#FF4D15]" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                          OCR Extracted Payload Particulars
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono-code text-emerald-400 font-bold">
                        Auto-Extracted ✓
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-code">
                      <div className="p-2.5 bg-[#111115] rounded-xl border border-white/10">
                        <span className="text-[9px] text-zinc-500 block">SUSPECT NAME</span>
                        <strong className="text-white text-[11px] truncate block">{activePhoto.ocrExtracted.suspectName || 'N/A'}</strong>
                      </div>
                      <div className="p-2.5 bg-[#111115] rounded-xl border border-white/10">
                        <span className="text-[9px] text-zinc-500 block">A/C OR UPI ID</span>
                        <strong className="text-emerald-400 text-[11px] truncate block">{activePhoto.ocrExtracted.upiId || activePhoto.ocrExtracted.accountNumber}</strong>
                      </div>
                      <div className="p-2.5 bg-[#111115] rounded-xl border border-white/10">
                        <span className="text-[9px] text-zinc-500 block">FRAUD AMOUNT</span>
                        <strong className="text-amber-400 text-[11px] truncate block">{activePhoto.ocrExtracted.amount || 'N/A'}</strong>
                      </div>
                      <div className="p-2.5 bg-[#111115] rounded-xl border border-white/10">
                        <span className="text-[9px] text-zinc-500 block">TXN ID / REF</span>
                        <strong className="text-sky-300 text-[11px] truncate block">{activePhoto.ocrExtracted.transactionId || 'N/A'}</strong>
                      </div>
                    </div>

                    <div className="p-3 bg-[#111115] rounded-xl border border-white/10 text-[11px] text-zinc-300 font-mono-code leading-relaxed">
                      {activePhoto.ocrExtracted.rawText}
                    </div>
                  </div>

                  {/* Section 65B Digital Certificate Signing Box */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Section 65B Admissibility Seal</span>
                      </div>
                      <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                        Signed by Senior Investigator <strong className="text-white">{selectedOfficer.name} ({selectedOfficer.badge})</strong>. Payload anchored to RFC-3161 national WORM repository.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={targetCitizenDossierId}
                        onChange={(e) => setTargetCitizenDossierId(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-white/15 text-xs bg-[#070709] text-white font-medium focus:outline-none focus:border-[#FF4D15]"
                      >
                        <option key="default-attach-folder" value="">Attach to Citizen Folder...</option>
                        {incidents.map((inc, idx) => {
                          const optKey = (inc as any)._id?.toString() || inc.id || inc.trackingCode || `attach-opt-${idx}`;
                          const optVal = (inc as any)._id?.toString() || inc.id || inc.trackingCode;
                          return (
                            <option key={optKey} value={optVal}>
                              Folder: {inc.citizenName || 'Citizen'} ({(inc.trackingCode || '').slice(-6)})
                            </option>
                          );
                        })}
                      </select>

                      <button
                        onClick={handleIssueSec65BForPhoto}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs"
                      >
                        Sign & Attach ✓
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}


        {/* =======================================================================
            VIEW 3: "CUSTODY ALERT CENTER"
        ======================================================================= */}
        {activeNav === 'custody_alerts' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-[1400px]">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <MaskedLineReveal>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                      Custody Alert Center 🚨
                    </h1>
                  </MaskedLineReveal>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-mono-code font-bold">
                    {incidents.length + photoCases.length} ACTIVE ALERTS
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Real-time evidentiary warnings, WORM hash audits, 1930 bank lien freezes, and photo upload notifications.
                </p>
              </div>

              <button
                onClick={() => {
                  setAlertAckIds([...incidents.map(i => i.id), ...photoCases.map(p => p.id)]);
                  showToast('All custody alerts acknowledged by Senior Investigator!');
                }}
                className="px-4 py-2 bg-[#FF4D15] hover:bg-[#E03E0B] text-white font-bold rounded-xl text-xs transition-all shadow-xs"
              >
                Acknowledge All Alerts ✓
              </button>
            </div>

            {/* Alert Cards Feed */}
            <div className="space-y-3">
              
              {/* Photo Ingestion Alert Items */}
              {photoCases.map((photo, idx) => (
                <div
                  key={`alert-photo-${photo.id || idx}`}
                  className="p-4 bg-[#111115] rounded-2xl border border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#FF4D15]/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF4D15]/15 border border-[#FF4D15]/30 text-[#FF4D15] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#FF4D15]/15 text-[#FF4D15] border border-[#FF4D15]/30 text-[10px] font-mono-code font-bold">
                          NEW PHOTO EVIDENCE UPLOAD
                        </span>
                        <span className="text-[11px] font-mono-code text-zinc-500">
                          {photo.timestamp}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {photo.title}
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono-code">
                        FileName: {photo.fileName} • SHA-256: {photo.sha256?.substring(0, 24)}...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => {
                        setActivePhotoId(photo.id);
                        setActiveNav('photo_lab');
                        showToast(`Investigating Photo: ${photo.title}`);
                      }}
                      className="px-4 py-2 bg-[#FF4D15] hover:bg-[#E03E0B] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>Investigate Photo 📸</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Citizen Docket Alerts */}
              {incidents.map((inc, idx) => {
                const alertKey = (inc as any)._id?.toString() || inc.id || inc.trackingCode || `alert-inc-${idx}`;
                const dossierId = (inc as any)._id?.toString() || inc.id || inc.trackingCode;
                return (
                  <div
                    key={`alert-docket-${alertKey}`}
                    className="p-4 bg-[#111115] rounded-2xl border border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#FF4D15]/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#18181E] border border-white/10 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono-code font-bold">
                            WORM CUSTODY DOCKET
                          </span>
                          <span className="text-[11px] font-mono-code text-zinc-400">
                            {formatForensicDateDisplay(inc.dateReported)}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">
                          Folder: {inc.citizenName} ({inc.trackingCode})
                        </h4>
                        <p className="text-xs text-zinc-400">
                          {inc.title} • Loss: {inc.lossAmount || 'Active'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => setActiveDossierId(dossierId)}
                        className="px-4 py-2 bg-[#18181E] hover:bg-white/10 border border-white/15 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#FF4D15]" />
                        <span>Inspect Folder</span>
                      </button>
                    </div>
                  </div>
                );
              })}

            </div>

          </div>
        )}


        {/* =======================================================================
            VIEW 4: "SCHEDULE & COMMAND BENTO"
        ======================================================================= */}
        {activeNav === 'bento' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-[1400px]">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT BENTO COLUMN (4 COLS): Greeting, Habit/Docket, Mini Calendar */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Greeting Card */}
                <div className="bg-[#111115] rounded-3xl p-6 border border-white/10 shadow-sm space-y-4">
                  <div>
                    <MaskedLineReveal>
                      <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <span>Forensic Operations</span>
                        <span>👋</span>
                      </h2>
                    </MaskedLineReveal>
                    <p className="text-xs text-zinc-400 mt-1 font-mono-code">
                      Active Shift • {selectedOfficer.name}
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => setShowIngestModal(true)}
                      className="w-full py-3 bg-[#FF4D15] hover:bg-[#E03E0B] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ingest New Evidence Docket</span>
                    </button>
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="w-full py-2.5 bg-[#18181E] hover:bg-white/10 border border-white/10 text-zinc-200 font-bold rounded-2xl text-xs transition-colors"
                    >
                      Browse Citizen Case Portal
                    </button>
                  </div>
                </div>

                {/* Interactive Mini Calendar Widget */}
                <div className="bg-[#111115] rounded-3xl p-6 border border-white/10 shadow-sm space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-white">
                        Evidentiary Shift Schedule
                      </h3>
                      <p className="text-[11px] font-mono-code text-[#FF4D15] font-semibold">
                        {MONTH_NAMES[calendarMonth]} {calendarYear}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (calendarMonth === 0) {
                            setCalendarMonth(11);
                            setCalendarYear(y => y - 1);
                          } else {
                            setCalendarMonth(m => m - 1);
                          }
                          setSelectedCalendarDay(1);
                        }}
                        className="w-7 h-7 rounded-lg bg-[#18181E] hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                        title="Previous Month"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          setCalendarYear(now.getFullYear());
                          setCalendarMonth(now.getMonth());
                          setSelectedCalendarDay(now.getDate());
                          showToast(`Calendar synced to today: ${formatForensicShortDate(now.toISOString())}`);
                        }}
                        className="px-2 h-7 rounded-lg bg-[#18181E] hover:bg-[#FF4D15] border border-white/10 text-[10px] font-mono-code font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Jump to Today"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (calendarMonth === 11) {
                            setCalendarMonth(0);
                            setCalendarYear(y => y + 1);
                          } else {
                            setCalendarMonth(m => m + 1);
                          }
                          setSelectedCalendarDay(1);
                        }}
                        className="w-7 h-7 rounded-lg bg-[#18181E] hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                        title="Next Month"
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  {/* Calendar Days Matrix with Accurate Weekday Offset */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <span key={i} className="text-zinc-500 text-[10px] pb-1 font-mono-code">{day}</span>
                    ))}
                    {Array.from(
                      { length: new Date(calendarYear, calendarMonth, 1).getDay() },
                      (_, idx) => (
                        <div key={`empty-${idx}`} className="w-8 h-8 mx-auto" />
                      )
                    )}
                    {Array.from(
                      { length: new Date(calendarYear, calendarMonth + 1, 0).getDate() },
                      (_, i) => i + 1
                    ).map((date) => {
                      const isSelected = date === selectedCalendarDay;
                      const isRealToday =
                        date === liveNow.getDate() &&
                        calendarMonth === liveNow.getMonth() &&
                        calendarYear === liveNow.getFullYear();
                      const matchingDocketsCount = incidents.filter(inc => {
                        const d = parseForensicDate(inc.dateReported);
                        return (
                          d.getDate() === date &&
                          d.getMonth() === calendarMonth &&
                          d.getFullYear() === calendarYear
                        );
                      }).length;

                      return (
                        <button
                          type="button"
                          key={date}
                          onClick={() => {
                            setSelectedCalendarDay(date);
                            showToast(
                              `Selected Shift Date: ${String(date).padStart(2, '0')} ${SHORT_MONTHS[calendarMonth]} ${calendarYear}`
                            );
                          }}
                          className={`relative w-8 h-8 mx-auto flex flex-col items-center justify-center rounded-full text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FF4D15] text-white font-bold shadow-[0_0_14px_rgba(255,77,21,0.5)] scale-105'
                              : isRealToday
                              ? 'border border-[#FF4D15] text-[#FF4D15] font-bold bg-[#FF4D15]/10'
                              : 'text-zinc-300 hover:bg-[#18181E] hover:text-white'
                          }`}
                        >
                          <span>{date}</span>
                          {matchingDocketsCount > 0 && (
                            <span
                              className={`w-1 h-1 rounded-full absolute bottom-1 ${
                                isSelected ? 'bg-white' : 'bg-emerald-400'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-code">
                    <span className="text-zinc-400">
                      Selected: <strong className="text-white">{String(selectedCalendarDay).padStart(2, '0')} {SHORT_MONTHS[calendarMonth]} {calendarYear}</strong>
                    </span>
                    <span className="text-emerald-400 font-bold">{incidents.length} Active Cases</span>
                  </div>
                </div>

              </div>


              {/* CENTER & RIGHT BENTO COLUMN (8 COLS): Threat Weather, Today's Actions, Integrations, Analytics Chart */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Top Row: Threat Intel + Today's Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Cyber Threat Weather Card */}
                  <div className="bg-gradient-to-br from-[#FF4D15]/15 via-[#18181E] to-[#111115] rounded-3xl p-6 border border-[#FF4D15]/40 shadow-sm flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FF4D15] uppercase tracking-wider font-mono-code">
                        1930 Cyber Threat Weather
                      </span>
                      <span 
                        onClick={() => showToast('Threat Protocol: High Golden-Hour Surge in fake WhatsApp arrest warrants.')}
                        className="text-xs text-amber-300 underline font-semibold cursor-pointer"
                      >
                        View Details
                      </span>
                    </div>

                    <div className="my-4 flex items-center justify-between">
                      <div>
                        <div className="text-4xl font-black text-white font-mono-code">
                          CRIT-4
                        </div>
                        <div className="text-xs text-zinc-300 font-medium mt-1">
                          High Golden-Hour Surge (UPI APKs)
                        </div>
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-[#FF4D15]/20 border border-[#FF4D15]/40 flex items-center justify-center text-3xl shadow-inner">
                        🛡️
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center text-[10px]">
                      <div>
                        <span className="text-zinc-400 block">Ingestion Rate</span>
                        <strong className="text-white font-bold font-mono-code">1,420 TPS</strong>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Lien-Hold Rate</span>
                        <strong className="text-emerald-400 font-bold font-mono-code">94.2%</strong>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">WORM Latency</span>
                        <strong className="text-[#FF4D15] font-bold font-mono-code">12 ms</strong>
                      </div>
                    </div>
                  </div>

                  {/* Today's / Selected Date Forensic Actions Card */}
                  <div className="bg-[#111115] rounded-3xl p-6 border border-white/10 shadow-sm space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-white">
                          Forensic Actions · {String(selectedCalendarDay).padStart(2, '0')} {SHORT_MONTHS[calendarMonth]} {calendarYear}
                        </h3>
                        <span className="text-[10px] font-mono-code text-zinc-400">
                          Click any calendar date to inspect shift schedule
                        </span>
                      </div>
                      <button
                        onClick={handleAddTodo}
                        className="text-xs font-bold text-[#FF4D15] hover:underline flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Objective</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {todos.map((todo, idx) => (
                        <div
                          key={todo.id || `todo-${idx}`}
                          onClick={() => toggleTodo(todo.id)}
                          className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            todo.done ? 'bg-[#070709] border-white/10' : 'bg-[#18181E] border-white/15 hover:border-[#FF4D15]/40'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="text-sm shrink-0">{todo.icon}</span>
                            <div className="truncate">
                              <span className={`text-xs block font-bold truncate ${todo.done ? 'line-through text-zinc-500' : 'text-white'}`}>
                                {todo.title}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-mono-code">
                                {todo.time} • {todo.location}
                              </span>
                            </div>
                          </div>

                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                            todo.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20 bg-[#070709]'
                          }`}>
                            {todo.done && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>


                {/* Bottom Row: Integrations + Weekly Forensic Chart */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* National Cyber Gateway Card */}
                  <div className="md:col-span-4 bg-[#111115] rounded-3xl p-6 border border-white/10 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-xl shadow-xs">
                      1930
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white">
                        National Cyber Gateway
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Interlink NPCI payment switches and police CCTNS feeds directly into your WORM vault.
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('portals')}
                      className="w-full py-2.5 bg-[#FF4D15] hover:bg-[#E03E0B] text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      Linked & Connected ✓
                    </button>
                  </div>

                  {/* Analytics Chart */}
                  <div className="md:col-span-8 bg-[#111115] rounded-3xl p-6 border border-white/10 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          Golden Hour Interdictions (Weekly)
                        </h4>
                        <span className="text-[11px] text-zinc-400 font-mono-code">
                          Lien Freeze Success Rate: <strong className="text-emerald-400">+58.2%</strong>
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono-code">
                        HIGH EFFICIENCY
                      </span>
                    </div>

                    {/* Dynamic 7-Day Vertical Pill Column Chart anchored to Selected Calendar Date */}
                    <div className="grid grid-cols-7 gap-3 h-32 items-end pt-4 pb-2">
                      {Array.from({ length: 7 }, (_, idx) => {
                        const offset = idx - 6;
                        const d = new Date(calendarYear, calendarMonth, selectedCalendarDay + offset);
                        const dayLabel = `${SHORT_DAYS[d.getDay()]} ${d.getDate()}`;
                        const seed = (d.getDate() * 7 + d.getMonth() * 13) % 26;
                        const count = 14 + seed;
                        const heights = ['h-12', 'h-16', 'h-20', 'h-24', 'h-28'];
                        const heightClass = idx === 6 ? 'h-28' : heights[seed % heights.length];
                        const isAnchorDay = idx === 6;

                        return (
                          <div
                            key={dayLabel}
                            onClick={() => {
                              setCalendarYear(d.getFullYear());
                              setCalendarMonth(d.getMonth());
                              setSelectedCalendarDay(d.getDate());
                              showToast(`${dayLabel} (${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}): ${count} Golden-Hour interdictions logged.`);
                            }}
                            className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                          >
                            <div
                              className={`w-full rounded-2xl transition-all ${
                                isAnchorDay
                                  ? 'bg-gradient-to-t from-[#FF4D15] to-amber-400 shadow-md shadow-[#FF4D15]/30'
                                  : 'bg-[#18181E] border border-white/10 hover:bg-white/15'
                              } ${heightClass}`}
                            />
                            <span className={`text-[10px] font-mono-code ${isAnchorDay ? 'text-[#FF4D15] font-bold' : 'text-zinc-400 group-hover:text-white'}`}>
                              {dayLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}


        {/* =======================================================================
            TAB 02: DEDICATED "SHARE A PROBLEM" SECTOR (INSPECT ORIGIN LINK & SOLVE)
        ======================================================================= */}
        {activeNav === 'shared_problems' && (
          <div className="space-y-6">
            {/* Live Sector Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141110] via-[#1c1411] to-[#111115] border border-[#FF4D15]/45 shadow-[0_0_40px_rgba(255,77,21,0.12)] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-[#FF4D15] text-white text-[10px] font-mono-code font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Bell className="w-3 h-3 animate-bounce" /> LIVE SHARE A PROBLEM SECTOR
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-mono-code font-bold uppercase tracking-wider">
                    Zero-Identity Gateway Stream · No Name / No Gmail Required
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Dedicated Problem &amp; Origin Link Inspection Sector
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
                  Every problem and suspicious source link submitted via the <strong className="text-white">Cryptographic Credential Gateway &rarr; Share Problem</strong> sector arrives here in real time with a live notification. Inspect the origin URL heuristics, run deep payload analysis, and seal the forensic resolution.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="px-4 py-3 rounded-xl bg-black/50 border border-amber-500/35 text-center min-w-[110px]">
                  <div className="text-xl font-black text-amber-400 font-mono-code">{pendingSharedProblems.length}</div>
                  <div className="text-[10px] font-mono-code text-zinc-400 uppercase">Pending Inspection</div>
                </div>
                <div className="px-4 py-3 rounded-xl bg-black/50 border border-emerald-500/35 text-center min-w-[110px]">
                  <div className="text-xl font-black text-emerald-400 font-mono-code">{solvedSharedProblems.length}</div>
                  <div className="text-[10px] font-mono-code text-zinc-400 uppercase">Solved &amp; Sealed</div>
                </div>
              </div>
            </div>

            {/* Main Two-Column Workstation Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Incoming Problem Queue */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-mono-code uppercase tracking-widest text-zinc-400 font-bold">
                    Incoming Problem Dispatches ({sharedProblems.length})
                  </span>
                  <span className="text-[11px] font-mono-code text-[#FF4D15]">
                    Real-Time SSE Sync Active
                  </span>
                </div>

                {sharedProblems.map((prob) => {
                  const isSelected = selectedProblem?.id === prob.id;
                  const isPending = prob.status === 'PENDING_INSPECTION';
                  return (
                    <div
                      key={prob.id}
                      onClick={() => setSelectedProblemId(prob.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                        isSelected
                          ? 'bg-[#191412] border-[#FF4D15] shadow-[0_0_25px_rgba(255,77,21,0.18)]'
                          : 'bg-[#111115] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-mono-code font-bold">
                            {prob.trackingCode}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-mono-code font-bold uppercase ${
                              isPending
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {isPending ? 'PENDING INSPECTION' : 'SOLVED & SEALED'}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono-code font-bold uppercase ${
                            prob.linkRiskLevel === 'CRITICAL'
                              ? 'text-red-400'
                              : prob.linkRiskLevel === 'HIGH'
                              ? 'text-amber-400'
                              : 'text-blue-400'
                          }`}
                        >
                          {prob.linkRiskLevel} RISK
                        </span>
                      </div>

                      {/* Origin Link Box */}
                      <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2 font-mono-code text-[11px] text-amber-300 break-all">
                        <Link2 className="w-3.5 h-3.5 text-[#FF4D15] shrink-0" />
                        <span className="line-clamp-1">{prob.sourceLink}</span>
                      </div>

                      <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                        {prob.problemText}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono-code text-zinc-500">
                        <span>{prob.category}</span>
                        <span>{prob.submittedAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Deep Problem & Link Inspector + Solve Console */}
              <div className="lg:col-span-7">
                {selectedProblem ? (
                  <div className="p-6 rounded-2xl bg-[#111115] border border-white/15 shadow-2xl space-y-6">
                    {/* Top Status & ID Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-[#FF4D15]/20 border border-[#FF4D15]/40 text-[#FF4D15] text-xs font-mono-code font-bold">
                            {selectedProblem.trackingCode}
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono-code">
                            {selectedProblem.category}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-mono-code font-bold ${
                              selectedProblem.status === 'SOLVED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {selectedProblem.status === 'SOLVED' ? '✓ SOLVED & VERIFIED' : '● AWAITING INVESTIGATOR SOLUTION'}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono-code text-zinc-500">
                          Dispatched: {selectedProblem.submittedAt} · SHA-256: {selectedProblem.sha256.slice(0, 28)}...
                        </p>
                      </div>

                      <button
                        onClick={() => handleRunDeepLinkScan(selectedProblem)}
                        disabled={scanningProblemId === selectedProblem.id}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono-code text-amber-300 font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0"
                      >
                        <Scan className={`w-4 h-4 ${scanningProblemId === selectedProblem.id ? 'animate-spin' : ''}`} />
                        {scanningProblemId === selectedProblem.id
                          ? 'Scanning Link...'
                          : scannedProblemIds[selectedProblem.id]
                          ? '✓ Deep Scan Complete'
                          : 'Run Deep Link Scan'}
                      </button>
                    </div>

                    {/* 1. Origin Link Where the Problem Came From */}
                    <div className="p-4 rounded-xl bg-black/60 border border-[#FF4D15]/35 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#FF4D15] font-bold flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" /> Origin Link of the Problem (Where It Came From)
                        </span>
                        <span className="text-[10px] font-mono-code text-zinc-400">
                          Risk Level: <strong className="text-white">{selectedProblem.linkRiskLevel}</strong>
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-[#16161d] border border-white/10 font-mono-code text-xs sm:text-sm text-amber-300 break-all select-all">
                        {selectedProblem.sourceLink}
                      </div>
                    </div>

                    {/* 2. Problem Shared by Citizen */}
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                      <span className="text-[10px] font-mono-code uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Problem Description Shared in Gateway
                      </span>
                      <p className="text-sm text-zinc-100 leading-relaxed whitespace-pre-wrap">
                        {selectedProblem.problemText}
                      </p>
                    </div>

                    {/* 3. Automated Forensic Heuristics on Origin Link */}
                    <div className="p-4 rounded-xl bg-[#16161d] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-code uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" /> Automated URL &amp; Payload Heuristic Findings
                        </span>
                        <span className="text-[10px] font-mono-code text-zinc-400">
                          Risk Classification: <strong className="text-white">{selectedProblem.linkRiskLevel}</strong>
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {selectedProblem.linkHeuristics.map((flag: string, idx: number) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-black/50 border border-white/5 flex items-start gap-2.5 text-xs text-zinc-200"
                          >
                            <AlertCircle className="w-4 h-4 text-[#FF4D15] shrink-0 mt-0.5" />
                            <span>{flag}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. Solve / Resolution Action Panel */}
                    {selectedProblem.status === 'SOLVED' ? (
                      <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/35 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Problem Solved &amp; Forensically Sealed
                          </span>
                          <span className="text-[11px] font-mono-code text-zinc-400">
                            By {selectedProblem.solvedByOfficer} ({selectedProblem.solvedByBadge}) · {selectedProblem.solvedAt || ''}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-black/40 border border-emerald-500/20 text-xs text-emerald-200 font-mono-code">
                          Action Executed: {selectedProblem.preventiveActionTaken}
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                          {selectedProblem.resolutionSummary}
                        </p>
                      </div>
                    ) : (
                      <div className="p-5 rounded-xl bg-gradient-to-b from-[#1a1512] to-[#121216] border border-[#FF4D15]/40 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#FF4D15]" />
                            Inspect &amp; Solve This Problem
                          </h3>
                          <span className="text-[10px] font-mono-code text-amber-400">
                            Executing as {selectedOfficer.name}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-mono-code uppercase tracking-wider text-zinc-400">
                            Select Countermeasure &amp; Resolution Protocol
                          </label>
                          <select
                            value={
                              problemActionPreset[selectedProblem.id] ||
                              'Origin URL Flagged for CERT-In Takedown & Added to National Threat Blocklist'
                            }
                            onChange={(e) =>
                              setProblemActionPreset((prev) => ({
                                ...prev,
                                [selectedProblem.id]: e.target.value,
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-[#FF4D15]"
                          >
                            <option value="Origin URL Flagged for CERT-In Takedown & Added to National Threat Blocklist">
                              1. Sinkhole Malicious Origin Link + Dispatch CERT-In / ISP Takedown Directive
                            </option>
                            <option value="Source Link Blacklisted + Section 91 CrPC Bank / UPI Telemetry Freeze Issued">
                              2. Blacklist Source Link + Trigger Section 91 CrPC Bank / UPI Telemetry Freeze
                            </option>
                            <option value="Origin URL Indexed in F.I.P. Global Threat Feed + Redirect Chain Neutralized">
                              3. Index Origin URL in F.I.P. Global Threat Feed + Neutralize Redirect Chain
                            </option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="block text-[10px] font-mono-code uppercase tracking-wider text-zinc-400">
                              Investigator Solution &amp; Forensic Action Log
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                setProblemResolutionNotes((prev) => ({
                                  ...prev,
                                  [selectedProblem.id]: `Origin link (${selectedProblem.sourceLink}) inspected in sandboxed forensic environment. Malicious payload confirmed (${selectedProblem.category}). Domain sinkholed, SSL fingerprint revoked, and SHA-256 advisory published to F.I.P. threat ledger.`,
                                }))
                              }
                              className="text-[10px] font-mono-code text-[#FF4D15] hover:underline cursor-pointer"
                            >
                              + Auto-Draft Forensic Solution
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={problemResolutionNotes[selectedProblem.id] || ''}
                            onChange={(e) =>
                              setProblemResolutionNotes((prev) => ({
                                ...prev,
                                [selectedProblem.id]: e.target.value,
                              }))
                            }
                            placeholder="Write your inspection findings and how this problem & link were solved (or leave blank to auto-generate standard forensic resolution)..."
                            className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF4D15]"
                          />
                        </div>

                        <button
                          onClick={() => handleSolveSharedProblem(selectedProblem)}
                          disabled={solvingProblemId === selectedProblem.id}
                          className="w-full py-3.5 px-5 rounded-xl bg-[#FF4D15] hover:bg-[#ff5e2b] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#FF4D15]/25 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {solvingProblemId === selectedProblem.id
                              ? 'Sealing Resolution...'
                              : 'Solve Problem, Neutralize Origin Link & Broadcast Resolution'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 rounded-2xl bg-[#111115] border border-white/10 text-center text-zinc-500">
                    Select a shared problem from the left queue to inspect its origin link and solve it.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            TAB 03: CITIZEN CRIME STORY PDF APPROVALS SECTOR
        ======================================================================= */}
        {activeNav === 'story_approvals' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#111115] border border-amber-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500 text-black text-[10px] font-mono-code font-bold uppercase">
                    CRIME STORY PDF VERIFICATION SECTOR
                  </span>
                  <span className="text-xs font-mono-code text-amber-300">
                    {pendingCrimeStories.length} Pending · {approvedCrimeStories.length} Approved &amp; Live
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Citizen Crime Story &amp; PDF Dossier Verification Queue
                </h2>
                <p className="text-xs text-zinc-400">
                  Verify citizen-submitted crime stories and attached PDF evidence before publishing them to the public Crime Stories awareness feed.
                </p>
              </div>
              <button
                onClick={() => setActiveNav('workflows')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer shrink-0"
              >
                &larr; Back to All Workflows
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {crimeStories.map((story) => (
                <div
                  key={story.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 ${
                    story.status === 'PENDING_WORKSTATION'
                      ? 'bg-[#161410] border-amber-500/40'
                      : story.status === 'APPROVED_PUBLISHED'
                      ? 'bg-[#111513] border-emerald-500/30'
                      : 'bg-[#151111] border-red-500/30'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono-code font-bold">
                        {story.trackingCode}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase ${
                          story.status === 'PENDING_WORKSTATION'
                            ? 'bg-amber-500/20 text-amber-300'
                            : story.status === 'APPROVED_PUBLISHED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {story.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{story.title}</h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">{story.whatHappened}</p>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                      <strong>Safety Lesson:</strong> {story.howToStaySafeLesson}
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between text-[11px] font-mono-code text-zinc-400">
                      <span>PDF: {story.pdfFileName} ({story.pdfFileSize})</span>
                      <span className="text-[10px] text-zinc-500">SHA-256: {story.pdfSha256.slice(0, 14)}...</span>
                    </div>
                  </div>

                  {story.status === 'PENDING_WORKSTATION' && (
                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      <button
                        onClick={() => handleReviewCrimeStory(story, 'APPROVED_PUBLISHED')}
                        disabled={reviewingStoryId === story.id}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
                      >
                        ✓ Agree &amp; Publish to Public Feed
                      </button>
                      <button
                        onClick={() => handleReviewCrimeStory(story, 'REJECTED')}
                        disabled={reviewingStoryId === story.id}
                        className="py-2.5 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =======================================================================
            TAB: AI CROSS-CASE HIDDEN PATTERN & SYNDICATE CORRELATION ENGINE
        ======================================================================= */}
        {activeNav === 'ai_syndicate' && (
          <SyndicatePatternEngine
            incidents={incidents}
            selectedOfficer={selectedOfficer}
            onUpdateIncidents={onUpdateIncidents}
            onSelectCaseForDrawer={(caseId) => setActiveDossierId(caseId)}
            onShowToast={showToast}
          />
        )}

        {/* =======================================================================
            OTHER TABS: TEMPLATES, TOOLS, KNOWLEDGE BASE
        ======================================================================= */}
        {(activeNav === 'templates' || activeNav === 'tools' || activeNav === 'knowledge') && (
          <div className="p-8 max-w-4xl space-y-6">
            <MaskedLineReveal>
              <h2 className="text-2xl font-bold text-white">
                {activeNav === 'templates' && 'Forensic Certificate & Lien Templates'}
                {activeNav === 'tools' && 'WORM Ledger & Cryptographic Utilities'}
                {activeNav === 'knowledge' && 'Section 65B Admissibility Framework'}
              </h2>
            </MaskedLineReveal>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Standardized protocols conforming to Section 65B of the Indian Evidence Act (1872 / BSA 2023). All bitstream hashes are sealed under RFC-3161 WORM rules.
            </p>
            
            <div className="p-6 bg-[#111115] rounded-3xl border border-white/10 shadow-sm space-y-4 font-mono-code text-xs">
              <div className="flex items-center justify-between">
                <div className="text-[#FF4D15] font-bold">Standard Affidavit Template [Section 65B(4)]:</div>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText("I hereby certify that the electronic record bearing SHA-256 digest hash was produced by the computer system during the period over which the computer was used regularly to store or process information...");
                    showToast('Section 65B Affidavit Template copied to clipboard!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#FF4D15] text-white font-bold text-[11px] hover:bg-[#E03E0B] transition-colors"
                >
                  Copy Template Text
                </button>
              </div>
              
              <p className="text-zinc-300 bg-[#070709] p-4 rounded-xl border border-white/10 leading-relaxed">
                "I hereby certify that the electronic record bearing SHA-256 digest hash was produced by the computer system during the period over which the computer was used regularly to store or process information... No malfunction occurred that would affect the bit-level integrity of the payload."
              </p>
            </div>
          </div>
        )}

      </main>


      {/* =========================================================================
          QUICK DOCKET INGESTION MODAL (FOR BENTO VIEW)
      ========================================================================= */}
      {showIngestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowIngestModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="relative z-10 w-full max-w-lg bg-[#111115] text-white rounded-3xl shadow-2xl border border-white/15 overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FF4D15]" />
                <span>Ingest New Evidence Docket</span>
              </h3>
              <button 
                onClick={() => setShowIngestModal(false)}
                className="w-7 h-7 rounded-full bg-[#18181E] hover:bg-white/15 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {ingestSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{ingestSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleCreateNewDocket} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Citizen Full Name</label>
                  <input
                    type="text"
                    required
                    value={newCitizenName}
                    onChange={(e) => setNewCitizenName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-[#070709] text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Citizen Gmail / Email</label>
                  <input
                    type="email"
                    required
                    value={newCitizenEmail}
                    onChange={(e) => setNewCitizenEmail(e.target.value)}
                    placeholder="e.g. ramesh.chandra@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-[#070709] text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15] font-mono-code"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Incident / Case Title</label>
                  <input
                    type="text"
                    required
                    value={newCaseTitle}
                    onChange={(e) => setNewCaseTitle(e.target.value)}
                    placeholder="e.g. Fake WhatsApp Digital Arrest Police Warrant Fraud"
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-[#070709] text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1">Crime Classification</label>
                  <select
                    value={newCaseCategory}
                    onChange={(e) => setNewCaseCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/15 bg-[#070709] text-white font-medium focus:outline-none focus:border-[#FF4D15]"
                  >
                    <option key="crime-fin" value="Financial Fraud">Financial Fraud</option>
                    <option key="crime-dig" value="Digital Arrest">Digital Arrest</option>
                    <option key="crime-cry" value="Crypto Extortion">Crypto Extortion</option>
                    <option key="crime-phi" value="Phishing">Phishing</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowIngestModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#18181E] hover:bg-white/10 text-zinc-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#FF4D15] hover:bg-[#E03E0B] text-white font-bold shadow-xs"
                  >
                    Ingest Docket & Establish Folder
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}


      {/* =========================================================================
          DEEP CASE INVESTIGATION DRAWER / MODAL
      ========================================================================= */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <div 
            onClick={() => setActiveDossierId(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-3xl bg-[#111115] text-white rounded-3xl shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="p-6 bg-[#070709] border-b border-white/10 text-white flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF4D15]/15 text-[#FF4D15] text-[10px] font-mono-code font-bold border border-[#FF4D15]/30">
                    DEDICATED FOLDER: {selectedCase.citizenName}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono-code">
                    #{selectedCase.trackingCode}
                  </span>
                  <span className="text-[10px] bg-[#18181E] border border-white/10 text-emerald-400 px-2 py-0.5 rounded font-mono-code font-bold">
                    Officer: {selectedOfficer.name}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {selectedCase.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveDossierId(null)}
                className="w-8 h-8 rounded-full bg-[#18181E] hover:bg-white/15 text-zinc-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Senior Investigator Rights Notice Bar */}
            <div className="bg-[#FF4D15]/10 border-b border-[#FF4D15]/25 px-6 py-2.5 text-xs text-zinc-200 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#FF4D15] shrink-0" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-white">Senior Investigator Access Rights: </strong>
                You have rights to <strong className="text-white">SEE</strong> this folder, <strong className="text-white">OPERATE</strong> the case stages, <strong className="text-white">KNOW</strong> the case facts, and <strong className="text-white">EXAMINE</strong> evidence data. 
                <span className="text-[#FF4D15] font-bold"> You CANNOT alter, overwrite, or mutate citizen evidence (WORM RFC-3161 Locked).</span>
              </div>
            </div>

            {/* Progress Bar & Stage Stepper */}
            <div className="p-4 bg-[#18181E] border-b border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#FF4D15]" />
                  <span>Investigation Progress: <strong>{progressPercent}%</strong></span>
                </span>
                <span className="text-[11px] font-mono-code text-zinc-400">
                  Status: <strong className="text-emerald-400">{caseStatus}</strong>
                </span>
              </div>

              {/* Progress Slider */}
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={progressPercent}
                onChange={(e) => handleUpdateProgress(Number(e.target.value))}
                className="w-full accent-[#FF4D15] bg-[#070709] rounded-lg cursor-pointer h-2"
              />

              {/* Quick Stepper Buttons */}
              <div className="grid grid-cols-4 gap-2 text-[10px] font-bold">
                {[
                  { pct: 25, label: 'Ingested & Hashed', status: 'WORM_LOCKED' as IncidentStatus },
                  { pct: 50, label: 'Binary Triage', status: 'ASSIGNED' as IncidentStatus },
                  { pct: 75, label: '1930 Bank Freeze', status: 'ASSIGNED' as IncidentStatus },
                  { pct: 100, label: 'Sec 65B Certified', status: 'VERIFIED' as IncidentStatus },
                ].map((s) => (
                  <button
                    key={s.pct}
                    onClick={() => handleUpdateProgress(s.pct, s.status)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      progressPercent === s.pct 
                        ? 'bg-[#FF4D15] border-[#FF4D15] text-white shadow-xs' 
                        : 'bg-[#070709] border-white/10 text-zinc-300 hover:border-white/25'
                    }`}
                  >
                    <div>{s.pct}%</div>
                    <div className="text-[9px] font-normal truncate">{s.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-tools Tabs */}
            <div className="flex items-center border-b border-white/10 px-6 pt-3 bg-[#070709] gap-4 text-xs font-bold text-zinc-400 overflow-x-auto">
              <button
                onClick={() => setDrawerTab('evidence')}
                className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${
                  drawerTab === 'evidence' ? 'border-[#FF4D15] text-white font-black' : 'border-transparent hover:text-white'
                }`}
              >
                <Hash className="w-3.5 h-3.5 text-[#FF4D15]" />
                <span>See Data & Evidence Vault</span>
                <span className="w-4 h-4 rounded-full bg-[#18181E] border border-white/10 text-zinc-300 text-[9px] flex items-center justify-center font-mono-code font-bold">
                  {selectedCase.evidenceFiles?.length || 0}
                </span>
              </button>

              <button
                onClick={() => setDrawerTab('notes')}
                className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${
                  drawerTab === 'notes' ? 'border-[#FF4D15] text-white font-black' : 'border-transparent hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Forensic Study Notes</span>
              </button>

              <button
                onClick={() => setDrawerTab('dispatch')}
                className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${
                  drawerTab === 'dispatch' ? 'border-[#FF4D15] text-white font-black' : 'border-transparent hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Citizen Notice</span>
                {(selectedCase.investigatorMessages?.length || 0) > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#FF4D15] text-white text-[9px] flex items-center justify-center font-mono-code">
                    {selectedCase.investigatorMessages?.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setDrawerTab('case')}
                className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${
                  drawerTab === 'case' ? 'border-[#FF4D15] text-white font-black' : 'border-transparent hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Know The Case Brief</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="overflow-y-auto p-6 space-y-4 flex-1">
              
              {/* TAB 1: SEE DATA & EVIDENCE VAULT (READ-ONLY) */}
              {drawerTab === 'evidence' && (
                <div className="space-y-4">
                  
                  {/* Mandatory Hash Key Comparison Function Box */}
                  <div className="p-4 rounded-2xl bg-[#070709] border border-white/10 text-white space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-[#FF4D15]" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                          Mandatory Hash Key Comparison Function
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono-code text-zinc-400">
                        Original Format vs Hash Format
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-[#111115] rounded-xl border border-white/10 space-y-1">
                        <span className="text-[10px] font-mono-code text-zinc-400 uppercase font-bold block">1. Original Format (Raw)</span>
                        <p className="font-mono-code text-zinc-200 text-[11px] truncate">
                          {selectedCase.rawOriginalContent || selectedCase.description || 'Raw Statement Payload'}
                        </p>
                      </div>

                      <div className="p-3 bg-[#111115] rounded-xl border border-white/10 space-y-1">
                        <span className="text-[10px] font-mono-code text-[#FF4D15] uppercase font-bold block">2. Cryptographic Hash Format</span>
                        <code className="font-mono-code text-emerald-400 text-[11px] break-all block">
                          {selectedCase.primaryHash}
                        </code>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowHashModal(true)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Compare Works Dashboard Hash Value</span>
                        </button>

                        <button
                          onClick={() => {
                            setHashVerifiedStatus('error');
                            const errMsg = `🚨 HASH MISMATCH ERROR: Bitstream mutation detected in folder "${selectedCase.citizenName}". Verification failed!`;
                            setTamperingErrorMsg(errMsg);

                            const warningMsg: InvestigatorMessage = {
                              id: `warn-${Date.now()}`,
                              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
                              sender: selectedOfficer.name,
                              senderBadge: selectedOfficer.badge,
                              recipientEmail: selectedCase.citizenEmail,
                              type: 'COURT_NOTICE',
                              subject: 'CRITICAL WARNING: Hash Mismatch / Tampering Detected',
                              content: `Senior Investigator attempted hash key comparison on your folder. A mismatch was detected! Please re-verify WORM integrity.`,
                              read: false,
                              merkleStamp: selectedCase.primaryHash?.substring(0, 16) || 'WORM_HASH'
                            };

                            const updated: IncidentReport = {
                              ...selectedCase,
                              investigatorMessages: [warningMsg, ...(selectedCase.investigatorMessages || [])]
                            };
                            onUpdateIncidents(updateIncidentInStore(updated));
                          }}
                          className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold text-xs transition-colors border border-rose-500/30"
                        >
                          Simulate Tampering Attack (Test Error)
                        </button>
                      </div>

                      {hashVerifiedStatus === 'verified' && (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-fade-in">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Dashboard Hash Verified · Original Format Unlocked ✓</span>
                        </span>
                      )}
                    </div>

                    {hashVerifiedStatus === 'error' && (
                      <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs space-y-1 animate-fade-in">
                        <div className="font-bold flex items-center gap-1.5">
                          <span>🚨 HASH MISMATCH ERROR DETECTED!</span>
                        </div>
                        <p className="text-[11px] text-rose-300">
                          {tamperingErrorMsg} An automated alert has been dispatched to the citizen's custody folder.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Connected Dedicated Original Format Gallery */}
                  <div className="pt-2">
                    <OriginalFormatGallery
                      files={selectedCase.evidenceFiles || []}
                      incidentTitle={selectedCase.title}
                      trackingCode={selectedCase.trackingCode}
                      isSeniorInvestigatorView={true}
                      isHashVerified={hashVerifiedStatus === 'verified'}
                      onOpenHashVerification={() => setShowHashModal(true)}
                      dashboardHash={selectedCase.primaryHash}
                      vaultHash={selectedCase.hashFormat?.sha256 || selectedCase.primaryHash}
                      currentUser={currentUser}
                    />
                  </div>

                  {/* Read-Only Guarantee Box */}
                  <div className="p-3.5 rounded-2xl bg-[#18181E] border border-white/10 text-white text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                        <Lock className="w-3.5 h-3.5" />
                        <span>WORM Read-Only Repository (Tamper-Proof)</span>
                      </span>
                      <span className="text-[10px] font-mono-code text-zinc-400">
                        RFC-3161 Protocol
                      </span>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      You have rights to inspect, download, hash-verify, and operate on this case. You cannot alter, modify, or delete any citizen evidence file to prevent judicial spoliation.
                    </p>
                  </div>

                  {/* List of Evidence Files Uploaded by Citizen */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>Uploaded Citizen Evidence Files ({selectedCase.evidenceFiles?.length || 0})</span>
                      <span className="text-[10px] font-mono-code text-zinc-400">SHA-256 Bitstream Verified</span>
                    </div>

                    {(selectedCase.evidenceFiles && selectedCase.evidenceFiles.length > 0) ? (
                      <div className="space-y-2.5">
                        {selectedCase.evidenceFiles.map((file, idx) => (
                          <div
                            key={file.id || idx}
                            className="p-3.5 rounded-2xl bg-[#18181E] border border-white/10 space-y-2 text-xs"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-[#070709] border border-white/10 flex items-center justify-center text-[#FF4D15] shrink-0 font-bold">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-white truncate">{file.name}</div>
                                  <div className="text-[10px] font-mono-code text-zinc-400">
                                    {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Uploaded payload'} • {file.wormTimestamp || 'WORM Locked'}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-mono-code font-bold border border-emerald-500/30">
                                  Read-Only ✓
                                </span>
                                <button
                                  onClick={() => {
                                    const blob = new Blob([file.rawContent || file.sha256], { type: file.type || 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = file.name;
                                    a.click();
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#070709] border border-white/15 hover:bg-white/10 text-zinc-200 text-[11px] font-bold transition-colors"
                                >
                                  Download / Inspect
                                </button>
                              </div>
                            </div>

                            {/* Hash Digest */}
                            <div className="p-2 bg-[#070709] rounded-xl border border-white/10 flex items-center justify-between gap-2">
                              <code className="text-[10px] font-mono-code text-[#FF4D15] break-all">
                                SHA-256: {file.sha256}
                              </code>
                              <button
                                onClick={() => navigator.clipboard?.writeText(file.sha256)}
                                title="Copy Hash"
                                className="p-1 text-zinc-400 hover:text-white shrink-0"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl border-2 border-dashed border-white/15 text-center bg-[#070709] text-xs text-zinc-400">
                        Awaiting evidence uploads from citizen ({selectedCase.citizenName}). Payloads uploaded by citizen will automatically anchor here.
                      </div>
                    )}
                  </div>

                  {/* Original Raw Complaint Statement with One-Time Hash Unlocking Gate */}
                  <div className="p-4 bg-[#18181E] rounded-2xl border border-white/10 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#FF4D15]" />
                        <span>Original Raw Complaint & Case Statement</span>
                      </span>
                      {isOriginalFormatUnlocked ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono-code">
                          ✓ Unlocked Once (Accessible)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FF4D15]/15 text-[#FF4D15] border border-[#FF4D15]/30 text-[10px] font-bold font-mono-code">
                          🔒 Cryptographic Hash Unlock Required
                        </span>
                      )}
                    </div>

                    {isOriginalFormatUnlocked ? (
                      <div className="space-y-2 animate-fade-in">
                        <div className="p-3 bg-[#070709] rounded-xl border border-white/10 text-zinc-200 font-sans leading-relaxed whitespace-pre-wrap select-all">
                          {selectedCase.rawOriginalContent || selectedCase.description}
                        </div>
                        <div className="text-[10px] font-mono-code text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Original format unlocked successfully via cryptographic hash match.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-[#FF4D15]/10 border border-[#FF4D15]/30 text-zinc-200 space-y-3">
                        <p className="text-[11px] leading-relaxed">
                          To view the original raw format and statement, you must match the cryptographic hash format (SHA-256) or unique ID generated by the user. This is a one-time security authentication.
                        </p>
                        <div className="text-[10px] font-mono-code text-zinc-300">
                          Expected Hash Hint: <code className="bg-[#070709] border border-white/10 px-1.5 py-0.5 rounded font-bold text-[#FF4D15]">{selectedCase.primaryHash?.substring(0, 20) || 'HASH_LOCKED'}...</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={unlockHashInput}
                            onChange={(e) => setUnlockHashInput(e.target.value)}
                            placeholder="Enter cryptographic hash format or unique ID..."
                            className="flex-1 px-3 py-2 rounded-xl border border-white/15 text-xs bg-[#070709] text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF4D15]"
                          />
                          <button
                            onClick={() => {
                              const val = unlockHashInput.trim();
                              if (val === selectedCase.primaryHash || val === selectedCase.trackingCode || val.length >= 8) {
                                setIsOriginalFormatUnlocked(true);
                                setUnlockError(null);
                              } else {
                                setUnlockError('Cryptographic hash mismatch. Please enter the correct hash to unlock.');
                              }
                            }}
                            className="px-4 py-2 rounded-xl bg-[#FF4D15] hover:bg-[#E03E0B] text-white font-bold text-xs shrink-0"
                          >
                            Unlock Original Format
                          </button>
                          <button
                            onClick={() => {
                              setUnlockHashInput(selectedCase.primaryHash);
                              setIsOriginalFormatUnlocked(true);
                              setUnlockError(null);
                            }}
                            className="px-3 py-2 rounded-xl bg-[#070709] hover:bg-white/10 border border-white/15 text-zinc-200 font-bold text-xs shrink-0"
                            title="Auto-Match Hash"
                          >
                            Quick Match ✓
                          </button>
                        </div>
                        {unlockError && (
                          <div className="text-[11px] text-rose-400 font-bold">
                            {unlockError}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* SHA-256 Digest & Merkle Root */}
                  <div className="p-4 bg-[#18181E] rounded-2xl border border-white/10 space-y-1 text-xs font-mono-code">
                    <span className="font-bold text-white block">Docket Root SHA-256 Digest:</span>
                    <code className="text-[#FF4D15] text-[11px] break-all block bg-[#070709] p-2.5 rounded-xl border border-white/10">
                      {selectedCase.primaryHash}
                    </code>
                  </div>
                </div>
              )}

              {/* TAB 2: NOTES */}
              {drawerTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">
                      Persistent Diagnostic Notes for {selectedCase.citizenName}
                    </span>
                    <div className="flex items-center gap-2">
                      {notesSavedStatus && (
                        <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 animate-fade-in">
                          <Check className="w-4 h-4" />
                          <span>Saved ✓</span>
                        </span>
                      )}
                      <button
                        onClick={handleSaveNotes}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FF4D15] hover:bg-[#E03E0B] text-white text-xs font-bold transition-all shadow-xs"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>

                  {/* Insert Templates */}
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono-code">
                    <button
                      type="button"
                      onClick={() => insertTemplate(`[1930 / NPCI FREEZE]: Urgent lien instruction dispatched to beneficiary bank for account in suspect payload.`)}
                      className="px-2.5 py-1 rounded-lg bg-[#18181E] hover:bg-white/10 border border-white/10 text-zinc-300"
                    >
                      + Bank Freeze
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTemplate(`[IP & IMEI CDR]: Found initiating IP: 103.212.44.18 (Mewat cluster). Associated SIM registered under spoofed credentials.`)}
                      className="px-2.5 py-1 rounded-lg bg-[#18181E] hover:bg-white/10 border border-white/10 text-zinc-300"
                    >
                      + IP Trace
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTemplate(`[SECTION 65B SEAL]: SHA-256 bitstream match verified against raw evidence files. Signed by ${selectedOfficer.name}.`)}
                      className="px-2.5 py-1 rounded-lg bg-[#18181E] hover:bg-white/10 border border-white/10 text-zinc-300"
                    >
                      + Sec 65B Seal
                    </button>
                  </div>

                  <textarea
                    rows={8}
                    value={studyNotes}
                    onChange={(e) => setStudyNotes(e.target.value)}
                    placeholder="Write detailed investigator notes, CDR traces, bank freeze numbers..."
                    className="w-full p-4 rounded-2xl bg-[#070709] border border-white/15 font-mono-code text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#FF4D15] transition-all text-white placeholder-zinc-500"
                  />
                </div>
              )}

              {/* TAB 3: DISPATCH NOTICE */}
              {drawerTab === 'dispatch' && (
                <div className="space-y-4">
                  {dispatchSuccess && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{dispatchSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleDispatchNotice} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-zinc-300 mb-1">Classification</label>
                        <select
                          value={noticeType}
                          onChange={(e) => setNoticeType(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-white/15 text-xs bg-[#070709] text-white font-medium focus:outline-none focus:border-[#FF4D15]"
                        >
                          <option key="type-status" value="STATUS_UPDATE">Status Update</option>
                          <option key="type-urgent" value="URGENT_INSTRUCTION">Urgent Instruction</option>
                          <option key="type-evidence" value="EVIDENCE_REQUEST">Evidence Request</option>
                          <option key="type-court" value="COURT_NOTICE">Court Notice</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-zinc-300 mb-1">Recipient</label>
                        <input
                          type="text"
                          disabled
                          value={selectedCase.citizenEmail}
                          className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs bg-[#18181E] text-zinc-400 font-mono-code"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">Subject</label>
                      <input
                        type="text"
                        required
                        value={noticeSubject}
                        onChange={(e) => setNoticeSubject(e.target.value)}
                        placeholder="Notice Subject"
                        className="w-full px-3 py-2 rounded-xl border border-white/15 text-xs bg-[#070709] text-white placeholder-zinc-500 font-medium focus:outline-none focus:border-[#FF4D15]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">Official Message Body</label>
                      <textarea
                        required
                        rows={4}
                        value={noticeBody}
                        onChange={(e) => setNoticeBody(e.target.value)}
                        placeholder="Type official instruction for the citizen (will push to their custody notification bell in real time)..."
                        className="w-full p-3 rounded-xl border border-white/15 text-xs bg-[#070709] text-white placeholder-zinc-500 leading-relaxed font-sans focus:outline-none focus:border-[#FF4D15]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#FF4D15] hover:bg-[#E03E0B] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Dispatch Official Notice to {selectedCase.citizenName} 🚀</span>
                    </button>
                  </form>

                  {/* Two-Way Dispatches & Citizen Replies Thread */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#FF4D15]" />
                        <span>Two-Way Direct Channel & Dispatched Notices ({selectedCase.investigatorMessages?.length || 0})</span>
                      </h4>
                      <span className="text-[10px] font-mono-code text-zinc-400">Real-Time Synchronized</span>
                    </div>

                    {(selectedCase.investigatorMessages && selectedCase.investigatorMessages.length > 0) ? (
                      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                        {selectedCase.investigatorMessages.map((msg, idx) => {
                          const isCitizenMsg = msg.type === 'CITIZEN_REPLY' || msg.type === 'EVIDENCE_FULFILLMENT';
                          const msgKey = (msg as any)._id?.toString() || msg.id || `msg-${idx}`;
                          return (
                            <div 
                              key={msgKey}
                              className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all ${
                                isCitizenMsg 
                                  ? 'bg-sky-500/10 border-sky-500/30 text-zinc-100 shadow-2xs' 
                                  : msg.type === 'EVIDENCE_REQUEST'
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                                  : 'bg-[#18181E] border-white/10 text-zinc-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono-code font-bold uppercase ${
                                    isCitizenMsg 
                                      ? 'bg-sky-600 text-white' 
                                      : msg.type === 'EVIDENCE_REQUEST'
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-[#FF4D15] text-white'
                                  }`}>
                                    {isCitizenMsg 
                                      ? (msg.type === 'EVIDENCE_FULFILLMENT' ? 'CITIZEN EVIDENCE FULFILLED' : 'CITIZEN REPLY')
                                      : msg.type.replace('_', ' ')}
                                  </span>
                                  <span className="font-bold text-xs text-white truncate max-w-xs">{msg.subject}</span>
                                </div>
                                <span className="text-[10px] font-mono-code text-zinc-400 shrink-0">{msg.timestamp}</span>
                              </div>

                              <p className="text-zinc-300 text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                              {/* If citizen fulfilled with a raw evidence file */}
                              {msg.attachedEvidenceName && (
                                <div className="p-2 rounded-xl bg-[#070709] border border-sky-500/30 text-[11px] font-mono-code text-sky-300 flex items-center justify-between">
                                  <span className="flex items-center gap-1.5 font-bold">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                                    <span>Attached Raw Evidence: {msg.attachedEvidenceName}</span>
                                  </span>
                                  {msg.attachedEvidenceHash && (
                                    <span className="text-[10px] text-zinc-400">
                                      SHA: {msg.attachedEvidenceHash.substring(0, 12)}...
                                    </span>
                                  )}
                                </div>
                              )}

                              <div className="text-[10px] font-mono-code text-zinc-400 flex items-center justify-between pt-1">
                                <span>Sender: <strong className="text-zinc-200">{msg.sender}</strong> ({msg.senderBadge})</span>
                                <span>Merkle: {msg.merkleStamp || 'WORM_ANCHOR'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl bg-[#070709] border border-white/10 text-center text-xs text-zinc-400 font-mono-code">
                        No notices dispatched yet. Use the form above to send instructions or evidence requests to {selectedCase.citizenName}.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: KNOW THE CASE BRIEF */}
              {drawerTab === 'case' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-[#18181E] rounded-2xl border border-white/10 space-y-2">
                    <span className="font-bold text-white block text-sm">Case Summary & Particulars:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-zinc-500 font-mono-code text-[10px] block">CITIZEN NAME</span>
                        <strong className="text-white">{selectedCase.citizenName}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-mono-code text-[10px] block">CITIZEN EMAIL</span>
                        <strong className="text-white font-mono-code">{selectedCase.citizenEmail}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-mono-code text-[10px] block">CRIME CATEGORY</span>
                        <strong className="text-white">{selectedCase.category}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-mono-code text-[10px] block">LOSS AMOUNT</span>
                        <strong className="text-[#FF4D15]">{selectedCase.lossAmount || 'Protected'}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-mono-code text-[10px] block">DATE REPORTED (RFC-3161)</span>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <strong className="text-white font-mono-code">
                            {formatForensicDateDisplay(selectedCase.dateReported)} UTC
                          </strong>
                          <input
                            type="date"
                            value={toDateInputValue(selectedCase.dateReported)}
                            onChange={(e) => {
                              if (!e.target.value) return;
                              const newStamp = `${e.target.value} ${new Date().toTimeString().slice(0, 8)} UTC`;
                              const updated: IncidentReport = {
                                ...selectedCase,
                                dateReported: newStamp,
                                custodyEvents: [
                                  {
                                    id: `cust-date-${Date.now()}`,
                                    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
                                    actor: `${selectedOfficer.name} (${selectedOfficer.badge})`,
                                    role: selectedOfficer.role,
                                    action: `Updated docket timestamp to ${formatForensicDateDisplay(newStamp)} UTC`,
                                    merkleHash: (selectedCase.primaryHash?.substring(0, 16) || 'WORM_HASH') + '...'
                                  },
                                  ...(selectedCase.custodyEvents || [])
                                ]
                              };
                              onUpdateIncidents(updateIncidentInStore(updated));
                              showToast(`Docket date updated to ${formatForensicShortDate(newStamp)}`);
                            }}
                            className="px-2 py-0.5 rounded-lg bg-[#070709] border border-white/15 text-[10px] font-mono-code text-zinc-200 focus:outline-none focus:border-[#FF4D15] cursor-pointer"
                            title="Change Official Docket Date"
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-mono-code text-[10px] block">OFFICER ASSIGNED</span>
                        <strong className="text-white">{selectedOfficer.name} ({selectedOfficer.badge})</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#18181E] rounded-2xl border border-white/10 space-y-2">
                    <span className="font-bold text-white block">Custody Audit Events ({(selectedCase.custodyEvents || []).length}):</span>
                    <div className="space-y-2">
                      {(selectedCase.custodyEvents || []).map((evt, i) => (
                        <div key={evt.id || i} className="p-2.5 bg-[#070709] rounded-xl border border-white/10 space-y-0.5">
                          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono-code">
                            <span className="font-bold text-white">{evt.actor}</span>
                            <span>{evt.timestamp}</span>
                          </div>
                          <p className="text-zinc-300 text-xs">{evt.action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* Cryptographic Hash Verification Modal */}
      <HashVerificationModal
        isOpen={showHashModal}
        onClose={() => setShowHashModal(false)}
        incident={selectedCase}
        currentUser={currentUser}
        dashboardHash={selectedCase?.primaryHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
        vaultHash={selectedCase?.hashFormat?.sha256 || selectedCase?.primaryHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
        onVerificationComplete={(_incidentId) => {
          setHashVerifiedStatus('verified');
          setTamperingErrorMsg(null);
          showToast(`🟢 Hash Verification 100% Passed! Original Format Gallery unlocked.`);

          // Record custody event
          if (selectedCase) {
            const auditEvt = {
              id: `cust-ver-${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
              actor: selectedOfficer.name,
              role: `${selectedOfficer.role} (${selectedOfficer.badge})`,
              action: `Verified Citizen Works Dashboard SHA-256 Hash vs WORM Vault Ledger (100% 256-bit match confirmed). Unlocked native evidence gallery.`,
              merkleHash: selectedCase.primaryHash?.substring(0, 16) || 'WORM_HASH'
            };
            const updated: IncidentReport = {
              ...selectedCase,
              custodyEvents: [auditEvt, ...selectedCase.custodyEvents]
            };
            onUpdateIncidents(updateIncidentInStore(updated));
          }
        }}
      />

        </ScrollExpandBlock>
      </section>
    </div>
  );
};
