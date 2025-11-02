import dbConnect from '../../../lib/mongoose'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ ok: false, error: 'Forbidden' })
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' })
  const { email, newPassword } = req.body || {}
  if (!email || !newPassword) return res.status(400).json({ ok: false, error: 'email and newPassword required' })
  if (typeof newPassword !== 'string' || newPassword.length < 8) return res.status(400).json({ ok: false, error: 'Password too weak' })
  await dbConnect()
  try {
    const user = await User.findOne({ email: String(email).toLowerCase() })
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' })
    const hash = bcrypt.hashSync(newPassword, 10)
    user.passwordHash = hash
    await user.save()
    return res.status(200).json({ ok: true, message: 'Password updated' })
  } catch (err) {
    console.error('debug/reset-password error', err)
    return res.status(500).json({ ok: false, error: 'Internal server error' })
  }
}
