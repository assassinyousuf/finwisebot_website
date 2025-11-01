import dbConnect from '../../../lib/mongoose'
import Chat from '../../../models/Chat'
import { requireAdmin } from '../../../lib/adminAuth'

export default async function handler(req, res) {
  await dbConnect()

  const admin = await requireAdmin(req, res)
  if (!admin || admin.ok === false) return

  try {
    if (req.method === 'GET') {
      const chats = await Chat.find().sort({ createdAt: -1 }).lean()
      return res.status(200).json({ ok: true, chats })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ ok: false, error: 'id required' })
      await Chat.findByIdAndDelete(id)
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  } catch (err) {
    console.error('admin/chats error', err)
    return res.status(500).json({ ok: false, error: 'Internal server error' })
  }
}
