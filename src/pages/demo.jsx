import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatBubble from '../components/ChatBubble';
import ExportButton from '../components/ExportButton';
import ChatWidget from '../components/ChatWidget'
import mockApi from '../lib/mockApi';

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

    // Use client-side mock chat
    const data = await mockApi.chat({ query: input })
  const botMessage = { text: data.chat.answer, type: 'bot', citations: data.chat.citations || [], time: new Date().toLocaleTimeString() };
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
        <div className="w-full">
          <h1 className="text-2xl font-semibold mb-4">PeekoChat</h1>
        </div>
        <section className="flex-1">
          <ChatWidget />
        </section>

        <aside className="w-96">
          <DemoVisualizer onSignalClick={handleSignalClick} />
        </aside>
      </main>
      <Footer />
    </div>
  );
}
