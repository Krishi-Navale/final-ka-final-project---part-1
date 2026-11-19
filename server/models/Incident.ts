import mongoose from 'mongoose';

const evidenceFileSchema = new mongoose.Schema({
  id: String,
  name: String,
  filename: String,
  type: String,
  fileType: String,
  size: Number,
  sizeBytes: Number,
  originalFormat: String,
  sha256: String,
  sha256Hash: String,
  wormTimestamp: String,
  previewUrl: String,
  rawContent: String,
  base64Data: String,
  uploadedAt: { type: Date, default: Date.now }
}, { strict: false });

const custodyLogSchema = new mongoose.Schema({
  id: String,
  timestamp: String,
  actor: String,
  role: String,
  action: String,
  merkleHash: String,
  officerName: String,
  hashVerified: Boolean,
  notes: String
}, { strict: false });

const incidentSchema = new mongoose.Schema({
  trackingCode: { type: String, required: true, unique: true, index: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  sha256Hash: { type: String, default: '' },
  primaryHash: { type: String, default: '' },
  wormTimestamp: { type: String, default: () => new Date().toISOString() },
  status: { 
    type: String, 
    default: 'WORM_LOCKED' 
  },
  seniorInvestigator: { type: String, default: 'Dr. Bibi Zohara' },
  citizenEmail: { type: String, required: true, index: true },
  citizenName: { type: String, default: 'Anonymous Citizen' },
  evidenceFiles: [evidenceFileSchema],
  custodyLogs: [custodyLogSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { strict: false });

export const Incident = mongoose.models.Incident || mongoose.model('Incident', incidentSchema);
