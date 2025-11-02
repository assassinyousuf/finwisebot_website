import React, { useRef, useEffect } from 'react'

export default function GlobalBackground() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = (canvas.width = canvas.clientWidth * devicePixelRatio)
    let h = (canvas.height = canvas.clientHeight * devicePixelRatio)
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // particles
    const particles = []
    const PARTICLE_COUNT = Math.max(24, Math.floor((canvas.clientWidth * canvas.clientHeight) / 80000))
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.clientWidth,
        y: Math.random() * canvas.clientHeight,
        r: 1 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        hue: 190 + Math.random() * 60,
        alpha: 0.12 + Math.random() * 0.18,
      })
    }

    function resize() {
      w = canvas.width = canvas.clientWidth * devicePixelRatio
      h = canvas.height = canvas.clientHeight * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    let raf = null
    function draw(t) {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      // base animated radial gradient
      const g = ctx.createLinearGradient(0, 0, canvas.clientWidth, canvas.clientHeight)
      g.addColorStop(0, 'rgba(6,22,39,0.95)')
      g.addColorStop(0.35, 'rgba(8,28,50,0.85)')
      g.addColorStop(1, 'rgba(2,12,25,0.9)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      // subtle moving stripes
      ctx.globalCompositeOperation = 'overlay'
      ctx.fillStyle = 'rgba(255,255,255,0.01)'
      const stripeW = 140
      const offset = (t * 0.02) % stripeW
      for (let x = -stripeW; x < canvas.clientWidth + stripeW; x += stripeW) {
        ctx.fillRect(x + offset, 0, stripeW / 3, canvas.clientHeight)
      }
      ctx.globalCompositeOperation = 'source-over'

      // draw particles
      for (const p of particles) {
        if (!prefersReduced) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < -10) p.x = canvas.clientWidth + 10
          if (p.x > canvas.clientWidth + 10) p.x = -10
          if (p.y < -10) p.y = canvas.clientHeight + 10
          if (p.y > canvas.clientHeight + 10) p.y = -10
        }
        const rg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8)
        rg.addColorStop(0, `hsla(${p.hue},70%,60%, ${p.alpha})`)
        rg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = rg
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2)
        ctx.fill()
      }

      // faint grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.02)'
      ctx.lineWidth = 1
      const gap = 120
      for (let x = 0; x < canvas.clientWidth; x += gap) {
        ctx.beginPath()
        ctx.moveTo(x + ((t * 0.03) % gap), 0)
        ctx.lineTo(x + ((t * 0.03) % gap), canvas.clientHeight)
        ctx.stroke()
      }

      if (!prefersReduced) raf = requestAnimationFrame(draw)
    }

    if (!prefersReduced) raf = requestAnimationFrame(draw)
    else draw(0)

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="global-bg fixed inset-0 pointer-events-none -z-50">
      <canvas ref={ref} className="w-full h-full block" />
      {/* subtle overlay vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30 mix-blend-overlay pointer-events-none" />
    </div>
  )
}
