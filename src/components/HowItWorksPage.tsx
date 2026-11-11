import React, { useState, useEffect } from 'react';
import { computeSHA256 } from '../utils/crypto';
import { 
  Lock, 
  Hash, 
  ShieldCheck, 
  Scale, 
  AlertOctagon, 
  CheckCircle2, 
  RefreshCw, 
  FileText, 
  ArrowRight,
  Database,
  Layers,
  Copy
} from 'lucide-react';

export const HowItWorksPage: React.FC<{ onOpenReportDrawer: () => void }> = ({ onOpenReportDrawer }) => {
  const [inputText, setInputText] = useState('Payment of ₹1,48,500 transferred to suspect account 5010049281920 at 14:22 UTC');
  const [originalHash, setOriginalHash] = useState('');
  const [tamperedText, setTamperedText] = useState('');
  const [tamperedHash, setTamperedHash] = useState('');
  const [auditStatus, setAuditStatus] = useState<'idle' | 'matching' | 'mismatch'>('idle');
  const [copied, setCopied] = useState(false);

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
    // Deliberately alter just one single character
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
      desc: 'The victim uploads screenshots, call recordings, emails, or bank slips. The client browser immediately reads the raw byte stream into memory.',
      icon: FileText
    },
    {
      step: '02',
      title: 'SHA-256 Cryptographic Hashing',
      desc: 'Using the NIST FIPS 180-4 standard, an irreversible 256-bit hexadecimal digest is computed. The hash is unique to the exact file bits.',
      icon: Hash
    },
    {
      step: '03',
      title: 'WORM Ledger Commitment',
      desc: 'The hash is anchored under Write Once Read Many (WORM) rules with RFC-3161 timestamps. No database update or delete operation can modify this entry.',
      icon: Database
    },
    {
      step: '04',
      title: 'Senior Investigator Verification',
      desc: 'An accredited forensic officer independently hashes the raw uploaded evidence and compares it to the original WORM ledger entry.',
      icon: ShieldCheck
    },
    {
      step: '05',
      title: 'Judicial Section 65B Certificate',
      desc: 'A court-admissible certificate of electronic evidence is issued. The evidence is immune to defense claims of tampering, leading to lawful resolution.',
      icon: Scale
    }
  ];

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
            The Cryptographic Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950">
            How Our Forensic Engine Works
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            In cyber disputes, the opposing party almost always argues that electronic screenshots or logs were fabricated or altered. 
            Here is how ForensiCrypt establishes mathematical immutability that satisfies high court standards.
          </p>
        </div>

        {/* 5-Step Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-20">
          {lifecycleStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between relative group hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono-code font-bold text-rose-600">
                      Step {stage.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {stage.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[10px] text-slate-400 font-mono-code">
                  RFC 3161 Compliant
                </div>
              </div>
            );
          })}
        </div>

        {/* ---------------- INTERACTIVE CRYPTOGRAPHIC TAMPER EXPERIMENT ---------------- */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 text-white shadow-2xl border border-slate-800 mb-16">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono-code uppercase tracking-wider text-rose-400 font-semibold">
              Live Browser Cryptographic Sandbox
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              Experience the "Avalanche Effect" in Real Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              In SHA-256, changing even a single byte (like altering a number or adding a space) creates a drastically different 64-character hex signature. If a suspect or bad actor modifies a single pixel of your evidence, the hash mismatch is instantly exposed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Box 1: Original Citizen Evidence */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-rose-300">Original Citizen Evidence</span>
                  <span className="text-[11px] font-mono-code text-emerald-400">Locked in WORM Ledger</span>
                </div>
                
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-black/60 border border-slate-700 text-xs text-slate-200 font-mono-code focus:outline-none focus:ring-1 focus:ring-rose-500 mb-4"
                  placeholder="Type any incident text or transaction proof..."
                />

                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">
                  Original SHA-256 Digest:
                </div>
                <div className="p-3 rounded-xl bg-black/80 border border-rose-500/30 text-rose-200 font-mono-code text-xs break-all leading-relaxed relative group">
                  {originalHash}
                  <button
                    onClick={() => copyHash(originalHash)}
                    className="absolute top-2 right-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 opacity-80 group-hover:opacity-100"
                    title="Copy Hash"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Calculated via WebCrypto API</span>
                {copied && <span className="text-emerald-400 font-semibold">Copied!</span>}
              </div>
            </div>

            {/* Box 2: Verification / Suspect Payload */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-amber-300">Audited Evidence Payload</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSimulateTamper}
                      className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 text-[10px] font-semibold transition-colors"
                    >
                      Alter 1 Byte
                    </button>
                    <button
                      onClick={handleResetToMatch}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition-colors"
                    >
                      Reset Match
                    </button>
                  </div>
                </div>

                <textarea
                  value={tamperedText}
                  onChange={(e) => handleTamperTextChange(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-black/60 border border-slate-700 text-xs text-slate-200 font-mono-code focus:outline-none focus:ring-1 focus:ring-amber-500 mb-4"
                  placeholder="Modify a single character here to see the avalanche effect..."
                />

                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">
                  Audited SHA-256 Digest:
                </div>
                <div className={`p-3 rounded-xl bg-black/80 border font-mono-code text-xs break-all leading-relaxed ${
                  originalHash === tamperedHash 
                    ? 'border-emerald-500/50 text-emerald-300' 
                    : 'border-rose-500 text-rose-300 animate-pulse'
                }`}>
                  {tamperedHash}
                </div>
              </div>

              {/* Status Banner */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                {originalHash === tamperedHash ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>VERIFICATION PASSED: Perfect Bit-for-Bit Hash Match (Chain of Custody Intact)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold">
                    <AlertOctagon className="w-4 h-4 shrink-0" />
                    <span>TAMPERING DETECTED: Hashes do not match! Evidence rejected by senior examiner.</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ---------------- WORM EXPLANATION ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm mb-16">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
              Legal & Technical Principles
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
              Why Write-Once-Read-Many (WORM) Matters in Court
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Under standard relational databases, anyone with administrator database credentials can execute an <code className="font-mono-code text-rose-600 bg-rose-50 px-1 py-0.5 rounded">UPDATE</code> or <code className="font-mono-code text-rose-600 bg-rose-50 px-1 py-0.5 rounded">DELETE</code> SQL command. Defense attorneys exploit this to claim police or the victim doctored the logs.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              With ForensiCrypt WORM architecture, evidence digests are cryptographically appended to an append-only ledger. Once written, the underlying bytes cannot be superseded, generating an unassailable audit trail.
            </p>
            <button
              onClick={onOpenReportDrawer}
              className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-full text-xs font-bold tracking-wide transition-all shadow-md active:scale-98"
            >
              Protect My Incident Now
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 font-mono-code text-xs text-slate-700 space-y-3">
            <div className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
              Chain of Custody Invariants
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
              <div className="text-emerald-700 font-semibold">1. Zero Mutability Guarantee</div>
              <div className="text-slate-500 text-[11px]">Append-only storage; no overwrite permissions exist.</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
              <div className="text-emerald-700 font-semibold">2. RFC 3161 Sovereign Timestamp</div>
              <div className="text-slate-500 text-[11px]">Proves existence before legal proceedings began.</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
              <div className="text-emerald-700 font-semibold">3. Senior Officer Digital Signature</div>
              <div className="text-slate-500 text-[11px]">Certified by accredited forensic examiner.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
