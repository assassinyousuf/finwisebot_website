import { useEffect, useState } from 'react';

function MiniChart({ seed = 0 }) {
  return (
    <svg viewBox="0 0 100 40" className="w-full h-20 sparkline">
      <path d="M0 30 C12 22 24 18 36 20 C48 22 60 12 72 16 C84 20 96 10 100 12" />
    </svg>
  );
}

export default function DemoVisualizer({ onSignalClick }) {
  const [ticks, setTicks] = useState(0);
  const [symbol, setSymbol] = useState('FINX');
  const [expanded, setExpanded] = useState(false);

  const signals = [
    { symbol: 'FINX', title: 'Buy signal', summary: 'Momentum pickup', time: '2m ago', status: 'buy' },
    { symbol: 'ABC', title: 'Earnings watch', summary: 'Earnings due', time: '1h ago', status: 'sell' },
    { symbol: 'ALPHA', title: 'Backtest complete', summary: 'Strategy Alpha finished', time: '3h ago', status: 'backtest' },
  ];

  useEffect(() => {
    const id = setInterval(() => setTicks(t => (t + 1) % 1000), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden md:flex flex-col gap-4 w-96">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl shadow-lg text-white float-up">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-300">Market snapshot</div>
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="bg-black/20 text-white text-xs rounded px-2 py-1">
            <option>FINX</option>
            <option>NVDA</option>
            <option>TSLA</option>
            <option>AAPL</option>
          </select>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="text-sm text-gray-200">${symbol}</div>
            <div className="text-xl font-bold text-green-300">{(123.45 + (ticks%7)/10).toFixed(2)}</div>
          </div>
          <div className="w-36">
            <MiniChart seed={ticks} />
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-300 flex gap-2">
          <button onClick={() => setExpanded(true)} className="bg-white/5 px-3 py-1 rounded">Expand</button>
          <div className="text-xs text-gray-400">1D • +3.4%</div>
        </div>
      </div>

      <div className="float-up">
        {/* Use SignalList structure inline to avoid extra import */}
        <div className="bg-white/5 p-3 rounded-xl shadow-md">
          <div className="text-sm font-semibold mb-3">Recent signals</div>
          <ul className="space-y-2 text-sm">
            {signals.map((s, i) => (
              <li key={i} className="flex items-center justify-between gap-2">
                <button onClick={() => onSignalClick && onSignalClick(s)} className="text-left flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${s.status === 'buy' ? 'bg-green-400' : s.status === 'sell' ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                    <div>
                      <div className="font-medium text-sm">{s.symbol} — {s.title}</div>
                      <div className="text-xs text-gray-300">{s.summary}</div>
                    </div>
                  </div>
                </button>
                <div className="text-xs text-gray-400">{s.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-tr from-indigo-700 to-purple-700 p-4 rounded-xl shadow-lg text-white float-up">
        <div className="text-sm text-gray-200 mb-2">Realtime analysis</div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/6 flex items-center justify-center">AI</div>
          <div>
            <div className="text-sm">Model: <span className="font-semibold">FinWise-Llama 3</span></div>
            <div className="text-xs text-gray-200">Latency: <span className="font-mono">{(30 + (ticks % 40))}ms</span></div>
            <div className="text-xs text-gray-200">Confidence: <span className="font-mono">{(70 + (ticks % 30))}%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
