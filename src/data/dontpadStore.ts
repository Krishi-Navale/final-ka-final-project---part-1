import { DontpadPad } from '../types';
import { computeSHA256Sync } from '../utils/crypto';

const DONTPAD_KEY = 'fip_dontpad_vaults_v2';

export const INITIAL_PADS: Record<string, DontpadPad> = {
  'case-2026-evidence': {
    slug: 'case-2026-evidence',
    content: `[CONFIDENTIAL EVIDENCE PAD - WORM PROTECTED]
Incident Code: CYBER-2026-9281
Primary Suspect Wallet: 0x71C...49A
Telegram Handler: @fake_support_1930
WhatsApp Video Recording MD5: e2c...890

EVIDENCE NOTES:
1. Citizen clicked phishing URL: https://secure-bank-verify-1930.com
2. Funds drained in 3 unauthorized IMPS transfers totaling ₹4,85,000.
3. Bank nodal officer notified for account freeze under Section 91 CrPC.`,
    lastUpdated: '2026-10-09 22:30:00 UTC',
    sha256: computeSHA256Sync('case-2026-evidence initial content'),
    isWormLocked: true,
    createdEmail: 'navalekrishi@gmail.com',
    editorName: 'Lead Examiner Bibi Zohara',
    historyCount: 14,
  },
  'drive-secure-vault': {
    slug: 'drive-secure-vault',
    content: `=== DRIVE SECURE SYSTEM & EVIDENCE REPOSITORY ===
Public Access Hash Link: fip-drive-sec-8842190
WORM Integrity Protocol: ACTIVE

Shared Folders:
- /Citizen_Evidentiary_Dockets/navalekrishi
- /Photos_Forensic_Lab/WhatsApp_Scam_Screenshots
- /Section_65B_Affidavits/Court_Admissible_Certificates

Use Dontpad workflow to post notes or link hashes directly to your case file.`,
    lastUpdated: '2026-10-09 21:10:00 UTC',
    sha256: computeSHA256Sync('drive-secure-vault initial content'),
    isWormLocked: false,
    createdEmail: 'senior.investigator@cyberpolice.gov.in',
    editorName: 'Sup. Balchandra K',
    historyCount: 8,
  }
};

export function getStoredPads(): Record<string, DontpadPad> {
  try {
    const raw = localStorage.getItem(DONTPAD_KEY);
    if (!raw) {
      localStorage.setItem(DONTPAD_KEY, JSON.stringify(INITIAL_PADS));
      return INITIAL_PADS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading pads', e);
    return INITIAL_PADS;
  }
}

export function saveStoredPads(pads: Record<string, DontpadPad>) {
  try {
    localStorage.setItem(DONTPAD_KEY, JSON.stringify(pads));
  } catch (e) {
    console.error('Failed saving pads', e);
  }
}

export function getPadBySlug(slug: string): DontpadPad {
  const cleanSlug = slug.trim().toLowerCase().replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9_\-\/]/g, '-');
  const safeKey = cleanSlug || 'main';
  const pads = getStoredPads();
  if (pads[safeKey]) {
    return pads[safeKey];
  }

  // Create new blank pad on demand (Dontpad style) with 24-hour expiration default
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  const newPad: DontpadPad = {
    slug: safeKey,
    content: `=== F.I.P DEDICATED DONTPAD (#pad/${safeKey}) ===\n[24-Hour Temporary Secure Pad Created]\n\nType your notes, suspect links, UPI IDs, or forensic log data here...\nAuto-saves continuously in real time.`,
    lastUpdated: now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    sha256: computeSHA256Sync(safeKey + Date.now().toString()),
    isWormLocked: false,
    historyCount: 1,
    is24hTemporary: true,
    savedFor24h: false,
    expiresAt,
  };

  pads[safeKey] = newPad;
  saveStoredPads(pads);
  return newPad;
}

export function updatePadContent(slug: string, content: string, editorName?: string, lock?: boolean): DontpadPad {
  const cleanSlug = slug.trim().toLowerCase().replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9_\-\/]/g, '-');
  const safeKey = cleanSlug || 'main';
  const pads = getStoredPads();
  const existing = pads[safeKey] || getPadBySlug(safeKey);

  const updatedPad: DontpadPad = {
    ...existing,
    content,
    lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    sha256: computeSHA256Sync(content),
    editorName: editorName || existing.editorName || 'Anonymous Deponent',
    historyCount: (existing.historyCount || 0) + 1,
    isWormLocked: lock !== undefined ? lock : existing.isWormLocked,
  };

  pads[safeKey] = updatedPad;
  saveStoredPads(pads);
  return updatedPad;
}

export function savePadFor24Hours(slug: string): DontpadPad {
  const cleanSlug = slug.trim().toLowerCase().replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9_\-\/]/g, '-');
  const safeKey = cleanSlug || 'main';
  const pads = getStoredPads();
  const existing = pads[safeKey] || getPadBySlug(safeKey);

  // Extend 24 hours from now
  const newExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const updatedPad: DontpadPad = {
    ...existing,
    savedFor24h: true,
    is24hTemporary: true,
    expiresAt: newExpiration,
    lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
  };

  pads[safeKey] = updatedPad;
  saveStoredPads(pads);
  return updatedPad;
}
