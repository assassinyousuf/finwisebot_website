import cookie from 'cookie'
import { verifyToken } from './jwt'
import dbConnect from './mongoose'
import User from '../models/User'

export async function requireAdmin(req, res) {
  await dbConnect()
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {}
  const token = cookies.finwise_token
  if (!token) {
    res.status(401).json({ ok: false, error: 'Not authenticated' })
    return null
  }

  const payload = verifyToken(token)
  if (!payload) {
    res.status(401).json({ ok: false, error: 'Invalid or expired token' })
    return null
  }

  const user = await User.findById(payload.sub)
  if (!user) {
    res.status(404).json({ ok: false, error: 'User not found' })
    return null
  }
  if (!Array.isArray(user.roles) || !user.roles.includes('admin')) {
    res.status(403).json({ ok: false, error: 'Admin role required' })
    return null
  }

  // return the user document (without sensitive fields)
  const safe = user.toObject()
  delete safe.passwordHash
  delete safe.verifyToken
  return safe
}

export default requireAdmin
