import { useEffect, useState } from 'react';

function MiniChart() {
  return (
    <svg viewBox="0 0 100 40" className="w-full h-20 sparkline">
      <path d="M0 30 C12 22 24 18 36 20 C48 22 60 12 72 16 C84 20 96 10 100 12" />
    </svg>
  );
}

export default function DemoVisualizer() {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTicks(t => (t + 1) % 1000), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden md:flex flex-col gap-4 w-96">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl shadow-lg text-white float-up">
        <div className="text-xs text-gray-300">Market snapshot</div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="text-sm text-gray-200">$FINX</div>
            <div className="text-xl font-bold text-green-300">{(123.45 + (ticks%7)/10).toFixed(2)}</div>
          </div>
          <div className="w-36">
            <MiniChart />
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-4 rounded-xl shadow-md float-up">
        <div className="text-sm font-semibold mb-2">Recent signals</div>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>📈 FINX — Buy signal at 122.8</li>
          <li>🛑 ABC — Watch for earnings on Thu</li>
          <li>🔁 Strategy Alpha — new backtest completed</li>
        </ul>
      </div>

      <div className="bg-gradient-to-tr from-indigo-700 to-purple-700 p-4 rounded-xl shadow-lg text-white float-up">
        <div className="text-sm text-gray-200 mb-2">Realtime analysis</div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/6 flex items-center justify-center">AI</div>
          <div>
            <div className="text-sm">Language model</div>
            <div className="text-xs text-gray-200">Latency: <span className="font-mono">{(30 + (ticks % 40))}ms</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
