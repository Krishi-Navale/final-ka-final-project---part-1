export interface SharedProblemReport {
  id: string;
  trackingCode: string;
  problemText: string;
  sourceLink: string;
  category: string;
  submittedAt: string;
  sha256: string;
  status: 'PENDING_INSPECTION' | 'SOLVED';
  linkRiskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  linkHeuristics: string[];
  solvedByOfficer?: string;
  solvedByBadge?: string;
  solvedByAvatar?: string;
  solvedAt?: string;
  resolutionSummary?: string;
  preventiveActionTaken?: string;
}

const STORAGE_KEY = 'fip_shared_problems_v1';

export function analyzeProblemLinkHeuristics(rawLink: string): {
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  heuristics: string[];
} {
  const lower = (rawLink || '').toLowerCase().trim();
  const heuristics: string[] = [];
  let riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' = 'HIGH';

  if (!lower.startsWith('https://')) {
    heuristics.push('Unencrypted HTTP or non-standard URI scheme detected (No TLS lock).');
    riskLevel = 'CRITICAL';
  }
  if (
    lower.includes('.apk') ||
    lower.includes('.xyz') ||
    lower.includes('.top') ||
    lower.includes('.club') ||
    lower.includes('.buzz') ||
    lower.includes('ngrok') ||
    lower.includes('bit.ly')
  ) {
    heuristics.push('High-risk phishing TLD or remote-access APK payload distribution endpoint.');
    riskLevel = 'CRITICAL';
  }
  if (
    lower.includes('t.me/') ||
    lower.includes('telegram') ||
    lower.includes('wa.me/') ||
    lower.includes('whatsapp') ||
    lower.includes('chat.whatsapp')
  ) {
    heuristics.push('Encrypted social messaging invite channel linked to task/investment mule funnel.');
    riskLevel = 'CRITICAL';
  }
  if (
    lower.includes('sbi') ||
    lower.includes('hdfc') ||
    lower.includes('icici') ||
    lower.includes('kyc') ||
    lower.includes('bijli') ||
    lower.includes('electricity') ||
    lower.includes('cbi') ||
    lower.includes('customs')
  ) {
    heuristics.push('Brand / Sovereign Agency impersonation signature (Typosquatting lure).');
    riskLevel = 'CRITICAL';
  }

  if (heuristics.length === 0) {
    heuristics.push('External reported origin URL queued for deep DNS, WHOIS & C2 sandbox inspection.');
    riskLevel = 'HIGH';
  }

  return { riskLevel, heuristics };
}

export const INITIAL_SHARED_PROBLEMS: SharedProblemReport[] = [
  {
    id: 'prob-2026-501',
    trackingCode: 'FIP-PROB-2026-8841',
    problemText:
      'Received an urgent SMS claiming my electricity meter will be disconnected tonight unless I update KYC via this link. When opened, it prompts to download an APK and asks for UPI MPIN.',
    sourceLink: 'http://bescom-electricity-bill-kyc-update.xyz/Bijli_v4.apk',
    category: 'Phishing & Malicious Link',
    submittedAt: '2026-11-15 09:42:10 UTC',
    sha256: '7c9e82104b6a19f02938471029384756abcdef1234567890abcdef1234567890',
    status: 'PENDING_INSPECTION',
    linkRiskLevel: 'CRITICAL',
    linkHeuristics: [
      'Unencrypted HTTP or non-standard URI scheme detected (No TLS lock).',
      'High-risk phishing TLD or remote-access APK payload distribution endpoint.',
      'Brand / Sovereign Agency impersonation signature (Typosquatting lure).',
    ],
  },
  {
    id: 'prob-2026-502',
    trackingCode: 'FIP-PROB-2026-8790',
    problemText:
      'Fake institutional stock trading WhatsApp & Telegram portal promising 300% IPO allotment profits and blocking withdrawal unless a 20% tax fee is paid.',
    sourceLink: 'https://t.me/qib_vip_institutional_ipo_desk',
    category: 'Financial Cyber Fraud',
    submittedAt: '2026-11-14 17:15:00 UTC',
    sha256: '3a1f94827162839405162738495061728394a5b6c7d8e9f01a2b3c4d5e6f7a8b',
    status: 'SOLVED',
    linkRiskLevel: 'CRITICAL',
    linkHeuristics: [
      'Encrypted social messaging invite channel linked to task/investment mule funnel.',
    ],
    solvedByOfficer: 'Krishi · AI Command',
    solvedByBadge: 'I4C-NAT-7721',
    solvedByAvatar: '/assets/aistudio/image_526c1ede.png',
    solvedAt: '2026-11-14 17:48:22 UTC',
    resolutionSummary:
      'Telegram handle & associated C2 redirect domain indexed in I4C National Cyber Registry. Linked beneficiary mule accounts flagged for 1930 debit freeze.',
    preventiveActionTaken: 'Domain & Handle Added to National Threat Blocklist',
  },
];

