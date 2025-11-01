import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [me, setMe] = useState(null)
  const [users, setUsers] = useState([])
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const meRes = await fetch('/api/me')
        if (!meRes.ok) throw new Error('Not authorized')
        const meJson = await meRes.json()
        if (!meJson.ok) throw new Error(meJson.error || 'No user')
        setMe(meJson.user)

        // load users and chats
        const [uRes, cRes] = await Promise.all([fetch('/api/admin/users'), fetch('/api/admin/chats')])
        if (!uRes.ok) throw new Error('Failed to load users')
        if (!cRes.ok) throw new Error('Failed to load chats')
        const uJson = await uRes.json()
        const cJson = await cRes.json()
        setUsers(uJson.users || [])
        setChats(cJson.chats || [])
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
    const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'promote' }) })
    if (res.ok) { const j = await res.json(); setUsers(users.map(u => u._id === id ? j.user : u)) }
  }

  async function demote(id) {
    const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'demote' }) })
    if (res.ok) { const j = await res.json(); setUsers(users.map(u => u._id === id ? j.user : u)) }
  }

  async function deleteUser(id) {
    if (!confirm('Delete user?')) return
    const res = await fetch('/api/admin/users?id=' + encodeURIComponent(id), { method: 'DELETE' })
    if (res.ok) setUsers(users.filter(u => u._id !== id))
  }

  async function deleteChat(id) {
    if (!confirm('Delete chat?')) return
    const res = await fetch('/api/admin/chats?id=' + encodeURIComponent(id), { method: 'DELETE' })
    if (res.ok) setChats(chats.filter(c => c._id !== id))
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
