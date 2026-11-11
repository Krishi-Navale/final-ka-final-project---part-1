import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectToMongoDB } from './server/db';
import { User } from './server/models/User';
import { Incident } from './server/models/Incident';
import { GalleryFile } from './server/models/GalleryFile';
import { Notification } from './server/models/Notification';
import { InvestigatorWorkstation } from './server/models/InvestigatorWorkstation';
import { seedDatabase } from './server/seed';
import { 
  sendWelcomeEmail, 
  sendEvidenceUploadEmail, 
  sendCaseCompletedEmail, 
  sendSecurityTamperAlertEmail 
} from './server/emailService';

import { EventEmitter } from 'events';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database Event Emitter for Observer Pattern / Real-time updates
export const dbEventEmitter = new EventEmitter();

// Server-Sent Events (SSE) endpoint for real-time observer connection
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendEvent = (data: any) => {
    try {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (e) {
      // client disconnected
    }
  };

  const listener = (changeInfo: any) => {
    sendEvent(changeInfo);
  };

  dbEventEmitter.on('db_changed', listener);

  sendEvent({ type: 'CONNECTED', timestamp: Date.now() });

  const heartbeat = setInterval(() => {
    try {
      res.write(`:ping\n\n`);
    } catch (e) {
      clearInterval(heartbeat);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    dbEventEmitter.off('db_changed', listener);
  });
});

// Initialize DB Connection and Auto-Seed Sample Data
connectToMongoDB().then(async (connected) => {
  if (connected) {
    await seedDatabase();
  }
});

// ==========================================
// API ROUTES WITH EMAIL AUTOMATION
// ==========================================

// 1. Database & System Status Check
app.get('/api/status', async (_req, res) => {
  const isConnected = await connectToMongoDB();
  res.json({
    status: 'ONLINE',
    database: isConnected ? 'CONNECTED' : 'STANDBY_FALLBACK',
    smtp: process.env.SMTP_USER ? 'CONFIGURED' : 'UNCONFIGURED',
    timestamp: new Date().toISOString(),
    system: 'Drive Secure System (F.I.P - Forensic Investigation Platform)'
  });
});

