import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [me, setMe] = useState(null)
  const [users, setUsers] = useState([])
  const [chats, setChats] = useState([])
  const [settings, setSettings] = useState({})
  const [apiKeyEdit, setApiKeyEdit] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dbStatus, setDbStatus] = useState(null)
  const [saTestLoading, setSaTestLoading] = useState(false)
  const [saTestResult, setSaTestResult] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const meRes = await fetch('/api/me', { credentials: 'include' })
        if (meRes.ok) {
          const meJson = await meRes.json()
          if (!meJson.ok) throw new Error(meJson.error || 'No user')
          setMe(meJson.user)
        } else {
          // If running in development, allow unsecured admin panel even if /api/me fails
          if (process.env.NEXT_PUBLIC_UNSAFE_ADMIN === 'true' || process.env.NODE_ENV !== 'production') {
            setMe({ roles: ['admin'] })
          } else {
            throw new Error('Not authorized')
          }
        }

        // load users and chats
        const [uRes, cRes, sRes] = await Promise.all([
          fetch('/api/admin/users', { credentials: 'include' }),
          fetch('/api/admin/chats', { credentials: 'include' }),
          fetch('/api/admin/settings?key=chat_api_key', { credentials: 'include' }),
        ])
        if (!uRes.ok) throw new Error('Failed to load users')
        if (!cRes.ok) throw new Error('Failed to load chats')
        const uJson = await uRes.json()
        const cJson = await cRes.json()
        const sJson = await sRes.json()
        setUsers(uJson.users || [])
        setChats(cJson.chats || [])
        setSettings(sJson || {})
        // fetch DB status
        try {
          const ds = await (await fetch('/api/admin/db-status', { credentials: 'include' })).json()
          setDbStatus(ds)
        } catch (e) {
          console.warn('failed to fetch db status', e)
        }
      } catch (err) {
        console.error('admin load error', err)
        setError(err.message)
      } finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div className="p-8">Loading admin…</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>
  if (!me || !me.roles || !me.roles.includes('admin')) return <div className="p-8">Access denied — admin only.</div>

  async function promote(id) {
  const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ id, action: 'promote' }) })
    if (res.ok) { const j = await res.json(); setUsers(users.map(u => u._id === id ? j.user : u)) }
  }

  async function demote(id) {
  const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ id, action: 'demote' }) })
    if (res.ok) { const j = await res.json(); setUsers(users.map(u => u._id === id ? j.user : u)) }
  }

  async function deleteUser(id) {
    if (!confirm('Delete user?')) return
  const res = await fetch('/api/admin/users?id=' + encodeURIComponent(id), { method: 'DELETE', credentials: 'include' })
    if (res.ok) setUsers(users.filter(u => u._id !== id))
  }

  async function deleteChat(id) {
    if (!confirm('Delete chat?')) return
  const res = await fetch('/api/admin/chats?id=' + encodeURIComponent(id), { method: 'DELETE', credentials: 'include' })
    if (res.ok) setChats(chats.filter(c => c._id !== id))
  }

  async function saveApiKey() {
    if (!confirm('Save new API key?')) return
    setSaving(true)
    try {
    const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ key: 'chat_api_key', value: apiKeyEdit }) })
      if (!res.ok) throw new Error('Failed to save')
      const j = await res.json()
      // reload settings
  const s = await (await fetch('/api/admin/settings?key=chat_api_key', { credentials: 'include' })).json()
      setSettings(s)
      setApiKeyEdit('')
      alert('Saved')
    } catch (err) {
      console.error(err)
      alert('Failed to save key: ' + err.message)
    } finally { setSaving(false) }
  }

  async function testServiceAccount() {
    if (!confirm('Run a quick test of the configured service account?')) return
    setSaTestLoading(true)
    setSaTestResult(null)
    try {
      const res = await fetch('/api/admin/test-service-account', { credentials: 'include' })
      const j = await res.json()
      setSaTestResult(j)
      if (j.ok) alert('Service account test OK')
      else alert('Service account test failed: ' + (j.error || j.body || j.status))
    } catch (err) {
      console.error('test service account error', err)
      setSaTestResult({ ok: false, error: String(err) })
      alert('Service account test error: ' + String(err))
    } finally { setSaTestLoading(false) }
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <section>
        <h2 className="text-xl font-semibold">Users ({users.length})</h2>
        <div className="mt-2 space-y-2">
          {users.map(u => (
            <div key={u._id} className="p-3 border rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{u.email || u._id}</div>
                <div className="text-sm text-gray-500">Roles: {(u.roles||[]).join(', ') || 'user'}</div>
              </div>
              <div className="space-x-2">
                {(u.roles||[]).includes('admin') ? (
                  <button onClick={() => demote(u._id)} className="px-3 py-1 bg-yellow-500 text-white rounded">Demote</button>
                ) : (
                  <button onClick={() => promote(u._id)} className="px-3 py-1 bg-green-600 text-white rounded">Promote</button>
                )}
                <button onClick={() => deleteUser(u._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

        <section>
          <h2 className="text-lg font-medium">Database</h2>
          <div className="mt-2 text-sm">
            {dbStatus ? (
              dbStatus.ok ? (
                <div className="text-green-600">Connected — Users: {dbStatus.userCount}, Chats: {dbStatus.chatCount}</div>
              ) : (
                <div className="text-red-600">Not connected: {dbStatus.error || 'unknown'}</div>
              )
            ) : (
              <div className="text-gray-500">Checking DB status…</div>
            )}
          </div>
        </section>

      <section>
        <h2 className="text-xl font-semibold">Chat API Key</h2>
        <div className="mt-2">
          <div className="mb-2 text-sm text-gray-600">Current key: <span className="font-mono">{settings.value || '— not set —'}</span></div>
          <div className="flex items-center space-x-2">
            <input value={apiKeyEdit} onChange={e => setApiKeyEdit(e.target.value)} placeholder="Paste new API key here" className="px-3 py-2 border rounded w-96 font-mono" />
            <button onClick={saveApiKey} disabled={saving} className="px-3 py-2 bg-blue-600 text-white rounded">{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={async () => { if (!confirm('Clear stored key?')) return; await fetch('/api/admin/settings?key=chat_api_key', { method: 'DELETE', credentials: 'include' }); setSettings({}); alert('Cleared') }} className="px-3 py-2 bg-red-600 text-white rounded">Clear</button>
            {process.env.NODE_ENV !== 'production' && (
              <button onClick={testServiceAccount} disabled={saTestLoading} className="px-3 py-2 bg-indigo-600 text-white rounded">{saTestLoading ? 'Testing…' : 'Test Service Account'}</button>
            )}
          </div>
          {saTestResult && (
            <div className="mt-2 text-xs text-gray-700">
              <strong>Service account test result:</strong>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">{JSON.stringify(saTestResult, null, 2)}</pre>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500">The key will be stored encrypted (if server configured with <code>SETTINGS_ENCRYPTION_KEY</code>), otherwise stored plaintext with a server warning. This key will be used by the server-side chat provider when configured.</div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Chats ({chats.length})</h2>
        <div className="mt-2 space-y-2">
          {chats.map(c => (
            <div key={c._id} className="p-3 border rounded">
              <div className="text-sm text-gray-700">{c.query}</div>
              <div className="text-xs text-gray-500">{c.answer}</div>
              <div className="mt-2">
                <button onClick={() => deleteChat(c._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
