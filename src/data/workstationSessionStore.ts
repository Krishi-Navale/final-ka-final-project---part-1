import { computeSHA256 } from '../utils/crypto';

export interface WorkstationTamperAttempt {
  id: string;
  sessionId: string;
  attemptedByName: string;
  attemptedAt: string;
  targetField: string;
  originalValue: string;
  attemptedFakeValue: string;
  expectedSha256: string;
  corruptedSha256: string;
  verdict: 'CAUGHT_AND_BLOCKED';
}

export interface WorkstationDutySession {
  id: string;
  investigatorName: string;
  badgeNumber: string;
  loginTime: string;
  logoutTime: string | null;
  status: 'ACTIVE_ON_DUTY' | 'LOGGED_OUT_SEALED' | 'TAMPER_FLAGGED';
  wormSha256Hash: string;
  casesReviewedCount: number;
  casesSealedForCourtCount: number;
  tamperAttempts: WorkstationTamperAttempt[];
}

const STORAGE_KEY_SESSIONS = 'fip_workstation_duty_sessions_v1';
const STORAGE_KEY_ACTIVE_SESSION_ID = 'fip_workstation_active_session_id_v1';

export const formatExactForensicTimestamp = (d: Date = new Date()): string => {
  return d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
};

export const INITIAL_WORKSTATION_SESSIONS: WorkstationDutySession[] = [
  {
    id: 'WS-DUTY-2026-9041',
    investigatorName: 'Dr. Bibi Zohara',
    badgeNumber: 'DEL-CY-0842',
    loginTime: '2026-11-18 09:14:22 UTC',
    logoutTime: '2026-11-18 13:48:10 UTC',
    status: 'LOGGED_OUT_SEALED',
    wormSha256Hash: 'a4f9128c019e4b77c2189401a9f883217c410298ab819201948102938471829a',
    casesReviewedCount: 4,
    casesSealedForCourtCount: 2,
    tamperAttempts: [],
  },
  {
    id: 'WS-DUTY-2026-9042',
    investigatorName: 'Balchandra',
    badgeNumber: 'MAH-CY-1109',
    loginTime: '2026-11-18 14:05:11 UTC',
    logoutTime: '2026-11-18 17:32:49 UTC',
    status: 'LOGGED_OUT_SEALED',
    wormSha256Hash: '7c8910293847102938475610293847561029384756a8b9c0d1e2f3a4b5c6d7e8',
    casesReviewedCount: 3,
    casesSealedForCourtCount: 1,
    tamperAttempts: [],
  },
];

export function getStoredWorkstationSessions(): WorkstationDutySession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(INITIAL_WORKSTATION_SESSIONS));
      return INITIAL_WORKSTATION_SESSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_WORKSTATION_SESSIONS;
  } catch {
    return INITIAL_WORKSTATION_SESSIONS;
  }
}

export function saveStoredWorkstationSessions(sessions: WorkstationDutySession[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    window.dispatchEvent(
      new CustomEvent('fip_workstation_sessions_updated', { detail: sessions })
    );
  } catch (err) {
    console.warn('Could not persist workstation sessions locally:', err);
  }
}

export function getActiveWorkstationSessionId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_SESSION_ID);
  } catch {
    return null;
  }
}

export function setActiveWorkstationSessionId(sessionId: string | null): void {
  try {
    if (sessionId) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_SESSION_ID, sessionId);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_SESSION_ID);
    }
  } catch {
    // ignore
  }
}

export async function syncWorkstationSessionsWithBackend(): Promise<WorkstationDutySession[]> {
  try {
    const res = await fetch('/api/workstation/sessions');
    if (!res.ok) return getStoredWorkstationSessions();
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      saveStoredWorkstationSessions(data);
      return data;
    }
    return getStoredWorkstationSessions();
  } catch {
    return getStoredWorkstationSessions();
  }
}

