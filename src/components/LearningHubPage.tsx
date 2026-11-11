import React, { useState } from 'react';
import { SAFE_WEBSITE_CHECKLIST, CYBERCRIME_TAXONOMY, CITIZEN_RECOVERY_PROTOCOL } from '../data/awareness';
import { 
  ShieldCheck, 
  AlertTriangle, 
  LifeBuoy, 
  Search, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Lock, 
  Globe, 
  PhoneCall, 
  ArrowRight,
  HelpCircle,
  FileText
} from 'lucide-react';

export const LearningHubPage: React.FC<{ onOpenReportDrawer: () => void }> = ({ onOpenReportDrawer }) => {
  const [activeSection, setActiveSection] = useState<'website' | 'crimes' | 'recovery'>('website');
  const [testUrl, setTestUrl] = useState('');
  const [inspectionResult, setInspectionResult] = useState<{
    status: 'safe' | 'suspicious' | 'danger';
    flags: string[];
    domain: string;
  } | null>(null);

  const handleInspectUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testUrl.trim()) return;

    const lower = testUrl.toLowerCase().trim();
    const flags: string[] = [];
    let status: 'safe' | 'suspicious' | 'danger' = 'safe';

    if (!lower.startsWith('https://')) {
      flags.push('Missing HTTPS TLS certificate encryption.');
      status = 'danger';
    }

    if (lower.includes('.apk') || lower.includes('download') || lower.includes('.xyz') || lower.includes('.top') || lower.includes('.club')) {
      flags.push('Uses high-risk unverified Top-Level Domain or prompts direct executable/APK download.');
      status = 'danger';
    }

    if ((lower.includes('sbi') || lower.includes('hdfc') || lower.includes('icici') || lower.includes('police') || lower.includes('cyber')) && 
        !lower.endsWith('.gov.in') && !lower.endsWith('.nic.in') && !lower.includes('.sbi') && !lower.includes('hdfcbank.com') && !lower.includes('icicibank.com')) {
      flags.push('Potential brand / agency impersonation (Typosquatting detected).');
      status = 'danger';
    }

    if (flags.length === 0) {
      if (lower.endsWith('.gov.in') || lower.endsWith('.gov') || lower.endsWith('.nic.in')) {
        flags.push('Verified genuine sovereign government top-level domain.');
      } else {
        flags.push('Standard HTTPS protocol detected. Always double-check sender authenticity.');
      }
    }

    try {
      const parsed = new URL(testUrl.startsWith('http') ? testUrl : `https://${testUrl}`);
      setInspectionResult({
        status,
        flags,
        domain: parsed.hostname
      });
    } catch {
      setInspectionResult({
        status: 'danger',
        flags: ['Invalid URL format. Be cautious of malformed hyperlinks sent via SMS or messaging apps.'],
        domain: testUrl
      });
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
            Cyber Awareness & Digital Forensics Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950">
            Citizen Cyber Literacy & Defense
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Understand how authentic websites are structured, recognize modern cybercrime vectors before falling prey, and follow the exact protocol to recover safely if compromised.
          </p>

          {/* Interactive Mode Navigation */}
          <div className="mt-8 inline-flex items-center p-1.5 bg-slate-200/70 rounded-full text-xs font-medium text-slate-600">
            <button
              onClick={() => setActiveSection('website')}
              className={`px-5 py-2 rounded-full transition-all ${
                activeSection === 'website'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              1. How a Website Should Be
            </button>
            <button
              onClick={() => setActiveSection('crimes')}
              className={`px-5 py-2 rounded-full transition-all ${
                activeSection === 'crimes'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              2. How Cybercrimes Occur
            </button>
            <button
              onClick={() => setActiveSection('recovery')}
              className={`px-5 py-2 rounded-full transition-all ${
                activeSection === 'recovery'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              3. How to Come Out of It
            </button>
          </div>
        </div>

        {/* ---------------- PART 1: HOW A WEBSITE SHOULD BE ---------------- */}
        {activeSection === 'website' && (
          <div className="space-y-10">
            
            {/* Interactive URL Inspector Sandbox */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Live Website & Link Safety Inspector
                  </h3>
                  <p className="text-xs text-slate-500">
                    Received an SMS or WhatsApp link? Test the domain syntax for phishing flags before clicking.
                  </p>
                </div>
              </div>

              <form onSubmit={handleInspectUrl} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="e.g. https://cybercrime.gov.in or https://sbi-kyc-verify.xyz"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-mono-code bg-slate-50/50"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wide transition-colors whitespace-nowrap"
                >
                  Inspect Domain
                </button>
              </form>

              {inspectionResult && (
                <div className={`mt-6 p-5 rounded-2xl border ${
                  inspectionResult.status === 'safe'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50/80 border-rose-200 text-rose-950'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-sm mb-2">
                    {inspectionResult.status === 'safe' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                    )}
                    <span>
                      {inspectionResult.status === 'safe'
                        ? 'Domain Appears Consistent with Security Standards'
                        : 'Caution: Potential Malicious or Suspicious Domain!'}
                    </span>
                  </div>
                  <div className="text-xs font-mono-code mb-3 opacity-80">
                    Target Hostname: {inspectionResult.domain}
                  </div>
                  <ul className="space-y-1.5 text-xs">
                    {inspectionResult.flags.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-bold">·</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Educational Checklist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SAFE_WEBSITE_CHECKLIST.map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold font-mono-code text-rose-600">
                        Rule 0{i + 1}
                      </span>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ---------------- PART 2: HOW CYBERCRIMES OCCUR ---------------- */}
        {activeSection === 'crimes' && (
          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed">
              <strong>Forensic Investigator Note:</strong> Modern cybercriminals leverage psychological panic, authority coercion, or greed rather than complex zero-day exploits. Recognizing these patterns neutralizes 98% of attacks.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CYBERCRIME_TAXONOMY.map((crime) => (
                <div key={crime.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                        Modus Operandi
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        crime.dangerLevel === 'Critical' 
                          ? 'bg-rose-100 text-rose-700' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {crime.dangerLevel} Threat
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-950 mb-1">
                      {crime.title}
                    </h3>
                    <div className="text-xs font-medium text-slate-500 mb-3 italic">
                      {crime.subtitle}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {crime.description}
                    </p>

                    {/* Dos and Don'ts */}
                    <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
                      <div>
                        <div className="font-bold text-emerald-700 flex items-center gap-1.5 mb-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>What You MUST Do:</span>
                        </div>
                        <ul className="space-y-1 text-slate-600 pl-4 list-disc">
                          {crime.dos.map((d, idx) => <li key={idx}>{d}</li>)}
                        </ul>
                      </div>

                      <div>
                        <div className="font-bold text-rose-700 flex items-center gap-1.5 mb-1.5">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>What You MUST NOT Do:</span>
                        </div>
                        <ul className="space-y-1 text-slate-600 pl-4 list-disc">
                          {crime.donts.map((d, idx) => <li key={idx}>{d}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={onOpenReportDrawer}
                      className="text-xs font-bold text-slate-900 hover:text-rose-600 flex items-center gap-1.5"
                    >
                      <span>Preserve Evidence For This Crime</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- PART 3: HOW TO COME OUT OF IT ---------------- */}
        {activeSection === 'recovery' && (
          <div className="space-y-10">
            {/* Golden Hour Banner */}
            <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="text-xs font-mono-code font-bold text-rose-400 uppercase tracking-wider">
                  Critical Response Window
                </div>
                <h3 className="text-2xl font-bold">The Golden 120 Minutes</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  If money has left your account, dial <strong>1930</strong> immediately. The Citizen Financial Cyber Fraud Reporting System alerts the nodal manager at the beneficiary bank to freeze transit accounts before cash out.
                </p>
              </div>
              <a
                href="tel:1930"
                className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 rounded-full font-bold text-xs uppercase tracking-wider text-white shadow-lg flex items-center gap-2 whitespace-nowrap active:scale-95 transition-transform"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 1930 Helpline</span>
              </a>
            </div>

            {/* 5-Step Protocol List */}
            <div className="space-y-4">
              {CITIZEN_RECOVERY_PROTOCOL.map((step) => (
                <div
                  key={step.step}
                  className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono-code font-bold text-slate-900 text-lg shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <div className="text-[11px] font-mono-code font-semibold text-rose-600 mb-0.5">
                        {step.timeframe}
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">
                        {step.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                        {step.instruction}
                      </p>
                    </div>
                  </div>

                  {step.step === '03' && (
                    <button
                      onClick={onOpenReportDrawer}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 self-start md:self-center"
                    >
                      Open Hash Lock Vault
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
