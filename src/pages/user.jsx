import { useEffect, useState } from 'react'
import mockApi from '../lib/mockApi'
import Link from 'next/link'

export default function UserPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [chatsCount, setChatsCount] = useState(0)
  const [predsCount, setPredsCount] = useState(0)
  const [lastActive, setLastActive] = useState(null)
  const [showChange, setShowChange] = useState(false)
  const [recentChats, setRecentChats] = useState([])
  const [editingProfile, setEditingProfile] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarError, setAvatarError] = useState('')

  // change password state
  const [curPwd, setCurPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')
  const [pwdSaving, setPwdSaving] = useState(false)

  useEffect(()=>{
    let mounted = true
    async function load(){
      try {
        const j = await mockApi.getMe()
        if (!j || !j.ok) { window.location.href = '/login'; return }
        // fetch some lightweight user stats for the info box
        const [cJ, pJ] = await Promise.all([mockApi.getChats().catch(()=>({ok:false, chats:[] })), mockApi.getPredictions().catch(()=>({ ok:false, docs: [] }))])
        if (mounted) {
          setUser(j.user)
          setDisplayName(j.user && (j.user.displayName || ''))
          setAvatarPreview(j.user && j.user.avatar ? j.user.avatar : null)
          const admin = j.user && Array.isArray(j.user.roles) && j.user.roles.includes('admin')
          setIsAdmin(!!admin)
          setChatsCount(cJ && cJ.ok && Array.isArray(cJ.chats) ? cJ.chats.length : 0)
          setPredsCount(pJ && pJ.ok && Array.isArray(pJ.docs) ? pJ.docs.length : 0)
          // derive last active from latest chat
          if (cJ && cJ.ok && Array.isArray(cJ.chats) && cJ.chats.length) {
            const last = cJ.chats[0]
            setLastActive(last.createdAt ? new Date(last.createdAt).toLocaleString() : null)
            setRecentChats(cJ.chats.slice(0,3))
          }
        }
      } catch (e) { console.warn('user load', e) } finally { if (mounted) setLoading(false) }
    }
    load()
    return ()=>{ mounted = false }
  }, [])

  function inferJoined(u) {
    if (!u) return ''
    if (u.id && u.id.startsWith('u_')) {
      const ts = parseInt(u.id.slice(2))
      if (!isNaN(ts)) return new Date(ts).toLocaleDateString()
    }
    return ''
  }

  async function handleChangePassword(e){
    e.preventDefault()
    setPwdMsg('')
    if (!newPwd || newPwd !== confirmPwd) { setPwdMsg('New passwords do not match'); return }
    if (newPwd.length < 8) { setPwdMsg('Password must be at least 8 characters'); return }
    setPwdSaving(true)
    try {
      const id = user && (user.id || user._id || user.email)
      const res = await mockApi.changePassword(id, curPwd, newPwd)
      if (!res || !res.ok) {
        setPwdMsg('Failed to change password: ' + (res && res.error ? res.error : 'unknown'))
      } else {
        setPwdMsg('Password changed (demo)')
        setCurPwd(''); setNewPwd(''); setConfirmPwd('')
      }
    } catch (err) {
      setPwdMsg('Error: ' + (err.message || err))
    } finally { setPwdSaving(false) }
  }

  // profile save
  async function saveProfile(e) {
    e && e.preventDefault && e.preventDefault()
    try {
      const id = user && (user.id || user._id || user.email)
      const res = await mockApi.updateProfile(id, { displayName: displayName || '', avatar: avatarPreview || null })
      if (res && res.ok) {
        setUser(res.user)
        setEditingProfile(false)
      } else {
        alert('Failed to save profile (demo)')
      }
    } catch (err) {
      alert('Error: ' + (err && err.message ? err.message : err))
    }
  }

  function onAvatarChange(e) {
    setAvatarError('')
    const f = e.target.files && e.target.files[0]
    if (!f) return

    // Validation: max size 2MB, allowed image types
    const maxBytes = 2 * 1024 * 1024 // 2MB
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (f.size > maxBytes) {
      setAvatarError('File is too large — please use an image under 2 MB.')
      return
    }
    if (!allowed.includes(f.type)) {
      setAvatarError('Unsupported image type. Use PNG, JPG or WebP.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(String(reader.result))
      setAvatarError('')
    }
    reader.readAsDataURL(f)
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading">User</h1>
        <div className="flex gap-3">
          <Link href="/" className="text-sm text-white/80">Home</Link>
          <Link href="/reports" className="text-sm text-white/80">Reports</Link>
        </div>
      </div>

      <div className="grid-cards">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-black font-bold text-2xl">{user && user.email ? user.email[0].toUpperCase() : 'U'}</div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{user ? (user.email.split('@')[0]) : 'User'}</h2>
              <div className="muted-sm">{user ? user.email : ''}</div>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold">{chatsCount}</div>
                  <div className="muted-sm">Chats</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{predsCount}</div>
                  <div className="muted-sm">Predictions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{user && (user.roles && user.roles.length ? user.roles.join(', ') : 'user')}</div>
                  <div className="muted-sm">Role(s)</div>
                </div>
              </div>
              <div className="mt-3 text-xs muted-sm">ID: <span className="font-mono">{user && (user.id || user._id || '—')}</span></div>
              {lastActive && <div className="text-xs muted-sm mt-1">Last activity: {lastActive}</div>}
            </div>
          </div>
        </div>

        {/* More information box */}
        <div className="card">
          <h3 className="text-lg font-semibold">Account details</h3>
          {loading ? <div className="muted-sm mt-3">Loading…</div> : (
            <div className="mt-3 text-sm space-y-2">
              <div><strong>Joined:</strong> {inferJoined(user) || '—'}</div>
              <div><strong>Email:</strong> {user ? user.email : '—'}</div>
              <div><strong>Member type:</strong> {user && user.roles && user.roles.includes('admin') ? 'Administrator' : 'Standard'}</div>
              <div><strong>Local storage key:</strong> <span className="font-mono">finwise_mock_currentUser</span></div>
                    <div className="muted-sm">This page shows local/demo-only account info stored in the browser.</div>
                    <div className="mt-2">
                      <button onClick={()=>setEditingProfile(true)} className="px-3 py-1 bg-white/5 rounded text-sm">Edit profile</button>
                    </div>
            </div>
          )}
        </div>

              <div
                className={`card overflow-hidden transition-all duration-300 ${editingProfile ? 'max-h-[800px] opacity-100 scale-100 pointer-events-auto' : 'max-h-0 opacity-0 scale-95 pointer-events-none'}`}
                style={{ gridColumn: 'span 2' }}
                aria-hidden={!editingProfile}
              >
                <h3 className="text-lg font-semibold">Edit profile</h3>
                <form onSubmit={saveProfile} className="mt-3 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/5 flex items-center justify-center">
                      {avatarPreview ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover"/> : <div className="font-bold text-2xl">{user && user.email ? user.email[0].toUpperCase() : 'U'}</div>}
                    </div>
                    <div className="flex-1">
                      <input className="input" placeholder="Display name" value={displayName} onChange={e=>setDisplayName(e.target.value)} />
                      <div className="mt-2">
                        <input type="file" accept="image/*" onChange={onAvatarChange} />
                        {avatarError && <div className="text-sm text-red-400 mt-2">{avatarError}</div>}
                        <div className="text-xs muted-sm mt-1">Accepted: PNG, JPG, WebP. Max: 2 MB.</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-cta" disabled={!!avatarError}>Save profile</button>
                    <button type="button" className="cta-ghost" onClick={()=>{ setEditingProfile(false); setDisplayName(user && user.displayName ? user.displayName : ''); setAvatarPreview(user && user.avatar ? user.avatar : null) }}>Cancel</button>
                  </div>
                </form>
              </div>

        {/* Compact change password card */}
        <div className="card">
          <h3 className="text-lg font-semibold">Security</h3>
          <div className="mt-3">
            {loading ? <div className="muted-sm">Loading…</div> : (
              user ? (
                <>
                  {!showChange ? (
                    <div className="flex items-center justify-between">
                      <div className="text-sm muted-sm">Password management</div>
                      <button onClick={()=>setShowChange(true)} className="px-3 py-1 bg-accent text-black rounded text-sm">Change</button>
                    </div>
                  ) : (
                    <form onSubmit={handleChangePassword} className="mt-3 space-y-2">
                      {/* compact form: if current required, show it */}
                      <div className="space-y-1">
                        <input type="password" value={curPwd} onChange={e=>setCurPwd(e.target.value)} className="input" placeholder="Current password (demo)" />
                        <input type="password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} className="input" placeholder="New password" />
                        <input type="password" value={confirmPwd} onChange={e=>setConfirmPwd(e.target.value)} className="input" placeholder="Confirm new password" />
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="btn-cta px-3 py-1" disabled={pwdSaving}>{pwdSaving ? 'Saving…' : 'Save'}</button>
                        <button type="button" className="cta-ghost px-3 py-1" onClick={()=>{ setShowChange(false); setCurPwd(''); setNewPwd(''); setConfirmPwd(''); setPwdMsg('') }}>Cancel</button>
                      </div>
                      {pwdMsg && <div className="mt-2 text-sm">{pwdMsg}</div>}
                    </form>
                  )}
                  <div className="mt-3 text-xs">
                    <Link href="/reset/request" className="text-accent underline">Forgot password?</Link>
                  </div>
                </>
              ) : (
                <div className="muted-sm">Sign in to manage security settings.</div>
              )
            )}
          </div>
        </div>

        {/* Admin-only AI card (kept minimal) */}
        <div className="card">
          <h2 className="text-lg font-semibold">AI / LLM</h2>
          <div className="mt-3">
            {loading ? (
              <div className="muted-sm">Loading…</div>
            ) : isAdmin ? (
              <div className="muted-sm">Admin-only API key management is available in the admin panel.</div>
            ) : (
              <div className="muted-sm">Integration settings are restricted to administrators.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
