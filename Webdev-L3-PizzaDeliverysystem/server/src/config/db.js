import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[config/db] MongoDB connected');
  } catch (err) {
    console.error('[config/db] connection failed:', err.message);
    throw err;
  }
};