export async function signInWorkstationDutySession(
  investigatorName: string,
  badgeNumber: string
): Promise<WorkstationDutySession> {
  const cleanName = investigatorName.trim();
  const loginTime = formatExactForensicTimestamp(new Date());
  const sessionId = `WS-DUTY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const rawPayload = `WORM-DUTY-SIGNIN|${sessionId}|${cleanName}|${badgeNumber}|${loginTime}`;
  const wormSha256Hash = await computeSHA256(rawPayload);

  const newSession: WorkstationDutySession = {
    id: sessionId,
    investigatorName: cleanName,
    badgeNumber,
    loginTime,
    logoutTime: null,
    status: 'ACTIVE_ON_DUTY',
    wormSha256Hash,
    casesReviewedCount: 0,
    casesSealedForCourtCount: 0,
    tamperAttempts: [],
  };

  const current = getStoredWorkstationSessions();
  const next = [newSession, ...current];
  saveStoredWorkstationSessions(next);
  setActiveWorkstationSessionId(newSession.id);

  try {
    await fetch('/api/workstation/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSession),
    });
  } catch {
    // offline fallback already saved
  }

  return newSession;
}

export async function signOutWorkstationDutySession(
  sessionId: string
): Promise<WorkstationDutySession | null> {
  const logoutTime = formatExactForensicTimestamp(new Date());
  const current = getStoredWorkstationSessions();
  const target = current.find((s) => s.id === sessionId);
  if (!target) {
    setActiveWorkstationSessionId(null);
    return null;
  }

  const rawPayload = `WORM-DUTY-SIGNOUT|${target.id}|${target.investigatorName}|${target.loginTime}|${logoutTime}`;
  const finalHash = await computeSHA256(rawPayload);

  const updatedSession: WorkstationDutySession = {
    ...target,
    logoutTime,
    status: target.tamperAttempts.length > 0 ? 'TAMPER_FLAGGED' : 'LOGGED_OUT_SEALED',
    wormSha256Hash: finalHash,
  };

  const next = current.map((s) => (s.id === sessionId ? updatedSession : s));
  saveStoredWorkstationSessions(next);
  setActiveWorkstationSessionId(null);

  try {
    await fetch(`/api/workstation/sessions/${sessionId}/logout`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        logoutTime,
        status: updatedSession.status,
        wormSha256Hash: finalHash,
      }),
    });
  } catch {
    // offline fallback already saved
  }

  return updatedSession;
}

export async function recordWorkstationTamperAttempt(
  sessionId: string,
  attemptedByName: string,
  targetField: string,
  originalValue: string,
  attemptedFakeValue: string
): Promise<{ updatedSession: WorkstationDutySession; attempt: WorkstationTamperAttempt } | null> {
  const current = getStoredWorkstationSessions();
  const target = current.find((s) => s.id === sessionId);
  if (!target) return null;

  const attemptedAt = formatExactForensicTimestamp(new Date());
  const corruptedSha256 = await computeSHA256(
    `CORRUPTED-MUTATION|${sessionId}|${attemptedByName}|${targetField}|${attemptedFakeValue}|${attemptedAt}`
  );

  const attempt: WorkstationTamperAttempt = {
    id: `TAMPER-${Date.now().toString().slice(-6)}`,
    sessionId,
    attemptedByName: attemptedByName.trim() || target.investigatorName,
    attemptedAt,
    targetField,
    originalValue,
    attemptedFakeValue,
    expectedSha256: target.wormSha256Hash,
    corruptedSha256,
    verdict: 'CAUGHT_AND_BLOCKED',
  };

  // Original loginTime / logoutTime / investigatorName remain 100% intact (WORM locked)
  // while the tamper attempt is permanently recorded on the session!
  const updatedSession: WorkstationDutySession = {
    ...target,
    status: 'TAMPER_FLAGGED',
    tamperAttempts: [attempt, ...(target.tamperAttempts || [])],
  };

  const next = current.map((s) => (s.id === sessionId ? updatedSession : s));
  saveStoredWorkstationSessions(next);

  try {
    await fetch(`/api/workstation/sessions/${sessionId}/tamper-attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attempt, status: 'TAMPER_FLAGGED' }),
    });
  } catch {
    // offline fallback already saved
  }

  return { updatedSession, attempt };
}