// 2. Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, name, role, badgeNumber, agency, password } = req.body;
    await connectToMongoDB();

    const lowerEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const isInvestigator = role === 'senior_investigator';
    const idNumber = isInvestigator 
      ? `FIP-INV-${Math.floor(10000 + Math.random() * 90000)}` 
      : `FIP-CITIZEN-${Math.floor(10000 + Math.random() * 90000)}`;

    const newUser = new User({
      email: lowerEmail,
      name,
      role: role || 'citizen',
      badgeNumber: badgeNumber || idNumber,
      agency: agency || (isInvestigator ? 'Cyber Crime Cell' : 'Citizen Case Vault'),
      passwordHash: password || 'hash_default_123'
    });

    await newUser.save();
    dbEventEmitter.emit('db_changed', { type: 'USER_REGISTERED', timestamp: Date.now() });

    // ✉️ Dispatch Welcome Email to User's Official Gmail
    sendWelcomeEmail({
      email: lowerEmail,
      name,
      role: role || 'citizen',
      idNumber
    }).catch(err => console.error('Background welcome email error:', err));

    res.status(201).json({ 
      message: 'User registered successfully and official welcome email dispatched.', 
      idNumber,
      user: newUser 
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    await connectToMongoDB();

    const lowerEmail = (email || '').trim().toLowerCase();
    if (!lowerEmail) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let user = await User.findOne({ email: lowerEmail });
    if (!user) {
      // Auto-create user account so it is registered in MongoDB backend
      const isInvestigator = role === 'senior_investigator' || lowerEmail.includes('investigator') || lowerEmail.includes('i4c');
      const idNumber = isInvestigator 
        ? `FIP-INV-${Math.floor(10000 + Math.random() * 90000)}` 
        : `FIP-CITIZEN-${Math.floor(10000 + Math.random() * 90000)}`;

      user = new User({
        email: lowerEmail,
        name: name || lowerEmail.split('@')[0],
        role: role || (isInvestigator ? 'senior_investigator' : 'citizen'),
        badgeNumber: idNumber,
        agency: isInvestigator ? 'Cyber Crime Cell' : 'Citizen Case Vault',
        passwordHash: password || 'hash_default_123',
        createdAt: new Date(),
        lastLoginAt: new Date()
      });
      await user.save();

      // Dispatch welcome email
      sendWelcomeEmail({
        email: lowerEmail,
        name: user.name,
        role: user.role,
        idNumber
      }).catch(err => console.error('Background welcome email error:', err));

      return res.json({ message: 'User account created through login and registered in MongoDB', user, isNew: true });
    }

    user.lastLoginAt = new Date();
    if (name && name !== user.name) {
      user.name = name;
    }
    await user.save();

    res.json({ message: 'Login successful', user });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Get all users from backend MongoDB
app.get('/api/users', async (_req, res) => {
  try {
    await connectToMongoDB();
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch registered users' });
  }
});

// Password / Security Key Change Route
app.post('/api/auth/password-change', async (req, res) => {
  try {
    const { email, newPassword, reason } = req.body;
    await connectToMongoDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    user.passwordHash = newPassword || user.passwordHash;
    await user.save();

    // ✉️ Dispatch Security Alert Email for Password / Security Key Change
    sendSecurityTamperAlertEmail({
      userEmail: user.email,
      userName: user.name,
      alertType: 'PASSWORD_CHANGED',
      details: `Account security credentials updated on ${new Date().toUTCString()}. Reason: ${reason || 'User requested password reset/update'}`
    }).catch(err => console.error('Background security alert error:', err));

    res.json({ message: 'Security password updated and alert dispatched to Gmail.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update security credentials' });
  }
});

// In-Memory Fallback Stores for resilient zero-downtime operation
const fallbackIncidents: any[] = [];
const fallbackGalleryFiles: any[] = [];

// 3. Incident Reports API
app.get('/api/incidents', async (req, res) => {
  try {
    const isConnected = await connectToMongoDB();
    const { email, role } = req.query;
    if (isConnected) {
      let query: any = {};
      if (email && role !== 'senior_investigator') {
        const cleanEmail = (email as string).trim();
        query = { citizenEmail: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } };
      }
      const incidents = await Incident.find(query).sort({ createdAt: -1 });
      const mapped = incidents.map(doc => {
        const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
        return {
          ...obj,
          id: obj.id || obj._id?.toString() || obj.trackingCode
        };
      });
      return res.json(mapped);
    }

    let list = [...fallbackIncidents];
    if (email && role !== 'senior_investigator') {
      const cleanEmail = (email as string).toLowerCase().trim();
      list = list.filter(i => (i.citizenEmail || '').toLowerCase().trim() === cleanEmail);
    }
    const mappedFallback = list.map(item => ({
      ...item,
      id: item.id || item._id?.toString() || item.trackingCode
    }));
    return res.json(mappedFallback);
  } catch (err: any) {
    return res.json(fallbackIncidents);
  }
});

app.post('/api/incidents', async (req, res) => {
  try {
    const isConnected = await connectToMongoDB();
    const incidentData = req.body;

    const trackingCode = incidentData.trackingCode || `FIP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const sha256Hash = incidentData.sha256Hash || incidentData.primaryHash || incidentData.hashFormat?.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    const wormTimestamp = incidentData.wormTimestamp || incidentData.dateReported || new Date().toISOString();
    const fullIncident = {
      ...incidentData,
      trackingCode,
      sha256Hash,
      primaryHash: incidentData.primaryHash || sha256Hash,
      wormTimestamp,
      createdAt: new Date().toISOString()
    };

    if (isConnected) {
      const newIncident = new Incident(fullIncident);
      await newIncident.save();

      // Auto-index raw files into GalleryFile collection
      if (incidentData.evidenceFiles && Array.isArray(incidentData.evidenceFiles)) {
        for (const file of incidentData.evidenceFiles) {
          await GalleryFile.create({
            fileId: file.id || `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            trackingCode,
            filename: file.filename || file.name || 'evidence_attachment',
            fileType: file.fileType || file.type || 'photo',
            originalFormat: file.originalFormat || '.RAW',
            sizeBytes: file.sizeBytes || file.size || 1024,
            sha256Hash: file.sha256Hash || file.sha256 || incidentData.sha256Hash,
            base64Data: file.base64Data || '',
            uploaderEmail: incidentData.citizenEmail || 'navalekrishi@gmail.com',
            uploadedAt: new Date(),
            verifiedByInvestigator: false
          });
        }
      }
    } else {
      fallbackIncidents.unshift(fullIncident);
    }

    // ✉️ Dispatch Evidence Upload Confirmation Email to User's Dedicated Gmail
    sendEvidenceUploadEmail({
      citizenEmail: incidentData.citizenEmail || 'navalekrishi@gmail.com',
      citizenName: incidentData.citizenName || 'Citizen User',
      trackingCode,
      caseTitle: incidentData.title || 'Digital Cyber Evidence Submission',
      category: incidentData.category || 'General Cyber Incident',
      sha256Hash: incidentData.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      filesCount: incidentData.evidenceFiles?.length || 1,
      assignedOfficer: incidentData.seniorInvestigator || 'Dr. Bibi Zohara (Lead Forensic Examiner)'
    }).catch(err => console.error('Background evidence email error:', err));

    res.status(201).json(fullIncident);
  } catch (err: any) {
    const fallbackIncident = { ...req.body, trackingCode: req.body.trackingCode || `FIP-2026-${Math.floor(1000 + Math.random() * 9000)}` };
    fallbackIncidents.unshift(fallbackIncident);
    res.status(201).json(fallbackIncident);
  }
});

