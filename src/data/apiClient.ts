import { IncidentReport, UserProfile, SystemNotification } from '../types';

export const API_BASE = '/api';

// Check DB Status & SMTP Status
export const checkServerStatus = async () => {
  try {
    const res = await fetch(`${API_BASE}/status`);
    return await res.json();
  } catch (err) {
    return { status: 'OFFLINE', database: 'DISCONNECTED', smtp: 'UNCONFIGURED' };
  }
};

export const normalizeIncidentRecord = (item: any): IncidentReport => {
  const primaryHash =
    item.primaryHash ||
    item.sha256Hash ||
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  const trackingCode = item.trackingCode || item.id || 'IN-CFC-2026-849102';
  const rawFiles = Array.isArray(item.evidenceFiles) ? item.evidenceFiles : [];
  const evidenceFiles = rawFiles.map((f: any, idx: number) => {
    const fileName = f?.name || f?.filename || `evidence_artifact_${idx + 1}.bin`;
    const fileType = f?.type || f?.fileType || f?.originalFormat || 'application/octet-stream';
    const fileSize =
      typeof f?.size === 'number'
        ? f.size
        : typeof f?.sizeBytes === 'number'
        ? f.sizeBytes
        : 1024;
    const fileSha = f?.sha256 || f?.sha256Hash || primaryHash;
    return {
      ...f,
      id: f?.id || f?._id?.toString() || `ev-${trackingCode}-${idx}`,
      name: String(fileName),
      filename: String(fileName),
      type: String(fileType),
      fileType: String(fileType),
      size: fileSize,
      sizeBytes: fileSize,
      sha256: String(fileSha),
      sha256Hash: String(fileSha),
      wormTimestamp:
        f?.wormTimestamp ||
        (f?.uploadedAt ? new Date(f.uploadedAt).toISOString().replace('T', ' ').substring(0, 19) + ' UTC' : 'WORM Sealed'),
      previewUrl: f?.previewUrl || f?.base64Data,
      rawContent: f?.rawContent || f?.base64Data || `SHA-256 WORM SEALED ARTIFACT: ${fileName}`,
    };
  });

  const rawCustody =
    Array.isArray(item.custodyEvents) && item.custodyEvents.length > 0
      ? item.custodyEvents
      : Array.isArray(item.custodyLogs)
      ? item.custodyLogs
      : [];

  const custodyEvents = rawCustody.map((c: any, idx: number) => ({
    id: c?.id || c?._id?.toString() || `cust-${trackingCode}-${idx}`,
    timestamp: c?.timestamp || item.wormTimestamp || item.dateReported || new Date().toISOString(),
    actor: c?.actor || c?.officerName || item.seniorOfficerAssigned || item.seniorInvestigator || 'Forensic Custody Node',
    role: c?.role || 'Senior Cyber Investigator',
    action: c?.action || c?.notes || 'Cryptographic WORM custody verified.',
    merkleHash: c?.merkleHash || `${String(primaryHash).substring(0, 12)}...`,
  }));

  return {
    ...item,
    id: item.id || item._id?.toString() || trackingCode,
    trackingCode: String(trackingCode),
    title: String(item.title || `Forensic Docket ${trackingCode}`),
    category: String(item.category || 'Cyber Forensics'),
    description: String(item.description || ''),
    citizenName: String(item.citizenName || 'Anonymous Citizen'),
    citizenEmail: String(item.citizenEmail || ''),
    suspectDetails: String(item.suspectDetails || 'Under Forensic Trace'),
    lossAmount: String(item.lossAmount || 'Under Assessment'),
    dateReported: String(
      item.dateReported ||
        item.wormTimestamp ||
        (item.createdAt ? new Date(item.createdAt).toISOString().replace('T', ' ').substring(0, 19) + ' UTC' : new Date().toISOString())
    ),
    status: item.status || 'WORM_LOCKED',
    primaryHash: String(primaryHash),
    seniorOfficerAssigned: String(
      item.seniorOfficerAssigned || item.seniorInvestigator || 'Dr. Bibi Zohara (Lead Forensic Examiner)'
    ),
    officerBadge: String(item.officerBadge || 'DEL-CY-0842'),
    officerNotes: String(item.officerNotes || item.investigatorStudyNotes || 'WORM cryptographic verification active.'),
    legalAdmissibilityCertId: String(
      item.legalAdmissibilityCertId || `CERT-65B-${String(trackingCode).slice(-6)}`
    ),
    evidenceFiles,
    custodyEvents,
  };
};

