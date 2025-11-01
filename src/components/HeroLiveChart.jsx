import { useRef, useEffect, useState } from 'react';

export default function HeroLiveChart({ height = 220 }) {
  const [points, setPoints] = useState(() => {
    const arr = [];
    let v = 100 + Math.random() * 10;
    for (let i = 0; i < 140; i++) {
      v += (Math.random() - 0.48) * 2.6;
      arr.push(v);
    }
    return arr;
  });

  const raf = useRef();
  const svgRef = useRef();

  useEffect(() => {
    let running = true;
    const stepTick = () => {
      setPoints(prev => {
        const last = prev[prev.length - 1] ?? 100;
        // much smaller, smoother noise for elegant motion
        const noise = (Math.random() - 0.5) * (0.5 + Math.random() * 0.6);
        const next = Math.max(5, last + noise);
        const nextArr = prev.slice(1).concat(next);
        return nextArr;
      });
      if (running) raf.current = requestAnimationFrame(() => setTimeout(stepTick, 220 + Math.random() * 260));
    };
    raf.current = requestAnimationFrame(stepTick);
    return () => { running = false; cancelAnimationFrame(raf.current); };
  }, []);

  const w = 1200; // internal svg coordinate width
  const pad = 12;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const mapY = (v) => pad + (1 - (v - min) / (max - min || 1)) * (height - pad * 2);
  const stepX = w / (points.length - 1);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * stepX} ${mapY(p)}`).join(' ');
  const latest = points[points.length - 1];
  const prev = points[points.length - 2] ?? latest;
  const up = latest >= prev;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
      <div className="w-full max-w-6xl px-6" style={{ height }}>
        <svg ref={svgRef} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="w-full h-full opacity-48 blur-[0.3px]">
          <defs>
            <linearGradient id="heroGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={up ? '#0ea5a9' : '#fb7185'} stopOpacity="0.14" />
              <stop offset="100%" stopColor="#071428" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d={path} fill={`url(#heroGradient)`} stroke="none" />
          <path d={path} fill="none" stroke={up ? '#06b6d4' : '#fb7185'} strokeWidth="1.6" strokeLinecap="round" filter="url(#glow)" strokeOpacity="0.95" />
          {/* subtle marker */}
          <circle cx={(points.length - 1) * stepX} cy={mapY(latest)} r="4" fill={up ? '#34d399' : '#f87171'} opacity="0.9" />
        </svg>
      </div>
    </div>
  );
}
