import { JWT } from 'google-auth-library'
import fs from 'fs'
import path from 'path'

let cached = { token: null, exp: 0 }

function loadServiceAccountJsonFromEnvOrPath() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || null
  if (raw) return raw
  const p = process.env.GOOGLE_SERVICE_ACCOUNT_PATH || null
  if (p) {
    try {
      const resolved = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p)
      return fs.readFileSync(resolved, 'utf8')
    } catch (err) {
      console.error('Failed to read GOOGLE_SERVICE_ACCOUNT_PATH file', err.message)
      return null
    }
  }
  return null
}

export async function getAccessTokenFromServiceAccountJson(jsonOrString) {
  const input = jsonOrString || loadServiceAccountJsonFromEnvOrPath()
  if (!input) return null
  let key
  try {
    key = typeof input === 'string' ? JSON.parse(input) : input
  } catch (e) {
    // maybe it's base64 encoded
    try {
      const raw = Buffer.from(String(input), 'base64').toString('utf8')
      key = JSON.parse(raw)
    } catch (e2) {
      console.error('Invalid service account JSON')
      return null
    }
  }

  const now = Date.now()
  if (cached.token && cached.exp > now + 60_000) return cached.token

  const client = new JWT({
    email: key.client_email,
    key: key.private_key,
    // Request cloud-platform plus generative-language (if available) to ensure sufficient scopes
    scopes: [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/generative-language'
    ],
  })

  const res = await client.authorize()
  const token = res?.access_token || null
  const exp = res?.expiry_date || (now + 3600 * 1000)
  cached = { token, exp }
  return token
}

export default { getAccessTokenFromServiceAccountJson }
