import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let connectingPromise: Promise<boolean> | null = null;
let lastFailTime = 0;
const RETRY_INTERVAL_MS = 30000;

export const connectToMongoDB = async (): Promise<boolean> => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  // If connection attempt failed recently, immediately use fast in-memory fallback without 5s stall
  if (Date.now() - lastFailTime < RETRY_INTERVAL_MS) {
    return false;
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  const uri = process.env.MONGODB_URI || 'mongodb+srv://navalekrishi_db_user:aa6rh0FdXbOtRQ81@database.7xseu8e.mongodb.net/fip_forensic_db?retryWrites=true&w=majority&appName=Database';

  connectingPromise = (async () => {
    try {
      console.log(`🔌 Attempting connection to MongoDB...`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`🟢 Successfully connected to MongoDB Database: ${mongoose.connection.name}`);
      return true;
    } catch (err: any) {
      lastFailTime = Date.now();
      console.warn(`⚠️ Could not connect to MongoDB instance (${err.message}). Application will serve in hybrid/in-memory fallback mode until MongoDB connection string is provided in .env.`);
      return false;
    } finally {
      connectingPromise = null;
    }
  })();

  return connectingPromise;
};
