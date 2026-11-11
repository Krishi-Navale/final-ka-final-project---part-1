export interface EvidenceFile {
  id: string;
  name: string;
  size: number;
  type: string;
  sha256: string;
  wormTimestamp: string;
  previewUrl?: string;
  tampered?: boolean;
  rawContent?: string;
  hashFormat?: {
    sha256: string;
    md5?: string;
    algorithm: string;
    byteLength: number;
    hashDigestFormatted: string;
  };
}

export type IncidentStatus = 'WORM_LOCKED' | 'ASSIGNED' | 'VERIFIED' | 'SUBMITTED_TO_COURT';

export interface InvestigatorMessage {
  id: string;
  timestamp: string;
  sender: string;
  senderBadge: string;
  recipientEmail: string;
  type: 'URGENT_INSTRUCTION' | 'STATUS_UPDATE' | 'EVIDENCE_REQUEST' | 'COURT_NOTICE' | 'OFFICIAL_REPLY' | 'CITIZEN_REPLY' | 'EVIDENCE_FULFILLMENT';
  subject: string;
  content: string;
  read?: boolean;
  merkleStamp?: string;
  replyToId?: string;
  attachedEvidenceName?: string;
  attachedEvidenceHash?: string;
}

export interface CustodyEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  merkleHash: string;
}

export interface IncidentReport {
  id: string;
  trackingCode: string;
  title: string;
  category: string;
  description: string;
  citizenName: string;
  citizenEmail: string;
  isConfidentialReport?: boolean;
  suspectDetails?: string;
  lossAmount?: string;
  dateReported: string;
  status: IncidentStatus;
  primaryHash: string;
  evidenceFiles: EvidenceFile[];
  seniorOfficerAssigned: string;
  officerBadge: string;
  officerNotes?: string;
  investigatorStudyNotes?: string;
  investigationProgress?: number;
  investigatorMessages?: InvestigatorMessage[];
  lastInvestigatedAt?: string;
  custodyEvents: CustodyEvent[];
  legalAdmissibilityCertId: string;
  rawOriginalContent?: string;
  folderName?: string;
  address?: string;
  place?: string;
  time?: string;
  hashFormat?: {
    sha256: string;
    merkleRoot: string;
    algorithm: string;
    byteSize: number;
    wormDigest: string;
  };
}

export interface PortalItem {
  id: string;
  name: string;
  jurisdiction: 'India' | 'Global';
  country: string;
  department: string;
  url: string;
  purpose: string;
  contactHotline: string;
  verifiedGovDomain: string;
  badge: string;
}

export interface AwarenessCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  dos: string[];
  donts: string[];
  actionSteps: string[];
  dangerLevel: 'Critical' | 'High' | 'Moderate';
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'citizen' | 'senior_investigator';
  isAnonymous?: boolean;
  badgeNumber?: string;
  stationName?: string;
}

export type NotificationType = 'CERTIFICATE' | 'DIRECT_NOTICE' | 'HANDOVER' | 'CUSTODY_ALERT' | 'DONTPAD_SYNC' | 'EVIDENCE_UPLOAD' | 'LIEN_ISSUED';

export interface SystemNotification {
  id: string;
  timestamp: string;
  type: NotificationType;
  title: string;
  message: string;
  recipientEmail?: string;
  recipientRole?: 'citizen' | 'senior_investigator' | 'all';
  read: boolean;
  relatedTrackingCode?: string;
  relatedIncidentId?: string;
  actionUrlHash?: string;
  senderName?: string;
  badge?: string;
}

export interface DontpadPad {
  slug: string;
  content: string;
  lastUpdated: string;
  sha256: string;
  isWormLocked: boolean;
  createdEmail?: string;
  editorName?: string;
  historyCount: number;
  expiresAt?: string; // ISO string for 24-hour expiration
  is24hTemporary?: boolean;
  savedFor24h?: boolean;
}

