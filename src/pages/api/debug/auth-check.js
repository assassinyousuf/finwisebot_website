import cookie from 'cookie'
import { verifyToken } from '../../../lib/jwt'
import dbConnect from '../../../lib/mongoose'

// Dev-only debug endpoint to inspect incoming cookies and JWT payload.
export default async function handler(req, res) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ ok: false, error: 'Forbidden in production' })
  }

  await dbConnect()
  const rawCookies = req.headers.cookie || ''
  const parsed = rawCookies ? cookie.parse(rawCookies) : {}
  const token = parsed.finwise_token || null
  const payload = token ? verifyToken(token) : null

  // Mask token for safety in logs (dev only)
  const maskedToken = token ? `${token.slice(0,6)}...${token.slice(-6)}` : null

  return res.status(200).json({
    ok: true,
    headers: { cookie: rawCookies },
    cookies: parsed,
    tokenPresent: !!token,
    token: maskedToken,
    payload,
  })
}
