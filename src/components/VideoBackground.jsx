import { useEffect, useRef } from 'react';

// Canvas-based animated background that emulates a market-motion video.
export default function VideoBackground() {
  const mountRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = mountRef.current;
    if (!container) return;
    if (prefersReduced) {
      // Render a simple dark gradient fallback for reduced motion users
      container.style.background = 'linear-gradient(180deg, rgba(7,20,40,1) 0%, rgba(15,42,75,1) 100%)';
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.className = 'hero-canvas-bg';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let DPR = window.devicePixelRatio || 1;
    function resize() {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.max(300, Math.floor(rect.width * DPR));
      canvas.height = Math.max(150, Math.floor(rect.height * DPR));
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    // Create multiple moving sparklines
    const lanes = [];
    const laneCount = 5;
    const baseLen = 160;
    for (let i = 0; i < laneCount; i++) {
      const arr = [];
      let v = 50 + i * 6 + Math.random() * 18;
      for (let j = 0; j < baseLen; j++) {
        v += (Math.random() - 0.48) * (0.6 + i * 0.18);
        arr.push(v);
      }
      lanes.push({ points: arr, speed: 0.12 + Math.random() * 0.22, hue: 180 + i * 18, offset: i * 0.02 });
    }

    let last = performance.now();
    function draw(now) {
      const dt = Math.min(40, now - last);
      last = now;
      const rect = container.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      ctx.clearRect(0, 0, W, H);

      // subtle vignette / gradient backdrop
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, 'rgba(7,20,40,1)');
      grad.addColorStop(1, 'rgba(10,25,45,1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // faint grid lines horizontally
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 1;
      for (let y = H * 0.2; y < H; y += H * 0.12) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); ctx.closePath();
      }

      // draw lanes
      lanes.forEach((lane, idx) => {
        // shift the data by speed
        lane.offset += lane.speed * (dt / 16);
        const pts = lane.points;
        const len = pts.length;
        // compute path scaled to width/height
        ctx.beginPath();
        for (let i = 0; i < len; i++) {
          const t = (i / (len - 1));
          const x = t * W;
          const norm = (pts[(i + Math.floor(lane.offset)) % len] - 10) / 120; // normalize
          const y = H * (0.5 - (norm - idx * 0.02) * 0.7);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        // glow fill
        const col = `hsl(${lane.hue} 70% ${idx % 2 ? '55%' : '48%'})`;
        ctx.strokeStyle = `rgba(100,200,210,${0.18 - idx * 0.02})`;
        ctx.lineWidth = 1.8 - idx * 0.22;
        ctx.stroke();

        // subtle filled under the curve
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
        const g = ctx.createLinearGradient(0, H * 0.1, 0, H);
        const alpha = 0.06 - idx * 0.008;
        g.addColorStop(0, `rgba(6,182,212,${alpha})`);
        g.addColorStop(1, 'rgba(7,20,40,0)');
        ctx.fillStyle = g;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />
  );
}
