import { useRef, useEffect, useState } from 'react';

export default function StockTicker({ symbol = 'AAPL', width = 280, height = 64 }) {
  const [points, setPoints] = useState(() => {
    const arr = [];
    let v = 100 + Math.random() * 20;
    for (let i = 0; i < 60; i++) {
      v += (Math.random() - 0.48) * 1.8;
      arr.push(v);
    }
    return arr;
  });

  const rafRef = useRef();

  useEffect(() => {
    let running = true;
    const tick = () => {
      setPoints(prev => {
        const last = prev[prev.length - 1] ?? 100;
        const next = Math.max(10, last + (Math.random() - 0.48) * 2.5);
        const nextArr = prev.slice(1).concat(next);
        return nextArr;
      });
      if (running) rafRef.current = requestAnimationFrame(() => setTimeout(tick, 220 + Math.random() * 180));
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  const min = Math.min(...points);
  const max = Math.max(...points);

  const mapY = (v) => {
    // map to SVG coords (padding 6)
    const pad = 6;
    const h = height - pad * 2;
    return pad + (1 - (v - min) / (max - min || 1)) * h;
  };

  const step = width / (points.length - 1);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${mapY(p)}`).join(' ');

  const latest = points[points.length - 1].toFixed(2);
  const prev = points[points.length - 2] ?? points[points.length - 1];
  const up = latest >= prev;

  return (
    <div className="bg-slate-900/30 p-3 rounded-lg shadow-inner border border-white/5 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-white/90 font-medium">{symbol}</div>
        <div className={`text-sm font-semibold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>{up ? '▲' : '▼'} ${latest}</div>
      </div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id={`g-${symbol}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={up ? '#10b981' : '#ef4444'} stopOpacity="0.26" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={path} fill={`url(#g-${symbol})`} stroke="none" />
        <path d={path} fill="none" stroke={up ? '#34d399' : '#f87171'} strokeWidth="2" strokeOpacity="0.95" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
