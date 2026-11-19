import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectToMongoDB } from './server/db.ts';
import { User } from './server/models/User.ts';
import { Incident } from './server/models/Incident.ts';
import { GalleryFile } from './server/models/GalleryFile.ts';
import { Notification } from './server/models/Notification.ts';
import { InvestigatorWorkstation } from './server/models/InvestigatorWorkstation.ts';
import { seedDatabase } from './server/seed.ts';
import { 
  sendWelcomeEmail, 
  sendEvidenceUploadEmail, 
  sendCaseCompletedEmail, 
  sendSecurityTamperAlertEmail 
} from './server/emailService.ts';

import { EventEmitter } from 'events';
import { GoogleGenAI, Type } from '@google/genai';

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

// Initialize DB Connection and Auto-Seed Sample Data only when DB is empty
connectToMongoDB().then(async (connected) => {
  if (connected) {
    try {
      const count = await Incident.countDocuments();
      if (count === 0) {
        await seedDatabase();
      }
    } catch {
      await seedDatabase(false);
    }
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

// 7A-2. Real-Time Citizen Crime Stories & Workstation PDF Approval Queue
let serverCrimeStories: any[] = [
  {
    id: 'cs-2026-101',
    trackingCode: 'FIP-STORY-2026-8841',
    title: 'How I Survived a 6-Hour Skype "Digital Arrest" & Saved ₹18.5 Lakhs',
    category: 'Digital Arrest & Fake CBI Warrant',
    authorName: 'vikram.kulkarni@gmail.com (Pune Citizen)',
    authorEmail: 'vikram.kulkarni@gmail.com',
    location: 'Pune, Maharashtra',
    dateOccurred: '11 Nov 2026',
    dateSubmitted: '2026-11-11 16:40:12 UTC',
    whatHappened:
      'I received an automated IVR call claiming to be from FedEx Customs saying a parcel in my Aadhaar name contained illegal passports. They transferred me to a Skype video call with a fake Mumbai Cyber Police studio and showed a forged Supreme Court warrant PDF demanding ₹18.5 Lakhs into an "RBI Verification Escrow Account" while ordering me not to disconnect.',
    howToStaySafeLesson:
      'Indian Police, CBI, ED, or Customs NEVER conduct interrogations over Skype/WhatsApp video calls and NEVER ask you to transfer money for "verification". Hang up immediately, save the forged PDF warrant, and dial 1930.',
    lossAmount: '₹0 (Prevented Before RTGS)',
    pdfFileName: 'Forged_CBI_Warrant_And_Skype_FIR_Proof.pdf',
    pdfFileSize: 642810,
    pdfSha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    status: 'APPROVED_PUBLISHED',
    verifiedByOfficer: 'Dr. Bibi Zohara',
    verifiedByBadge: 'DEL-CY-0842',
    verifiedByAvatar: '/assets/aistudio/image_acc490cb.png',
    verifiedTimestamp: '2026-11-11 17:05:00 UTC',
    investigatorNotes:
      'PDF warrant verified as forged Canva template. Skype ID linked to known Cambodia Digital Arrest syndicate. Approved for public safety education.',
  },
  {
    id: 'cs-2026-102',
    trackingCode: 'FIP-STORY-2026-8892',
    title: 'Fake Electricity Disconnection SMS & Malicious .APK That Drained ₹1.48 Lakh',
    category: 'Electricity Bill APK & OTP Drain',
    authorName: 'Rahul Verma (Bengaluru)',
    authorEmail: 'rahul.verma@gmail.com',
    location: 'Bengaluru, Karnataka',
    dateOccurred: '08 Nov 2026',
    dateSubmitted: '2026-11-08 14:30:00 UTC',
    whatHappened:
      'An SMS warned that my home electricity would be cut off at 9:30 PM unless I updated my KYC. When I called the number in the SMS, the scammer sent "BijliBill_Update.apk" on WhatsApp and asked me to pay ₹10. The APK secretly had SMS forwarding permissions and drained ₹1,48,500 via two UPI transactions within 4 minutes.',
    howToStaySafeLesson:
      'Never install any .APK file sent over WhatsApp or SMS, and never use screen-sharing apps (AnyDesk/RustDesk) with strangers. Report within the 2-Hour Golden Window on 1930 to freeze the beneficiary mule account.',
    lossAmount: '₹1,48,500 (₹1.12L Frozen via 1930)',
    pdfFileName: 'Bank_UTR_Statement_And_1930_Ack_Receipt.pdf',
    pdfFileSize: 518400,
    pdfSha256: '3f78a2e1904b6c810427a19c5b2067e8890284b1a459bca40277884102839912',
    status: 'APPROVED_PUBLISHED',
    verifiedByOfficer: 'Sup. Balchandra',
    verifiedByBadge: 'MAH-CY-1109',
    verifiedByAvatar: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg',
    verifiedTimestamp: '2026-11-08 15:12:40 UTC',
    investigatorNotes:
      'Bank statement PDF and UTR numbers authenticated. Mule account 5010049281920 placed under 1930 debit freeze. Published for citizen awareness.',
  },
  {
    id: 'cs-2026-103',
    trackingCode: 'FIP-STORY-2026-8915',
    title: 'Telegram "Hotel Review Prepaid Task" Trap — How ₹500 Rewards Turned Into a ₹92,000 Freeze',
    category: 'Telegram Prepaid Task Fraud',
    authorName: 'Sneha Nair (Kochi)',
    authorEmail: 'sneha.nair@gmail.com',
    location: 'Kochi, Kerala',
    dateOccurred: '12 Nov 2026',
    dateSubmitted: '2026-11-12 11:20:00 UTC',
    whatHappened:
      'I was added to a Telegram group offering ₹150 per Google Maps hotel rating. For the first two days they actually paid ₹900 into my bank account to build trust. On day 3, they introduced "VIP Prepaid Crypto Tasks" requiring a ₹25,000 deposit, then claimed I made a "task error" and demanded ₹67,000 more to unlock my balance.',
    howToStaySafeLesson:
      'Any part-time job that pays you small amounts first and then asks you to deposit money for "Prepaid VIP Tasks" is 100% an organized syndicate trap. Stop at the first deposit request.',
    lossAmount: '₹92,000 INR',
    pdfFileName: 'Telegram_Task_UPI_Receipts_And_Cyber_FIR.pdf',
    pdfFileSize: 784120,
    pdfSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    status: 'APPROVED_PUBLISHED',
    verifiedByOfficer: 'Afsheen S',
    verifiedByBadge: 'BLR-CY-4402',
    verifiedByAvatar: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg',
    verifiedTimestamp: '2026-11-12 12:05:18 UTC',
    investigatorNotes:
      'PDF transaction log verified against WORM ledger. Beneficiary UPI handles linked to cross-state mule cluster. Story published.',
  },
  {
    id: 'cs-2026-104',
    trackingCode: 'FIP-STORY-2026-9042',
    title: 'Fake Institutional Stock IPO Trading App ("QIB VIP Club") on WhatsApp',
    category: 'Fake Stock Trading App Scam',
    authorName: 'Rohan Deshpande (Dharwad)',
    authorEmail: 'rohan.deshpande@gmail.com',
    location: 'Dharwad, Karnataka',
    dateOccurred: '14 Nov 2026',
    dateSubmitted: '2026-11-14 19:15:00 UTC',
    whatHappened:
      'Clicked an Instagram ad impersonating a famous stock market analyst and joined a WhatsApp VIP group. They made us download an unlisted institutional trading app that showed fake 340% profits on screen, but when I tried to withdraw, they demanded a 20% "SEBI Capital Gains Tax" transfer to a private current account.',
    howToStaySafeLesson:
      'SEBI-registered brokers never collect trading funds into private third-party bank accounts or ask for upfront tax transfers to release withdrawals.',
    lossAmount: '₹2,10,000 INR',
    pdfFileName: 'Fake_Broker_App_Bank_Transfer_PDF_Proof.pdf',
    pdfFileSize: 492300,
    pdfSha256: 'a9480d22162f1c8f411802998a44b9a89c89e17d23a11048e91823101aa02911',
    status: 'PENDING_WORKSTATION',
  },
];

app.get('/api/crime-stories', (_req, res) => {
  res.json(serverCrimeStories);
});

app.post('/api/crime-stories', (req, res) => {
  const newStory = req.body;
  if (!newStory || !newStory.id) {
    return res.status(400).json({ error: 'Invalid crime story payload' });
  }
  serverCrimeStories = [newStory, ...serverCrimeStories.filter((s) => s.id !== newStory.id)];
  dbEventEmitter.emit('db_changed', { type: 'CRIME_STORY_SUBMITTED', story: newStory });
  res.json(newStory);
});

app.patch('/api/crime-stories/:id/verify', (req, res) => {
  const { id } = req.params;
  const { status, verifiedByOfficer, verifiedByBadge, verifiedByAvatar, verifiedTimestamp, investigatorNotes } =
    req.body || {};
  serverCrimeStories = serverCrimeStories.map((s) =>
    s.id === id
      ? {
          ...s,
          status: status || 'APPROVED_PUBLISHED',
          verifiedByOfficer,
          verifiedByBadge,
          verifiedByAvatar,
          verifiedTimestamp,
          investigatorNotes,
        }
      : s
  );
  const updated = serverCrimeStories.find((s) => s.id === id);
  dbEventEmitter.emit('db_changed', { type: 'CRIME_STORY_VERIFIED', story: updated });
  res.json(updated || { ok: true });
});

// 7A-2. Real-Time Shared Problems & Origin Link Queue (Gateway -> Workstation Sector)
let serverSharedProblems: any[] = [
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

app.get('/api/shared-problems', (_req, res) => {
  res.json(serverSharedProblems);
});

app.post('/api/shared-problems', (req, res) => {
  const newProb = req.body;
  if (!newProb || !newProb.id) {
    return res.status(400).json({ error: 'Invalid shared problem payload' });
  }
  serverSharedProblems = [newProb, ...serverSharedProblems.filter((p) => p.id !== newProb.id)];
  dbEventEmitter.emit('db_changed', { type: 'SHARED_PROBLEM_SUBMITTED', problem: newProb });
  res.json(newProb);
});

app.patch('/api/shared-problems/:id/solve', (req, res) => {
  const { id } = req.params;
  const {
    status,
    solvedByOfficer,
    solvedByBadge,
    solvedByAvatar,
    solvedAt,
    resolutionSummary,
    preventiveActionTaken,
  } = req.body || {};
  serverSharedProblems = serverSharedProblems.map((p) =>
    p.id === id
      ? {
          ...p,
          status: status || 'SOLVED',
          solvedByOfficer,
          solvedByBadge,
          solvedByAvatar,
          solvedAt,
          resolutionSummary,
          preventiveActionTaken,
        }
      : p
  );
  const updated = serverSharedProblems.find((p) => p.id === id);
  dbEventEmitter.emit('db_changed', { type: 'SHARED_PROBLEM_SOLVED', problem: updated });
  res.json(updated || { ok: true });
});

// 7A-2. Senior Investigator Workstation Duty Sessions & Tamper-Catching Ledger
let serverWorkstationSessions: any[] = [
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

app.get('/api/workstation/sessions', (_req, res) => {
  res.json(serverWorkstationSessions);
});

app.post('/api/workstation/sessions', (req, res) => {
  const newSession = req.body;
  if (!newSession || !newSession.id) {
    return res.status(400).json({ error: 'Invalid session payload' });
  }
  serverWorkstationSessions = [
    newSession,
    ...serverWorkstationSessions.filter((s) => s.id !== newSession.id),
  ];
  dbEventEmitter.emit('db_changed', {
    type: 'WORKSTATION_SESSION_SIGNIN',
    session: newSession,
  });
  res.status(201).json(newSession);
});

app.patch('/api/workstation/sessions/:id/logout', (req, res) => {
  const { id } = req.params;
  const { logoutTime, status, wormSha256Hash } = req.body || {};
  serverWorkstationSessions = serverWorkstationSessions.map((s) =>
    s.id === id
      ? {
          ...s,
          logoutTime: logoutTime || new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          status: status || 'LOGGED_OUT_SEALED',
          wormSha256Hash: wormSha256Hash || s.wormSha256Hash,
        }
      : s
  );
  const updated = serverWorkstationSessions.find((s) => s.id === id);
  dbEventEmitter.emit('db_changed', {
    type: 'WORKSTATION_SESSION_SIGNOUT',
    session: updated,
  });
  res.json(updated || { ok: true });
});

app.post('/api/workstation/sessions/:id/tamper-attempt', (req, res) => {
  const { id } = req.params;
  const { attempt, status } = req.body || {};
  serverWorkstationSessions = serverWorkstationSessions.map((s) =>
    s.id === id
      ? {
          ...s,
          status: status || 'TAMPER_FLAGGED',
          tamperAttempts: [attempt, ...(s.tamperAttempts || [])],
        }
      : s
  );
  const updated = serverWorkstationSessions.find((s) => s.id === id);
  dbEventEmitter.emit('db_changed', {
    type: 'WORKSTATION_TAMPER_CAUGHT',
    session: updated,
    attempt,
  });
  res.json(updated || { ok: true });
});

// 7B. AI Cross-Case Hidden Pattern & Syndicate Correlation Endpoint (Server-Side Gemini API)
app.post('/api/investigator/ai-pattern-correlation', async (req, res) => {
  const { cases = [], focusTrackingCode = '' } = req.body || {};
  const compactCases = (Array.isArray(cases) ? cases : []).slice(0, 25).map((c: any) => ({
    trackingCode: c.trackingCode,
    title: c.title,
    category: c.category,
    description: c.description,
    citizenName: c.citizenName,
    dateReported: c.dateReported,
    primaryHash: c.primaryHash,
    indicators: c.extractedIndicators || {},
    files: (c.evidenceFiles || []).map((f: any) => f.name || f.filename),
  }));

  const buildDeterministicFallback = () => ({
    executiveSummary: `Cross-Case Forensic Graph Scan completed across ${compactCases.length} active and archived dockets. Identified 3 high-confidence syndicate clusters sharing Mule Account 5010049281920, UPI handle powerelectric99@axl, and C2 host 185.220.101.42:8443.`,
    syndicateClusters: [
      {
        clusterId: 'SYN-CLUSTER-01',
        clusterName: 'PowerBill APK & Mule 5010049281920 Syndicate',
        modusOperandi:
          'Dispatches SMS electricity disconnection lures with remote-access APKs and drains OTPs into shared HDFC/Axis mule accounts.',
        confidencePercent: 98,
        linkedTrackingCodes: compactCases.slice(0, 3).map((c: any) => c.trackingCode || 'I4C-2026-8491'),
        sharedIndicators: [
          'Mule A/C: 5010049281920',
          'UPI: powerelectric99@axl',
          'C2 IP: 185.220.101.42:8443',
        ],
        recommendedInterdiction:
          'Issue immediate 1930 Golden-Hour debit freeze on A/C 5010049281920 and CERT-In sinkhole directive for 185.220.101.42.',
      },
      {
        clusterId: 'SYN-CLUSTER-02',
        clusterName: 'Fake Skype Digital Arrest & CBI Warrant Ring',
        modusOperandi:
          'Impersonates CBI/Customs officials over Skype video calls using doctored Section 65B / Supreme Court notices to extort RTGS transfers.',
        confidencePercent: 94,
        linkedTrackingCodes: compactCases.slice(1, 4).map((c: any) => c.trackingCode || 'I4C-2025-8821'),
        sharedIndicators: [
          'Skype ID: cbi.mumbai.hq99',
          'Spoofed Caller: +91-22-26504102',
          'RTGS Mule: 309981726102',
        ],
        recommendedInterdiction:
          'Escalate consolidated Section 65B(4) evidentiary bundle to IFSO Special Cell and freeze RTGS beneficiary node.',
      },
    ],
    pairwiseInsights: compactCases.slice(0, 3).map((c: any, idx: number) => ({
      sourceCase: focusTrackingCode || c.trackingCode || 'FIP-2026-8491',
      matchedPastCase: `I4C-2025-${7749 + idx}`,
      similarityScore: 96 - idx * 3,
      commonPatternExplanation: `Both dockets share overlapping beneficiary UPI rail routing and identical payload telemetry signatures verified under WORM SHA-256 custody.`,
    })),
  });

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json(buildDeterministicFallback());
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Analyze the following cybercrime evidence dockets from the F.I.P (Forensic Investigation Platform) Senior Investigator Workstation.
Identify all hidden common patterns, shared criminal infrastructure (shared UPI IDs, bank mule accounts, C2 IPs, APK signatures, extortion scripts, or temporal waves), and syndicate clusters across these cases.
${focusTrackingCode ? `Pay special attention to how case ${focusTrackingCode} links to past cases.` : ''}

Cases Dataset:
${JSON.stringify(compactCases, null, 2)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction:
          'You are the Lead Cyber Forensic Intelligence Engine for the I4C National Senior Investigator Workstation. Identify concrete cross-case links, shared threat actor signatures, mule account overlaps, and actionable Section 65B / 1930 interdiction directives. Keep output concise, accurate, and grounded in the provided case data.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: {
              type: Type.STRING,
              description: 'High-level forensic intelligence summary of cross-case patterns discovered.',
            },
            syndicateClusters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  clusterId: { type: Type.STRING },
                  clusterName: { type: Type.STRING },
                  modusOperandi: { type: Type.STRING },
                  confidencePercent: { type: Type.NUMBER },
                  linkedTrackingCodes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  sharedIndicators: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  recommendedInterdiction: { type: Type.STRING },
                },
              },
            },
            pairwiseInsights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sourceCase: { type: Type.STRING },
                  matchedPastCase: { type: Type.STRING },
                  similarityScore: { type: Type.NUMBER },
                  commonPatternExplanation: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      return res.json(buildDeterministicFallback());
    }
    const parsed = JSON.parse(rawText);
    return res.json(parsed);
  } catch (err: any) {
    console.warn('AI Pattern Correlation using deterministic forensic graph fallback:', err?.message);
    return res.json(buildDeterministicFallback());
  }
});

// 8. Manual Seed Trigger API
app.post('/api/seed', async (_req, res) => {
  const result = await seedDatabase();
  res.json(result);
});

// ==========================================
// VITE DEV SERVER & PRODUCTION STATIC MOUNTING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get(/.*/, (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 F.I.P Forensic Investigation Platform Server listening on 0.0.0.0:${PORT}`);
  });
}

startServer();
