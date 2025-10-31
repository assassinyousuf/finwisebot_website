import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatBubble from '../components/ChatBubble';

export default function Demo() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input) return;
    const userMessage = { text: input, type: 'user' };
    setMessages([...messages, userMessage]);
    setInput("");

    // Call placeholder backend API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input })
    });
    const data = await response.json();
    const botMessage = { text: data.answer, type: 'bot' };
    setMessages(prev => [...prev, botMessage]);
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, idx) => <ChatBubble key={idx} message={msg} />)}
        </div>
        <div className="flex gap-2">
          <input 
            className="flex-1 p-2 border rounded" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask about a stock or financial report..." 
          />
          <button onClick={handleSend} className="bg-accent text-white px-4 rounded">Send</button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
