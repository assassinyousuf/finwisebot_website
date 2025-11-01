import cookie from 'cookie'
import { verifyToken } from '../../lib/jwt'
import dbConnect from '../../lib/mongoose'
import User from '../../models/User'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  await dbConnect()

  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {}
  const token = cookies.finwise_token
  if (!token) return res.status(401).json({ ok: false, error: 'Not authenticated' })

  const payload = verifyToken(token)
  if (!payload) return res.status(401).json({ ok: false, error: 'Invalid or expired token' })

  try {
    const user = await User.findById(payload.sub).select('-passwordHash -verifyToken')
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' })
    return res.status(200).json({ ok: true, user })
  } catch (err) {
    console.error('me error', err)
    return res.status(500).json({ ok: false, error: 'Internal server error' })
  }
}
