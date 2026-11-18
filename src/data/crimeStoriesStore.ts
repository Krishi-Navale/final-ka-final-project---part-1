export interface CommunityCrimeStory {
  id: string;
  trackingCode: string;
  title: string;
  category: string;
  authorName: string;
  authorEmail: string;
  location?: string;
  dateOccurred?: string;
  dateSubmitted: string;
  whatHappened: string;
  howToStaySafeLesson: string;
  lossAmount: string;
  pdfFileName: string;
  pdfFileSize: number | string;
  pdfSha256: string;
  pdfDataUrl?: string;
  status: 'PENDING_WORKSTATION' | 'APPROVED_PUBLISHED' | 'REJECTED';
  verifiedByOfficer?: string;
  verifiedByBadge?: string;
  verifiedByAvatar?: string;
  verifiedTimestamp?: string;
  investigatorNotes?: string;
  approvedByOfficer?: string;
  approvedByBadge?: string;
  workstationNotes?: string;
}

const STORAGE_KEY_CRIME_STORIES = 'fip_community_crime_stories_v1';

export const INITIAL_CRIME_STORIES: CommunityCrimeStory[] = [
  {
    id: 'cs-2026-101',
    trackingCode: 'FIP-STORY-2026-8841',
    title: 'How I Survived a 6-Hour Skype "Digital Arrest" & Saved ₹18.5 Lakhs',
    category: 'Digital Arrest & Fake CBI Warrant',
    authorName: 'vikram.kulkarni@gmail.com (Pune Citizen)',
    authorEmail: 'vikram.kulkarni@gmail.com',
    location: 'Pune, Maharashtra',
    dateOccurred: '11 Nov 2026',
    dateSubmitted: '2026-11-11 16:40:12 UTC',
    whatHappened:
      'I received an automated IVR call claiming to be from FedEx Customs saying a parcel in my Aadhaar name contained illegal passports. They transferred me to a Skype video call with a fake Mumbai Cyber Police studio and showed a forged Supreme Court warrant PDF demanding ₹18.5 Lakhs into an "RBI Verification Escrow Account" while ordering me not to disconnect.',
    howToStaySafeLesson:
      'Indian Police, CBI, ED, or Customs NEVER conduct interrogations over Skype/WhatsApp video calls and NEVER ask you to transfer money for "verification". Hang up immediately, save the forged PDF warrant, and dial 1930.',
    lossAmount: '₹0 (Prevented Before RTGS)',
    pdfFileName: 'Forged_CBI_Warrant_And_Skype_FIR_Proof.pdf',
    pdfFileSize: '642 KB',
    pdfSha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    status: 'APPROVED_PUBLISHED',
    verifiedByOfficer: 'Dr. Bibi Zohara',
    verifiedByBadge: 'DEL-CY-0842',
    verifiedByAvatar: '/assets/aistudio/image_acc490cb.png',
    verifiedTimestamp: '2026-11-11 17:05:00 UTC',
    investigatorNotes:
      'PDF warrant verified as forged Canva template. Skype ID linked to known Cambodia Digital Arrest syndicate. Approved for public safety education.',
    approvedByOfficer: 'Dr. Bibi Zohara (Lead Cyber Forensic Examiner)',
    approvedByBadge: 'DEL-CY-0842',
    workstationNotes:
      'PDF warrant verified as forged Canva template. Skype ID linked to known Cambodia Digital Arrest syndicate. Approved for public safety education.',
  },
  {
    id: 'cs-2026-102',
    trackingCode: 'FIP-STORY-2026-8892',
    title: 'Fake Electricity Disconnection SMS & Malicious .APK That Drained ₹1.48 Lakh',
    category: 'Electricity Bill APK & OTP Drain',
    authorName: 'Rahul Verma (Bengaluru)',
    authorEmail: 'rahul.verma@gmail.com',
    location: 'Bengaluru, Karnataka',
    dateOccurred: '08 Nov 2026',
    dateSubmitted: '2026-11-08 14:30:00 UTC',
    whatHappened:
      'An SMS warned that my home electricity would be cut off at 9:30 PM unless I updated my KYC. When I called the number in the SMS, the scammer sent "BijliBill_Update.apk" on WhatsApp and asked me to pay ₹10. The APK secretly had SMS forwarding permissions and drained ₹1,48,500 via two UPI transactions within 4 minutes.',
    howToStaySafeLesson:
      'Never install any .APK file sent over WhatsApp or SMS, and never use screen-sharing apps (AnyDesk/RustDesk) with strangers. Report within the 2-Hour Golden Window on 1930 to freeze the beneficiary mule account.',
    lossAmount: '₹1,48,500 (₹1.12L Frozen via 1930)',
    pdfFileName: 'Bank_UTR_Statement_And_1930_Ack_Receipt.pdf',
    pdfFileSize: '518 KB',
    pdfSha256: '3f78a2e1904b6c810427a19c5b2067e8890284b1a459bca40277884102839912',
    status: 'APPROVED_PUBLISHED',
    verifiedByOfficer: 'Sup. Balchandra',
    verifiedByBadge: 'MAH-CY-1109',
    verifiedByAvatar: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg',
    verifiedTimestamp: '2026-11-08 15:12:40 UTC',
    investigatorNotes:
      'Bank statement PDF and UTR numbers authenticated. Mule account 5010049281920 placed under 1930 debit freeze. Published for citizen awareness.',
    approvedByOfficer: 'Sup. Balchandra (Superintendent Cyber Police)',
    approvedByBadge: 'MAH-CY-1109',
    workstationNotes:
      'Bank statement PDF and UTR numbers authenticated. Mule account 5010049281920 placed under 1930 debit freeze. Published for citizen awareness.',
  },
  {
    id: 'cs-2026-103',
    trackingCode: 'FIP-STORY-2026-8915',
    title: 'Telegram "Hotel Review Prepaid Task" Trap — How ₹500 Rewards Turned Into a ₹92,000 Freeze',
    category: 'Telegram Prepaid Task Fraud',
    authorName: 'Sneha Nair (Kochi)',
    authorEmail: 'sneha.nair@gmail.com',
    location: 'Kochi, Kerala',
    dateOccurred: '12 Nov 2026',
    dateSubmitted: '2026-11-12 11:20:00 UTC',
    whatHappened:
      'I was added to a Telegram group offering ₹150 per Google Maps hotel rating. For the first two days they actually paid ₹900 into my bank account to build trust. On day 3, they introduced "VIP Prepaid Crypto Tasks" requiring a ₹25,000 deposit, then claimed I made a "task error" and demanded ₹67,000 more to unlock my balance.',
    howToStaySafeLesson:
      'Any part-time job that pays you small amounts first and then asks you to deposit money for "Prepaid VIP Tasks" is 100% an organized syndicate trap. Stop at the first deposit request.',
    lossAmount: '₹92,000 INR',
    pdfFileName: 'Telegram_Task_UPI_Receipts_And_Cyber_FIR.pdf',
    pdfFileSize: '784 KB',
    pdfSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    status: 'APPROVED_PUBLISHED',
    verifiedByOfficer: 'Afsheen S',
    verifiedByBadge: 'BLR-CY-4402',
    verifiedByAvatar: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg',
    verifiedTimestamp: '2026-11-12 12:05:18 UTC',
    investigatorNotes:
      'PDF transaction log verified against WORM ledger. Beneficiary UPI handles linked to cross-state mule cluster. Story published.',
    approvedByOfficer: 'Afsheen S (Cryptographic Forensics Lead)',
    approvedByBadge: 'BLR-CY-4402',
    workstationNotes:
      'PDF transaction log verified against WORM ledger. Beneficiary UPI handles linked to cross-state mule cluster. Story published.',
  },
  {
    id: 'cs-2026-104',
    trackingCode: 'FIP-STORY-2026-9042',
    title: 'Fake Institutional Stock IPO Trading App ("QIB VIP Club") on WhatsApp',
    category: 'Fake Stock Trading App Scam',
    authorName: 'Rohan Deshpande (Dharwad)',
    authorEmail: 'rohan.deshpande@gmail.com',
    location: 'Dharwad, Karnataka',
    dateOccurred: '14 Nov 2026',
    dateSubmitted: '2026-11-14 19:15:00 UTC',
    whatHappened:
      'Clicked an Instagram ad impersonating a famous stock market analyst and joined a WhatsApp VIP group. They made us download an unlisted institutional trading app that showed fake 340% profits on screen, but when I tried to withdraw, they demanded a 20% "SEBI Capital Gains Tax" transfer to a private current account.',
    howToStaySafeLesson:
      'SEBI-registered brokers never collect trading funds into private third-party bank accounts or ask for upfront tax transfers to release withdrawals.',
    lossAmount: '₹2,10,000 INR',
    pdfFileName: 'Fake_Broker_App_Bank_Transfer_PDF_Proof.pdf',
    pdfFileSize: '492 KB',
    pdfSha256: 'a9480d22162f1c8f411802998a44b9a89c89e17d23a11048e91823101aa02911',
    status: 'PENDING_WORKSTATION',
  },
];

