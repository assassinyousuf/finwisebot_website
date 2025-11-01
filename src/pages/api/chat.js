import dbConnect from '../../lib/mongoose'
import Chat from '../../models/Chat'

export default async function handler(req, res) {
  await dbConnect()
  if (req.method === 'POST') {
    const { query, email, meta } = req.body || {}

    // Generate a placeholder answer for now
    const answer = `You asked: "${query}". (FinWisebot response placeholder)`

    try {
      await Chat.create({ query, answer, email, meta })
    } catch (err) {
      console.error('chat save error', err)
      // continue to return answer even if save fails
    }

    res.status(200).json({ answer })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
