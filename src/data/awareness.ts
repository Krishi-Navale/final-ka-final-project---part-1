import { AwarenessCategory } from '../types';

export const SAFE_WEBSITE_CHECKLIST = [
  {
    title: 'Valid TLS/SSL Encryption & Padlock',
    detail: 'Ensure the URL starts with https://. Click the padlock icon to verify the certificate is issued to the genuine organization and has not expired.',
    status: 'Essential'
  },
  {
    title: 'Domain Syntax & Anti-Typosquatting Check',
    detail: 'Scammers substitute characters (e.g., using "0" for "O", "vv" for "w", or domains like "sbi-kyc-update.site" instead of "onlinesbi.sbi"). Inspect domain endings closely.',
    status: 'Crucial'
  },
  {
    title: 'Official Government Domain Extensions',
    detail: 'In India, legitimate government portals exclusively end with .gov.in or .nic.in. In the US, legitimate federal sites end with .gov or .mil. Commercial extensions (.com, .net, .in, .xyz) are NEVER used for official state portals.',
    status: 'Mandatory'
  },
  {
    title: 'No Forced APK or Executable Downloads',
    detail: 'Legitimate banking and government websites never prompt you to download third-party .apk files or click links to install remote support apps (AnyDesk, TeamViewer, RustDesk).',
    status: 'High Alert'
  },
  {
    title: 'Transparent Privacy Policy & Grievance Officer',
    detail: 'Under IT Act (Intermediary Guidelines), genuine platforms clearly publish their registered physical address, company CIN, and contact details of an authorized Grievance Officer.',
    status: 'Standard'
  }
];

export const CYBERCRIME_TAXONOMY: AwarenessCategory[] = [
  {
    id: 'digital-arrest',
    title: '"Digital Arrest" & Agency Impersonation',
    subtitle: 'Coercive video calls claiming parcel contains contraband or bank account is linked to money laundering.',
    description: 'Fraudsters impersonate CBI, Customs, ED, or Delhi Police officers via Skype or WhatsApp video, displaying fake police uniforms and logos. They threaten immediate arrest unless the victim transfers savings into "RBI verification safe accounts".',
    dos: [
      'Disconnect the video call immediately; real police never conduct trials or arrest procedures over WhatsApp/Skype',
      'Dial 1930 or your local police station to verify any genuine summon',
      'Take screenshots of the caller ID, Skype handle, and bank account numbers provided'
    ],
    donts: [
      'Do not transfer money to any "clearance account" or "government safety vault"',
      'Do not isolate yourself in a room or keep the video call running overnight',
      'Do not sign non-disclosure forms sent over messaging apps'
    ],
    actionSteps: [
      'Call National Cyber Helpline 1930 immediately',
      'Upload screenshots & call logs to ForensiCrypt for SHA-256 WORM sealing',
      'File an official report on cybercrime.gov.in with your ForensiCrypt custody code'
    ],
    dangerLevel: 'Critical'
  },
  {
    id: 'part-time-job',
    title: 'Telegram Rating & "Part-Time Task" Scams',
    subtitle: 'Promises of ₹2,000 to ₹10,000/day for liking YouTube videos, Google maps reviews, or hotel ratings.',
    description: 'Victims receive WhatsApp/Telegram offers for simple online tasks. Initial small payouts (₹200-₹500) build trust, followed by adding the victim to a "VIP task group" demanding deposits of ₹50,000+ for high crypto returns that can never be withdrawn.',
    dos: [
      'Capture complete chat transcripts, UPI IDs, and transaction reference numbers (UTR)',
      'Notify your bank immediately if you transacted in the last 2 hours to freeze the recipient UPI account',
      'Report the Telegram group handles and associated phone numbers to Chakshu (sancharsaathi.gov.in)'
    ],
    donts: [
      'Do not deposit "withdrawal tax" or "liquidity fees" to recover previously locked money',
      'Do not invite friends or family into the scam group to meet "referral quotas"',
      'Do not click unknown web links claiming to be investment dashboards'
    ],
    actionSteps: [
      'Call 1930 to trigger the Indian Cyber Coordination Centre bank freeze protocol',
      'Preserve chat export and UPI screenshots in ForensiCrypt with WORM hash lock',
      'Submit dispute chargeback with your home bank within 72 hours'
    ],
    dangerLevel: 'High'
  },
  {
    id: 'sextortion-video',
    title: 'Video Call Sextortion & Blackmail Traps',
    subtitle: 'Nude video call entrapment followed by morphed recording threats.',
    description: 'Perpetrators initiate video calls from fake social accounts, play pre-recorded explicit video clips, record the victim\'s face, and immediately demand extortion money under threat of uploading morphed videos to YouTube or sending to contacts.',
    dos: [
      'Deactivate or set social media profiles to strict private immediately to prevent contact harvesting',
      'Record all threat messages, WhatsApp numbers, and extortion payment links as evidence',
      'Seek guidance from family, counselors, or the national helpline (1930)'
    ],
    donts: [
      'Never pay extortion money; paying only leads to escalating demands from the extortionist',
      'Do not delete the chat history or block the perpetrator before capturing raw screenshot evidence',
      'Do not panic—law enforcement agencies handle thousands of such cases with strict confidentiality'
    ],
    actionSteps: [
      'Secure raw screenshots and hash them on ForensiCrypt to preserve court-admissible timestamps',
      'Report content to StopNCII.org (hash-matching tool to prevent viral spread) and cybercrime.gov.in',
      'File an online complaint under the women/citizens protection category on NCRP'
    ],
    dangerLevel: 'Critical'
  },
  {
    id: 'loan-app-harassment',
    title: 'Predatory Instant Loan Apps & Contact Leakage',
    subtitle: 'Unregistered quick-loan apps charging 300% interest and blackmailing contacts.',
    description: 'Apps downloaded via APK links or untrusted stores demand blanket phone permissions (contacts, gallery, camera). Within days, loan sharks create morphed obscene photos of the borrower and circulate them to contact lists.',
    dos: [
      'Revoke all app permissions and uninstall the malicious APK file',
      'Verify if the lending entity is in the RBI Sachet register of licensed NBFCs',
      'Inform close contacts that your phone contacts were compromised by illegal malware'
    ],
    donts: [
      'Do not install APK files sent through WhatsApp or SMS',
      'Do not pay repeated "extension fees" to unlicensed recovery agents',
      'Do not share PAN, Aadhaar, or selfie verification with unverified lenders'
    ],
    actionSteps: [
      'Report the fraudulent app directly to Sachet RBI Portal (sachet.rbi.org.in)',
      'Preserve APK hash, threat audio clips, and payment receipts on ForensiCrypt',
      'File harassment complaint with state police Cyber Cell'
    ],
    dangerLevel: 'High'
  }
];

