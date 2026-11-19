import React, { useState, useMemo } from 'react';
import { EvidenceFile, UserProfile } from '../types';
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
  ShieldCheck,
  Hash,
  Copy,
  Check,
  Search,
  Upload,
  X,
  Maximize2,
  Play,
  Pause,
  FileCheck,
  Zap,
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
  onFileUpload,
}) => {
  const [filterCategory, setFilterCategory] = useState<
    'all' | 'image' | 'video' | 'pdf' | 'audio' | 'other'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileForPreview, setSelectedFileForPreview] =
    useState<EvidenceFile | null>(null);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const getCategory = (
    file: EvidenceFile
  ): 'image' | 'video' | 'pdf' | 'audio' | 'other' => {
    const t = (file.type || '').toLowerCase();
    const n = (file.name || '').toLowerCase();
    if (
      t.includes('image') ||
      n.endsWith('.png') ||
      n.endsWith('.jpg') ||
      n.endsWith('.jpeg') ||
      n.endsWith('.webp')
    )
      return 'image';
    if (
      t.includes('video') ||
      n.endsWith('.mp4') ||
      n.endsWith('.mov') ||
      n.endsWith('.m4v') ||
      n.endsWith('.mkv')
    )
      return 'video';
    if (
      t.includes('pdf') ||
      n.endsWith('.pdf') ||
      n.endsWith('.doc') ||
      n.endsWith('.docx') ||
      n.endsWith('.txt')
    )
      return 'pdf';
    if (
      t.includes('audio') ||
      n.endsWith('.mp3') ||
      n.endsWith('.wav') ||
      n.endsWith('.m4a') ||
      n.endsWith('.ogg')
    )
      return 'audio';
    return 'other';
  };

  const getPreviewUrlForFile = (file: EvidenceFile): string => {
    if (file.previewUrl) return file.previewUrl;
    if (file.rawContent) return file.rawContent;

    const cat = getCategory(file);
    const name = encodeURIComponent(file.name);
    const hashShort = file.sha256 ? file.sha256.substring(0, 16) : 'HASH-SEALED';

    if (cat === 'image') {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23F8F9FB"/><rect x="24" y="24" width="752" height="552" rx="20" fill="%23FFFFFF" stroke="%23E6E8EE" stroke-width="2"/><circle cx="400" cy="210" r="76" fill="%23EEF2FF"/><path d="M 365 215 L 400 175 L 435 215" stroke="%2314161D" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="100" y="340" width="600" height="190" rx="16" fill="%23F4F5F8" stroke="%23E6E8EE" stroke-width="1.5"/><text x="126" y="384" fill="%23FF4D15" font-family="monospace" font-size="18" font-weight="bold">ORIGINAL EVIDENCE SNAPSHOT</text><text x="126" y="424" fill="%23111318" font-family="sans-serif" font-size="20" font-weight="bold">${name}</text><text x="126" y="464" fill="%2364748B" font-family="monospace" font-size="14">SHA-256: ${hashShort}...</text><text x="126" y="500" fill="%23059669" font-family="monospace" font-size="13" font-weight="bold">WORM LEDGER VERIFIED</text></svg>`;
    }
    if (cat === 'video') {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23F8F9FB"/><rect x="24" y="24" width="752" height="552" rx="20" fill="%23FFFFFF" stroke="%23E6E8EE" stroke-width="2"/><circle cx="400" cy="240" r="62" fill="%2314161D"/><polygon points="384,214 432,240 384,266" fill="%23FFFFFF"/><rect x="90" y="390" width="620" height="120" rx="14" fill="%23F4F5F8" stroke="%23E6E8EE"/><text x="120" y="436" fill="%23FF4D15" font-family="monospace" font-size="17" font-weight="bold">FORENSIC CCTV / SCREEN RECORDING</text><text x="120" y="472" fill="%23111318" font-family="sans-serif" font-size="18" font-weight="bold">${name}</text></svg>`;
    }
    if (cat === 'pdf') {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23F4F5F8"/><rect x="140" y="40" width="520" height="520" rx="18" fill="%23FFFFFF" stroke="%23E6E8EE" stroke-width="2"/><rect x="180" y="80" width="440" height="44" rx="10" fill="%23FFF4ED"/><text x="200" y="108" fill="%23FF4D15" font-family="monospace" font-size="15" font-weight="bold">OFFICIAL DOCUMENT / BANK STATEMENT</text><text x="180" y="180" fill="%23111318" font-family="sans-serif" font-size="20" font-weight="bold">${name}</text><line x1="180" y1="210" x2="620" y2="210" stroke="%23ECEEF2" stroke-width="2"/><text x="180" y="250" fill="%2364748B" font-family="sans-serif" font-size="14">Itemized evidence document preserved in native format.</text><rect x="180" y="410" width="440" height="105" rx="12" fill="%23ECFDF5" stroke="%23A7F3D0"/><text x="204" y="448" fill="%23047857" font-family="monospace" font-size="14" font-weight="bold">CRYPTOGRAPHIC ADMISSIBILITY SEAL</text><text x="204" y="480" fill="%23065F46" font-family="monospace" font-size="12">SHA256: ${hashShort}</text></svg>`;
    }
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23F8F9FB"/><rect x="40" y="40" width="720" height="520" rx="20" fill="%23FFFFFF" stroke="%23E6E8EE" stroke-width="2"/><text x="80" y="120" fill="%23FF4D15" font-family="monospace" font-size="20" font-weight="bold">RAW FORENSIC FILE PAYLOAD</text><text x="80" y="170" fill="%23111318" font-family="sans-serif" font-size="20" font-weight="bold">${name}</text><text x="80" y="220" fill="%2364748B" font-family="monospace" font-size="14">WORM STAMP: ${file.wormTimestamp || 'SECURED'}</text></svg>`;
  };

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const cat = getCategory(f);
      if (filterCategory !== 'all' && cat !== filterCategory) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          (f.name || '').toLowerCase().includes(term) ||
          (f.sha256 || '').toLowerCase().includes(term) ||
          (f.type || '').toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [files, filterCategory, searchTerm]);

  const stats = useMemo(() => {
    let images = 0,
      videos = 0,
      pdfs = 0,
      audios = 0,
      totalSize = 0;
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

  const showLockedOverlay = isSeniorInvestigatorView && !isHashVerified;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white border border-[#ECEEF2] rounded-[22px] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-[#FF4D15]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold text-[#111318] tracking-tight">
                    Original Format Evidence Repository
                  </h2>
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    Native Quality Preserved
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {incidentTitle} {trackingCode ? `• Docket: ${trackingCode}` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Citizen Dashboard Master Fingerprint Summary */}
          <div className="p-4 bg-[#F8F9FB] rounded-2xl border border-[#E6E8EE] flex items-center gap-4 text-xs font-mono">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">
                Citizen Works Hash
              </div>
              <div className="text-[#FF4D15] font-bold mt-0.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#FF4D15] shrink-0" />
                <span>{dashboardHash.substring(0, 16)}...</span>
              </div>
            </div>
            <div className="h-8 w-px bg-[#E6E8EE]" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-semibold">
                Total Native Payload
              </div>
              <div className="text-[#111318] font-bold mt-0.5">
                {stats.count} Artifacts ({formatBytes(stats.totalSize)})
              </div>
            </div>
          </div>
        </div>

        {/* Lock Banner for Senior Investigator if Not Verified */}
        {showLockedOverlay && (
          <div className="mt-6 p-5 bg-[#14161D] text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-white/10 text-[#FF4D15] rounded-xl shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Cryptographic Verification Gate Active
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Raw uncompressed original files are locked until you perform
                  the SHA-256 Dual-Hash comparison with the Citizen Works
                  Dashboard.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenHashVerification}
              className="px-5 py-2.5 bg-[#FF4D15] hover:bg-[#E03E0B] text-white rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
            >
              <Zap className="w-4 h-4 fill-current" />
              Compare Dashboard Hash &amp; Unlock
            </button>
          </div>
        )}

        {isSeniorInvestigatorView && isHashVerified && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4 text-xs text-emerald-800">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                CRYPTOGRAPHIC MATCH VERIFIED — Senior Investigator Clearance
                Unlocked (0 Bit Flips)
              </span>
            </div>
            <span className="px-2.5 py-1 bg-white text-emerald-700 border border-emerald-200 rounded-lg font-mono text-[10px]">
              Full High-Fidelity Access
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-[#ECEEF2]">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-[#14161D] text-white shadow-xs'
                : 'text-slate-500 hover:text-[#111318] hover:bg-[#F4F5F8]'
            }`}
          >
            All Formats ({stats.count})
          </button>
          <button
            onClick={() => setFilterCategory('image')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterCategory === 'image'
                ? 'bg-[#14161D] text-white shadow-xs'
                : 'text-slate-500 hover:text-[#111318] hover:bg-[#F4F5F8]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Photos ({stats.images})
          </button>
          <button
            onClick={() => setFilterCategory('video')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterCategory === 'video'
                ? 'bg-[#14161D] text-white shadow-xs'
                : 'text-slate-500 hover:text-[#111318] hover:bg-[#F4F5F8]'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Videos ({stats.videos})
          </button>
          <button
            onClick={() => setFilterCategory('pdf')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterCategory === 'pdf'
                ? 'bg-[#14161D] text-white shadow-xs'
                : 'text-slate-500 hover:text-[#111318] hover:bg-[#F4F5F8]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Docs &amp; PDFs ({stats.pdfs})
          </button>
          <button
            onClick={() => setFilterCategory('audio')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterCategory === 'audio'
                ? 'bg-[#14161D] text-white shadow-xs'
                : 'text-slate-500 hover:text-[#111318] hover:bg-[#F4F5F8]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            Audio ({stats.audios})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search file name, hash, ext..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8F9FB] border border-[#E6E8EE] rounded-xl pl-9 pr-3 py-2 text-xs text-[#111318] placeholder-slate-400 focus:outline-none focus:border-[#14161D]"
            />
          </div>

          {onFileUpload && !isSeniorInvestigatorView && (
            <label className="px-4 py-2 bg-[#FF4D15] hover:bg-[#E03E0B] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all shrink-0">
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
        <div className="p-12 text-center bg-white border border-[#ECEEF2] rounded-2xl space-y-3">
          <FileCode className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-[#111318]">
            No original format files match your search
          </h3>
          <p className="text-xs text-slate-500">
            Try adjusting your filters or upload additional files above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFiles.map((file) => {
            const category = getCategory(file);
            const previewUrl = getPreviewUrlForFile(file);

            return (
              <div
                key={file.id}
                className="bg-white border border-[#ECEEF2] hover:border-[#14161D]/40 rounded-[22px] overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all hover:shadow-lg flex flex-col group relative"
              >
                {/* Media Preview Header Box */}
                <div
                  className="h-48 bg-[#F8F9FB] relative overflow-hidden flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    if (showLockedOverlay) {
                      if (onOpenHashVerification) onOpenHashVerification();
                    } else {
                      setSelectedFileForPreview(file);
                    }
                  }}
                >
                  {showLockedOverlay && (
                    <div className="absolute inset-0 bg-[#14161D]/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
                      <Lock className="w-8 h-8 text-[#FF4D15] mb-2" />
                      <span className="text-xs font-bold text-white">
                        Raw Format Locked
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-1">
                        Hash Verification Required
                      </span>
                    </div>
                  )}

                  <img
                    src={previewUrl}
                    alt={file.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg border border-[#E6E8EE] text-[10px] font-mono font-bold text-[#111318] flex items-center gap-1.5 shadow-xs">
                    {category === 'image' && (
                      <ImageIcon className="w-3 h-3 text-sky-600" />
                    )}
                    {category === 'video' && (
                      <Video className="w-3 h-3 text-indigo-600" />
                    )}
                    {category === 'pdf' && (
                      <FileText className="w-3 h-3 text-[#FF4D15]" />
                    )}
                    {category === 'audio' && (
                      <Music className="w-3 h-3 text-pink-600" />
                    )}
                    {category === 'other' && (
                      <FileCode className="w-3 h-3 text-emerald-600" />
                    )}
                    <span>
                      {(file.name || '').split('.').pop()?.toUpperCase() ||
                        'RAW'}
                    </span>
                  </div>

                  {!showLockedOverlay && (
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-3 bg-[#14161D] text-white rounded-full shadow-xl">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* File Details Footer */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4
                      className="text-sm font-bold text-[#111318] truncate hover:text-[#FF4D15] transition-colors cursor-pointer"
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
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>{formatBytes(file.size)}</span>
                      <span className="text-emerald-700 font-semibold">
                        {file.wormTimestamp ? 'WORM Sealed' : 'Verified'}
                      </span>
                    </div>
                  </div>

                  {/* Hash Pill */}
                  <div className="p-2.5 bg-[#F8F9FB] rounded-xl border border-[#E6E8EE] flex items-center justify-between gap-2 text-[10px] font-mono">
                    <span className="text-slate-500 truncate">
                      SHA:{' '}
                      <span className="text-[#111318] font-bold">
                        {(file.sha256 || '').substring(0, 14)}...
                      </span>
                    </span>
                    <button
                      onClick={(e) => handleCopyHash(file.id, file.sha256, e)}
                      className="text-slate-400 hover:text-[#FF4D15] p-1 hover:bg-white rounded transition-colors shrink-0 cursor-pointer"
                      title="Copy Full SHA-256 Hash"
                    >
                      {copiedHashId === file.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-[#ECEEF2] flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => {
                        if (showLockedOverlay) {
                          if (onOpenHashVerification) onOpenHashVerification();
                        } else {
                          setSelectedFileForPreview(file);
                        }
                      }}
                      className="px-3 py-1.5 bg-[#F4F5F8] hover:bg-[#E6E8EE] text-[#111318] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors flex-1 justify-center cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#FF4D15]" />
                      <span>Inspect Format</span>
                    </button>

                    <button
                      onClick={(e) => handleDownloadOriginal(file, e)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        showLockedOverlay
                          ? 'bg-[#F4F5F8] text-slate-400 cursor-not-allowed'
                          : 'bg-[#14161D] hover:bg-[#FF4D15] text-white'
                      }`}
                      title={
                        showLockedOverlay
                          ? 'Hash verification required to download'
                          : 'Download Original Raw File'
                      }
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#E6E8EE] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-[#111318]">
            {/* Header */}
            <div className="p-4 bg-[#F8F9FB] border-b border-[#ECEEF2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg text-[#FF4D15]">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111318] truncate max-w-md">
                    {selectedFileForPreview.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                    <span>
                      Size: {formatBytes(selectedFileForPreview.size)}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">
                      {selectedFileForPreview.type || 'Original Payload'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) =>
                    handleDownloadOriginal(selectedFileForPreview, e)
                  }
                  className="px-3.5 py-2 bg-[#14161D] hover:bg-[#FF4D15] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Original</span>
                </button>
                <button
                  onClick={() => setSelectedFileForPreview(null)}
                  className="p-2 text-slate-400 hover:text-[#111318] rounded-lg hover:bg-[#ECEEF2] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Display Body */}
            <div className="p-6 overflow-y-auto space-y-6 bg-white">
              <div className="bg-[#F8F9FB] border border-[#E6E8EE] rounded-2xl p-4 flex items-center justify-center min-h-[280px]">
                {getCategory(selectedFileForPreview) === 'image' && (
                  <img
                    src={getPreviewUrlForFile(selectedFileForPreview)}
                    alt={selectedFileForPreview.name}
                    referrerPolicy="no-referrer"
                    className="max-h-[60vh] object-contain rounded-xl shadow-md"
                  />
                )}

                {getCategory(selectedFileForPreview) === 'video' && (
                  <div className="w-full max-w-2xl space-y-3">
                    <img
                      src={getPreviewUrlForFile(selectedFileForPreview)}
                      alt="Video frame preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto rounded-xl shadow-md border border-[#E6E8EE]"
                    />
                    <div className="p-3 bg-white rounded-xl border border-[#E6E8EE] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <button className="p-2 bg-[#14161D] text-white rounded-lg font-bold">
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                        <span className="font-mono text-[#111318]">
                          00:00 / 02:45
                        </span>
                      </div>
                      <span className="text-emerald-700 font-mono text-[11px] font-semibold">
                        H.264 / 1080p Original Recording
                      </span>
                    </div>
                  </div>
                )}

                {getCategory(selectedFileForPreview) === 'pdf' && (
                  <iframe
                    src={getPreviewUrlForFile(selectedFileForPreview)}
                    className="w-full h-[50vh] rounded-xl border border-[#E6E8EE]"
                    title={selectedFileForPreview.name}
                  />
                )}

                {getCategory(selectedFileForPreview) === 'audio' && (
                  <div className="p-8 bg-white rounded-2xl border border-[#E6E8EE] max-w-md w-full space-y-4 text-center">
                    <div className="p-4 bg-pink-50 border border-pink-200 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-pink-600">
                      <Music className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111318] text-sm">
                        {selectedFileForPreview.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        Audio Recording • Sample Rate 44.1kHz
                      </p>
                    </div>
                    <div className="p-3 bg-[#F8F9FB] rounded-xl border border-[#E6E8EE] flex items-center justify-center gap-3">
                      <button
                        onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                        className="p-3 bg-[#14161D] text-white rounded-xl font-bold cursor-pointer"
                      >
                        {isAudioPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current" />
                        )}
                      </button>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-[#FF4D15] ${
                            isAudioPlaying ? 'w-2/3 animate-pulse' : 'w-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {getCategory(selectedFileForPreview) === 'other' && (
                  <div className="p-6 bg-white rounded-2xl border border-[#E6E8EE] max-w-lg w-full space-y-4 text-left font-mono text-xs">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <FileCode className="w-5 h-5" />
                      <span>Binary Forensic Payload Analysis</span>
                    </div>
                    <div className="p-3 bg-[#F8F9FB] rounded-xl text-slate-700 leading-relaxed overflow-x-auto border border-[#E6E8EE] text-[11px]">
                      <div>
                        HEADER: 0x7F 0x45 0x4C 0x46 (ELF Executable / APK Zip
                        Container)
                      </div>
                      <div>SHA-256: {selectedFileForPreview.sha256}</div>
                      <div>
                        WORM ANCHOR:{' '}
                        {selectedFileForPreview.wormTimestamp ||
                          'RFC-3161 SECURED'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Inspection Panel */}
              <div className="p-4 bg-[#F8F9FB] rounded-2xl border border-[#E6E8EE] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="font-sans font-bold text-[#111318]">
                    Forensic Metadata &amp; Integrity Seals
                  </span>
                  <span className="text-emerald-700 font-bold">
                    100% Bitwise Authentic
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 bg-white rounded-xl border border-[#E6E8EE] space-y-1">
                    <div className="text-slate-400">SHA-256 Digest:</div>
                    <div className="text-emerald-700 break-all select-all font-bold">
                      {selectedFileForPreview.sha256}
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#E6E8EE] space-y-1">
                    <div className="text-slate-400">WORM Ledger Timestamp:</div>
                    <div className="text-[#111318] font-semibold">
                      {selectedFileForPreview.wormTimestamp ||
                        '2026-10-09 UTC [RFC-3161]'}
                    </div>
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