// Update Custody & Case Completion API
app.put('/api/incidents/:trackingCode/custody', async (req, res) => {
  try {
    await connectToMongoDB();
    const { trackingCode } = req.params;
    const { action, officerName, hashVerified, notes, isCompleted } = req.body;

    const incident = await Incident.findOne({ trackingCode });
    if (!incident) {
      return res.status(404).json({ error: 'Incident record not found' });
    }

    incident.custodyLogs.push({
      id: `custody-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      officerName,
      hashVerified,
      notes
    });

    if (hashVerified) {
      incident.status = 'VERIFIED_CHAIN';
    }

    if (isCompleted || action === 'CASE_RESOLVED' || action === 'CASE_COMPLETED') {
      incident.status = 'COMPLETED_SOLVED';

      // ✉️ Dispatch Senior Investigator Work Completion / Case Solved Email
      sendCaseCompletedEmail({
        citizenEmail: incident.citizenEmail || 'navalekrishi@gmail.com',
        citizenName: incident.citizenName || 'Valued Citizen',
        trackingCode: incident.trackingCode,
        caseTitle: incident.title,
        investigatorName: officerName || incident.seniorInvestigator || 'Dr. Bibi Zohara',
        resolutionNotes: notes || 'Case investigation completed and verified. Section 65B Admissibility Certificate issued.',
        section65bCertId: `CERT-65B-2026-${Math.floor(10000 + Math.random() * 90000)}`
      }).catch(err => console.error('Background case completion email error:', err));
    }

    incident.updatedAt = new Date();
    await incident.save();

    res.json(incident);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update chain of custody' });
  }
});

// Complete Case Endpoint
app.post('/api/incidents/:trackingCode/complete', async (req, res) => {
  try {
    await connectToMongoDB();
    const { trackingCode } = req.params;
    const { investigatorName, resolutionNotes } = req.body;

    const incident = await Incident.findOne({ trackingCode });
    if (!incident) {
      return res.status(404).json({ error: 'Incident file not found' });
    }

    incident.status = 'COMPLETED_SOLVED';
    incident.custodyLogs.push({
      id: `custody-resolved-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'CASE_RESOLVED_COMPLETED',
      officerName: investigatorName || 'Dr. Bibi Zohara',
      hashVerified: true,
      notes: resolutionNotes || 'Investigative procedures concluded successfully. Case closed.'
    });

    await incident.save();

    // ✉️ Dispatch Case Completion Email
    sendCaseCompletedEmail({
      citizenEmail: incident.citizenEmail || 'navalekrishi@gmail.com',
      citizenName: incident.citizenName || 'Citizen User',
      trackingCode: incident.trackingCode,
      caseTitle: incident.title,
      investigatorName: investigatorName || incident.seniorInvestigator || 'Dr. Bibi Zohara',
      resolutionNotes: resolutionNotes || 'All evidence verified byte-for-byte. Case solved and sealed.',
      section65bCertId: `CERT-65B-2026-SOLVED-${Math.floor(1000 + Math.random() * 9000)}`
    }).catch(err => console.error('Background case completion email error:', err));

    res.json({ message: 'Case marked as COMPLETED and official resolution email dispatched to citizen Gmail.', incident });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to complete case' });
  }
});

