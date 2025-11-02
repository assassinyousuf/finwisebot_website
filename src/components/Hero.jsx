import React from 'react'
import dynamic from 'next/dynamic'

const AmbientOrbs = dynamic(() => import('./AmbientOrbs'), { ssr: false })

export default function Hero({ landing = {}, user = null }) {
  const title = landing?.hero?.title || 'FinWisebot'
  const subtitle = landing?.hero?.subtitle || 'AI analysis, backtesting and cited research — all in one place.'
  return (
    <header className="hero-bg text-white min-h-screen flex flex-col justify-center items-center text-center p-6 relative overflow-hidden">
      <AmbientOrbs />
      <div className="container max-w-6xl w-full relative z-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="px-4">
            <div className="hero-card bg-white/5 backdrop-blur-md border border-white/6 rounded-3xl px-8 py-10 shadow-xl max-w-xl float-up relative overflow-hidden entrance">
              <h1 className="hero-title font-heading mb-4 gradient-text">{title}</h1>
              <p className="hero-subtitle text-lg mb-6">{subtitle}</p>

              <div className="flex items-center gap-4 flex-wrap">
                {user ? (
                  <a href="/demo" className="cta-primary">Open Chat</a>
                ) : (
                  <a href="/demo" className="btn-cta">Try Demo</a>
                )}
                <a href="/features" className="cta-ghost">Explore Features</a>
                <a href="/pricing" className="text-sm text-white/70 px-3 py-2">Pricing</a>
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm text-white/70">
                {(landing?.stats || []).map((s) => (
                  <div key={s.label} className="badge-soft">
                    <div className="text-sm font-semibold">{s.value}</div>
                    <div className="text-xs text-white/60">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="absolute -right-10 -bottom-10 w-52 h-52 rounded-2xl bg-gradient-to-br from-white/6 to-transparent blur-lg opacity-60 transform rotate-6"></div>
            </div>
          </div>

          <div className="px-4">
            <div className="flex justify-center md:justify-end">
              <div className="transform hover:scale-[1.02] transition-all duration-500 entrance">
                <div className="bg-gradient-to-br from-slate-800/60 to-black/30 rounded-2xl p-4 shadow-2xl glass">
                  {/* Showcase / demo area uses existing HeroShowcase and ChatWidget components inside index */}
                  <div style={{ width: 520, maxWidth: '100%' }}>
                    {/* Keep visual consistency by rendering placeholders that existing page will render next to Hero */}
                    <div className="mb-4">
                      {/* Hero showcase will be rendered by parent index if desired */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
