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

    // Create multiple moving sparklines with smoothing state
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
      lanes.push({ points: arr, targetOffset: i * 0.02, offset: i * 0.02, speed: 0.06 + Math.random() * 0.12, hue: 180 + i * 18 });
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

      // draw lanes with smooth offset interpolation for calmer motion
      lanes.forEach((lane, idx) => {
        // ease current offset toward targetOffset to smooth movement
        lane.targetOffset += lane.speed * (dt / 160) * 0.5; // advance target slowly
        lane.offset += (lane.targetOffset - lane.offset) * 0.08; // lerp
        const pts = lane.points;
        const len = pts.length;
        // compute path scaled to width/height with slight smoothing in y
        ctx.beginPath();
        let prevY = null;
        for (let i = 0; i < len; i++) {
          const t = (i / (len - 1));
          const x = t * W;
          const idxPt = (i + Math.floor(lane.offset)) % len;
          const raw = pts[idxPt];
          const norm = (raw - 10) / 120;
          const yRaw = H * (0.5 - (norm - idx * 0.02) * 0.7);
          const y = prevY === null ? yRaw : prevY + (yRaw - prevY) * 0.12; // smooth step
          prevY = y;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        // glow stroke
        ctx.strokeStyle = `rgba(100,200,210,${0.12 - idx * 0.015})`;
        ctx.lineWidth = 1.2 - idx * 0.12;
        ctx.stroke();

        // subtle filled under the curve (very light)
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
        const g = ctx.createLinearGradient(0, H * 0.1, 0, H);
        const alpha = 0.04 - idx * 0.006;
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
