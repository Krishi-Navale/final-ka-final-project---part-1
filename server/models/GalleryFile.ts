import mongoose from 'mongoose';

const galleryFileSchema = new mongoose.Schema({
  fileId: { type: String, required: true, unique: true },
  trackingCode: { type: String, required: true, index: true },
  filename: { type: String, required: true },
  fileType: { type: String, required: true }, // 'photo' | 'video' | 'document' | 'audio' | 'archive'
  originalFormat: { type: String, required: true }, // '.RAW', '.PNG', '.MP4', '.PDF', etc.
  sizeBytes: { type: Number, required: true },
  sha256Hash: { type: String, required: true, index: true },
  base64Data: { type: String },
  uploaderEmail: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  verifiedByInvestigator: { type: Boolean, default: false },
  investigatorNotes: { type: String, default: '' }
});

export const GalleryFile = mongoose.models.GalleryFile || mongoose.model('GalleryFile', galleryFileSchema);
