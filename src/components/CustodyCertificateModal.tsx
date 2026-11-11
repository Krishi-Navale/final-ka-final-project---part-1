import React from 'react';
import { IncidentReport } from '../types';
import { X, ShieldCheck, Scale, Printer, CheckCircle2, Lock } from 'lucide-react';

interface CustodyCertificateModalProps {
  incident: IncidentReport | null;
  onClose: () => void;
}

export const CustodyCertificateModal: React.FC<CustodyCertificateModalProps> = ({
  incident,
  onClose,
}) => {
  if (!incident) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity" 
      />

      {/* Certificate Modal Container */}
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Official Electronic Evidence Certificate (Sec. 65B Indian Evidence Act)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Document */}
        <div className="p-8 sm:p-12 text-slate-900 font-sans space-y-6 print:p-6">
          
          {/* Header Seal & Emblem */}
          <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center shadow mb-2">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-600">
              National Forensic Evidence Custody Repository
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950">
              CERTIFICATE OF ELECTRONIC EVIDENCE ADMISSIBILITY
            </h2>
            <div className="text-xs font-serif-italic text-slate-500">
              Pursuant to Section 65B(4) of the Indian Evidence Act, 1872 & ISO/IEC 27037 Forensic Chain Standards
            </div>
          </div>

          {/* Certificate Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono-code bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500 block">Certificate No:</span>
              <span className="font-bold text-slate-900">{incident.legalAdmissibilityCertId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Incident Tracking Code:</span>
              <span className="font-bold text-rose-600">{incident.trackingCode}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Citizen Deponent:</span>
              <span className="font-bold text-slate-900">
                {incident.isConfidentialReport
                  ? `Confidential Citizen (Identity Protected · ${incident.citizenEmail})`
                  : incident.citizenName}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Commitment Timestamp:</span>
              <span className="font-bold text-slate-900">{incident.dateReported}</span>
            </div>
          </div>

          {/* Case Narrative */}
          <div className="space-y-1.5 text-xs">
            <div className="font-bold uppercase tracking-wider text-slate-600">Incident Classification:</div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 leading-relaxed">
              <div className="font-bold mb-1">{incident.category}: {incident.title}</div>
              <p className="text-slate-600">{incident.description}</p>
            </div>
          </div>

          {/* Primary Cryptographic Hash */}
          <div className="space-y-1.5 text-xs font-mono-code">
            <div className="font-bold uppercase tracking-wider text-slate-600">
              Cryptographic SHA-256 Merkle Digest:
            </div>
            <div className="p-3 bg-slate-950 text-rose-200 rounded-xl break-all leading-relaxed">
              {incident.primaryHash}
            </div>
          </div>

          {/* Itemized Evidence Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Itemized Cryptographic Evidence File Record:
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-code border border-slate-200">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="p-2 border-b">File Name</th>
                    <th className="p-2 border-b">Size</th>
                    <th className="p-2 border-b">SHA-256 Digest</th>
                    <th className="p-2 border-b">WORM Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {incident.evidenceFiles.map((ev, i) => (
                    <tr key={ev.id} className="text-[11px]">
                      <td className="p-2 font-bold text-slate-900">{ev.name}</td>
                      <td className="p-2 text-slate-600">{ev.size} B</td>
                      <td className="p-2 text-slate-600 break-all max-w-[200px]">{ev.sha256.substring(0, 20)}...</td>
                      <td className="p-2 text-emerald-700 font-bold">LOCKED</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Officer Attestation & Digital Stamp */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-xs">
            <div className="sm:col-span-2 space-y-2 text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900">
                <strong>STATUTORY AFFIDAVIT UNDER SECTION 65B(4):</strong>
              </p>
              <p className="text-[11px] text-slate-600">
                I, <strong>{incident.seniorOfficerAssigned}</strong> ({incident.officerBadge}), do hereby solemnly affirm and state on oath that the electronic devices and server nodes housing the aforementioned evidence were operating under normal control. The cryptographic Merkle root digest was calculated at intake and remains unperturbed across write-once media (WORM).
              </p>
              <div className="flex items-center gap-2 text-[10px] font-mono-code text-slate-500 pt-1">
                <span>Verification QR Code:</span>
                <span className="font-bold text-slate-900">fip-cert-qr://{incident.legalAdmissibilityCertId}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border-2 border-slate-900 bg-slate-50 text-center font-mono-code space-y-1.5 shadow-sm">
              {/* QR Graphic Mock */}
              <div className="w-16 h-16 mx-auto bg-slate-950 p-1 rounded-lg flex items-center justify-center">
                <div className="w-full h-full border-2 border-dashed border-amber-400 bg-slate-900 flex items-center justify-center text-[9px] text-amber-300 font-bold">
                  SEC-65B
                </div>
              </div>

              <div className="text-emerald-700 font-black text-[11px] flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>COURT ADMISSIBLE</span>
              </div>
              <div className="font-extrabold text-slate-900 text-xs">{incident.seniorOfficerAssigned}</div>
              <div className="text-slate-600 text-[10px] font-bold">Badge: {incident.officerBadge}</div>
              <div className="text-slate-400 text-[9px]">Cyber Police IFSO / Judicial Seal</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
