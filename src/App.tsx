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
import { syncCrimeStoriesWithBackend } from './data/crimeStoriesStore';
import {
  syncSharedProblemsWithBackend,
  SharedProblemReport,
} from './data/sharedProblemsStore';
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

  // Sync incidents, crime stories, shared problems & notifications with backend in real-time
  useEffect(() => {
    let isMounted = true;

    const syncIncidents = async () => {
      try {
        const backendIncidents = await fetchIncidentsAPI(currentUser.email, currentUser.role);
        const localStored = getStoredIncidents();

        if (!isMounted) return;

        if (backendIncidents && Array.isArray(backendIncidents) && backendIncidents.length > 0) {
          // Merge backend records with any unsynced local records (backend wins on matching trackingCode)
          const mergedMap = new Map<string, IncidentReport>();
          backendIncidents.forEach((b) => mergedMap.set(b.trackingCode, b));
          localStored.forEach((l) => {
            if (!mergedMap.has(l.trackingCode)) {
              if (
                currentUser.role === 'senior_investigator' ||
                !currentUser.email ||
                (l.citizenEmail || '').toLowerCase().trim() === currentUser.email.toLowerCase().trim()
              ) {
                mergedMap.set(l.trackingCode, l);
              }
            }
          });
          const merged = Array.from(mergedMap.values());
          setIncidents(merged);
          saveStoredIncidents(merged);
        } else if (currentUser.email && currentUser.role === 'citizen') {
          const cleanEmail = currentUser.email.toLowerCase().trim();
          let isolated = localStored.filter(
            (i) => (i.citizenEmail || '').toLowerCase().trim() === cleanEmail
          );
          if (isolated.length === 0) {
            const { updatedList, folder } = ensureCitizenFolderExists(currentUser, localStored);
            saveStoredIncidents(updatedList);
            createIncidentAPI(folder).catch(() => {});
            isolated = [folder];
          }
          setIncidents(isolated);
        } else {
          setIncidents(localStored);
        }
      } catch (err) {
        console.warn('Backend incidents sync error:', err);
        if (isMounted) {
          setIncidents(getStoredIncidents());
        }
      }
    };

    const syncAll = () => {
      syncIncidents();
      syncCrimeStoriesWithBackend().catch(() => {});
      syncSharedProblemsWithBackend().catch(() => {});
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
      } else if (
        (hash === '#workstation-shared-problems' || hash === '#workstation-story-approvals') &&
        currentUser.role === 'senior_investigator'
      ) {
        setCurrentTab('investigator');
      }
    };
    handleUrlHash();
    window.addEventListener('hashchange', handleUrlHash);
    return () => {
      window.removeEventListener('hashchange', handleUrlHash);
    };
  }, [currentUser.role]);

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

    if (
      notif.actionUrlHash === '#workstation-shared-problems' ||
      notif.badge === 'SHARE A PROBLEM'
    ) {
      window.location.hash = '#workstation-shared-problems';
      if (currentUser.role === 'senior_investigator') {
        setCurrentTab('investigator');
      } else {
        setIsAuthModalOpen(true);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (
      notif.actionUrlHash === '#workstation-story-approvals' ||
      notif.badge === 'PDF VERIFICATION QUEUED'
    ) {
      if (currentUser.role === 'senior_investigator') {
        window.location.hash = '#workstation-story-approvals';
        setCurrentTab('investigator');
      } else {
        setCurrentTab('incidents');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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
      const { updatedList, folder } = ensureCitizenFolderExists(updated, incidents);
      setIncidents(updatedList);
      saveStoredIncidents(updatedList);
      if (folder) {
        createIncidentAPI(folder).catch(() => {});
      }
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
    problemText: string,
    sourceLink: string,
    categoryName?: string,
    createdReport?: SharedProblemReport
  ) => {
    const hash =
      createdReport?.sha256 ||
      (await computeSHA256(`${sourceLink}::${problemText}::${Date.now()}`));
    const tracking = createdReport?.trackingCode || generateTrackingCode();
    const reporterName = currentUser.name || 'Anonymous Citizen Reporter';
    const reporterEmail = currentUser.email || 'anonymous-intake@fip-gateway.gov.in';

    const newIncident: IncidentReport = {
      id: `inc-${Date.now()}`,
      trackingCode: tracking,
      title: problemText.length > 60 ? problemText.substring(0, 57) + '...' : problemText,
      category: categoryName || 'Phishing & Malicious Link',
      description: `${problemText}\n\n[ORIGIN LINK]: ${sourceLink}`,
      citizenName: reporterName,
      citizenEmail: reporterEmail,
      suspectDetails: `Origin Link: ${sourceLink}`,
      lossAmount: 'Under Forensic Assessment',
      dateReported: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      status: 'WORM_LOCKED',
      primaryHash: hash,
      evidenceFiles: [
        {
          id: `ev-${Date.now()}`,
          name: 'shared_problem_and_origin_link.txt',
          size: (problemText.length + sourceLink.length) * 2,
          type: 'text/plain',
          sha256: hash,
          wormTimestamp: generateWORMStamp(),
        },
      ],
      seniorOfficerAssigned: 'Krishi · AI Command',
      officerBadge: 'I4C-NAT-7721',
      officerNotes: `Shared Problem & Origin Link (${sourceLink}) received via Cryptographic Credential Gateway. Routed to Workstation Share a Problem Sector.`,
      legalAdmissibilityCertId: `CERT-65B-2026-PROB-${Math.floor(10000 + Math.random() * 90000)}`,
      rawOriginalContent: `Origin Link: ${sourceLink}\nProblem: ${problemText}`,
      hashFormat: {
        sha256: hash,
        merkleRoot: hash.substring(0, 32),
        algorithm: 'SHA-256 / RFC-3161 WORM Ledger',
        byteSize: problemText.length + sourceLink.length,
        wormDigest: `WORM-LEDGER-BLK-${tracking.replace(/[^0-9]/g, '').slice(0, 6) || '849102'}-SEC65B`,
      },
      custodyEvents: [
        {
          id: `cust-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          actor: 'Cryptographic Credential Gateway (Share Problem)',
          role: 'Zero-Friction Citizen Intake',
          action: `Problem & Origin Link (${sourceLink}) submitted and routed to Workstation Share a Problem Sector.`,
          merkleHash: hash.substring(0, 16) + '...',
        },
      ],
    };

    const nextList = [newIncident, ...incidents];
    setIncidents(nextList);
    saveStoredIncidents(nextList);

    try {
      await createIncidentAPI(newIncident);
    } catch (err) {
      console.warn('Backend direct intake sync error:', err);
    }

    addNotification({
      type: 'CUSTODY_ALERT',
      title: `🚨 Share a Problem Alert (${tracking})`,
      message: `Problem shared with origin link [${sourceLink}]: "${problemText.substring(0, 90)}${problemText.length > 90 ? '...' : ''}" — Routed to Workstation Share a Problem Sector for inspection & resolution.`,
      recipientRole: 'all',
      relatedTrackingCode: tracking,
      actionUrlHash: '#workstation-shared-problems',
      senderName: 'F.I.P Gateway · Share Problem',
      badge: 'SHARE A PROBLEM',
    });
    setNotifications(getStoredNotifications());
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
    if (tab === 'investigator' && currentUser.role !== 'senior_investigator') {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentTab(tab as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLightWorkspace = currentTab === 'dashboard' || currentTab === 'investigator';

  return (
    <div
      className={`min-h-screen flex flex-col selection:bg-[#FF4D15] selection:text-white ${
        isLightWorkspace ? 'bg-[#F4F5F8] text-[#111318]' : 'bg-[#070709] text-white'
      }`}
    >
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
            onNavigateToInvestigator={
              currentUser.role === 'senior_investigator'
                ? () => handleNavigate('investigator')
                : undefined
            }
          />
        )}

        {currentTab === 'investigator' && currentUser.role === 'senior_investigator' && (
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

        {currentTab === 'investigator' && currentUser.role !== 'senior_investigator' && (
          <div className="w-full min-h-[75vh] bg-[#070709] flex items-center justify-center px-4 py-16">
            <div className="max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-[#111116] border border-[#FF4D15]/40 text-center space-y-5 shadow-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF4D15]/15 border border-[#FF4D15]/40 text-[#FF4D15] text-[11px] font-mono-code font-bold uppercase tracking-wider">
                Restricted Command Node
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Senior Investigator Clearance Required
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                The F.I.P Examiner Workstation &amp; AI Syndicate Engine is strictly restricted to accredited Senior Investigators (Krishi, Dr. Bibi Zohara, Sup. Balchandra, and Afsheen S).
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-3 rounded-full bg-[#FF4D15] hover:bg-[#E03E0B] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Authenticate as Senior Investigator →
                </button>
                <button
                  onClick={() => setCurrentTab('home')}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Return Home
                </button>
              </div>
            </div>
          </div>
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
        currentUser={currentUser}
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
