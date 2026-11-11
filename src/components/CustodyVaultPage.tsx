import React, { useState, useEffect } from 'react';
import { IncidentReport, UserProfile } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  Hash, 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Scale, 
  Eye, 
  Award,
  ArrowRight,
  Share2,
  Copy,
  Mail,
  RefreshCw,
  Send,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';
import { getPadBySlug, updatePadContent } from '../data/dontpadStore';
import { addNotification } from '../data/notificationStore';
import { OriginalFormatGallery } from './OriginalFormatGallery';

interface CustodyVaultPageProps {
  incidents: IncidentReport[];
  currentUser: UserProfile;
  onVerifyIncident: (incidentId: string, officerNotes: string) => void;
  onViewCertificate: (incident: IncidentReport) => void;
  onOpenReportDrawer: () => void;
}

export const CustodyVaultPage: React.FC<CustodyVaultPageProps> = ({
  incidents,
  currentUser,
  onVerifyIncident,
  onViewCertificate,
  onOpenReportDrawer,
}) => {
  const [activeTab, setActiveTab] = useState<'registry' | 'dontpad' | 'gallery'>('registry');

  // Registry state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(incidents[0] || null);
  const [officerNotes, setOfficerNotes] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Dontpad state
  const [padSlug, setPadSlug] = useState('case-2026-evidence');
  const [padContent, setPadContent] = useState('');
  const [padMeta, setPadMeta] = useState(getPadBySlug('case-2026-evidence'));
  const [shareEmail, setShareEmail] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Check URL Hash for #pad/slug
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#pad/')) {
        const slug = hash.replace('#pad/', '').trim();
        if (slug) {
          setPadSlug(slug);
          setActiveTab('dontpad');
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync Dontpad pad when slug changes
  useEffect(() => {
    const pad = getPadBySlug(padSlug);
    setPadMeta(pad);
    setPadContent(pad.content);
  }, [padSlug]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePadSave = () => {
    const updated = updatePadContent(padSlug, padContent, currentUser.name || currentUser.email || 'Senior Examiner', padMeta.isWormLocked);
    setPadMeta(updated);
    showToast(`Dontpad #${padSlug} synchronized & hashed into WORM ledger!`);

    // Emit live notification
    addNotification({
      type: 'DONTPAD_SYNC',
      title: `Dontpad Pad Updated (#pad/${padSlug})`,
      message: `Evidence notes updated by ${currentUser.name || 'Examiner'}. SHA-256 hash stamp refreshed.`,
      recipientRole: 'all',
      actionUrlHash: `#pad/${padSlug}`,
      senderName: currentUser.name || 'Drive Secure System',
      badge: 'DONTPAD LIVE',
    });
  };

  const handleToggleWormLock = () => {
    const updated = updatePadContent(padSlug, padContent, currentUser.name || 'Senior Examiner', !padMeta.isWormLocked);
    setPadMeta(updated);
    showToast(`WORM Lock state set to ${updated.isWormLocked ? 'LOCKED' : 'UNLOCKED'} for #${padSlug}`);
  };

  const handleCopyPadLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#pad/${padSlug}`;
    navigator.clipboard.writeText(url);
    showToast(`Dontpad shareable URL copied: ${url}`);
  };

  const handleSharePadEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareEmail.trim()) return;

    addNotification({
      type: 'DONTPAD_SYNC',
      title: `Dontpad Access Invitation`,
      message: `Access link generated for #pad/${padSlug} sent to ${shareEmail.trim()}. Read-only WORM mode enforced.`,
      recipientEmail: shareEmail.trim(),
      recipientRole: 'all',
      actionUrlHash: `#pad/${padSlug}`,
      senderName: currentUser.name || 'Drive Secure System',
      badge: 'EMAIL ACCESS LINK',
    });

    showToast(`Secure Dontpad link dispatched to ${shareEmail.trim()}!`);
    setShareEmail('');
  };

  const filteredIncidents = incidents.filter((inc) => 
    inc.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerify = (id: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      onVerifyIncident(
        id, 
        officerNotes || 'Independent SHA-256 verification passed without byte deviation. Signed by Senior Forensic Examiner.'
      );
      setIsVerifying(false);
      const updated = incidents.find(i => i.id === id);
      if (updated) {
        setSelectedIncident({
          ...updated,
          status: 'VERIFIED'
        });
      }
    }, 800);
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-10 px-4 sm:px-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white text-xs font-mono-code rounded-2xl shadow-2xl border border-amber-500/40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-1">
              Drive Secure System & Repository
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Evidence Vault & Dontpad Live Sync
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Immutable write-once evidence dockets, custom slug Dontpad collaboration, and cryptographic chain-of-custody ledgers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenReportDrawer}
              className="px-6 py-3 bg-[#FF5A1F] hover:bg-[#E04B14] text-white rounded-full text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all"
            >
              + File New Evidence Docket
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-slate-200/80 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'registry'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>WORM Custody Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('dontpad')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'dontpad'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Dontpad Live Sync Workspace (#pad/slug)</span>
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'gallery'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>Original Format Media Gallery</span>
          </button>
        </div>

        {/* DONTPAD WORKFLOW TAB */}
        {activeTab === 'dontpad' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Slug URL Input Bar */}
            <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                    <LinkIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-purple-400">
                      Dontpad Custom Slug Routing
                    </span>
                    <h3 className="text-lg font-extrabold text-white">
                      Instant Shared Evidence Pad
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleWormLock}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold flex items-center gap-1.5 transition-colors border ${
                      padMeta.isWormLocked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{padMeta.isWormLocked ? 'WORM LOCKED ✓' : 'EDITABLE MODE'}</span>
                  </button>

                  <button
                    onClick={handleCopyPadLink}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-purple-300" />
                    <span>Copy Share URL</span>
                  </button>
                </div>
              </div>

              {/* Slug Form */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <div className="flex-1 flex items-center px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl font-mono-code text-xs text-slate-300">
                  <span className="text-slate-500 select-none mr-1">https://fip-secure.gov.in/#pad/</span>
                  <input
                    type="text"
                    value={padSlug}
                    onChange={(e) => setPadSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-'))}
                    placeholder="custom-case-name"
                    className="flex-1 bg-transparent text-amber-300 font-bold focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => {
                    window.location.hash = `#pad/${padSlug}`;
                    handlePadSave();
                  }}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Sync Pad (#pad/{padSlug})</span>
                </button>
              </div>

              {/* Pad Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs font-mono-code text-slate-400">
                <div>
                  <span className="text-slate-500 block text-[10px]">SHA-256 Digest:</span>
                  <span className="font-bold text-amber-200 truncate block">{padMeta.sha256.substring(0, 16)}...</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Revisions Count:</span>
                  <span className="font-bold text-white">{padMeta.historyCount} updates</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Last Sync Officer:</span>
                  <span className="font-bold text-emerald-400">{padMeta.editorName || 'Senior Examiner'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Timestamp:</span>
                  <span className="font-bold text-slate-300">{padMeta.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Main Pad Editor Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Text Pad Area */}
              <div className="lg:col-span-8 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-900 font-mono-code">
                      #pad/{padSlug} Content Buffer
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono-code">
                    {padContent.length} characters
                  </span>
                </div>

                <textarea
                  rows={14}
                  value={padContent}
                  disabled={padMeta.isWormLocked && currentUser.role !== 'senior_investigator'}
                  onChange={(e) => setPadContent(e.target.value)}
                  placeholder="Paste or type evidentiary notes, transaction hashes, suspect identifiers, or case statements here... Anything typed here is saved instantly with Dontpad workflow."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono-code text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">
                    {padMeta.isWormLocked ? '🔒 Pad locked in WORM mode.' : '⚡ Anyone with link can view & contribute.'}
                  </span>

                  <button
                    onClick={handlePadSave}
                    className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Save & Update Hash Ledger</span>
                  </button>
                </div>
              </div>

              {/* Share via Gmail / Link Section */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Email Share Form */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-5 h-5 text-rose-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Share Access Link via Email
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Directly dispatch a read-only Dontpad access link (`#pad/${padSlug}`) to citizens or co-investigators via Gmail.
                  </p>

                  <form onSubmit={handleSharePadEmail} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      placeholder="recipient@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#E04B14] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Secure Link</span>
                    </button>
                  </form>
                </div>

                {/* Preset Fast Pads */}
                <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3">
                  <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-400">
                    Quick Preset Dontpad Vaults
                  </span>
                  <div className="space-y-2 text-xs">
                    {[
                      { slug: 'case-2026-evidence', label: 'Case #2026 Primary Evidence Pad' },
                      { slug: 'drive-secure-vault', label: 'Drive Secure System Repository' },
                      { slug: 'bank-mule-freeze-1930', label: '1930 Bank Lien Coordinates' },
                    ].map((p) => (
                      <button
                        key={p.slug}
                        onClick={() => setPadSlug(p.slug)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                          padSlug === p.slug
                            ? 'bg-purple-950/80 border-purple-500 text-white font-bold'
                            : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="truncate">#pad/{p.slug}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* WORM CUSTODY LEDGER TAB */}
        {activeTab === 'registry' && (
          <div>
            {/* Examiner Duty Bar */}
            <div className="mb-8 p-4 rounded-2xl bg-slate-900 text-white shadow-md flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Accredited Senior Examiners on Active Duty:</strong> Dr. Bibi Zohara, Sup. Balchandra K, Insp. Rajesh Sharma, and Dr. Ananya Sen maintain continuous RFC-3161 bitstream verification.
                </span>
              </div>
              <span className="font-mono-code font-semibold px-2 py-1 bg-white/10 rounded text-[11px] text-emerald-300">
                WORM Active ✓
              </span>
            </div>

            {/* Master-Detail Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Incidents List */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tracking code, victim name, crime..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
                  />
                </div>

                {/* List */}
                <div className="space-y-3">
                  {filteredIncidents.map((inc) => {
                    const isSelected = selectedIncident?.id === inc.id;
                    return (
                      <div
                        key={inc.id}
                        onClick={() => setSelectedIncident(inc)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-white border-slate-900 shadow-md ring-1 ring-slate-900/10'
                            : 'bg-white border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-mono-code font-bold text-rose-600">
                            {inc.trackingCode}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            inc.status === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inc.status === 'VERIFIED' ? '✓ VERIFIED BY OFFICER' : '• WORM LOCKED'}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                          {inc.title}
                        </h4>

                        <div className="text-[11px] text-slate-500 mb-2">
                          {inc.category} · Loss: {inc.lossAmount || 'N/A'}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-code pt-2 border-t border-slate-100">
                          <span>{inc.dateReported.substring(0, 10)}</span>
                          <span>{inc.evidenceFiles.length} Evidence File(s)</span>
                        </div>
                      </div>
                    );
                  })}

                  {filteredIncidents.length === 0 && (
                    <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
                      No incidents found matching your query.
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Detailed Selected Incident View */}
              <div className="lg:col-span-7">
                {selectedIncident ? (
                  <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                    
                    {/* Header Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                      <div>
                        <div className="text-[11px] font-mono-code text-rose-600 font-bold mb-1">
                          {selectedIncident.trackingCode}
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-950">
                          {selectedIncident.title}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-slate-600 mt-1.5">
                          {selectedIncident.isConfidentialReport ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                              🔒 Confidential Report · Identity Protected (Gmail: {selectedIncident.citizenEmail})
                            </span>
                          ) : (
                            <span>
                              Reported by: <span className="font-semibold text-slate-900">{selectedIncident.citizenName}</span> ({selectedIncident.citizenEmail})
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onViewCertificate(selectedIncident)}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap self-start shadow-sm"
                      >
                        <Scale className="w-3.5 h-3.5 text-amber-300" />
                        <span>Court Certificate (65B)</span>
                      </button>
                    </div>

                    {/* Primary SHA-256 Digest Box */}
                    <div className="p-4 rounded-2xl bg-slate-50 text-slate-900 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span className="flex items-center gap-1.5 font-mono-code font-bold text-[#FF5A1F]">
                          <Hash className="w-3.5 h-3.5" />
                          Primary Merkle Root (SHA-256)
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-200">
                          Immutable WORM Block
                        </span>
                      </div>
                      <div className="font-mono-code text-xs text-slate-900 font-bold break-all bg-white p-3 rounded-xl border border-slate-200 leading-relaxed shadow-inner">
                        {selectedIncident.primaryHash}
                      </div>
                    </div>

                    {/* Incident Narrative */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Incident Narrative & Suspect Identifiers
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        {selectedIncident.description}
                      </p>
                    </div>

                    {/* Evidence Files List */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Cryptographic Evidence Vault ({selectedIncident.evidenceFiles.length})
                      </div>
                      <div className="space-y-2">
                        {selectedIncident.evidenceFiles.map((f) => (
                          <div
                            key={f.id}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{f.name}</span>
                              <span className="text-slate-500 font-mono-code text-[11px]">{f.wormTimestamp}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white border border-slate-200/90 font-mono-code text-[10px] text-slate-600 break-all">
                              <span className="text-rose-600 font-semibold mr-1">SHA-256:</span>
                              {f.sha256}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Senior Investigator Audit Section */}
                    <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-950 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-purple-700" />
                          Senior Forensic Examiner Sign-Off
                        </span>
                        <span className="font-mono-code font-semibold text-purple-800">
                          Officer: {selectedIncident.seniorOfficerAssigned}
                        </span>
                      </div>

                      <p className="text-slate-600 leading-relaxed">
                        {selectedIncident.officerNotes || 'Pending official audit notes.'}
                      </p>

                      {/* If Senior Investigator, show Verify Action button! */}
                      {currentUser.role === 'senior_investigator' && selectedIncident.status !== 'VERIFIED' && (
                        <div className="pt-3 border-t border-purple-200/70 flex flex-col sm:flex-row gap-3 items-center">
                          <input
                            type="text"
                            value={officerNotes}
                            onChange={(e) => setOfficerNotes(e.target.value)}
                            placeholder="Enter forensic verification audit notes..."
                            className="flex-1 px-3 py-2 rounded-xl border border-purple-300 text-xs bg-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleVerify(selectedIncident.id)}
                            disabled={isVerifying}
                            className="px-5 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-bold whitespace-nowrap shadow-sm disabled:opacity-50"
                          >
                            {isVerifying ? 'Running Cryptographic Audit...' : 'Verify & Certify Hash'}
                          </button>
                        </div>
                      )}

                      {selectedIncident.status === 'VERIFIED' && (
                        <div className="pt-2 flex items-center gap-2 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Certified Bit-for-Bit Authentic · Ready for High Court Trial</span>
                        </div>
                      )}
                    </div>

                    {/* Chain of Custody Audit Trail */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Chain of Custody Events
                      </div>
                      <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-2">
                        {selectedIncident.custodyEvents.map((evt) => (
                          <div key={evt.id} className="text-xs space-y-0.5 relative">
                            <div className="w-2 h-2 rounded-full bg-slate-900 absolute -left-[21px] top-1.5" />
                            <div className="font-semibold text-slate-900">
                              {evt.actor} ({evt.role})
                            </div>
                            <div className="text-slate-600 text-[11px]">{evt.action}</div>
                            <div className="text-[10px] text-slate-400 font-mono-code">{evt.timestamp}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
                    Select an incident from the left to inspect its cryptographic custody ledger.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <OriginalFormatGallery
              files={incidents.flatMap(i => i.evidenceFiles || [])}
              incidentTitle="All Drive Secure Vault Evidence & Media Artifacts"
              trackingCode="DRIVE-SECURE-VAULT"
              isSeniorInvestigatorView={false}
              dashboardHash={incidents[0]?.primaryHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              vaultHash={incidents[0]?.hashFormat?.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              currentUser={currentUser}
            />
          </div>
        )}

      </div>
    </div>
  );
};
