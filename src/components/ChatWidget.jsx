import { useState } from 'react'

export default function ChatWidget() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  async function send() {
    if (!input.trim()) return
    const q = input.trim()
    setMessages(m => [...m, { from: 'user', text: q }])
    setInput('')
    setSending(true)
    // fake typing indicator
    setMessages(m => [...m, { from: 'bot', text: '...', thinking: true }])

    try {
      const res = await fetch('/api/chat', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }) })
      const j = await res.json()
      // replace thinking message
      setMessages(m => {
        const copy = m.slice(0, -1)
        return [...copy, { from: 'bot', text: j.answer }]
      })
    } catch (err) {
      setMessages(m => {
        const copy = m.slice(0, -1)
        return [...copy, { from: 'bot', text: 'Error: failed to reach the server' }]
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4 glass rounded-2xl">
      <div className="flex flex-col gap-3 h-64 overflow-auto p-2" style={{minHeight: 160}}>
        {messages.map((m, i) => (
          <div key={i} className={`px-3 py-2 rounded-lg ${m.from === 'user' ? 'self-end bg-accent text-black' : 'self-start bg-white/6 text-white'}`}>
            <div className="text-sm whitespace-pre-wrap">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send() }} placeholder="Ask FinWisebot a question..." className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-white placeholder-white/60" />
        <button onClick={send} disabled={sending} className="btn-cta px-4 py-2">{sending ? 'Thinking…' : 'Send'}</button>
      </div>
    </div>
  )
}
