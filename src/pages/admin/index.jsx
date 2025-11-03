import { useEffect, useState } from 'react'
import mockApi from '../../lib/mockApi'

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
        // client-side mock auth
        const me = await mockApi.getMe()
        if (me && me.ok) setMe(me.user)
        else if (process.env.NEXT_PUBLIC_UNSAFE_ADMIN === 'true' || process.env.NODE_ENV !== 'production') setMe({ roles: ['admin'] })

        const [uJ, cJ, sJ] = await Promise.all([mockApi.getUsers(), mockApi.getChats(), mockApi.getSettings('chat_api_key')])
        setUsers((uJ && uJ.users) || [])
        setChats((cJ && cJ.chats) || [])
        setSettings({ value: (sJ && sJ.value) || '' })
        // dbStatus is not applicable in frontend-only mode
        setDbStatus({ ok: false, error: 'local demo (no DB)' })
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
  const res = await mockApi.promoteUser(id)
    if (res && res.ok) setUsers(users.map(u => (u._id === id || u.id === id) ? res.user : u))
  }

  async function demote(id) {
  const res = await mockApi.demoteUser(id)
    if (res && res.ok) setUsers(users.map(u => (u._id === id || u.id === id) ? res.user : u))
  }

  async function deleteUser(id) {
    if (!confirm('Delete user?')) return
  const res = await mockApi.deleteUser(id)
    if (res && res.ok) setUsers(users.filter(u => (u._id !== id && u.id !== id)))
  }

  async function deleteChat(id) {
    if (!confirm('Delete chat?')) return
  const res = await mockApi.deleteChat(id)
    if (res && res.ok) setChats(chats.filter(c => c._id !== id))
  }

  async function saveApiKey() {
    if (!confirm('Save new API key?')) return
    setSaving(true)
    try {
    const res = await mockApi.setSetting('chat_api_key', apiKeyEdit)
      if (!res || !res.ok) throw new Error('Failed to save')
      const s = await mockApi.getSettings('chat_api_key')
      setSettings({ value: s.value })
      setApiKeyEdit('')
      alert('Saved (local)')
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
      // local demo: just echo stored settings
      const s = await mockApi.getSettings('chat_api_key')
      const j = { ok: true, body: s }
      setSaTestResult(j)
      alert('Service account test (local): ' + (s.value ? 'key present' : 'no key'))
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
                  <button onClick={() => demote(u._id || u.id)} className="px-3 py-1 bg-yellow-500 text-white rounded">Demote</button>
                ) : (
                  <button onClick={() => promote(u._id || u.id)} className="px-3 py-1 bg-green-600 text-white rounded">Promote</button>
                )}
                <button onClick={() => deleteUser(u._id || u.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                <button onClick={async ()=>{
                  const pwd = prompt('Enter new password for ' + (u.email||u._id) + ' (min 8 chars)')
                  if (!pwd) return
                  if (pwd.length < 8) { alert('Password too short'); return }
                  try {
                    // local demo: no-op
                    alert('Password reset simulated (frontend-only)')
                  } catch (e) { console.error(e); alert('Failed to reset password: ' + e.message) }
                }} className="px-3 py-1 bg-blue-600 text-white rounded">Reset password</button>
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
            <button onClick={async () => { if (!confirm('Clear stored key?')) return; await mockApi.deleteSetting('chat_api_key'); setSettings({}); alert('Cleared (local)') }} className="px-3 py-2 bg-red-600 text-white rounded">Clear</button>
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
          <div className="mt-2 text-xs text-gray-500">This admin panel is running in frontend-only demo mode — actions are simulated locally in your browser.</div>
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
