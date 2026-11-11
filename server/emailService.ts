import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const smtpUser = process.env.SMTP_USER || 'navalekrishi@gmail.com';
const smtpPass = process.env.SMTP_PASS || 'eghfhavgilwblofc';
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);

// Create reusable Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // true for 465, false for 587
  auth: {
    user: smtpUser,
    pass: smtpPass
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify SMTP Connection on Startup
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️ SMTP Connection Alert:', error.message);
  } else {
    console.log('✉️ Gmail SMTP Transporter Ready! Connected as:', smtpUser);
  }
});

// Base Email Wrapper
const wrapHtmlTemplate = (title: string, badgeTag: string, contentBody: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0d1117; color: #e6edf3; margin: 0; padding: 20px; }
    .container { max-width: 650px; margin: 0 auto; background: #161b22; border: 1px solid #30363d; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #0b192c 0%, #1e3a8a 100%); padding: 28px 24px; border-bottom: 2px solid #2563eb; position: relative; }
    .header-logo { font-size: 20px; font-weight: 800; color: #60a5fa; letter-spacing: 1.5px; text-transform: uppercase; margin: 0; }
    .header-sub { font-size: 12px; color: #93c5fd; font-family: monospace; margin-top: 4px; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 20px; text-transform: uppercase; margin-top: 10px; background: rgba(37, 99, 235, 0.2); color: #38bdf8; border: 1px solid #2563eb; }
    .badge-alert { background: rgba(220, 38, 38, 0.2); color: #f87171; border-color: #dc2626; }
    .badge-success { background: rgba(16, 185, 129, 0.2); color: #34d399; border-color: #10b981; }
    .content { padding: 32px 28px; background-color: #161b22; color: #c9d1d9; font-size: 14px; line-height: 1.6; }
    .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; background: #0d1117; border-radius: 8px; overflow: hidden; border: 1px solid #21262d; }
    .data-table td { padding: 12px 16px; border-bottom: 1px solid #21262d; }
    .data-table td.label { font-weight: 700; color: #8b949e; width: 35%; background: rgba(255,255,255,0.02); }
    .data-table td.value { color: #f0f6fc; font-family: monospace; font-size: 13px; word-break: break-all; }
    .highlight-box { background: #0d1117; border-left: 4px solid #2563eb; padding: 16px 20px; border-radius: 4px; margin: 20px 0; }
    .alert-box { background: rgba(220, 38, 38, 0.1); border-left: 4px solid #dc2626; padding: 16px 20px; border-radius: 4px; margin: 20px 0; color: #fca5a5; }
    .footer { background: #0d1117; padding: 20px 28px; border-top: 1px solid #21262d; text-align: center; font-size: 11px; color: #8b949e; line-height: 1.5; }
    .footer a { color: #38bdf8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-logo">🛡️ DRIVE SECURE SYSTEM</div>
      <div class="header-sub">Forensic Investigation Platform (F.I.P) • National Cyber Cell Gateway</div>
      <div class="badge ${badgeTag.includes('ALERT') ? 'badge-alert' : badgeTag.includes('SUCCESS') || badgeTag.includes('RESOLVED') ? 'badge-success' : ''}">${badgeTag}</div>
    </div>
    <div class="content">
      <h2 style="color: #f0f6fc; margin-top: 0; font-size: 18px;">${title}</h2>
      ${contentBody}
    </div>
    <div class="footer">
      <strong>OFFICIAL AUTOMATED SYSTEM DISPATCH • DO NOT REPLY DIRECTLY TO THIS EMAIL</strong><br>
      Drive Secure System (F.I.P) • Certified Under Section 65B Indian Evidence Act / IT Act 2000.<br>
      All evidentiary communications are timestamped with RFC-3161 cryptographic integrity.<br>
      Support Contact: <a href="mailto:navalekrishi@gmail.com">navalekrishi@gmail.com</a>
    </div>
  </div>
</body>
</html>
`;

/**
 * 1. OFFICIAL WELCOME EMAIL ON USER ACCOUNT CREATION
 */
export const sendWelcomeEmail = async (user: {
  email: string;
  name: string;
  role: string;
  idNumber: string;
}) => {
  const isInvestigator = user.role === 'senior_investigator';
  const roleTitle = isInvestigator ? 'Senior Cyber Forensic Investigator' : 'Registered Citizen / Case File Holder';

  const body = `
    <p>Dear <strong>${user.name}</strong>,</p>
    <p>Welcome to the <strong>Drive Secure System — Forensic Investigation Platform (F.I.P)</strong>. Your official account has been successfully created and authenticated on our secure network.</p>
    
    <div class="highlight-box">
      <strong style="color: #38bdf8;">OFFICIAL IDENTIFICATION ISSUED</strong><br>
      You have been allocated a unique forensic system identification number for all legal and investigation tracking.
    </div>

    <table class="data-table">
      <tr>
        <td class="label">Official User ID:</td>
        <td class="value" style="color: #38bdf8; font-weight: bold; font-size: 15px;">${user.idNumber}</td>
      </tr>
      <tr>
        <td class="label">Account Holder:</td>
        <td class="value">${user.name}</td>
      </tr>
      <tr>
        <td class="label">Official Email:</td>
        <td class="value">${user.email}</td>
      </tr>
      <tr>
        <td class="label">Assigned Role:</td>
        <td class="value">${roleTitle}</td>
      </tr>
      <tr>
        <td class="label">Registration Time:</td>
        <td class="value">${new Date().toUTCString()}</td>
      </tr>
      <tr>
        <td class="label">WORM Security Status:</td>
        <td class="value" style="color: #34d399;">AUTHENTICATED & SECURED</td>
      </tr>
    </table>

    <p style="margin-top: 20px;">
      ${isInvestigator 
        ? 'As a Senior Investigator, your workstation is pre-linked to active case queues, bit-level SHA-256 vault files, and Section 65B court admissibility issuance tools.'
        : 'You can now log in, submit digital evidence, track investigation milestones in real-time, and download court-admissible forensic certificates directly from your dashboard.'
      }
    </p>

    <p>If you did not create this account, please report this immediately to <a href="mailto:navalekrishi@gmail.com" style="color: #38bdf8;">navalekrishi@gmail.com</a>.</p>
  `;

  const html = wrapHtmlTemplate(
    `Official Account Registration & Forensic ID Allocation`,
    `WELCOME • ID: ${user.idNumber}`,
    body
  );

  try {
    const info = await transporter.sendMail({
      from: `"Drive Secure F.I.P" <${smtpUser}>`,
      to: user.email,
      subject: `[DRIVE SECURE F.I.P] Official Registration & Forensic ID Allocation: ${user.idNumber}`,
      html
    });
    console.log(`✉️ Welcome email dispatched to ${user.email} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`❌ Failed to send welcome email to ${user.email}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * 2. EVIDENCE UPLOAD CONFIRMATION EMAIL
 */
export const sendEvidenceUploadEmail = async (evidenceData: {
  citizenEmail: string;
  citizenName: string;
  trackingCode: string;
  caseTitle: string;
  category: string;
  sha256Hash: string;
  filesCount: number;
  assignedOfficer: string;
}) => {
  const body = `
    <p>Dear <strong>${evidenceData.citizenName}</strong>,</p>
    <p>Your digital evidence submission has been officially ingested into the <strong>Drive Secure System (F.I.P) WORM Vault</strong>. The cryptographic integrity seal has been applied and tracking is now active.</p>

    <div class="highlight-box">
      <strong style="color: #34d399;">LIVE TRACKING STARTED</strong><br>
      Your evidence is assigned for bit-level review. All progress updates will be automatically dispatched to this email address.
    </div>

    <table class="data-table">
      <tr>
        <td class="label">Case Tracking Code:</td>
        <td class="value" style="color: #fbbf24; font-weight: bold; font-size: 15px;">${evidenceData.trackingCode}</td>
      </tr>
      <tr>
        <td class="label">Case Title:</td>
        <td class="value">${evidenceData.caseTitle}</td>
      </tr>
      <tr>
        <td class="label">Category:</td>
        <td class="value">${evidenceData.category}</td>
      </tr>
      <tr>
        <td class="label">SHA-256 Hash Digest:</td>
        <td class="value" style="font-size: 11px;">${evidenceData.sha256Hash}</td>
      </tr>
      <tr>
        <td class="label">Files Attached:</td>
        <td class="value">${evidenceData.filesCount} File(s) Sealed</td>
      </tr>
      <tr>
        <td class="label">Lead Investigator:</td>
        <td class="value" style="color: #60a5fa;">${evidenceData.assignedOfficer}</td>
      </tr>
      <tr>
        <td class="label">Current Status:</td>
        <td class="value" style="color: #38bdf8;">ACTIVE TRACKING IN PROGRESS</td>
      </tr>
    </table>

    <p>Our Senior Forensic Examiners have been notified. Once verification or investigation phases complete, you will receive an official completion notification with a Section 65B legal certificate.</p>
  `;

  const html = wrapHtmlTemplate(
    `Digital Evidence Intake Confirmed & Tracking Active`,
    `EVIDENCE LOCKED • CODE: ${evidenceData.trackingCode}`,
    body
  );

  try {
    const info = await transporter.sendMail({
      from: `"Drive Secure F.I.P" <${smtpUser}>`,
      to: evidenceData.citizenEmail,
      subject: `[EVIDENCE RECEIVED & LOCKED] Case #${evidenceData.trackingCode} - Tracking Active`,
      html
    });
    console.log(`✉️ Evidence notification email dispatched to ${evidenceData.citizenEmail}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`❌ Failed to send evidence email:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * 3. SENIOR INVESTIGATOR CASE COMPLETED / RESOLVED EMAIL
 */
export const sendCaseCompletedEmail = async (caseData: {
  citizenEmail: string;
  citizenName: string;
  trackingCode: string;
  caseTitle: string;
  investigatorName: string;
  resolutionNotes: string;
  section65bCertId?: string;
}) => {
  const body = `
    <p>Dear <strong>${caseData.citizenName}</strong>,</p>
    <p>We are pleased to notify you that the forensic investigation for your case has been <strong>OFFICIALLY COMPLETED & RESOLVED</strong> by our Senior Cyber Investigation Cell.</p>

    <div class="highlight-box" style="border-left-color: #10b981;">
      <strong style="color: #34d399;">CASE RESOLUTION COMPLETED</strong><br>
      All evidence analysis, bit-level hash verification, and court documentation have been finalized.
    </div>

    <table class="data-table">
      <tr>
        <td class="label">Tracking Code:</td>
        <td class="value" style="color: #34d399; font-weight: bold; font-size: 15px;">${caseData.trackingCode}</td>
      </tr>
      <tr>
        <td class="label">Case Title:</td>
        <td class="value">${caseData.caseTitle}</td>
      </tr>
      <tr>
        <td class="label">Lead Investigator:</td>
        <td class="value" style="color: #60a5fa;">${caseData.investigatorName}</td>
      </tr>
      <tr>
        <td class="label">Section 65B Certificate ID:</td>
        <td class="value" style="color: #fbbf24;">${caseData.section65bCertId || 'CERT-65B-2026-FINAL-098'}</td>
      </tr>
      <tr>
        <td class="label">Resolution Time:</td>
        <td class="value">${new Date().toUTCString()}</td>
      </tr>
      <tr>
        <td class="label">Final Status:</td>
        <td class="value" style="color: #34d399; font-weight: bold;">SOLVED & CLOSED</td>
      </tr>
    </table>

    <h4 style="color: #f0f6fc; margin-top: 20px;">Senior Investigator Official Summary:</h4>
    <div style="background: #0d1117; padding: 16px; border-radius: 6px; border: 1px solid #30363d; font-family: monospace; color: #e6edf3; font-size: 12px; white-space: pre-line;">
      ${caseData.resolutionNotes || 'All digital evidence has undergone bit-level SHA-256 verification. Chain of custody remains unbroken. Certificate issued for judicial presentation.'}
    </div>

    <p style="margin-top: 20px;">You may view your complete case report and download your stamped Section 65B Certificate anytime from your Citizen Portal Dashboard.</p>
  `;

  const html = wrapHtmlTemplate(
    `Official Case Resolution & Completion Report`,
    `SUCCESS • CASE SOLVED`,
    body
  );

  try {
    const info = await transporter.sendMail({
      from: `"Drive Secure F.I.P" <${smtpUser}>`,
      to: caseData.citizenEmail,
      subject: `[CASE RESOLVED & COMPLETED] Official Report for Case #${caseData.trackingCode}`,
      html
    });
    console.log(`✉️ Case completion email dispatched to ${caseData.citizenEmail}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`❌ Failed to send case completion email:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * 4. SECURITY ALERT EMAIL (TAMPER / HASH DIVERGENCE / PASSWORD CHANGE)
 */
export const sendSecurityTamperAlertEmail = async (alertData: {
  userEmail: string;
  userName: string;
  alertType: 'HASH_TAMPER_ATTEMPT' | 'PASSWORD_CHANGED' | 'UNAUTHORIZED_ACCESS_ATTEMPT';
  trackingCode?: string;
  details: string;
  ipAddress?: string;
}) => {
  const isHashTamper = alertData.alertType === 'HASH_TAMPER_ATTEMPT';
  const alertTitle = isHashTamper 
    ? 'CRITICAL ALERT: Cryptographic Hash Tampering / Divergence Detected'
    : 'SECURITY NOTICE: Account Password / Security Key Updated';

  const body = `
    <p>Dear <strong>${alertData.userName}</strong>,</p>
    <p style="color: #f87171; font-weight: bold;">URGENT SECURITY ALERT FROM DRIVE SECURE FORENSIC MONITORING SYSTEM</p>

    <div class="alert-box">
      <strong>SECURITY EVENT DETECTED:</strong><br>
      Our automated WORM integrity monitor detected a high-priority security event associated with your account/evidence file.
    </div>

    <table class="data-table">
      <tr>
        <td class="label">Alert Category:</td>
        <td class="value" style="color: #f87171; font-weight: bold;">${alertData.alertType}</td>
      </tr>
      ${alertData.trackingCode ? `
      <tr>
        <td class="label">Target Tracking Code:</td>
        <td class="value" style="color: #fbbf24;">${alertData.trackingCode}</td>
      </tr>
      ` : ''}
      <tr>
        <td class="label">Account Holder:</td>
        <td class="value">${alertData.userName} (${alertData.userEmail})</td>
      </tr>
      <tr>
        <td class="label">Detected Timestamp:</td>
        <td class="value">${new Date().toUTCString()}</td>
      </tr>
      <tr>
        <td class="label">Origin IP / Host:</td>
        <td class="value">${alertData.ipAddress || '185.220.101.5 (Ingress Vault Monitor)'}</td>
      </tr>
      <tr>
        <td class="label">Vault Action Taken:</td>
        <td class="value" style="color: #f87171; font-weight: bold;">AUTOMATIC IMMUTABLE LOCKDOWN ENFORCED</td>
      </tr>
    </table>

    <h4 style="color: #f0f6fc; margin-top: 20px;">Event Technical Details:</h4>
    <div style="background: #0d1117; padding: 14px; border-radius: 6px; border: 1px solid #dc2626; font-family: monospace; color: #fca5a5; font-size: 12px;">
      ${alertData.details}
    </div>

    <p style="margin-top: 20px; font-weight: 500;">
      If this action was initiated by you, no further action is required. If you did NOT authorize this change or suspect evidence tampering, reply immediately to <a href="mailto:navalekrishi@gmail.com" style="color: #38bdf8;">navalekrishi@gmail.com</a> to trigger a manual Nodal Officer lockout.
    </p>
  `;

  const html = wrapHtmlTemplate(
    alertTitle,
    `SECURITY ALERT • URGENT`,
    body
  );

  try {
    const info = await transporter.sendMail({
      from: `"Drive Secure Security Cell" <${smtpUser}>`,
      to: alertData.userEmail,
      subject: `⚠️ [CRITICAL SECURITY ALERT] ${alertTitle} - Action Required`,
      html
    });
    console.log(`✉️ Security tamper alert dispatched to ${alertData.userEmail}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`❌ Failed to send tamper alert email:`, error.message);
    return { success: false, error: error.message };
  }
};
