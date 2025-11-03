import { useState, useRef, useEffect } from 'react'
import mockApi from '../lib/mockApi'

export default function ChatWidget() {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [uploadName, setUploadName] = useState(null)
  const [historyPreview, setHistoryPreview] = useState(null)
  const fileRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    // auto-scroll when messages change
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  // PeekoChat onboarding and preselected symbol handling
  useEffect(() => {
    let mounted = true
    async function init() {
      try {
        const j = await mockApi.getMe()
        if (j && j.ok && mounted) {
          setUser(j.user)
          const seenKey = `peek_seen_${j.user.id || j.user._id || j.user.email}`
          const seen = localStorage.getItem(seenKey)
          const selected = localStorage.getItem('peek_selected')
          if (selected) {
            // clear and insert a helpful starting message
            localStorage.removeItem('peek_selected')
            setMessages(m => [...m, { from: 'system', text: `Peeking at ${selected} — open a chat to ask for a summary or signals.` }])
          }
          if (!seen) {
            // first time onboarding
            setMessages(m => [...m, { from: 'system', text: `Welcome to PeekoChat — ask about a stock (symbol or company name) or use the quick actions to get started.` }])
            localStorage.setItem(seenKey, '1')
          }
        }
      } catch (e) {
        // ignore
      }
    }
    if (!messages.length) init()
    return () => { mounted = false }
  }, [])

  async function send(query) {
    const q = (typeof query === 'string') ? query : input.trim()
    if (!q) return
    setMessages(m => [...m, { from: 'user', text: q, createdAt: new Date() }])
    if (!query) setInput('')
    setSending(true)
    // show thinking
    setMessages(m => [...m, { from: 'bot', text: 'Thinking…', thinking: true }])

    try {
      const j = await mockApi.chat({ query: q })
      setMessages(m => {
        const copy = m.slice(0, -1)
        return [...copy, { from: 'bot', text: j.chat.answer, createdAt: new Date() }]
      })
    } catch (err) {
      setMessages(m => {
        const copy = m.slice(0, -1)
        return [...copy, { from: 'bot', text: 'Error: failed to reach the server', createdAt: new Date() }]
      })
    } finally {
      setSending(false)
    }
  }

  function quickAction(text) {
    // insert quick sample into input and send
    setInput(text)
    // small delay to allow input to update in UI before sending
    setTimeout(() => send(text), 120)
  }

  function onFileChange(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    setUploadName(f.name)
    // For demo, just store a small preview
    const reader = new FileReader()
    reader.onload = () => {
      const txt = String(reader.result).slice(0, 1000)
      setHistoryPreview(`Uploaded ${f.name} — preview:\n${txt.slice(0, 400)}`)
      setMessages(m => [...m, { from: 'system', text: `Uploaded ${f.name}` }])
    }
    // try to read as text (graceful fallback)
    reader.readAsText(f.slice(0, 20000))
  }

  function exportChat() {
    const blob = new Blob([messages.map(m => `[${m.from}] ${m.text}`).join('\n\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finwisebot-chat-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="glass rounded-2xl p-4 shadow-xl" style={{minHeight: 360}}>
        {/* Top action pills */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <button onClick={() => quickAction('Summarize Apple 10-Q')} className="badge-soft">Summarize Apple 10-Q</button>
          <button onClick={() => quickAction('Generate signal for NVDA')} className="badge-soft">Generate signal for NVDA</button>
          <button onClick={() => quickAction('Backtest strategy X')} className="badge-soft">Backtest strategy X</button>
          <label className="badge-soft cursor-pointer">
            Upload PDF/CSV
            <input ref={fileRef} type="file" accept=".pdf,.csv,.txt" onChange={onFileChange} style={{display:'none'}} />
          </label>
          {uploadName && <div className="text-xs text-muted px-2">{uploadName}</div>}
        </div>

        {/* Chat area */}
        <div ref={scrollRef} className="flex flex-col gap-3 h-72 overflow-auto p-3" style={{background:'linear-gradient(180deg, rgba(0,0,0,0.02), transparent)'}}>
          {messages.length === 0 && (
            <div className="text-center text-muted py-12">Try one of the actions above or ask a question below.</div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] px-3 py-2 rounded-lg ${m.from === 'user' ? 'ml-auto' : (m.from === 'bot' ? 'mr-auto' : 'mx-auto')}`} style={{background: m.from === 'user' ? 'var(--accent)' : m.from === 'bot' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.02)', color: m.from === 'user' ? 'var(--text-on-accent)' : 'var(--text-primary)'}}>
              <div className="text-sm whitespace-pre-wrap">{m.text}</div>
              {m.createdAt && <div className="text-[10px] text-muted mt-1">{new Date(m.createdAt).toLocaleTimeString()}</div>}
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="mt-4 flex items-center gap-3">
          <input
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask about a stock or financial report..."
            className="input flex-1"
            aria-label="chat-input"
            rows={1}
          />

          <button onClick={() => send()} disabled={sending} className="btn-cta px-4 py-2">{sending ? 'Thinking…' : 'Send'}</button>
          <button onClick={exportChat} className="cta-ghost px-4 py-2">Export Chat</button>
        </div>

        {/* Optional small preview area for uploaded content */}
        {historyPreview && (
          <div className="mt-3 p-3 rounded-md bg-black/5 text-sm text-muted">{historyPreview}</div>
        )}
      </div>
    </div>
  )
}
