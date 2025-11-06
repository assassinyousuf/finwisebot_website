import bcrypt from 'bcryptjs'
import validator from 'validator'

// Simple localStorage-based auth for demo purposes
const STORAGE_PREFIX = 'finwisebot_auth_'

function read(key, fallback) {
  if (typeof localStorage === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

function write(key, val) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val))
  } catch (e) {}
}

// Initialize default admin user if not exists
function initializeDefaultUser() {
  const users = read('users', [])
  const adminUser = users.find(u => u.email === 'admin@local')

  if (!adminUser) {
    // Create default admin user
    const saltRounds = 10
    const hash = bcrypt.hashSync('1AAAAAAAA', saltRounds)
    const user = {
      id: 'local-admin',
      email: 'admin@local',
      passwordHash: hash,
      roles: ['admin'],
      createdAt: new Date().toISOString()
    }
    users.push(user)
    write('users', users)
    console.log('Default admin user created: admin@local / 1AAAAAAAA')
  } else if (!adminUser.passwordHash) {
    // Update existing user with password if missing
    const saltRounds = 10
    adminUser.passwordHash = bcrypt.hashSync('1AAAAAAAA', saltRounds)
    adminUser.createdAt = adminUser.createdAt || new Date().toISOString()
    write('users', users)
    console.log('Default admin user password set: admin@local / 1AAAAAAAA')
  }
}

// Initialize on module load
initializeDefaultUser()

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { action, email, password } = req.body || {}

  if (action === 'signup') {
    // Basic validation
    if (!email || !validator.isEmail(String(email))) {
      return res.status(400).json({ ok: false, error: 'Invalid email address' })
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ ok: false, error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const users = read('users', [])
    const existing = users.find(u => u.email === email.toLowerCase())
    if (existing) {
      return res.status(409).json({ ok: false, error: 'Email already registered' })
    }

    // Create user
    const saltRounds = 10
    const hash = bcrypt.hashSync(password, saltRounds)
    const user = {
      id: 'u_' + Date.now(),
      email: email.toLowerCase(),
      passwordHash: hash,
      roles: [],
      createdAt: new Date().toISOString()
    }
    users.push(user)
    write('users', users)

    return res.status(201).json({ ok: true, message: 'Account created successfully!' })
  }

  if (action === 'login') {
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: 'Missing credentials' })
    }

    const users = read('users', [])
    const user = users.find(u => u.email === email.toLowerCase())
    if (!user) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password' })
    }

    const match = bcrypt.compareSync(password, user.passwordHash)
    if (!match) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password' })
    }

    // Store current user in localStorage
    const userSession = {
      id: user.id,
      email: user.email,
      roles: user.roles,
      loggedInAt: new Date().toISOString()
    }
    write('currentUser', userSession)

    return res.status(200).json({
      ok: true,
      message: 'Logged in successfully!',
      user: userSession
    })
  }

  if (action === 'logout') {
    write('currentUser', null)
    return res.status(200).json({ ok: true, message: 'Logged out' })
  }

  return res.status(400).json({ ok: false, error: 'Unknown action' })
}
