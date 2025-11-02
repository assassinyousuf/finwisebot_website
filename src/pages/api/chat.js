import dbConnect from '../../lib/mongoose'
import Chat from '../../models/Chat'
import Setting from '../../models/Setting'
import { decrypt } from '../../lib/secure'
import { getAccessTokenFromServiceAccountJson } from '../../lib/googleAuth'
import cookie from 'cookie'
import { verifyToken } from '../../lib/jwt'
import User from '../../models/User'

async function callGemini(apiKey, prompt) {
  // Use Vertex Generative Language endpoint.
  const model = process.env.GEMINI_MODEL || 'models/text-bison-001'
  const baseUrl = `https://generativelanguage.googleapis.com/v1beta2/${model}:generateText`
  const body = { prompt: { text: prompt }, temperature: 0.2, maxOutputTokens: 512 }

  // Prefer service-account flow if configured via env
  const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || null
  let headers = { 'Content-Type': 'application/json' }
  let url = baseUrl
  let usedAuth = null

  if (saJson) {
    const token = await getAccessTokenFromServiceAccountJson(saJson)
    if (token) {
      headers.Authorization = `Bearer ${token}`
      usedAuth = 'service_account'
    }
  }
  if (!usedAuth && apiKey) {
    // fallback to API key query param
    url = `${baseUrl}?key=${encodeURIComponent(apiKey)}`
    usedAuth = 'api_key'
  }
  if (!usedAuth) {
    throw new Error('No API key or service-account configured')
  }

  try {
    const resp = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
    const status = resp.status
    const txt = await resp.text()
    let json = null
    try { json = JSON.parse(txt) } catch (e) { json = txt }
    if (!resp.ok) {
      const err = new Error(`Gemini API error: ${status} ${txt}`)
      err.status = status
      err.raw = json
      throw err
    }
    // The Vertex response usually includes candidates with `output` or `content` depending on version
    const candidate = (json && json.candidates && json.candidates[0]) || null
    const output = candidate?.output || candidate?.content || json?.content || json?.text || JSON.stringify(json)
    const meta = { provider: 'google-vertex', model, url, auth: usedAuth, status, raw: json }
    return { output: String(output), meta }
  } catch (err) {
    const msg = String(err || '')
    // If the error looks like insufficient scopes, attempt a fully-qualified model path using project id
    if (msg.includes('insufficient authentication scopes') || msg.includes('ACCESS_TOKEN_SCOPE_INSUFFICIENT') || msg.includes('insufficient')) {
      try {
        let keyObj = null
        try {
          keyObj = typeof saJson === 'string' ? JSON.parse(saJson) : saJson
        } catch (e) {
          try { keyObj = JSON.parse(Buffer.from(String(saJson), 'base64').toString('utf8')) } catch (e2) { keyObj = null }
        }
        const project = (keyObj && keyObj.project_id) || process.env.GOOGLE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT
        if (project) {
          const modelEnv = process.env.GEMINI_MODEL || 'models/text-bison-001'
          const modelShort = modelEnv.includes('/') ? modelEnv.split('/').pop() : modelEnv
          const altUrl = `https://generativelanguage.googleapis.com/v1beta2/projects/${project}/locations/us-central1/models/${modelShort}:generateText`
          const token = headers.Authorization ? headers.Authorization.replace(/^Bearer\s+/, '') : null
          if (!token) throw err
          const altResp = await fetch(altUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) })
          const status2 = altResp.status
          const txt2 = await altResp.text()
          let json2 = null
          try { json2 = JSON.parse(txt2) } catch (e) { json2 = txt2 }
          if (!altResp.ok) {
            const err2 = new Error(`Gemini alt API error: ${status2} ${txt2}`)
            err2.status = status2
            err2.raw = json2
            throw err2
          }
          const candidate2 = (json2 && json2.candidates && json2.candidates[0]) || null
          const output2 = candidate2?.output || candidate2?.content || json2?.content || json2?.text || JSON.stringify(json2)
          const meta2 = { provider: 'google-vertex', model: model, url: altUrl, auth: 'service_account', status: status2, raw: json2 }
          return { output: String(output2), meta: meta2 }
        }
      } catch (err2) {
        console.error('alt model path attempt failed', err2)
      }
    }
    throw err
  }
}

async function callGeminiWithApiKey(apiKey, prompt) {
  const model = process.env.GEMINI_MODEL || 'models/text-bison-001'
  const baseUrl = `https://generativelanguage.googleapis.com/v1beta2/${model}:generateText`
  const url = `${baseUrl}?key=${encodeURIComponent(apiKey)}`
  const body = { prompt: { text: prompt }, temperature: 0.2, maxOutputTokens: 512 }
  const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const status = resp.status
  const txt = await resp.text()
  let json = null
  try { json = JSON.parse(txt) } catch (e) { json = txt }
  if (!resp.ok) {
    const err = new Error(`Gemini API (API key) error: ${status} ${txt}`)
    err.status = status
    err.raw = json
    throw err
  }
  const candidate = (json && json.candidates && json.candidates[0]) || null
  const output = candidate?.output || candidate?.content || json?.content || json?.text || JSON.stringify(json)
  const meta = { provider: 'google-vertex', model: model, url, auth: 'api_key', status, raw: json }
  return { output: String(output), meta }
}

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'POST') {
    const { query, email: bodyEmail, meta } = req.body || {}

    // attempt to associate this chat with an authenticated user (if present)
    let email = bodyEmail || null
    let userId = null
    try {
      const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {}
      const token = cookies.finwise_token
      if (token) {
        const payload = verifyToken(token)
        if (payload && payload.sub) {
          const u = await User.findById(payload.sub).select('email')
          if (u) {
            email = email || u.email
            userId = u._id
          }
        }
      }
    } catch (err) {
      console.error('failed to resolve user from cookie for chat:', err)
    }

    // Try to read stored API key from Settings (chat_api_key)
    let answer = null
    let llmMeta = null
    try {
      const s = await Setting.findOne({ key: 'chat_api_key' })
      const apiKey = s ? decrypt(s.value) : (process.env.GEMINI_API_KEY || '')
      if (apiKey) {
        try {
          const result = await callGemini(apiKey, query)
          if (result && result.output) {
            answer = result.output
            llmMeta = result.meta
          }
        } catch (err) {
          // Log full error for debugging (including body/status returned from Vertex)
          console.error('gemini call failed', err)
          // attempt API-key only path as a fallback
          try {
            const result2 = await callGeminiWithApiKey(apiKey, query)
            if (result2 && result2.output) {
              answer = result2.output
              llmMeta = llmMeta || result2.meta
            }
          } catch (err2) {
            console.error('gemini (api key) fallback failed', err2)
          }
        }
      }
    } catch (err) {
      console.error('failed to read setting for chat_api_key', err)
    }

    if (!answer) {
      answer = `You asked: "${query}". (FinWisebot response placeholder)`
    }

    try {
      const doc = { query, answer, email, meta: meta || {} }
      if (userId) doc.user = userId
      if (llmMeta) doc.llm = llmMeta
      await Chat.create(doc)
    } catch (err) {
      console.error('chat save error', err)
      // continue to return answer even if save fails
    }

    return res.status(200).json({ answer })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
