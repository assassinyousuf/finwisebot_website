#!/usr/bin/env node
/*
  prints access token and tokeninfo for the configured service account
  - loads .env.local via dotenv (if present)
  - reads GOOGLE_SERVICE_ACCOUNT_JSON (base64 or raw JSON) or GOOGLE_SERVICE_ACCOUNT_PATH
  - uses google-auth-library JWT to fetch an access token
  - calls https://oauth2.googleapis.com/tokeninfo?access_token=...
*/

const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })
const { JWT } = require('google-auth-library')

function loadSaRaw() {
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

async function main() {
  const raw = loadSaRaw()
  if (!raw) {
    console.error('No GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_SERVICE_ACCOUNT_PATH found in env or .env.local')
    process.exitCode = 2
    return
  }

  let key
  try {
    key = JSON.parse(raw)
  } catch (e) {
    // try base64 decode
    try {
      const decoded = Buffer.from(String(raw), 'base64').toString('utf8')
      key = JSON.parse(decoded)
    } catch (e2) {
      console.error('Failed to parse service account JSON (raw or base64)')
      console.error(e2 || e)
      process.exitCode = 3
      return
    }
  }

  const client = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  })

  try {
    const res = await client.authorize()
    const token = res?.access_token
    const expiry = res?.expiry_date
    console.log('Access token obtained (truncated):', token ? token.slice(0, 32) + '...' : 'NONE')
    console.log('Expiry:', expiry ? new Date(expiry).toISOString() : 'unknown')

    if (!token) {
      console.error('No access token returned')
      process.exitCode = 4
      return
    }

    const infoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`)
    const infoText = await infoRes.text()
    console.log('tokeninfo status:', infoRes.status)
    try {
      const info = JSON.parse(infoText)
      console.log('tokeninfo:', JSON.stringify(info, null, 2))
    } catch (e) {
      console.log('tokeninfo response (raw):', infoText)
    }
  } catch (err) {
    console.error('Error obtaining token or tokeninfo', err)
    process.exitCode = 5
  }
}

main()
