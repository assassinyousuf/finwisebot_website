#!/usr/bin/env node
/**
 * scripts/save-api-key.js
 * Usage:
 *   node scripts/save-api-key.js            # prompts for key
 *   node scripts/save-api-key.js --key ABC   # use CLI arg
 *   node scripts/save-api-key.js --validate  # validate the key against Vertex before saving
 */
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })
const readline = require('readline')
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env.local')
  process.exit(1)
}

function getArg(name) {
  const idx = process.argv.indexOf(name)
  if (idx === -1) return null
  return process.argv[idx + 1] || null
}

async function promptForKey() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question('Paste Google API key: ', (ans) => { rl.close(); resolve(ans.trim()) })
  })
}

function hasEncKey() {
  const ENC_KEY = process.env.SETTINGS_ENCRYPTION_KEY || ''
  return !!ENC_KEY && ENC_KEY.length >= 32
}

function getKeyBuffer() {
  const ENC_KEY = process.env.SETTINGS_ENCRYPTION_KEY || ''
  try { return Buffer.from(ENC_KEY, 'base64') } catch (e) { return Buffer.from(ENC_KEY) }
}

function encrypt(plaintext) {
  if (!plaintext) return ''
  if (!hasEncKey()) {
    console.warn('SETTINGS_ENCRYPTION_KEY not set — saving key in plaintext')
    return plaintext
  }
  const crypto = require('crypto')
  const ALGO = 'aes-256-gcm'
  const iv = crypto.randomBytes(12)
  const key = getKeyBuffer().slice(0, 32)
  const cipher = crypto.createCipheriv(ALGO, key, iv)
  const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`
}

async function validateKey(apiKey) {
  // minimal validation using Vertex REST generateText
  const model = process.env.GEMINI_MODEL || 'models/text-bison-001'
  const url = `https://generativelanguage.googleapis.com/v1beta2/${model}:generateText?key=${encodeURIComponent(apiKey)}`
  const body = { prompt: { text: 'Say hello' }, temperature: 0.2, maxOutputTokens: 16 }
  try {
    const fetchFn = global.fetch || require('node-fetch')
    const resp = await fetchFn(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const text = await resp.text()
    if (!resp.ok) {
      return { ok: false, status: resp.status, body: text }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}

async function main() {
  const argKey = getArg('--key') || getArg('-k')
  const doValidate = process.argv.includes('--validate') || process.argv.includes('-v')
  const key = argKey || (await promptForKey())
  if (!key) {
    console.error('No key provided')
    process.exit(1)
  }

  if (doValidate) {
    console.log('Validating key against Vertex...')
    const r = await validateKey(key)
    if (!r.ok) {
      console.error('Validation failed', r)
      process.exit(1)
    }
    console.log('Validation succeeded')
  }

  console.log('Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI, { autoIndex: false })

  const SettingSchema = new mongoose.Schema({ key: String, value: String, updatedAt: Date })
  const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema)
  const enc = encrypt(key)
  await Setting.findOneAndUpdate({ key: 'chat_api_key' }, { value: enc, updatedAt: new Date() }, { upsert: true })
  console.log('Saved `chat_api_key` to Settings collection')
  await mongoose.disconnect()
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
