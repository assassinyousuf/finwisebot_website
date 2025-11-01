import { useMemo } from 'react';

function makePoints(seed = 0, len = 80) {
  const arr = [];
  let v = 100 + (seed % 10) * 3 + Math.random() * 10;
  for (let i = 0; i < len; i++) {
    v += (Math.random() - 0.5) * 4;
    arr.push(v);
  }
  return arr;
}

export default function HeroMarketBackground({ count = 6 }) {
  const svgs = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const points = makePoints(i, 90);
      const min = Math.min(...points);
      const max = Math.max(...points);
      const width = 520;
      const height = 120;
      const pad = 6;
      const mapY = (v) => pad + (1 - (v - min) / (max - min || 1)) * (height - pad * 2);
      const step = width / (points.length - 1);
      const path = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${idx * step} ${mapY(p)}`).join(' ');
      const up = points[points.length - 1] >= points[0];
      return { path, width, height, up };
    });
  }, [count]);

  return (
  <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />
      <div className="relative w-full h-full overflow-hidden">
        {svgs.map((s, idx) => {
          const left = Math.round((idx / svgs.length) * 100 + Math.random() * 4 - 2);
          const top = Math.round(12 + (idx % 3) * 10 + Math.random() * 6 - 3);
          const dur = 40 + Math.round(Math.random() * 40);
          // reduced bob amplitude and opacity for a subtler background
          const bob = 2 + Math.round(Math.random() * 3);
          return (
            <svg
              key={idx}
              className={`hero-spark absolute opacity-12`} 
              style={{ left: `${left}%`, top: `${top}%`, width: `${s.width}px`, height: `${s.height}px`, transformOrigin: 'center', animation: `drift ${dur}s linear infinite, bob ${dur/8}s ease-in-out ${idx * 0.4}s infinite` }}
              viewBox={`0 0 ${s.width} ${s.height}`}
            >
              <defs>
                <linearGradient id={`hg-${idx}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={s.up ? '#10b981' : '#ef4444'} stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={s.path} fill={`url(#hg-${idx})`} stroke="none" />
                <path d={s.path} fill="none" stroke={s.up ? '#34d399' : '#f87171'} strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes drift { from { transform: translateX(0px); } to { transform: translateX(-6%); } }
        @keyframes bob { 0% { transform: translateY(0px); } 50% { transform: translateY(-2px); } 100% { transform: translateY(0px); } }
        .hero-spark { mix-blend-mode: screen; filter: blur(.2px); }
      `}</style>
    </div>
  );
}
