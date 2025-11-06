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

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  // Check localStorage for current user
  const currentUser = read('currentUser', null)
  if (!currentUser) {
    return res.status(401).json({ ok: false, error: 'Not authenticated' })
  }

  return res.status(200).json({ ok: true, user: currentUser })
}
