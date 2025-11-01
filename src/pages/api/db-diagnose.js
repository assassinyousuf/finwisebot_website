import dbConnect from '../../lib/mongoose'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  // Quick checks
  if (!process.env.MONGODB_URI) {
    return res.status(400).json({ ok: false, error: 'MONGODB_URI not set in environment (.env.local?)' })
  }

  try {
    const conn = await dbConnect()
    // If conn is null, the connector intentionally returned null (shouldn't happen if URI set)
    if (!conn) return res.status(500).json({ ok: false, error: 'dbConnect returned null' })
    return res.status(200).json({ ok: true, message: 'Connected', state: conn.readyState })
  } catch (err) {
    // Only show detailed error in development to avoid leaking info in production
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ ok: false, error: err.message, stack: err.stack })
    }
    return res.status(500).json({ ok: false, error: 'Unable to connect to MongoDB' })
  }
}
