import { useEffect, useState } from 'react'
import mockApi, { read } from '../../lib/mockApi'

export default function AdminPage() {
  const [me, setMe] = useState(null)
  const [users, setUsers] = useState([])
  const [chats, setChats] = useState([])
  const [news, setNews] = useState([])
  const [settings, setSettings] = useState({})
  const [apiKeyEdit, setApiKeyEdit] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dbStatus, setDbStatus] = useState(null)
  const [saTestLoading, setSaTestLoading] = useState(false)
  const [saTestResult, setSaTestResult] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [newNews, setNewNews] = useState({ title: '', summary: '', url: '' })
  const [editingNews, setEditingNews] = useState(null)

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
        
        // Load news from localStorage (mock)
        const newsData = JSON.parse(localStorage.getItem('finwise_mock_news') || '[]')
        setNews(newsData)
        
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

  // News management functions
  function saveNews() {
    const updatedNews = editingNews 
      ? news.map(n => n.id === editingNews.id ? { ...editingNews, publishedAt: new Date().toISOString() } : n)
      : [...news, { ...newNews, id: Date.now().toString(), publishedAt: new Date().toISOString() }]
    
    localStorage.setItem('finwise_mock_news', JSON.stringify(updatedNews))
    setNews(updatedNews)
    setNewNews({ title: '', summary: '', url: '' })
    setEditingNews(null)
  }

  function editNewsItem(item) {
    setEditingNews(item)
  }

  function deleteNewsItem(id) {
    if (!confirm('Delete news item?')) return
    const updatedNews = news.filter(n => n.id !== id)
    localStorage.setItem('finwise_mock_news', JSON.stringify(updatedNews))
    setNews(updatedNews)
  }

  function cancelEdit() {
    setEditingNews(null)
    setNewNews({ title: '', summary: '', url: '' })
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

  async function saveSettings() {
    if (!confirm('Save settings?')) return
    try {
      // Save each setting individually (frontend demo)
      await mockApi.setSetting('siteTitle', settings.siteTitle)
      await mockApi.setSetting('siteDescription', settings.siteDescription)
      await mockApi.setSetting('contactEmail', settings.contactEmail)
      await mockApi.setSetting('theme', settings.theme)
      await mockApi.setSetting('language', settings.language)
      await mockApi.setSetting('timezone', settings.timezone)
      await mockApi.setSetting('twoFactorAuth', settings.twoFactorAuth)
      await mockApi.setSetting('sessionTimeout', settings.sessionTimeout)
      await mockApi.setSetting('strongPasswords', settings.strongPasswords)
      await mockApi.setSetting('maxLoginAttempts', settings.maxLoginAttempts)
      alert('Settings saved (local demo)')
    } catch (err) {
      console.error('save settings error', err)
      alert('Failed to save settings: ' + err.message)
    }
  }

  function clearAllData() {
    if (!confirm('Clear ALL data? This cannot be undone!')) return
    localStorage.clear()
    alert('All data cleared. Page will reload.')
    window.location.reload()
  }

  function exportData() {
    const data = {
      users: read('users', []),
      chats: read('chats', []),
      predictions: read('predictions', []),
      news: read('news', []),
      settings: read('settings', {}),
      currentUser: read('currentUser', null)
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'finwise-data-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">FinWise Admin Panel</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-slate-800 p-1 rounded-lg">
          {['overview', 'users', 'content', 'analytics', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Users</p>
                    <p className="text-3xl font-bold">{users.length}</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
                <div className="mt-4 text-xs text-blue-200">
                  {users.filter(u => u.roles?.includes('admin')).length} admins
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Chats</p>
                    <p className="text-3xl font-bold">{chats.length}</p>
                  </div>
                  <div className="text-4xl">💬</div>
                </div>
                <div className="mt-4 text-xs text-green-200">
                  {chats.filter(c => new Date(c.createdAt) > new Date(Date.now() - 24*60*60*1000)).length} today
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">News Articles</p>
                    <p className="text-3xl font-bold">{news.length}</p>
                  </div>
                  <div className="text-4xl">📰</div>
                </div>
                <div className="mt-4 text-xs text-purple-200">
                  {news.filter(n => new Date(n.publishedAt) > new Date(Date.now() - 7*24*60*60*1000)).length} this week
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">System Status</p>
                    <p className="text-xl font-bold">Online</p>
                  </div>
                  <div className="text-4xl">⚡</div>
                </div>
                <div className="mt-4 text-xs text-orange-200">
                  Demo Mode
                </div>
              </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Growth Chart */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">User Registration Trend</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-6xl mb-4">📈</div>
                    <p className="text-lg font-medium">Growth Analytics</p>
                    <p className="text-sm mt-2">Total Registrations: {users.length}</p>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-green-400 font-bold">+{Math.floor(users.length * 0.3)}</div>
                        <div className="text-gray-400">This Month</div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-blue-400 font-bold">+{Math.floor(users.length * 0.2)}</div>
                        <div className="text-gray-400">Last Month</div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-purple-400 font-bold">{Math.floor(users.length * 0.15)}</div>
                        <div className="text-gray-400">Avg/Month</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Activity */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Chat Activity</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-6xl mb-4">💬</div>
                    <p className="text-lg font-medium">Conversation Metrics</p>
                    <p className="text-sm mt-2">Total Conversations: {chats.length}</p>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-cyan-400 font-bold text-lg">
                          {chats.length > 0 ? Math.round((chats.reduce((acc, c) => acc + (c.citations?.length || 0), 0) / chats.length) * 10) / 10 : 0}
                        </div>
                        <div className="text-gray-400">Avg Citations</div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-green-400 font-bold text-lg">
                          {chats.filter(c => c.citations && c.citations.length > 0).length}
                        </div>
                        <div className="text-gray-400">Cited Chats</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Recent Activity</h3>
              <div className="space-y-3">
                {[...chats.slice(0, 5), ...news.slice(0, 3)].sort((a, b) => new Date(b.createdAt || b.publishedAt) - new Date(a.createdAt || a.publishedAt)).slice(0, 8).map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-slate-700 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${item.query ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        {item.query ? `New chat: "${item.query.slice(0, 50)}..."` : `News: "${item.title.slice(0, 50)}..."`}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(item.createdAt || item.publishedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.query ? 'Chat' : 'News'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">User Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Users:</span>
                    <span className="text-white font-medium">{users.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Admins:</span>
                    <span className="text-green-400 font-medium">{users.filter(u => u.roles?.includes('admin')).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Regular Users:</span>
                    <span className="text-blue-400 font-medium">{users.filter(u => !u.roles?.includes('admin')).length}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Profile Completion</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">With Display Name:</span>
                    <span className="text-white font-medium">{users.filter(u => u.displayName).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">With Avatar:</span>
                    <span className="text-purple-400 font-medium">{users.filter(u => u.avatar).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Complete Profiles:</span>
                    <span className="text-cyan-400 font-medium">{users.filter(u => u.displayName && u.avatar).length}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Recent Activity</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last 24h:</span>
                    <span className="text-white font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last 7 days:</span>
                    <span className="text-green-400 font-medium">{users.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Users:</span>
                    <span className="text-blue-400 font-medium">{users.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Management */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-6 text-white">User Management</h2>
              <div className="space-y-4">
                {users.map(u => (
                  <div key={u.id || u._id} className="bg-slate-700 p-6 rounded-lg border border-slate-600">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          {u.avatar ? (
                            <img src={u.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold">
                              {(u.displayName || u.email || 'U')[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-white">{u.displayName || u.email}</h3>
                            <p className="text-gray-400 text-sm">{u.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                u.roles?.includes('admin') 
                                  ? 'bg-red-600 text-white' 
                                  : 'bg-blue-600 text-white'
                              }`}>
                                {u.roles?.includes('admin') ? 'Admin' : 'User'}
                              </span>
                              {u.displayName && <span className="text-green-400 text-xs">✓ Profile</span>}
                              {u.avatar && <span className="text-purple-400 text-xs">✓ Avatar</span>}
                            </div>
                          </div>
                        </div>
                        
                        {u.fullName && (
                          <div className="mb-3">
                            <p className="text-gray-300 text-sm"><strong>Full Name:</strong> {u.fullName}</p>
                            {u.company && <p className="text-gray-300 text-sm"><strong>Company:</strong> {u.company}</p>}
                            {u.title && <p className="text-gray-300 text-sm"><strong>Title:</strong> {u.title}</p>}
                            {u.phone && <p className="text-gray-300 text-sm"><strong>Phone:</strong> {u.phone}</p>}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-6">
                        {(u.roles||[]).includes('admin') ? (
                          <button onClick={() => demote(u._id || u.id)} className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition text-sm">
                            Demote
                          </button>
                        ) : (
                          <button onClick={() => promote(u._id || u.id)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm">
                            Promote
                          </button>
                        )}
                        <button onClick={() => deleteUser(u._id || u.id)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm">
                          Delete
                        </button>
                        <button onClick={async ()=>{
                          const pwd = prompt('Enter new password for ' + (u.email||u.id) + ' (min 8 chars)')
                          if (!pwd) return
                          if (pwd.length < 8) { alert('Password too short'); return }
                          alert('Password reset simulated (frontend-only)')
                        }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                          Reset Password
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            {/* Content Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Content Overview</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Articles:</span>
                    <span className="text-white font-medium">{news.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Published Today:</span>
                    <span className="text-green-400 font-medium">{news.filter(n => new Date(n.publishedAt).toDateString() === new Date().toDateString()).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">This Week:</span>
                    <span className="text-blue-400 font-medium">{news.filter(n => new Date(n.publishedAt) > new Date(Date.now() - 7*24*60*60*1000)).length}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Engagement Metrics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg. Article Length:</span>
                    <span className="text-white font-medium">{news.length > 0 ? Math.round(news.reduce((acc, n) => acc + n.summary.length, 0) / news.length) : 0} chars</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">External Links:</span>
                    <span className="text-purple-400 font-medium">{news.filter(n => n.url.includes('yahoo.com')).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Click-through Rate:</span>
                    <span className="text-cyan-400 font-medium">~24.5%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Content Health</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Articles with Images:</span>
                    <span className="text-white font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">SEO Optimized:</span>
                    <span className="text-green-400 font-medium">{news.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fresh Content:</span>
                    <span className="text-blue-400 font-medium">✓ All recent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* News Management */}
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">News Article Management</h2>
                <div className="text-sm text-gray-400">
                  {news.length} articles • Last updated: {news.length > 0 ? new Date(Math.max(...news.map(n => new Date(n.publishedAt)))).toLocaleDateString() : 'Never'}
                </div>
              </div>
              
              {/* Add/Edit News Form */}
              <div className="mb-6 p-4 bg-slate-700 rounded">
                <h4 className="text-lg font-medium mb-3">{editingNews ? 'Edit News Article' : 'Add New Article'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={editingNews ? editingNews.title : newNews.title}
                    onChange={e => editingNews ? setEditingNews({...editingNews, title: e.target.value}) : setNewNews({...newNews, title: e.target.value})}
                    className="px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={editingNews ? editingNews.url : newNews.url}
                    onChange={e => editingNews ? setEditingNews({...editingNews, url: e.target.value}) : setNewNews({...newNews, url: e.target.value})}
                    className="px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                  />
                </div>
                <textarea
                  placeholder="Summary"
                  value={editingNews ? editingNews.summary : newNews.summary}
                  onChange={e => editingNews ? setEditingNews({...editingNews, summary: e.target.value}) : setNewNews({...newNews, summary: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white mb-4"
                  rows="3"
                />
                <div className="flex space-x-2">
                  <button onClick={saveNews} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    {editingNews ? 'Update' : 'Add'} Article
                  </button>
                  {editingNews && (
                    <button onClick={cancelEdit} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              
              {/* News List */}
              <div className="space-y-4">
                {news.map(item => (
                  <div key={item.id} className="bg-slate-700 p-4 rounded border border-slate-600">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-green-400">{item.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${
                            new Date(item.publishedAt) > new Date(Date.now() - 24*60*60*1000) 
                              ? 'bg-green-600 text-white' 
                              : 'bg-blue-600 text-white'
                          }`}>
                            {new Date(item.publishedAt) > new Date(Date.now() - 24*60*60*1000) ? 'New' : 'Published'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{item.summary}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                          <span>{item.summary.length} chars</span>
                          <span>{new Date(item.publishedAt).toLocaleString()}</span>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            View Source →
                          </a>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button onClick={() => editNewsItem(item)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                          Edit
                        </button>
                        <button onClick={() => deleteNewsItem(item.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-100 text-sm">Avg Session Time</p>
                    <p className="text-2xl font-bold">4m 32s</p>
                  </div>
                  <div className="text-3xl">⏱️</div>
                </div>
                <div className="mt-4 text-xs text-cyan-200">
                  +12% from last week
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm">Page Views</p>
                    <p className="text-2xl font-bold">2,847</p>
                  </div>
                  <div className="text-3xl">👁️</div>
                </div>
                <div className="mt-4 text-xs text-pink-200">
                  +8% from last week
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm">Bounce Rate</p>
                    <p className="text-2xl font-bold">23.4%</p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
                <div className="mt-4 text-xs text-indigo-200">
                  -5% from last week
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm">Conversion Rate</p>
                    <p className="text-2xl font-bold">3.2%</p>
                  </div>
                  <div className="text-3xl">🎯</div>
                </div>
                <div className="mt-4 text-xs text-emerald-200">
                  +0.8% from last week
                </div>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Top Pages</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-400 font-bold">1</span>
                      <span className="text-white">Features</span>
                    </div>
                    <span className="text-gray-400">1,247 views</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-400 font-bold">2</span>
                      <span className="text-white">PeekoChat</span>
                    </div>
                    <span className="text-gray-400">892 views</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-400 font-bold">3</span>
                      <span className="text-white">News</span>
                    </div>
                    <span className="text-gray-400">654 views</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-400 font-bold">4</span>
                      <span className="text-white">Home</span>
                    </div>
                    <span className="text-gray-400">523 views</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-400 font-bold">5</span>
                      <span className="text-white">Pricing</span>
                    </div>
                    <span className="text-gray-400">389 views</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Traffic Sources</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-white">Direct</span>
                    </div>
                    <span className="text-gray-400">45.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-white">Search Engines</span>
                    </div>
                    <span className="text-gray-400">32.8%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className="text-white">Social Media</span>
                    </div>
                    <span className="text-gray-400">15.6%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="text-white">Referrals</span>
                    </div>
                    <span className="text-gray-400">6.4%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Usage & System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Feature Usage</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">PeekoChat AI</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <span className="text-green-400 text-sm">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Signal Generator</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '72%'}}></div>
                      </div>
                      <span className="text-blue-400 text-sm">72%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">News Section</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{width: '68%'}}></div>
                      </div>
                      <span className="text-purple-400 text-sm">68%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">User Profiles</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div className="bg-cyan-500 h-2 rounded-full" style={{width: '54%'}}></div>
                      </div>
                      <span className="text-cyan-400 text-sm">54%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Backtesting</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{width: '23%'}}></div>
                      </div>
                      <span className="text-orange-400 text-sm">23%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">System Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-white">API Response Time</span>
                    </div>
                    <span className="text-green-400 font-medium">142ms</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-white">Database Queries</span>
                    </div>
                    <span className="text-green-400 font-medium">98.5% success</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-white">Cache Hit Rate</span>
                    </div>
                    <span className="text-yellow-400 font-medium">76.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-white">Error Rate</span>
                    </div>
                    <span className="text-green-400 font-medium">0.02%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-white">Uptime</span>
                    </div>
                    <span className="text-green-400 font-medium">99.97%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Settings Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl text-white">
                <div className="text-3xl mb-2">⚙️</div>
                <h3 className="text-lg font-semibold mb-1">System Settings</h3>
                <p className="text-sm opacity-90">Core configuration</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl text-white">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="text-lg font-semibold mb-1">Security</h3>
                <p className="text-sm opacity-90">Access controls</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl text-white">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="text-lg font-semibold mb-1">Analytics</h3>
                <p className="text-sm opacity-90">Tracking & metrics</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-xl text-white">
                <div className="text-3xl mb-2">🔄</div>
                <h3 className="text-lg font-semibold mb-1">Maintenance</h3>
                <p className="text-sm opacity-90">System health</p>
              </div>
            </div>

            {/* General Settings */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">General Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Site Title</label>
                    <input
                      type="text"
                      value={settings.siteTitle}
                      onChange={e => setSettings({...settings, siteTitle: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={e => setSettings({...settings, siteDescription: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                    <select
                      value={settings.theme}
                      onChange={e => setSettings({...settings, theme: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={e => setSettings({...settings, language: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={e => setSettings({...settings, timezone: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">EST</option>
                      <option value="PST">PST</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button onClick={saveSettings} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Security Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-400">Add an extra layer of security</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={e => setSettings({...settings, twoFactorAuth: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">Session Timeout</h4>
                      <p className="text-sm text-gray-400">Auto-logout after inactivity</p>
                    </div>
                    <select
                      value={settings.sessionTimeout}
                      onChange={e => setSettings({...settings, sessionTimeout: e.target.value})}
                      className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="240">4 hours</option>
                      <option value="0">Never</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">Password Policy</h4>
                      <p className="text-sm text-gray-400">Require strong passwords</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.strongPasswords}
                        onChange={e => setSettings({...settings, strongPasswords: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">Login Attempts</h4>
                      <p className="text-sm text-gray-400">Max failed attempts before lockout</p>
                    </div>
                    <select
                      value={settings.maxLoginAttempts}
                      onChange={e => setSettings({...settings, maxLoginAttempts: e.target.value})}
                      className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    >
                      <option value="3">3 attempts</option>
                      <option value="5">5 attempts</option>
                      <option value="10">10 attempts</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">System Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700 p-4 rounded">
                  <h4 className="font-medium text-blue-400 mb-2">Version Info</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">App Version:</span>
                      <span className="text-white">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Build:</span>
                      <span className="text-white">2024.01.15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Environment:</span>
                      <span className="text-green-400">Demo</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-700 p-4 rounded">
                  <h4 className="font-medium text-green-400 mb-2">Storage</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Used:</span>
                      <span className="text-white">{(JSON.stringify(localStorage).length / 1024).toFixed(1)} KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Available:</span>
                      <span className="text-white">~4.9 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Users:</span>
                      <span className="text-white">{users.length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-700 p-4 rounded">
                  <h4 className="font-medium text-orange-400 mb-2">Performance</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uptime:</span>
                      <span className="text-white">24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Response Time:</span>
                      <span className="text-green-400">&lt; 50ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400">✓ Healthy</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button onClick={clearAllData} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Clear All Data
                </button>
                <button onClick={exportData} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Export Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
