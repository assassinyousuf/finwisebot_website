import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatBubble from '../components/ChatBubble';
import ExportButton from '../components/ExportButton';

// Dynamically load heavy visual components client-side to reduce initial bundle size
const DemoVisualizer = dynamic(() => import('../components/DemoVisualizer'), {
  ssr: false,
  loading: () => (
    <div className="h-24 w-full flex items-center justify-center text-sm text-gray-400">Loading visualizer...</div>
  ),
});

const DemoBackground = dynamic(() => import('../components/DemoBackground'), { ssr: false });

export default function Demo() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef();

  const handleSend = async () => {
    if (!input) return;
    const userMessage = { text: input, type: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    // Call placeholder backend API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input })
    });
    const data = await response.json();
  const botMessage = { text: data.answer, type: 'bot', citations: data.citations || [], time: new Date().toLocaleTimeString() };
    // small delay to showcase typing indicator
    setTimeout(() => {
      setMessages(prev => [...prev, botMessage]);
      setTyping(false);
      // scroll to bottom
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 700 + Math.random() * 600);
  }

  const handleSignalClick = (signal) => {
    // populate chat with explanation when a signal is clicked
    const botMsg = { text: `Signal for ${signal.symbol}: ${signal.title}. ${signal.summary}`, type: 'bot', citations: [{ href: '#', label: 'Source' }], time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, botMsg]);
  };

  const quickActions = [
    { label: 'Summarize Apple 10-Q', prompt: 'Summarize AAPL 10-Q' },
    { label: 'Generate signal for NVDA', prompt: 'Generate trading signal for NVDA' },
    { label: 'Backtest strategy X', prompt: 'Backtest strategy X over 5 years' }
  ];

  const handleQuick = (p) => { setInput(p); setTimeout(() => handleSend(), 50); };

  const handleFileUpload = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const msg = { text: `Uploaded file: ${f.name} (${Math.round(f.size/1024)} KB) — parsing and summarizing...`, type: 'user', time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, msg]);
    // placeholder: create a mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { text: `Summary of ${f.name}: (demo) key points extracted.`, type: 'bot', time: new Date().toLocaleTimeString() }]);
    }, 900);
  };

  return (
  <div className="flex flex-col min-h-screen relative overflow-hidden bg-slate-900 text-white">
      <DemoBackground />
      <Navbar />
      <main className="flex-1 p-6 max-w-6xl mx-auto flex gap-6">
        <section className="flex-1 flex flex-col bg-slate-800/40 rounded-xl p-4 shadow-lg">
          <div className="mb-2 flex gap-2">
            {quickActions.map((q, i) => (
              <button key={i} onClick={() => handleQuick(q.prompt)} className="bg-slate-700/40 text-white px-3 py-1 rounded text-sm">{q.label}</button>
            ))}
            <label className="ml-auto flex items-center gap-2 text-sm">
              <input type="file" accept=".pdf,.csv" onChange={handleFileUpload} className="hidden" />
              <span className="bg-slate-700/40 px-3 py-1 rounded">Upload PDF/CSV</span>
            </label>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto mb-4 space-y-3">
            {messages.map((msg, idx) => <ChatBubble key={idx} message={msg} />)}
            {typing && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-10 h-10 rounded-full bg-white/6 flex items-center justify-center">🤖</div>
                <div className="typing-dots"><span></span><span></span><span></span></div>
              </div>
            )}
          </div>

          <div className="flex gap-3 items-center">
            <input 
              className="flex-1 p-3 rounded-md bg-slate-700/20 border border-white/10 text-white placeholder-white/50 focus:outline-none"
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask about a stock or financial report..." 
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            />
            <button onClick={handleSend} className="bg-accent text-black px-4 rounded-md">Send</button>
            <ExportButton messages={messages} />
          </div>
        </section>

        <aside className="w-96">
          <DemoVisualizer onSignalClick={handleSignalClick} />
        </aside>
      </main>
      <Footer />
    </div>
  );
}
