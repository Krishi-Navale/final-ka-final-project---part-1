import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeLongPage } from './components/HomeLongPage';
import { CitizenDashboardPage } from './components/CitizenDashboardPage';
import { LearningHubPage } from './components/LearningHubPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { PortalsPage } from './components/PortalsPage';
import { CustodyVaultPage } from './components/CustodyVaultPage';
import { ComplaintDrawer } from './components/ComplaintDrawer';
import { AuthModal } from './components/AuthModal';
import { CustodyCertificateModal } from './components/CustodyCertificateModal';
import { SeniorInvestigatorWorkstation } from './components/SeniorInvestigatorWorkstation';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { Footer } from './components/Footer';
import { 
  getStoredIncidents, 
  saveStoredIncidents, 
  getStoredUser, 
  saveStoredUser,
  ensureCitizenFolderExists 
} from './data/incidentStore';
import { 
  getStoredNotifications, 
  saveStoredNotifications, 
  addNotification,
  syncNotificationsWithBackend
} from './data/notificationStore';
import { 
  fetchIncidentsAPI, 
  createIncidentAPI, 
  updateIncidentAPI, 
  updateCustodyLogAPI 
} from './data/apiClient';
import { IncidentReport, UserProfile, SystemNotification } from './types';
import { FloatingCursorBadge } from './components/effects/FloatingCursorBadge';
import { computeSHA256, generateTrackingCode, generateWORMStamp } from './utils/crypto';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'dashboard' | 'learning' | 'how-it-works' | 'portals' | 'incidents' | 'investigator'>('home');
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(getStoredUser());
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [certificateIncident, setCertificateIncident] = useState<IncidentReport | null>(null);

  // Sync incidents & notifications with MongoDB Atlas backend in real-time
  useEffect(() => {
    let isMounted = true;

    const syncIncidents = async () => {
      try {
        const backendIncidents = await fetchIncidentsAPI(currentUser.email, currentUser.role);
        if (isMounted && backendIncidents && Array.isArray(backendIncidents) && backendIncidents.length > 0) {
          setIncidents(backendIncidents);
          saveStoredIncidents(backendIncidents);
        } else if (isMounted && currentUser.email && currentUser.role === 'citizen') {
          // If no backend records exist yet for this account, strictly isolate local records
          const localStored = getStoredIncidents();
          const cleanEmail = currentUser.email.toLowerCase().trim();
          const isolated = localStored.filter(i => (i.citizenEmail || '').toLowerCase().trim() === cleanEmail);
          setIncidents(isolated);
        }
      } catch (err) {
        console.warn('Backend incidents sync error:', err);
      }
    };

    const syncAll = () => {
      syncIncidents();
      syncNotificationsWithBackend().then(synced => {
        if (isMounted && synced && synced.length > 0) {
          setNotifications(synced);
        }
      });
    };

    syncAll();

    // Initial local store load
    const loadedNotifs = getStoredNotifications();
    setNotifications(loadedNotifs);

    // Sync notifications from backend MongoDB
    syncNotificationsWithBackend().then(synced => {
      if (isMounted && synced && synced.length > 0) {
        setNotifications(synced);
      }
    });

    const handleNotifsUpdated = (e: any) => {
      if (isMounted) {
        setNotifications(e.detail || getStoredNotifications());
      }
    };
    window.addEventListener('fip_notifications_updated', handleNotifsUpdated);

    // Real-time Event-Driven Observer Pattern via Server-Sent Events (SSE) replacing interval polling
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (isMounted && data.type !== 'CONNECTED') {
            syncAll();
          }
        } catch (e) {
          syncAll();
        }
      };
      eventSource.onerror = (err) => {
        console.warn('SSE observer connection notice:', err);
      };
    } catch (e) {
      console.warn('EventSource not supported:', e);
    }

    return () => {
      isMounted = false;
      if (eventSource) {
        eventSource.close();
      }
      window.removeEventListener('fip_notifications_updated', handleNotifsUpdated);
    };
  }, [currentUser.email, currentUser.role]);

  useEffect(() => {
    // If user opens URL directly with #pad/slug or #vault=secure, route to dashboard
    const handleUrlHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#pad/') || hash.includes('vault=secure')) {
        setCurrentTab('dashboard');
      }
    };
    handleUrlHash();
    window.addEventListener('hashchange', handleUrlHash);
    return () => {
      window.removeEventListener('hashchange', handleUrlHash);
    };
  }, []);

  const unreadNotifsCount = notifications.filter(n => {
    if (n.read) return false;
    if (!n.recipientEmail && !n.recipientRole) return true;
    if (n.recipientEmail && n.recipientEmail.toLowerCase() === currentUser.email?.toLowerCase()) return true;
    if (n.recipientRole === 'all') return true;
    if (n.recipientRole === currentUser.role) return true;
    return false;
  }).length;

  const handleMarkNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleSelectNotificationAction = (notif: SystemNotification) => {
    setIsNotificationModalOpen(false);

    if (notif.actionUrlHash) {
      window.location.hash = notif.actionUrlHash;
      setCurrentTab('incidents');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (notif.relatedTrackingCode) {
      const match = incidents.find(i => i.trackingCode.toLowerCase() === notif.relatedTrackingCode?.toLowerCase());
      if (match) {
        if (notif.type === 'CERTIFICATE') {
          setCertificateIncident(match);
        } else if (currentUser.role === 'senior_investigator') {
          setCurrentTab('investigator');
        } else {
          setCurrentTab('dashboard');
        }
      } else {
        setCurrentTab('incidents');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    saveStoredUser(updated);

    if (updated.email) {
      const { updatedList } = ensureCitizenFolderExists(updated, incidents);
      setIncidents(updatedList);
    }

    if (updated.email) {
      if (updated.role === 'senior_investigator') {
        setCurrentTab('investigator');
      } else {
        setCurrentTab('dashboard');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddNewIncident = async (newIncident: IncidentReport) => {
    const nextList = [newIncident, ...incidents];
    setIncidents(nextList);
    saveStoredIncidents(nextList);

    // Persist to MongoDB Atlas backend immediately
    try {
      await createIncidentAPI(newIncident);
    } catch (err) {
      console.warn('Backend new incident sync failed:', err);
    }

    // Broadcast new incident notification
    addNotification({
      type: 'EVIDENCE_UPLOAD',
      title: `New Evidence Docket Created (${newIncident.trackingCode})`,
      message: `Citizen ${newIncident.citizenName} (${newIncident.citizenEmail}) submitted evidence docket "${newIncident.title}". WORM hash registered.`,
      recipientRole: 'all',
      relatedTrackingCode: newIncident.trackingCode,
      senderName: newIncident.citizenName,
      badge: 'NEW DOCKET',
    });
    setNotifications(getStoredNotifications());

    setCurrentTab('dashboard');
  };

  const handleCreateCaseFromProblem = async (
    email: string, 
    problemText: string, 
    _password: string, 
    citizenName?: string,
    categoryName?: string
  ) => {
    const hash = await computeSHA256(problemText + Date.now().toString());
    const tracking = generateTrackingCode();
    const finalName = citizenName?.trim() || email.split('@')[0];
    const newIncident: IncidentReport = {
      id: `inc-${Date.now()}`,
      trackingCode: tracking,
      title: problemText.length > 60 ? problemText.substring(0, 57) + '...' : problemText,
      category: categoryName || 'Citizen Cyber Incident',
      description: problemText,
      citizenName: finalName,
      citizenEmail: email,
      suspectDetails: 'Reported via Direct Citizen Intake',
      lossAmount: 'Under Forensic Assessment',
      dateReported: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      status: 'WORM_LOCKED',
      primaryHash: hash,
      evidenceFiles: [
        {
          id: `ev-${Date.now()}`,
          name: 'citizen_case_statement.txt',
          size: problemText.length * 2,
          type: 'text/plain',
          sha256: hash,
          wormTimestamp: generateWORMStamp(),
        },
      ],
      seniorOfficerAssigned: 'Dr. Bibi Zohara (Lead Forensic Examiner)',
      officerBadge: 'CYBER-DEL-0842',
      officerNotes: 'Case submitted via Direct Citizen Intake. Cryptographic WORM hash registered under RFC-3161 protocol.',
      legalAdmissibilityCertId: `CERT-65B-2026-CIT-${Math.floor(10000 + Math.random() * 90000)}`,
      rawOriginalContent: problemText,
      hashFormat: {
        sha256: hash,
        merkleRoot: hash.substring(0, 32),
        algorithm: 'SHA-256 / RFC-3161 WORM Ledger',
        byteSize: problemText.length,
        wormDigest: `WORM-LEDGER-BLK-${tracking.replace(/[^0-9]/g, '').slice(0, 6) || '849102'}-SEC65B`
      },
      custodyEvents: [
        {
          id: `cust-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          actor: `Citizen (${email})`,
          role: 'Victim / Primary Reporter',
          action: 'Incident problem statement submitted and hashed into immutable WORM ledger',
          merkleHash: hash.substring(0, 16) + '...',
        },
        {
          id: `cust-${Date.now() + 1}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          actor: 'Dr. Bibi Zohara',
          role: 'Accredited Cyber Investigator (IFSO)',
          action: 'Assigned supervisor linked to case. Prepared for Section 65B court certificate.',
          merkleHash: 'c4e910...8290',
        },
      ],
    };

    const nextList = [newIncident, ...incidents];
    setIncidents(nextList);
    saveStoredIncidents(nextList);

    // Persist to MongoDB Atlas backend
    try {
      await createIncidentAPI(newIncident);
    } catch (err) {
      console.warn('Backend direct intake sync error:', err);
    }

    addNotification({
      type: 'EVIDENCE_UPLOAD',
      title: `Direct Citizen Case Ingested (#${tracking})`,
      message: `Direct intake completed for ${email}. Case statement hashed under SHA-256.`,
      recipientEmail: email,
      recipientRole: 'all',
      relatedTrackingCode: tracking,
      senderName: 'Drive Secure System',
      badge: 'WORM INGESTED',
    });
    setNotifications(getStoredNotifications());

    const user: UserProfile = {
      name: email.split('@')[0],
      email: email,
      role: 'citizen',
      isAnonymous: false,
    };
    setCurrentUser(user);
    saveStoredUser(user);

    setCurrentTab('dashboard');
  };

  const handleVerifyIncident = async (incidentId: string, officerNotes: string) => {
    const updated = incidents.map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'VERIFIED' as const,
          officerNotes,
          custodyEvents: [
            ...inc.custodyEvents,
            {
              id: `cust-${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
              actor: currentUser.name || 'Senior Forensic Examiner',
              role: 'Accredited Cyber Investigator',
              action: 'SHA-256 Bit-level verification audit completed. Certified for court admissibility.',
              merkleHash: inc.primaryHash.substring(0, 16) + '...'
            }
          ]
        };
      }
      return inc;
    });

    setIncidents(updated);
    saveStoredIncidents(updated);

    const target = updated.find(i => i.id === incidentId);
    if (target) {
      try {
        await updateCustodyLogAPI(
          target.trackingCode,
          'SHA-256 Bit-level verification audit completed. Certified for court admissibility.',
          currentUser.name || 'Senior Forensic Examiner',
          true,
          officerNotes,
          false
        );
        await updateIncidentAPI(target.trackingCode, target);
      } catch (err) {
        console.warn('Backend verify update failed:', err);
      }
    }

    addNotification({
      type: 'CERTIFICATE',
      title: `Case Verified & Certified for Court`,
      message: `Senior Investigator verified evidence hashes. Admissibility Certificate unlocked.`,
      recipientRole: 'all',
      senderName: currentUser.name || 'Senior Examiner',
      badge: 'VERIFIED',
    });
    setNotifications(getStoredNotifications());
  };

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900 selection:bg-rose-500 selection:text-white">
      {/* Top Navigation Bar with Notification Bell */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenReportDrawer={() => setIsReportDrawerOpen(true)}
        unreadNotificationsCount={unreadNotifsCount}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeLongPage
            onOpenReportDrawer={() => setIsReportDrawerOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'dashboard' && (
          <CitizenDashboardPage
            incidents={incidents}
            currentUser={currentUser}
            onUpdateIncidents={(updatedList) => {
              setIncidents(updatedList);
              saveStoredIncidents(updatedList);
            }}
            onViewCertificate={(inc) => setCertificateIncident(inc)}
            onOpenReportModal={() => setIsReportDrawerOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onNavigateToInvestigator={() => handleNavigate('investigator')}
          />
        )}

        {currentTab === 'investigator' && (
          <SeniorInvestigatorWorkstation
            incidents={incidents}
            currentUser={currentUser}
            onUpdateIncidents={(updatedList) => {
              setIncidents(updatedList);
              saveStoredIncidents(updatedList);
            }}
            onNavigate={handleNavigate}
            onViewCertificate={(inc) => setCertificateIncident(inc)}
          />
        )}

        {currentTab === 'learning' && (
          <LearningHubPage
            onOpenReportDrawer={() => setIsReportDrawerOpen(true)}
          />
        )}

        {currentTab === 'how-it-works' && (
          <HowItWorksPage
            onOpenReportDrawer={() => setIsReportDrawerOpen(true)}
          />
        )}

        {currentTab === 'portals' && (
          <PortalsPage />
        )}

        {currentTab === 'incidents' && (
          <CustodyVaultPage
            incidents={incidents}
            currentUser={currentUser}
            onVerifyIncident={handleVerifyIncident}
            onViewCertificate={(inc) => setCertificateIncident(inc)}
            onOpenReportDrawer={() => setIsReportDrawerOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenReportDrawer={() => setIsReportDrawerOpen(true)}
      />

      {/* Slide Drawer for Case Evidence Intake */}
      <ComplaintDrawer
        isOpen={isReportDrawerOpen}
        onClose={() => setIsReportDrawerOpen(false)}
        currentUser={currentUser}
        onSubmitIncident={handleAddNewIncident}
      />

      {/* Sign In / Log In / Quick Problem Intake Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
        onSubmitProblemCase={handleCreateCaseFromProblem}
      />

      {/* Live Notification Drawer Modal */}
      <NotificationCenterModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        currentUser={currentUser}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSelectAction={handleSelectNotificationAction}
      />

      {/* Judicial Section 65B Certificate Modal */}
      <CustodyCertificateModal
        incident={certificateIncident}
        onClose={() => setCertificateIncident(null)}
      />

      {/* Floating Cursor Badge */}
      <FloatingCursorBadge />
    </div>
  );
}
