import { useEffect, useState } from 'react'
import mockApi from '../lib/mockApi'
import Link from 'next/link'

function miniBar({ value = 0, max = 1 }){
  const pct = Math.round((value / Math.max(1, max)) * 100)
  return (
    <div className="w-full bg-white/3 rounded overflow-hidden" style={{ height: 12 }}>
      <div style={{ width: pct + '%', height: '100%', background: 'linear-gradient(90deg,#06d6a0,#06b6d4)' }} />
    </div>
  )
}

export default function ReportsPage(){
  const [loading, setLoading] = useState(true)
  const [chats, setChats] = useState([])
  const [users, setUsers] = useState([])

  useEffect(()=>{
    let mounted = true
    async function load(){
      try {
        // frontend-only mock auth
        const me = await mockApi.getMe()
        if (!me || !me.ok) { window.location.href = '/login'; return }
        const [cJ, uJ] = await Promise.all([mockApi.getChats(), mockApi.getUsers()])
        if (cJ && cJ.ok && mounted) setChats(cJ.chats || [])
        if (uJ && uJ.ok && mounted) setUsers(uJ.users || [])
      } catch (e) {
        console.warn('reports load', e)
      } finally { if (mounted) setLoading(false) }
    }
    load()
    return ()=>{ mounted = false }
  }, [])

  // basic analytics
  const totalChats = chats.length
  const totalUsers = users.length
  const byQuery = {}
  chats.forEach(c => {
    const q = (c.query || '').slice(0,80)
    if (!q) return
    byQuery[q] = (byQuery[q] || 0) + 1
  })
  const topQueries = Object.entries(byQuery).sort((a,b)=>b[1]-a[1]).slice(0,6)
  const maxCount = topQueries.length ? topQueries[0][1] : 1

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading">Reports</h1>
        <div className="flex gap-3">
          <Link href="/" className="text-sm text-white/80">Home</Link>
          <Link href="/user" className="text-sm text-white/80">User</Link>
        </div>
      </div>

      <div className="grid-cards">
        <div className="card">
          <h3 className="text-lg font-semibold">Usage</h3>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalChats}</div>
                <div className="muted-sm">Total chats</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <div className="muted-sm">Total users</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 className="text-lg font-semibold">Top queries</h3>
          <div className="mt-4 space-y-3">
            {loading ? <div className="muted-sm">Loading…</div> : (
              topQueries.length ? topQueries.map(([q, count], idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-mono text-white/90 truncate" style={{ maxWidth: '75%' }}>{q}</div>
                    <div className="text-sm muted-sm">{count}</div>
                  </div>
                  {miniBar({ value: count, max: maxCount })}
                </div>
              )) : <div className="muted-sm">No queries yet.</div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold">Recent chats</h3>
          <div className="mt-3 space-y-2">
            {chats.slice(0,6).map(c => (
              <div key={c._id} className="p-2 border border-white/3 rounded">
                <div className="font-mono text-sm truncate">{c.query}</div>
                <div className="muted-sm text-xs mt-1">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
            ))}
            {!chats.length && <div className="muted-sm">No chats yet.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
