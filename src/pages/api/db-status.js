import dbConnect from '../../lib/mongoose'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const conn = await dbConnect()
    // mongoose.connection.readyState: 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
    const state = mongoose.connection?.readyState ?? (conn ? 1 : 0)
    const connected = state === 1
    return res.status(200).json({ connected, state })
  } catch (err) {
    console.error('db-status error', err)
    return res.status(500).json({ connected: false, error: err.message })
  }
}
