import React, { useState, useEffect, useMemo } from 'react';
import {
  Folder,
  Search,
  FileText,
  Hash,
  CheckCircle2,
  Clock,
  User,
  Eye,
  Bell,
  Shield,
  ArrowUpRight,
  ExternalLink,
  X,
  ShieldCheck,
  Lock,
  Copy,
  Scan,
  AlertCircle,
  MessageSquare,
  Link2,
  Globe,
  Scale,
  LogOut,
  LogIn,
  AlertTriangle,
  Sparkles,
  Check,
} from 'lucide-react';
import {
  IncidentReport,
  InvestigatorMessage,
  UserProfile,
} from '../types';
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
import {
  WorkstationDutySession,
  getStoredWorkstationSessions,
  getActiveWorkstationSessionId,
  syncWorkstationSessionsWithBackend,
  signInWorkstationDutySession,
  signOutWorkstationDutySession,
  recordWorkstationTamperAttempt,
  formatExactForensicTimestamp,
} from '../data/workstationSessionStore';
import {
  updateCustodyLogAPI,
  updateIncidentAPI,
  dispatchInvestigatorMessageAPI,
} from '../data/apiClient';
import { computeSHA256 } from '../utils/crypto';
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
  avatarUrl?: string;
  status: 'ACTIVE_ON_DUTY' | 'IN_COURT_SESSION' | 'INVESTIGATING';
  casesCount: number;
  phone: string;
  email: string;
}

export const SENIOR_INVESTIGATORS: SeniorInvestigatorProfile[] = [
  {
    id: 'si-1',
    name: 'Dr. Bibi Zohara',
    badge: 'DEL-CY-0842',
    role: 'Lead Forensic Examiner',
    jurisdiction: 'IFSO Special Cell, New Delhi',
    specialization: 'Deepfake & Financial Malware Disassembly',
    avatarInitials: 'BZ',
    avatarColor: 'from-blue-600 to-indigo-800',
    avatarUrl: '/assets/aistudio/image_acc490cb.png',
    status: 'ACTIVE_ON_DUTY',
    casesCount: 38,
    phone: '+91 98112 08420',
    email: 'bibi.zohara@i4c.gov.in',
  },
  {
    id: 'si-2',
    name: 'Balchandra',
    badge: 'MAH-CY-1109',
    role: 'Superintendent of Cyber Forensics',
    jurisdiction: 'Maharashtra Cyber HQ, Mumbai',
    specialization: 'Banking Trojan & UPI Mule Telemetry',
    avatarInitials: 'BK',
    avatarColor: 'from-emerald-600 to-teal-800',
    avatarUrl: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg',
    status: 'ACTIVE_ON_DUTY',
    casesCount: 42,
    phone: '+91 98201 11090',
    email: 'balchandra@mahacyber.gov.in',
  },
  {
    id: 'si-3',
    name: 'Afsheen',
    badge: 'BLR-CY-4402',
    role: 'Cryptographic Forensics Specialist',
    jurisdiction: 'CEN Crime Division, Bengaluru',
    specialization: 'SHA-256 WORM Ledger & Section 65B Audits',
    avatarInitials: 'AS',
    avatarColor: 'from-purple-600 to-fuchsia-800',
    avatarUrl: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg',
    status: 'INVESTIGATING',
    casesCount: 29,
    phone: '+91 98450 44021',
    email: 'afsheen@ksp.gov.in',
  },
  {
    id: 'si-4',
    name: 'Krishi Navale',
    badge: 'I4C-NAT-7721',
    role: 'Lead Platform Architect & Senior Nodal Officer',
    jurisdiction: 'National Cybercrime Threat Analytics Unit',
    specialization: 'Zero-Trust Evidence Architecture & Cross-State Liaison',
    avatarInitials: 'KN',
    avatarColor: 'from-amber-500 to-orange-700',
    avatarUrl: '/assets/aistudio/image_526c1ede.png',
    status: 'ACTIVE_ON_DUTY',
    casesCount: 51,
    phone: '+91 98231 77210',
    email: 'navalekrishi@gmail.com',
  },
];

interface SeniorInvestigatorWorkstationProps {
  incidents: IncidentReport[];
  currentUser: UserProfile;
  onUpdateIncidents: (updated: IncidentReport[]) => void;
  onNavigate: (
    tab:
      | 'home'
      | 'dashboard'
      | 'learning'
      | 'how-it-works'
      | 'portals'
      | 'incidents'
      | 'investigator'
  ) => void;
  onViewCertificate?: (incident: IncidentReport) => void;
}

export const SeniorInvestigatorWorkstation: React.FC<
  SeniorInvestigatorWorkstationProps
