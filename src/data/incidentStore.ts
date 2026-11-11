import { IncidentReport, UserProfile } from '../types';
import { generateWORMStamp } from '../utils/crypto';
import { createIncidentAPI } from './apiClient';

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc-94812',
    trackingCode: 'IN-CFC-2026-849102',
    title: 'Financial Phishing & Unauthorized UPI Debit via Malicious Electricity APK',
    category: 'Financial Cyber Fraud',
    description: 'Received SMS stating electricity power will be disconnected at 9:30 PM due to unpaid bill. Instructed to call electricity officer at +91-98210-XXXXX. The caller directed installation of "BijliBill_Update.apk" which redirected OTPs and debited ₹1,48,500 across two transactions.',
    citizenName: 'Rahul Verma',
    citizenEmail: 'rahul.verma@gmail.com',
    suspectDetails: 'Phone: +91-98210-44912, UPI: powerelectric99@axl, Target Account: 5010049281920',
    lossAmount: '₹1,48,500 INR',
    dateReported: '2026-10-08 14:22:10 UTC',
    status: 'VERIFIED',
    primaryHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    evidenceFiles: [
      {
        id: 'ev-1',
        name: 'sms_disconnection_threat.png',
        size: 421980,
        type: 'image/png',
        sha256: '9b8a5c37894101e4a2bc1d88924f0c78a101b0928e469c890f55c8227b401201',
        wormTimestamp: '2026-10-08 14:22:15 UTC [RFC-3161-WORM]',
        previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%230F172A"/><rect x="40" y="40" width="720" height="520" rx="20" fill="%231E293B" stroke="%23334155" stroke-width="2"/><rect x="80" y="80" width="640" height="70" rx="12" fill="%230284C7" opacity="0.15"/><text x="110" y="125" fill="%2338BDF8" font-family="monospace" font-size="20" font-weight="bold">SMS DISCONNECTION EXTORTION SCREENSHOT</text><rect x="80" y="180" width="640" height="220" rx="16" fill="%230F172A" stroke="%2338BDF8" stroke-width="1.5"/><text x="110" y="230" fill="%23F8FAFC" font-family="sans-serif" font-size="16">Sender: +91-98210-44912 (Electricity Nodal Officer)</text><text x="110" y="270" fill="%23F43F5E" font-family="sans-serif" font-size="15" font-weight="bold">"Your power supply will be cut off at 9:30 PM tonight."</text><text x="110" y="310" fill="%23CBD5E1" font-family="sans-serif" font-size="14">"Call immediately or pay via BijliBill_Update.apk to stay disconnection."</text><rect x="80" y="430" width="640" height="90" rx="12" fill="%230F172A" stroke="%2310B981"/><text x="110" y="465" fill="%2310B981" font-family="monospace" font-size="13" font-weight="bold">HASH KEY: 9b8a5c37894101e4a2bc1d88924f0c78a101b0928e469c890f55c8227b401201</text><text x="110" y="495" fill="%2394A3B8" font-family="monospace" font-size="11">WORM ANCHORED · RFC-3161 TIMESTAMPED · NATIVE PNG PRESERVED</text></svg>',
        rawContent: 'SMS-RAW-DUMP: Sender="+91-98210-44912" Timestamp="2026-10-08 14:15:22" Body="Dear Customer, Your electricity power will be disconnected tonight at 09:30 PM from the power station because your previous month bill was not updated. Please immediately contact our power officer at +91-98210-44912. Thank you."',
        hashFormat: {
          sha256: '9b8a5c37894101e4a2bc1d88924f0c78a101b0928e469c890f55c8227b401201',
          algorithm: 'SHA-256 (NIST FIPS 180-4)',
          byteLength: 421980,
          hashDigestFormatted: '9B8A5C37894101E4A2BC1D88924F0C78A101B0928E469C890F55C8227B401201'
        }
      },
      {
        id: 'ev-2',
        name: 'bank_statement_unauthorized_debits.pdf',
        size: 1104820,
        type: 'application/pdf',
        sha256: '3f78a2e1904b6c810427a19c5b2067e8890284b1a459bca40277884102839912',
        wormTimestamp: '2026-10-08 14:22:18 UTC [RFC-3161-WORM]',
        previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%230F172A"/><rect x="80" y="40" width="640" height="520" rx="16" fill="%231E293B" stroke="%2338BDF8" stroke-width="2"/><text x="120" y="90" fill="%2338BDF8" font-family="monospace" font-size="20" font-weight="bold">BANK OF COMMERCE - UNAUTHORIZED DEBIT STATEMENT</text><line x1="120" y1="110" x2="680" y2="110" stroke="%23334155" stroke-width="2"/><text x="120" y="150" fill="%23F8FAFC" font-family="sans-serif" font-size="15">Account No: 5010049281920 • Victim: Rahul Verma</text><text x="120" y="190" fill="%23F43F5E" font-family="monospace" font-size="16" font-weight="bold">DEBIT 1: ₹ 98,500.00 | UTR: 994820194820 | Beneficiary: powerelectric99@axl</text><text x="120" y="230" fill="%23F43F5E" font-family="monospace" font-size="16" font-weight="bold">DEBIT 2: ₹ 50,000.00 | UTR: 994820194821 | Beneficiary: powerelectric99@axl</text><text x="120" y="280" fill="%2394A3B8" font-family="sans-serif" font-size="14">Total Fraudulent Transit: ₹ 1,48,500 INR (1930 Lien Marked)</text><rect x="120" y="380" width="560" height="130" rx="12" fill="%230F172A" stroke="%2310B981"/><text x="140" y="420" fill="%2310B981" font-family="monospace" font-size="13" font-weight="bold">SHA-256: 3f78a2e1904b6c810427a19c5b2067e8890284b1a459bca40277884102839912</text><text x="140" y="455" fill="%23CBD5E1" font-family="monospace" font-size="11">CERTIFIED SECTION 65B INDIAN EVIDENCE ACT COMPLIANT</text></svg>',
        rawContent: 'STATEMENT-RAW-PDF: UTR="994820194820" Amount="₹98,500.00" Beneficiary="powerelectric99@axl" MuleBank="HDFC 0492" UTR2="994820194821" Amount2="₹50,000.00" Timestamp="2026-10-08 14:18:02" Total="₹1,48,500.00" Status="MULE_ACCOUNT_LIEN_HOLD"',
        hashFormat: {
          sha256: '3f78a2e1904b6c810427a19c5b2067e8890284b1a459bca40277884102839912',
          algorithm: 'SHA-256 (NIST FIPS 180-4)',
          byteLength: 1104820,
          hashDigestFormatted: '3F78A2E1904B6C810427A19C5B2067E8890284B1A459BCA40277884102839912'
        }
      },
      {
        id: 'ev-3',
        name: 'malicious_bijlibill_payload.apk',
        size: 4892010,
        type: 'application/vnd.android.package-archive',
        sha256: 'd41d8cd98f00b204e9800998ecf8427e990b7a819c43a027bc91024849182310',
        wormTimestamp: '2026-10-08 14:22:21 UTC [RFC-3161-WORM]',
        previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%230F172A"/><rect x="40" y="40" width="720" height="520" rx="20" fill="%231E293B" stroke="%23E11D48" stroke-width="2"/><text x="80" y="100" fill="%23FB7185" font-family="monospace" font-size="22" font-weight="bold">MALICIOUS TROJAN APK BINARY DISASSEMBLY</text><text x="80" y="160" fill="%23F8FAFC" font-family="monospace" font-size="16">Package: com.bijlibill.update • Permissions: BIND_ACCESSIBILITY_SERVICE</text><text x="80" y="210" fill="%23F8FAFC" font-family="monospace" font-size="16">C2 Host: 185.220.101.42:8443 (Russia / Tor Relay)</text><text x="80" y="260" fill="%23FB7185" font-family="monospace" font-size="15">Exploit: SMS Receiver hook exfiltrating OTP to remote Telegram bot</text><rect x="80" y="380" width="640" height="130" rx="12" fill="%230F172A" stroke="%23FB7185"/><text x="110" y="425" fill="%23FB7185" font-family="monospace" font-size="13" font-weight="bold">SHA-256: d41d8cd98f00b204e9800998ecf8427e990b7a819c43a027bc91024849182310</text><text x="110" y="460" fill="%2394A3B8" font-family="monospace" font-size="11">VIRUSTOTAL MATCH: 48/68 DETECTIONS (BANKBOT / SPYWARE)</text></svg>',
        rawContent: 'APK-DECOMPILED-MANIFEST: package="com.bijlibill.update" uses-permission="android.permission.RECEIVE_SMS" uses-permission="android.permission.INTERNET" uses-permission="android.permission.BIND_ACCESSIBILITY_SERVICE" C2_HOST="185.220.101.42:8443" OTP_HOOK="EXFILTRATE_ALL_BANK_SMS" RAW_HASH="d41d8cd98f00b204e9800998ecf8427e990b7a819c43a027bc91024849182310"',
        hashFormat: {
          sha256: 'd41d8cd98f00b204e9800998ecf8427e990b7a819c43a027bc91024849182310',
          algorithm: 'SHA-256 (NIST FIPS 180-4)',
          byteLength: 4892010,
          hashDigestFormatted: 'D41D8CD98F00B204E9800998ECF8427E990B7A819C43A027BC91024849182310'
        }
      }
    ],
    seniorOfficerAssigned: 'Bibi Zohara (Lead Forensic Examiner)',
    officerBadge: 'CYBER-DEL-0842',
    officerNotes: 'Bit-level forensic hash match confirmed against raw binary payloads. Section 65B Certificate generated. Immediate freeze request dispatched to NPCI and beneficiary bank.',
    legalAdmissibilityCertId: 'CERT-65B-2026-DEL-99120',
    rawOriginalContent: 'SMS Received: "Dear Customer, Your electricity power will be disconnected tonight at 09:30 PM from the power station because your previous month bill was not updated. Please immediately contact our power officer at +91-98210-44912. Thank you." - Direct raw submission from Rahul Verma via web form on 2026-10-08 14:22:10 UTC.',
    hashFormat: {
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      merkleRoot: '8b7a6c3f19a002eb7492019482104820',
      algorithm: 'SHA-256 / RFC-3161 WORM Ledger',
      byteSize: 312,
      wormDigest: 'WORM-LEDGER-BLK-849102-SEC65B'
    },
    custodyEvents: [
      {
        id: 'cust-1',
        timestamp: '2026-10-08 14:22:10 UTC',
        actor: 'Citizen: Rahul Verma',
        role: 'Victim / Primary Reporter',
        action: 'Evidence payload uploaded and locked in WORM ledger with SHA-256 digests',
        merkleHash: '8b7a6c...4920'
      },
      {
        id: 'cust-2',
        timestamp: '2026-10-08 15:04:32 UTC',
        actor: 'Bibi Zohara',
        role: 'Senior Cyber Investigator (Cyber Cell IFSO)',
        action: 'Cryptographic hash signature independently verified. No byte mutation detected.',
        merkleHash: 'e3b0c4...b855'
      },
      {
        id: 'cust-3',
        timestamp: '2026-10-08 16:30:00 UTC',
        actor: 'Automated Judicial Engine',
        role: 'Evidence Repository',
        action: 'Issued Section 65B Electronic Evidence Admissibility Certificate for magistrate court submission',
        merkleHash: 'fa2109...3180'
      }
    ]
  },
  {
    id: 'inc-94813',
    trackingCode: 'IN-CFC-2026-849103',
    title: 'Extortion Attempt via Deepfake Morphing and Skype "Digital Arrest"',
    category: 'Digital Arrest & Coercive Impersonation',
    description: 'Suspects impersonated Telecom Regulatory Authority and CBI officers, staging a fake courtroom video call claiming victim\'s Aadhaar was used in illegal drug shipments from Mumbai to Cambodia.',
    citizenName: 'Dr. Ananya Sen',
    citizenEmail: 'ananya.sen@gmail.com',
    suspectDetails: 'Skype ID: live:cbi_investigation_hq, WhatsApp: +91-88120-99410',
    lossAmount: '₹0 (Prevented via Golden Hour Alert)',
    dateReported: '2026-10-09 03:15:40 UTC',
    status: 'WORM_LOCKED',
    primaryHash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    evidenceFiles: [
      {
        id: 'ev-4',
        name: 'skype_video_call_screen_recording.mp4',
        size: 18400290,
        type: 'video/mp4',
        sha256: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
        wormTimestamp: '2026-10-09 03:15:45 UTC [RFC-3161-WORM]',
        previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%230F172A"/><rect x="40" y="40" width="720" height="520" rx="20" fill="%231E293B" stroke="%23818CF8" stroke-width="2"/><circle cx="400" cy="240" r="50" fill="%236366F1"/><polygon points="390,220 425,240 390,260" fill="%23FFFFFF"/><text x="80" y="340" fill="%23A5B4FC" font-family="monospace" font-size="20" font-weight="bold">SKYPE EXTORTION CALL VIDEO RECORDING (H.264 / AAC)</text><text x="80" y="380" fill="%23F8FAFC" font-family="sans-serif" font-size="15">Impersonator: "DCP Crime Branch Alok Verma" demanding ₹25 Lakhs</text><rect x="80" y="430" width="640" height="90" rx="12" fill="%230F172A" stroke="%23818CF8"/><text x="110" y="465" fill="%23818CF8" font-family="monospace" font-size="13" font-weight="bold">SHA-256: 4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b</text><text x="110" y="495" fill="%2394A3B8" font-family="monospace" font-size="11">ORIGINAL 1080P CONTAINER PRESERVED · SPECTROGRAM CERTIFIED</text></svg>',
        rawContent: 'VIDEO-RECORDING-METADATA: Duration="14:22" Codec="H.264/AAC" FPS="30" Bitrate="4200kbps" AudioChannels="2" Impersonator="DCP Alok Verma" Resolution="1920x1080" RawHash="4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b"',
        hashFormat: {
          sha256: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
          algorithm: 'SHA-256 (NIST FIPS 180-4)',
          byteLength: 18400290,
          hashDigestFormatted: '4A5E1E4BAAB89F3A32518A88C31BC87F618F76673E2CC77AB2127B7AFDEDA33B'
        }
      },
      {
        id: 'ev-5',
        name: 'fake_cbi_arrest_warrant_letter.pdf',
        size: 890120,
        type: 'application/pdf',
        sha256: 'c37a892b102948cfba0912e77b4a9218209381cba908124976a1002983719044',
        wormTimestamp: '2026-10-09 03:15:48 UTC [RFC-3161-WORM]',
        previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%230F172A"/><rect x="80" y="40" width="640" height="520" rx="16" fill="%231E293B" stroke="%23F59E0B" stroke-width="2"/><text x="120" y="90" fill="%23FBBF24" font-family="serif" font-size="22" font-weight="bold">CENTRAL BUREAU OF INVESTIGATION (FORGED WARRANT)</text><line x1="120" y1="110" x2="680" y2="110" stroke="%23334155" stroke-width="2"/><text x="120" y="150" fill="%23F43F5E" font-family="sans-serif" font-size="16" font-weight="bold">FORGED NOTICE: Section 41A CrPC Arrest Warrant</text><text x="120" y="190" fill="%23F8FAFC" font-family="sans-serif" font-size="14">Allegation: Money laundering link to Cambodia syndicate</text><text x="120" y="230" fill="%23CBD5E1" font-family="sans-serif" font-size="14">Demand: Transfer security bond to escrow account immediately</text><rect x="120" y="380" width="560" height="130" rx="12" fill="%230F172A" stroke="%23F59E0B"/><text x="140" y="420" fill="%23FBBF24" font-family="monospace" font-size="13" font-weight="bold">SHA-256: c37a892b102948cfba0912e77b4a9218209381cba908124976a1002983719044</text><text x="140" y="455" fill="%23CBD5E1" font-family="monospace" font-size="11">EXIF ANALYSIS: FORGERY GENERATED ON CANVA / ADOBE ACROBAT</text></svg>',
        rawContent: 'FORGED-WARRANT-TEXT: "CENTRAL BUREAU OF INVESTIGATION SPECIAL CELL NEW DELHI. Subject: Provisional arrest order under Section 41A CrPC. You are hereby ordered to join video interrogation or face non-bailable warrant." Forgery verified by Balchandra K.',
        hashFormat: {
          sha256: 'c37a892b102948cfba0912e77b4a9218209381cba908124976a1002983719044',
          algorithm: 'SHA-256 (NIST FIPS 180-4)',
          byteLength: 890120,
          hashDigestFormatted: 'C37A892B102948CFBA0912E77B4A9218209381CBA908124976A1002983719044'
        }
      }
    ],
    seniorOfficerAssigned: 'Balchandra K (Superintendent of Cyber Forensics)',
    officerBadge: 'CYBER-MAH-1109',
    officerNotes: 'Evidence locked in WORM ledger. Video facial synthesis and audio spectral analysis verified by Afsheen S & Krishi N.',
    legalAdmissibilityCertId: 'CERT-65B-2026-MAH-84019',
    rawOriginalContent: 'Skype session metadata: Call originated from IP 185.220.101.5 (Tor Exit Relay). Perpetrators claimed: "This is Cyber Crime Branch, your Aadhaar is linked to illegal parcel containing 16 passports and contraband." Instructed victim to transfer ₹12,00,000 security deposit. Direct statement provided by Dr. Ananya Sen.',
    hashFormat: {
      sha256: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
      merkleRoot: 'c37a892b102948cfba0912e77b4a9218',
      algorithm: 'SHA-256 / RFC-3161 WORM Ledger',
      byteSize: 420,
      wormDigest: 'WORM-LEDGER-BLK-849103-SEC65B'
    },
    custodyEvents: [
      {
        id: 'cust-4',
        timestamp: '2026-10-09 03:15:40 UTC',
        actor: 'Citizen: Dr. Ananya Sen',
        role: 'Victim / Primary Reporter',
        action: 'Evidence submitted and sealed under WORM storage rules',
        merkleHash: '4a5e1e...a33b'
      }
    ]
  }
];

