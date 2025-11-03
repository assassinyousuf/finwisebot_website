import { useState, useRef, useEffect } from 'react'
import mockApi from '../lib/mockApi'

function Avatar({ who }){
  const text = (who === 'user') ? 'U' : (who === 'bot') ? 'P' : 'S'
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 text-sm font-semibold text-white">{text}</div>
  )
}

function MessageBubble({ m, isUser }){
  const base = `px-3 py-2 rounded-lg max-w-[86%] whitespace-pre-wrap text-sm`
  if (m.from === 'system') return (<div className="mx-auto text-xs text-slate-400 px-3 py-2">{m.text}</div>)
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}> 
      {!isUser && <div className="mr-3"><Avatar who={m.from} /></div>}
      <div className={`${base} ${isUser ? 'bg-emerald-500 text-black' : 'bg-slate-800/60 text-slate-200'}`} aria-live="polite">
        <div>{m.text}</div>
        {m.createdAt && <div className="text-[10px] text-slate-400 mt-1 text-right">{new Date(m.createdAt).toLocaleTimeString()}</div>}
      </div>
      {isUser && <div className="ml-3"><Avatar who={m.from} /></div>}
    </div>
  )
}

export default function ChatWidget() {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [uploadName, setUploadName] = useState(null)
  const [historyPreview, setHistoryPreview] = useState(null)
  const fileRef = useRef(null)
  const scrollRef = useRef(null)
  const [showActions, setShowActions] = useState(false)
  const [mounted, setMounted] = useState(false)

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
    setMounted(true)
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
    <div className="w-full max-w-3xl mx-auto p-3">
      <div className="glass rounded-2xl p-4 shadow-xl relative overflow-hidden" style={{minHeight: 420}}>
        {/* decorative accent */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-emerald-500/10 pointer-events-none filter blur-xl" />
        <div className="absolute left-4 top-4 w-12 h-1 rounded-full bg-emerald-500/30" />
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {/* icon: use /peekochat.png if available, otherwise fallback to initials avatar */}
            <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-800 flex items-center justify-center">
              {/* Inline SVG to guarantee icon renders without an extra network request */}
              <svg viewBox="0 0 256 256" width="40" height="40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                  <linearGradient id="g2" x1="0" x2="1">
                    <stop offset="0%" stopColor="#60E0A6" />
                    <stop offset="100%" stopColor="#2ABF9F" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" rx="28" fill="#0b1220" />
                <g transform="translate(20,20) scale(0.8)">
                  <circle cx="80" cy="48" r="44" fill="#ffd966" stroke="#f6c84c" strokeWidth="3" />
                  <circle cx="96" cy="44" r="6" fill="#2b2b2b" />
                  <path d="M56 28 C44 12, 30 8, 34 32 C36 44, 46 36, 56 28" fill="#ffd966" stroke="#f6c84c" strokeWidth="2"/>
                  <path d="M64 60 L80 56 L74 48 Z" fill="#8b8b8b" />
                  <rect x="120" y="10" width="80" height="56" rx="8" fill="url(#g2)" />
                  <circle cx="148" cy="38" r="4" fill="#fff" />
                  <circle cx="164" cy="38" r="4" fill="#fff" />
                  <circle cx="180" cy="38" r="4" fill="#fff" />
                  <rect x="8" y="110" width="18" height="36" rx="3" fill="#2abf9f" />
                  <rect x="34" y="92" width="18" height="54" rx="3" fill="#60e0a6" />
                  <rect x="60" y="72" width="18" height="74" rx="3" fill="#2abf9f" />
                </g>
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">PeekoChat</div>
              <div className="text-xs text-slate-400">AI financial assistant</div>
            </div>
          </div>
          <div className="text-xs text-slate-400">{user ? user.email || user.name : ''}</div>
        </div>

        {/* Quick actions removed as requested (upload is available via paperclip). */}

        {/* Messages list (flex-grow) */}
        <div ref={scrollRef} className="flex-1 flex flex-col gap-3 overflow-auto p-3" style={{background:'linear-gradient(180deg, rgba(0,0,0,0.02), transparent)'}} role="log" aria-live="polite">
          {messages.length === 0 && (
            <div className="mx-auto my-6 w-full max-w-lg p-4 rounded-md bg-slate-900/40 border border-slate-700 text-slate-300">
              <div className="text-sm font-semibold text-white mb-2">Welcome to PeekoChat</div>
              <div className="text-sm text-slate-300 mb-3">Try one of these quick actions or ask a question.</div>
              <div className="text-sm text-slate-300 mb-3">Try commands like: Summarize AAPL 10-Q, Generate signal for NVDA, or Upload a report using the paperclip.</div>
              <div className="text-xs text-slate-400 mt-3">Examples: "Summarize AAPL earnings", "What is the sentiment on NVDA?", "Backtest strategy with moving average crossover"</div>
            </div>
          )}

          {messages.map((m, i) => (
            <MessageBubble key={i} m={m} isUser={m.from === 'user'} />
          ))}

          {/* Typing / thinking indicator */}
          {sending && (
            <div className="flex items-center gap-3">
              <div className="ml-11">
                <div className="px-3 py-2 bg-slate-800/60 text-slate-200 rounded-lg inline-block">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse delay-75" />
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse delay-150" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="mt-4 flex items-center gap-3">
          <button className="p-2 rounded-md bg-slate-700/10" title="Attach file" onClick={()=>fileRef.current && fileRef.current.click()}>
            📎
            <input ref={fileRef} type="file" accept=".pdf,.csv,.txt" onChange={onFileChange} style={{display:'none'}} />
          </button>

          <textarea
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask about a stock, upload a report, or try a quick action..."
            className="input flex-1 h-10 resize-none"
            aria-label="chat-input"
          />

          <div className="flex items-center gap-2">
            <button onClick={() => send()} disabled={sending || !mounted} className="btn-cta px-4 py-2">{sending ? 'Thinking…' : 'Send'}</button>
            <button onClick={exportChat} className="cta-ghost px-3 py-2">Export</button>
          </div>
        </div>

        {/* Attachment preview */}
        {uploadName && (
          <div className="mt-3 p-3 rounded-md bg-slate-800/40 border border-slate-700 text-sm text-slate-200 flex items-center justify-between">
            <div>{uploadName}</div>
            <div className="text-xs text-slate-400">Preview available</div>
          </div>
        )}

        {/* Optional small preview area for uploaded content */}
        {historyPreview && (
          <div className="mt-3 p-3 rounded-md bg-black/5 text-sm text-slate-300">{historyPreview}</div>
        )}
      </div>
    </div>
  )
}
