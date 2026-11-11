import { User } from './models/User';
import { Incident } from './models/Incident';
import { GalleryFile } from './models/GalleryFile';
import { Notification } from './models/Notification';
import { InvestigatorWorkstation } from './models/InvestigatorWorkstation';
import { connectToMongoDB } from './db';

export const seedDatabase = async (force: boolean = true) => {
  const isConnected = await connectToMongoDB();
  if (!isConnected) {
    console.warn('⚠️ Seed aborted: No MongoDB connection established.');
    return { success: false, message: 'Database disconnected' };
  }

  try {
    console.log('🌱 Populating MongoDB database with rich, professional forensic dataset...');

    if (force) {
      // Clear existing records to replace with pristine professional dataset
      await User.deleteMany({});
      await Incident.deleteMany({});
      await GalleryFile.deleteMany({});
      await Notification.deleteMany({});
      await InvestigatorWorkstation.deleteMany({});
    }

    // 1. Seed Users (Senior Investigators + Citizens)
    await User.insertMany([
      {
        email: 'bibi.zohara@cybercell.gov.in',
        name: 'Dr. Bibi Zohara',
        role: 'senior_investigator',
        badgeNumber: 'DEL-CY-0842',
        agency: 'Delhi IFSO Special Cyber Cell',
        phone: '+91-98110-84201',
        passwordHash: 'investigator_pass_123'
      },
      {
        email: 'rajesh.kumar@cybercell.gov.in',
        name: 'Inspector Rajesh Kumar',
        role: 'senior_investigator',
        badgeNumber: 'MAH-CY-9021',
        agency: 'Maha Cyber Digital Forensic Cell',
        phone: '+91-98220-90210',
        passwordHash: 'investigator_pass_123'
      },
      {
        email: 'balchandra.k@cybercell.gov.in',
        name: 'Balchandra K',
        role: 'senior_investigator',
        badgeNumber: 'KA-CY-4102',
        agency: 'Karnataka Cyber Crime Division',
        phone: '+91-98440-41020',
        passwordHash: 'investigator_pass_123'
      },
      {
        email: 'afsheen.s@cybercell.gov.in',
        name: 'Afsheen S',
        role: 'senior_investigator',
        badgeNumber: 'CERT-CY-1108',
        agency: 'CERT-In National Incident Response',
        phone: '+91-98770-11080',
        passwordHash: 'investigator_pass_123'
      },
      {
        email: 'krishi.n@cybercell.gov.in',
        name: 'Krishi N',
        role: 'senior_investigator',
        badgeNumber: 'HQ-CY-7001',
        agency: 'National Cyber Coordination Centre (N4C)',
        phone: '+91-98990-70010',
        passwordHash: 'investigator_pass_123'
      },
      {
        email: 'ramesh.verma@gmail.com',
        name: 'Ramesh Verma',
        role: 'citizen',
        phone: '+91-98101-23456',
        passwordHash: 'citizen_pass_123'
      },
      {
        email: 'priyanka.s@yahoo.com',
        name: 'Priyanka Sharma',
        role: 'citizen',
        phone: '+91-98765-43210',
        passwordHash: 'citizen_pass_123'
      },
      {
        email: 'anil.deshmukh@outlook.com',
        name: 'Anil Deshmukh',
        role: 'citizen',
        phone: '+91-98200-11223',
        passwordHash: 'citizen_pass_123'
      },
      {
        email: 'sita.patel@gmail.com',
        name: 'Sita Patel',
        role: 'citizen',
        phone: '+91-98991-88776',
        passwordHash: 'citizen_pass_123'
      },
      {
        email: 'vikram.singh@rediffmail.com',
        name: 'Vikram Singh',
        role: 'citizen',
        phone: '+91-98112-33445',
        passwordHash: 'citizen_pass_123'
      }
    ]);

    // 2. Seed Senior Investigator Workstation Structure
    await InvestigatorWorkstation.create({
      workstationId: 'WS-NATIONAL-CYBER-HQ',
      investigatorName: 'Dr. Bibi Zohara',
      badgeNumber: 'DEL-CY-0842',
      activeAlertsCount: 6,
      custodyAlerts: [
        {
          alertId: 'ALT-9401',
          trackingCode: 'FIP-2026-9841',
          caseTitle: 'Telegram VIP Rating Escrow Fraud - ₹1,48,500 Debit',
          category: 'Financial Mule Escrow',
          riskLevel: 'CRITICAL',
          userDashboardHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          uploadedAt: new Date(Date.now() - 3600000),
          status: 'PENDING_REVIEW'
        },
        {
          alertId: 'ALT-9402',
          trackingCode: 'FIP-2026-9842',
          caseTitle: 'Bijli Bill Electricity Trojan APK Infiltration',
          category: 'Malicious Android Trojan',
          riskLevel: 'HIGH',
          userDashboardHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
          uploadedAt: new Date(Date.now() - 7200000),
          status: 'INVESTIGATING'
        },
        {
          alertId: 'ALT-9403',
          trackingCode: 'FIP-2026-9843',
          caseTitle: 'Digital Arrest Skype CBI Impersonation Video Extortion',
          category: 'Coercive Video Extortion',
          riskLevel: 'CRITICAL',
          userDashboardHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
          uploadedAt: new Date(Date.now() - 10800000),
          status: 'VERIFIED_CHAIN'
        },
        {
          alertId: 'ALT-9404',
          trackingCode: 'FIP-2026-9844',
          caseTitle: 'FedEx Customs Illegal Narcotics Interception Scam - ₹3,20,000',
          category: 'Customs Impersonation',
          riskLevel: 'HIGH',
          userDashboardHash: 'd41d8cd98f00b204e9800998ecf8427e0281b37d45124b898a123bc6547a9821',
          uploadedAt: new Date(Date.now() - 14400000),
          status: 'PENDING_REVIEW'
        },
        {
          alertId: 'ALT-9405',
          trackingCode: 'FIP-2026-9845',
          caseTitle: 'Deepfake AI Voice Clone Kidnapping Extortion Call - ₹5,00,000',
          category: 'AI Voice Cloning',
          riskLevel: 'CRITICAL',
          userDashboardHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
          uploadedAt: new Date(Date.now() - 18000000),
          status: 'INVESTIGATING'
        },
        {
          alertId: 'ALT-9406',
          trackingCode: 'FIP-2026-9846',
          caseTitle: 'Fake Crypto Trading Platform Rug Pull - USDT 12,400',
          category: 'Cryptocurrency Rug Pull',
          riskLevel: 'MEDIUM',
          userDashboardHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
          uploadedAt: new Date(Date.now() - 21600000),
          status: 'VERIFIED_CHAIN'
        }
      ],
      favoriteInvestigators: [
        {
          name: 'Dr. Bibi Zohara',
          badge: 'DEL-CY-0842',
          agency: 'Delhi IFSO Special Cyber Cell',
          totalCasesHandled: 142,
          activeStatus: true
        },
        {
          name: 'Inspector Rajesh Kumar',
          badge: 'MAH-CY-9021',
          agency: 'Maha Cyber Digital Forensic Cell',
          totalCasesHandled: 98,
          activeStatus: true
        },
        {
          name: 'Balchandra K',
          badge: 'KA-CY-4102',
          agency: 'Karnataka Cyber Crime Division',
          totalCasesHandled: 115,
          activeStatus: true
        },
        {
          name: 'Afsheen S',
          badge: 'CERT-CY-1108',
          agency: 'CERT-In National Incident Response',
          totalCasesHandled: 87,
          activeStatus: true
        },
        {
          name: 'Krishi N',
          badge: 'HQ-CY-7001',
          agency: 'National Cyber Coordination Centre (N4C)',
          totalCasesHandled: 164,
          activeStatus: true
        }
      ],
      bitLevelReviews: [
        {
          reviewId: 'REV-801',
          trackingCode: 'FIP-2026-9841',
          userDashboardHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          vaultHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          isMatch: true,
          investigatorName: 'Dr. Bibi Zohara',
          notes: 'Exact byte-for-byte SHA-256 match confirmed between Citizen Dashboard and Raw Vault Storage.'
        },
        {
          reviewId: 'REV-802',
          trackingCode: 'FIP-2026-9843',
          userDashboardHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
          vaultHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
          isMatch: true,
          investigatorName: 'Inspector Rajesh Kumar',
          notes: 'Video metadata integrity verified. Zero frames dropped or altered.'
        }
      ],
      section65bCertificates: [
        {
          certificateId: 'CERT-65B-2026-0041',
          trackingCode: 'FIP-2026-9841',
          magistrateCourt: 'Chief Metropolitan Magistrate Court, Patiala House, New Delhi',
          judgeName: 'Hon. Magistrate S. K. Sharma',
          digitalSignatureSeal: 'SEAL_DELHI_IFSO_SEC65B_9841028371',
          issuedAt: new Date(Date.now() - 3600000)
        },
        {
          certificateId: 'CERT-65B-2026-0043',
          trackingCode: 'FIP-2026-9843',
          magistrateCourt: 'High Court of Bombay - Cyber Appellate Bench',
          judgeName: 'Hon. Justice R. V. Deshmukh',
          digitalSignatureSeal: 'SEAL_MAHA_CYBER_SEC65B_984309112',
          issuedAt: new Date(Date.now() - 7200000)
        }
      ]
    });

    // 3. Seed Incidents
    await Incident.insertMany([
      {
        trackingCode: 'FIP-2026-9841',
        category: 'Telegram VIP Task Fraud',
        title: 'Telegram VIP Escrow Task Fraud - ₹1,48,500 Debited',
        description: 'Victim coaxed into VIP YouTube rating group. Transfer of ₹1,48,500 made to mule UPI powerelectric99@axl across 3 transactions.',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        wormTimestamp: '2026-10-08T14:22:10.000Z',
        status: 'VERIFIED_CHAIN',
        seniorInvestigator: 'Dr. Bibi Zohara',
        citizenEmail: 'ramesh.verma@gmail.com',
        citizenName: 'Ramesh Verma',
        evidenceFiles: [
          {
            id: 'file-101',
            filename: 'telegram_chat_history.pdf',
            fileType: 'document',
            sizeBytes: 1104820,
            originalFormat: '.PDF',
            sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
          },
          {
            id: 'file-102',
            filename: 'bank_debit_slip_utr.png',
            fileType: 'photo',
            sizeBytes: 842100,
            originalFormat: '.PNG',
            sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
          }
        ],
        custodyLogs: [
          {
            id: 'c-1',
            timestamp: '2026-10-08T14:25:00.000Z',
            action: 'CITIZEN_INGESTION_LOCK',
            officerName: 'WORM Vault System',
            hashVerified: true,
            notes: 'SHA-256 Digest calculated and RFC-3161 timestamp applied.'
          },
          {
            id: 'c-2',
            timestamp: '2026-10-08T15:10:00.000Z',
            action: 'INVESTIGATOR_ASSIGNMENT',
            officerName: 'Dr. Bibi Zohara',
            hashVerified: true,
            notes: 'Assigned to Delhi IFSO Cell for 1930 Nodal Account Freeze.'
          },
          {
            id: 'c-3',
            timestamp: '2026-10-08T16:00:00.000Z',
            action: 'SECTION_65B_CERTIFICATE_ISSUED',
            officerName: 'Hon. Magistrate S. K. Sharma',
            hashVerified: true,
            notes: 'Court Admissibility Certificate Certified.'
          }
        ]
      },
      {
        trackingCode: 'FIP-2026-9842',
        category: 'Malicious Trojan APK',
        title: 'Bijli Bill Electricity Scam Trojan APK Infiltration',
        description: 'SMS received alleging power cut due to unpaid bill. Installed BijliBill_Update_v2.4.apk which intercepted banking OTPs.',
        sha256Hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        wormTimestamp: '2026-10-09T09:15:30.000Z',
        status: 'UNDER_INVESTIGATION',
        seniorInvestigator: 'Afsheen S',
        citizenEmail: 'priyanka.s@yahoo.com',
        citizenName: 'Priyanka Sharma',
        evidenceFiles: [
          {
            id: 'file-201',
            filename: 'BijliBill_Update_v2.4.apk',
            fileType: 'archive',
            sizeBytes: 4892010,
            originalFormat: '.APK',
            sha256Hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
          }
        ],
        custodyLogs: [
          {
            id: 'c-4',
            timestamp: '2026-10-09T09:20:00.000Z',
            action: 'REVERSE_ENGINEERING_QUEUE',
            officerName: 'Afsheen S',
            hashVerified: true,
            notes: 'APK binary isolated in hardware write-blocker environment.'
          }
        ]
      },
      {
        trackingCode: 'FIP-2026-9843',
        category: 'Coercive Skype Video Extortion',
        title: 'Digital Arrest Skype CBI Impersonation Video Extortion',
        description: 'Coercive video call impersonating IPS officer claiming illicit drugs found in Mumbai customs parcel. Transfer of ₹8,50,000 demanded.',
        sha256Hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        wormTimestamp: '2026-10-09T18:40:00.000Z',
        status: 'VERIFIED_CHAIN',
        seniorInvestigator: 'Inspector Rajesh Kumar',
        citizenEmail: 'anil.deshmukh@outlook.com',
        citizenName: 'Anil Deshmukh',
        evidenceFiles: [
          {
            id: 'file-301',
            filename: 'cbi_courtroom_skype_arrest.mp4',
            fileType: 'video',
            sizeBytes: 18400290,
            originalFormat: '.MP4',
            sha256Hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
          }
        ],
        custodyLogs: [
          {
            id: 'c-5',
            timestamp: '2026-10-09T18:45:00.000Z',
            action: 'EVIDENCE_LOCK',
            officerName: 'Inspector Rajesh Kumar',
            hashVerified: true,
            notes: 'Screen video recording hashed and certified.'
          }
        ]
      },
      {
        trackingCode: 'FIP-2026-9844',
        category: 'FedEx Customs Scam',
        title: 'FedEx Customs Illegal Parcel Narcotics Interception - ₹3,20,000',
        description: 'Fraudster called pretending to be FedEx Customs officer claiming passport and MDMA found in parcel sent to Taiwan.',
        sha256Hash: 'd41d8cd98f00b204e9800998ecf8427e0281b37d45124b898a123bc6547a9821',
        wormTimestamp: '2026-10-10T00:10:00.000Z',
        status: 'UNDER_INVESTIGATION',
        seniorInvestigator: 'Balchandra K',
        citizenEmail: 'sita.patel@gmail.com',
        citizenName: 'Sita Patel',
        evidenceFiles: [
          {
            id: 'file-401',
            filename: 'fedex_fraud_call_recording.wav',
            fileType: 'audio',
            sizeBytes: 3410290,
            originalFormat: '.WAV',
            sha256Hash: 'd41d8cd98f00b204e9800998ecf8427e0281b37d45124b898a123bc6547a9821'
          }
        ],
        custodyLogs: [
          {
            id: 'c-6',
            timestamp: '2026-10-10T00:15:00.000Z',
            action: 'AUDIO_SPECTRUM_ANALYSIS',
            officerName: 'Balchandra K',
            hashVerified: true,
            notes: 'Voice spectrum matches known syndicate VoIP gateway.'
          }
        ]
      },
      {
        trackingCode: 'FIP-2026-9845',
        category: 'AI Voice Cloning',
        title: 'AI Voice Clone Kidnapping Extortion Call - ₹5,00,000 Demand',
        description: 'Synthesized AI voice clone of victims daughter claiming severe accident in college. Immediate transfer demanded to unverified account.',
        sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        wormTimestamp: '2026-10-10T01:30:00.000Z',
        status: 'UNDER_INVESTIGATION',
        seniorInvestigator: 'Krishi N',
        citizenEmail: 'vikram.singh@rediffmail.com',
        citizenName: 'Vikram Singh',
        evidenceFiles: [
          {
            id: 'file-501',
            filename: 'ai_cloned_voice_sample.wav',
            fileType: 'audio',
            sizeBytes: 2104820,
            originalFormat: '.WAV',
            sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
          }
        ],
        custodyLogs: [
          {
            id: 'c-7',
            timestamp: '2026-10-10T01:35:00.000Z',
            action: 'SYNTHESIS_METADATA_ANALYSIS',
            officerName: 'Krishi N',
            hashVerified: true,
            notes: 'Deepfake AI audio vocal artifact identified.'
          }
        ]
      }
    ]);

    // 4. Seed Gallery Files (Dedicated Raw Format Gallery)
    await GalleryFile.insertMany([
      {
        fileId: 'file-101',
        trackingCode: 'FIP-2026-9841',
        filename: 'telegram_chat_history.pdf',
        fileType: 'document',
        originalFormat: '.PDF',
        sizeBytes: 1104820,
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        uploaderEmail: 'ramesh.verma@gmail.com',
        verifiedByInvestigator: true,
        investigatorNotes: 'Verified by Dr. Bibi Zohara'
      },
      {
        fileId: 'file-102',
        trackingCode: 'FIP-2026-9841',
        filename: 'bank_debit_slip_utr.png',
        fileType: 'photo',
        originalFormat: '.PNG',
        sizeBytes: 842100,
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        uploaderEmail: 'ramesh.verma@gmail.com',
        verifiedByInvestigator: true,
        investigatorNotes: 'Verified by Dr. Bibi Zohara'
      },
      {
        fileId: 'file-201',
        trackingCode: 'FIP-2026-9842',
        filename: 'BijliBill_Update_v2.4.apk',
        fileType: 'archive',
        originalFormat: '.APK',
        sizeBytes: 4892010,
        sha256Hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        uploaderEmail: 'priyanka.s@yahoo.com',
        verifiedByInvestigator: false,
        investigatorNotes: ''
      },
      {
        fileId: 'file-301',
        trackingCode: 'FIP-2026-9843',
        filename: 'cbi_courtroom_skype_arrest.mp4',
        fileType: 'video',
        originalFormat: '.MP4',
        sizeBytes: 18400290,
        sha256Hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        uploaderEmail: 'anil.deshmukh@outlook.com',
        verifiedByInvestigator: true,
        investigatorNotes: 'Verified by Inspector Rajesh Kumar'
      },
      {
        fileId: 'file-401',
        trackingCode: 'FIP-2026-9844',
        filename: 'fedex_fraud_call_recording.wav',
        fileType: 'audio',
        originalFormat: '.WAV',
        sizeBytes: 3410290,
        sha256Hash: 'd41d8cd98f00b204e9800998ecf8427e0281b37d45124b898a123bc6547a9821',
        uploaderEmail: 'sita.patel@gmail.com',
        verifiedByInvestigator: true,
        investigatorNotes: 'Verified by Balchandra K'
      },
      {
        fileId: 'file-501',
        trackingCode: 'FIP-2026-9845',
        filename: 'ai_cloned_voice_sample.wav',
        fileType: 'audio',
        originalFormat: '.WAV',
        sizeBytes: 2104820,
        sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        uploaderEmail: 'vikram.singh@rediffmail.com',
        verifiedByInvestigator: true,
        investigatorNotes: 'Verified by Krishi N'
      }
    ]);

    // 5. Seed Notifications
    await Notification.insertMany([
      {
        id: 'n-1',
        title: 'CUSTODY ALERT: Critical Risk Incident FIP-2026-9841',
        message: 'Senior Investigator Dr. Bibi Zohara assigned to Telegram Escrow Fraud case. Account lien placed via 1930 Helpline.',
        timestamp: new Date(Date.now() - 3600000),
        recipientRole: 'all',
        read: false,
        type: 'custody'
      },
      {
        id: 'n-2',
        title: 'SHA-256 Bit-Level Match Confirmed',
        message: 'Case FIP-2026-9841 hash verified against Raw Vault Storage with zero bit-level divergence.',
        timestamp: new Date(Date.now() - 1800000),
        recipientRole: 'senior_investigator',
        read: false,
        type: 'verification'
      },
      {
        id: 'n-3',
        title: 'Section 65B Statutory Certificate Issued',
        message: 'Chief Metropolitan Magistrate Court issued digital court admissibility seal for Case FIP-2026-9843.',
        timestamp: new Date(Date.now() - 900000),
        recipientRole: 'all',
        read: false,
        type: 'update'
      }
    ]);

    console.log('✅ MongoDB database successfully populated with rich, realistic forensic records!');
    return { success: true, message: 'Database populated with rich fake records' };
  } catch (err: any) {
    console.error('❌ Error seeding MongoDB:', err);
    return { success: false, error: err.message };
  }
};
