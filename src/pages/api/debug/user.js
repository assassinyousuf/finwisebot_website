import dbConnect from '../../../lib/mongoose'
import User from '../../../models/User'

export default async function handler(req, res) {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ ok: false, error: 'Forbidden' })
  await dbConnect()
  const email = req.query.email
  if (!email) return res.status(400).json({ ok: false, error: 'email query required' })
  try {
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('-passwordHash')
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' })
    return res.status(200).json({ ok: true, user })
  } catch (err) {
    console.error('debug/user error', err)
    return res.status(500).json({ ok: false, error: 'Internal server error' })
  }
}
