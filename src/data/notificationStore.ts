import { SystemNotification } from '../types';
import { createNotificationAPI, fetchNotificationsAPI } from './apiClient';

const NOTIFICATIONS_KEY = 'fip_system_notifications_v3';

function getRecentTimestamp(minutesAgo: number): string {
  const d = new Date(Date.now() - minutesAgo * 60 * 1000);
  return d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    timestamp: getRecentTimestamp(4),
    type: 'CERTIFICATE',
    title: 'Section 65B Admissibility Certificate Issued',
    message:
      'Official Section 65B certificate (CERT-65B-2026-CIT-92810) generated and cryptographically sealed for Case #IN-CFC-2026-849102.',
    recipientEmail: 'navalekrishi@gmail.com',
    recipientRole: 'all',
    read: false,
    relatedTrackingCode: 'IN-CFC-2026-849102',
    senderName: 'Bibi Zohara',
    badge: 'SEC 65B SEALED',
  },
  {
    id: 'notif-2',
    timestamp: getRecentTimestamp(18),
    type: 'DIRECT_NOTICE',
    title: 'Official Investigator Instruction Dispatched',
    message:
      'Senior Examiner Balchandra requested high-resolution UTR debit screenshots for 1930 Nodal Bank Lien verification.',
    recipientEmail: 'navalekrishi@gmail.com',
    recipientRole: 'citizen',
    read: false,
    relatedTrackingCode: 'IN-CFC-2026-849102',
    senderName: 'Balchandra',
    badge: '1930 NODAL HQ',
  },
  {
    id: 'notif-3',
    timestamp: getRecentTimestamp(42),
    type: 'CUSTODY_ALERT',
    title: 'AI Syndicate Correlation: 99.4% Pattern Match',
    message:
      'Cross-Case AI Engine linked Mule Account 5010049281920 & UPI powerelectric99@axl across 3 historical dockets.',
    recipientRole: 'all',
    read: false,
    relatedTrackingCode: 'IN-CFC-2026-849102',
    senderName: 'Krishi · AI Engine',
    badge: 'SYNDICATE MATCH',
  },
  {
    id: 'notif-4',
    timestamp: getRecentTimestamp(95),
    type: 'LIEN_ISSUED',
    title: '1930 Golden-Hour Bank Freeze Executed',
    message:
      'Emergency NPCI lien hold placed on beneficiary A/C #5010049281920 within the 120-minute Golden Window.',
    recipientRole: 'all',
    read: false,
    relatedTrackingCode: 'IN-CFC-2026-849103',
    senderName: 'Afsheen S',
    badge: 'LIEN ACTIVE',
  },
  {
    id: 'notif-5',
    timestamp: getRecentTimestamp(180),
    type: 'DONTPAD_SYNC',
    title: 'WORM Bitstream Audit & Vault Sync Complete',
    message:
      'RFC-3161 Merkle tree integrity check completed across 14,820 evidence blocks. Zero bit mutation detected.',
    recipientRole: 'all',
    read: true,
    actionUrlHash: '#pad/evidence-vault-docket',
    senderName: 'F.I.P WORM Ledger',
    badge: 'RFC-3161 VERIFIED',
  },
];

export function formatNotificationRelativeTime(raw?: string): string {
  if (!raw) return 'Just now';
  const normalized = raw.trim().replace(' UTC', 'Z').replace(' ', 'T');
  const parsed = new Date(normalized);
  if (isNaN(parsed.getTime())) return raw;

  const diffSec = Math.max(0, Math.floor((Date.now() - parsed.getTime()) / 1000));
  if (diffSec < 45) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  const days = Math.floor(diffSec / 86400);
  if (days === 1) return 'Yesterday';
  if (days < 14) return `${days}d ago`;
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getStoredNotifications(): SystemNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading notifications', e);
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifications: SystemNotification[]) {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    window.dispatchEvent(
      new CustomEvent('fip_notifications_updated', { detail: notifications })
    );
  } catch (e) {
    console.error('Failed saving notifications', e);
  }
}

export function addNotification(
  notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'> & {
    id?: string;
    timestamp?: string;
    read?: boolean;
  }
): SystemNotification {
  const fullNotif: SystemNotification = {
    ...notification,
    id:
      notification.id ||
      `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp:
      notification.timestamp ||
      new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    read: notification.read ?? false,
  };

  const list = getStoredNotifications();
  const existingIndex = list.findIndex((n) => n.id === fullNotif.id);
  const updated =
    existingIndex >= 0
      ? list.map((n) => (n.id === fullNotif.id ? fullNotif : n))
      : [fullNotif, ...list];

  saveStoredNotifications(updated);

  createNotificationAPI(fullNotif).catch((err) =>
    console.warn('Backend notification sync error:', err)
  );

  return fullNotif;
}

export function removeNotificationById(id: string): SystemNotification[] {
  const list = getStoredNotifications();
  const updated = list.filter((n) => n.id !== id);
  saveStoredNotifications(updated);
  return updated;
}

export async function syncNotificationsWithBackend(): Promise<
  SystemNotification[]
> {
  try {
    const backendNotifs = await fetchNotificationsAPI();
    if (
      backendNotifs &&
      Array.isArray(backendNotifs) &&
      backendNotifs.length > 0
    ) {
      const local = getStoredNotifications();
      const map = new Map<string, SystemNotification>();
      backendNotifs.forEach((n) => map.set(n.id, n));
      local.forEach((n) => {
        if (!map.has(n.id)) {
          map.set(n.id, n);
        }
      });
      const merged = Array.from(map.values());
      saveStoredNotifications(merged);
      return merged;
    }
  } catch (err) {
    console.warn('Could not sync notifications from backend:', err);
  }
  return getStoredNotifications();
}
