import { useState } from 'react';

export default function ChatBubble({ message, onReact }) {
  const isUser = message.type === 'user';
  const [helpful, setHelpful] = useState(null); // true/false/null

  const toggleReact = (val) => {
    setHelpful(val);
    if (onReact) onReact({ id: message.id, helpful: val });
  };

  const time = message.time || new Date().toLocaleTimeString();

  return (
    <div className={`mb-3 flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade`}> 
      <div className={`max-w-xl ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block p-3 rounded-lg ${isUser ? 'bg-green-100 text-black' : 'bg-slate-700 text-white'} shadow-md`}> 
          <div className="whitespace-pre-wrap">{message.text}</div>
          {message.citations && message.citations.length > 0 && (
            <div className="mt-2 text-xs text-blue-200">
              {message.citations.map((c, i) => (
                <div key={i}><a href={c.href} target="_blank" rel="noreferrer" className="underline">{c.label || c.href}</a></div>
              ))}
            </div>
          )}
          <div className="mt-2 text-[11px] text-gray-400">{time}</div>
        </div>

        {/* Reactions */}
        <div className="mt-1 flex gap-2 justify-start text-sm">
          <button onClick={() => toggleReact(true)} className={`px-2 py-1 rounded ${helpful === true ? 'bg-green-600 text-white' : 'bg-white/5 text-white'}`}>👍 Helpful</button>
          <button onClick={() => toggleReact(false)} className={`px-2 py-1 rounded ${helpful === false ? 'bg-red-600 text-white' : 'bg-white/5 text-white'}`}>👎 Not helpful</button>
        </div>
      </div>
    </div>
  );
}

