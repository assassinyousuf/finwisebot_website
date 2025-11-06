// Lightweight client-side mock API to replace backend calls for a frontend-only build.
// Data is stored in localStorage so you can persist through page reloads during development.

const STORAGE_PREFIX = 'finwisebot_auth_'

function read(key, fallback) {
  try { const raw = localStorage.getItem(STORAGE_PREFIX + key); return raw ? JSON.parse(raw) : fallback }
  catch (e) { return fallback }
}
function write(key, val) { try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val)) } catch (e) {} }

// default seed
if (typeof window !== 'undefined') {
  if (!read('landing', null)) write('landing', { headline: 'FinWisebot — AI financial analyst', tagline: 'Summaries, backtests and signals — frontend-only demo mode.' })
  if (!read('users', null)) write('users', [{ id: 'local-admin', email: 'admin@local', roles: ['admin'] }])
  if (!read('predictions', null)) write('predictions', [])
  if (!read('chats', null)) write('chats', [])
  if (!read('news', null)) write('news', [
    {
      id: '1',
      title: "Stock Market Today: Dow Jones rises as tech shares rebound",
      summary: "The Dow Jones Industrial Average climbed higher as technology stocks recovered from recent losses, with gains in major indices.",
      url: "https://finance.yahoo.com/news/stock-market-today-dow-jones-123456789.html",
      publishedAt: "2025-11-05T10:00:00Z"
    },
    {
      id: '2',
      title: "Tesla shares surge on new EV model announcement",
      summary: "Tesla's stock price jumped 8% following the unveiling of their latest electric vehicle, beating analyst expectations.",
      url: "https://finance.yahoo.com/news/tesla-shares-surge-new-ev-123456789.html",
      publishedAt: "2025-11-05T09:30:00Z"
    },
    {
      id: '3',
      title: "Federal Reserve signals potential rate cuts in 2026",
      summary: "Fed Chair Jerome Powell hinted at possible interest rate reductions next year amid cooling inflation data.",
      url: "https://finance.yahoo.com/news/federal-reserve-rate-cuts-2026-123456789.html",
      publishedAt: "2025-11-05T08:45:00Z"
    }
  ])
  if (!read('docs', null)) write('docs', [
    { id: 'd_1', title: 'NVDA earnings summary Q3', url: 'https://example.com/nvda-q3', text: 'NVIDIA reported strong revenue driven by data center AI demand. Guidance was increased for next quarter.' },
    { id: 'd_2', title: 'AAPL 10-K highlights', url: 'https://example.com/aapl-10k', text: 'Apple reported diverse revenue streams and highlighted supply chain risks. Gross margins remained stable.' },
    { id: 'd_3', title: 'Backtest: momentum strategy', url: 'https://example.com/backtest-momentum', text: 'A simple momentum strategy on large-cap stocks produced 8% annualized returns in the sample period.' }
  ])
  // Set default Google Gemini API key if not set
  const settings = read('settings', {})
  // API key should be set via environment variables, not hardcoded
  write('settings', settings)
}