export const CITIZEN_RECOVERY_PROTOCOL = [
  {
    step: '01',
    timeframe: 'Minute 0 - Minute 120 (Golden Hour)',
    title: 'Trigger Financial Kill-Switch (1930 / Bank)',
    instruction: 'If money was debited fraudulently, immediately call 1930 or log in to your bank app to block cards, freeze net banking, and register a dispute. The first 2 hours are crucial before funds transit through multiple mule accounts.'
  },
  {
    step: '02',
    timeframe: 'Immediately After Incident',
    title: 'Preserve Untampered Digital Artifacts',
    instruction: 'Do NOT format your phone, clear WhatsApp chats, or delete call recordings. Take full screenshots showing time, date, caller numbers, transaction UTR numbers, and email headers.'
  },
  {
    step: '03',
    timeframe: 'Forensic Locking',
    title: 'Generate SHA-256 Hashes via ForensiCrypt',
    instruction: 'Upload raw screenshots, audio, and documents to ForensiCrypt. The platform generates an immutable SHA-256 fingerprint under Write-Once-Read-Many (WORM) rules. This proves in court that your evidence was not altered.'
  },
  {
    step: '04',
    timeframe: 'Within 24 Hours',
    title: 'Lodge Official Complaint on National Portal',
    instruction: 'Submit an incident report at cybercrime.gov.in (India) or IC3.gov / Action Fraud (International). Quote your ForensiCrypt Evidence Tracking Code and attach the Court Admissibility Certificate.'
  },
  {
    step: '05',
    timeframe: 'Post-Reporting',
    title: 'Credential Hardening & SIM Security',
    instruction: 'Change passwords for primary Gmail, banking, and Apple/Google accounts using a trusted alternate device. Check connected devices and revoke unauthorized 2-factor authentication sessions.'
  }
];
