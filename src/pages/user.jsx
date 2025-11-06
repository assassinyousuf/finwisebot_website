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
    <div className="container py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-heading">User</h1>
        <div className="flex gap-3">
          <Link href="/" className="text-sm text-white/80 hover:text-white transition">Home</Link>
          <Link href="/reports" className="text-sm text-white/80 hover:text-white transition">Reports</Link>
        </div>
      </div>

      <div className="grid-cards">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center sm:items-start gap-3">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-black font-bold text-3xl sm:text-4xl flex-shrink-0 shadow-lg">
                {user && user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user && user.email ? user.email[0].toUpperCase() : 'U'
                )}
              </div>
              <button onClick={()=>setEditingProfile(true)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                Edit Profile
              </button>
            </div>

            {/* User Info Section */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-1">
                {user ? (user.displayName || user.email.split('@')[0]) : 'User'}
              </h2>
              <div className="text-white/70 text-lg mb-4">{user ? user.email : ''}</div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-accent">{chatsCount}</div>
                  <div className="text-white/60 text-sm">Chats</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-accent">{predsCount}</div>
                  <div className="text-white/60 text-sm">Predictions</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-accent">
                    {user && user.roles && user.roles.includes('admin') ? 'Admin' : 'User'}
                  </div>
                  <div className="text-white/60 text-sm">Role</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 text-sm text-white/60">
                {user && user.fullName && <div><strong className="text-white/80">Full Name:</strong> {user.fullName}</div>}
                {user && user.company && <div><strong className="text-white/80">Company:</strong> {user.company}</div>}
                {user && user.title && <div><strong className="text-white/80">Title:</strong> {user.title}</div>}
                {lastActive && <div><strong className="text-white/80">Last Active:</strong> {lastActive}</div>}
                <div><strong className="text-white/80">Member Since:</strong> {inferJoined(user) || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Account Details</h3>
          {loading ? (
            <div className="text-white/60">Loading…</div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/80 font-medium">Email</span>
                <span className="text-white/60">{user ? user.email : '—'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/80 font-medium">Account Type</span>
                <span className="text-white/60">
                  {user && user.roles && user.roles.includes('admin') ? 'Administrator' : 'Standard User'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/80 font-medium">Member Since</span>
                <span className="text-white/60">{inferJoined(user) || '—'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/80 font-medium">User ID</span>
                <span className="text-white/60 font-mono text-xs">{user && (user.id || user._id || '—')}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="text-xs text-white/50">
                  This is a demo account stored locally in your browser.
                  Data persists across sessions but is not shared with any server.
                </div>
              </div>
            </div>
          )}
        </div>

              <div
                className={`card overflow-hidden transition-all duration-300 ${editingProfile ? 'max-h-[600px] opacity-100 scale-100 pointer-events-auto' : 'max-h-0 opacity-0 scale-95 pointer-events-none'}`}
                style={{ gridColumn: 'span 2' }}
                aria-hidden={!editingProfile}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Edit Profile</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProfile(false);
                      setDisplayName(user && user.displayName ? user.displayName : '');
                      setAvatarPreview(user && user.avatar ? user.avatar : null);
                      setAvatarError('');
                    }}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={saveProfile} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-black font-bold text-2xl flex-shrink-0">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        user && user.email ? user.email[0].toUpperCase() : 'U'
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-sm font-medium text-white/80 mb-2">Profile Picture</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onAvatarChange}
                        className="w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent file:text-black hover:file:bg-accent/80 transition-colors"
                      />
                      {avatarError && <div className="text-sm text-red-400 mt-2">{avatarError}</div>}
                      <div className="text-xs text-white/50 mt-1">Accepted: PNG, JPG, WebP. Max: 2 MB.</div>
                    </div>
                  </div>

                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="How should we call you?"
                      className="input w-full"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                    <button
                      type="submit"
                      className="btn-cta flex-1"
                      disabled={!!avatarError}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProfile(false);
                        setDisplayName(user && user.displayName ? user.displayName : '');
                        setAvatarPreview(user && user.avatar ? user.avatar : null);
                        setAvatarError('');
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

        {/* Security Settings */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Security</h3>
          <div>
            {loading ? (
              <div className="text-white/60">Loading…</div>
            ) : user ? (
              <>
                {!showChange ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white/80 font-medium">Password</div>
                        <div className="text-white/60 text-sm">Last changed: Never (demo)</div>
                      </div>
                      <button
                        onClick={() => setShowChange(true)}
                        className="px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors text-sm font-medium"
                      >
                        Change Password
                      </button>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <Link
                        href="/reset/request"
                        className="text-accent hover:text-accent/80 transition-colors text-sm"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Current Password</label>
                        <input
                          type="password"
                          value={curPwd}
                          onChange={e => setCurPwd(e.target.value)}
                          className="input w-full"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">New Password</label>
                        <input
                          type="password"
                          value={newPwd}
                          onChange={e => setNewPwd(e.target.value)}
                          className="input w-full"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPwd}
                          onChange={e => setConfirmPwd(e.target.value)}
                          className="input w-full"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    {pwdMsg && (
                      <div className={`text-sm p-3 rounded-lg ${
                        pwdMsg.includes('changed') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {pwdMsg}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="submit"
                        className="btn-cta flex-1"
                        disabled={pwdSaving}
                      >
                        {pwdSaving ? 'Updating…' : 'Update Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowChange(false);
                          setCurPwd('');
                          setNewPwd('');
                          setConfirmPwd('');
                          setPwdMsg('');
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <div className="text-white/60">Please sign in to manage security settings.</div>
            )}
          </div>
        </div>

        {/* AI Settings */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">AI Integration</h3>
          <div>
            {loading ? (
              <div className="text-white/60">Loading…</div>
            ) : isAdmin ? (
              <div className="space-y-3">
                <div className="text-white/80">API Key Management</div>
                <div className="text-white/60 text-sm">
                  Configure AI service integrations and manage API keys in the admin panel.
                </div>
                <Link
                  href="/admin"
                  className="inline-block px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors text-sm font-medium"
                >
                  Open Admin Panel
                </Link>
              </div>
            ) : (
              <div className="text-white/60">
                AI integration settings are managed by administrators only.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        {recentChats.length > 0 && (
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentChats.map((chat, index) => (
                <div key={chat._id || index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent text-sm">💬</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/80 font-medium text-sm truncate">
                      {chat.query || 'Chat session'}
                    </div>
                    <div className="text-white/60 text-xs mt-1">
                      {new Date(chat.createdAt).toLocaleDateString()} at {new Date(chat.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-white/10">
                <Link
                  href="/"
                  className="text-accent hover:text-accent/80 transition-colors text-sm"
                >
                  Start a new chat →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