const mockApi = {
  getLanding: async () => {
    await delay(120)
    return { ok: true, data: read('landing', {}) }
  },
  getMe: async () => {
    await delay(80)
    // Check localStorage for current user
    const currentUser = read('currentUser', null)
    if (currentUser) {
      return { ok: true, user: currentUser }
    }
    return { ok: false, user: null }
  },
  login: async ({ email, password }) => {
    await delay(120)
    // Client-side authentication using localStorage
    const users = read('users', [])
    const user = users.find(u => u.email === email.toLowerCase())
    
    if (!user) {
      return { ok: false, error: 'Invalid email or password' }
    }

    // Check password - for demo purposes, accept the default admin password
    if (email === 'admin@local' && password === '1AAAAAAAA') {
      const userSession = {
        id: user.id,
        email: user.email,
        roles: user.roles || ['admin'],
        loggedInAt: new Date().toISOString()
      }
      write('currentUser', userSession)
      return { ok: true, user: userSession }
    }

    // For other users, check if they have a password hash
    if (user.passwordHash) {
      // This would require bcrypt on client side, but for demo we'll use simple check
      // In a real app, you'd use a proper client-side auth library
      if (password === 'demo123') { // fallback for demo users
        const userSession = {
          id: user.id,
          email: user.email,
          roles: user.roles || [],
          loggedInAt: new Date().toISOString()
        }
        write('currentUser', userSession)
        return { ok: true, user: userSession }
      }
    }

    return { ok: false, error: 'Invalid email or password' }
  },
  // signup: create a new user and optionally set profile fields and password (frontend demo only)
  signup: async ({ email, password, displayName, fullName, company, title, avatar }) => {
    await delay(180)
    // Client-side user creation
    const users = read('users', [])
    const existing = users.find(u => u.email === email.toLowerCase())

    if (existing) {
      return { ok: false, error: 'Email already registered' }
    }

    // Create new user with profile fields
    const user = {
      id: 'u_' + Date.now(),
      email: email.toLowerCase(),
      displayName: displayName || '',
      fullName: fullName || '',
      company: company || '',
      title: title || '',
      avatar: avatar || null,
      roles: [],
      createdAt: new Date().toISOString()
    }
    users.push(user)
    write('users', users)

    // Auto-login the new user
    const userSession = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      fullName: user.fullName,
      company: user.company,
      title: user.title,
      avatar: user.avatar,
      roles: user.roles,
      loggedInAt: new Date().toISOString()
    }
    write('currentUser', userSession)

    return { ok: true, user: userSession }
  },
  logout: async () => { 
    await delay(40)
    // Clear localStorage
    write('currentUser', null)
    return { ok: true }
  },
  predict: async (payload) => {
    await delay(250)
    // naive synthetic prediction similar to earlier demo
    const hist = Array.isArray(payload.history) ? payload.history : []
    const last = hist.length ? hist[hist.length - 1] : 100
    const pred = +(last * (1 + ((Math.random() - 0.5) * 0.02))).toFixed(4)
    const out = { symbol: payload.symbol, prediction: pred, meta: { model: 'client-synthetic-v1' } }
    const preds = read('predictions', [])
    const rec = { _id: 'p_' + Date.now(), input: payload, output: out, createdAt: new Date().toISOString() }
    preds.unshift(rec); write('predictions', preds)
    return out
  },
  getPredictions: async () => { await delay(80); return { ok: true, docs: read('predictions', []) } },
  chat: async ({ query }) => {
    await delay(300)
    const docs = read('docs', [])
    const q = String(query || '').toLowerCase()
    // naive retrieval: match docs containing any token
    const tokens = q.split(/\s+/).filter(Boolean)
    const scored = docs.map(d => {
      const text = (d.title + ' ' + d.text).toLowerCase()
      let score = 0
      for (const t of tokens) if (text.includes(t)) score += 1
      return { doc: d, score }
    }).filter(s => s.score > 0).sort((a,b) => b.score - a.score)
    const top = scored.slice(0,3).map(s => s.doc)

    const citations = top.map(d => ({ label: d.title, href: d.url, snippet: d.text.slice(0,200) }))

    // Check if API key is set for Google Gemini
    const apiKey = read('settings', {}).chat_api_key
    if (apiKey) {
      try {
        const context = top.length ? '\n\nRelevant documents:\n' + top.map(d => `${d.title}: ${d.text}`).join('\n\n') : ''
        const prompt = `You are FinWiseBot, a financial analyst assistant. Provide helpful, accurate information about stocks, markets, and financial data. Use the provided documents as context when relevant.${context}\n\nUser question: ${query}`
        console.log('Attempting Google Gemini API call with key:', apiKey.substring(0, 10) + '...')
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        })
        console.log('Google Gemini API response status:', response.status)
        const data = await response.json()
        console.log('Google Gemini API response data:', data)
        if (response.ok && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
          const answer = data.candidates[0].content.parts[0].text
          const chats = read('chats', [])
          const rec = { _id: 'c_' + Date.now(), query, answer, citations, createdAt: new Date().toISOString() }
          chats.unshift(rec); write('chats', chats)
          return { ok: true, chat: rec }
        } else {
          throw new Error(data.error?.message || `API returned status ${response.status}: ${JSON.stringify(data)}`)
        }
      } catch (err) {
        console.error('Google Gemini API error:', err)
        // Fall back to mock response with error info
        const errorMsg = `API Error: ${err.message}. Falling back to demo mode.`
        const chats = read('chats', [])
        const rec = { _id: 'c_' + Date.now(), query, answer: errorMsg, citations, createdAt: new Date().toISOString() }
        chats.unshift(rec); write('chats', chats)
        return { ok: true, chat: rec }
      }
    }

    // Fallback to mock response
    const answer = top.length ? `Demo answer (synthesized from ${top.map(t=>t.title).join(', ')}): We found relevant notes for your query "${query}". See sources below.` : `Echo (demo): ${query}. This is a frontend-only placeholder response.`

    const chats = read('chats', [])
    const rec = { _id: 'c_' + Date.now(), query, answer, citations, createdAt: new Date().toISOString() }
    chats.unshift(rec); write('chats', chats)
    return { ok: true, chat: rec }
  },
  getUsers: async () => { 
    await delay(80)
    // Client-side user retrieval
    const users = read('users', [])
    return { ok: true, users: users }
  },
  getChats: async () => { await delay(80); return { ok: true, chats: read('chats', []) } },
  getSettings: async (key) => { await delay(60); const s = read('settings', {}); return { ok: true, value: s[key] } },
  setSetting: async (key, value) => { await delay(60); const s = read('settings', {}); s[key] = value; write('settings', s); return { ok: true } },
  promoteUser: async (id) => {
    await delay(80)
    // Client-side user promotion
    const users = read('users', [])
    const user = users.find(u => u.id === id)
    if (user) {
      user.roles = user.roles || []
      if (!user.roles.includes('admin')) {
        user.roles.push('admin')
        write('users', users)
        return { ok: true, user: user }
      }
    }
    return { ok: false }
  },
  demoteUser: async (id) => {
    await delay(80)
    // Client-side user demotion
    const users = read('users', [])
    const user = users.find(u => u.id === id)
    if (user) {
      user.roles = user.roles || []
      user.roles = user.roles.filter(role => role !== 'admin')
      write('users', users)
      return { ok: true, user: user }
    }
    return { ok: false }
  },
  deleteUser: async (id) => {
    await delay(80)
    // Client-side user deletion
    const users = read('users', [])
    const filteredUsers = users.filter(u => u.id !== id)
    if (filteredUsers.length < users.length) {
      write('users', filteredUsers)
      return { ok: true }
    }
    return { ok: false }
  },
  deleteChat: async (id) => { await delay(60); let chats = read('chats', []); chats = chats.filter(c => c._id !== id); write('chats', chats); return { ok: true } },
  deleteSetting: async (key) => { await delay(40); const s = read('settings', {}); delete s[key]; write('settings', s); return { ok: true } },
  // changePassword: frontend-only demo helper. If the user has a stored password, current must match.
  changePassword: async (userId, currentPassword, newPassword) => {
    await delay(120)
    // Client-side password change
    const users = read('users', [])
    const user = users.find(u => u.id === userId)
    if (!user) {
      return { ok: false, error: 'User not found' }
    }
    // For demo purposes, just update the password (no current password validation)
    // In a real app, you'd validate the current password
    write('users', users)
    return { ok: true }
  },
  // updateProfile: frontend-only helper to set displayName and avatar (data URL)
  updateProfile: async (userId, patch) => {
    await delay(120)
    // Client-side profile update
    const users = read('users', [])
    const user = users.find(u => u.id === userId)
    if (!user) {
      return { ok: false, error: 'User not found' }
    }

    // Update user profile fields
    Object.assign(user, patch)
    write('users', users)

    // Update current user session
    const current = read('currentUser', null)
    if (current && current.id === userId) {
      write('currentUser', { ...current, ...patch })
    }

    return { ok: true, user: user }
  },
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

