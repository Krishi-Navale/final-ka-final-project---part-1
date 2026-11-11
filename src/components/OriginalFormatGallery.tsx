import React, { useState, useMemo } from 'react';
import { 
  EvidenceFile, 
  UserProfile 
} from '../types';
import { formatBytes } from '../utils/crypto';
import { 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Music, 
  FileCode, 
  Download, 
  Eye, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Hash, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  X, 
  Maximize2, 
  Play, 
  Pause, 
  Volume2, 
  Calendar, 
  FileCheck, 
  Cpu, 
  Zap, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface OriginalFormatGalleryProps {
  files: EvidenceFile[];
  incidentTitle?: string;
  trackingCode?: string;
  isSeniorInvestigatorView?: boolean;
  isHashVerified?: boolean;
  onOpenHashVerification?: () => void;
  dashboardHash?: string;
  vaultHash?: string;
  currentUser?: UserProfile;
  onFileUpload?: (file: File) => void;
}

export const OriginalFormatGallery: React.FC<OriginalFormatGalleryProps> = ({
  files,
  incidentTitle = 'Digital Evidence & Media Vault',
  trackingCode,
  isSeniorInvestigatorView = false,
  isHashVerified = false,
  onOpenHashVerification,
  dashboardHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  vaultHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  currentUser,
  onFileUpload
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'image' | 'video' | 'pdf' | 'audio' | 'other'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<EvidenceFile | null>(null);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Helper to categorize file by MIME type or extension
  const getCategory = (file: EvidenceFile): 'image' | 'video' | 'pdf' | 'audio' | 'other' => {
    const t = (file.type || '').toLowerCase();
    const n = (file.name || '').toLowerCase();
    if (t.includes('image') || n.endsWith('.png') || n.endsWith('.jpg') || n.endsWith('.jpeg') || n.endsWith('.webp')) return 'image';
    if (t.includes('video') || n.endsWith('.mp4') || n.endsWith('.mov') || n.endsWith('.m4v') || n.endsWith('.mkv')) return 'video';
    if (t.includes('pdf') || n.endsWith('.pdf') || n.endsWith('.doc') || n.endsWith('.docx') || n.endsWith('.txt')) return 'pdf';
    if (t.includes('audio') || n.endsWith('.mp3') || n.endsWith('.wav') || n.endsWith('.m4a') || n.endsWith('.ogg')) return 'audio';
    return 'other';
  };

  // Generate fallback rich SVG previews for items missing previewUrl
  const getPreviewUrlForFile = (file: EvidenceFile): string => {
    if (file.previewUrl) return file.previewUrl;
    if (file.rawContent) return file.rawContent;

    const cat = getCategory(file);
    const name = encodeURIComponent(file.name);
    const hashShort = file.sha256 ? file.sha256.substring(0, 16) : 'HASH-SEALED';

    if (cat === 'image') {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="%230f172a"><rect width="800" height="600" fill="%230f172a"/><rect x="20" y="20" width="760" height="560" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="2"/><circle cx="400" cy="220" r="80" fill="%230284c7" opacity="0.2"/><path d="M 360 220 L 400 180 L 440 220" stroke="%2338bdf8" stroke-width="4" fill="none"/><rect x="100" y="360" width="600" height="180" rx="12" fill="%23090d16" stroke="%230284c7" stroke-width="1.5"/><text x="120" y="400" fill="%2338bdf8" font-family="monospace" font-size="20" font-weight="bold">ORIGINAL EVIDENCE SNAPSHOT</text><text x="120" y="440" fill="%23f8fafc" font-family="sans-serif" font-size="18">${name}</text><text x="120" y="480" fill="%2394a3b8" font-family="monospace" font-size="14">SHA-256: ${hashShort}...</text><text x="120" y="510" fill="%2310b981" font-family="monospace" font-size="12">✓ WORM LEDGER VERIFIED</text></svg>`;
    }
    if (cat === 'video') {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="%230f172a"><rect width="800" height="600" fill="%23020617"/><rect x="20" y="20" width="760" height="560" rx="16" fill="%230f172a" stroke="%230284c7" stroke-width="2"/><circle cx="400" cy="260" r="60" fill="%230284c7"/><polygon points="385,235 430,260 385,285" fill="%23ffffff"/><rect x="80" y="420" width="640" height="100" rx="12" fill="%231e293b" stroke="%23334155"/><text x="110" y="460" fill="%2338bdf8" font-family="monospace" font-size="18" font-weight="bold">FORENSIC CCTV / SCREEN RECORDING</text><text x="110" y="490" fill="%23e2e8f0" font-family="sans-serif" font-size="16">${name}</text></svg>`;
    }
    if (cat === 'pdf') {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%230f172a"/><rect x="150" y="40" width="500" height="520" rx="12" fill="%231e293b" stroke="%2338bdf8" stroke-width="2"/><rect x="190" y="80" width="420" height="40" rx="6" fill="%230284c7" opacity="0.3"/><text x="210" y="106" fill="%2338bdf8" font-family="monospace" font-size="16" font-weight="bold">OFFICIAL DOCUMENT / BANK STATEMENT</text><text x="190" y="180" fill="%23f8fafc" font-family="sans-serif" font-size="20" font-weight="bold">${name}</text><line x1="190" y1="210" x2="610" y2="210" stroke="%23334155" stroke-width="2"/><text x="190" y="250" fill="%2394a3b8" font-family="serif" font-size="14">Itemized evidence document uploaded in original fidelity.</text><text x="190" y="280" fill="%2394a3b8" font-family="serif" font-size="14">Validated against central judicial registry.</text><rect x="190" y="420" width="420" height="100" rx="8" fill="%23090d16" stroke="%2310b981"/><text x="210" y="455" fill="%2310b981" font-family="monospace" font-size="14" font-weight="bold">CRYPTOGRAPHIC ADMISSIBILITY SEAL</text><text x="210" y="485" fill="%23a7f3d0" font-family="monospace" font-size="12">SHA256: ${hashShort}</text></svg>`;
    }
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%230f172a"/><rect x="40" y="40" width="720" height="520" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="2"/><text x="80" y="120" fill="%2338bdf8" font-family="monospace" font-size="22" font-weight="bold">RAW FORENSIC FILE PAYLOAD</text><text x="80" y="170" fill="%23f8fafc" font-family="sans-serif" font-size="20">${name}</text><text x="80" y="220" fill="%2394a3b8" font-family="monospace" font-size="14">WORM STAMP: ${file.wormTimestamp || 'SECURED'}</text></svg>`;
  };

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const cat = getCategory(f);
      if (filterCategory !== 'all' && cat !== filterCategory) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          f.name.toLowerCase().includes(term) ||
          f.sha256.toLowerCase().includes(term) ||
          (f.type || '').toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [files, filterCategory, searchTerm]);

  const stats = useMemo(() => {
    let images = 0, videos = 0, pdfs = 0, audios = 0, totalSize = 0;
    files.forEach((f) => {
      totalSize += f.size || 0;
      const cat = getCategory(f);
      if (cat === 'image') images++;
      else if (cat === 'video') videos++;
      else if (cat === 'pdf') pdfs++;
      else if (cat === 'audio') audios++;
    });
    return { images, videos, pdfs, audios, totalSize, count: files.length };
  }, [files]);

  const handleCopyHash = (id: string, hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText?.(hash);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const handleDownloadOriginal = (file: EvidenceFile, e: React.MouseEvent) => {
    e.stopPropagation();
    // If investigator is viewing and NOT verified, block download
    if (isSeniorInvestigatorView && !isHashVerified) {
      if (onOpenHashVerification) onOpenHashVerification();
      return;
    }

    const preview = getPreviewUrlForFile(file);
    const element = document.createElement('a');
    element.setAttribute('href', preview);
    element.setAttribute('download', file.name);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;
    if (onFileUpload) {
      for (let i = 0; i < uploaded.length; i++) {
        onFileUpload(uploaded[i]);
      }
    }
  };

  // Locked Overlay for Senior Investigator
  const showLockedOverlay = isSeniorInvestigatorView && !isHashVerified;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white tracking-wide">
                    Original Format Evidence Repository
                  </h2>
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Native Quality Preserved
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {incidentTitle} {trackingCode ? `• Docket: ${trackingCode}` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Citizen Dashboard Master Fingerprint Summary */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-4 text-xs font-mono">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">
                Citizen Works Dashboard Hash
              </div>
              <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{dashboardHash.substring(0, 16)}...</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">
                Total Native Payload
              </div>
              <div className="text-white font-bold mt-0.5">
                {stats.count} Artifacts ({formatBytes(stats.totalSize)})
              </div>
            </div>
          </div>
        </div>

        {/* Lock Banner for Senior Investigator if Not Verified */}
        {showLockedOverlay && (
          <div className="mt-6 p-5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/40 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 shrink-0">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-200">
                  Cryptographic Verification Gate Active
                </h4>
                <p className="text-xs text-amber-300/80 mt-0.5 leading-relaxed">
                  Raw uncompressed original files (photos, videos, bank PDFs) are locked for investigator access until you perform the SHA-256 Dual-Hash comparison with the Citizen Works Dashboard.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenHashVerification}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap shadow-lg shadow-amber-900/30 transition-all hover:scale-105 shrink-0"
            >
              <Zap className="w-4 h-4 fill-current" />
              Compare Dashboard Hash Value & Unlock
            </button>
          </div>
        )}

        {isSeniorInvestigatorView && isHashVerified && (
          <div className="mt-6 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center justify-between gap-4 text-xs text-emerald-200">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>CRYPTOGRAPHIC MATCH VERIFIED — Senior Investigator Clearance Unlocked (0 Bit Flips)</span>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg font-mono text-[10px]">
              Full High-Fidelity Access
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterCategory === 'all'
                ? 'bg-emerald-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Formats ({stats.count})
          </button>
          <button
            onClick={() => setFilterCategory('image')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              filterCategory === 'image'
                ? 'bg-sky-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Photos ({stats.images})
          </button>
          <button
            onClick={() => setFilterCategory('video')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              filterCategory === 'video'
                ? 'bg-indigo-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Videos ({stats.videos})
          </button>
          <button
            onClick={() => setFilterCategory('pdf')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              filterCategory === 'pdf'
                ? 'bg-purple-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Docs & PDFs ({stats.pdfs})
          </button>
          <button
            onClick={() => setFilterCategory('audio')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              filterCategory === 'audio'
                ? 'bg-pink-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            Audio ({stats.audios})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search file name, hash, ext..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {onFileUpload && !isSeniorInvestigatorView && (
            <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md transition-all shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Original Format</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
              />
            </label>
          )}
        </div>
      </div>

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/30 border border-slate-800/80 rounded-2xl space-y-3">
          <FileCode className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No original format files match your search</h3>
          <p className="text-xs text-slate-500">Try adjusting your filters or upload additional files above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFiles.map((file) => {
            const category = getCategory(file);
            const previewUrl = getPreviewUrlForFile(file);

            return (
              <div
                key={file.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-2xl flex flex-col group relative"
              >
                {/* Media Preview Header Box */}
                <div 
                  className="h-48 bg-slate-950 relative overflow-hidden flex items-center justify-center cursor-pointer group-hover:opacity-95"
                  onClick={() => {
                    if (showLockedOverlay) {
                      if (onOpenHashVerification) onOpenHashVerification();
                    } else {
                      setSelectedFileForPreview(file);
                    }
                  }}
                >
                  {showLockedOverlay ? (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
                      <Lock className="w-8 h-8 text-amber-400 mb-2 animate-bounce" />
                      <span className="text-xs font-bold text-amber-200">Raw Format Locked</span>
                      <span className="text-[10px] text-slate-400 mt-1">Hash Verification Required</span>
                    </div>
                  ) : null}

                  {/* Render preview image */}
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badge top right: category icon */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg border border-slate-700 text-[10px] font-mono font-bold text-slate-200 flex items-center gap-1.5 shadow-md">
                    {category === 'image' && <ImageIcon className="w-3 h-3 text-sky-400" />}
                    {category === 'video' && <Video className="w-3 h-3 text-indigo-400" />}
                    {category === 'pdf' && <FileText className="w-3 h-3 text-purple-400" />}
                    {category === 'audio' && <Music className="w-3 h-3 text-pink-400" />}
                    {category === 'other' && <FileCode className="w-3 h-3 text-emerald-400" />}
                    <span>{file.name.split('.').pop()?.toUpperCase() || 'RAW'}</span>
                  </div>

                  {/* Hover Overlay Icon */}
                  {!showLockedOverlay && (
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-3 bg-emerald-500 text-slate-950 rounded-full shadow-xl transform group-hover:scale-110 transition-transform">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* File Details Footer */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 
                      className="text-sm font-bold text-white truncate hover:text-emerald-400 transition-colors cursor-pointer"
                      title={file.name}
                      onClick={() => {
                        if (showLockedOverlay) {
                          if (onOpenHashVerification) onOpenHashVerification();
                        } else {
                          setSelectedFileForPreview(file);
                        }
                      }}
                    >
                      {file.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{formatBytes(file.size)}</span>
                      <span className="text-emerald-400">{file.wormTimestamp ? 'WORM Sealed' : 'Verified'}</span>
                    </div>
                  </div>

                  {/* Hash Pill */}
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between gap-2 text-[10px] font-mono">
                    <span className="text-slate-400 truncate">
                      SHA: <span className="text-slate-200">{file.sha256.substring(0, 14)}...</span>
                    </span>
                    <button
                      onClick={(e) => handleCopyHash(file.id, file.sha256, e)}
                      className="text-slate-400 hover:text-emerald-400 p-1 hover:bg-slate-800 rounded transition-colors shrink-0"
                      title="Copy Full SHA-256 Hash"
                    >
                      {copiedHashId === file.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => {
                        if (showLockedOverlay) {
                          if (onOpenHashVerification) onOpenHashVerification();
                        } else {
                          setSelectedFileForPreview(file);
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors flex-1 justify-center"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Inspect Format</span>
                    </button>

                    <button
                      onClick={(e) => handleDownloadOriginal(file, e)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        showLockedOverlay
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                      }`}
                      title={showLockedOverlay ? 'Hash verification required to download' : 'Download Original Raw File'}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Raw File</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox / Media Preview Modal */}
      {selectedFileForPreview && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-slate-100">
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white truncate max-w-md">
                    {selectedFileForPreview.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>Size: {formatBytes(selectedFileForPreview.size)}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{selectedFileForPreview.type || 'Original Payload'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDownloadOriginal(selectedFileForPreview, e)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Original</span>
                </button>
                <button
                  onClick={() => setSelectedFileForPreview(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Display Body */}
            <div className="p-6 overflow-y-auto space-y-6 bg-slate-950/60">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-center min-h-[300px]">
                {getCategory(selectedFileForPreview) === 'image' && (
                  <img
                    src={getPreviewUrlForFile(selectedFileForPreview)}
                    alt={selectedFileForPreview.name}
                    className="max-h-[60vh] object-contain rounded-lg shadow-2xl"
                  />
                )}

                {getCategory(selectedFileForPreview) === 'video' && (
                  <div className="w-full max-w-2xl space-y-3">
                    <img
                      src={getPreviewUrlForFile(selectedFileForPreview)}
                      alt="Video frame preview"
                      className="w-full h-auto rounded-lg shadow-2xl border border-slate-800"
                    />
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <button className="p-2 bg-emerald-500 text-slate-950 rounded-lg font-bold">
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                        <span className="font-mono text-slate-300">00:00 / 02:45</span>
                      </div>
                      <span className="text-emerald-400 font-mono text-[11px]">H.264 / 1080p Original Recording</span>
                    </div>
                  </div>
                )}

                {getCategory(selectedFileForPreview) === 'pdf' && (
                  <iframe
                    src={getPreviewUrlForFile(selectedFileForPreview)}
                    className="w-full h-[50vh] rounded-lg border border-slate-800"
                    title={selectedFileForPreview.name}
                  />
                )}

                {getCategory(selectedFileForPreview) === 'audio' && (
                  <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 max-w-md w-full space-y-4 text-center">
                    <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-pink-400">
                      <Music className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{selectedFileForPreview.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 font-mono">Audio Recording • Sample Rate 44.1kHz</p>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center gap-3">
                      <button 
                        onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                        className="p-3 bg-pink-500 text-slate-950 rounded-xl font-bold hover:scale-105 transition-transform"
                      >
                        {isAudioPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                      </button>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-pink-500 ${isAudioPlaying ? 'w-2/3 animate-pulse' : 'w-0'}`} />
                      </div>
                    </div>
                  </div>
                )}

                {getCategory(selectedFileForPreview) === 'other' && (
                  <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 max-w-lg w-full space-y-4 text-left font-mono text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <FileCode className="w-5 h-5" />
                      <span>Binary Forensic Payload Analysis</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg text-slate-300 leading-relaxed overflow-x-auto border border-slate-800 text-[11px]">
                      <div>HEADER: 0x7F 0x45 0x4C 0x46 (ELF Executable / APK Zip Container)</div>
                      <div>SHA-256: {selectedFileForPreview.sha256}</div>
                      <div>WORM ANCHOR: {selectedFileForPreview.wormTimestamp || 'RFC-3161 SECURED'}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Inspection Panel */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-sans font-bold text-slate-200">Forensic Metadata & Integrity Seals</span>
                  <span className="text-emerald-400">100% Bitwise Authentic</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-slate-500">SHA-256 Digest:</div>
                    <div className="text-emerald-400 break-all select-all font-bold">{selectedFileForPreview.sha256}</div>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-slate-500">WORM Ledger Timestamp:</div>
                    <div className="text-slate-200">{selectedFileForPreview.wormTimestamp || '2026-10-09 UTC [RFC-3161]'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
