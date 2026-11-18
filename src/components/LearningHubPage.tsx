import React, { useState } from 'react';
import {
  SAFE_WEBSITE_CHECKLIST,
  CYBERCRIME_TAXONOMY,
  CITIZEN_RECOVERY_PROTOCOL,
} from '../data/awareness';
import {
  AlertTriangle,
  Search,
  CheckCircle,
  XCircle,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';
import { StaggeredGrid } from './effects/StaggeredGrid';
import { ScrollExpandBlock } from './effects/ScrollExpandBlock';
import { PageStudioHeader } from './effects/PageStudioHeader';
import { KineticMarquee } from './effects/KineticMarquee';
import { MagneticButton } from './effects/MagneticButton';

export const LearningHubPage: React.FC<{ onOpenReportDrawer: () => void }> = ({
  onOpenReportDrawer,
}) => {
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

    if (
      lower.includes('.apk') ||
      lower.includes('download') ||
      lower.includes('.xyz') ||
      lower.includes('.top') ||
      lower.includes('.club')
    ) {
      flags.push(
        'Uses high-risk unverified Top-Level Domain or prompts direct executable/APK download.'
      );
      status = 'danger';
    }

    if (
      (lower.includes('sbi') ||
        lower.includes('hdfc') ||
        lower.includes('icici') ||
        lower.includes('police') ||
        lower.includes('cyber')) &&
      !lower.endsWith('.gov.in') &&
      !lower.endsWith('.nic.in') &&
      !lower.includes('.sbi') &&
      !lower.includes('hdfcbank.com') &&
      !lower.includes('icicibank.com')
    ) {
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
        domain: parsed.hostname,
      });
    } catch {
      setInspectionResult({
        status: 'danger',
        flags: [
          'Invalid URL format. Be cautious of malformed hyperlinks sent via SMS or messaging apps.',
        ],
        domain: testUrl,
      });
    }
  };

  return (
    <div className="w-full bg-[#F5F5F7] text-[#0D0D10] min-h-screen font-sans">
      <PageStudioHeader
        kicker="Citizen Cyber Defense & Awareness"
        title="Awareness Hub. Threat literacy."
        subtitle="Audit suspicious SMS links in real time, dissect prevalent fraud vectors, and follow the Golden 120-Minute recovery playbook."
        ctaLabel="Lock Suspect Evidence"
        onCtaClick={onOpenReportDrawer}
        showOrb
      >
        {/* Clean Editorial Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {[
            { id: 'website', label: '01. Live URL Safety Inspector' },
            { id: 'crimes', label: '02. Cybercrime Taxonomy' },
            { id: 'recovery', label: '03. Golden 120m Protocol' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                activeSection === tab.id
                  ? 'bg-[#0D0D10] text-white shadow-sm'
                  : 'bg-white text-zinc-600 border border-black/10 hover:text-[#0D0D10]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </PageStudioHeader>

      <KineticMarquee
        theme="light"
        variant="band"
        items={[
          'DOMAIN INSPECTION',
          'ZERO-TRUST HYGIENE',
          '1930 INTERDICTION',
          'SECTION 65B COMPLIANCE',
        ]}
      />

      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-black/10">
        <ScrollExpandBlock minScale={0.95} className="w-full">
          {activeSection === 'website' && (
            <div className="space-y-14">
              {/* Matte Obsidian Spotlight Inspector Panel */}
              <div className="p-8 sm:p-12 rounded-3xl bg-[#0D0D10] text-white shadow-2xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#FF4D15]/15 text-[#FF4D15] flex items-center justify-center border border-[#FF4D15]/30">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono-code uppercase text-[#FF4D15] font-bold">
                        Real-Time Heuristic Scanner
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                        Live Website &amp; Link Safety Inspector
                      </h2>
                    </div>
                  </div>
                  <span className="text-xs font-mono-code text-zinc-400">
                    TLS · TLD · TYPOSQUAT CHECK
                  </span>
                </div>

                <form onSubmit={handleInspectUrl} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                    placeholder="e.g. https://cybercrime.gov.in or https://sbi-kyc-verify.xyz"
                    className="flex-1 px-5 py-3.5 rounded-full border border-white/15 focus:outline-none focus:ring-2 focus:ring-[#FF4D15] text-sm font-mono-code bg-[#16161C] text-white placeholder-zinc-500"
                  />
                  <MagneticButton
                    type="submit"
                    className="px-8 py-3.5 bg-[#FF4D15] hover:bg-[#E03E0B] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
                  >
                    Inspect Domain
                  </MagneticButton>
                </form>

                {inspectionResult && (
                  <div
                    className={`p-6 rounded-2xl border ${
                      inspectionResult.status === 'safe'
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                        : 'bg-[#FF4D15]/12 border-[#FF4D15]/50 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm mb-2">
                      {inspectionResult.status === 'safe' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-[#FF4D15]" />
                      )}
                      <span>
                        {inspectionResult.status === 'safe'
                          ? 'Domain Appears Consistent with Security Standards'
                          : 'Caution: Potential Malicious or Suspicious Domain Detected'}
                      </span>
                    </div>
                    <div className="text-xs font-mono-code mb-3 opacity-80">
                      Target Hostname: {inspectionResult.domain}
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      {inspectionResult.flags.map((flag, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-bold text-[#FF4D15]">·</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Educational Checklist Studio Bento Grid */}
              <StaggeredGrid staggerMs={90} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SAFE_WEBSITE_CHECKLIST.map((item, i) => (
                  <div
                    key={i}
                    className="p-7 rounded-3xl bg-[#F5F5F7] border border-black/10 hover:border-[#0D0D10] hover:bg-white transition-all flex flex-col justify-between h-full group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold font-mono-code text-[#FF4D15]">
                          RULE 0{i + 1}
                        </span>
                        <span className="text-[11px] font-mono-code text-zinc-500">
                          {item.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0D0D10] mb-2">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </StaggeredGrid>
            </div>
          )}

          {activeSection === 'crimes' && (
            <div className="space-y-10">
              <div className="p-7 rounded-3xl bg-[#0D0D10] text-white border border-white/10 text-xs sm:text-sm leading-relaxed">
                <strong className="text-[#FF4D15] uppercase font-mono-code mr-2">
                  Investigator Note:
                </strong>
                Modern cybercriminals leverage psychological urgency, impersonated authority, and coerced secrecy rather than complex zero-day exploits. Recognizing these patterns neutralizes 98% of social-engineering traps.
              </div>

              <StaggeredGrid staggerMs={90} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CYBERCRIME_TAXONOMY.map((crime) => (
                  <div
                    key={crime.id}
                    className="p-7 rounded-3xl bg-[#F5F5F7] border border-black/10 hover:border-[#0D0D10] hover:bg-white transition-all flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#FF4D15]">
                          Modus Operandi
                        </span>
                        <span className="text-[11px] font-mono-code font-bold text-zinc-600">
                          {crime.dangerLevel} Threat
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#0D0D10] mb-1">{crime.title}</h3>
                      <div className="text-xs font-medium text-zinc-500 mb-3 italic">
                        {crime.subtitle}
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed mb-6">
                        {crime.description}
                      </p>

                      <div className="space-y-4 pt-4 border-t border-black/10 text-xs">
                        <div>
                          <div className="font-bold text-emerald-700 flex items-center gap-1.5 mb-1.5">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>What You MUST Do:</span>
                          </div>
                          <ul className="space-y-1 text-zinc-600 pl-4 list-disc">
                            {crime.dos.map((d, idx) => (
                              <li key={idx}>{d}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="font-bold text-[#FF4D15] flex items-center gap-1.5 mb-1.5">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>What You MUST NOT Do:</span>
                          </div>
                          <ul className="space-y-1 text-zinc-600 pl-4 list-disc">
                            {crime.donts.map((d, idx) => (
                              <li key={idx}>{d}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-black/10">
                      <button
                        onClick={onOpenReportDrawer}
                        className="text-xs font-bold text-[#0D0D10] hover:text-[#FF4D15] inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Preserve Evidence For This Crime</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </StaggeredGrid>
            </div>
          )}

          {activeSection === 'recovery' && (
            <div className="space-y-10">
              <div
                className="p-8 sm:p-12 rounded-3xl text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6"
                style={{
                  background: 'linear-gradient(125deg, #0D0D10 0%, #310D04 58%, #FF4D15 125%)',
                }}
              >
                <div className="space-y-2 text-center sm:text-left">
                  <div className="text-xs font-mono-code font-bold text-[#FF4D15] uppercase tracking-wider">
                    Critical Response Window
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-bold">The Golden 120 Minutes</h3>
                  <p className="text-xs sm:text-sm text-zinc-200 max-w-xl">
                    If funds have exited your account, dial <strong>1930</strong> immediately. National interdiction alerts nodal officers at the beneficiary bank to freeze mule accounts before cash-out.
                  </p>
                </div>
                <a
                  href="tel:1930"
                  className="px-7 py-4 bg-white hover:bg-zinc-100 rounded-full font-bold text-xs uppercase tracking-wider text-[#0D0D10] shadow-lg flex items-center gap-2 whitespace-nowrap"
                >
                  <PhoneCall className="w-4 h-4 text-[#FF4D15]" />
                  <span>Call 1930 Helpline</span>
                </a>
              </div>

              <StaggeredGrid staggerMs={80} className="space-y-4">
                {CITIZEN_RECOVERY_PROTOCOL.map((step) => (
                  <div
                    key={step.step}
                    className="p-7 rounded-3xl bg-[#F5F5F7] border border-black/10 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#0D0D10] text-[#FF4D15] flex items-center justify-center font-mono-code font-bold text-lg shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <div className="text-[11px] font-mono-code font-bold text-[#FF4D15] mb-1">
                          {step.timeframe}
                        </div>
                        <h4 className="text-lg font-bold text-[#0D0D10] mb-1">{step.title}</h4>
                        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-2xl">
                          {step.instruction}
                        </p>
                      </div>
                    </div>

                    {step.step === '03' && (
                      <button
                        onClick={onOpenReportDrawer}
                        className="px-6 py-3 bg-[#0D0D10] hover:bg-[#FF4D15] text-white rounded-full text-xs font-bold whitespace-nowrap shrink-0 self-start md:self-center transition-colors"
                      >
                        Open Hash Lock Vault
                      </button>
                    )}
                  </div>
                ))}
              </StaggeredGrid>
            </div>
          )}
        </ScrollExpandBlock>
      </section>
    </div>
  );
};