export const SENIOR_INVESTIGATORS = [
  { id: 1, name: '1. BIBI ZOHARA', role: 'Lead Forensic Examiner', badge: 'DEL-CY-0842' },
  { id: 2, name: '2. BALCHANDRA', role: 'Superintendent Cyber', badge: 'MAH-CY-1109' },
  { id: 3, name: '3. AFSHEEN S', role: 'Cryptographic Forensics', badge: 'BLR-CY-4402' },
  { id: 4, name: '4. KRISHI', role: 'Senior Investigator & Nodal', badge: 'I4C-NAT-7721' },
];

export const INITIAL_USER: UserProfile = {
  name: '',
  email: '',
  role: 'citizen',
  isAnonymous: true
};

const STORAGE_KEY_INCIDENTS = 'forensicrypt_incidents_v1';
const STORAGE_KEY_USER = 'forensicrypt_user_v1';

export function getStoredIncidents(): IncidentReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INCIDENTS);
    let list: IncidentReport[] = raw ? JSON.parse(raw) : INITIAL_INCIDENTS;

    // Normalize incidents
    list = list.map(inc => ({
      ...inc,
      investigationProgress: typeof inc.investigationProgress === 'number' 
        ? inc.investigationProgress 
        : (inc.status === 'VERIFIED' ? 85 : (inc.status === 'ASSIGNED' ? 50 : 30)),
      investigatorStudyNotes: inc.investigatorStudyNotes || inc.officerNotes || '',
      investigatorMessages: inc.investigatorMessages || [],
      rawOriginalContent: inc.rawOriginalContent || inc.description,
      hashFormat: inc.hashFormat || {
        sha256: inc.primaryHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        merkleRoot: (inc.primaryHash || 'e3b0c442').substring(0, 32),
        algorithm: 'SHA-256 / RFC-3161 WORM Ledger',
        byteSize: (inc.description || '').length,
        wormDigest: `WORM-LEDGER-BLK-${(inc.trackingCode || 'REC').replace(/[^0-9]/g, '').slice(0, 6) || '849102'}-SEC65B`
      }
    }));

    // Auto-sync folders for all registered citizen accounts so each has a dedicated folder
    const accounts = getRegisteredAccounts();
    let hasChanges = false;
    Object.values(accounts).forEach((acc, idx) => {
      if (!acc.email) return;
      const existing = list.find(i => i.citizenEmail?.toLowerCase() === acc.email.toLowerCase());
      if (!existing) {
        const assignedOfficer = SENIOR_INVESTIGATORS[idx % SENIOR_INVESTIGATORS.length];
        const displayName = acc.name || acc.email.split('@')[0];
        const newFolder: IncidentReport = {
          id: `inc-acc-${Date.now()}-${idx}`,
          trackingCode: `IN-CFC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          title: `Dedicated Evidence Folder: ${displayName}`,
          category: 'Citizen Cyber Evidence',
          description: `Dedicated evidentiary folder for ${displayName} (${acc.email}). All citizen uploaded evidence is stored here under WORM tamper-proof integrity for Senior Investigator review.`,
          citizenName: displayName,
          citizenEmail: acc.email,
          suspectDetails: 'Direct Intake Session',
          lossAmount: 'Evidence Protected',
          dateReported: acc.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          status: 'WORM_LOCKED',
          primaryHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          evidenceFiles: [],
          seniorOfficerAssigned: `${assignedOfficer.name} (${assignedOfficer.role})`,
          officerBadge: assignedOfficer.badge,
          officerNotes: `Dedicated citizen folder allocated. Assigned to ${assignedOfficer.name}.`,
          legalAdmissibilityCertId: `CERT-65B-2026-CIT-${Math.floor(10000 + Math.random() * 90000)}`,
          rawOriginalContent: `Dedicated folder initialized for ${displayName} (${acc.email}). Awaiting evidentiary uploads.`,
          hashFormat: {
            sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            merkleRoot: 'e3b0c44298fc1c149afbf4c8996fb924',
            algorithm: 'SHA-256 / RFC-3161 WORM Ledger',
            byteSize: 1024,
            wormDigest: `WORM-LEDGER-BLK-${Math.floor(100000 + Math.random() * 900000)}-SEC65B`
          },
          custodyEvents: [
            {
              id: `cust-init-${Date.now()}-${idx}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
              actor: `Citizen: ${displayName}`,
              role: 'Citizen / Account Holder',
              action: `Account created. Dedicated evidence folder uploaded to Senior Investigator Workstation.`,
              merkleHash: 'e3b0c4...b855'
            }
          ]
        };
        list = [newFolder, ...list];
        hasChanges = true;
      }
    });

    if (hasChanges || !raw) {
      localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(list));
    }

    return list;
  } catch {
    return INITIAL_INCIDENTS;
  }
}

