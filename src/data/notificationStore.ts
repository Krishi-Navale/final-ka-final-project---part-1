import { SystemNotification } from '../types';
import { createNotificationAPI, fetchNotificationsAPI } from './apiClient';

const NOTIFICATIONS_KEY = 'fip_system_notifications_v2';

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    timestamp: '2026-10-09 22:15:00 UTC',
    type: 'CERTIFICATE',
    title: 'Section 65B Admissibility Certificate Issued',
    message: 'Official Section 65B certificate (CERT-65B-2026-CIT-92810) generated and cryptographically sealed for Case #CYBER-2026-9281.',
    recipientEmail: 'navalekrishi@gmail.com',
    recipientRole: 'all',
    read: false,
    relatedTrackingCode: 'CYBER-2026-9281',
    senderName: 'Dr. Bibi Zohara',
    badge: 'LEAD FORENSIC EXAMINER',
  },
  {
    id: 'notif-2',
    timestamp: '2026-10-09 21:40:00 UTC',
    type: 'DIRECT_NOTICE',
    title: 'Official Investigator Instruction Received',
    message: 'Senior Examiner Balchandra requested bank statement screenshots for 1930 Cyber Cell Lien verification.',
    recipientEmail: 'navalekrishi@gmail.com',
    recipientRole: 'citizen',
    read: false,
    relatedTrackingCode: 'CYBER-2026-9281',
    senderName: 'Sup. Balchandra K',
    badge: 'CYBER POLICE HQ',
  },
  {
    id: 'notif-3',
    timestamp: '2026-10-09 20:05:00 UTC',
    type: 'CUSTODY_ALERT',
    title: 'WORM Bitstream Audit Passed',
    message: 'RFC-3161 Merkle tree integrity check completed across 14,820 evidence blocks. Zero tamper detected.',
    recipientRole: 'senior_investigator',
    read: true,
    senderName: 'WORM Ledger Engine',
    badge: 'AUTOMATED AUDIT',
  },
  {
    id: 'notif-4',
    timestamp: '2026-10-09 19:22:00 UTC',
    type: 'DONTPAD_SYNC',
    title: 'Dontpad Repository Linked',
    message: 'Custom pad #pad/evidence-vault-docket synchronized with encrypted SHA-256 hash stamp.',
    recipientRole: 'all',
    read: false,
    actionUrlHash: '#pad/evidence-vault-docket',
    senderName: 'Drive Secure System',
    badge: 'VAULT SYNC',
  },
  {
    id: 'notif-5',
    timestamp: '2026-10-09 18:00:00 UTC',
    type: 'LIEN_ISSUED',
    title: '1930 Bank Account Freeze Dispatched',
    message: 'Emergency lien dispatched to ICICI / HDFC Nodal Cyber Officer for Mule A/C #9182****4410.',
    recipientRole: 'senior_investigator',
    read: false,
    senderName: 'Insp. Rajesh Sharma',
    badge: '1930 CELL',
  }
];

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
    window.dispatchEvent(new CustomEvent('fip_notifications_updated', { detail: notifications }));
  } catch (e) {
    console.error('Failed saving notifications', e);
  }
}

export function addNotification(notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'> & { id?: string; timestamp?: string; read?: boolean }): SystemNotification {
  const fullNotif: SystemNotification = {
    ...notification,
    id: notification.id || `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: notification.timestamp || (new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'),
    read: notification.read ?? false,
  };

  const list = getStoredNotifications();
  // Avoid duplicates
  const existingIndex = list.findIndex(n => n.id === fullNotif.id);
  const updated = existingIndex >= 0 
    ? list.map(n => n.id === fullNotif.id ? fullNotif : n)
    : [fullNotif, ...list];

  saveStoredNotifications(updated);

  // Sync with MongoDB backend in background
  createNotificationAPI(fullNotif).catch(err => console.warn('Backend notification sync error:', err));

  return fullNotif;
}

export async function syncNotificationsWithBackend(): Promise<SystemNotification[]> {
  try {
    const backendNotifs = await fetchNotificationsAPI();
    if (backendNotifs && Array.isArray(backendNotifs) && backendNotifs.length > 0) {
      const local = getStoredNotifications();
      const map = new Map<string, SystemNotification>();
      // Prefer newer ones
      backendNotifs.forEach(n => map.set(n.id, n));
      local.forEach(n => {
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
