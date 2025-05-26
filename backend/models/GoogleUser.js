import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  whatsapp: String,
  accessToken: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresIn: { type: Date },
});

export default mongoose.model('GoogleUser', userSchema);