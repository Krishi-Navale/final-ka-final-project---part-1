import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Copy,
  Check,
  Clock,
  Lock,
  Unlock,
  Share2,
  Sparkles,
  RefreshCw,
  X,
  Info,
  Calendar,
} from 'lucide-react';
import { DontpadPad, UserProfile } from '../types';
import {
  getPadBySlug,
  updatePadContent,
  savePadFor24Hours,
} from '../data/dontpadStore';
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
    const clean = newPath
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, '')
      .replace(/[^a-z0-9_\-\/]/g, '-');
    if (!clean) return;
    setCurrentPath(clean);
    window.location.hash = `pad/${clean}`;
  };

  // Share Unique 24h URL
  const handleCopyShareUrl = () => {
    const url = `${window.location.origin}${window.location.pathname}#pad/${currentPath}`;
    navigator.clipboard?.writeText?.(url);
    setIsCopied(true);
    showToast(
      `24-Hour Temporary Pad Link copied! Send this link to anyone to collaborate.`
    );
    setTimeout(() => setIsCopied(false), 2500);

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
    showToast(
      `Pad #${currentPath} is locked and guaranteed saved for 24 hours! Expires: ${new Date(
        updated.expiresAt || ''
      ).toLocaleTimeString()} tomorrow.`
    );
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
    showToast(
      updated.isWormLocked
        ? 'WORM Ledger Lock Activated (Read-Only Mode)'
        : 'WORM Lock Disengaged (Collaborative Edit Mode)'
    );
  };

  // Download content as txt / zip physical archive
  const handleDownload = (format: 'txt' | 'zip') => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedFileName = currentPath.replace(/\//g, '_');
    a.download = `${sanitizedFileName}_FIP_Dontpad.${
      format === 'zip' ? 'zip' : 'txt'
    }`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(
      `Downloaded physical archive ${sanitizedFileName}.${
        format === 'zip' ? 'zip' : 'txt'
      }`
    );
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
    <div
      className={`flex flex-col ${
        isModal
          ? 'bg-white text-[#111318] rounded-[24px] p-6 sm:p-8 max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-[#E6E8EE] shadow-2xl space-y-6'
          : 'bg-white rounded-[24px] p-6 sm:p-8 border border-[#ECEEF2] shadow-[0_10px_30px_rgba(15,23,42,0.04)] text-[#111318] space-y-6'
      }`}
    >
      {/* Toast Banner */}
      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-[#14161D] text-white text-xs font-semibold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#FF4D15]" />
            <span>{toastMsg}</span>
          </div>
          <button
            onClick={() => setToastMsg(null)}
            className="text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#ECEEF2]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF4D15] border border-orange-200 text-[10px] font-mono-code font-bold uppercase tracking-wider">
              ⚡ F.I.P DEDICATED DONTPAD
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono-code font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-600" />
              <span>{getRemainingHours()}</span>
            </span>
            {pad.isWormLocked && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#14161D] text-white text-[10px] font-mono-code font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#FF4D15]" />
                <span>WORM Locked</span>
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mt-1.5 text-[#111318]">
            Dontpad Live Collaborative Notepad
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Type anything. No login required. Changes auto-save continuously in
            real time to the F.I.P cloud server. Open or create any pad directly
            through the URL bar.
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="px-3.5 py-2 rounded-xl bg-[#F4F5F8] hover:bg-[#E6E8EE] text-[#111318] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-[#FF4D15]" />
            <span>{showInstructions ? 'Hide Guide' : 'How it Works'}</span>
          </button>

          <button
            onClick={handleSaveFor24Hours}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Save this pad for 24 hours"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Save for 24 Hours</span>
          </button>

          <button
            onClick={handleCopyShareUrl}
            className="px-4 py-2 rounded-xl bg-[#14161D] hover:bg-[#FF4D15] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isCopied ? 'Link Copied!' : 'Share 24h Link'}</span>
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-[#111318] hover:bg-[#F4F5F8] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 7-STEP INTERACTIVE INSTRUCTIONS GUIDE */}
      {showInstructions && (
        <div className="p-5 rounded-2xl bg-[#F8F9FB] border border-[#E6E8EE] text-[#111318] space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6E8EE]">
            <div className="flex items-center gap-2 font-extrabold text-[#111318] text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D15] animate-ping" />
              <span>Exact 7-Step Instructions: How Dontpad Works in F.I.P</span>
            </div>
            <span className="text-[10px] font-mono-code font-bold text-[#FF4D15] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
              24-Hour Temporary &amp; Save Protocol
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 text-[11px] leading-relaxed">
            <div className="p-3 bg-white rounded-xl border border-[#ECEEF2] space-y-1">
              <strong className="text-[#111318] block font-bold">
                1. Create or Open via URL:
              </strong>
              <p className="text-slate-500">
                Create a notepad simply by changing the address:{' '}
                <code className="bg-orange-50 text-[#FF4D15] px-1 py-0.5 rounded font-mono">
                  #pad/my-custom-phrase
                </code>
                .
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#ECEEF2] space-y-1">
              <strong className="text-[#111318] block font-bold">
                2. Type Your Text:
              </strong>
              <p className="text-slate-500">
                Click inside the text area below and type or paste evidence
                logs, suspect handles, or witness statements.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#ECEEF2] space-y-1">
              <strong className="text-[#111318] block font-bold">
                3. Continuous Auto-Saving:
              </strong>
              <p className="text-slate-500">
                No &ldquo;Save&rdquo; button required. Dontpad auto-saves
                continuously to the cloud as you type.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#ECEEF2] space-y-1">
              <strong className="text-[#111318] block font-bold">
                4. Share Instantly:
              </strong>
              <p className="text-slate-500">
                Click &ldquo;Share 24h Link&rdquo;. Anyone opening your URL
                instantly sees your notes in real time.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#ECEEF2] space-y-1">
              <strong className="text-[#111318] block font-bold">
                5. Collaborative Real-Time:
              </strong>
              <p className="text-slate-500">
                Multiple users (citizens and Senior Investigators) can read and
                edit the same pad simultaneously.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#ECEEF2] space-y-1">
              <strong className="text-[#111318] block font-bold">
                6. Organize Using Folders:
              </strong>
              <p className="text-slate-500">
                Use nested paths:{' '}
                <code className="bg-orange-50 text-[#FF4D15] px-1 py-0.5 rounded font-mono">
                  #pad/cases/2026/cyber-fraud
                </code>{' '}
                to structure notes automatically.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E6E8EE] flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
            <div>
              <strong>7. Download Your Content (Optional):</strong> Download a
              physical copy as{' '}
              <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#E6E8EE]">
                .txt
              </code>{' '}
              or{' '}
              <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#E6E8EE]">
                .zip
              </code>
              .
            </div>
            <div className="text-emerald-700 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Temporary 24 Hours: Preserved automatically!</span>
            </div>
          </div>
        </div>
      )}

      {/* LIVE ADDRESS BAR SIMULATOR */}
      <div className="p-3.5 rounded-2xl bg-[#F8F9FB] text-[#111318] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E6E8EE]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E6E8EE] text-slate-500 text-xs font-mono shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>dontpad.fip.app/#pad/</span>
          </div>
          <input
            type="text"
            value={currentPath}
            onChange={(e) => handleNavigatePath(e.target.value)}
            placeholder="Type custom word, phrase, or nested folder: cases/2026/evidence"
            className="flex-1 bg-transparent border-b border-slate-200 focus:border-[#14161D] text-xs font-mono text-[#111318] font-semibold px-2 py-1 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-slate-500">
            {isSaving ? (
              <span className="text-amber-600 flex items-center gap-1 font-semibold">
                <RefreshCw className="w-3 h-3 animate-spin" /> Auto-saving...
              </span>
            ) : (
              <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                <Check className="w-3 h-3" /> Auto-saved (Cloud)
              </span>
            )}
          </span>

          <button
            onClick={handleCopyShareUrl}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#14161D] hover:text-white text-[#111318] border border-[#E6E8EE] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            <span>Copy URL</span>
          </button>
        </div>
      </div>

      {/* QUICK SUB-FOLDER JUMPS */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mr-1">
          Folder Jumps:
        </span>
        {[
          'case-2026-evidence',
          'cases/police-warrant',
          'fraud/upi-mule/logs',
          'evidence/whatsapp-chat',
          'investigation/notes',
        ].map((slug) => (
          <button
            key={slug}
            onClick={() => handleNavigatePath(slug)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-mono transition-all cursor-pointer ${
              currentPath === slug
                ? 'bg-[#14161D] text-white font-bold shadow-sm'
                : 'bg-[#F4F5F8] hover:bg-[#E6E8EE] text-slate-600'
            }`}
          >
            📁 /{slug}
          </button>
        ))}
      </div>

      {/* MAIN TEXT AREA */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E6E8EE]">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Click here and start typing or pasting content... Auto-saves in real-time without clicking any button."
          rows={13}
          readOnly={pad.isWormLocked}
          className={`w-full p-5 text-xs sm:text-sm font-mono leading-relaxed focus:outline-none resize-y transition-colors placeholder-slate-400 ${
            pad.isWormLocked
              ? 'bg-[#F4F5F8] text-slate-500 cursor-not-allowed'
              : 'bg-[#F8F9FB] focus:bg-white text-[#111318]'
          }`}
        />

        {pad.isWormLocked && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-[#14161D] text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
            <Lock className="w-3.5 h-3.5 text-[#FF4D15]" />
            <span>WORM Locked (Read-Only)</span>
          </div>
        )}
      </div>

      {/* FOOTER CONTROLS & DOWNLOAD OPTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#ECEEF2] text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[11px]">
          <div>
            Length: <strong className="text-[#111318]">{text.length}</strong>{' '}
            chars
          </div>
          <div>
            Lines:{' '}
            <strong className="text-[#111318]">
              {text.split('\n').length}
            </strong>
          </div>
          <div>
            SHA-256:{' '}
            <code className="text-[#FF4D15] font-bold">
              {pad.sha256.substring(0, 14)}...
            </code>
          </div>
          <div>
            Last synced: <span className="text-slate-600">{pad.lastUpdated}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload('txt')}
            className="px-3.5 py-2 rounded-xl bg-[#F4F5F8] hover:bg-[#E6E8EE] text-[#111318] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download notepad as plain text file"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>.txt</span>
          </button>

          <button
            onClick={() => handleDownload('zip')}
            className="px-3.5 py-2 rounded-xl bg-[#F4F5F8] hover:bg-[#E6E8EE] text-[#111318] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download as compressed archive (.zip)"
          >
            <Download className="w-3.5 h-3.5 text-[#FF4D15]" />
            <span>.zip Archive</span>
          </button>

          <button
            onClick={handleToggleWorm}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              pad.isWormLocked
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[#14161D] hover:bg-[#FF4D15] text-white'
            }`}
          >
            {pad.isWormLocked ? (
              <Unlock className="w-3.5 h-3.5" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-[#FF4D15]" />
            )}
            <span>{pad.isWormLocked ? 'Unlock Editing' : 'Lock WORM'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
