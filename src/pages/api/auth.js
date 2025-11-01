import bcrypt from 'bcryptjs'
import validator from 'validator'
import crypto from 'crypto'

import dbConnect from '../../lib/mongoose'
import User from '../../models/User'

// Simple in-memory rate limiter map: ip -> { count, firstSeen }
const rateMap = new Map()
const RATE_LIMIT_MAX = 5 // max signups per window
const RATE_LIMIT_WINDOW = 1000 * 60 * 60 // 1 hour

function checkRate(ip) {
  const now = Date.now()
  const entry = rateMap.get(ip) || { count: 0, firstSeen: now }
  if (now - entry.firstSeen > RATE_LIMIT_WINDOW) {
    // reset
    entry.count = 0
    entry.firstSeen = now
  }
  entry.count += 1
  rateMap.set(ip, entry)
  return entry.count <= RATE_LIMIT_MAX
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { action, email, password } = req.body || {}
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'

  // connect to DB (no-op if MONGODB_URI not set)
  await dbConnect()

  if (action === 'signup') {
    if (!checkRate(ip)) {
      return res.status(429).json({ ok: false, error: 'Too many signup attempts from this IP. Try again later.' })
    }

    // Basic validation
    if (!email || !validator.isEmail(String(email))) {
      return res.status(400).json({ ok: false, error: 'Invalid email address' })
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ ok: false, error: 'Password must be at least 8 characters' })
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ ok: false, error: 'Password must include letters and numbers' })
    }

    try {
      const existing = await User.findOne({ email: email.toLowerCase() })
      if (existing) return res.status(409).json({ ok: false, error: 'Email already registered' })

      const saltRounds = 10
      const hash = bcrypt.hashSync(password, saltRounds)
      const verifyToken = crypto.randomBytes(20).toString('hex')

      const user = new User({
        email: email.toLowerCase(),
        passwordHash: hash,
        verified: false,
        verifyToken,
      })

      await user.save()

      const resp = { ok: true, message: 'Account created. Verification email sent.' }
      if (process.env.NODE_ENV !== 'production') resp.verifyToken = verifyToken
      return res.status(201).json(resp)
    } catch (err) {
      console.error('signup error', err)
      return res.status(500).json({ ok: false, error: 'Internal server error' })
    }
  }

  if (action === 'login') {
    if (!email || !password) return res.status(400).json({ ok: false, error: 'Missing credentials' })
    try {
      const user = await User.findOne({ email: String(email).toLowerCase() })
      if (!user) return res.status(401).json({ ok: false, error: 'Invalid email or password' })

      const match = bcrypt.compareSync(password, user.passwordHash)
      if (!match) return res.status(401).json({ ok: false, error: 'Invalid email or password' })

      if (!user.verified) return res.status(403).json({ ok: false, error: 'Email not verified' })

      // TODO: Issue httpOnly cookie / JWT here in production
      return res.status(200).json({ ok: true, message: 'Logged in (demo)' })
    } catch (err) {
      console.error('login error', err)
      return res.status(500).json({ ok: false, error: 'Internal server error' })
    }
  }

  return res.status(400).json({ ok: false, error: 'Unknown action' })
}
