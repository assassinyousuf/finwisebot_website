export default function SignalList({ signals = [], onClick }) {
  return (
    <div className="bg-white/5 p-3 rounded-xl shadow-md">
      <div className="text-sm font-semibold mb-3">Recent signals</div>
      <ul className="space-y-2 text-sm">
        {signals.map((s, i) => (
          <li key={i} className="flex items-center justify-between gap-2">
            <button onClick={() => onClick && onClick(s)} className="text-left flex-1">
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
  );
}
