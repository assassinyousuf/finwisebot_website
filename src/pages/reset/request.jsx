import { useState } from 'react'
import { useRouter } from 'next/router'

export default function RequestReset() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'request_reset', email }) })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Request failed')
      let note = j.message || 'If an account exists, a reset email has been sent.'
      if (j.resetToken) note += `\n(DEV token: ${j.resetToken})`
      setMessage(note)
      setEmail('')
    } catch (err) {
      setMessage(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md p-8 bg-white/5 rounded-2xl">
        <h2 className="text-2xl font-bold mb-2">Reset your password</h2>
        <p className="text-sm text-white/70 mb-4">Enter your email and we'll send a password reset link.</p>
        <form onSubmit={submit} className="space-y-3">
          <input className="input w-full" placeholder="you@domain.com" value={email} onChange={e=>setEmail(e.target.value)} required />
          <div className="flex gap-2">
            <button className="cta-primary" disabled={loading}>{loading ? 'Sending…' : 'Send reset email'}</button>
            <button type="button" className="cta-ghost" onClick={()=>router.push('/')}>Cancel</button>
          </div>
        </form>
        {message && <pre className="mt-3 p-2 bg-black/10 rounded whitespace-pre-wrap">{message}</pre>}
      </div>
    </div>
  )
}
