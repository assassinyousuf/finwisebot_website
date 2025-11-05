import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import mockApi from '../../lib/mockApi'

export default function ConfirmReset(){
  const router = useRouter()
  const { token } = router.query || {}
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [manualToken, setManualToken] = useState('')
  const [tokenInfo, setTokenInfo] = useState(null)

  useEffect(()=>{
    if (token && typeof token === 'string') {
      setMessage('')
      setManualToken(token)
    }
  }, [token])

  // verify token when manualToken changes
  useEffect(()=>{
    let mounted = true
    async function verify(){
      if (!manualToken) { setTokenInfo(null); return }
      try {
        const r = await mockApi.verifyResetToken(manualToken)
        if (!mounted) return
        if (!r || !r.ok) {
          setTokenInfo({ valid: false })
        } else {
          setTokenInfo({ valid: true, email: r.email, expiresAt: r.expiresAt, expired: !!r.expired })
        }
      } catch (e) {
        if (mounted) setTokenInfo({ valid: false })
      }
    }
    verify()
    return ()=>{ mounted = false }
  }, [manualToken])

  async function submit(e){
    e.preventDefault()
    setMessage('')
    if (newPassword !== confirm) { setMessage('Passwords do not match'); return }
    setLoading(true)
    try {
      const useToken = (manualToken && typeof manualToken === 'string') ? manualToken : token
      if (!useToken) { setMessage('Missing reset token'); setLoading(false); return }
      const res = await mockApi.resetPassword(useToken, newPassword)
      if (!res || !res.ok) { setMessage('Reset failed: ' + (res && res.error ? res.error : 'unknown')); setLoading(false); return }
      setMessage('Password reset — you are now logged in (demo)')
      setTimeout(()=>router.push('/'), 800)
    } catch (err) { setMessage(String(err)) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md p-8 bg-white/5 rounded-2xl">
        <h2 className="text-2xl font-bold mb-2">Set a new password</h2>
        <p className="text-sm text-white/70 mb-4">Enter a new password to complete the reset.</p>
        <form onSubmit={submit} className="space-y-3">
          <label className="text-xs text-muted">Reset token</label>
          <input className="input w-full" placeholder="Paste reset token" value={manualToken} onChange={e=>setManualToken(e.target.value)} />

          {tokenInfo && tokenInfo.valid && (
            <div className="text-sm muted-sm">Token for: <span className="font-mono">{tokenInfo.email}</span>{tokenInfo.expiresAt && <span> — expires {new Date(tokenInfo.expiresAt).toLocaleString()}</span>}{tokenInfo.expired && <span className="text-red-400"> — expired</span>}</div>
          )}

          <label className="text-xs text-muted">New password</label>
          <input className="input w-full" placeholder="New password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} type="password" required />
          <input className="input w-full" placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} type="password" required />
          <div className="flex gap-2">
            <button className="cta-primary" disabled={loading || !manualToken || (tokenInfo && tokenInfo.expired)}>{loading ? 'Resetting…' : 'Reset password'}</button>
            <button type="button" className="cta-ghost" onClick={()=>router.push('/')}>Cancel</button>
          </div>
        </form>
        {message && <div className="mt-3 text-sm">{message}</div>}
      </div>
    </div>
  )
}
