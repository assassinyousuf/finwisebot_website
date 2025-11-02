import crypto from 'crypto'

const ALGO = 'aes-256-gcm'
const ENC_KEY = process.env.SETTINGS_ENCRYPTION_KEY || '' // should be 32 bytes base64 or raw

function hasKey() {
  return !!ENC_KEY && ENC_KEY.length >= 32
}

function getKeyBuffer() {
  // If user provided base64, decode, otherwise use raw string (utf-8)
  try {
    return Buffer.from(ENC_KEY, 'base64')
  } catch (e) {
    return Buffer.from(ENC_KEY)
  }
}

export function encrypt(plaintext) {
  if (!plaintext) return ''
  if (!hasKey()) {
    // No encryption key configured; store plaintext (warn)
    console.warn('SETTINGS_ENCRYPTION_KEY not set — storing settings in plaintext')
    return plaintext
  }
  const iv = crypto.randomBytes(12)
  const key = getKeyBuffer().slice(0, 32)
  const cipher = crypto.createCipheriv(ALGO, key, iv)
  const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  // store as iv:tag:cipher (base64)
  return `${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`
}

export function decrypt(payload) {
  if (!payload) return ''
  if (!hasKey()) {
    // If no key configured, assume stored in plaintext
    return payload
  }
  try {
    const [ivB, tagB, dataB] = String(payload).split('.')
    if (!ivB || !tagB || !dataB) return payload
    const iv = Buffer.from(ivB, 'base64')
    const tag = Buffer.from(tagB, 'base64')
    const data = Buffer.from(dataB, 'base64')
    const key = getKeyBuffer().slice(0, 32)
    const decipher = crypto.createDecipheriv(ALGO, key, iv)
    decipher.setAuthTag(tag)
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()])
    return decrypted.toString('utf8')
  } catch (err) {
    console.warn('Failed to decrypt setting, returning raw payload', err.message)
    return payload
  }
}

export default { encrypt, decrypt }
