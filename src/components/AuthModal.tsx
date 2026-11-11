import React, { useState } from 'react';
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
  AlertCircle 
} from 'lucide-react';
import { findRegisteredAccount, saveRegisteredAccount } from '../data/incidentStore';
import { registerUserAPI, loginUserAPI } from '../data/apiClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onSubmitProblemCase?: (
    email: string, 
    problemText: string, 
    password: string, 
    citizenName?: string,
    categoryName?: string
  ) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onSubmitProblemCase,
}) => {
  // 3 Modes: 'signin' (Log In) | 'register' (Sign Up) | 'problem' (Share Problem)
  const [mode, setMode] = useState<'signin' | 'register' | 'problem'>('signin');
  
  // Clean form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [category, setCategory] = useState('Financial Cyber Fraud');
  
  // UX UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailSuccessNote, setEmailSuccessNote] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setEmailSuccessNote(null);

    const cleanEmail = email.trim();
    const cleanName = name.trim();

    if (!cleanEmail) {
      setErrorMessage('Gmail address is mandatory.');
      return;
    }

    if (!validateGmail(cleanEmail)) {
      setErrorMessage('Please enter a valid Gmail address (e.g. name@gmail.com).');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage('Please enter a valid password (minimum 4 characters).');
      return;
    }

    // Secret Investigator Portal Check
    const SECRET_INVESTIGATOR_EMAIL = 'bluesapphiiire777@gmail.com';
    const SECRET_INVESTIGATOR_PASS = '123456789';

    const isTryingSecretInvestigator = cleanEmail.toLowerCase() === SECRET_INVESTIGATOR_EMAIL.toLowerCase();

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
        setErrorMessage('Full name is required during Sign Up so your personal dashboard can be initialized.');
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        setIsSubmitting(false);
        return;
      }

      const finalName = cleanName || (isInvestigator ? 'Senior Investigator' : cleanEmail.split('@')[0]);

      // Save to account registry
      saveRegisteredAccount({
        name: finalName,
        email: cleanEmail,
        password,
        createdAt: new Date().toISOString(),
      });

      // Register via Express Backend API -> Dispatches Official Welcome Email + ID Number via Nodemailer
      const res = await registerUserAPI({
        email: cleanEmail,
        name: finalName,
        role: resolvedRole,
        password
      });

      if (res.idNumber) {
        setEmailSuccessNote(`Welcome Email & ID Number (${res.idNumber}) dispatched to ${cleanEmail}`);
      }

      // Update current user state
      onUpdateUser({
        name: finalName,
        email: cleanEmail,
        role: resolvedRole,
        isAnonymous: false,
        badgeNumber: res.idNumber || (isInvestigator ? 'I4C-LEAD-NAT-0842' : undefined),
        stationName: isInvestigator ? 'National Cyber Forensic & Evidentiary Command' : undefined,
      });

      setIsSubmitting(false);
      onClose();
      return;
    }

    // Log In specific flow - auto-registers in backend MongoDB if account does not exist
    if (mode === 'signin') {
      const existingAccount = findRegisteredAccount(cleanEmail);
      const resolvedName = existingAccount?.name || (cleanName || (isInvestigator ? 'Senior Investigator' : cleanEmail.split('@')[0]));

      // Save locally
      saveRegisteredAccount({
        name: resolvedName,
        email: cleanEmail,
        password: password || 'hash_default_123',
        createdAt: new Date().toISOString(),
      });

      // Synchronize with backend MongoDB
      const loginRes = await loginUserAPI(cleanEmail, password, resolvedName, resolvedRole);

      onUpdateUser({
        name: loginRes?.user?.name || resolvedName,
        email: cleanEmail,
        role: loginRes?.user?.role || resolvedRole,
        isAnonymous: false,
        badgeNumber: loginRes?.user?.badgeNumber || (isInvestigator ? 'I4C-LEAD-NAT-0842' : undefined),
        stationName: isInvestigator ? 'National Cyber Forensic & Evidentiary Command' : undefined,
      });

      setIsSubmitting(false);
      onClose();
      return;
    }

    // Share Problem specific flow
    if (mode === 'problem') {
      if (!problemDescription.trim()) {
        setErrorMessage('Please describe the cyber incident or problem in detail.');
        setIsSubmitting(false);
        return;
      }

      const finalName = cleanName || cleanEmail.split('@')[0];

      saveRegisteredAccount({
        name: finalName,
        email: cleanEmail,
        password,
        createdAt: new Date().toISOString(),
      });

      await registerUserAPI({
        email: cleanEmail,
        name: finalName,
        role: 'citizen',
        password
      });

      onUpdateUser({
        name: finalName,
        email: cleanEmail,
        role: 'citizen',
        isAnonymous: false,
      });

      if (onSubmitProblemCase) {
        onSubmitProblemCase(cleanEmail, problemDescription.trim(), password, finalName, category);
      }

      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity" 
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5A1F] text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <span>Forensic Investigation Platform</span>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-[#FF5A1F] text-[10px] font-mono-code font-bold border border-orange-500/30">
                  Gmail SMTP Enabled
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono-code">
                RFC-3161 WORM Custody & Legal Evidence Vault
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Way Switch Segmented Control: Log In | Sign Up | Share Problem */}
        <div className="p-2 bg-slate-100 border-b border-slate-200 shrink-0">
          <div className="grid grid-cols-3 gap-1 bg-slate-200/80 p-1 rounded-2xl text-xs font-bold text-slate-600">
            {/* Tab 1: Log In */}
            <button
              type="button"
              onClick={() => handleModeSwitch('signin')}
              className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-white text-slate-950 font-black shadow-xs ring-1 ring-slate-900/5'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/50'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Log In</span>
            </button>

            {/* Tab 2: Sign Up */}
            <button
              type="button"
              onClick={() => handleModeSwitch('register')}
              className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white text-slate-950 font-black shadow-xs ring-1 ring-slate-900/5'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/50'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Sign Up</span>
            </button>

            {/* Tab 3: Share Problem */}
            <button
              type="button"
              onClick={() => handleModeSwitch('problem')}
              className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'problem'
                  ? 'bg-white text-slate-950 font-black shadow-xs ring-1 ring-slate-900/5'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Share Problem</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6 sm:p-7 space-y-4">
          
          {/* Mode Banner / Instructions */}
          {mode === 'register' && (
            <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200/80 text-slate-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-950">Create New Citizen Account</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  An official welcome email with your generated Forensic System ID number will be automatically sent to your Gmail.
                </p>
              </div>
            </div>
          )}

          {mode === 'signin' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs flex items-start gap-2.5">
              <LogIn className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-950">Welcome Back</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Log in with your Gmail and password to access your personal dashboard, active custody timeline, and forensic cases.
                </p>
              </div>
            </div>
          )}

          {mode === 'problem' && (
            <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200/80 text-slate-800 text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#FF5A1F]">Direct Cyber Incident Intake</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Submit your problem statement directly. An evidence tracking confirmation will be dispatched directly to your Gmail.
                </p>
              </div>
            </div>
          )}

          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email Success Banner */}
          {emailSuccessNote && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{emailSuccessNote}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* FULL NAME: Mandatory in Sign Up */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Full Legal Name <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-normal">Used on your personal dashboard</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            )}

            {mode === 'problem' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Your Full Name or Alias</span>
                  <span className="text-[10px] text-slate-400 font-normal">Will appear on your dashboard</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name (optional)"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            )}

            {/* GMAIL ADDRESS: MANDATORY IN ALL THREE CASES */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Gmail Address <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-[#FF5A1F] font-bold">Mandatory in all options</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Gmail address"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:bg-white transition-all font-medium"
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                All account welcome letters, evidence tracking IDs, and case resolution reports will be dispatched here.
              </p>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Password <span className="text-rose-500">*</span></span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD: Only in Sign Up */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            )}

            {/* CATEGORY & PROBLEM DESCRIPTION: Only in Share Problem */}
            {mode === 'problem' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Incident Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:bg-white transition-all font-medium text-slate-800"
                  >
                    <option value="Financial Cyber Fraud">Financial Cyber Fraud (UPI / APK / NetBanking)</option>
                    <option value="Impersonation & Digital Arrest">Impersonation & Digital Arrest Scam (CBI / Police fake calls)</option>
                    <option value="Extortion & Sextortion">Extortion & Video Blackmail</option>
                    <option value="Phishing & SIM Swap Attack">Phishing SMS & SIM Swap Attack</option>
                    <option value="Social Media Hijack & Identity Theft">Social Media Hijack & Identity Theft</option>
                    <option value="Ransomware & System Compromise">Ransomware & Device Compromise</option>
                    <option value="Other Cyber Crime">Other Cyber Crime Incident</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Describe Your Cyber Incident <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] font-mono-code text-[#FF5A1F] font-bold">WORM Hashed</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Describe what occurred (unauthorized transaction amount, fake official details, APK name, phone numbers or links)..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] focus:bg-white transition-all leading-relaxed font-medium"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all group"
              >
                <span>
                  {isSubmitting 
                    ? 'Processing & Dispatching Gmail SMTP...'
                    : (mode === 'problem' 
                        ? 'Submit Problem & Enter Dashboard' 
                        : (mode === 'register' 
                            ? 'Complete Sign Up & Dispatch Welcome Email' 
                            : 'Log In to Personal Dashboard'))}
                </span>
                <ArrowRight className="w-4 h-4 text-[#FF5A1F] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Switch Footer Navigation Links */}
            <div className="pt-2 text-center text-xs text-slate-500 space-y-1.5 border-t border-slate-100">
              {mode === 'signin' && (
                <div className="flex items-center justify-center gap-3">
                  <span>Don't have an account?</span>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('register')}
                    className="font-bold text-[#FF5A1F] hover:underline"
                  >
                    Sign Up
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('problem')}
                    className="font-bold text-slate-700 hover:text-slate-950 hover:underline"
                  >
                    Share Problem Directly
                  </button>
                </div>
              )}

              {mode === 'register' && (
                <div className="flex items-center justify-center gap-3">
                  <span>Already registered?</span>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('signin')}
                    className="font-bold text-[#FF5A1F] hover:underline"
                  >
                    Log In
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('problem')}
                    className="font-bold text-slate-700 hover:text-slate-950 hover:underline"
                  >
                    Share Problem Directly
                  </button>
                </div>
              )}

              {mode === 'problem' && (
                <div className="flex items-center justify-center gap-3">
                  <span>Prefer regular access?</span>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('signin')}
                    className="font-bold text-[#FF5A1F] hover:underline"
                  >
                    Log In
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('register')}
                    className="font-bold text-slate-700 hover:text-slate-950 hover:underline"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Currently Logged In Account Display */}
            {currentUser.email && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="truncate">
                  <span>Signed in as: <strong>{currentUser.name || currentUser.email}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateUser({ name: '', email: '', role: 'citizen', isAnonymous: true });
                    onClose();
                  }}
                  className="text-rose-600 hover:text-rose-700 font-bold hover:underline shrink-0 ml-2"
                >
                  Sign Out
                </button>
              </div>
            )}

          </form>

        </div>

      </div>
    </div>
  );
};
