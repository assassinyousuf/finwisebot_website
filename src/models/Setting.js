import mongoose from 'mongoose'

const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  value: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema)
