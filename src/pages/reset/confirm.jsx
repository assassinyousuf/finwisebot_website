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

  useEffect(()=>{
    if (token && typeof token === 'string') {
      setMessage('')
    }
  }, [token])

  async function submit(e){
    e.preventDefault()
    setMessage('')
    if (newPassword !== confirm) { setMessage('Passwords do not match'); return }
    setLoading(true)
    try {
      // frontend-only: simulate reset success
      await mockApi.login({ email: 'user@local' })
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
          <input className="input w-full" placeholder="New password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} type="password" required />
          <input className="input w-full" placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} type="password" required />
          <div className="flex gap-2">
            <button className="cta-primary" disabled={loading || !token}>{loading ? 'Resetting…' : 'Reset password'}</button>
            <button type="button" className="cta-ghost" onClick={()=>router.push('/')}>Cancel</button>
          </div>
        </form>
        {message && <div className="mt-3 text-sm">{message}</div>}
      </div>
    </div>
  )
}
