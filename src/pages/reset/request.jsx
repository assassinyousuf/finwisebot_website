import { useState } from 'react'
import { useRouter } from 'next/router'
import mockApi from '../../lib/mockApi'

export default function RequestReset() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [token, setToken] = useState(null)
  const router = useRouter()

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setToken(null)
    try {
      // frontend-only: generate a demo reset token and show it to the user
      const res = await mockApi.requestPasswordReset(email)
      if (res && res.ok) {
        setToken(res.token)
        setMessage('A demo reset token was generated (displayed below). Use it to complete reset in the next step.')
        setEmail('')
        // attach expiry if provided
        if (res.expiresAt) setMessage(m => m + `\nToken expires at ${new Date(res.expiresAt).toLocaleString()}`)
      } else {
        setMessage('Could not generate reset token (demo error).')
      }
    } catch (err) { setMessage(String(err)) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md p-8 bg-white/5 rounded-2xl">
        <h2 className="text-2xl font-bold mb-2">Reset your password</h2>
        <p className="text-sm text-white/70 mb-4">Enter your email and we'll generate a demo reset token you can use to complete the flow.</p>
        <form onSubmit={submit} className="space-y-3">
          <input className="input w-full" placeholder="you@domain.com" value={email} onChange={e=>setEmail(e.target.value)} required />
          <div className="flex gap-2">
            <button className="cta-primary" disabled={loading}>{loading ? 'Generating…' : 'Generate reset token'}</button>
            <button type="button" className="cta-ghost" onClick={()=>router.push('/')}>Cancel</button>
          </div>
        </form>

        {message && <div className="mt-3 p-2 bg-black/10 rounded whitespace-pre-wrap">{message}</div>}

        {token && (
          <div className="mt-4 p-3 bg-white/5 rounded">
            <div className="text-sm muted-sm">Demo reset token (copy or click to open confirm):</div>
            <div className="mt-2 font-mono p-2 bg-black/10 rounded select-all">{token}</div>
            <div className="mt-3">
              <a className="btn-cta inline-block" href={`/reset/confirm?token=${encodeURIComponent(token)}`}>Open reset confirmation</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