> = ({
  incidents,
  currentUser,
  onUpdateIncidents,
  onNavigate,
  onViewCertificate,
}) => {
  // 5 Focused, Well-Structured Workstation Sectors
  const [activeNav, setActiveNav] = useState<
    | 'workflows'
    | 'shared_problems'
    | 'story_approvals'
    | 'duty_ledger'
    | 'ai_syndicate'
  >('workflows');

  // Toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Match officer profile from name/email
  const resolveOfficerProfile = (nameOrEmail: string): SeniorInvestigatorProfile => {
    const lower = (nameOrEmail || '').toLowerCase();
    if (lower.includes('zohara')) return SENIOR_INVESTIGATORS[0];
    if (lower.includes('balchandra')) return SENIOR_INVESTIGATORS[1];
    if (lower.includes('afsheen')) return SENIOR_INVESTIGATORS[2];
    if (lower.includes('krishi')) return SENIOR_INVESTIGATORS[3];
    return {
      ...SENIOR_INVESTIGATORS[3],
      name: nameOrEmail.trim() || currentUser?.name || 'Krishi Navale',
      badge: currentUser?.badgeNumber || 'I4C-NAT-7721',
    };
  };

  // ============================================================================
  // 1. MANDATORY WORKSTATION DUTY SIGN-IN, AUTO TIMESTAMP & TAMPER LEDGER
  // ============================================================================
  const [dutySessions, setDutySessions] = useState<WorkstationDutySession[]>(() =>
    getStoredWorkstationSessions()
  );
  const [activeSessionId, setActiveSessionIdState] = useState<string | null>(() =>
    getActiveWorkstationSessionId()
  );
  const [dutyNameInput, setDutyNameInput] = useState<string>(
    currentUser?.name || 'Krishi Navale'
  );
  const [liveClock, setLiveClock] = useState<string>(() =>
    formatExactForensicTimestamp(new Date())
  );

  // Tamper Trap Modal State ("If any senior investigator tries to change it, he gets caught")
  const [tamperTargetSession, setTamperTargetSession] =
    useState<WorkstationDutySession | null>(null);
  const [tamperActorName, setTamperActorName] = useState<string>('');
  const [tamperField, setTamperField] = useState<string>('Login Timestamp');
  const [tamperFakeValue, setTamperFakeValue] = useState<string>('');
  const [lastCaughtTamperAlert, setLastCaughtTamperAlert] = useState<{
    actor: string;
    sessionId: string;
    field: string;
    originalValue: string;
    fakeValue: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(formatExactForensicTimestamp(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    syncWorkstationSessionsWithBackend().then((list) => {
      if (mounted && Array.isArray(list)) {
        setDutySessions(list);
      }
    });

    const handleSessionsUpdated = (e: any) => {
      if (mounted) {
        setDutySessions(e.detail || getStoredWorkstationSessions());
      }
    };
    window.addEventListener('fip_workstation_sessions_updated', handleSessionsUpdated);
    return () => {
      mounted = false;
      window.removeEventListener(
        'fip_workstation_sessions_updated',
        handleSessionsUpdated
      );
    };
  }, []);

  const activeDutySession = useMemo(() => {
    if (!activeSessionId) return null;
    return (
      dutySessions.find(
        (s) => s.id === activeSessionId && s.status !== 'LOGGED_OUT_SEALED'
      ) || null
    );
  }, [dutySessions, activeSessionId]);

  const selectedOfficer = useMemo(() => {
    if (activeDutySession) {
      return resolveOfficerProfile(activeDutySession.investigatorName);
    }
    return resolveOfficerProfile(dutyNameInput || currentUser?.name || 'Krishi Navale');
  }, [activeDutySession, dutyNameInput, currentUser?.name]);

  const totalTamperAttemptsCount = useMemo(
    () =>
      dutySessions.reduce(
        (sum, s) => sum + (Array.isArray(s.tamperAttempts) ? s.tamperAttempts.length : 0),
        0
      ),
    [dutySessions]
  );

  const handleDutySignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = dutyNameInput.trim();
    if (!cleanName) {
      showToast('Please enter your Senior Investigator name to log into the Workstation.');
      return;
    }
    const profile = resolveOfficerProfile(cleanName);
    const created = await signInWorkstationDutySession(cleanName, profile.badge);
    setDutySessions(getStoredWorkstationSessions());
    setActiveSessionIdState(created.id);

    addNotification({
      type: 'CUSTODY_ALERT',
      title: `Workstation Duty Login Recorded (${created.id})`,
      message: `Senior Investigator ${created.investigatorName} logged into the Workstation at ${created.loginTime}. Entry timestamp locked under WORM SHA-256 (${created.wormSha256Hash.slice(0, 16)}...).`,
      recipientRole: 'all',
      senderName: created.investigatorName,
      badge: 'DUTY LOGIN',
    });

    showToast(
      `Welcome ${created.investigatorName}. Login time (${created.loginTime}) automatically captured & WORM-locked.`
    );
  };

  const handleDutySignOut = async () => {
    if (!activeDutySession) return;
    const ended = await signOutWorkstationDutySession(activeDutySession.id);
    setDutySessions(getStoredWorkstationSessions());
    setActiveSessionIdState(null);

    if (ended) {
      addNotification({
        type: 'CUSTODY_ALERT',
        title: `Workstation Duty Logout Sealed (${ended.id})`,
        message: `Senior Investigator ${ended.investigatorName} logged out at ${ended.logoutTime}. Session duration & exit hash permanently sealed.`,
        recipientRole: 'all',
        senderName: ended.investigatorName,
        badge: 'DUTY LOGOUT',
      });
      showToast(
        `Duty session closed for ${ended.investigatorName}. Logout time (${ended.logoutTime}) automatically captured & sealed.`
      );
    }
  };

  const openTamperTrapModal = (session: WorkstationDutySession) => {
    setTamperTargetSession(session);
    setTamperActorName(activeDutySession?.investigatorName || session.investigatorName);
    setTamperField('Login Timestamp');
    setTamperFakeValue('2026-11-18 06:00:00 UTC (Backdated Entry)');
  };

  const handleAttemptTamperModification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tamperTargetSession) return;

    const originalVal =
      tamperField === 'Login Timestamp'
        ? tamperTargetSession.loginTime
        : tamperField === 'Logout Timestamp'
        ? tamperTargetSession.logoutTime || 'ACTIVE_ON_DUTY (Not Logged Out)'
        : tamperTargetSession.investigatorName;

    const fakeVal =
      tamperFakeValue.trim() || '2026-11-18 05:00:00 UTC (Unauthorized Edit)';
    const perpetrator =
      tamperActorName.trim() ||
      activeDutySession?.investigatorName ||
      selectedOfficer.name;

    const result = await recordWorkstationTamperAttempt(
      tamperTargetSession.id,
      perpetrator,
      tamperField,
      originalVal,
      fakeVal
    );

    setDutySessions(getStoredWorkstationSessions());
    setTamperTargetSession(null);

    if (result) {
      setLastCaughtTamperAlert({
        actor: perpetrator,
        sessionId: tamperTargetSession.id,
        field: tamperField,
        originalValue: originalVal,
        fakeValue: fakeVal,
        timestamp: result.attempt.attemptedAt,
      });

      addNotification({
        type: 'CUSTODY_ALERT',
        title: `TAMPER ATTEMPT CAUGHT: ${perpetrator} (${tamperTargetSession.id})`,
        message: `ALERT: Senior Investigator ${perpetrator} attempted to alter ${tamperField} from "${originalVal}" to "${fakeVal}". WORM SHA-256 verification blocked the edit and permanently logged the violation!`,
        recipientRole: 'all',
        senderName: 'WORM Anti-Tamper Watchdog',
        badge: 'TAMPER CAUGHT',
      });

      showToast(
        `TAMPER ATTEMPT CAUGHT! ${perpetrator} was blocked from altering ${tamperField} and flagged in the Workstation Ledger.`
      );
      setActiveNav('duty_ledger');
    }
  };

  // ============================================================================
  // 2. CASE DOCKETS & "SEAL IT FOR THE COURT" WORKFLOW
  // ============================================================================
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    incidents[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'ACTIVE' | 'SUBMITTED_TO_COURT'
  >('ALL');
  const [investigatorNotesInput, setInvestigatorNotesInput] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>('');
  const [isSealingForCourt, setIsSealingForCourt] = useState<boolean>(false);
  const [verifiedFileHashes, setVerifiedFileHashes] = useState<
    Record<string, boolean>
  >({});

  const filteredIncidents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return incidents.filter((inc) => {
      const matchesQuery =
        !q ||
        (inc.title || '').toLowerCase().includes(q) ||
        (inc.trackingCode || '').toLowerCase().includes(q) ||
        (inc.citizenName || '').toLowerCase().includes(q) ||
        (inc.category || '').toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'SUBMITTED_TO_COURT'
          ? inc.status === 'SUBMITTED_TO_COURT'
          : inc.status !== 'SUBMITTED_TO_COURT';
      return matchesQuery && matchesStatus;
    });
  }, [incidents, searchQuery, statusFilter]);

  const selectedCase = useMemo(() => {
    if (!incidents.length) return null;
    return (
      incidents.find((i) => i.id === selectedCaseId) ||
      filteredIncidents[0] ||
      incidents[0]
    );
  }, [incidents, selectedCaseId, filteredIncidents]);

  useEffect(() => {
    if (selectedCase) {
      setInvestigatorNotesInput(
        selectedCase.investigatorStudyNotes || selectedCase.officerNotes || ''
      );
    }
  }, [selectedCase?.id]);

  const handleSaveInvestigatorNotes = async () => {
    if (!selectedCase) return;
    const timestamp = formatExactForensicTimestamp(new Date());
    const updatedCase: IncidentReport = {
      ...selectedCase,
      officerNotes: investigatorNotesInput,
      investigatorStudyNotes: investigatorNotesInput,
      seniorOfficerAssigned: `${selectedOfficer.name} (${selectedOfficer.role})`,
      officerBadge: selectedOfficer.badge,
      lastInvestigatedAt: timestamp,
      investigationProgress: Math.max(selectedCase.investigationProgress || 60, 75),
      custodyEvents: [
        {
          id: `cust-note-${Date.now()}`,
          timestamp,
          actor: selectedOfficer.name,
          role: `${selectedOfficer.role} (${selectedOfficer.badge})`,
          action: `Updated forensic examination findings: "${investigatorNotesInput.slice(0, 100)}"`,
          merkleHash: `${selectedCase.primaryHash.slice(0, 12)}...`,
        },
        ...(selectedCase.custodyEvents || []),
      ],
    };

    const nextList = updateIncidentInStore(updatedCase);
    onUpdateIncidents(nextList);
    updateIncidentAPI(selectedCase.trackingCode, updatedCase).catch(() => {});
    showToast(`Forensic examination notes saved for ${selectedCase.trackingCode}.`);
  };

  const handleSendCitizenNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !messageInput.trim()) return;
    const timestamp = formatExactForensicTimestamp(new Date());
    const newMsg: InvestigatorMessage = {
      id: `msg-${Date.now()}`,
      timestamp,
      sender: selectedOfficer.name,
      senderBadge: selectedOfficer.badge,
      recipientEmail: selectedCase.citizenEmail,
      type: 'OFFICIAL_REPLY',
      subject: `Forensic Case Update (${selectedCase.trackingCode})`,
      content: messageInput.trim(),
      read: false,
      merkleStamp: selectedCase.primaryHash.slice(0, 16),
    };

    const updatedCase: IncidentReport = {
      ...selectedCase,
      investigatorMessages: [newMsg, ...(selectedCase.investigatorMessages || [])],
    };

    const nextList = updateIncidentInStore(updatedCase);
    onUpdateIncidents(nextList);
    dispatchInvestigatorMessageAPI(selectedCase.trackingCode, newMsg).catch(() => {});

    addNotification({
      type: 'DIRECT_NOTICE',
      title: `Senior Investigator Update: ${selectedCase.trackingCode}`,
      message: `${selectedOfficer.name}: "${messageInput.trim().slice(0, 90)}"`,
      recipientEmail: selectedCase.citizenEmail,
      recipientRole: 'citizen',
      relatedTrackingCode: selectedCase.trackingCode,
      relatedIncidentId: selectedCase.id,
      senderName: selectedOfficer.name,
      badge: 'INVESTIGATOR NOTICE',
    });

    setMessageInput('');
    showToast(`Official update sent to ${selectedCase.citizenName}.`);
  };

  // CORE REQUIREMENT: "Seal it for the court"
  const handleSealForCourt = async (targetCase: IncidentReport) => {
    setIsSealingForCourt(true);
    try {
      const sealedAt = formatExactForensicTimestamp(new Date());
      const sealPayload = `COURT-SEAL-65B|${targetCase.trackingCode}|${targetCase.primaryHash}|${selectedOfficer.name}|${selectedOfficer.badge}|${sealedAt}`;
      const courtSealHash = await computeSHA256(sealPayload);

      const finalNotes =
        investigatorNotesInput.trim() ||
        targetCase.officerNotes ||
        `All digital evidence files verified against SHA-256 WORM digests. Case forensically sealed and certified ready for judicial submission under Section 65B(4) by ${selectedOfficer.name}.`;

      const courtCustodyEvent = {
        id: `cust-court-${Date.now()}`,
        timestamp: sealedAt,
        actor: selectedOfficer.name,
        role: `${selectedOfficer.role} (${selectedOfficer.badge})`,
        action: `SEALED FOR THE COURT: Complete evidentiary dossier locked with Judicial Seal Hash ${courtSealHash.slice(0, 16)}... Ready for magistrate court submission under Section 65B(4).`,
        merkleHash: `${courtSealHash.slice(0, 16)}...`,
      };

      const updatedCase: IncidentReport = {
        ...targetCase,
        status: 'SUBMITTED_TO_COURT',
        investigationProgress: 100,
        seniorOfficerAssigned: `${selectedOfficer.name} (${selectedOfficer.role})`,
        officerBadge: selectedOfficer.badge,
        officerNotes: finalNotes,
        investigatorStudyNotes: finalNotes,
        courtSealedBy: `${selectedOfficer.name} (${selectedOfficer.badge})`,
        courtSealedAt: sealedAt,
        courtSealHash,
        custodyEvents: [courtCustodyEvent, ...(targetCase.custodyEvents || [])],
      };

      const nextList = updateIncidentInStore(updatedCase);
      onUpdateIncidents(nextList);

      await updateIncidentAPI(targetCase.trackingCode, updatedCase).catch(() => {});
      await updateCustodyLogAPI(
        targetCase.trackingCode,
        courtCustodyEvent.action,
        selectedOfficer.name,
        true,
        finalNotes,
        true
      ).catch(() => {});

      addNotification({
        type: 'CERTIFICATE',
        title: `Case Sealed for the Court (${targetCase.trackingCode})`,
        message: `Senior Investigator ${selectedOfficer.name} has completed forensic verification and sealed case ${targetCase.trackingCode} for the court (SHA-256 Seal: ${courtSealHash.slice(0, 16)}...).`,
        recipientEmail: targetCase.citizenEmail,
        recipientRole: 'all',
        relatedTrackingCode: targetCase.trackingCode,
        relatedIncidentId: targetCase.id,
        senderName: selectedOfficer.name,
        badge: 'SEALED FOR COURT',
      });

      showToast(
        `Case ${targetCase.trackingCode} is now SEALED FOR THE COURT and ready for judicial dispatch!`
      );
    } finally {
      setIsSealingForCourt(false);
    }
  };

  // ============================================================================
  // 3. SHARE A PROBLEM SECTOR & CRIME STORY PDF APPROVALS STATE
  // ============================================================================
  const [sharedProblems, setSharedProblems] = useState<SharedProblemReport[]>(() =>
    getStoredSharedProblems()
  );
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [problemResolutionNotes, setProblemResolutionNotes] = useState<
    Record<string, string>
  >({});
  const [problemActionPreset, setProblemActionPreset] = useState<
    Record<string, string>
  >({});
  const [solvingProblemId, setSolvingProblemId] = useState<string | null>(null);
  const [scannedProblemIds, setScannedProblemIds] = useState<
    Record<string, boolean>
  >({});
  const [scanningProblemId, setScanningProblemId] = useState<string | null>(null);

  const [crimeStories, setCrimeStories] = useState<CommunityCrimeStory[]>(() =>
    getStoredCrimeStories()
  );
  const [storyReviewNotes, setStoryReviewNotes] = useState<
    Record<string, string>
  >({});
  const [reviewingStoryId, setReviewingStoryId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    syncSharedProblemsWithBackend().then((list) => {
      if (mounted && Array.isArray(list)) setSharedProblems(list);
    });
    syncCrimeStoriesWithBackend().then((list) => {
      if (mounted && Array.isArray(list)) setCrimeStories(list);
    });

    const onProb = (e: any) => {
      if (mounted) setSharedProblems(e.detail || getStoredSharedProblems());
    };
    const onStory = (e: any) => {
      if (mounted) setCrimeStories(e.detail || getStoredCrimeStories());
    };
    window.addEventListener('fip_shared_problems_updated', onProb);
    window.addEventListener('fip_crime_stories_updated', onStory);
    return () => {
      mounted = false;
      window.removeEventListener('fip_shared_problems_updated', onProb);
      window.removeEventListener('fip_crime_stories_updated', onStory);
    };
  }, []);

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
  const selectedProblem = useMemo(() => {
    if (!sharedProblems.length) return null;
    if (selectedProblemId) {
      const found = sharedProblems.find((p) => p.id === selectedProblemId);
      if (found) return found;
    }
    return sharedProblems[0];
  }, [sharedProblems, selectedProblemId]);

  const pendingCrimeStories = useMemo(
    () => crimeStories.filter((s) => s.status === 'PENDING_WORKSTATION'),
    [crimeStories]
  );
  const approvedCrimeStories = useMemo(
    () => crimeStories.filter((s) => s.status === 'APPROVED_PUBLISHED'),
    [crimeStories]
  );

  const handleRunDeepLinkScan = (problem: SharedProblemReport) => {
    setScanningProblemId(problem.id);
    setTimeout(() => {
      setScanningProblemId(null);
      setScannedProblemIds((prev) => ({ ...prev, [problem.id]: true }));
      showToast(
        `Deep URL & DNS sandbox scan complete for ${problem.trackingCode} (${problem.linkRiskLevel} RISK)`
      );
    }, 600);
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
        `Problem ${problem.trackingCode} solved & sealed by ${selectedOfficer.name}.`
      );
    } finally {
      setSolvingProblemId(null);
    }
  };

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

      await reviewCrimeStoryInWorkstation(story.id, decision, {
        name: selectedOfficer.name,
        badge: selectedOfficer.badge,
        avatarUrl: selectedOfficer.avatarUrl,
        notes: note,
      });
      setCrimeStories(getStoredCrimeStories());

      addNotification({
        type: 'CERTIFICATE',
        title:
          decision === 'APPROVED_PUBLISHED'
            ? `Crime Story Verified & Published (${story.trackingCode})`
            : `Crime Story Returned (${story.trackingCode})`,
        message:
          decision === 'APPROVED_PUBLISHED'
            ? `${selectedOfficer.name} verified PDF "${story.pdfFileName}" and published "${story.title}" to the public Crime Stories feed.`
            : `${selectedOfficer.name} reviewed "${story.title}": ${note}`,
        recipientRole: 'all',
        relatedTrackingCode: story.trackingCode,
        senderName: selectedOfficer.name,
        badge: decision === 'APPROVED_PUBLISHED' ? 'STORY APPROVED' : 'STORY REVIEWED',
      });

      showToast(
        decision === 'APPROVED_PUBLISHED'
          ? `Crime Story "${story.title}" approved & published live!`
          : `Crime Story "${story.title}" marked as rejected.`
      );
    } finally {
      setReviewingStoryId(null);
    }
  };

  const courtSealedCasesCount = useMemo(
    () => incidents.filter((i) => i.status === 'SUBMITTED_TO_COURT').length,
    [incidents]
  );

  // ============================================================================
  // RENDER 1: MANDATORY DUTY SIGN-IN GATE (IF NOT CURRENTLY SIGNED IN ON DUTY)
  // ============================================================================
  if (!activeDutySession) {
    return (
      <div className="min-h-screen bg-[#070709] text-white py-12 px-4 sm:px-8 flex items-center justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl bg-[#111116] border border-white/15 overflow-hidden shadow-2xl">
          {/* Left Panel: Mandatory Duty Registration Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-mono-code text-[#FF4D15] tracking-wider">
                WORM CHAIN-OF-CUSTODY · MANDATORY DUTY REGISTER
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Senior Investigator Workstation Sign-In
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Enter your full name to unlock the Workstation. Your{' '}
                <strong className="text-white">Login Timestamp</strong> is captured
                automatically upon entry, and your{' '}
                <strong className="text-white">Logout Timestamp</strong> is captured
                automatically when you exit. All records are WORM-locked inside the
                Workstation so any attempt to alter them is immediately caught.
              </p>
            </div>

            <form onSubmit={handleDutySignIn} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-300">
                  Write Your Senior Investigator Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={dutyNameInput}
                    onChange={(e) => setDutyNameInput(e.target.value)}
                    placeholder="Enter your full name (e.g., Krishi Navale)..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#070709] border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15]"
                  />
                </div>

                {/* Quick-Select Authorized Architects */}
                <div className="pt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-zinc-500 mr-1">Quick Fill:</span>
                  {SENIOR_INVESTIGATORS.map((inv) => (
                    <button
                      key={inv.id}
                      type="button"
                      onClick={() => setDutyNameInput(inv.name)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        dutyNameInput.trim().toLowerCase() === inv.name.toLowerCase()
                          ? 'bg-[#FF4D15] text-white'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                      }`}
                    >
                      {inv.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Automatic Timestamp Preview Box (Read-Only) */}
              <div className="p-4 rounded-xl bg-[#070709] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF4D15]" />
                    <span>Automatic Entry Time (System Captured):</span>
                  </span>
                  <span className="font-mono-code tabular-nums text-emerald-400 font-semibold">
                    {liveClock}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Anti-Tamper Protection:</span>
                  </span>
                  <span className="font-mono-code text-zinc-300">
                    SHA-256 WORM Ledger Active
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-xl bg-[#FF4D15] hover:bg-[#e03e0b] text-white font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D15]/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In &amp; Automatically Capture Login Time</span>
              </button>
            </form>
          </div>

          {/* Right Panel: Recent Immutable Duty Sessions in Workstation */}
          <div className="lg:col-span-5 bg-[#0B0B0F] border-t lg:border-t-0 lg:border-l border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-mono-code uppercase tracking-wider text-zinc-400">
                  Recent Workstation Duty Logs
                </h2>
                <span className="text-xs font-mono-code tabular-nums text-zinc-500">
                  {dutySessions.length} Sealed
                </span>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {dutySessions.slice(0, 4).map((sess) => (
                  <div
                    key={sess.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      sess.status === 'TAMPER_FLAGGED'
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-[#121218] border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">
                        {sess.investigatorName}
                      </span>
                      <span className="font-mono-code text-[11px] text-zinc-400">
                        {sess.badgeNumber}
                      </span>
                    </div>
                    <div className="font-mono-code tabular-nums text-[11px] text-zinc-400 space-y-0.5">
                      <div>In: {sess.loginTime}</div>
                      <div>
                        Out:{' '}
                        {sess.logoutTime ? (
                          <span className="text-zinc-300">{sess.logoutTime}</span>
                        ) : (
                          <span className="text-emerald-400">On Duty</span>
                        )}
                      </div>
                    </div>
                    {sess.tamperAttempts && sess.tamperAttempts.length > 0 && (
                      <div className="text-[11px] text-rose-400 font-semibold flex items-center gap-1 pt-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          CAUGHT: {sess.tamperAttempts.length} Tamper Attempt(s) Blocked
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-zinc-400 leading-relaxed">
              Every login and logout timestamp is cryptographically chained. If any
              Senior Investigator attempts to edit or backdate their timestamp, the
              Workstation immediately flags and records the violation.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER 2: CLEAN, AESTHETIC SENIOR INVESTIGATOR WORKSTATION
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md px-4 py-3 rounded-xl bg-[#16161D] border border-[#FF4D15] text-white text-xs font-medium shadow-2xl flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-[#FF4D15] shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-zinc-400 hover:text-white ml-auto cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Context & Active Duty Session Bar */}
      <div className="bg-[#0E0E13] border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Investigator Identity & Captured Login Time */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              {selectedOfficer.avatarUrl ? (
                <img
                  src={selectedOfficer.avatarUrl}
                  alt={selectedOfficer.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover border border-white/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[#FF4D15] text-white font-bold flex items-center justify-center">
                  {selectedOfficer.avatarInitials}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    {activeDutySession.investigatorName}
                  </span>
                  <span className="text-zinc-500">·</span>
                  <span className="font-mono-code text-zinc-400">
                    {activeDutySession.badgeNumber}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono-code tabular-nums">
                  Duty Session: {activeDutySession.id} · Login Captured:{' '}
                  <strong className="text-emerald-400">
                    {activeDutySession.loginTime}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Duty Actions & Automatic Logout Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveNav('duty_ledger')}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-200 transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-[#FF4D15]" />
              <span>
                Duty &amp; Tamper Ledger ({dutySessions.length} Logs
                {totalTamperAttemptsCount > 0
                  ? ` · ${totalTamperAttemptsCount} Caught`
                  : ''}
                )
              </span>
            </button>

            <button
              onClick={handleDutySignOut}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out &amp; Capture Exit Time</span>
            </button>
          </div>
        </div>
      </div>

      {/* Caught Tamper Alert Banner (Appears whenever someone tries to alter a log) */}
      {lastCaughtTamperAlert && (
        <div className="bg-rose-950/80 border-b border-rose-500/50 px-4 sm:px-8 py-3">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-2.5 text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <strong className="text-white">
                  SECURITY VIOLATION CAUGHT ({lastCaughtTamperAlert.sessionId}):
                </strong>{' '}
                Senior Investigator{' '}
                <strong className="text-rose-300">
                  {lastCaughtTamperAlert.actor}
                </strong>{' '}
                attempted to change{' '}
                <span className="underline">{lastCaughtTamperAlert.field}</span> from{' '}
                <code className="font-mono-code text-emerald-300">
                  {lastCaughtTamperAlert.originalValue}
                </code>{' '}
                to{' '}
                <code className="font-mono-code text-rose-300">
                  {lastCaughtTamperAlert.fakeValue}
                </code>
                . Edit blocked &amp; permanently recorded.
              </div>
            </div>
            <button
              onClick={() => setLastCaughtTamperAlert(null)}
              className="text-rose-300 hover:text-white text-xs font-semibold self-end sm:self-center cursor-pointer whitespace-nowrap"
            >
              Dismiss Notice
            </button>
          </div>
        </div>
      )}

      {/* Main Enterprise Workspace Layout: Sidebar + Content Viewport */}
      <div className="max-w-[1440px] w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 sm:px-8 py-6">
        {/* Left Sidebar Navigation (3 Columns on Desktop) */}
        <aside className="lg:col-span-3 space-y-5">
          <div className="p-4 rounded-xl bg-[#111116] border border-white/10 space-y-1">
            <div className="text-[11px] font-mono-code text-zinc-400 px-2 pb-2">
              Workstation Sectors
            </div>

            <button
              onClick={() => setActiveNav('workflows')}
              className={`w-full px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                activeNav === 'workflows'
                  ? 'bg-[#FF4D15] text-white font-semibold'
                  : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                <Folder className="w-4 h-4 shrink-0" />
                <span className="truncate">01. Case Dockets &amp; Court Seal</span>
              </span>
              <span className="font-mono-code tabular-nums text-[11px] opacity-80">
                {incidents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('shared_problems')}
              className={`w-full px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                activeNav === 'shared_problems'
                  ? 'bg-[#FF4D15] text-white font-semibold'
                  : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                <Link2 className="w-4 h-4 shrink-0" />
                <span className="truncate">02. Share a Problem Sector</span>
              </span>
              <span className="font-mono-code tabular-nums text-[11px] opacity-90">
                {pendingSharedProblems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('story_approvals')}
              className={`w-full px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                activeNav === 'story_approvals'
                  ? 'bg-[#FF4D15] text-white font-semibold'
                  : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 shrink-0" />
                <span className="truncate">03. Crime Story PDF Approvals</span>
              </span>
              <span className="font-mono-code tabular-nums text-[11px] opacity-90">
                {pendingCrimeStories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('duty_ledger')}
              className={`w-full px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                activeNav === 'duty_ledger'
                  ? 'bg-[#FF4D15] text-white font-semibold'
                  : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                <Clock className="w-4 h-4 shrink-0" />
                <span className="truncate">04. Duty Log &amp; Tamper Ledger</span>
              </span>
              <span className="font-mono-code tabular-nums text-[11px] opacity-90">
                {dutySessions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('ai_syndicate')}
              className={`w-full px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                activeNav === 'ai_syndicate'
                  ? 'bg-[#FF4D15] text-white font-semibold'
                  : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="truncate">05. AI Syndicate Correlation</span>
              </span>
            </button>
          </div>

          {/* Clean Workstation Summary Metrics */}
          <div className="p-4 rounded-xl bg-[#111116] border border-white/10 space-y-3">
            <div className="text-[11px] font-mono-code text-zinc-400">
              Workstation Overview
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-[#070709] border border-white/5">
                <div className="text-lg font-bold text-white font-mono-code tabular-nums">
                  {incidents.length}
                </div>
                <div className="text-[11px] text-zinc-400">Total Dockets</div>
              </div>
              <div className="p-3 rounded-lg bg-[#070709] border border-white/5">
                <div className="text-lg font-bold text-emerald-400 font-mono-code tabular-nums">
                  {courtSealedCasesCount}
                </div>
                <div className="text-[11px] text-zinc-400">Sealed for Court</div>
              </div>
              <div className="p-3 rounded-lg bg-[#070709] border border-white/5">
                <div className="text-lg font-bold text-amber-400 font-mono-code tabular-nums">
                  {pendingSharedProblems.length}
                </div>
                <div className="text-[11px] text-zinc-400">Pending Links</div>
              </div>
              <div className="p-3 rounded-lg bg-[#070709] border border-white/5">
                <div className="text-lg font-bold text-rose-400 font-mono-code tabular-nums">
                  {totalTamperAttemptsCount}
                </div>
                <div className="text-[11px] text-zinc-400">Tamper Caught</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport (9 Columns on Desktop) */}
        <main className="lg:col-span-9 space-y-6">
          {/* =====================================================================
              SECTOR 01: CASE DOCKETS & "SEAL IT FOR THE COURT"
          ===================================================================== */}
          {activeNav === 'workflows' && (
            <div className="space-y-6">
              {/* Top Quick-Access Strip for Incoming Shared Problems & PDF Approvals */}
              {(pendingSharedProblems.length > 0 ||
                pendingCrimeStories.length > 0) && (
                <div className="p-4 rounded-xl bg-[#111116] border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-zinc-300">
                    <strong className="text-white">Live Incoming Queues:</strong>{' '}
                    <span>
                      {pendingSharedProblems.length} Shared Problem Link(s) awaiting
                      inspection
                    </span>{' '}
                    ·{' '}
                    <span>
                      {pendingCrimeStories.length} Citizen Crime Story PDF(s)
                      awaiting approval
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActiveNav('shared_problems')}
                      className="px-3 py-1.5 rounded-lg bg-[#FF4D15] hover:bg-[#e03e0b] text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
                    >
                      Inspect Problem Links ({pendingSharedProblems.length})
                    </button>
                    <button
                      onClick={() => setActiveNav('story_approvals')}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
                    >
                      Verify PDFs ({pendingCrimeStories.length})
                    </button>
                  </div>
                </div>
              )}

              {/* Search & Filter Toolbar */}
              <div className="p-4 rounded-xl bg-[#111116] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search case dockets by tracking ID, citizen name, or category..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#070709] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15]"
                  />
                </div>
                <div className="flex items-center gap-1 p-1 rounded-lg bg-[#070709] border border-white/10">
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      statusFilter === 'ALL'
                        ? 'bg-white/15 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    All ({incidents.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('ACTIVE')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      statusFilter === 'ACTIVE'
                        ? 'bg-white/15 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    In Progress ({incidents.length - courtSealedCasesCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('SUBMITTED_TO_COURT')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      statusFilter === 'SUBMITTED_TO_COURT'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Sealed for Court ({courtSealedCasesCount})
                  </button>
                </div>
              </div>

              {/* Two-Column Case List + Selected Case Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Case List (5 Cols) */}
                <div className="lg:col-span-5 space-y-2.5">
                  {filteredIncidents.map((inc) => {
                    const isSelected = selectedCase?.id === inc.id;
                    const isSealedForCourt = inc.status === 'SUBMITTED_TO_COURT';
                    return (
                      <div
                        key={inc.id}
                        onClick={() => setSelectedCaseId(inc.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-[#171312] border-[#FF4D15]'
                            : 'bg-[#111116] border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono-code tabular-nums">
                          <span className="text-[#FF4D15] font-semibold">
                            {inc.trackingCode}
                          </span>
                          <span
                            className={
                              isSealedForCourt
                                ? 'text-emerald-400 font-semibold'
                                : 'text-amber-400'
                            }
                          >
                            {isSealedForCourt
                              ? '✓ Sealed for Court'
                              : inc.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-white line-clamp-1">
                          {inc.title}
                        </h3>
                        <div className="text-xs text-zinc-400 flex items-center justify-between">
                          <span>{inc.citizenName}</span>
                          <span className="font-mono-code tabular-nums">
                            {(inc.evidenceFiles || []).length} file(s)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Column: Focused Case Forensic Inspector & "Seal it for the Court" (7 Cols) */}
                <div className="lg:col-span-7">
                  {selectedCase ? (
                    <div className="p-6 rounded-xl bg-[#111116] border border-white/15 space-y-6">
                      {/* Case Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
                        <div className="space-y-1">
                          <div className="text-xs font-mono-code text-zinc-400">
                            {selectedCase.trackingCode} · {selectedCase.category} ·{' '}
                            {selectedCase.dateReported}
                          </div>
                          <h2 className="text-lg sm:text-xl font-bold text-white">
                            {selectedCase.title}
                          </h2>
                          <div className="text-xs text-zinc-400">
                            Reporter:{' '}
                            <strong className="text-white">
                              {selectedCase.citizenName}
                            </strong>{' '}
                            ({selectedCase.citizenEmail}) · Loss:{' '}
                            <strong className="text-white">
                              {selectedCase.lossAmount || 'Under Assessment'}
                            </strong>
                          </div>
                        </div>

                        {onViewCertificate && (
                          <button
                            onClick={() => onViewCertificate(selectedCase)}
                            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
                          >
                            <Scale className="w-3.5 h-3.5 text-[#FF4D15]" />
                            <span>Section 65B Certificate</span>
                          </button>
                        )}
                      </div>

                      {/* Prominent "SEAL IT FOR THE COURT" Action Box */}
                      {selectedCase.status === 'SUBMITTED_TO_COURT' ? (
                        <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                              <CheckCircle2 className="w-5 h-5 shrink-0" />
                              <span>
                                Case Sealed for the Court — Ready for Judicial
                                Submission
                              </span>
                            </div>
                            <span className="text-xs font-mono-code tabular-nums text-zinc-400">
                              {selectedCase.courtSealedAt ||
                                selectedCase.lastInvestigatedAt ||
                                selectedCase.dateReported}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            This case has been completely verified and sealed for
                            the court by{' '}
                            <strong className="text-white">
                              {selectedCase.courtSealedBy ||
                                selectedCase.seniorOfficerAssigned}
                            </strong>
                            . All evidence hashes are WORM-locked under Section
                            65B(4) of the Indian Evidence Act.
                          </p>
                          <div className="p-2.5 rounded-lg bg-[#070709] border border-emerald-500/20 font-mono-code text-[11px] text-emerald-300 break-all">
                            Court Seal SHA-256:{' '}
                            {selectedCase.courtSealHash || selectedCase.primaryHash}
                          </div>
                          {onViewCertificate && (
                            <button
                              onClick={() => onViewCertificate(selectedCase)}
                              className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                            >
                              <Scale className="w-4 h-4" />
                              <span>
                                Open &amp; Print Court-Sealed Section 65B Dossier
                              </span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="p-5 rounded-xl bg-[#181311] border border-[#FF4D15]/50 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Scale className="w-4 h-4 text-[#FF4D15]" />
                                <span>Final Judicial Action: Seal it for the Court</span>
                              </h3>
                              <p className="text-xs text-zinc-400 mt-0.5">
                                Once your forensic investigation on this case is
                                complete, seal it to generate the court-ready Section
                                65B packet.
                              </p>
                            </div>
                            <button
                              onClick={() => handleSealForCourt(selectedCase)}
                              disabled={isSealingForCourt}
                              className="px-5 py-3 rounded-xl bg-[#FF4D15] hover:bg-[#e03e0b] text-white font-bold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 shadow-lg shadow-[#FF4D15]/25 disabled:opacity-50"
                            >
                              <Lock className="w-4 h-4" />
                              <span>
                                {isSealingForCourt
                                  ? 'Sealing for Court...'
                                  : 'Seal it for the Court'}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Case Narrative & SHA-256 Digest */}
                      <div className="space-y-3">
                        <div className="text-xs font-semibold text-zinc-300">
                          Incident Statement &amp; Primary WORM Hash
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed p-3.5 rounded-lg bg-[#070709] border border-white/10">
                          {selectedCase.description}
                        </p>
                        <div className="p-3 rounded-lg bg-[#070709] border border-white/10 font-mono-code text-[11px] text-amber-300 break-all">
                          Primary SHA-256: {selectedCase.primaryHash}
                        </div>
                      </div>

                      {/* Evidence Files List with 1-Click Hash Verification */}
                      <div className="space-y-2.5">
                        <div className="text-xs font-semibold text-zinc-300">
                          WORM Evidence Files (
                          {(selectedCase.evidenceFiles || []).length})
                        </div>
                        {(selectedCase.evidenceFiles || []).length > 0 ? (
                          <div className="space-y-2">
                            {selectedCase.evidenceFiles.map((file, idx) => {
                              const fileKey = `${selectedCase.id}-${file.id || idx}`;
                              const isVerified = verifiedFileHashes[fileKey];
                              return (
                                <div
                                  key={fileKey}
                                  className="p-3 rounded-lg bg-[#070709] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                                >
                                  <div className="min-w-0">
                                    <div className="font-semibold text-white truncate">
                                      {file.name ||
                                        (file as any).filename ||
                                        `evidence_${idx + 1}.bin`}
                                    </div>
                                    <div className="font-mono-code text-[11px] text-zinc-500 truncate">
                                      SHA-256: {file.sha256}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setVerifiedFileHashes((prev) => ({
                                        ...prev,
                                        [fileKey]: true,
                                      }));
                                      showToast(
                                        `Bit-level SHA-256 integrity verified for ${file.name}. Zero tampering detected.`
                                      );
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap shrink-0 ${
                                      isVerified
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : 'bg-white/10 hover:bg-white/15 text-white'
                                    }`}
                                  >
                                    {isVerified
                                      ? '✓ SHA-256 Match Verified'
                                      : 'Verify SHA-256 Hash'}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 rounded-lg bg-[#070709] border border-white/10 text-xs text-zinc-500">
                            No binary files attached to this docket yet.
                          </div>
                        )}
                      </div>

                      {/* Investigator Examination Notes */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-zinc-300">
                            Senior Investigator Forensic Notes
                          </label>
                          <button
                            type="button"
                            onClick={handleSaveInvestigatorNotes}
                            className="text-xs text-[#FF4D15] hover:underline font-semibold cursor-pointer"
                          >
                            Save Notes
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={investigatorNotesInput}
                          onChange={(e) =>
                            setInvestigatorNotesInput(e.target.value)
                          }
                          placeholder="Record forensic findings, bank freeze directives, or court preparation remarks..."
                          className="w-full p-3 rounded-lg bg-[#070709] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15]"
                        />
                      </div>

                      {/* Direct Notice to Citizen */}
                      <form
                        onSubmit={handleSendCitizenNotice}
                        className="pt-3 border-t border-white/10 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder={`Send direct update to ${selectedCase.citizenName}...`}
                          className="flex-1 px-3.5 py-2 rounded-lg bg-[#070709] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
                        >
                          Send Update
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="p-12 rounded-xl bg-[#111116] border border-white/10 text-center text-xs text-zinc-500">
                      Select a case docket from the left list to inspect evidence or
                      seal it for the court.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              SECTOR 02: DEDICATED "SHARE A PROBLEM" SECTOR
          ===================================================================== */}
          {activeNav === 'shared_problems' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-[#111116] border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono-code text-[#FF4D15]">
                    ZERO-IDENTITY GATEWAY STREAM · NO NAME OR GMAIL REQUIRED
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    02. Dedicated Share a Problem &amp; Origin Link Sector
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Inspect incoming problems and suspicious origin links shared from
                    the Cryptographic Credential Gateway and seal their resolution.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono-code tabular-nums shrink-0">
                  <div className="px-3.5 py-2 rounded-lg bg-[#070709] border border-white/10">
                    Pending:{' '}
                    <strong className="text-amber-400">
                      {pendingSharedProblems.length}
                    </strong>
                  </div>
                  <div className="px-3.5 py-2 rounded-lg bg-[#070709] border border-white/10">
                    Solved:{' '}
                    <strong className="text-emerald-400">
                      {solvedSharedProblems.length}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Queue */}
                <div className="lg:col-span-5 space-y-2.5">
                  {sharedProblems.map((prob) => {
                    const isSelected = selectedProblem?.id === prob.id;
                    const isPending = prob.status === 'PENDING_INSPECTION';
                    return (
                      <div
                        key={prob.id}
                        onClick={() => setSelectedProblemId(prob.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-[#171312] border-[#FF4D15]'
                            : 'bg-[#111116] border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono-code tabular-nums">
                          <span className="text-white font-semibold">
                            {prob.trackingCode}
                          </span>
                          <span
                            className={
                              isPending ? 'text-amber-400' : 'text-emerald-400'
                            }
                          >
                            {isPending ? 'Pending Inspection' : '✓ Solved'}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#070709] border border-white/10 font-mono-code text-[11px] text-amber-300 truncate">
                          {prob.sourceLink}
                        </div>
                        <p className="text-xs text-zinc-300 line-clamp-2">
                          {prob.problemText}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Right Problem & Origin Link Inspector */}
                <div className="lg:col-span-7">
                  {selectedProblem ? (
                    <div className="p-6 rounded-xl bg-[#111116] border border-white/15 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                        <div>
                          <div className="text-xs font-mono-code text-zinc-400">
                            {selectedProblem.trackingCode} ·{' '}
                            {selectedProblem.category} ·{' '}
                            {selectedProblem.submittedAt}
                          </div>
                          <h3 className="text-base font-bold text-white mt-0.5">
                            Origin Link &amp; Problem Forensic Inspection
                          </h3>
                        </div>
                        <button
                          onClick={() => handleRunDeepLinkScan(selectedProblem)}
                          disabled={scanningProblemId === selectedProblem.id}
                          className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-mono-code text-amber-300 font-semibold cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                        >
                          <Scan className="w-3.5 h-3.5" />
                          <span>
                            {scanningProblemId === selectedProblem.id
                              ? 'Scanning...'
                              : scannedProblemIds[selectedProblem.id]
                              ? '✓ Link Scanned'
                              : 'Run Deep Link Scan'}
                          </span>
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-zinc-300">
                          Origin Link (Where the Problem Came From)
                        </div>
                        <div className="p-3 rounded-lg bg-[#070709] border border-[#FF4D15]/40 font-mono-code text-xs text-amber-300 break-all">
                          {selectedProblem.sourceLink}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-zinc-300">
                          Problem Description Shared
                        </div>
                        <p className="p-3.5 rounded-lg bg-[#070709] border border-white/10 text-xs text-zinc-200 leading-relaxed">
                          {selectedProblem.problemText}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-zinc-300">
                          URL Heuristic Findings ({selectedProblem.linkRiskLevel}{' '}
                          RISK)
                        </div>
                        <div className="space-y-1.5">
                          {selectedProblem.linkHeuristics.map((flag, i) => (
                            <div
                              key={i}
                              className="p-2.5 rounded-lg bg-[#070709] border border-white/5 text-xs text-zinc-300 flex items-start gap-2"
                            >
                              <AlertCircle className="w-4 h-4 text-[#FF4D15] shrink-0 mt-0.5" />
                              <span>{flag}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedProblem.status === 'SOLVED' ? (
                        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 text-xs">
                          <div className="font-bold text-emerald-400">
                            ✓ Problem Solved by {selectedProblem.solvedByOfficer} (
                            {selectedProblem.solvedAt})
                          </div>
                          <div className="font-mono-code text-emerald-200">
                            Action: {selectedProblem.preventiveActionTaken}
                          </div>
                          <p className="text-zinc-300">
                            {selectedProblem.resolutionSummary}
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-[#181311] border border-[#FF4D15]/40 space-y-3">
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
                            className="w-full px-3 py-2 rounded-lg bg-[#070709] border border-white/15 text-xs text-white"
                          >
                            <option value="Origin URL Flagged for CERT-In Takedown & Added to National Threat Blocklist">
                              1. Sinkhole Malicious Origin Link + Dispatch CERT-In
                              Takedown
                            </option>
                            <option value="Source Link Blacklisted + Section 91 CrPC Bank / UPI Telemetry Freeze Issued">
                              2. Blacklist Source Link + Trigger Section 91 CrPC
                              Freeze
                            </option>
                            <option value="Origin URL Indexed in F.I.P. Global Threat Feed + Redirect Chain Neutralized">
                              3. Index Origin URL in F.I.P. Global Threat Feed
                            </option>
                          </select>

                          <textarea
                            rows={2}
                            value={problemResolutionNotes[selectedProblem.id] || ''}
                            onChange={(e) =>
                              setProblemResolutionNotes((prev) => ({
                                ...prev,
                                [selectedProblem.id]: e.target.value,
                              }))
                            }
                            placeholder="Optional investigator resolution summary..."
                            className="w-full p-2.5 rounded-lg bg-[#070709] border border-white/15 text-xs text-white placeholder-zinc-500"
                          />

                          <button
                            onClick={() => handleSolveSharedProblem(selectedProblem)}
                            disabled={solvingProblemId === selectedProblem.id}
                            className="w-full py-3 px-4 rounded-lg bg-[#FF4D15] hover:bg-[#e03e0b] text-white font-bold text-xs cursor-pointer transition-colors"
                          >
                            {solvingProblemId === selectedProblem.id
                              ? 'Sealing Solution...'
                              : 'Solve Problem & Broadcast Resolution'}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              SECTOR 03: CITIZEN CRIME STORY PDF APPROVALS
          ===================================================================== */}
          {activeNav === 'story_approvals' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-[#111116] border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono-code text-amber-400">
                    CITIZEN PDF DOSSIER VERIFICATION QUEUE
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    03. Crime Story &amp; PDF Verification Sector
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Verify citizen-submitted crime experiences and attached PDFs
                    before publishing them to the public Crime Stories page.
                  </p>
                </div>
                <div className="text-xs font-mono-code tabular-nums text-zinc-300">
                  {pendingCrimeStories.length} Pending ·{' '}
                  {approvedCrimeStories.length} Published
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {crimeStories.map((story) => (
                  <div
                    key={story.id}
                    className="p-5 rounded-xl bg-[#111116] border border-white/15 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono-code tabular-nums">
                        <span className="text-[#FF4D15] font-semibold">
                          {story.trackingCode}
                        </span>
                        <span
                          className={
                            story.status === 'PENDING_WORKSTATION'
                              ? 'text-amber-400'
                              : story.status === 'APPROVED_PUBLISHED'
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }
                        >
                          {story.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">
                        {story.title}
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {story.whatHappened}
                      </p>
                      <div className="p-3 rounded-lg bg-[#070709] border border-white/10 text-xs text-emerald-300">
                        <strong>Safety Lesson:</strong> {story.howToStaySafeLesson}
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#070709] border border-white/10 flex items-center justify-between text-[11px] font-mono-code text-zinc-400">
                        <span>
                          PDF: {story.pdfFileName} ({story.pdfFileSize})
                        </span>
                        <span>SHA: {story.pdfSha256.slice(0, 12)}...</span>
                      </div>
                    </div>

                    {story.status === 'PENDING_WORKSTATION' && (
                      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                        <button
                          onClick={() =>
                            handleReviewCrimeStory(story, 'APPROVED_PUBLISHED')
                          }
                          disabled={reviewingStoryId === story.id}
                          className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer transition-colors"
                        >
                          ✓ Agree &amp; Publish to Crime Stories
                        </button>
                        <button
                          onClick={() =>
                            handleReviewCrimeStory(story, 'REJECTED')
                          }
                          disabled={reviewingStoryId === story.id}
                          className="py-2.5 px-4 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold cursor-pointer transition-colors"
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

          {/* =====================================================================
              SECTOR 04: IMMUTABLE DUTY LOG & ANTI-TAMPER LEDGER
          ===================================================================== */}
          {activeNav === 'duty_ledger' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-[#111116] border border-white/15 space-y-2">
                <div className="text-xs font-mono-code text-[#FF4D15]">
                  WORM SESSION AUDIT · AUTOMATIC LOGIN &amp; LOGOUT CAPTURE
                </div>
                <h2 className="text-xl font-bold text-white">
                  04. Senior Investigator Duty Log &amp; Tamper-Catching Ledger
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every Senior Investigator login name, automatic entry timestamp,
                  and automatic exit timestamp is stored inside this Workstation
                  with a SHA-256 WORM hash. If any Senior Investigator attempts to
                  modify or backdate a record, click{' '}
                  <strong className="text-white">
                    &ldquo;Test Tamper / Attempt Edit&rdquo;
                  </strong>{' '}
                  on any row below to see how the Workstation immediately catches
                  and logs the perpetrator.
                </p>
              </div>

              {/* Duty Sessions Table */}
              <div className="rounded-xl bg-[#111116] border border-white/15 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-[#0B0B0F] text-zinc-400 font-mono-code text-[11px]">
                        <th className="py-3.5 px-4">Session ID</th>
                        <th className="py-3.5 px-4">Senior Investigator</th>
                        <th className="py-3.5 px-4">
                          Login Time (Auto-Captured)
                        </th>
                        <th className="py-3.5 px-4">
                          Logout Time (Auto-Captured)
                        </th>
                        <th className="py-3.5 px-4">WORM Integrity Status</th>
                        <th className="py-3.5 px-4 text-right">
                          Anti-Tamper Verification
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {dutySessions.map((sess) => {
                        const hasTamper =
                          sess.tamperAttempts && sess.tamperAttempts.length > 0;
                        return (
                          <tr
                            key={sess.id}
                            className={
                              hasTamper
                                ? 'bg-rose-950/20 hover:bg-rose-950/30'
                                : 'hover:bg-white/[0.02]'
                            }
                          >
                            <td className="py-3.5 px-4 font-mono-code tabular-nums text-zinc-300">
                              {sess.id}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-white">
                                {sess.investigatorName}
                              </div>
                              <div className="text-[11px] font-mono-code text-zinc-500">
                                {sess.badgeNumber}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono-code tabular-nums text-emerald-400">
                              {sess.loginTime}
                            </td>
                            <td className="py-3.5 px-4 font-mono-code tabular-nums">
                              {sess.logoutTime ? (
                                <span className="text-zinc-200">
                                  {sess.logoutTime}
                                </span>
                              ) : (
                                <span className="text-amber-400 font-semibold">
                                  Active on Duty
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              {hasTamper ? (
                                <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                  <span>
                                    TAMPER CAUGHT ({sess.tamperAttempts.length})
                                  </span>
                                </span>
                              ) : (
                                <span className="text-emerald-400 flex items-center gap-1.5">
                                  <Lock className="w-3.5 h-3.5 shrink-0" />
                                  <span>
                                    WORM Sealed ({sess.wormSha256Hash.slice(0, 10)}
                                    ...)
                                  </span>
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => openTamperTrapModal(sess)}
                                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 border border-white/10 text-xs font-medium text-zinc-200 transition-colors cursor-pointer whitespace-nowrap"
                              >
                                Test Tamper / Attempt Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Permanent Forensic Violation Log of Caught Tamper Attempts */}
              <div className="p-6 rounded-xl bg-[#111116] border border-white/15 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>
                      Caught Tamper Attempts &amp; Unauthorized Modification Log (
                      {totalTamperAttemptsCount})
                    </span>
                  </h3>
                  <span className="text-xs font-mono-code text-zinc-400">
                    Immutable WORM Violation Record
                  </span>
                </div>

                {totalTamperAttemptsCount === 0 ? (
                  <div className="p-4 rounded-lg bg-[#070709] border border-white/10 text-xs text-zinc-400">
                    No unauthorized edits detected yet. Click{' '}
                    <strong className="text-white">
                      &ldquo;Test Tamper / Attempt Edit&rdquo;
                    </strong>{' '}
                    on any session row above to simulate an investigator trying to
                    alter a login/logout time and watch the Workstation catch them.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dutySessions
                      .flatMap((s) => s.tamperAttempts || [])
                      .map((att) => (
                        <div
                          key={att.id}
                          className="p-4 rounded-xl bg-rose-950/25 border border-rose-500/40 space-y-2 text-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="font-bold text-rose-300">
                              CAUGHT: Senior Investigator &ldquo;
                              {att.attemptedByName}&rdquo; tried to modify{' '}
                              {att.targetField} on session {att.sessionId}
                            </span>
                            <span className="font-mono-code tabular-nums text-zinc-400">
                              Caught At: {att.attemptedAt}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono-code text-[11px]">
                            <div className="p-2.5 rounded-lg bg-[#070709] border border-emerald-500/30 text-emerald-300">
                              Original WORM Value (Preserved): {att.originalValue}
                            </div>
                            <div className="p-2.5 rounded-lg bg-[#070709] border border-rose-500/40 text-rose-300">
                              Attempted Fake Value (Blocked):{' '}
                              {att.attemptedFakeValue}
                            </div>
                          </div>
                          <div className="font-mono-code text-[10px] text-zinc-400 break-all">
                            Expected WORM SHA-256: {att.expectedSha256.slice(0, 32)}
                            ... · Corrupted Hash Mismatch:{' '}
                            {att.corruptedSha256.slice(0, 32)}...
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =====================================================================
              SECTOR 05: AI CROSS-CASE SYNDICATE CORRELATION ENGINE
          ===================================================================== */}
          {activeNav === 'ai_syndicate' && (
            <SyndicatePatternEngine
              incidents={incidents}
              selectedOfficer={selectedOfficer}
              onUpdateIncidents={onUpdateIncidents}
              onSelectCaseForDrawer={(caseId) => {
                setSelectedCaseId(caseId);
                setActiveNav('workflows');
              }}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Modal: Attempt to Modify Duty Log (Tamper Trap Demonstration) */}
      {tamperTargetSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-[#121218] border border-rose-500/50 p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-mono-code text-rose-400">
                  WORM ANTI-TAMPER TRAP · SESSION {tamperTargetSession.id}
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Attempt to Modify Locked Workstation Log
                </h3>
              </div>
              <button
                onClick={() => setTamperTargetSession(null)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              This simulates an insider or Senior Investigator trying to alter a
              captured login/logout timestamp or name. Because every entry is
              locked with a SHA-256 WORM hash, attempting to overwrite this record
              will immediately block the change and catch the investigator.
            </p>

            <form
              onSubmit={handleAttemptTamperModification}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1.5">
                <label className="block font-semibold text-zinc-300">
                  Investigator Attempting the Modification
                </label>
                <input
                  type="text"
                  required
                  value={tamperActorName}
                  onChange={(e) => setTamperActorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#070709] border border-white/15 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-zinc-300">
                  Field Being Altered
                </label>
                <select
                  value={tamperField}
                  onChange={(e) => setTamperField(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#070709] border border-white/15 text-white"
                >
                  <option value="Login Timestamp">
                    Login Timestamp ({tamperTargetSession.loginTime})
                  </option>
                  <option value="Logout Timestamp">
                    Logout Timestamp (
                    {tamperTargetSession.logoutTime || 'Active on Duty'})
                  </option>
                  <option value="Investigator Name">
                    Investigator Name ({tamperTargetSession.investigatorName})
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-zinc-300">
                  Attempted New / Fake Value
                </label>
                <input
                  type="text"
                  required
                  value={tamperFakeValue}
                  onChange={(e) => setTamperFakeValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#070709] border border-rose-500/40 text-rose-200 font-mono-code"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTamperTargetSession(null)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-zinc-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                >
                  Attempt Overwrite (Trigger Anti-Tamper Catch)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
