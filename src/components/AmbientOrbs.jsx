import React, { useRef, useEffect } from 'react'

export default function AmbientOrbs({ count = 6 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = (canvas.width = canvas.clientWidth * devicePixelRatio)
    let h = (canvas.height = canvas.clientHeight * devicePixelRatio)
    ctx.scale(devicePixelRatio, devicePixelRatio)

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // build orbs
    const orbs = []
    for (let i = 0; i < count; i++) {
      orbs.push({
        x: Math.random() * canvas.clientWidth,
        y: Math.random() * canvas.clientHeight,
        r: 40 + Math.random() * 80,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        hue: 180 + Math.random() * 120,
        alpha: 0.03 + Math.random() * 0.06,
      })
    }

    function resize() {
      w = canvas.width = canvas.clientWidth * devicePixelRatio
      h = canvas.height = canvas.clientHeight * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    let raf = null
    function draw() {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      for (const o of orbs) {
        if (!prefersReduced) {
          o.x += o.vx
          o.y += o.vy
          // wrap
          if (o.x < -o.r) o.x = canvas.clientWidth + o.r
          if (o.x > canvas.clientWidth + o.r) o.x = -o.r
          if (o.y < -o.r) o.y = canvas.clientHeight + o.r
          if (o.y > canvas.clientHeight + o.r) o.y = -o.r
        }

        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        grad.addColorStop(0, `hsla(${o.hue},70%,65%, ${o.alpha})`)
        grad.addColorStop(0.5, `hsla(${o.hue},70%,55%, ${o.alpha * 0.4})`)
        grad.addColorStop(1, `hsla(${o.hue},70%,45%, 0)`)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!prefersReduced) raf = requestAnimationFrame(draw)
    }

    if (!prefersReduced) raf = requestAnimationFrame(draw)
    else draw()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [count])

  return (
    <div className="absolute inset-0 pointer-events-none -z-10">
      <canvas ref={ref} className="w-full h-full block" />
    </div>
  )
}
