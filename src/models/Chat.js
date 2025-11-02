import mongoose from 'mongoose'

const ChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String },
  query: { type: String, required: true },
  answer: { type: String },
  meta: { type: mongoose.Schema.Types.Mixed },
  // LLM metadata: provider/model/auth/raw response/status etc.
  llm: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema)