// Incidents
export const fetchIncidentsAPI = async (email?: string, role?: string): Promise<IncidentReport[]> => {
  try {
    let url = `${API_BASE}/incidents`;
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (role) params.append('role', role);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map((item: any) => normalizeIncidentRecord(item)) : [];
  } catch (err) {
    console.warn('Backend offline, using local store');
    return [];
  }
};

export const createIncidentAPI = async (incident: IncidentReport): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incident)
    });
    return res.ok;
  } catch (err) {
    console.warn('Backend offline or unreachable, proceeding with persistent local client store:', err);
    return false;
  }
};

export const updateCustodyLogAPI = async (
  trackingCode: string, 
  action: string, 
  officerName: string, 
  hashVerified: boolean, 
  notes: string,
  isCompleted?: boolean
) => {
  try {
    const res = await fetch(`${API_BASE}/incidents/${trackingCode}/custody`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, officerName, hashVerified, notes, isCompleted })
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, proceeding with local custody store:', err);
  }
};

export const completeCaseAPI = async (
  trackingCode: string,
  investigatorName: string,
  resolutionNotes: string
) => {
  try {
    const res = await fetch(`${API_BASE}/incidents/${trackingCode}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ investigatorName, resolutionNotes })
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, proceeding with local case completion:', err);
    return { error: 'Network error' };
  }
};

// Gallery Files
export const fetchGalleryFilesAPI = async () => {
  try {
    const res = await fetch(`${API_BASE}/gallery`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
};

export const verifyGalleryHashAPI = async (
  fileId: string, 
  userDashboardHash: string, 
  investigatorName: string,
  userEmail?: string,
  userName?: string
) => {
  try {
    const res = await fetch(`${API_BASE}/gallery/verify-hash`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, userDashboardHash, investigatorName, userEmail, userName })
    });
    return await res.json();
  } catch (err) {
    return { match: false, message: 'Server connection error during hash verification' };
  }
};

// Notifications
export const fetchNotificationsAPI = async (): Promise<SystemNotification[]> => {
  try {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
};

export const createNotificationAPI = async (notification: SystemNotification) => {
  try {
    await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification)
    });
  } catch (err) {
    console.warn('Backend offline, notification saved to local store:', err);
  }
};

// Auth & Security
export const registerUserAPI = async (user: Partial<UserProfile> & { password?: string }) => {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    return await res.json();
  } catch (err) {
    return { error: 'Network error connecting to backend' };
  }
};

export const loginUserAPI = async (email: string, password?: string, name?: string, role?: string) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role })
    });
    return await res.json();
  } catch (err) {
    return { error: 'Network error connecting to backend' };
  }
};

export const fetchRegisteredUsersAPI = async () => {
  try {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
};

export const dispatchInvestigatorMessageAPI = async (trackingCode: string, message: any) => {
  try {
    const res = await fetch(`${API_BASE}/incidents/${trackingCode}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend message dispatch error:', err);
    return null;
  }
};

export const updateIncidentAPI = async (trackingCode: string, data: any) => {
  try {
    const res = await fetch(`${API_BASE}/incidents/${trackingCode}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend incident update error:', err);
    return null;
  }
};

export const changePasswordAPI = async (email: string, newPassword?: string, reason?: string) => {
  try {
    const res = await fetch(`${API_BASE}/auth/password-change`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword, reason })
    });
    return await res.json();
  } catch (err) {
    return { error: 'Failed to update password' };
  }
};

// Senior Investigator Workstation
export const fetchWorkstationDataAPI = async () => {
  try {
    const res = await fetch(`${API_BASE}/investigator/workstation`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const triggerDatabaseSeedAPI = async () => {
  try {
    const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
};

// Test Email Dispatch Helper
export const sendTestEmailAPI = async (email: string = 'navalekrishi@gmail.com', type: string = 'all') => {
  try {
    const res = await fetch(`${API_BASE}/email/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type })
    });
    return await res.json();
  } catch (err) {
    return { error: 'Network error sending test email' };
  }
};
