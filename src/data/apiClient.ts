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
    return Array.isArray(data) 
      ? data.map((item: any) => ({
          ...item,
          id: item.id || item._id?.toString() || item.trackingCode
        }))
      : [];
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
