import dbConnect from '../../../lib/mongoose'
import User from '../../../models/User'
import { requireAdmin } from '../../../lib/adminAuth'

export default async function handler(req, res) {
  await dbConnect()

  // In development we allow an unsecured admin panel for convenience.
  // To enable unsecured admin in production you'd need to set an explicit env var.
  const allowUnsecured = process.env.NODE_ENV !== 'production'
  if (!allowUnsecured) {
    // require admin; requireAdmin will send responses on error
    const admin = await requireAdmin(req, res)
    if (!admin || admin.ok === false) return // requireAdmin already responded
  }

  try {
    if (req.method === 'GET') {
      const users = await User.find().select('-passwordHash -verifyToken').lean()
      return res.status(200).json({ ok: true, users })
    }

    if (req.method === 'PATCH') {
      const { id, action } = req.body
      if (!id || !action) return res.status(400).json({ ok: false, error: 'id and action required' })
      const user = await User.findById(id)
      if (!user) return res.status(404).json({ ok: false, error: 'User not found' })

      if (action === 'promote') {
        user.roles = Array.from(new Set([...(user.roles||[]), 'admin']))
      } else if (action === 'demote') {
        user.roles = (user.roles||[]).filter(r => r !== 'admin')
      } else if (action === 'resetPassword') {
        const { newPassword } = req.body || {}
        if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) return res.status(400).json({ ok: false, error: 'newPassword required (min 8 chars)' })
        const bcrypt = await import('bcryptjs')
        user.passwordHash = bcrypt.hashSync(newPassword, 10)
        // clear any reset tokens
        user.resetToken = undefined
        user.resetExpires = undefined
      } else {
        return res.status(400).json({ ok: false, error: 'Unknown action' })
      }

      await user.save()
      const safe = user.toObject()
      delete safe.passwordHash
      delete safe.verifyToken
      return res.status(200).json({ ok: true, user: safe })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ ok: false, error: 'id required' })
      await User.findByIdAndDelete(id)
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  } catch (err) {
    console.error('admin/users error', err)
    return res.status(500).json({ ok: false, error: 'Internal server error' })
  }
}
