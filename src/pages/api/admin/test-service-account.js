import dbConnect from '../../../lib/mongoose'
import requireAdmin from '../../../lib/adminAuth'
import fs from 'fs'
import path from 'path'
import { JWT } from 'google-auth-library'

export default async function handler(req, res) {
  await dbConnect()
  const allowUnsecured = process.env.NODE_ENV !== 'production'
  if (!allowUnsecured) {
    const admin = await requireAdmin(req, res)
    if (!admin) return
  }

  // Load the raw service-account JSON from environment or path
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || null
  let saRaw = raw
  if (!saRaw && process.env.GOOGLE_SERVICE_ACCOUNT_PATH) {
    try {
      const resolved = path.isAbsolute(process.env.GOOGLE_SERVICE_ACCOUNT_PATH) ? process.env.GOOGLE_SERVICE_ACCOUNT_PATH : path.resolve(process.cwd(), process.env.GOOGLE_SERVICE_ACCOUNT_PATH)
      saRaw = fs.readFileSync(resolved, 'utf8')
    } catch (err) {
      console.error('Failed to read service account file', err.message)
    }
  }

  if (!saRaw) return res.status(400).json({ ok: false, error: 'No service account configured or failed to read it' })

  // Parse JSON (handle base64 encoded string)
  let key
  try {
    key = JSON.parse(saRaw)
  } catch (e) {
    try {
      key = JSON.parse(Buffer.from(String(saRaw), 'base64').toString('utf8'))
    } catch (e2) {
      console.error('Invalid service account JSON')
      return res.status(400).json({ ok: false, error: 'Invalid service account JSON' })
    }
  }

  // Create a fresh JWT client (do not use cached helper) to force a new token
  try {
    const client = new JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    })
    const authRes = await client.authorize()
    const token = authRes?.access_token
    if (!token) return res.status(400).json({ ok: false, error: 'Failed to obtain access token' })

    // Try a lightweight Vertex request to validate the token
    const model = process.env.GEMINI_MODEL || 'models/text-bison-001'
    const url = `https://generativelanguage.googleapis.com/v1beta2/${model}:generateText`
    const body = { prompt: { text: 'hello' }, temperature: 0.2, maxOutputTokens: 16 }
  const infoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`)
  const infoText = await infoRes.text()
  let infoJson = null
  try { infoJson = JSON.parse(infoText) } catch (e) { infoJson = { raw: infoText } }

  // Include x-goog-user-project header (billing project) in case the API requires an explicit user project
  const userProject = key.project_id || process.env.GOOGLE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
  if (userProject) headers['x-goog-user-project'] = userProject
  const resp = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
  const text = await resp.text()
  if (!resp.ok) return res.status(400).json({ ok: false, status: resp.status, body: text, tokeninfo: infoJson })
  return res.status(200).json({ ok: true, status: resp.status, body: text, tokeninfo: infoJson })
  } catch (err) {
    console.error('test service account error', err)
    return res.status(500).json({ ok: false, error: String(err) })
  }
}
