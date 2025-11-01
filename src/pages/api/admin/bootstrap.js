import dbConnect from '../../../lib/mongoose'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

// Dev-only bootstrap endpoint to create/promote an admin and set a cookie.
// WARNING: This endpoint is intentionally dev-only and will refuse to run in production.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' })

  // Deny in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ ok: false, error: 'Forbidden in production' })
  }

  // Basic host check: require request from localhost (127.0.0.1 or ::1)
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
  const allowed = ['127.0.0.1', '::1', '::ffff:127.0.0.1']
  if (!allowed.some(a => ip.includes(a))) {
    // allow when running server in environments where remoteAddress may be different
    // but still warn
    console.warn('bootstrap called from non-local IP:', ip)
  }

  await dbConnect()

  try {
    const adminEmail = process.env.ADMIN_EMAIL || req.body?.email || 'admin@local.test'
    const adminPassword = process.env.ADMIN_PASSWORD || req.body?.password || null

    let user = await User.findOne({ email: adminEmail.toLowerCase() })
    if (user) {
      // promote
      user.roles = Array.from(new Set([...(user.roles || []), 'admin']))
      user.verified = true
      await user.save()
    } else {
      // create
      if (!adminPassword) {
        // generate a random password if not provided
        const rand = () => Math.random().toString(36).slice(2, 10)
        const gen = rand() + rand()
        // set as password so we can return it to the caller
        req._generatedPassword = gen
      }
      const passwordToUse = adminPassword || req._generatedPassword
      const hash = bcrypt.hashSync(passwordToUse, 10)
      user = new User({ email: adminEmail.toLowerCase(), passwordHash: hash, roles: ['admin'], verified: true })
      await user.save()
    }

    // Issue a cookie so the browser is logged in (reuse auth logic)
    const { signToken } = await import('../../../lib/jwt')
    const token = signToken({ sub: user._id.toString(), email: user.email })
    const cookieLib = await import('cookie')
    const serialized = cookieLib.serialize('finwise_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    res.setHeader('Set-Cookie', serialized)

    const resp = { ok: true, email: user.email, promoted: true }
    if (req._generatedPassword) resp.generatedPassword = req._generatedPassword
    return res.status(200).json(resp)
  } catch (err) {
    console.error('admin bootstrap error', err)
    return res.status(500).json({ ok: false, error: 'Internal server error' })
  }
}