export function ensureCitizenFolderExists(
  user: UserProfile,
  currentList: IncidentReport[]
): { updatedList: IncidentReport[]; folder: IncidentReport } {
  if (!user.email) return { updatedList: currentList, folder: currentList[0] };
  
  const displayName = user.name?.trim() || user.email.split('@')[0];
  const existingIdx = currentList.findIndex(
    i => i.citizenEmail?.toLowerCase() === user.email.toLowerCase()
  );

  if (existingIdx >= 0) {
    const updated = [...currentList];
    const curr = updated[existingIdx];
    const updatedFolder: IncidentReport = {
      ...curr,
      citizenName: displayName,
      title: curr.title.startsWith('Personal Case File') || curr.title.startsWith('Dedicated Evidence Folder')
        ? `Dedicated Evidence Folder: ${displayName}`
        : curr.title,
    };
    updated[existingIdx] = updatedFolder;
    saveStoredIncidents(updated);
    return { updatedList: updated, folder: updatedFolder };
  }

  // Create new dedicated folder
  const officerIndex = currentList.length % SENIOR_INVESTIGATORS.length;
  const assignedOfficer = SENIOR_INVESTIGATORS[officerIndex];
  const newFolder: IncidentReport = {
    id: `inc-${Date.now()}`,
    trackingCode: `IN-CFC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    title: `Dedicated Evidence Folder: ${displayName}`,
    category: 'Citizen Cyber Evidence',
    description: `Dedicated evidentiary folder for ${displayName} (${user.email}). All citizen uploaded evidence is stored here under WORM tamper-proof integrity for Senior Investigator review.`,
    citizenName: displayName,
    citizenEmail: user.email,
    suspectDetails: 'Direct Citizen Intake Session',
    lossAmount: 'Evidence Protected',
    dateReported: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    status: 'WORM_LOCKED',
    primaryHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    evidenceFiles: [],
    seniorOfficerAssigned: `${assignedOfficer.name} (${assignedOfficer.role})`,
    officerBadge: assignedOfficer.badge,
    officerNotes: `Dedicated citizen folder allocated. Assigned to ${assignedOfficer.name}.`,
    legalAdmissibilityCertId: `CERT-65B-2026-CIT-${Math.floor(10000 + Math.random() * 90000)}`,
    rawOriginalContent: `Dedicated folder initialized for ${displayName} (${user.email}). Ready for evidentiary uploads.`,
    hashFormat: {
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      merkleRoot: 'e3b0c44298fc1c149afbf4c8996fb924',
      algorithm: 'SHA-256 / RFC-3161 WORM Ledger',
      byteSize: 1024,
      wormDigest: `WORM-LEDGER-BLK-${Math.floor(100000 + Math.random() * 900000)}-SEC65B`
    },
    custodyEvents: [
      {
        id: `cust-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        actor: `Citizen: ${displayName}`,
        role: 'Citizen / Account Holder',
        action: 'Account logged in. Dedicated folder uploaded to Senior Investigator Workstation.',
        merkleHash: 'e3b0c4...b855'
      },
      {
        id: `cust-${Date.now() + 1}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        actor: assignedOfficer.name,
        role: assignedOfficer.role,
        action: `Assigned as investigating officer to citizen folder. Ready to review uploaded evidence.`,
        merkleHash: '8b7a6c...4920'
      }
    ]
  };

  const nextList = [newFolder, ...currentList];
  saveStoredIncidents(nextList);
  createIncidentAPI(newFolder).catch(err => console.warn('Could not persist new folder to backend:', err));
  return { updatedList: nextList, folder: newFolder };
}

export function appendEvidenceToFolder(
  folderId: string,
  newFile: any,
  citizenName: string
): IncidentReport[] {
  const currentList = getStoredIncidents();
  const index = currentList.findIndex(i => i.id === folderId);
  if (index === -1) return currentList;

  const target = currentList[index];
  const updatedFiles = [...(target.evidenceFiles || []), newFile];
  const newCustodyEvent = {
    id: `cust-ev-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    actor: `Citizen: ${citizenName}`,
    role: 'Evidence Submitter / Account Holder',
    action: `Uploaded evidence file: "${newFile.name}" (${newFile.type || 'file'}). Computed SHA-256: ${newFile.sha256.substring(0, 16)}...`,
    merkleHash: newFile.sha256.substring(0, 16) + '...'
  };

  const updatedTarget: IncidentReport = {
    ...target,
    evidenceFiles: updatedFiles,
    custodyEvents: [newCustodyEvent, ...target.custodyEvents]
  };

  currentList[index] = updatedTarget;
  saveStoredIncidents(currentList);
  return currentList;
}

