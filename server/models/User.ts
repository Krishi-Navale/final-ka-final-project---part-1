import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'senior_investigator', 'forensic_admin'], default: 'citizen' },
  badgeNumber: { type: String, default: '' },
  agency: { type: String, default: '' },
  phone: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now }
}, { strict: false });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
