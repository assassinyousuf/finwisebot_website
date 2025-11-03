// Lightweight client-side mock API to replace backend calls for a frontend-only build.
// Data is stored in localStorage so you can persist through page reloads during development.

const STORAGE_PREFIX = 'finwise_mock_'

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
}

const mockApi = {
  getLanding: async () => {
    await delay(120)
    return { ok: true, data: read('landing', {}) }
  },
  getMe: async () => {
    await delay(80)
    const user = read('currentUser', null)
    if (user) return { ok: true, user }
    return { ok: false, user: null }
  },
  login: async ({ email }) => {
    await delay(120)
    const users = read('users', [])
    let u = users.find(x => x.email === email)
    if (!u) {
      u = { id: 'u_' + Date.now(), email, roles: [] }
      users.push(u); write('users', users)
    }
    write('currentUser', u)
    return { ok: true, user: u }
  },
  logout: async () => { await delay(40); write('currentUser', null); return { ok: true } },
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
    const answer = `Echo (demo): ${query}.\n\nThis is a frontend-only placeholder response.`
    const chats = read('chats', [])
    const rec = { _id: 'c_' + Date.now(), query, answer, createdAt: new Date().toISOString() }
    chats.unshift(rec); write('chats', chats)
    return { ok: true, chat: rec }
  },
  getUsers: async () => { await delay(80); return { ok: true, users: read('users', []) } },
  getChats: async () => { await delay(80); return { ok: true, chats: read('chats', []) } },
  getSettings: async (key) => { await delay(60); const s = read('settings', {}); return { ok: true, value: s[key] } },
  setSetting: async (key, value) => { await delay(60); const s = read('settings', {}); s[key] = value; write('settings', s); return { ok: true } },
  promoteUser: async (id) => {
    await delay(80)
    const users = read('users', [])
    const u = users.find(x => x.id === id || x._id === id)
    if (u) { u.roles = Array.from(new Set([...(u.roles||[]), 'admin'])); write('users', users); return { ok: true, user: u } }
    return { ok: false }
  },
  demoteUser: async (id) => {
    await delay(80)
    const users = read('users', [])
    const u = users.find(x => x.id === id || x._id === id)
    if (u) { u.roles = (u.roles||[]).filter(r => r !== 'admin'); write('users', users); return { ok: true, user: u } }
    return { ok: false }
  },
  deleteUser: async (id) => {
    await delay(80)
    let users = read('users', [])
    users = users.filter(x => x.id !== id && x._id !== id)
    write('users', users)
    return { ok: true }
  },
  deleteChat: async (id) => { await delay(60); let chats = read('chats', []); chats = chats.filter(c => c._id !== id); write('chats', chats); return { ok: true } },
  deleteSetting: async (key) => { await delay(40); const s = read('settings', {}); delete s[key]; write('settings', s); return { ok: true } },
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

export default mockApi
