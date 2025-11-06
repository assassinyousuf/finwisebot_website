import { useState, useRef, useEffect } from 'react'
import mockApi from '../lib/mockApi'

export default function ChatWidget() {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [uploadName, setUploadName] = useState(null)
  const [historyPreview, setHistoryPreview] = useState(null)
  const [iconOk, setIconOk] = useState(true)
  const fileRef = useRef(null)
  const scrollRef = useRef(null)
  const [showActions, setShowActions] = useState(false)

  useEffect(() => {
    // auto-scroll when messages change
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  // Listen for demo visualizer signals and insert a chat message
  useEffect(() => {
    function onSignal(e) {
      const signal = e && e.detail ? e.detail : null
      if (!signal) return
      setMessages(m => [...m, { from: 'bot', text: `Signal for ${signal.symbol}: ${signal.title}. ${signal.summary}`, createdAt: new Date() }])
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('fw:signal', onSignal)
    }
    return () => { if (typeof window !== 'undefined') window.removeEventListener('fw:signal', onSignal) }
  }, [])

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
        return [...copy, { from: 'bot', text: j.chat.answer, citations: j.chat.citations || [], createdAt: new Date() }]
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
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-xl relative border border-white/10" style={{minHeight: 360}}>
        {/* Compact header with actions popover */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            {iconOk ? (
              <img
                src="/peekochat.svg"
                alt="PeekoChat"
                onError={(e) => { setIconOk(false); e.currentTarget.style.display = 'none' }}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded"
              />
            ) : (
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-emerald-500 flex items-center justify-center text-black font-bold text-sm sm:text-base">P</div>
            )}
          </div>
          <div className="relative">
            <button onClick={() => setShowActions(s => !s)} aria-expanded={showActions} className="px-2 sm:px-3 py-1 rounded-md badge-soft text-sm">Actions ▾</button>
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 sm:w-64 bg-slate-900/80 border border-slate-700 rounded-lg p-2 sm:p-3 shadow-lg z-40">
                <div className="flex flex-col gap-2">
                  <button onClick={() => { quickAction('Summarize Apple 10-Q'); setShowActions(false) }} className="text-left badge-soft text-sm">Summarize Apple 10-Q</button>
                  <button onClick={() => { quickAction('Generate signal for NVDA'); setShowActions(false) }} className="text-left badge-soft text-sm">Generate signal for NVDA</button>
                  <button onClick={() => { quickAction('Backtest strategy X'); setShowActions(false) }} className="text-left badge-soft text-sm">Backtest strategy X</button>
                  <label className="cursor-pointer badge-soft text-left text-sm" onClick={() => setShowActions(false)}>
                    Upload PDF/CSV
                    <input ref={fileRef} type="file" accept=".pdf,.csv,.txt" onChange={onFileChange} style={{display:'none'}} />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div ref={scrollRef} className="flex flex-col gap-2 sm:gap-3 h-64 sm:h-72 overflow-auto p-2 sm:p-3 bg-slate-900/50 rounded-lg border border-white/10">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 sm:py-12 text-sm">Try one of the actions above or ask a question below.</div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`max-w-[90%] sm:max-w-[85%] px-2 sm:px-3 py-2 rounded-lg text-sm ${m.from === 'user' ? 'ml-auto bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30' : (m.from === 'bot' ? 'mr-auto bg-white/5 text-gray-200 border border-white/10' : 'mx-auto bg-purple-500/10 text-purple-200 border border-purple-500/20')}`}>
              <div className="text-sm whitespace-pre-wrap">{m.text}</div>

              {/* render citations when present (frontend-only mock) */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-2 border-t border-gray-300 dark:border-gray-600 pt-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="font-semibold text-[12px] mb-1">Sources</div>
                  <ul className="list-disc pl-4 space-y-2">
                    {m.citations.map((s, idx) => (
                      <li key={idx}>
                        <a href={s.href} target="_blank" rel="noreferrer" className="text-emerald-300 underline">{s.label || s.href}</a>
                        {s.snippet && <div className="text-[11px] text-muted mt-1 whitespace-pre-wrap">{s.snippet}</div>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {m.createdAt && <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{new Date(m.createdAt).toLocaleTimeString()}</div>}
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <input
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask about a stock or financial report..."
            className="input flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:outline-none transition-colors"
            aria-label="chat-input"
            rows={1}
          />

          <div className="flex items-center gap-2 flex-wrap">
            <label className="inline-flex items-center px-2 sm:px-3 py-2 rounded-lg bg-white/10 border border-white/20 cursor-pointer text-sm text-white hover:bg-white/20 transition-colors" title="Upload PDF/CSV">
              <input ref={fileRef} type="file" accept=".pdf,.csv,.txt" onChange={onFileChange} style={{display:'none'}} />
              Upload
            </label>
            <button onClick={() => send()} disabled={sending} className="btn-cta px-3 sm:px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105">{sending ? 'Thinking…' : 'Send'}</button>
            <button onClick={exportChat} className="cta-ghost px-3 sm:px-4 py-2 text-sm bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors">Export Chat</button>
          </div>
        </div>

        {/* Optional small preview area for uploaded content */}
        {historyPreview && (
          <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300">{historyPreview}</div>
        )}
      </div>
    </div>
  )
}
