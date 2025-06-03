import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  whatsapp: String,
  accessToken: { type: String, required: true, unique: true },
  refreshToken: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresIn: { 
    timestamp: String,
    dateString: Date },
});

export default mongoose.model('GoogleUser', userSchema);