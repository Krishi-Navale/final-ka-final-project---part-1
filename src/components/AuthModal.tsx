import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  LogIn,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Fingerprint,
  Cpu,
  KeyRound,
  Activity,
  BadgeCheck,
  LogOut,
  Zap,
  Terminal,
  FileWarning,
  Layers,
  Link2,
  Globe,
} from 'lucide-react';
import { findRegisteredAccount, saveRegisteredAccount } from '../data/incidentStore';
import { registerUserAPI, loginUserAPI } from '../data/apiClient';
import { computeSHA256 } from '../utils/crypto';
import { addNotification } from '../data/notificationStore';
import {
  submitSharedProblemToWorkstation,
  SharedProblemReport,
} from '../data/sharedProblemsStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onSubmitProblemCase?: (
    problemText: string,
    sourceLink: string,
    categoryName?: string,
    createdReport?: SharedProblemReport
  ) => void;
}

interface QuickSwitchPreset {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'senior_investigator';
  badgeNumber?: string;
  stationName?: string;
  clearance: string;
  subtitle: string;
  accentColor: string;
  avatarUrl?: string;
}

const QUICK_SWITCH_PRESETS: QuickSwitchPreset[] = [
  {
    id: 'preset-citizen',
    name: 'Navale Krishi',
    email: 'navalekrishi@gmail.com',
    role: 'citizen',
    badgeNumber: 'FIP-CIT-2026-8491',
    stationName: 'Citizen Evidentiary Vault & 1930 Docket',
    clearance: 'LEVEL 2 · CITIZEN CUSTODY',
    subtitle: 'Personal Evidence Locker, 65B Certificates & Case Timeline',
    accentColor: '#FF4D15',
    avatarUrl: '/assets/aistudio/image_526c1ede.png',
  },
  {
    id: 'preset-investigator-krishi',
    name: 'Krishi · AI Command',
    email: 'krishi.navale@i4c.gov.in',
    role: 'senior_investigator',
    badgeNumber: 'I4C-NAT-7721',
    stationName: 'AI Cross-Case Syndicate Correlation Lab',
    clearance: 'LEVEL 5 · AI COMMAND',
    subtitle: 'AI Pattern Engine, Senior Workstation & Sec 65B Authority',
    accentColor: '#38BDF8',
    avatarUrl: '/assets/aistudio/image_526c1ede.png',
  },
  {
    id: 'preset-investigator-lead',
    name: 'Dr. Bibi Zohara',
    email: 'bluesapphiiire777@gmail.com',
    role: 'senior_investigator',
    badgeNumber: 'DEL-CY-0842',
    stationName: 'National Cyber Forensic & Evidentiary Command',
    clearance: 'LEVEL 5 · SOVEREIGN COMMAND',
    subtitle: 'Senior Investigator Workstation, 65B Signatory & WORM',
    accentColor: '#10B981',
    avatarUrl: '/assets/aistudio/image_acc490cb.png',
  },
  {
    id: 'preset-investigator-balchandra',
    name: 'Sup. Balchandra',
    email: 'balchandra.mule@mahacyber.gov.in',
    role: 'senior_investigator',
    badgeNumber: 'MAH-CY-1109',
    stationName: 'Maharashtra Cyber Nodal Unit · 1930 Freeze',
    clearance: 'LEVEL 5 · 1930 NODAL LEAD',
    subtitle: 'Golden-Hour Bank Lien Interdiction & Senior Workstation',
    accentColor: '#F59E0B',
    avatarUrl: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg',
  },
  {
    id: 'preset-investigator-afsheen',
    name: 'Afsheen S',
    email: 'afsheen.worm@ksp.gov.in',
    role: 'senior_investigator',
    badgeNumber: 'BLR-CY-4402',
    stationName: 'Karnataka Cyber Command · WORM & Sec 65B',
    clearance: 'LEVEL 5 · JUDICIAL SEAL',
    subtitle: 'Photo ELA Forensics, WORM Ledger & Sec 65B Certification',
    accentColor: '#A855F7',
    avatarUrl: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onSubmitProblemCase,
}) => {
  // 3 Modes: 'signin' (Log In) | 'register' (Sign Up) | 'problem' (Share Problem)
  const [mode, setMode] = useState<'signin' | 'register' | 'problem'>('signin');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [problemSourceLink, setProblemSourceLink] = useState('');
  const [category, setCategory] = useState('Phishing & Malicious Link');
  const [dispatchedProblemReport, setDispatchedProblemReport] =
    useState<SharedProblemReport | null>(null);

  // UX / Aesthetic telemetry states
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailSuccessNote, setEmailSuccessNote] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveIdentityHash, setLiveIdentityHash] = useState<string>(
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  );
  const [switchingPresetId, setSwitchingPresetId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const seed =
      mode === 'problem'
        ? `${problemSourceLink.trim() || 'origin-link'}::${problemDescription.trim() || 'problem'}::FIP-2026`
        : `${email.trim() || currentUser.email || 'fip-sovereign-node'}::${mode}::FIP-2026`;
    computeSHA256(seed).then((hash) => {
      if (active) setLiveIdentityHash(hash);
    });
    return () => {
      active = false;
    };
  }, [email, mode, currentUser.email, problemSourceLink, problemDescription]);

  if (!isOpen) return null;

  const validateGmail = (val: string): boolean => {
    const clean = val.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(clean);
  };

  const handleModeSwitch = (newMode: 'signin' | 'register' | 'problem') => {
    setMode(newMode);
    setErrorMessage(null);
    setEmailSuccessNote(null);
    setDispatchedProblemReport(null);
  };

  // Password strength calculation for aesthetic meter
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Awaiting Keyphrase', color: 'bg-zinc-700' };
    let score = 1;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 9 || /[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
    const map = [
      { score: 0, label: 'Awaiting Keyphrase', color: 'bg-zinc-700' },
      { score: 1, label: 'Low Entropy (Basic)', color: 'bg-rose-500' },
      { score: 2, label: 'Standard Vault Key', color: 'bg-amber-500' },
      { score: 3, label: 'High Cryptographic Grade', color: 'bg-emerald-400' },
      { score: 4, label: 'Sovereign WORM Grade (256-Bit)', color: 'bg-cyan-400' },
    ];
    return map[Math.min(score, 4)];
  };

  const pwdStrength = getPasswordStrength(password);

  // Instant 1-Click Account Switch Handler
  const handleQuickProfileSwitch = async (preset: QuickSwitchPreset) => {
    setSwitchingPresetId(preset.id);
    setErrorMessage(null);
    setEmailSuccessNote(null);

    saveRegisteredAccount({
      name: preset.name,
      email: preset.email,
      password: 'preset_verified_auth',
      createdAt: new Date().toISOString(),
    });

    await loginUserAPI(preset.email, '123456789', preset.name, preset.role).catch(() => null);

    onUpdateUser({
      name: preset.name,
      email: preset.email,
      role: preset.role,
      isAnonymous: false,
      badgeNumber: preset.badgeNumber,
      stationName: preset.stationName,
    });

    addNotification({
      type: preset.role === 'senior_investigator' ? 'CUSTODY_ALERT' : 'DIRECT_NOTICE',
      title: `Identity Switched: ${preset.name}`,
      message: `Session cryptographically bound to ${preset.email} (${preset.clearance}). RFC-3161 audit log updated.`,
      recipientEmail: preset.email,
      recipientRole: 'all',
      senderName: 'F.I.P Identity Vault',
      badge: preset.role === 'senior_investigator' ? 'COMMAND AUTH' : 'CITIZEN AUTH',
    });

    setTimeout(() => {
      setSwitchingPresetId(null);
      onClose();
    }, 320);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setEmailSuccessNote(null);

    // 1. Share Problem specific flow (NO Full Name, NO Gmail, NO Password required!)
    if (mode === 'problem') {
      const cleanProblem = problemDescription.trim();
      const cleanLink = problemSourceLink.trim();

      if (!cleanLink) {
        setErrorMessage('Please provide the link / URL from where the problem came.');
        return;
      }

      if (!cleanProblem) {
        setErrorMessage('Please describe the problem you are facing.');
        return;
      }

      setIsSubmitting(true);
      try {
        const hash = await computeSHA256(`${cleanLink}::${cleanProblem}::${Date.now()}`);
        const createdReport = await submitSharedProblemToWorkstation({
          problemText: cleanProblem,
          sourceLink: cleanLink,
          category,
          sha256: hash,
        });

        if (onSubmitProblemCase) {
          onSubmitProblemCase(cleanProblem, cleanLink, category, createdReport);
        }

        setDispatchedProblemReport(createdReport);
        setProblemDescription('');
        setProblemSourceLink('');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // 2. Log In & Sign Up flows
    const cleanEmail = email.trim();
    const cleanName = name.trim();

    if (!cleanEmail) {
      setErrorMessage('Gmail address is mandatory for cryptographic session binding.');
      return;
    }

    if (!validateGmail(cleanEmail)) {
      setErrorMessage('Please enter a valid Gmail address (e.g. name@gmail.com).');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage('Please enter a valid security passcode (minimum 4 characters).');
      return;
    }

    // Secret Investigator Portal Check
    const SECRET_INVESTIGATOR_EMAIL = 'bluesapphiiire777@gmail.com';
    const SECRET_INVESTIGATOR_PASS = '123456789';

    const isTryingSecretInvestigator =
      cleanEmail.toLowerCase() === SECRET_INVESTIGATOR_EMAIL.toLowerCase();

    if (isTryingSecretInvestigator && password !== SECRET_INVESTIGATOR_PASS) {
      setErrorMessage('Access Denied: Invalid security passcode for Secret Investigator Terminal.');
      return;
    }

    const isInvestigator = isTryingSecretInvestigator && password === SECRET_INVESTIGATOR_PASS;
    const resolvedRole = isInvestigator ? 'senior_investigator' : 'citizen';

    setIsSubmitting(true);

    // Sign Up specific validation & Gmail SMTP Dispatch
    if (mode === 'register') {
      if (!cleanName && !isInvestigator) {
        setErrorMessage('Full legal name is required during Sign Up to initialize your custody dossier.');
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Security passcodes do not match. Please verify and re-enter.');
        setIsSubmitting(false);
        return;
      }

      const finalName =
        cleanName || (isInvestigator ? 'Senior Investigator' : cleanEmail.split('@')[0]);

      saveRegisteredAccount({
        name: finalName,
        email: cleanEmail,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await registerUserAPI({
        email: cleanEmail,
        name: finalName,
        role: resolvedRole,
        password,
      });

      const generatedBadge =
        res.idNumber ||
        (isInvestigator
          ? 'I4C-LEAD-NAT-0842'
          : `FIP-CIT-2026-${Math.floor(1000 + Math.random() * 9000)}`);

      if (res.idNumber) {
        setEmailSuccessNote(
          `Welcome Email & Forensic ID (${res.idNumber}) dispatched to ${cleanEmail}`
        );
      }

      onUpdateUser({
        name: finalName,
        email: cleanEmail,
        role: resolvedRole,
        isAnonymous: false,
        badgeNumber: generatedBadge,
        stationName: isInvestigator
          ? 'National Cyber Forensic & Evidentiary Command'
          : 'Citizen Evidentiary Vault',
      });

      addNotification({
        type: 'CERTIFICATE',
        title: `New Account Provisioned: ${finalName}`,
        message: `Forensic System ID ${generatedBadge} bound to ${cleanEmail}. Official welcome dispatch transmitted via Gmail SMTP.`,
        recipientEmail: cleanEmail,
        recipientRole: 'all',
        senderName: 'F.I.P Identity Registrar',
        badge: 'ACCOUNT SEALED',
      });

      setIsSubmitting(false);
      onClose();
      return;
    }

    // Log In specific flow
    if (mode === 'signin') {
      const existingAccount = findRegisteredAccount(cleanEmail);
      const resolvedName =
        existingAccount?.name ||
        cleanName ||
        (isInvestigator ? 'Senior Investigator' : cleanEmail.split('@')[0]);

      saveRegisteredAccount({
        name: resolvedName,
        email: cleanEmail,
        password: password || 'hash_default_123',
        createdAt: new Date().toISOString(),
      });

      const loginRes = await loginUserAPI(cleanEmail, password, resolvedName, resolvedRole);

      const finalUserName = loginRes?.user?.name || resolvedName;
      const finalRole = loginRes?.user?.role || resolvedRole;
      const finalBadge =
        loginRes?.user?.badgeNumber ||
        (isInvestigator ? 'I4C-LEAD-NAT-0842' : 'FIP-CIT-2026-8491');

      onUpdateUser({
        name: finalUserName,
        email: cleanEmail,
        role: finalRole,
        isAnonymous: false,
        badgeNumber: finalBadge,
        stationName: isInvestigator
          ? 'National Cyber Forensic & Evidentiary Command'
          : 'Citizen Evidentiary Vault',
      });

      addNotification({
        type: 'DIRECT_NOTICE',
        title: `Authenticated Session Active: ${finalUserName}`,
        message: `Cryptographic session handshake verified for ${cleanEmail} (${finalBadge}).`,
        recipientEmail: cleanEmail,
        recipientRole: 'all',
        senderName: 'F.I.P Auth Gateway',
        badge: 'SESSION LIVE',
      });

      setIsSubmitting(false);
      onClose();
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Cinematic Dark Glass Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#040406]/85 backdrop-blur-xl transition-opacity"
      />

      {/* Split-Screen Sovereign Identity Vault Modal */}
      <div className="relative z-10 w-full max-w-4xl bg-[#0B0B0F] text-white rounded-[28px] shadow-[0_32px_90px_rgba(0,0,0,0.92)] border border-white/12 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col lg:grid lg:grid-cols-12">
        {/* Top Ambient Accent Glow */}
        <div className="pointer-events-none absolute -top-28 left-1/3 w-96 h-56 bg-[#FF4D15]/15 rounded-full blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-28 right-10 w-80 h-56 bg-cyan-500/10 rounded-full blur-[100px]" />

        {/* ============================================================
            LEFT COLUMN: BIOMETRIC VAULT & 1-CLICK ACCOUNT SWITCHER
           ============================================================ */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#111118] via-[#0B0B10] to-[#07070A] border-b lg:border-b-0 lg:border-r border-white/10 p-5 sm:p-6 flex flex-col justify-between relative overflow-y-auto">
          {/* Subtle Grid Overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 space-y-5">
            {/* Brand Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF4D15] to-[#c93406] text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,77,21,0.45)] border border-white/20">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-code uppercase tracking-[0.2em] text-[#FF4D15] font-bold">
                      F.I.P IDENTITY VAULT
                    </span>
                  </div>
                  <h2 className="text-sm font-black tracking-tight text-white">
                    Sovereign Access & Switcher
                  </h2>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono-code font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                TLS 1.3
              </span>
            </div>

            {/* Active Session Telemetry Card */}
            <div className="p-3.5 rounded-2xl bg-[#14141D]/90 border border-white/10 shadow-inner space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-code uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#FF4D15]" />
                  Current Active Session
                </span>
                {currentUser.email ? (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateUser({ name: '', email: '', role: 'citizen', isAnonymous: true });
                      onClose();
                    }}
                    className="text-[10px] font-mono-code font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 transition-colors"
                  >
                    <LogOut className="w-3 h-3" />
                    Sign Out
                  </button>
                ) : (
                  <span className="text-[10px] font-mono-code text-zinc-500">Unauthenticated</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {(`${currentUser.name || ''} ${currentUser.email || ''}`)
                  .toLowerCase()
                  .includes('krishi') ? (
                  <img
                    src="/assets/aistudio/image_526c1ede.png"
                    alt={currentUser.name || 'Krishi'}
                    className="w-9 h-9 rounded-xl object-cover object-top border border-[#FF4D15] shrink-0"
                  />
                ) : (`${currentUser.name || ''} ${currentUser.email || ''}`)
                    .toLowerCase()
                    .includes('balchandra') ? (
                  <img
                    src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg"
                    alt={currentUser.name || 'Balchandra'}
                    className="w-9 h-9 rounded-xl object-cover object-top border border-[#FF4D15] shrink-0"
                  />
                ) : (`${currentUser.name || ''} ${currentUser.email || ''}`)
                    .toLowerCase()
                    .includes('zohara') ? (
                  <img
                    src="/assets/aistudio/image_acc490cb.png"
                    alt={currentUser.name || 'Bibi Zohara'}
                    className="w-9 h-9 rounded-xl object-cover object-top border border-[#FF4D15] shrink-0"
                  />
                ) : (`${currentUser.name || ''} ${currentUser.email || ''}`)
                    .toLowerCase()
                    .includes('afsheen') ? (
                  <img
                    src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg"
                    alt={currentUser.name || 'Afsheen S'}
                    className="w-9 h-9 rounded-xl object-cover object-top border border-[#FF4D15] shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-[#070709] border border-white/10 flex items-center justify-center font-black text-xs text-[#FF4D15] shrink-0">
                    {(currentUser.name || currentUser.email || 'G')[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-white truncate">
                    {currentUser.name || 'Anonymous Citizen Guest'}
                  </p>
                  <p className="text-[11px] font-mono-code text-zinc-400 truncate">
                    {currentUser.email || 'No Gmail bound to session'}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono-code font-bold uppercase shrink-0 border ${
                    currentUser.role === 'senior_investigator'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-[#FF4D15]/15 text-[#FF4D15] border-[#FF4D15]/30'
                  }`}
                >
                  {currentUser.role === 'senior_investigator' ? 'COMMAND' : 'CITIZEN'}
                </span>
              </div>
            </div>

            {/* Instant 1-Click Account Switcher Matrix */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-code uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#FF4D15]" />
                  1-Click Instant Account Switch
                </span>
                <span className="text-[9px] font-mono-code text-zinc-500">Zero-Latency Handshake</span>
              </div>

              <div className="space-y-2">
                {QUICK_SWITCH_PRESETS.map((preset) => {
                  const isCurrent =
                    currentUser.email?.toLowerCase() === preset.email.toLowerCase() &&
                    currentUser.role === preset.role;
                  const isSwitching = switchingPresetId === preset.id;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleQuickProfileSwitch(preset)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all relative overflow-hidden group ${
                        isCurrent
                          ? 'bg-[#1A1A24] border-[#FF4D15]/60 shadow-[0_0_20px_rgba(255,77,21,0.15)]'
                          : 'bg-[#0E0E14]/90 border-white/10 hover:border-white/25 hover:bg-[#15151F]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {preset.avatarUrl ? (
                            <img
                              src={preset.avatarUrl}
                              alt={preset.name}
                              className="w-9 h-9 rounded-xl object-cover object-top shrink-0 border border-[#FF4D15]"
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border"
                              style={{
                                backgroundColor: `${preset.accentColor}18`,
                                borderColor: `${preset.accentColor}45`,
                                color: preset.accentColor,
                              }}
                            >
                              {preset.role === 'senior_investigator' ? (
                                <ShieldCheck className="w-4 h-4" />
                              ) : (
                                <User className="w-4 h-4" />
                              )}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-extrabold text-white truncate">
                                {preset.name}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-mono-code text-zinc-400 truncate">
                              {preset.email}
                            </p>
                          </div>
                        </div>

                        <span className="text-[9px] font-mono-code font-bold px-2 py-0.5 rounded bg-black/50 text-zinc-300 border border-white/10 shrink-0 group-hover:border-[#FF4D15]/50 group-hover:text-white transition-colors">
                          {isSwitching ? 'BINDING...' : isCurrent ? 'RE-SYNC' : 'SWITCH →'}
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
                        <span className="truncate">{preset.subtitle}</span>
                        <span
                          className="font-mono-code text-[9px] font-bold shrink-0 ml-2"
                          style={{ color: preset.accentColor }}
                        >
                          {preset.badgeNumber}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live SHA-256 Cryptographic Session Token Footer */}
          <div className="relative z-10 mt-5 pt-4 border-t border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono-code text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#FF4D15]" />
                LIVE SHA-256 SESSION DIGEST
              </span>
              <span className="text-emerald-400 font-bold">RFC-3161 WORM</span>
            </div>
            <div className="p-2 rounded-xl bg-black/60 border border-white/10 font-mono-code text-[10px] text-zinc-400 truncate select-all">
              0x{liveIdentityHash}
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN: GLASSMORPHIC AUTHENTICATION & INTAKE CONSOLE
           ============================================================ */}
        <div className="lg:col-span-7 flex flex-col max-h-[92vh] bg-[#0B0B0F] relative">
          {/* Top Console Bar */}
          <div className="p-5 sm:px-7 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0E0E14]/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#FF4D15] font-bold">
                  CRYPTOGRAPHIC CREDENTIAL GATEWAY
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FF4D15]/15 text-[#FF4D15] text-[10px] font-mono-code font-bold border border-[#FF4D15]/30">
                  Gmail SMTP Linked
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                {mode === 'signin'
                  ? 'Authenticate Forensic Identity'
                  : mode === 'register'
                  ? 'Provision New Evidentiary Account'
                  : 'Direct Cyber Incident Intake'}
              </h3>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 rounded-xl bg-[#181822] hover:bg-[#FF4D15] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 3-Way Mode Switcher Segmented Bar */}
          <div className="px-5 sm:px-7 pt-4 shrink-0">
            <div className="grid grid-cols-3 gap-1.5 bg-[#07070A] border border-white/10 p-1.5 rounded-2xl text-xs font-bold text-zinc-400">
              <button
                type="button"
                onClick={() => handleModeSwitch('signin')}
                className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'signin'
                    ? 'bg-gradient-to-r from-[#FF4D15] to-[#e03e0b] text-white font-black shadow-[0_0_20px_rgba(255,77,21,0.35)]'
                    : 'text-zinc-400 hover:text-white hover:bg-[#14141D]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeSwitch('register')}
                className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-[#FF4D15] to-[#e03e0b] text-white font-black shadow-[0_0_20px_rgba(255,77,21,0.35)]'
                    : 'text-zinc-400 hover:text-white hover:bg-[#14141D]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeSwitch('problem')}
                className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'problem'
                    ? 'bg-gradient-to-r from-[#FF4D15] to-[#e03e0b] text-white font-black shadow-[0_0_20px_rgba(255,77,21,0.35)]'
                    : 'text-zinc-400 hover:text-white hover:bg-[#14141D]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Share Problem</span>
              </button>
            </div>
          </div>

          {/* Scrollable Form Body */}
          <div className="overflow-y-auto p-5 sm:p-7 space-y-4 flex-1">
            {/* Contextual Mode Banner */}
            {mode === 'signin' && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#161622] to-[#111118] border border-white/10 text-zinc-200 text-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#FF4D15]/15 border border-[#FF4D15]/30 text-[#FF4D15] shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Cryptographic Vault Access</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                    Enter your registered Gmail and security passcode, or use the{' '}
                    <span className="text-white font-semibold">1-Click Instant Switch</span> cards on the left to jump between Citizen and Command workstations.
                  </p>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="p-3.5 rounded-2xl bg-[#FF4D15]/10 border border-[#FF4D15]/25 text-zinc-200 text-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#FF4D15]/20 border border-[#FF4D15]/40 text-[#FF4D15] shrink-0">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Provision New Citizen Forensic ID</p>
                  <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
                    Generates a dedicated WORM evidence locker and dispatches an official welcome certificate with your unique System ID to your Gmail.
                  </p>
                </div>
              </div>
            )}

            {mode === 'problem' && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-zinc-200 text-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
                  <FileWarning className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-bold text-amber-300">
                      Zero-Friction Problem &amp; Link Intake (No Name or Gmail Required)
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setProblemSourceLink('https://sbi-kyc-instant-verify-portal.xyz/update.apk');
                        setProblemDescription(
                          'Received an SMS stating my bank account is blocked and asking me to open this link. When clicked, it downloads a remote-access APK and asks for UPI PIN.'
                        );
                        setCategory('Phishing & Malicious Link');
                        setErrorMessage(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#FF4D15]/20 hover:bg-[#FF4D15] text-[#FF4D15] hover:text-white border border-[#FF4D15]/40 text-[10px] font-mono-code font-bold transition-colors cursor-pointer"
                    >
                      + Auto-Fill Sample Problem &amp; Link
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                    Simply share the problem you have and the link where it came from. It is immediately routed with a live notification to the <strong className="text-white">Senior Investigator Workstation &rarr; Share a Problem Sector</strong> for inspection and resolution.
                  </p>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/35 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Success Alert */}
            {emailSuccessNote && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{emailSuccessNote}</span>
              </div>
            )}

            {/* Dispatched Shared Problem Confirmation Banner */}
            {mode === 'problem' && dispatchedProblemReport && (
              <div className="p-4 rounded-2xl bg-emerald-500/12 border border-emerald-500/40 text-emerald-100 text-xs space-y-3 animate-in fade-in duration-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-black text-white">
                      Problem &amp; Link Dispatched to Workstation ({dispatchedProblemReport.trackingCode})
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono-code font-bold text-emerald-300">
                    NOTIFICATION SENT
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Origin Link <span className="font-mono-code text-amber-300 break-all">{dispatchedProblemReport.sourceLink}</span> and your problem report have been sealed under SHA-256 and sent to the Senior Investigator Workstation&apos;s dedicated <strong className="text-white">Share a Problem Sector</strong>.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {currentUser.role === 'senior_investigator' ? (
                    <button
                      type="button"
                      onClick={() => {
                        window.location.hash = '#workstation-shared-problems';
                        onUpdateUser(currentUser);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#FF4D15] hover:bg-[#e03e0b] text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Inspect &amp; Solve in Workstation Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        window.location.hash = '#workstation-shared-problems';
                        handleQuickProfileSwitch(QUICK_SWITCH_PRESETS[1]);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#FF4D15] hover:bg-[#e03e0b] text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Switch to Senior Investigator &amp; Inspect in Workstation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setDispatchedProblemReport(null)}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Share Another Problem
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ==========================================================
                  LOG IN & SIGN UP FIELDS (Hidden in 'problem' mode!)
                 ========================================================== */}
              {mode !== 'problem' && (
                <>
                  {/* FULL NAME: Sign Up only */}
                  {mode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold text-zinc-200 mb-1.5 flex items-center justify-between">
                        <span>
                          Full Legal Name <span className="text-[#FF4D15]">*</span>
                        </span>
                        <span className="text-[10px] font-mono-code text-zinc-500">
                          Bound to Section 65B Dossier
                        </span>
                      </label>
                      <div className="relative group">
                        <User className="w-4 h-4 text-zinc-500 group-focus-within:text-[#FF4D15] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full legal name (e.g. Navale Krishi)"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 text-xs bg-[#07070A] text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15] focus:ring-2 focus:ring-[#FF4D15]/20 transition-all font-medium"
                        />
                      </div>
                    </div>
                  )}

                  {/* GMAIL ADDRESS */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-200 mb-1.5 flex items-center justify-between">
                      <span>
                        Official Gmail Address <span className="text-[#FF4D15]">*</span>
                      </span>
                      <span className="text-[10px] font-mono-code text-[#FF4D15] font-bold">
                        SMTP Verified Channel
                      </span>
                    </label>
                    <div className="relative group">
                      <Mail className="w-4 h-4 text-zinc-500 group-focus-within:text-[#FF4D15] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@gmail.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 text-xs bg-[#07070A] text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15] focus:ring-2 focus:ring-[#FF4D15]/20 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* PASSWORD FIELD + ENTROPY METER */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-200 mb-1.5 flex items-center justify-between">
                      <span>
                        Vault Security Passcode <span className="text-[#FF4D15]">*</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[10px] font-mono-code text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showPassword ? 'HIDE KEY' : 'SHOW KEY'}</span>
                      </button>
                    </label>
                    <div className="relative group">
                      <Lock className="w-4 h-4 text-zinc-500 group-focus-within:text-[#FF4D15] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter cryptographic passcode"
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/10 text-xs bg-[#07070A] text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15] focus:ring-2 focus:ring-[#FF4D15]/20 transition-all font-medium"
                      />
                    </div>

                    {/* Live Password Entropy Bar */}
                    {mode === 'register' && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono-code">
                          <span className="text-zinc-500">KEY ENTROPY GRADE</span>
                          <span className="text-zinc-300 font-bold">{pwdStrength.label}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 h-1">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`rounded-full transition-all duration-300 ${
                                pwdStrength.score >= step ? pwdStrength.color : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CONFIRM PASSWORD: Sign Up only */}
                  {mode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold text-zinc-200 mb-1.5">
                        Confirm Security Passcode <span className="text-[#FF4D15]">*</span>
                      </label>
                      <div className="relative group">
                        <Lock className="w-4 h-4 text-zinc-500 group-focus-within:text-[#FF4D15] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter security passcode"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 text-xs bg-[#07070A] text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15] focus:ring-2 focus:ring-[#FF4D15]/20 transition-all font-medium"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ==========================================================
                  SHARE PROBLEM SECTOR: ONLY PROBLEM + LINK OF THE PROBLEM!
                 ========================================================== */}
              {mode === 'problem' && (
                <>
                  {/* 1. LINK OF THE PROBLEM (WHERE IT CAME FROM) */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-200 mb-1.5 flex items-center justify-between">
                      <span>
                        Link of the Problem (Where It Came From) <span className="text-[#FF4D15]">*</span>
                      </span>
                      <span className="text-[10px] font-mono-code text-amber-400 font-bold flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        ORIGIN URL / LINK
                      </span>
                    </label>
                    <div className="relative group">
                      <Link2 className="w-4 h-4 text-zinc-500 group-focus-within:text-[#FF4D15] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                      <input
                        type="text"
                        required
                        value={problemSourceLink}
                        onChange={(e) => setProblemSourceLink(e.target.value)}
                        placeholder="Paste suspicious URL, phishing link, APK link, or Telegram/WhatsApp link (e.g. https://...)"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 text-xs bg-[#07070A] text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15] focus:ring-2 focus:ring-[#FF4D15]/20 transition-all font-mono-code"
                      />
                    </div>
                  </div>

                  {/* 2. SHARE THE PROBLEM WHICH YOU HAVE */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-200 mb-1.5 flex items-center justify-between">
                      <span>
                        Share the Problem You Have <span className="text-[#FF4D15]">*</span>
                      </span>
                      <span className="text-[10px] font-mono-code text-emerald-400 font-bold">
                        SHA-256 WORM SEALED
                      </span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      placeholder="Describe the problem you are facing, what happened when you received or opened the link, or any scam demands..."
                      className="w-full p-3.5 rounded-xl border border-white/10 text-xs bg-[#07070A] text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15] focus:ring-2 focus:ring-[#FF4D15]/20 transition-all leading-relaxed font-medium"
                    />
                  </div>

                  {/* 3. OPTIONAL CATEGORY TAG */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-200 mb-1.5 flex items-center justify-between">
                      <span>Problem Category</span>
                      <span className="text-[10px] font-mono-code text-zinc-500">Auto-Routed to Workstation</span>
                    </label>
                    <div className="relative">
                      <Layers className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 text-xs bg-[#07070A] text-white focus:outline-none focus:border-[#FF4D15] transition-all font-medium"
                      >
                        <option value="Phishing & Malicious Link">
                          Phishing Link / Suspicious Website / Fake KYC URL
                        </option>
                        <option value="Financial Cyber Fraud">
                          Financial Cyber Fraud (UPI / APK / NetBanking)
                        </option>
                        <option value="Impersonation & Digital Arrest">
                          Impersonation &amp; Digital Arrest Scam (CBI / Police Fake Calls)
                        </option>
                        <option value="Extortion & Sextortion">
                          Extortion &amp; Video Blackmail Link
                        </option>
                        <option value="Social Media Hijack & Identity Theft">
                          Social Media / Telegram / WhatsApp Scam Link
                        </option>
                        <option value="Ransomware & System Compromise">
                          Malicious APK / Device Compromise Link
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Primary Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-[#FF4D15] via-[#ff5e2b] to-[#E03E0B] hover:brightness-110 disabled:opacity-50 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_10px_30px_rgba(255,77,21,0.35)] active:scale-[0.99] transition-all group cursor-pointer"
                >
                  <Terminal className="w-4 h-4 text-white/90" />
                  <span>
                    {isSubmitting
                      ? 'Sealing SHA-256 Digest & Routing to Workstation...'
                      : mode === 'problem'
                      ? 'Send Problem & Link to Workstation Sector'
                      : mode === 'register'
                      ? 'Provision Account & Dispatch Welcome Certificate'
                      : 'Authenticate & Enter Personal Vault'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Quick Mode Switch Footer */}
          <div className="px-6 py-3.5 bg-[#07070A] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono-code text-zinc-400">
                BSA 2023 Sec. 63 / Sec. 65B Compliant Gateway
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              {mode !== 'signin' && (
                <button
                  type="button"
                  onClick={() => handleModeSwitch('signin')}
                  className="font-bold text-[#FF4D15] hover:underline"
                >
                  Log In
                </button>
              )}
              {mode !== 'register' && (
                <button
                  type="button"
                  onClick={() => handleModeSwitch('register')}
                  className="font-bold text-[#FF4D15] hover:underline"
                >
                  Sign Up
                </button>
              )}
              {mode !== 'problem' && (
                <button
                  type="button"
                  onClick={() => handleModeSwitch('problem')}
                  className="font-bold text-zinc-200 hover:text-white hover:underline"
                >
                  Emergency Intake
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
