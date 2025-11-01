import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import crypto from 'crypto'

// Simple in-memory rate limiter map: ip -> { count, firstSeen }
const rateMap = new Map()
const RATE_LIMIT_MAX = 5 // max signups per window
const RATE_LIMIT_WINDOW = 1000 * 60 * 60 // 1 hour

const USERS_FILE = path.join(process.cwd(), 'src', 'data', 'users.json')

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8')
    return JSON.parse(raw || '[]')
  } catch (e) {
    return []
  }
}

function writeUsers(users) {
  fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true })
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
}

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

  if (action === 'signup') {
    // Rate limiting per IP for signups
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
    // password complexity: at least letters and numbers
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ ok: false, error: 'Password must include letters and numbers' })
    }

    // load users
    const users = readUsers()
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ ok: false, error: 'Email already registered' })
    }

    try {
      const saltRounds = 10
      const hash = bcrypt.hashSync(password, saltRounds)
      const verifyToken = crypto.randomBytes(20).toString('hex')

      const user = {
        email: email.toLowerCase(),
        passwordHash: hash,
        createdAt: new Date().toISOString(),
        verified: false,
        verifyToken,
      }

      users.push(user)
      writeUsers(users)

      // NOTE: In a real system you'd send the verifyToken by email. For demo / dev we return a message and token.
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
    const users = readUsers()
    const user = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())
    if (!user) return res.status(401).json({ ok: false, error: 'Invalid email or password' })

    const match = bcrypt.compareSync(password, user.passwordHash)
    if (!match) return res.status(401).json({ ok: false, error: 'Invalid email or password' })

    if (!user.verified) return res.status(403).json({ ok: false, error: 'Email not verified' })

    // For demo, we return a success message. In production issue a secure httpOnly cookie / session.
    return res.status(200).json({ ok: true, message: 'Logged in (demo)' })
  }

  return res.status(400).json({ ok: false, error: 'Unknown action' })
}