export function getStoredCrimeStories(): CommunityCrimeStory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CRIME_STORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CRIME_STORIES, JSON.stringify(INITIAL_CRIME_STORIES));
      return INITIAL_CRIME_STORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CRIME_STORIES;
  } catch {
    return INITIAL_CRIME_STORIES;
  }
}

export function saveStoredCrimeStories(stories: CommunityCrimeStory[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CRIME_STORIES, JSON.stringify(stories));
    window.dispatchEvent(new CustomEvent('fip_crime_stories_updated', { detail: stories }));
  } catch (err) {
    console.warn('Failed to save crime stories:', err);
  }
}

export async function syncCrimeStoriesWithBackend(): Promise<CommunityCrimeStory[]> {
  try {
    const res = await fetch('/api/crime-stories');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEY_CRIME_STORIES, JSON.stringify(data));
        return data;
      }
    }
  } catch {
    // Fallback to local storage
  }
  return getStoredCrimeStories();
}

export async function submitCrimeStoryForVerification(
  storyInput: Omit<CommunityCrimeStory, 'id' | 'trackingCode' | 'dateSubmitted' | 'status'> &
    Partial<Pick<CommunityCrimeStory, 'id' | 'trackingCode' | 'dateSubmitted' | 'status'>>
): Promise<CommunityCrimeStory> {
  const created: CommunityCrimeStory = {
    id: storyInput.id || `cs-${Date.now()}`,
    trackingCode:
      storyInput.trackingCode ||
      `FIP-STORY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    dateSubmitted:
      storyInput.dateSubmitted ||
      new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    status: storyInput.status || 'PENDING_WORKSTATION',
    ...storyInput,
  };

  const current = getStoredCrimeStories();
  const updated = [created, ...current.filter((s) => s.id !== created.id)];
  saveStoredCrimeStories(updated);

  try {
    await fetch('/api/crime-stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created),
    });
  } catch {
    // Handled via local store + custom event
  }

  return created;
}

export async function reviewCrimeStoryInWorkstation(
  storyId: string,
  decision: 'APPROVED_PUBLISHED' | 'REJECTED',
  officerNameOrObj:
    | string
    | {
        name: string;
        badge: string;
        avatarUrl?: string;
        notes?: string;
      },
  officerBadgeArg?: string,
  notesArg?: string
): Promise<CommunityCrimeStory[]> {
  const officerName =
    typeof officerNameOrObj === 'string' ? officerNameOrObj : officerNameOrObj.name;
  const officerBadge =
    typeof officerNameOrObj === 'string'
      ? officerBadgeArg || 'I4C-NAT-7721'
      : officerNameOrObj.badge;
  const officerAvatar =
    typeof officerNameOrObj === 'string' ? undefined : officerNameOrObj.avatarUrl;
  const officerNotes =
    typeof officerNameOrObj === 'string' ? notesArg : officerNameOrObj.notes;

  const current = getStoredCrimeStories();
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  const finalNote =
    officerNotes ||
    (decision === 'APPROVED_PUBLISHED'
      ? `PDF forensic digest verified by ${officerName}. Approved for public Crime Stories awareness feed.`
      : `PDF verification declined by ${officerName}.`);

  const updated = current.map((s) => {
    if (s.id === storyId) {
      return {
        ...s,
        status: decision,
        verifiedByOfficer: officerName,
        verifiedByBadge: officerBadge,
        verifiedByAvatar: officerAvatar,
        verifiedTimestamp: timestamp,
        investigatorNotes: finalNote,
        approvedByOfficer: officerName,
        approvedByBadge: officerBadge,
        workstationNotes: finalNote,
      };
    }
    return s;
  });

  saveStoredCrimeStories(updated);

  try {
    await fetch(`/api/crime-stories/${encodeURIComponent(storyId)}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: decision,
        verifiedByOfficer: officerName,
        verifiedByBadge: officerBadge,
        verifiedByAvatar: officerAvatar,
        verifiedTimestamp: timestamp,
        investigatorNotes: finalNote,
        approvedByOfficer: officerName,
        approvedByBadge: officerBadge,
        workstationNotes: finalNote,
      }),
    });
  } catch {
    // Handled via local store + custom event
  }

  return updated;
}