export function getStoredSharedProblems(): SharedProblemReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SHARED_PROBLEMS));
      return INITIAL_SHARED_PROBLEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SHARED_PROBLEMS;
  } catch {
    return INITIAL_SHARED_PROBLEMS;
  }
}

export function saveStoredSharedProblems(list: SharedProblemReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('fip_shared_problems_updated', { detail: list }));
  } catch (e) {
    console.warn('Failed to save shared problems:', e);
  }
}

export async function syncSharedProblemsWithBackend(): Promise<SharedProblemReport[]> {
  try {
    const res = await fetch('/api/shared-problems');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        saveStoredSharedProblems(data);
        return data;
      }
    }
  } catch {
    // fallback to local
  }
  return getStoredSharedProblems();
}

export async function submitSharedProblemToWorkstation(input: {
  problemText: string;
  sourceLink: string;
  category: string;
  sha256: string;
}): Promise<SharedProblemReport> {
  const analysis = analyzeProblemLinkHeuristics(input.sourceLink);
  const newReport: SharedProblemReport = {
    id: `prob-${Date.now()}`,
    trackingCode: `FIP-PROB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    problemText: input.problemText.trim(),
    sourceLink: input.sourceLink.trim(),
    category: input.category || 'Phishing & Malicious Link',
    submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    sha256: input.sha256,
    status: 'PENDING_INSPECTION',
    linkRiskLevel: analysis.riskLevel,
    linkHeuristics: analysis.heuristics,
  };

  const current = getStoredSharedProblems();
  const updated = [newReport, ...current];
  saveStoredSharedProblems(updated);

  try {
    await fetch('/api/shared-problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReport),
    });
  } catch (err) {
    console.warn('Backend shared problem submit fallback:', err);
  }

  return newReport;
}

export async function solveSharedProblemInWorkstation(
  id: string,
  officerName: string,
  officerBadge: string,
  officerAvatar: string | undefined,
  resolutionSummary: string,
  preventiveActionTaken: string
): Promise<SharedProblemReport[]> {
  const solvedAt = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  const current = getStoredSharedProblems();
  const updated = current.map((item) =>
    item.id === id
      ? {
          ...item,
          status: 'SOLVED' as const,
          solvedByOfficer: officerName,
          solvedByBadge: officerBadge,
          solvedByAvatar: officerAvatar,
          solvedAt,
          resolutionSummary,
          preventiveActionTaken,
        }
      : item
  );

  saveStoredSharedProblems(updated);

  try {
    await fetch(`/api/shared-problems/${encodeURIComponent(id)}/solve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'SOLVED',
        solvedByOfficer: officerName,
        solvedByBadge: officerBadge,
        solvedByAvatar: officerAvatar,
        solvedAt,
        resolutionSummary,
        preventiveActionTaken,
      }),
    });
  } catch (err) {
    console.warn('Backend solve shared problem fallback:', err);
  }

  return updated;
}
