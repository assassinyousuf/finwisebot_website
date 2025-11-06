import { verifyToken } from '../../lib/jwt'
import dbConnect from '../../lib/mongoose'
import User from '../../models/User'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  await dbConnect()

  // use dynamic import for cookie to avoid any static resolution issues in dev
  const cookieLib = await import('cookie')
  const cookies = req.headers.cookie ? cookieLib.parse(req.headers.cookie) : {}
  const token = cookies.finwise_token
  if (!token) return res.status(401).json({ ok: false, error: 'Not authenticated' })

  const payload = verifyToken(token)
  if (!payload) return res.status(401).json({ ok: false, error: 'Invalid or expired token' })

  try {
    const user = await User.findById(payload.sub)
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' })

    if (req.method === 'PATCH') {
      const { displayName, avatar, fullName, company, title, phone, currentPassword, newPassword } = req.body || {}

      // If changing password, verify current password
      if (newPassword) {
        if (!currentPassword) return res.status(400).json({ ok: false, error: 'Current password required to change password' })
        const match = bcrypt.compareSync(currentPassword, user.passwordHash)
        if (!match) return res.status(401).json({ ok: false, error: 'Current password is incorrect' })
        if (newPassword.length < 8) return res.status(400).json({ ok: false, error: 'New password must be at least 8 characters' })
        user.passwordHash = bcrypt.hashSync(newPassword, 10)
      }

      // Update profile fields
      if (displayName !== undefined) user.displayName = displayName
      if (avatar !== undefined) user.avatar = avatar
      if (fullName !== undefined) user.fullName = fullName
      if (company !== undefined) user.company = company
      if (title !== undefined) user.title = title
      if (phone !== undefined) user.phone = phone

      await user.save()

      const safe = user.toObject()
      delete safe.passwordHash
      delete safe.verifyToken
      delete safe.resetToken
      delete safe.resetExpires

      return res.status(200).json({ ok: true, user: safe })
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  } catch (err) {
    console.error('user update error', err)
    return res.status(500).json({ ok: false, error: 'Internal server error' })
  }
}