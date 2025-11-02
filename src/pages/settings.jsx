import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [apiKeyMasked, setApiKeyMasked] = useState(null)
  const [editing, setEditing] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    let mounted = true
    async function load(){
      try {
        const [uRes, sRes] = await Promise.all([
          fetch('/api/me', { credentials: 'include' }),
          fetch('/api/admin/settings?key=chat_api_key', { credentials: 'include' })
        ])
        // require auth: redirect to login if not authenticated
        if (!uRes.ok) {
          window.location.href = '/login'
          return
        }
        const j = await uRes.json()
        if (!j || !j.ok) { window.location.href = '/login'; return }
        if (mounted) setUser(j.user)
        
        if (sRes.ok) {
          const sj = await sRes.json()
          if (sj && sj.ok) setApiKeyMasked(sj.value || null)
        }
      } catch (e) {
        console.warn('settings load', e)
      } finally { if (mounted) setLoading(false) }
    }
    load()
    return ()=>{ mounted = false }
  }, [])

  async function saveKey() {
    if (!editing) return alert('Paste a key first')
    if (!confirm('Save this API key?')) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ key: 'chat_api_key', value: editing }) })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Failed')
      alert('Saved. Key validated and stored encrypted.')
      const s = await (await fetch('/api/admin/settings?key=chat_api_key', { credentials: 'include' })).json()
      setApiKeyMasked(s.value || null)
      setEditing('')
    } catch (e) {
      alert('Failed to save key: ' + (e.message||e))
    } finally { setSaving(false) }
  }

  async function clearKey(){
    if (!confirm('Clear stored key?')) return
    await fetch('/api/admin/settings?key=chat_api_key', { method: 'DELETE', credentials: 'include' })
    setApiKeyMasked(null)
    alert('Cleared')
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading">Settings</h1>
        <div className="flex gap-3">
          <Link href="/" className="text-sm text-white/80">Home</Link>
          <Link href="/reports" className="text-sm text-white/80">Reports</Link>
        </div>
      </div>

      <div className="grid-cards">
        <div className="card">
          <h2 className="text-lg font-semibold">Profile</h2>
          {loading ? <div className="muted-sm">Loading…</div> : (
            user ? (
              <div className="mt-3">
                <div className="muted-sm">Signed in as</div>
                <div className="mt-1 font-mono">{user.email}</div>
                <div className="mt-3 muted-sm">Roles: {user.roles && user.roles.length ? user.roles.join(', ') : 'user'}</div>
              </div>
            ) : (
              <div className="muted-sm">Not signed in. <Link href="/login" className="text-white/90">Sign in</Link></div>
            )
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold">AI / LLM</h2>
          <div className="mt-3">
            <div className="muted-sm">Stored API key</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="font-mono badge-soft">{apiKeyMasked || '— not set —'}</div>
            </div>

            <div className="mt-4">
              <input className="input w-full font-mono" placeholder="Paste API key here (will be validated)" value={editing} onChange={e=>setEditing(e.target.value)} />
              <div className="mt-3 flex gap-2">
                <button className="btn-cta" onClick={saveKey} disabled={saving}>{saving ? 'Saving…' : 'Save key'}</button>
                <button className="px-3 py-2 bg-red-600 text-white rounded" onClick={clearKey}>Clear</button>
              </div>
              <div className="mt-2 muted-sm">This key is validated against the Generative Language API before saving. Keys are stored encrypted.</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <div className="mt-3 space-y-2">
            <button className="px-3 py-2 bg-yellow-500 text-black rounded" onClick={async()=>{ if(confirm('Sign out?')) { await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ action: 'logout' }) }); window.location.href='/' } }}>Sign out</button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={async()=>{ alert('Run diagnostics from admin panel (dev only)') }}>Run diagnostics</button>
          </div>
        </div>
      </div>
    </div>
  )
}