export function updateIncidentInStore(updated: IncidentReport): IncidentReport[] {
  try {
    const all = getStoredIncidents();
    const index = all.findIndex(i => i.id === updated.id);
    let next: IncidentReport[];
    if (index >= 0) {
      next = [...all];
      next[index] = updated;
    } else {
      next = [updated, ...all];
    }
    saveStoredIncidents(next);
    return next;
  } catch {
    return [];
  }
}

export function saveStoredIncidents(incidents: IncidentReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(incidents));
  } catch (err) {
    console.error('Failed to save incidents to localStorage', err);
  }
}

export function getStoredUser(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(INITIAL_USER));
      return INITIAL_USER;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USER;
  }
}

export function saveStoredUser(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save user to localStorage', err);
  }
}

const STORAGE_KEY_ACCOUNTS = 'forensicrypt_accounts_registry_v1';

export interface RegisteredAccount {
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

export function getRegisteredAccounts(): Record<string, RegisteredAccount> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveRegisteredAccount(account: RegisteredAccount): void {
  try {
    const accounts = getRegisteredAccounts();
    accounts[account.email.trim().toLowerCase()] = {
      ...account,
      email: account.email.trim().toLowerCase()
    };
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save account to localStorage', err);
  }
}

export function findRegisteredAccount(email: string): RegisteredAccount | null {
  if (!email) return null;
  const accounts = getRegisteredAccounts();
  return accounts[email.trim().toLowerCase()] || null;
}
