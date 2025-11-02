import dbConnect from '../../../lib/mongoose'
import requireAdmin from '../../../lib/adminAuth'
import Setting from '../../../models/Setting'
import { encrypt, decrypt } from '../../../lib/secure'

async function validateKeyWithVertex(apiKey) {
  if (!apiKey) return { ok: false, error: 'No key provided' }
  const model = process.env.GEMINI_MODEL || 'models/text-bison-001'
  const url = `https://generativelanguage.googleapis.com/v1beta2/${model}:generateText?key=${encodeURIComponent(apiKey)}`
  const body = { prompt: { text: 'hello' }, temperature: 0.2, maxOutputTokens: 16 }
  try {
    const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const text = await resp.text()
    if (!resp.ok) return { ok: false, status: resp.status, body: text }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}

export default async function handler(req, res) {
  await dbConnect()
  // authenticate admin (skip in development to provide an unsecured admin panel)
  const allowUnsecured = process.env.NODE_ENV !== 'production'
  if (!allowUnsecured) {
    const admin = await requireAdmin(req, res)
    if (!admin || admin.ok === false) return // requireAdmin already responded
  }

  if (req.method === 'GET') {
    const key = req.query.key || 'chat_api_key'
    const s = await Setting.findOne({ key })
    const value = s ? decrypt(s.value) : null
    // mask for UI
    const masked = value ? (value.length > 8 ? `${value.slice(0,4)}...${value.slice(-4)}` : '••••••') : null
    return res.status(200).json({ ok: true, key, value: masked, hasValue: !!value })
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    const { key = 'chat_api_key', value } = req.body || {}
    if (typeof value !== 'string') return res.status(400).json({ ok: false, error: 'Missing value in body' })
    // Validate the key before saving to provide immediate feedback to admin
    const validation = await validateKeyWithVertex(value)
    if (!validation.ok) {
      console.warn('API key validation failed', validation)
      return res.status(400).json({ ok: false, error: 'API key validation failed', details: validation })
    }

    const enc = encrypt(value)
    const doc = await Setting.findOneAndUpdate({ key }, { value: enc, updatedAt: new Date() }, { upsert: true, new: true, setDefaultsOnInsert: true })
    return res.status(200).json({ ok: true, key: doc.key })
  }

  if (req.method === 'DELETE') {
    const key = req.query.key || 'chat_api_key'
    await Setting.deleteOne({ key })
    return res.status(200).json({ ok: true })
  }

  res.setHeader('Allow', 'GET,PUT,POST,DELETE')
  res.status(405).json({ ok: false, error: 'Method not allowed' })
}
