import dbConnect from '../../../lib/mongoose'
import User from '../../../models/User'
import Chat from '../../../models/Chat'
import requireAdmin from '../../../lib/adminAuth'

export default async function handler(req, res) {
  await dbConnect()

  const allowUnsecured = process.env.NODE_ENV !== 'production'
  if (!allowUnsecured) {
    const admin = await requireAdmin(req, res)
    if (!admin) return
  }

  try {
    const userCount = await User.countDocuments()
    const chatCount = await Chat.countDocuments()
    return res.status(200).json({ ok: true, connected: true, userCount, chatCount })
  } catch (err) {
    console.error('admin/db-status error', err)
    return res.status(200).json({ ok: false, connected: false, error: String(err) })
  }
}
