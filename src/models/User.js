import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  verifyToken: { type: String },
  roles: { type: [String], default: [] },
  lastLogin: { type: Date },
})

// Avoid recompiling model during hot reloads
export default mongoose.models.User || mongoose.model('User', UserSchema)
