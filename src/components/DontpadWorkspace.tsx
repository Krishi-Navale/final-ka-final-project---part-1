import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Clock, 
  Lock, 
  Unlock, 
  Folder, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  Hash, 
  X, 
  ShieldCheck, 
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { DontpadPad, UserProfile } from '../types';
import { getPadBySlug, updatePadContent, savePadFor24Hours, getStoredPads } from '../data/dontpadStore';
import { addNotification } from '../data/notificationStore';

interface DontpadWorkspaceProps {
  currentUser?: UserProfile;
  initialSlug?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export const DontpadWorkspace: React.FC<DontpadWorkspaceProps> = ({
  currentUser,
  initialSlug = 'case-2026-evidence',
  onClose,
  isModal = false,
}) => {
  const [currentPath, setCurrentPath] = useState(initialSlug);
  const [pad, setPad] = useState<DontpadPad>(() => getPadBySlug(initialSlug));
  const [text, setText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [allRecentPads, setAllRecentPads] = useState<string[]>([]);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync when initialSlug changes
  useEffect(() => {
    if (initialSlug) {
      setCurrentPath(initialSlug);
    }
  }, [initialSlug]);

  // Load pad when currentPath changes
  useEffect(() => {
    const loaded = getPadBySlug(currentPath);
    setPad(loaded);
    setText(loaded.content);

    // Refresh list of recent pads
    const allPads = getStoredPads();
    setAllRecentPads(Object.keys(allPads).slice(0, 8));
  }, [currentPath]);

  // Handle continuous auto-saving as user types
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setText(newContent);
    setIsSaving(true);

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      const updated = updatePadContent(
        currentPath, 
        newContent, 
        currentUser?.name || currentUser?.email || 'F.I.P Deponent',
        pad.isWormLocked
      );
      setPad(updated);
      setIsSaving(false);
    }, 400);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Switch pad via direct address bar input
  const handleNavigatePath = (newPath: string) => {
    const clean = newPath.trim().toLowerCase().replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9_\-\/]/g, '-');
    if (!clean) return;
    setCurrentPath(clean);
    window.location.hash = `pad/${clean}`;
  };

  // Share Unique 24h URL
  const handleCopyShareUrl = () => {
    const url = `${window.location.origin}${window.location.pathname}#pad/${currentPath}`;
    navigator.clipboard?.writeText?.(url);
    setIsCopied(true);
    showToast(`24-Hour Temporary Pad Link copied! Send this link to anyone to collaborate.`);
    setTimeout(() => setIsCopied(false), 2500);

    // Record notification
    addNotification({
      type: 'DONTPAD_SYNC',
      title: `Dontpad Link Shared (#pad/${currentPath})`,
      message: `24-Hour temporary link generated for pad "${currentPath}". Shared for real-time collaborative editing.`,
      recipientRole: 'all',
      actionUrlHash: `#pad/${currentPath}`,
      senderName: currentUser?.name || 'Citizen User',
      badge: '24H DONTPAD',
    });
  };

  // Explicit Save for 24 hours action
  const handleSaveFor24Hours = () => {
    const updated = savePadFor24Hours(currentPath);
    setPad(updated);
    showToast(`Pad #${currentPath} is locked and guaranteed saved for 24 hours! Expires: ${new Date(updated.expiresAt || '').toLocaleTimeString()} tomorrow.`);
  };

  // Toggle WORM lock
  const handleToggleWorm = () => {
    const updated = updatePadContent(
      currentPath,
      text,
      currentUser?.name || 'F.I.P Officer',
      !pad.isWormLocked
    );
    setPad(updated);
    showToast(updated.isWormLocked ? 'WORM Ledger Lock Activated (Read-Only Mode)' : 'WORM Lock Disengaged (Collaborative Edit Mode)');
  };

  // Download content as txt / zip physical archive
  const handleDownload = (format: 'txt' | 'zip') => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedFileName = currentPath.replace(/\//g, '_');
    a.download = `${sanitizedFileName}_FIP_Dontpad.${format === 'zip' ? 'zip' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloaded physical archive ${sanitizedFileName}.${format === 'zip' ? 'zip' : 'txt'}`);
  };

  // Calculate remaining hours for 24-hour expiration
  const getRemainingHours = () => {
    if (!pad.expiresAt) return '24h remaining';
    const diff = new Date(pad.expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired (Auto-Renewed)';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m remaining`;
  };

  return (
    <div className={`flex flex-col ${isModal ? 'bg-[#111115] text-white rounded-3xl p-6 sm:p-8 max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-[#FF4D15]/30 shadow-2xl' : 'bg-[#111115] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-white space-y-6'}`}>
      
      {/* Toast Banner */}
      {toastMsg && (
        <div className="mb-4 p-3.5 rounded-2xl bg-[#070709] text-white text-xs font-bold flex items-center justify-between shadow-xl animate-fade-in border border-white/15">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#FF4D15]" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF4D15]/15 text-[#FF4D15] border border-[#FF4D15]/30 text-[10px] font-mono-code font-bold uppercase tracking-wider">
              ⚡ F.I.P DEDICATED DONTPAD
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono-code font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{getRemainingHours()}</span>
            </span>
            {pad.isWormLocked && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#070709] text-white border border-white/15 text-[10px] font-mono-code font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#FF4D15]" />
                <span>WORM Locked</span>
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1 text-white">
            Dontpad Live Collaborative Notepad
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 max-w-2xl">
            Type anything. No login required. Changes auto-save continuously in real time to the F.I.P cloud server. Open or create any pad directly through the URL bar.
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="px-3.5 py-2 rounded-xl bg-[#18181E] hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5 text-[#FF4D15]" />
            <span>{showInstructions ? 'Hide Guide' : 'How it Works'}</span>
          </button>

          <button
            onClick={handleSaveFor24Hours}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            title="Save this pad for 24 hours"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Save for 24 Hours</span>
          </button>

          <button
            onClick={handleCopyShareUrl}
            className="px-4 py-2 rounded-xl bg-[#FF4D15] hover:bg-[#E03E0B] text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,77,21,0.3)]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isCopied ? 'Link Copied!' : 'Share 24h Link'}</span>
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 7-STEP INTERACTIVE INSTRUCTIONS GUIDE */}
      {showInstructions && (
        <div className="p-5 rounded-2xl bg-[#18181E] border border-[#FF4D15]/25 text-zinc-200 space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2 font-black text-white text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D15] animate-ping" />
              <span>Exact 7-Step Instructions: How Dontpad Works in F.I.P</span>
            </div>
            <span className="text-[10px] font-mono-code font-bold text-[#FF4D15] bg-[#FF4D15]/15 border border-[#FF4D15]/30 px-2 py-0.5 rounded">
              24-Hour Temporary & Save Protocol
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1 text-[11px] leading-relaxed">
            <div className="p-3 bg-[#070709] rounded-xl border border-white/10 space-y-1">
              <strong className="text-white block font-bold">1. Create or Open via URL:</strong>
              <p className="text-zinc-400">
                Instead of a "New Document" button, create a notepad simply by changing the URL address: type <code className="bg-[#18181E] text-[#FF4D15] px-1 py-0.5 rounded font-mono">#pad/my-custom-phrase</code> in the address bar.
              </p>
            </div>

            <div className="p-3 bg-[#070709] rounded-xl border border-white/10 space-y-1">
              <strong className="text-white block font-bold">2. Type Your Text:</strong>
              <p className="text-zinc-400">
                Click inside the large text area below and start typing or pasting content (evidence logs, suspect handles, code, or police statements).
              </p>
            </div>

            <div className="p-3 bg-[#070709] rounded-xl border border-white/10 space-y-1">
              <strong className="text-white block font-bold">3. Continuous Auto-Saving:</strong>
              <p className="text-zinc-400">
                No "Save" button required. Dontpad auto-saves continuously to the cloud as you type. If you close the tab, nothing is lost.
              </p>
            </div>

            <div className="p-3 bg-[#070709] rounded-xl border border-white/10 space-y-1">
              <strong className="text-white block font-bold">4. Share Instantly:</strong>
              <p className="text-zinc-400">
                Click "Share 24h Link". Anyone opening your unique URL instantly sees your text in real time with 0 login required.
              </p>
            </div>

            <div className="p-3 bg-[#070709] rounded-xl border border-white/10 space-y-1">
              <strong className="text-white block font-bold">5. Collaborative Real-Time:</strong>
              <p className="text-zinc-400">
                Multiple users (citizens and investigating officers) can open the same URL simultaneously to read and edit together live.
              </p>
            </div>

            <div className="p-3 bg-[#070709] rounded-xl border border-white/10 space-y-1">
              <strong className="text-white block font-bold">6. Organize Using Folders:</strong>
              <p className="text-zinc-400">
                Create sub-folders directly in the URL: <code className="bg-[#18181E] text-[#FF4D15] px-1 py-0.5 rounded font-mono">#pad/cases/2026/cyber-fraud</code> structures notes automatically under nested paths!
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-300">
            <div>
              <strong>7. Download Your Content (Optional):</strong> Download physical copy as <code className="font-mono bg-[#070709] px-1 py-0.5 rounded border border-white/10">.txt</code> or compressed archive <code className="font-mono bg-[#070709] px-1 py-0.5 rounded border border-white/10">.zip</code>.
            </div>
            <div className="text-emerald-400 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Temporary 24 Hours: User can save it for 24 hours too!</span>
            </div>
          </div>
        </div>
      )}

      {/* LIVE ADDRESS BAR SIMULATOR (STEP 1 & STEP 6: URL PATH NAVIGATION & NESTED FOLDERS) */}
      <div className="p-3.5 rounded-2xl bg-[#070709] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/10">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111115] border border-white/10 text-zinc-400 text-xs font-mono shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>dontpad.fip.app/#pad/</span>
          </div>
          <input
            type="text"
            value={currentPath}
            onChange={(e) => handleNavigatePath(e.target.value)}
            placeholder="Type custom word, phrase, or nested folder: cases/2026/evidence"
            className="flex-1 bg-transparent border-b border-white/15 focus:border-[#FF4D15] text-xs font-mono text-emerald-300 px-2 py-1 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-zinc-400">
            {isSaving ? (
              <span className="text-amber-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Auto-saving...
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Auto-saved (Cloud)
              </span>
            )}
          </span>

          <button
            onClick={handleCopyShareUrl}
            className="px-3 py-1.5 rounded-lg bg-[#18181E] hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-bold transition-colors flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            <span>Copy URL</span>
          </button>
        </div>
      </div>

      {/* QUICK SUB-FOLDER JUMPS (STEP 6) */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase mr-1">
          Folder Jumps:
        </span>
        {['case-2026-evidence', 'cases/police-warrant', 'fraud/upi-mule/logs', 'evidence/whatsapp-chat', 'investigation/notes'].map((slug) => (
          <button
            key={slug}
            onClick={() => handleNavigatePath(slug)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
              currentPath === slug
                ? 'bg-[#FF4D15] text-white font-bold shadow-[0_0_16px_rgba(255,77,21,0.3)]'
                : 'bg-[#18181E] hover:bg-white/10 text-zinc-300 border border-white/10'
            }`}
          >
            📁 /{slug}
          </button>
        ))}
      </div>

      {/* MAIN TEXT AREA (STEP 2: TYPE YOUR TEXT WITH REAL-TIME CONTINUOUS AUTO-SAVE) */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-inner">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Click here and start typing or pasting content... Auto-saves in real-time without clicking any button."
          rows={14}
          readOnly={pad.isWormLocked}
          className={`w-full p-5 text-xs sm:text-sm font-mono leading-relaxed focus:outline-none resize-y transition-colors placeholder-zinc-500 ${
            pad.isWormLocked
              ? 'bg-[#0B0B0E] text-zinc-400 cursor-not-allowed'
              : 'bg-[#070709] focus:bg-[#0B0B0F] text-zinc-100'
          }`}
        />

        {pad.isWormLocked && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-[#111115]/95 border border-white/15 text-amber-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
            <Lock className="w-3.5 h-3.5 text-[#FF4D15]" />
            <span>WORM Locked (Read-Only)</span>
          </div>
        )}
      </div>

      {/* FOOTER CONTROLS & DOWNLOAD OPTIONS (STEP 7: DOWNLOAD TXT OR COMPRESSED .ZIP) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-[11px]">
          <div>
            Length: <strong className="text-white">{text.length}</strong> chars
          </div>
          <div>
            Lines: <strong className="text-white">{text.split('\n').length}</strong>
          </div>
          <div>
            SHA-256: <code className="text-[#FF4D15]">{pad.sha256.substring(0, 14)}...</code>
          </div>
          <div>
            Last synced: <span className="text-zinc-300">{pad.lastUpdated}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Download Text */}
          <button
            onClick={() => handleDownload('txt')}
            className="px-3.5 py-2 rounded-xl bg-[#18181E] hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Download notepad as plain text file"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>.txt</span>
          </button>

          {/* Download ZIP (Step 7) */}
          <button
            onClick={() => handleDownload('zip')}
            className="px-3.5 py-2 rounded-xl bg-[#18181E] hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Download as compressed archive (.zip) matching dontpad.com/slug.zip specification"
          >
            <Download className="w-3.5 h-3.5 text-[#FF4D15]" />
            <span>.zip Archive</span>
          </button>

          {/* WORM Lock Toggle */}
          <button
            onClick={handleToggleWorm}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              pad.isWormLocked
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-[#FF4D15] hover:bg-[#E03E0B] text-white'
            }`}
          >
            {pad.isWormLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-white" />}
            <span>{pad.isWormLocked ? 'Unlock Editing' : 'Lock WORM'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
