import React, { useState, useEffect } from 'react';
import { IncidentReport, UserProfile } from '../types';
import {
  ShieldCheck,
  Lock,
  Hash,
  FileText,
  Search,
  CheckCircle2,
  Scale,
  ArrowRight,
  Share2,
  Copy,
  Mail,
  RefreshCw,
  Send,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  AlertTriangle,
  BookOpen,
  Clock,
  Plus,
  X,
  Eye,
} from 'lucide-react';
import { getPadBySlug, updatePadContent } from '../data/dontpadStore';
import { addNotification } from '../data/notificationStore';
import {
  CommunityCrimeStory,
  getStoredCrimeStories,
  syncCrimeStoriesWithBackend,
  submitCrimeStoryForVerification,
} from '../data/crimeStoriesStore';
import { computeSHA256 } from '../utils/crypto';
import { OriginalFormatGallery } from './OriginalFormatGallery';
import { PageStudioHeader } from './effects/PageStudioHeader';
import { ScrollExpandBlock } from './effects/ScrollExpandBlock';
import { KineticMarquee } from './effects/KineticMarquee';
import { MagneticButton } from './effects/MagneticButton';

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
  const [activeTab, setActiveTab] = useState<'stories' | 'registry' | 'dontpad' | 'gallery'>('stories');

  // Community Crime Stories & PDF Verification State
  const [crimeStories, setCrimeStories] = useState<CommunityCrimeStory[]>(() =>
    getStoredCrimeStories()
  );
  const [storySearch, setStorySearch] = useState('');
  const [storyCategoryFilter, setStoryCategoryFilter] = useState('ALL');
  const [showAddStoryForm, setShowAddStoryForm] = useState(false);
  const [inspectingPdfStory, setInspectingPdfStory] = useState<CommunityCrimeStory | null>(null);

  // Add Crime Story Form Fields
  const [storyTitle, setStoryTitle] = useState('');
  const [storyCategory, setStoryCategory] = useState('Digital Arrest / Extortion');
  const [storyAuthorName, setStoryAuthorName] = useState(currentUser.name || '');
  const [storyLossAmount, setStoryLossAmount] = useState('');
  const [storyWhatHappened, setStoryWhatHappened] = useState('');
  const [storySafetyLesson, setStorySafetyLesson] = useState('');
  const [storyPdfName, setStoryPdfName] = useState('');
  const [storyPdfSize, setStoryPdfSize] = useState('');
  const [storyPdfHash, setStoryPdfHash] = useState('');
  const [storyPdfDataUrl, setStoryPdfDataUrl] = useState('');
  const [isHashingPdf, setIsHashingPdf] = useState(false);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);

  useEffect(() => {
    if (currentUser.name && !storyAuthorName) {
      setStoryAuthorName(currentUser.name);
    }
  }, [currentUser.name]);

  // Real-time sync for Crime Stories (Local CustomEvent + Backend SSE)
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

  const handlePdfFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsHashingPdf(true);
    try {
      const buffer = await file.arrayBuffer();
      const hash = await computeSHA256(buffer);
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string) || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });
      setStoryPdfName(file.name.endsWith('.pdf') ? file.name : `${file.name}.pdf`);
      setStoryPdfSize(`${Math.max(1, Math.round(file.size / 1024))} KB`);
      setStoryPdfHash(hash);
      setStoryPdfDataUrl(dataUrl);
      showToast(`PDF "${file.name}" hashed with SHA-256 & ready to post to Workstation!`);
    } catch (err) {
      console.error('PDF hash error:', err);
    } finally {
      setIsHashingPdf(false);
    }
  };

  const handleAttachSamplePdf = async () => {
    setIsHashingPdf(true);
    const sampleContent = `F.I.P VERIFICATION PDF DOCKET - CITIZEN CRIME REPORT - TIMESTAMP ${new Date().toISOString()} - REPORTER ${storyAuthorName || currentUser.name || 'Citizen'}`;
    const hash = await computeSHA256(sampleContent);
    setStoryPdfName(`1930_Cyber_Verification_Proof_${Math.floor(1000 + Math.random() * 9000)}.pdf`);
    setStoryPdfSize('640 KB');
    setStoryPdfHash(hash);
    setStoryPdfDataUrl('');
    setIsHashingPdf(false);
    showToast('Attached sample Verification PDF with cryptographic SHA-256 seal!');
  };

  const handlePostCrimeStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle.trim() || !storyWhatHappened.trim() || !storySafetyLesson.trim()) {
      showToast('Please fill in the crime title, what happened, and how others can stay safe.');
      return;
    }
    if (!storyPdfName || !storyPdfHash) {
      showToast('Please upload a Verification PDF (or click Attach Sample Verification PDF) before posting.');
      return;
    }

    setIsSubmittingStory(true);
    try {
      const created = await submitCrimeStoryForVerification({
        title: storyTitle.trim(),
        category: storyCategory,
        authorName: storyAuthorName.trim() || currentUser.name || 'Verified Citizen Reporter',
        authorEmail: currentUser.email || 'citizen@fip-vault.gov.in',
        lossAmount: storyLossAmount.trim() || 'Under Assessment',
        whatHappened: storyWhatHappened.trim(),
        howToStaySafeLesson: storySafetyLesson.trim(),
        pdfFileName: storyPdfName,
        pdfFileSize: storyPdfSize || '512 KB',
        pdfSha256: storyPdfHash,
        pdfDataUrl: storyPdfDataUrl,
      });

      setCrimeStories(getStoredCrimeStories());

      addNotification({
        type: 'EVIDENCE_UPLOAD',
        title: `New Crime Story PDF Queued for Workstation (${created.trackingCode})`,
        message: `${created.authorName} posted "${created.title}" with verification PDF (${created.pdfFileName}) for Senior Investigator Workstation approval.`,
        recipientRole: 'all',
        relatedTrackingCode: created.trackingCode,
        senderName: created.authorName,
        badge: 'PDF VERIFICATION QUEUED',
      });

      setStoryTitle('');
      setStoryLossAmount('');
      setStoryWhatHappened('');
      setStorySafetyLesson('');
      setStoryPdfName('');
      setStoryPdfSize('');
      setStoryPdfHash('');
      setStoryPdfDataUrl('');
      setShowAddStoryForm(false);
      showToast(
        `Crime Story & PDF (${created.trackingCode}) posted to Senior Investigator Workstation! Once approved, it will publish live.`
      );
    } finally {
      setIsSubmittingStory(false);
    }
  };

  // Registry state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(
    incidents?.[0] || null
  );
  const [officerNotes, setOfficerNotes] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Sync selectedIncident when incidents load or update asynchronously
  useEffect(() => {
    if (!incidents || incidents.length === 0) return;
    if (!selectedIncident) {
      setSelectedIncident(incidents[0]);
    } else {
      const updated = incidents.find(
        (i) => i.id === selectedIncident.id || i.trackingCode === selectedIncident.trackingCode
      );
      if (updated && updated !== selectedIncident) {
        setSelectedIncident(updated);
      }
    }
  }, [incidents]);

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
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handlePadSave = () => {
    const updated = updatePadContent(
      padSlug,
      padContent,
      currentUser.name || currentUser.email || 'Senior Examiner',
      padMeta.isWormLocked
    );
    setPadMeta(updated);
    showToast(`Dontpad #${padSlug} synchronized & hashed into WORM ledger!`);

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
    const updated = updatePadContent(
      padSlug,
      padContent,
      currentUser.name || 'Senior Examiner',
      !padMeta.isWormLocked
    );
    setPadMeta(updated);
    showToast(
      `WORM Lock state set to ${updated.isWormLocked ? 'LOCKED' : 'UNLOCKED'} for #${padSlug}`
    );
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

  const filteredIncidents = (incidents || []).filter(
    (inc) =>
      (inc.trackingCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.citizenName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const approvedStories = crimeStories.filter((s) => {
    if (s.status !== 'APPROVED_PUBLISHED') return false;
    const matchesCategory =
      storyCategoryFilter === 'ALL' ||
      s.category.toLowerCase().includes(storyCategoryFilter.toLowerCase());
    const q = storySearch.toLowerCase();
    const matchesQuery =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.whatHappened.toLowerCase().includes(q) ||
      s.howToStaySafeLesson.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.trackingCode.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const pendingStories = crimeStories.filter((s) => s.status === 'PENDING_WORKSTATION');

  const handleVerify = (id: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      onVerifyIncident(
        id,
        officerNotes ||
          'Independent SHA-256 verification passed without byte deviation. Signed by Senior Forensic Examiner.'
      );
      setIsVerifying(false);
      const updated = (incidents || []).find((i) => i.id === id);
      if (updated) {
        setSelectedIncident({
          ...updated,
          status: 'VERIFIED',
        });
      }
    }, 800);
  };

  const getApproverAvatar = (name?: string) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('krishi')) return '/assets/aistudio/image_526c1ede.png';
    if (lower.includes('balchandra')) return '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg';
    if (lower.includes('zohara')) return '/assets/aistudio/image_acc490cb.png';
    if (lower.includes('afsheen')) return '/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg';
    return '/assets/aistudio/image_526c1ede.png';
  };

  return (
    <div className="w-full bg-[#F5F5F7] text-[#0D0D10] min-h-screen font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 bg-[#0D0D10] text-white text-xs font-mono-code rounded-full shadow-2xl border border-[#FF4D15]/40 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-[#FF4D15]" />
          <span>{toastMsg}</span>
        </div>
      )}

      <PageStudioHeader
        kicker="Citizen Crime Stories & WORM Custody Vault"
        title="Crime Stories. Learn & Stay Safe."
        subtitle="Read verified citizen cybercrime experiences, or post your own crime story with a verification PDF. Once approved by a Senior Investigator in the Workstation, it publishes live to protect the community."
        ctaLabel="+ Share Your Crime Story (PDF)"
        onCtaClick={() => {
          setActiveTab('stories');
          setShowAddStoryForm(true);
        }}
        showOrb
      >
        {/* Clean Editorial View Switcher Tabs */}
        <div className="pt-4 border-t border-black/10 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'stories'
                ? 'bg-[#0D0D10] text-white shadow-sm'
                : 'bg-white text-zinc-600 border border-black/10 hover:text-[#0D0D10]'
            }`}
          >
            <BookOpen
              className={`w-4 h-4 ${activeTab === 'stories' ? 'text-[#FF4D15]' : 'text-zinc-500'}`}
            />
            <span>01. Verified Crime Stories ({approvedStories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('registry')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'registry'
                ? 'bg-[#0D0D10] text-white shadow-sm'
                : 'bg-white text-zinc-600 border border-black/10 hover:text-[#0D0D10]'
            }`}
          >
            <ShieldCheck
              className={`w-4 h-4 ${activeTab === 'registry' ? 'text-[#FF4D15]' : 'text-zinc-500'}`}
            />
            <span>02. WORM Custody Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('dontpad')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'dontpad'
                ? 'bg-[#0D0D10] text-white shadow-sm'
                : 'bg-white text-zinc-600 border border-black/10 hover:text-[#0D0D10]'
            }`}
          >
            <FileText
              className={`w-4 h-4 ${activeTab === 'dontpad' ? 'text-[#FF4D15]' : 'text-zinc-500'}`}
            />
            <span>03. Dontpad Live Sync (#pad/slug)</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[#0D0D10] text-white shadow-sm'
                : 'bg-white text-zinc-600 border border-black/10 hover:text-[#0D0D10]'
            }`}
          >
            <ImageIcon
              className={`w-4 h-4 ${activeTab === 'gallery' ? 'text-[#FF4D15]' : 'text-zinc-500'}`}
            />
            <span>04. Original Format Media Gallery</span>
          </button>
        </div>
      </PageStudioHeader>

      <KineticMarquee
        theme="light"
        variant="band"
        items={[
          'VERIFIED CRIME STORIES',
          'PDF WORKSTATION VERIFICATION',
          'LEARN WHAT HAPPENED & STAY SAFE',
          'REAL-TIME SENIOR INVESTIGATOR APPROVAL',
        ]}
      />

      <section className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-black/10">
        <ScrollExpandBlock minScale={0.95} className="w-full">
          {/* =====================================================================
              TAB 01: VERIFIED COMMUNITY CRIME STORIES & POST PDF FOR WORKSTATION
          ===================================================================== */}
          {activeTab === 'stories' && (
            <div className="space-y-10 animate-in fade-in duration-200">
              {/* Top Command Banner: How PDF Verification & Workstation Approval Works */}
              <div className="p-7 sm:p-9 rounded-3xl bg-[#0D0D10] text-white shadow-2xl border border-white/10 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D15]/15 border border-[#FF4D15]/40 text-[#FF4D15] text-[11px] font-mono-code font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Real-Time Workstation PDF Verification Pipeline</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      Share What Happened to You — Help Citizens Stay Safe
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Add your cybercrime experience along with a supporting <strong className="text-white">Verification PDF</strong> (1930 Acknowledgment, Bank Statement, or FIR Docket). When you click <strong className="text-[#FF4D15]">Post Crime &amp; PDF to Workstation</strong>, it routes directly to the <strong className="text-white">Senior Investigator Workstation</strong> in real time. Once a Senior Investigator verifies and approves your PDF, your story is published below so citizens can learn and stay safe.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      onClick={() => setShowAddStoryForm((prev) => !prev)}
                      className="px-6 py-3.5 rounded-full bg-[#FF4D15] hover:bg-[#E03E0B] text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      {showAddStoryForm ? (
                        <>
                          <X className="w-4 h-4" />
                          <span>Close Submission Form</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add Your Crime &amp; Post Verification PDF</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 3-Step Visual Pipeline Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 border-t border-white/10 text-xs">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#FF4D15] text-white font-mono-code font-bold flex items-center justify-center shrink-0">
                      01
                    </span>
                    <div>
                      <div className="font-bold text-white">Write Crime Story &amp; Attach PDF</div>
                      <p className="text-zinc-400 text-[11px] mt-0.5">
                        Describe what happened, how others can stay safe, and attach your PDF proof.
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-amber-500 text-black font-mono-code font-bold flex items-center justify-center shrink-0">
                      02
                    </span>
                    <div>
                      <div className="font-bold text-white">Senior Investigator Workstation Audit</div>
                      <p className="text-zinc-400 text-[11px] mt-0.5">
                        Your PDF and SHA-256 hash appear immediately in the Senior Investigator Workstation.
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-emerald-500 text-black font-mono-code font-bold flex items-center justify-center shrink-0">
                      03
                    </span>
                    <div>
                      <div className="font-bold text-white">Published for Public Awareness</div>
                      <p className="text-zinc-400 text-[11px] mt-0.5">
                        Once approved in the Workstation, it displays live here so everyone can learn and stay safe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Your Crime Story + Upload Verification PDF Form */}
              {showAddStoryForm && (
                <form
                  onSubmit={handlePostCrimeStory}
                  className="p-7 sm:p-9 rounded-3xl bg-[#F5F5F7] border-2 border-[#FF4D15] shadow-xl space-y-6 animate-in fade-in duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/10">
                    <div>
                      <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#FF4D15]">
                        Citizen Crime Story &amp; PDF Verification Submission
                      </span>
                      <h4 className="text-xl font-bold text-[#0D0D10]">
                        Post Your Crime Story for Senior Investigator Workstation Approval
                      </h4>
                    </div>
                    <span className="text-xs font-mono-code text-zinc-500">
                      SHA-256 WORM Sealed PDF
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0D0D10]">
                        Crime Story Headline *
                      </label>
                      <input
                        type="text"
                        required
                        value={storyTitle}
                        onChange={(e) => setStoryTitle(e.target.value)}
                        placeholder="e.g., Fake FedEx Customs Call & Skype Digital Arrest Transfer"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-black/15 text-xs text-[#0D0D10] focus:outline-none focus:ring-2 focus:ring-[#FF4D15]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0D0D10]">
                        Threat / Crime Category *
                      </label>
                      <select
                        value={storyCategory}
                        onChange={(e) => setStoryCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-black/15 text-xs text-[#0D0D10] focus:outline-none focus:ring-2 focus:ring-[#FF4D15]"
                      >
                        <option value="Digital Arrest / Extortion">Digital Arrest / Extortion</option>
                        <option value="Electricity / Bank APK Trojan">Electricity / Bank APK Trojan</option>
                        <option value="Telegram Task / Investment Fraud">Telegram Task / Investment Fraud</option>
                        <option value="UPI / Mule Account Phishing">UPI / Mule Account Phishing</option>
                        <option value="AI Voice Clone / Deepfake Scam">AI Voice Clone / Deepfake Scam</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0D0D10]">
                        Your Name (or Alias for Public Display)
                      </label>
                      <input
                        type="text"
                        value={storyAuthorName}
                        onChange={(e) => setStoryAuthorName(e.target.value)}
                        placeholder="e.g., Citizen R. Kulkarni (Pune) or Anonymous Citizen"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-black/15 text-xs text-[#0D0D10] focus:outline-none focus:ring-2 focus:ring-[#FF4D15]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0D0D10]">
                        Financial Impact / Recovery Status
                      </label>
                      <input
                        type="text"
                        value={storyLossAmount}
                        onChange={(e) => setStoryLossAmount(e.target.value)}
                        placeholder="e.g., ₹ 1,20,000 (Frozen via 1930 in 40 mins)"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-black/15 text-xs text-[#0D0D10] focus:outline-none focus:ring-2 focus:ring-[#FF4D15]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#0D0D10]">
                      What Happened? (Step-by-Step Crime Breakdown) *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={storyWhatHappened}
                      onChange={(e) => setStoryWhatHappened(e.target.value)}
                      placeholder="Explain how the scammers approached you, what tactics or fake documents they used, and how the incident unfolded..."
                      className="w-full p-4 rounded-2xl bg-white border border-black/15 text-xs text-[#0D0D10] focus:outline-none focus:ring-2 focus:ring-[#FF4D15] leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-800">
                      How Can Others Stay Safe &amp; Learn From This? (Safety Lesson) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={storySafetyLesson}
                      onChange={(e) => setStorySafetyLesson(e.target.value)}
                      placeholder="Share the key warning signs and safety rules so other citizens never fall for this crime..."
                      className="w-full p-4 rounded-2xl bg-emerald-50/70 border border-emerald-500/30 text-xs text-[#0D0D10] focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed"
                    />
                  </div>

                  {/* Verification PDF Upload Box */}
                  <div className="p-5 rounded-2xl bg-[#0D0D10] text-white space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-xs font-mono-code font-bold text-[#FF4D15] uppercase flex items-center gap-1.5">
                          <FileText className="w-4 h-4" />
                          <span>Attach Verification PDF for Workstation Audit *</span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Upload your incident PDF (1930 Receipt, Bank Debit Statement, or FIR PDF). It will be hashed with SHA-256 and sent to the Senior Investigator Workstation.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <label className="px-4 py-2.5 rounded-full bg-[#FF4D15] hover:bg-[#E03E0B] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isHashingPdf ? 'Computing SHA-256...' : 'Upload PDF File'}</span>
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handlePdfFileChange}
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={handleAttachSamplePdf}
                          className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Attach Sample Verification PDF
                        </button>
                      </div>
                    </div>

                    {storyPdfName && (
                      <div className="p-3.5 rounded-xl bg-white/5 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-code">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{storyPdfName}</span>
                          <span className="text-zinc-400">({storyPdfSize})</span>
                        </div>
                        <div className="text-[11px] text-zinc-300 truncate">
                          SHA-256: <span className="text-[#FF4D15]">{storyPdfHash.substring(0, 28)}...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddStoryForm(false)}
                      className="px-5 py-3 rounded-full bg-white border border-black/15 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingStory}
                      className="px-7 py-3.5 rounded-full bg-[#0D0D10] hover:bg-[#FF4D15] text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {isSubmittingStory
                          ? 'Posting to Workstation...'
                          : 'Post Crime & Verification PDF to Workstation →'}
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {/* Live Queue of Stories Pending Senior Investigator Workstation Approval */}
              {pendingStories.length > 0 && (
                <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/35 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                      <div>
                        <h4 className="text-sm font-bold text-[#0D0D10]">
                          Pending Senior Investigator Workstation Verification ({pendingStories.length})
                        </h4>
                        <p className="text-xs text-zinc-600">
                          These crime stories and their Verification PDFs have been routed to the Senior Investigator Workstation. Once a Senior Investigator logs in and approves them, they automatically publish to the public feed below in real time.
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 font-mono-code text-[11px] font-bold shrink-0">
                      LIVE WORKSTATION QUEUE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingStories.map((pStory) => (
                      <div
                        key={pStory.id}
                        className="p-4 rounded-2xl bg-white border border-amber-500/30 space-y-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono-code">
                          <span className="font-bold text-[#FF4D15]">{pStory.trackingCode}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                            Awaiting Workstation Approval
                          </span>
                        </div>
                        <div className="text-sm font-bold text-[#0D0D10]">{pStory.title}</div>
                        <div className="text-xs text-zinc-600 line-clamp-2">{pStory.whatHappened}</div>
                        <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-mono-code text-zinc-500">
                          <span>PDF: {pStory.pdfFileName}</span>
                          <span>By: {pStory.authorName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search & Category Filter for Verified Crime Stories */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={storySearch}
                    onChange={(e) => setStorySearch(e.target.value)}
                    placeholder="Search verified crime stories, scams, safety lessons..."
                    className="w-full pl-11 pr-4 py-3 bg-[#F5F5F7] border border-black/10 rounded-full text-xs text-[#0D0D10] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D15]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {[
                    'ALL',
                    'Digital Arrest',
                    'APK Trojan',
                    'Investment',
                    'UPI',
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setStoryCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        storyCategoryFilter === cat
                          ? 'bg-[#0D0D10] text-white'
                          : 'bg-[#F5F5F7] text-zinc-600 hover:text-[#0D0D10] border border-black/10'
                      }`}
                    >
                      {cat === 'ALL' ? 'All Verified Stories' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified & Approved Public Crime Stories Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                {approvedStories.map((story) => (
                  <article
                    key={story.id}
                    className="rounded-3xl bg-[#F5F5F7] border border-black/10 hover:border-black/25 transition-all p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm"
                  >
                    <div className="space-y-4">
                      {/* Top Verified Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-black/10">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#0D0D10] text-[#FF4D15] font-mono-code text-[11px] font-bold">
                            {story.trackingCode}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-600/30 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Workstation Verified PDF</span>
                          </span>
                        </div>
                        <span className="text-[11px] font-mono-code text-zinc-500">
                          {story.dateSubmitted}
                        </span>
                      </div>

                      {/* Title & Reporter Meta */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-mono-code font-bold text-[#FF4D15] uppercase">
                          {story.category} · Impact: {story.lossAmount}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-[#0D0D10] leading-snug">
                          {story.title}
                        </h3>
                        <div className="text-xs text-zinc-500">
                          Shared by <strong className="text-[#0D0D10]">{story.authorName}</strong>
                        </div>
                      </div>

                      {/* What Happened Section */}
                      <div className="p-5 rounded-2xl bg-white border border-black/8 space-y-1.5">
                        <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#FF4D15]" />
                          <span>What Happened (Modus Operandi)</span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                          {story.whatHappened}
                        </p>
                      </div>

                      {/* How to Stay Safe & Learn Section */}
                      <div className="p-5 rounded-2xl bg-emerald-950 text-white border border-emerald-500/30 space-y-2">
                        <div className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>How to Stay Safe &amp; Learn From This</span>
                        </div>
                        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                          {story.howToStaySafeLesson}
                        </p>
                      </div>
                    </div>

                    {/* Footer: Verified PDF Proof + Approving Senior Investigator */}
                    <div className="pt-4 border-t border-black/10 space-y-3">
                      <div className="p-3.5 rounded-2xl bg-[#0D0D10] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-[#FF4D15] shrink-0" />
                          <div className="truncate">
                            <div className="font-bold text-white truncate">{story.pdfFileName}</div>
                            <div className="text-[10px] font-mono-code text-zinc-400 truncate">
                              SHA-256: {story.pdfSha256.substring(0, 24)}... ({story.pdfFileSize})
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setInspectingPdfStory(story)}
                          className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#FF4D15] text-white text-[11px] font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Verified PDF</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
                        <div className="flex items-center gap-2">
                          <img
                            src={getApproverAvatar(story.approvedByOfficer)}
                            alt={story.approvedByOfficer || 'Senior Investigator'}
                            className="w-6 h-6 rounded-full object-cover object-top border border-[#FF4D15]"
                          />
                          <span>
                            Approved in Workstation by{' '}
                            <strong className="text-[#0D0D10]">
                              {story.approvedByOfficer || 'Krishi (Senior Investigator)'}
                            </strong>
                          </span>
                        </div>
                        <span className="font-mono-code text-[11px] text-emerald-700 font-bold">
                          {story.approvedByBadge || 'I4C-NAT-7721'}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Modal to Inspect Verified PDF Proof */}
              {inspectingPdfStory && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="max-w-2xl w-full rounded-3xl bg-[#0D0D10] text-white border border-white/15 p-6 sm:p-8 space-y-5 shadow-2xl">
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <span className="text-[11px] font-mono-code text-[#FF4D15] font-bold uppercase">
                          Workstation Verified PDF Evidence Record
                        </span>
                        <h3 className="text-xl font-bold text-white mt-0.5">
                          {inspectingPdfStory.pdfFileName}
                        </h3>
                      </div>
                      <button
                        onClick={() => setInspectingPdfStory(null)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 font-mono-code">
                        <div className="text-zinc-400">
                          Docket Reference: <span className="text-white font-bold">{inspectingPdfStory.trackingCode}</span>
                        </div>
                        <div className="text-zinc-400">
                          File Size: <span className="text-white">{inspectingPdfStory.pdfFileSize}</span>
                        </div>
                        <div className="text-zinc-400 break-all">
                          SHA-256 Digest: <span className="text-emerald-400 font-bold">{inspectingPdfStory.pdfSha256}</span>
                        </div>
                        <div className="text-zinc-400">
                          Workstation Sign-Off:{' '}
                          <span className="text-[#FF4D15] font-bold">
                            {inspectingPdfStory.approvedByOfficer} ({inspectingPdfStory.approvedByBadge})
                          </span>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#14141A] border border-white/10 space-y-2">
                        <div className="text-[11px] font-mono-code text-zinc-400 uppercase">
                          Verified Case Summary &amp; workstation Audit Note
                        </div>
                        <p className="text-zinc-200 leading-relaxed">{inspectingPdfStory.whatHappened}</p>
                        {inspectingPdfStory.workstationNotes && (
                          <p className="text-emerald-400 font-mono-code text-[11px] pt-2 border-t border-white/10">
                            Examiner Note: {inspectingPdfStory.workstationNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      {inspectingPdfStory.pdfDataUrl && (
                        <a
                          href={inspectingPdfStory.pdfDataUrl}
                          download={inspectingPdfStory.pdfFileName}
                          className="px-5 py-2.5 rounded-full bg-[#FF4D15] hover:bg-[#E03E0B] text-white text-xs font-bold transition-colors"
                        >
                          Download Original PDF
                        </a>
                      )}
                      <button
                        onClick={() => setInspectingPdfStory(null)}
                        className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                      >
                        Close Preview
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* DONTPAD WORKFLOW TAB */}
          {activeTab === 'dontpad' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Matte Obsidian Custom Slug Bar */}
              <div className="p-7 sm:p-10 rounded-3xl bg-[#0D0D10] text-white shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-[#FF4D15]/15 border border-[#FF4D15]/30">
                      <LinkIcon className="w-6 h-6 text-[#FF4D15]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#FF4D15]">
                        Dontpad Custom Slug Routing
                      </span>
                      <h3 className="text-xl font-bold text-white">Instant Shared Evidence Pad</h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleToggleWormLock}
                      className={`px-4 py-2 rounded-full text-xs font-mono-code font-bold flex items-center gap-1.5 transition-colors border ${
                        padMeta.isWormLocked
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{padMeta.isWormLocked ? 'WORM LOCKED' : 'EDITABLE MODE'}</span>
                    </button>

                    <button
                      onClick={handleCopyPadLink}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#FF4D15]" />
                      <span>Copy Share URL</span>
                    </button>
                  </div>
                </div>

                {/* Slug Form */}
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <div className="flex-1 flex items-center px-5 py-3.5 bg-[#16161C] border border-white/15 rounded-full font-mono-code text-xs text-zinc-300">
                    <span className="text-zinc-500 select-none mr-1">
                      https://fip-secure.gov.in/#pad/
                    </span>
                    <input
                      type="text"
                      value={padSlug}
                      onChange={(e) =>
                        setPadSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-'))
                      }
                      placeholder="custom-case-name"
                      className="flex-1 bg-transparent text-[#FF4D15] font-bold focus:outline-none"
                    />
                  </div>

                  <MagneticButton
                    onClick={() => {
                      window.location.hash = `#pad/${padSlug}`;
                      handlePadSave();
                    }}
                    className="px-7 py-3.5 bg-[#FF4D15] hover:bg-[#E03E0B] text-white font-bold rounded-full text-xs shadow-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Sync Pad (#pad/{padSlug})</span>
                  </MagneticButton>
                </div>

                {/* Pad Metadata Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-white/10 text-xs font-mono-code text-zinc-400">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">SHA-256 Digest</span>
                    <span className="font-bold text-[#FF4D15] truncate block tabular-nums">
                      {padMeta.sha256?.substring(0, 16) || 'SHA256-SEALED'}...
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Revisions Count</span>
                    <span className="font-bold text-white tabular-nums">
                      {padMeta.historyCount} updates
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Last Sync Officer</span>
                    <span className="font-bold text-emerald-400 inline-flex items-center gap-1.5">
                      {(padMeta.editorName || '').toLowerCase().includes('balchandra') && (
                        <img
                          src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg"
                          alt="Balchandra"
                          className="w-4 h-4 rounded-full object-cover object-top border border-emerald-400"
                        />
                      )}
                      {(padMeta.editorName || '').toLowerCase().includes('zohara') && (
                        <img
                          src="/assets/aistudio/image_acc490cb.png"
                          alt="Bibi Zohara"
                          className="w-4 h-4 rounded-full object-cover object-top border border-emerald-400"
                        />
                      )}
                      {(padMeta.editorName || '').toLowerCase().includes('afsheen') && (
                        <img
                          src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg"
                          alt="Afsheen S"
                          className="w-4 h-4 rounded-full object-cover object-top border border-emerald-400"
                        />
                      )}
                      <span>{padMeta.editorName || 'Senior Examiner'}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Timestamp</span>
                    <span className="font-bold text-zinc-200 tabular-nums">
                      {padMeta.lastUpdated}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Pad Editor Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Text Pad Area */}
                <div className="lg:col-span-8 p-7 rounded-3xl bg-[#F5F5F7] border border-black/10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-black/10">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#FF4D15]" />
                      <span className="text-xs font-bold text-[#0D0D10] font-mono-code">
                        #pad/{padSlug} Content Buffer
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono-code tabular-nums">
                      {padContent.length} characters
                    </span>
                  </div>

                  <textarea
                    rows={14}
                    value={padContent}
                    disabled={padMeta.isWormLocked && currentUser.role !== 'senior_investigator'}
                    onChange={(e) => setPadContent(e.target.value)}
                    placeholder="Paste or type evidentiary notes, transaction hashes, suspect identifiers, or case statements here..."
                    className="w-full p-5 bg-white border border-black/10 rounded-2xl font-mono-code text-xs text-[#0D0D10] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D15] leading-relaxed"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-zinc-600">
                      {padMeta.isWormLocked
                        ? 'Pad is currently locked in WORM mode.'
                        : 'Anyone with link can view and contribute updates.'}
                    </span>

                    <button
                      onClick={handlePadSave}
                      className="px-6 py-3 bg-[#0D0D10] hover:bg-[#FF4D15] text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5 text-white" />
                      <span>Save &amp; Update Hash Ledger</span>
                    </button>
                  </div>
                </div>

                {/* Share via Email & Preset Vaults */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="p-7 rounded-3xl bg-[#F5F5F7] border border-black/10 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-5 h-5 text-[#FF4D15]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0D10]">
                        Share Access Link via Email
                      </h4>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Dispatch a read-only Dontpad access link (#pad/{padSlug}) to citizens or co-investigators.
                    </p>

                    <form onSubmit={handleSharePadEmail} className="space-y-3">
                      <input
                        type="email"
                        required
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        placeholder="recipient@gmail.com"
                        className="w-full px-4 py-3 bg-white border border-black/15 rounded-full text-xs text-[#0D0D10] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D15]"
                      />

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#0D0D10] hover:bg-[#FF4D15] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Secure Link</span>
                      </button>
                    </form>
                  </div>

                  <div className="p-7 rounded-3xl bg-[#0D0D10] text-white space-y-4">
                    <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-zinc-400">
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
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                            padSlug === p.slug
                              ? 'bg-[#FF4D15] border-[#FF4D15] text-white font-bold'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300'
                          }`}
                        >
                          <span className="truncate font-mono-code">#pad/{p.slug}</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
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
            <div className="space-y-8">
              {/* Sleek Matte Obsidian Examiner Duty Strip */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#0D0D10] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#FF4D15] shrink-0" />
                  <span className="text-zinc-300 flex flex-wrap items-center gap-1.5">
                    <strong className="text-white">Accredited Examiners on Duty:</strong>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-[#FF4D15]/40 text-white font-semibold">
                      <img
                        src="/assets/aistudio/image_acc490cb.png"
                        alt="Dr. Bibi Zohara"
                        className="w-4 h-4 rounded-full object-cover object-top border border-[#FF4D15]"
                      />
                      <span>Dr. Bibi Zohara</span>
                    </span>
                    <span>,</span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-[#FF4D15]/40 text-white font-semibold">
                      <img
                        src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg"
                        alt="Sup. Balchandra K"
                        className="w-4 h-4 rounded-full object-cover object-top border border-[#FF4D15]"
                      />
                      <span>Sup. Balchandra K</span>
                    </span>
                    <span>,</span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-[#FF4D15]/40 text-white font-semibold">
                      <img
                        src="/assets/aistudio/image_526c1ede.png"
                        alt="Krishi N"
                        className="w-4 h-4 rounded-full object-cover object-top border border-[#FF4D15]"
                      />
                      <span>Krishi N</span>
                    </span>
                    <span>&amp;</span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-[#FF4D15]/40 text-white font-semibold">
                      <img
                        src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg"
                        alt="Afsheen S"
                        className="w-4 h-4 rounded-full object-cover object-top border border-[#FF4D15]"
                      />
                      <span>Afsheen S</span>
                    </span>
                    <span>maintain continuous RFC-3161 bitstream verification.</span>
                  </span>
                </div>
                <span className="font-mono-code font-semibold text-emerald-400 shrink-0">
                  WORM Node Active
                </span>
              </div>

              {/* Master-Detail Split Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Search & Studio Light Incident Dockets */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search tracking code, victim name, crime..."
                      className="w-full pl-11 pr-4 py-3 bg-[#F5F5F7] border border-black/10 rounded-full text-xs text-[#0D0D10] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D15]"
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredIncidents.map((inc, idx) => {
                      const incKey =
                        (inc as any)._id?.toString() ||
                        inc.id ||
                        inc.trackingCode ||
                        `inc-${idx}`;
                      const isSelected =
                        selectedIncident?.id === inc.id ||
                        selectedIncident?.trackingCode === inc.trackingCode;
                      return (
                        <div
                          key={incKey}
                          onClick={() => setSelectedIncident(inc)}
                          className={`p-5 rounded-3xl cursor-pointer transition-all border ${
                            isSelected
                              ? 'bg-[#0D0D10] text-white border-[#0D0D10] shadow-xl'
                              : 'bg-[#F5F5F7] text-[#0D0D10] border-black/10 hover:border-[#0D0D10] hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2 text-[11px] font-mono-code">
                            <span className="font-bold text-[#FF4D15]">{inc.trackingCode}</span>
                            <span
                              className={`font-semibold ${
                                inc.status === 'VERIFIED'
                                  ? isSelected
                                    ? 'text-emerald-400'
                                    : 'text-emerald-700'
                                  : isSelected
                                  ? 'text-amber-300'
                                  : 'text-zinc-500'
                              }`}
                            >
                              {inc.status === 'VERIFIED' ? 'Verified By Officer' : 'WORM Locked'}
                            </span>
                          </div>

                          <h4
                            className={`text-sm font-bold line-clamp-1 mb-1 ${
                              isSelected ? 'text-white' : 'text-[#0D0D10]'
                            }`}
                          >
                            {inc.title}
                          </h4>

                          <div
                            className={`text-xs mb-3 ${
                              isSelected ? 'text-zinc-300' : 'text-zinc-600'
                            }`}
                          >
                            {inc.category} · Loss: {inc.lossAmount || 'N/A'}
                          </div>

                          <div
                            className={`flex items-center justify-between text-[11px] font-mono-code pt-3 border-t tabular-nums ${
                              isSelected
                                ? 'border-white/10 text-zinc-400'
                                : 'border-black/10 text-zinc-500'
                            }`}
                          >
                            <span>{inc.dateReported?.substring(0, 10) || '2026-10-08'}</span>
                            <span>{inc.evidenceFiles?.length || 0} Evidence File(s)</span>
                          </div>
                        </div>
                      );
                    })}

                    {filteredIncidents.length === 0 && (
                      <div className="p-10 text-center text-xs text-zinc-500 bg-[#F5F5F7] rounded-3xl border border-black/10">
                        No incidents found matching your query.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Detailed Selected Incident View */}
                <div className="lg:col-span-7">
                  {selectedIncident ? (
                    <div className="p-7 sm:p-9 rounded-3xl bg-[#F5F5F7] border border-black/10 space-y-7">
                      {/* Header Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10">
                        <div>
                          <div className="text-xs font-mono-code text-[#FF4D15] font-bold mb-1">
                            {selectedIncident.trackingCode}
                          </div>
                          <h2 className="text-2xl font-bold text-[#0D0D10] tracking-tight">
                            {selectedIncident.title}
                          </h2>
                          <div className="text-xs text-zinc-600 mt-2">
                            {selectedIncident.isConfidentialReport ? (
                              <span className="font-semibold text-emerald-700">
                                Confidential Report · Identity Protected ({selectedIncident.citizenEmail})
                              </span>
                            ) : (
                              <span>
                                Reported by:{' '}
                                <strong className="text-[#0D0D10]">
                                  {selectedIncident.citizenName}
                                </strong>{' '}
                                ({selectedIncident.citizenEmail})
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => onViewCertificate(selectedIncident)}
                          className="px-5 py-3 bg-[#0D0D10] hover:bg-[#FF4D15] text-white rounded-full text-xs font-semibold flex items-center gap-2 whitespace-nowrap self-start transition-colors shadow-sm"
                        >
                          <Scale className="w-3.5 h-3.5 text-white" />
                          <span>Court Certificate (65B)</span>
                        </button>
                      </div>

                      {/* Matte Obsidian Primary Merkle Root Box */}
                      <div className="p-6 rounded-2xl bg-[#0D0D10] text-white space-y-3">
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                          <span className="flex items-center gap-1.5 font-mono-code font-bold text-[#FF4D15]">
                            <Hash className="w-3.5 h-3.5" />
                            Primary Merkle Root (SHA-256)
                          </span>
                          <span className="text-[11px] text-emerald-400 font-mono-code font-semibold uppercase">
                            Immutable WORM Block
                          </span>
                        </div>
                        <div className="font-mono-code text-xs text-emerald-300 font-bold break-all bg-black/50 p-4 rounded-xl border border-white/10 leading-relaxed">
                          {selectedIncident.primaryHash}
                        </div>
                      </div>

                      {/* Incident Narrative */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                          Incident Narrative &amp; Suspect Identifiers
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed bg-white p-5 rounded-2xl border border-black/10">
                          {selectedIncident.description}
                        </p>
                      </div>

                      {/* Evidence Files List */}
                      <div className="space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                          Cryptographic Evidence Vault ({(selectedIncident.evidenceFiles || []).length})
                        </div>
                        <div className="space-y-2.5">
                          {(selectedIncident.evidenceFiles || []).length > 0 ? (
                            (selectedIncident.evidenceFiles || []).map((f, fIdx) => (
                              <div
                                key={f.id || `${f.name}-${fIdx}`}
                                className="p-4 rounded-2xl bg-white border border-black/10 text-xs space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-[#0D0D10]">{f.name}</span>
                                  <span className="text-zinc-500 font-mono-code text-[11px] tabular-nums">
                                    {f.wormTimestamp || 'WORM Locked'}
                                  </span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-[#F5F5F7] border border-black/5 font-mono-code text-[11px] text-zinc-700 break-all">
                                  <span className="text-[#FF4D15] font-bold mr-1">SHA-256:</span>
                                  {f.sha256 || 'SHA-256 SEALED'}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-6 rounded-2xl bg-white border border-dashed border-black/15 text-xs text-zinc-500 text-center">
                              No raw evidence files attached to this docket yet.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Senior Investigator Audit Section */}
                      <div className="p-6 rounded-2xl bg-white border border-black/10 text-xs space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-[#0D0D10] flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-[#FF4D15]" />
                            Senior Forensic Examiner Sign-Off
                          </span>
                          <span className="font-mono-code font-semibold text-[#FF4D15] inline-flex items-center gap-1.5">
                            {(selectedIncident.seniorOfficerAssigned || '').toLowerCase().includes('balchandra') && (
                              <img
                                src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg"
                                alt="Balchandra"
                                className="w-5 h-5 rounded-full object-cover object-top border border-[#FF4D15]"
                              />
                            )}
                            {(selectedIncident.seniorOfficerAssigned || '').toLowerCase().includes('krishi') && (
                              <img
                                src="/assets/aistudio/image_526c1ede.png"
                                alt="Krishi"
                                className="w-5 h-5 rounded-full object-cover object-top border border-[#FF4D15]"
                              />
                            )}
                            {(selectedIncident.seniorOfficerAssigned || '').toLowerCase().includes('zohara') && (
                              <img
                                src="/assets/aistudio/image_acc490cb.png"
                                alt="Bibi Zohara"
                                className="w-5 h-5 rounded-full object-cover object-top border border-[#FF4D15]"
                              />
                            )}
                            {(selectedIncident.seniorOfficerAssigned || '').toLowerCase().includes('afsheen') && (
                              <img
                                src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg"
                                alt="Afsheen S"
                                className="w-5 h-5 rounded-full object-cover object-top border border-[#FF4D15]"
                              />
                            )}
                            <span>Officer: {selectedIncident.seniorOfficerAssigned}</span>
                          </span>
                        </div>

                        <p className="text-zinc-600 leading-relaxed">
                          {selectedIncident.officerNotes || 'Pending official audit notes.'}
                        </p>

                        {currentUser.role === 'senior_investigator' &&
                          selectedIncident.status !== 'VERIFIED' && (
                            <div className="pt-3 border-t border-black/10 flex flex-col sm:flex-row gap-3 items-center">
                              <input
                                type="text"
                                value={officerNotes}
                                onChange={(e) => setOfficerNotes(e.target.value)}
                                placeholder="Enter forensic verification audit notes..."
                                className="flex-1 w-full px-4 py-2.5 rounded-full border border-black/15 text-xs bg-[#F5F5F7] text-[#0D0D10] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D15]"
                              />
                              <button
                                onClick={() => handleVerify(selectedIncident.id)}
                                disabled={isVerifying}
                                className="px-6 py-2.5 bg-[#0D0D10] hover:bg-[#FF4D15] text-white rounded-full font-bold whitespace-nowrap transition-colors disabled:opacity-50"
                              >
                                {isVerifying ? 'Running Audit...' : 'Verify & Certify Hash'}
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
                      <div className="space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                          Chain of Custody Events
                        </div>
                        <div className="space-y-3 border-l border-black/20 pl-5 ml-2">
                          {(selectedIncident.custodyEvents || []).length > 0 ? (
                            (selectedIncident.custodyEvents || []).map((evt, eIdx) => (
                              <div key={evt.id || `evt-${eIdx}`} className="text-xs space-y-0.5 relative">
                                <div className="w-2 h-2 rounded-full bg-[#FF4D15] absolute -left-[25px] top-1.5" />
                                <div className="font-semibold text-[#0D0D10]">
                                  {evt.actor} ({evt.role})
                                </div>
                                <div className="text-zinc-600 text-xs">{evt.action}</div>
                                <div className="text-[11px] text-zinc-400 font-mono-code tabular-nums">
                                  {evt.timestamp}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-zinc-500">
                              Initial WORM custody ledger established.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-14 text-center text-zinc-500 bg-[#F5F5F7] rounded-3xl border border-black/10">
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
                files={incidents.flatMap((i) => i.evidenceFiles || [])}
                incidentTitle="All Drive Secure Vault Evidence & Media Artifacts"
                trackingCode="DRIVE-SECURE-VAULT"
                isSeniorInvestigatorView={false}
                dashboardHash={
                  incidents[0]?.primaryHash ||
                  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
                }
                vaultHash={
                  incidents[0]?.hashFormat?.sha256 ||
                  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
                }
                currentUser={currentUser}
              />
            </div>
          )}
        </ScrollExpandBlock>
      </section>
    </div>
  );
};