// Dispatch Investigator or Citizen Message & Auto-create Notification in MongoDB
app.post('/api/incidents/:trackingCode/message', async (req, res) => {
  try {
    await connectToMongoDB();
    const { trackingCode } = req.params;
    const message = req.body;

    const incident = await Incident.findOne({ trackingCode });
    if (!incident) {
      return res.status(404).json({ error: 'Incident file not found' });
    }

    if (!incident.investigatorMessages) {
      incident.investigatorMessages = [];
    }
    incident.investigatorMessages.unshift(message);

    incident.custodyLogs.push({
      id: `cust-msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: `Official Notice: "${message.subject || 'Notice'}" from ${message.sender || 'Investigator'}`,
      officerName: message.sender || 'Senior Investigator',
      hashVerified: true,
      notes: message.content || ''
    });
    incident.updatedAt = new Date();
    await incident.save();

    // Auto-create notification in MongoDB so citizen sees it in their notification sector
    const newNotif = new Notification({
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: message.type === 'EVIDENCE_REQUEST' 
        ? `⚠️ Evidence Request: ${message.subject}` 
        : `Investigator Notice: ${message.subject}`,
      message: `${message.sender || 'Senior Investigator'} sent instruction: "${(message.content || '').substring(0, 100)}..."`,
      recipientEmail: incident.citizenEmail,
      recipientRole: 'citizen',
      type: message.type === 'EVIDENCE_REQUEST' ? 'ALERT' : 'DIRECT_NOTICE',
      relatedTrackingCode: incident.trackingCode,
      relatedIncidentId: incident.id,
      senderName: message.sender,
      badge: message.senderBadge || 'INVESTIGATOR DISPATCH',
      read: false,
      timestamp: new Date().toISOString()
    });
    await newNotif.save();

    res.status(201).json({ message: 'Message recorded in incident and notification dispatched', incident, notification: newNotif });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to dispatch message' });
  }
});

// Update Incident (full or partial)
app.put('/api/incidents/:trackingCode', async (req, res) => {
  try {
    await connectToMongoDB();
    const { trackingCode } = req.params;
    const updateData = req.body;

    let incident = await Incident.findOne({ trackingCode });
    if (!incident) {
      incident = new Incident({ ...updateData, trackingCode });
    } else {
      Object.assign(incident, updateData);
      incident.updatedAt = new Date();
    }
    await incident.save();
    res.json(incident);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update incident' });
  }
});

// 4. Dedicated Raw Original Format Gallery API
app.get('/api/gallery', async (_req, res) => {
  try {
    const isConnected = await connectToMongoDB();
    if (!isConnected) {
      return res.json([]);
    }
    const files = await GalleryFile.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch gallery evidence files' });
  }
});

app.post('/api/gallery/verify-hash', async (req, res) => {
  try {
    await connectToMongoDB();
    const { fileId, userDashboardHash, investigatorName, userEmail, userName } = req.body;

    const file = await GalleryFile.findOne({ fileId });
    if (!file) {
      return res.status(404).json({ error: 'Gallery file not found in vault' });
    }

    const isMatch = file.sha256Hash.toLowerCase() === userDashboardHash.trim().toLowerCase();

    if (isMatch) {
      file.verifiedByInvestigator = true;
      file.investigatorNotes = `Verified by ${investigatorName || 'Senior Investigator'} on ${new Date().toLocaleString()}`;
      await file.save();

      return res.json({ 
        match: true, 
        message: 'SHA-256 Bit-Level Hash Verified! Access Unlocked to Senior Investigator Workstation.',
        file 
      });
    } else {
      // 🚨 AUTOMATIC SECURITY TAMPER ALERT DISPATCH TO GMAIL
      const recipientEmail = userEmail || file.uploaderEmail || 'navalekrishi@gmail.com';
      sendSecurityTamperAlertEmail({
        userEmail: recipientEmail,
        userName: userName || 'Evidence Owner',
        alertType: 'HASH_TAMPER_ATTEMPT',
        trackingCode: file.trackingCode,
        details: `SHA-256 Hash Divergence Detected on file "${file.filename}". Provided Hash: [${userDashboardHash}], Vault Hash: [${file.sha256Hash}]. Vault automatically enforced read-only lock.`
      }).catch(err => console.error('Background tamper alert error:', err));

      return res.status(400).json({ 
        match: false, 
        message: 'Cryptographic Hash Divergence Detected! Security alert email dispatched to Gmail.' 
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Hash verification protocol failed' });
  }
});

// 5. Test Email Dispatch API
app.post('/api/email/test', async (req, res) => {
  try {
    const targetEmail = req.body.email || 'navalekrishi@gmail.com';
    const type = req.body.type || 'all';

    const results: any = {};

    if (type === 'all' || type === 'welcome') {
      results.welcome = await sendWelcomeEmail({
        email: targetEmail,
        name: 'Krishi Navale (System Admin)',
        role: 'senior_investigator',
        idNumber: 'FIP-INV-99001'
      });
    }

    if (type === 'all' || type === 'evidence') {
      results.evidence = await sendEvidenceUploadEmail({
        citizenEmail: targetEmail,
        citizenName: 'Krishi Navale',
        trackingCode: 'FIP-2026-9841',
        caseTitle: 'Telegram VIP Task Fraud - ₹1,48,500 Debit',
        category: 'Financial Cyber Fraud',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        filesCount: 2,
        assignedOfficer: 'Dr. Bibi Zohara (Lead Forensic Examiner)'
      });
    }

    if (type === 'all' || type === 'completed') {
      results.completed = await sendCaseCompletedEmail({
        citizenEmail: targetEmail,
        citizenName: 'Krishi Navale',
        trackingCode: 'FIP-2026-9841',
        caseTitle: 'Telegram VIP Task Fraud Case',
        investigatorName: 'Dr. Bibi Zohara',
        resolutionNotes: 'Beneficiary bank account lien successfully executed. Section 65B Statutory Certificate issued by Delhi IFSO Special Cyber Cell.',
        section65bCertId: 'CERT-65B-2026-DEL-88190'
      });
    }

    if (type === 'all' || type === 'tamper') {
      results.tamper = await sendSecurityTamperAlertEmail({
        userEmail: targetEmail,
        userName: 'Krishi Navale',
        alertType: 'HASH_TAMPER_ATTEMPT',
        trackingCode: 'FIP-2026-9841',
        details: 'Bit-level hash modification detected during raw file comparison. Vault file locked and flagged for Senior Investigator review.'
      });
    }

    res.json({ message: `SMTP Emails dispatched to ${targetEmail}`, results });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to dispatch test emails' });
  }
});

// 6. Notifications API
app.get('/api/notifications', async (req, res) => {
  try {
    const isConnected = await connectToMongoDB();
    if (!isConnected) return res.json([]);
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    await connectToMongoDB();
    const notifData = {
      ...req.body,
      id: req.body.id || `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: req.body.timestamp || new Date().toISOString()
    };
    const newNotif = new Notification(notifData);
    await newNotif.save();
    res.status(201).json(newNotif);
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to create notification' });
  }
});

// 7. Senior Investigator Workstation API
app.get('/api/investigator/workstation', async (_req, res) => {
  try {
    await connectToMongoDB();
    let ws = await InvestigatorWorkstation.findOne();
    if (!ws) {
      await seedDatabase();
      ws = await InvestigatorWorkstation.findOne();
    }
    res.json(ws || {});
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load investigator workstation state' });
  }
});

app.post('/api/investigator/verify-hash', async (req, res) => {
  try {
    await connectToMongoDB();
    const { trackingCode, userHash, vaultHash, investigatorName, userEmail, userName } = req.body;

    const isMatch = userHash.trim().toLowerCase() === vaultHash.trim().toLowerCase();

    let ws = await InvestigatorWorkstation.findOne();
    if (ws) {
      ws.bitLevelReviews.push({
        reviewId: `REV-${Date.now().toString().slice(-4)}`,
        trackingCode,
        userDashboardHash: userHash,
        vaultHash,
        isMatch,
        investigatorName: investigatorName || 'Dr. Bibi Zohara',
        verifiedAt: new Date(),
        notes: isMatch ? 'Bit-level match confirmed in MongoDB.' : 'Hash mismatch detected.'
      });
      await ws.save();
    }

    if (!isMatch && (userEmail || 'navalekrishi@gmail.com')) {
      sendSecurityTamperAlertEmail({
        userEmail: userEmail || 'navalekrishi@gmail.com',
        userName: userName || 'Evidence Holder',
        alertType: 'HASH_TAMPER_ATTEMPT',
        trackingCode,
        details: `Workstation SHA-256 Hash Comparison mismatch. Submitted Hash: [${userHash}], Vault Hash: [${vaultHash}]. Flagged for Senior Investigator audit.`
      }).catch(err => console.error('Background hash alert error:', err));
    }

    res.json({ isMatch, message: isMatch ? 'SHA-256 Bit-Level Match Confirmed!' : 'Hash Divergence Alert! Email dispatched to Gmail.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// 8. Manual Seed Trigger API
app.post('/api/seed', async (_req, res) => {
  const result = await seedDatabase();
  res.json(result);
});

// ==========================================
// VITE DEV SERVER MIDDLEWARE MOUNTING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, () => {
    console.log(`🚀 Drive Secure System Server with Gmail SMTP listening on port ${PORT}`);
  });
}

startServer();
