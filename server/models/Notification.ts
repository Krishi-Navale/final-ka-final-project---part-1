import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() },
  recipientEmail: { type: String, default: '' },
  recipientRole: { type: String, default: 'all' },
  read: { type: Boolean, default: false },
  type: { type: String, default: 'DIRECT_NOTICE' },
  relatedTrackingCode: { type: String, default: '' },
  relatedIncidentId: { type: String, default: '' },
  senderName: { type: String, default: '' },
  badge: { type: String, default: '' },
  actionUrlHash: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

