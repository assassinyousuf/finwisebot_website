import React from 'react'

export default function HeroShowcase() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-white/3 to-white/2 border border-white/6 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-xl font-semibold">Strategy Snapshot</h3>
            <p className="text-sm text-white/70">Preview P&L, signals and confidence</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-300 font-medium">Live</div>
            <div className="text-xs text-white/60">Simulated</div>
          </div>
        </div>

        {/* Mock sparkline chart */}
        <div className="bg-gradient-to-b from-white/2 to-transparent rounded-xl p-3 mb-4">
          <svg viewBox="0 0 200 60" className="w-full h-16">
            <defs>
              <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#5eead4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            <path d="M0 40 C30 20, 60 10, 90 20 C120 30, 150 18, 180 12 L200 12" fill="url(#g1)" stroke="#60f0c4" strokeWidth="2" strokeOpacity="0.95" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0 40 C30 20, 60 10, 90 20 C120 30, 150 18, 180 12 L200 12" fill="none" stroke="#a7f3d0" strokeWidth="1.5" strokeOpacity="0.7" />
          </svg>
        </div>

        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex-1 bg-white/3 p-3 rounded-lg">
            <div className="text-xs text-white/70">Return</div>
            <div className="text-lg font-semibold text-white">+12.4%</div>
          </div>
          <div className="flex-1 bg-white/3 p-3 rounded-lg">
            <div className="text-xs text-white/70">Win Rate</div>
            <div className="text-lg font-semibold text-white">68%</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex-1 bg-accent text-black font-semibold py-2 rounded-lg">Open Demo</button>
          <button className="px-3 py-2 border border-white/10 rounded-lg text-white/90">Details</button>
        </div>
      </div>
      <div className="mt-3 text-xs text-white/60 text-center">No API keys required — simulated data</div>
    </div>
  )
}
