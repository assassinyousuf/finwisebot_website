import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatBubble from '../components/ChatBubble';
import DemoVisualizer from '../components/DemoVisualizer';
import DemoBackground from '../components/DemoBackground';

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
    const botMessage = { text: data.answer, type: 'bot' };
    // small delay to showcase typing indicator
    setTimeout(() => {
      setMessages(prev => [...prev, botMessage]);
      setTyping(false);
      // scroll to bottom
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 700 + Math.random() * 600);
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <DemoBackground />
      <Navbar />
      <main className="flex-1 p-6 max-w-6xl mx-auto flex gap-6">
        <section className="flex-1 flex flex-col bg-white/5 rounded-xl p-4 shadow-lg">
          <div ref={scrollRef} className="flex-1 overflow-y-auto mb-4 space-y-3">
            {messages.map((msg, idx) => <ChatBubble key={idx} message={msg} />)}
            {typing && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-10 h-10 rounded-full bg-white/6 flex items-center justify-center">🤖</div>
                <div className="typing-dots"><span></span><span></span><span></span></div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <input 
              className="flex-1 p-3 rounded-md bg-white/6 border border-white/10 text-white placeholder-white/50 focus:outline-none"
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask about a stock or financial report..." 
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            />
            <button onClick={handleSend} className="bg-accent text-black px-4 rounded-md">Send</button>
          </div>
        </section>

        <aside className="w-96">
          <DemoVisualizer />
        </aside>
      </main>
      <Footer />
    </div>
  );
}
