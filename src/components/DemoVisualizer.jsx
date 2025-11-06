import { useEffect, useState } from 'react';

function MiniChart({ seed = 0 }) {
  const dataPoints = Array.from({length: 15}, (_, i) => {
    const base = 25
    const variation = Math.sin(i * 0.4 + seed * 0.05) * 8 + Math.sin(i * 0.7) * 4
    return Math.max(5, Math.min(45, base + variation))
  })

  const pathData = dataPoints.map((point, i) => {
    const x = (i / (dataPoints.length - 1)) * 100
    const y = 50 - point
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  const areaPath = `M0 50 ${pathData} L100 50 Z`

  return (
    <svg viewBox="0 0 100 50" className="w-full h-full">
      <defs>
        <linearGradient id={`mini-gradient-${seed}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
        </linearGradient>
        <filter id={`mini-glow-${seed}`}>
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Area fill */}
      <path
        d={areaPath}
        fill={`url(#mini-gradient-${seed})`}
        className="transition-all duration-300"
      />

      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke="#10b981"
        strokeWidth="1.5"
        filter={`url(#mini-glow-${seed})`}
        className="transition-all duration-300"
      />

      {/* End dot */}
      <circle
        cx="100"
        cy={50 - dataPoints[dataPoints.length - 1]}
        r="1.5"
        fill="#10b981"
        className="animate-pulse"
      />
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
      {/* Enhanced Market Snapshot */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl text-white border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="text-sm font-semibold text-white">Market Snapshot</div>
          </div>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1 text-xs focus:border-cyan-400/50 focus:outline-none hover:bg-white/20 transition-colors"
          >
            <option>FINX</option>
            <option>NVDA</option>
            <option>TSLA</option>
            <option>AAPL</option>
            <option>MSFT</option>
            <option>GOOGL</option>
          </select>
        </div>

        {/* Main Price Display */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white">{symbol}</h3>
            <span className="text-xs text-gray-400">NASDAQ</span>
          </div>
          <div className="text-3xl font-bold text-white">
            ${(123.45 + (ticks % 7) / 10).toFixed(2)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-green-400 text-sm font-medium">+3.42%</span>
            <span className="text-gray-400 text-xs">+4.15</span>
          </div>
        </div>

        {/* Enhanced Chart */}
        <div className="mb-4 relative">
          <div className="h-24 bg-gradient-to-t from-slate-800/50 to-transparent rounded-lg p-3">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 80"
              className="overflow-visible"
            >
              {/* Gradient definition */}
              <defs>
                <linearGradient id={`gradient-${symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                </linearGradient>
                <filter id={`glow-${symbol}`}>
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Area fill */}
              <path
                d={`M0,80 ${Array.from({length: 20}, (_, i) => {
                  const x = (i / 19) * 200
                  const baseValue = 40
                  const variation = Math.sin(i * 0.5 + ticks * 0.1) * 15 + Math.sin(i * 0.3) * 10
                  const y = 80 - (baseValue + variation)
                  return `L${x},${y}`
                }).join(' ')} L200,80 Z`}
                fill={`url(#gradient-${symbol})`}
                className="transition-all duration-500"
              />

              {/* Line */}
              <path
                d={`M0,${80 - (40 + Math.sin(0 * 0.5 + ticks * 0.1) * 15 + Math.sin(0 * 0.3) * 10)} ${Array.from({length: 20}, (_, i) => {
                  const x = (i / 19) * 200
                  const baseValue = 40
                  const variation = Math.sin(i * 0.5 + ticks * 0.1) * 15 + Math.sin(i * 0.3) * 10
                  const y = 80 - (baseValue + variation)
                  return `L${x},${y}`
                }).join(' ')}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                filter={`url(#glow-${symbol})`}
                className="transition-all duration-500"
              />

              {/* Animated data points */}
              {Array.from({length: 5}, (_, i) => {
                const dataIndex = Math.floor((i / 4) * 19)
                const x = (dataIndex / 19) * 200
                const baseValue = 40
                const variation = Math.sin(dataIndex * 0.5 + ticks * 0.1) * 15 + Math.sin(dataIndex * 0.3) * 10
                const y = 80 - (baseValue + variation)
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="#10b981"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                )
              })}
            </svg>
          </div>

          {/* Time indicators */}
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span className="text-cyan-400">9:30 AM</span>
            <span className="text-white font-medium">LIVE</span>
            <span className="text-cyan-400">4:00 PM</span>
          </div>
        </div>

        {/* Market Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400 mb-1">Volume</div>
            <div className="text-sm font-semibold text-white">2.4M</div>
            <div className="text-xs text-green-400">+12.3%</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400 mb-1">Avg Volume</div>
            <div className="text-sm font-semibold text-white">1.8M</div>
            <div className="text-xs text-gray-400">20D</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400 mb-1">Market Cap</div>
            <div className="text-sm font-semibold text-white">$2.1B</div>
            <div className="text-xs text-gray-400">Rank #847</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-gray-400 mb-1">P/E Ratio</div>
            <div className="text-sm font-semibold text-white">24.5</div>
            <div className="text-xs text-gray-400">Sector: 22.1</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            {expanded ? 'Collapse' : 'Expand View'}
          </button>
          <button className="bg-white/10 border border-white/20 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
            Watch
          </button>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-white/10 animate-fade">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">52W High</span>
                <span className="text-sm font-medium text-white">$145.20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">52W Low</span>
                <span className="text-sm font-medium text-white">$89.30</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Beta</span>
                <span className="text-sm font-medium text-white">1.24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Dividend Yield</span>
                <span className="text-sm font-medium text-white">2.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">EPS</span>
                <span className="text-sm font-medium text-white">$5.23</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="float-up">
        {/* Use SignalList structure inline to avoid extra import */}
        <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl shadow-md border border-white/10">
          <div className="text-sm font-semibold mb-3 text-white">Recent signals</div>
          <ul className="space-y-2 text-sm">
            {signals.map((s, i) => (
              <li key={i} className="flex items-center justify-between gap-2">
                <button onClick={() => onSignalClick && onSignalClick(s)} className="text-left flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${s.status === 'buy' ? 'bg-cyan-400' : s.status === 'sell' ? 'bg-red-400' : 'bg-purple-400'}`}></div>
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

      <div className="bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 p-4 rounded-xl shadow-lg text-white float-up border border-white/10">
        <div className="text-sm text-gray-200 mb-2">Realtime analysis</div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">AI</div>
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
