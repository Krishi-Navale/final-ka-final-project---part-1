import React, { useState } from 'react';
import { hashFile, formatBytes, generateTrackingCode, generateWORMStamp, computeSHA256 } from '../utils/crypto';
import { EvidenceFile, IncidentReport, UserProfile } from '../types';
import { createIncidentAPI } from '../data/apiClient';
import { 
  X, 
  Upload, 
  Lock, 
  Hash, 
  CheckCircle2, 
  Trash2, 
  ArrowRight,
  ShieldAlert,
  UserCheck,
  EyeOff,
  User,
  Mail
} from 'lucide-react';

interface ComplaintDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSubmitIncident: (newIncident: IncidentReport) => void;
}

export const ComplaintDrawer: React.FC<ComplaintDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitIncident,
}) => {
  const [reportingPhase, setReportingPhase] = useState<'confidential' | 'registered'>(
    currentUser.name ? 'registered' : 'confidential'
  );

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Financial Cyber Fraud');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState(currentUser.name || '');
  const [citizenEmail, setCitizenEmail] = useState(currentUser.email || '');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenAddress, setCitizenAddress] = useState('');
  const [incidentPlace, setIncidentPlace] = useState('');
  const [incidentTime, setIncidentTime] = useState('');
  const [suspectDetails, setSuspectDetails] = useState('');
  const [lossAmount, setLossAmount] = useState('');
  const [folderMode, setFolderMode] = useState<'create' | 'choose'>('create');
  const [selectedFolderTitle, setSelectedFolderTitle] = useState('Campaign Assets / Case Folder');
  
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [isHashing, setIsHashing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<IncidentReport | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsHashing(true);
    const newItems: EvidenceFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const hash = await hashFile(file);
        const wormStamp = generateWORMStamp();
        
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (evt) => resolve((evt.target?.result as string) || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });

        newItems.push({
          id: `ev-${Date.now()}-${i}`,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          sha256: hash,
          wormTimestamp: wormStamp,
          previewUrl: dataUrl,
          rawContent: dataUrl
        });
      } catch (err) {
        console.error('Failed to hash file', err);
      }
    }

    setEvidenceFiles((prev) => [...prev, ...newItems]);
    setIsHashing(false);
  };

  const handleAddSampleScreenshot = async () => {
    setIsHashing(true);
    const samplePayload = `CYBER-EVIDENCE-TRANSACTION: UPI-REF#9981042918 to suspect-id@paytm on ${new Date().toISOString()}`;
    const hash = await computeSHA256(samplePayload);
    const svgDataUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%230f172a"/><rect x="40" y="40" width="720" height="520" rx="16" fill="%231e293b" stroke="%230284c7" stroke-width="2"/><text x="80" y="100" fill="%2338bdf8" font-family="monospace" font-size="20" font-weight="bold">UPI TRANSACTION RECEIPT FORENSIC CAPTURE</text><text x="80" y="160" fill="%23f8fafc" font-family="sans-serif" font-size="18">Debit: ₹1,48,500 INR to suspect-id@paytm</text><text x="80" y="200" fill="%2394a3b8" font-family="monospace" font-size="14">UTR: 9981042918 • Timestamp: ${new Date().toLocaleTimeString()}</text></svg>`;
    
    const item: EvidenceFile = {
      id: `ev-${Date.now()}`,
      name: 'screenshot_upi_fraud_receipt.png',
      size: 482910,
      type: 'image/png',
      sha256: hash,
      wormTimestamp: generateWORMStamp(),
      previewUrl: svgDataUrl,
      rawContent: svgDataUrl
    };
    setEvidenceFiles((prev) => [...prev, item]);
    setIsHashing(false);
  };

  const handleRemoveFile = (id: string) => {
    setEvidenceFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const determineSupervisor = (crimeCat: string) => {
    if (crimeCat.includes('Financial') || crimeCat.includes('Telegram')) {
      return {
        name: 'Balchandra K',
        title: 'Senior Evidence & Custody Inspector',
        agency: 'Maharashtra Cyber Crime Directorate',
        badge: 'MAH-CY-1109'
      };
    } else if (crimeCat.includes('Digital Arrest') || crimeCat.includes('Sextortion')) {
      return {
        name: 'Bibi Zohara',
        title: 'Lead Cyber Forensic Examiner',
        agency: 'IFSO Special Cell, Delhi Police',
        badge: 'DEL-CY-0842'
      };
    } else if (crimeCat.includes('Ransomware') || crimeCat.includes('Loan App')) {
      return {
        name: 'Afsheen S',
        title: 'Lead Malware Reverse Engineer',
        agency: 'INTERPOL Cyber Directorate',
        badge: 'INT-CY-4902'
      };
    } else {
      return {
        name: 'Krishi N',
        title: 'Chief Forensic Interdiction Officer',
        agency: 'National Cyber Crime Hub (I4C)',
        badge: 'I4C-NAT-7721'
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenEmail.trim()) {
      alert('Please enter your Gmail address so we can route your WORM token & email notifications.');
      return;
    }
    if (!title.trim() || !description.trim()) {
      alert('Please provide an incident title and description.');
      return;
    }

    setIsSubmitting(true);
    const trackingCode = generateTrackingCode();
    
    const combinedString = evidenceFiles.map(f => f.sha256).join(':') || `${title}:${description}:${Date.now()}`;
    const primaryHash = await computeSHA256(combinedString);
    const certId = `CERT-65B-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const supervisor = determineSupervisor(category);

    const isPrivate = reportingPhase === 'confidential';
    const finalCitizenName = isPrivate 
      ? 'Confidential Citizen (Identity Protected)' 
      : (citizenName.trim() || 'Registered Citizen');

    const newReport: IncidentReport = {
      id: `inc-${Date.now()}`,
      trackingCode,
      title,
      category,
      description,
      citizenName: finalCitizenName,
      citizenEmail: citizenEmail.trim(),
      isConfidentialReport: isPrivate,
      suspectDetails,
      lossAmount: lossAmount ? `₹${lossAmount}` : 'Unspecified',
      dateReported: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      status: 'WORM_LOCKED',
      primaryHash,
      folderName: selectedFolderTitle,
      address: citizenAddress,
      place: incidentPlace,
      time: incidentTime,
      evidenceFiles: evidenceFiles.length > 0 ? evidenceFiles : [
        {
          id: `ev-${Date.now()}`,
          name: 'incident_affidavit_narrative.txt',
          size: description.length,
          type: 'text/plain',
          sha256: primaryHash,
          wormTimestamp: generateWORMStamp()
        }
      ],
      seniorOfficerAssigned: `${supervisor.name} (${supervisor.title})`,
      officerBadge: supervisor.badge,
      officerNotes: `Case queued in WORM evidence vault. Assigned directly to ${supervisor.name} (${supervisor.agency}). Immediate cryptographic audit pending.`,
      legalAdmissibilityCertId: certId,
      rawOriginalContent: description,
      hashFormat: {
        sha256: primaryHash,
        merkleRoot: primaryHash.substring(0, 32),
        algorithm: 'SHA-256 / RFC-3161 WORM Ledger',
        byteSize: description.length,
        wormDigest: `WORM-LEDGER-BLK-${trackingCode.replace(/[^0-9]/g, '').slice(0, 6) || '849102'}-SEC65B`
      },
      custodyEvents: [
        {
          id: `cust-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          actor: isPrivate ? 'Anonymous Citizen Reporter' : `Citizen: ${finalCitizenName}`,
          role: 'Victim / Primary Reporter',
          action: isPrivate
            ? 'Incident reported confidentially with Gmail only. Evidence locked in WORM ledger with SHA-256 digests.'
            : 'Incident registered with verified citizen profile. Evidence locked in WORM ledger with SHA-256 digests.',
          merkleHash: primaryHash.substring(0, 16) + '...'
        },
        {
          id: `cust-${Date.now() + 1}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          actor: `Automated Dispatcher`,
          role: 'Custody Routing Engine',
          action: `Incident and evidence hash routed directly to Senior Supervisor: ${supervisor.name} [Badge: ${supervisor.badge}]`,
          merkleHash: primaryHash.substring(0, 16) + '...'
        }
      ]
    };

    // Post to Express Backend -> Dispatches Evidence Ingestion Email to Citizen's Gmail via Nodemailer
    await createIncidentAPI(newReport);

    onSubmitIncident(newReport);
    setIsSubmitting(false);
    setSubmittedReport(newReport);
  };

  const handleResetAndClose = () => {
    setSubmittedReport(null);
    setTitle('');
    setDescription('');
    setSuspectDetails('');
    setLossAmount('');
    setEvidenceFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop blur overlay */}
      <div 
        onClick={handleResetAndClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Ease Out Right Slide Drawer */}
      <div className="relative z-10 w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5A1F] text-white flex items-center justify-center shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">Citizen Case & Evidence Intake</h2>
              <p className="text-xs text-slate-500 font-mono-code">WORM Cryptographic Custody Intake</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 sm:p-8 flex-1 space-y-6">
          {submittedReport ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-950">
                  Evidence Cryptographically Locked!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mt-1">
                  Your incident has been written to the immutable WORM ledger. An official tracking confirmation email has been dispatched directly to <strong>{submittedReport.citizenEmail}</strong>.
                </p>
              </div>
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left font-mono-code text-xs space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Tracking Code:</span>
                  <span className="font-bold text-rose-600 text-sm">{submittedReport.trackingCode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Reporting Mode:</span>
                  <span className="text-slate-900 font-bold">
                    {submittedReport.isConfidentialReport ? '🔒 Confidential (Gmail Only)' : '👤 Registered Citizen'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Gmail Notification:</span>
                  <span className="text-emerald-700 font-bold">Dispatched to {submittedReport.citizenEmail}</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-[11px] text-slate-500">Assigned Senior Supervisor:</div>
                  <div className="text-slate-900 font-bold text-xs mt-0.5">{submittedReport.seniorOfficerAssigned}</div>
                  <div className="text-[#FF5A1F] text-[10px] font-bold">Badge ID: {submittedReport.officerBadge}</div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-8 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-full text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Citizen Case Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-rose-300" />
                </button>
              </div>
            </div>
          ) : (
            <form id="incident-form" onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <div className="text-[11px] font-mono-code uppercase font-bold text-slate-500">
                  Step 1: Choose Reporting Identity Mode
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setReportingPhase('confidential')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      reportingPhase === 'confidential'
                        ? 'border-[#FF5A1F] bg-orange-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <EyeOff className="w-4 h-4 text-[#FF5A1F]" />
                        <span className="font-bold text-xs text-slate-950">Confidential Report</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <strong>Zero Name Required.</strong> Keeps your identity 100% private. Just provide a Gmail address for tracking.
                    </p>
                  </div>

                  <div
                    onClick={() => setReportingPhase('registered')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      reportingPhase === 'registered'
                        ? 'border-slate-900 bg-slate-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-slate-900" />
                        <span className="font-bold text-xs text-slate-950">Registered Citizen</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Provide your full legal name to appear on the official Section 65B judicial court affidavit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
                <div className="leading-relaxed text-[11px]">
                  {reportingPhase === 'confidential' ? (
                    <span><strong>Private Reporting Active:</strong> Your name will NOT be recorded. Email tracking notifications will be sent directly to your Gmail.</span>
                  ) : (
                    <span><strong>Verified Citizen Active:</strong> Your legal name will be affixed to the WORM Section 65B record and confirmed via Gmail.</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {reportingPhase === 'registered' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Full Legal Name (Appears on Court Certificate)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Gmail Address (Mandatory for Email Tracking Notifications)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={citizenEmail}
                      onChange={(e) => setCitizenEmail(e.target.value)}
                      placeholder="Enter your Gmail address"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number (SMS / 1930 Nodal Updates)
                  </label>
                  <input
                    type="tel"
                    required
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Place / Location of Incident
                  </label>
                  <input
                    type="text"
                    value={incidentPlace}
                    onChange={(e) => setIncidentPlace(e.target.value)}
                    placeholder="e.g. New Delhi / Mumbai / Bank Branch"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Time & Date of Incident
                  </label>
                  <input
                    type="text"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    placeholder="e.g. 14:30 IST, Oct 9, 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Cybercrime Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                  >
                    <option value="Financial Cyber Fraud">Financial Cyber Fraud (UPI / Bank / UTR)</option>
                    <option value="Digital Arrest & Agency Coercion">Digital Arrest & Agency Coercion (Skype/CBI)</option>
                    <option value="Telegram / Job Rating Scam">Telegram / Job Rating Scam</option>
                    <option value="Video Call Sextortion">Video Call Sextortion & Blackmail</option>
                    <option value="Predatory Loan App Harassment">Predatory Loan App Harassment</option>
                    <option value="SIM Swap & OTP Theft">SIM Swap & OTP Theft</option>
                    <option value="Ransomware / Data Extortion">Ransomware / Data Extortion</option>
                    <option value="Other Cyber Offence">Other Cyber Offence</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Estimated Loss (if financial)
                  </label>
                  <input
                    type="text"
                    value={lossAmount}
                    onChange={(e) => setLossAmount(e.target.value)}
                    placeholder="e.g. 1,48,500 or 0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Residential / Business Address
                </label>
                <input
                  type="text"
                  required
                  value={citizenAddress}
                  onChange={(e) => setCitizenAddress(e.target.value)}
                  placeholder="Enter your complete address"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Incident Title / Headline
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Unauthorized UPI debit following electricity bill SMS threat"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Suspect Identifiers (Phone, UPI, Bank Acc, Skype, or URL - Optional)
                </label>
                <input
                  type="text"
                  value={suspectDetails}
                  onChange={(e) => setSuspectDetails(e.target.value)}
                  placeholder="e.g. Phone: +91-98765-43210, UPI: fraudpayment@oksbi, Skype: cbi_hq_delhi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Detailed Sequence of Incident
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain exactly what happened, dates, times, and what links or apps you were asked to install..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F] leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Upload Raw Evidence Files
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSampleScreenshot}
                    className="text-[11px] text-[#FF5A1F] hover:underline font-bold"
                  >
                    + Attach Demo Fraud Screenshot
                  </button>
                </div>

                <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 text-center transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700 mb-1">
                    Drag and drop screenshots, bank PDFs, audio notes, or APK files
                  </p>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Files are instantly hashed locally using browser SHA-256 WebCrypto
                  </p>
                  
                  <label className="inline-block px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-800 cursor-pointer shadow-sm">
                    Browse Files
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {isHashing && (
                  <div className="mt-3 text-xs text-[#FF5A1F] flex items-center gap-2 animate-pulse font-mono-code font-bold">
                    <Hash className="w-3.5 h-3.5" />
                    <span>Computing client-side SHA-256 digests...</span>
                  </div>
                )}

                {evidenceFiles.length > 0 && (
                  <div className="mt-4 space-y-2.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Hashed Evidence Payload ({evidenceFiles.length})
                    </div>
                    {evidenceFiles.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between gap-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 truncate max-w-[320px]">
                            {ev.name}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500 font-mono-code text-[11px]">
                              {formatBytes(ev.size)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(ev.id)}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="font-mono-code text-[10px] text-slate-700 bg-white p-1.5 rounded-lg border border-slate-200 break-all font-semibold">
                          <span className="text-[#FF5A1F] font-bold mr-1">SHA256:</span>
                          {ev.sha256}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {!submittedReport && (
          <div className="p-6 border-t border-slate-200 bg-white sticky bottom-0 z-20 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="incident-form"
              disabled={isSubmitting || isHashing}
              className="px-7 py-3.5 bg-[#FF5A1F] hover:bg-[#E04B14] disabled:opacity-50 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <span>Writing to WORM & Dispatching Email...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-white" />
                  <span>Commit to WORM Ledger & Dispatch Email Confirmation ↗</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
