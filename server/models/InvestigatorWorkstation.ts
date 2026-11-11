import mongoose from 'mongoose';

const custodyAlertSchema = new mongoose.Schema({
  alertId: { type: String, required: true },
  trackingCode: { type: String, required: true },
  caseTitle: { type: String, required: true },
  category: { type: String, required: true },
  riskLevel: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'NORMAL'], default: 'HIGH' },
  userDashboardHash: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['PENDING_REVIEW', 'INVESTIGATING', 'VERIFIED_CHAIN', 'DISMISSED'], default: 'PENDING_REVIEW' }
});

const favoriteInvestigatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  badge: { type: String, required: true },
  agency: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  totalCasesHandled: { type: Number, default: 0 },
  activeStatus: { type: Boolean, default: true }
});

const bitLevelReviewSchema = new mongoose.Schema({
  reviewId: { type: String, required: true },
  trackingCode: { type: String, required: true },
  userDashboardHash: { type: String, required: true },
  vaultHash: { type: String, required: true },
  isMatch: { type: Boolean, required: true },
  investigatorName: { type: String, required: true },
  verifiedAt: { type: Date, default: Date.now },
  notes: { type: String, default: '' }
});

const section65bCertificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true },
  trackingCode: { type: String, required: true },
  magistrateCourt: { type: String, default: 'Chief Metropolitan Magistrate Court, New Delhi' },
  judgeName: { type: String, default: 'Honorable District & Sessions Judge' },
  digitalSignatureSeal: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now }
});

const investigatorWorkstationSchema = new mongoose.Schema({
  workstationId: { type: String, required: true, unique: true },
  investigatorName: { type: String, required: true },
  badgeNumber: { type: String, required: true },
  activeAlertsCount: { type: Number, default: 0 },
  custodyAlerts: [custodyAlertSchema],
  favoriteInvestigators: [favoriteInvestigatorSchema],
  bitLevelReviews: [bitLevelReviewSchema],
  section65bCertificates: [section65bCertificateSchema],
  updatedAt: { type: Date, default: Date.now }
});

export const InvestigatorWorkstation = mongoose.models.InvestigatorWorkstation || mongoose.model('InvestigatorWorkstation', investigatorWorkstationSchema);