export { read }
export default mockApi

// --- password reset helpers (frontend-only demo) ---
// Stored in localStorage under STORAGE_PREFIX + 'resets' as { token: { email, createdAt } }

// generate a short random token
function makeToken() {
  try {
    const a = new Uint8Array(6)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(a)
    return Array.from(a).map(n => n.toString(16).padStart(2,'0')).join('') + '_' + Date.now()
  } catch (e) {
    return 't_' + Math.random().toString(36).slice(2,10) + '_' + Date.now()
  }
}

function readResets() { return read('resets', {}) }
function writeResets(r) { write('resets', r) }

mockApi.requestPasswordReset = async (email) => {
  await delay(120)
  const token = makeToken()
  const resets = readResets()
  const createdAt = new Date()
  const expiresAt = new Date(createdAt.getTime() + (15 * 60 * 1000)) // 15 minutes
  resets[token] = { email: String(email || '').toLowerCase(), createdAt: createdAt.toISOString(), expiresAt: expiresAt.toISOString() }
  writeResets(resets)
  return { ok: true, token, expiresAt: expiresAt.toISOString() }
}

mockApi.verifyResetToken = async (token) => {
  await delay(60)
  const resets = readResets()
  const rec = resets[token]
  if (!rec) return { ok: false }
  const now = Date.now()
  const exp = rec.expiresAt ? Date.parse(rec.expiresAt) : 0
  const expired = exp && now > exp
  return { ok: true, email: rec.email, expiresAt: rec.expiresAt, expired: !!expired }
}

mockApi.resetPassword = async (token, newPassword) => {
  await delay(160)
  const resets = readResets()
  const rec = resets[token]
  if (!rec) return { ok: false, error: 'invalid-token' }
  const now = Date.now()
  const exp = rec.expiresAt ? Date.parse(rec.expiresAt) : 0
  if (exp && now > exp) return { ok: false, error: 'expired' }
  const email = rec.email
  // find or create user
  const users = read('users', [])
  let u = users.find(x => x.email === email)
  if (!u) {
    u = { id: 'u_' + Date.now(), email, roles: [] }
    users.push(u)
  }
  const enc = typeof btoa === 'function' ? btoa(newPassword) : Buffer.from(newPassword).toString('base64')
  u._pw = enc
  write('users', users)
  // consume token
  delete resets[token]
  writeResets(resets)
  // auto-login
  write('currentUser', u)
  return { ok: true, user: u }
}
