import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import dynamic from 'next/dynamic';
import HeroShowcase from '../components/HeroShowcase';
import ChatWidget from '../components/ChatWidget';
const PredictionWidget = dynamic(() => import('../components/PredictionWidget'), { ssr: false })
import { useEffect, useState, useMemo } from 'react'
import mockApi from '../lib/mockApi'

const Testimonials = dynamic(() => import('../components/Testimonials'), { ssr: false })

// Ambient orbs are client-only to avoid SSR/hydration issues
const AmbientOrbs = dynamic(() => import('../components/AmbientOrbs'), { ssr: false });

// --- Small inline components for the homepage ---
function generateSparkline(values = [], w = 80, h = 28) {
  if (!values || values.length === 0) return null
  const max = Math.max(...values)
  const min = Math.min(...values)
  const len = values.length
  const points = values.map((v, i) => {
    const x = (i / (len - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
      <polyline points={points} fill="none" stroke="#60E0A6" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.95" />
    </svg>
  )
}

function Watchlist() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fw_watchlist') || '[]') } catch(e){ return [] }
  })

  useEffect(()=>{ localStorage.setItem('fw_watchlist', JSON.stringify(items)) }, [items])

  function add(symbol){
    if (!symbol) return
    setItems(s => { if (s.find(x=>x.symbol===symbol)) return s; return [...s, { symbol, price: (100 + Math.random()*900).toFixed(2), change: (Math.random()*2-1).toFixed(2) }] })
  }

  function remove(sym){ setItems(s => s.filter(x=>x.symbol !== sym)) }

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <input id="wl-input" className="flex-1 bg-transparent border border-slate-700 rounded px-3 py-2 text-white placeholder:text-slate-400" placeholder="Add ticker (e.g. AAPL)" onKeyDown={(e)=>{ if(e.key==='Enter'){ add(e.target.value.trim().toUpperCase()); e.target.value=''} }} />
        <button className="px-3 py-2 bg-slate-700/60 rounded border border-slate-600 text-sm" onClick={()=>{ const el = document.getElementById('wl-input'); if(el) { add(el.value.trim().toUpperCase()); el.value='' } }}>Add</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400 text-xs">
            <tr><th className="pb-2">Symbol</th><th className="pb-2">Price</th><th className="pb-2">Change</th><th className="pb-2"/></tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.symbol} className="border-t border-slate-700/40">
                <td className="py-3 font-semibold text-white">{it.symbol}</td>
                <td className="py-3">${it.price}</td>
                <td className={`py-3 ${Number(it.change) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{Number(it.change).toFixed(2)}%</td>
                <td className="py-3"><button className="text-sm text-slate-400 hover:text-white" onClick={()=>remove(it.symbol)}>Remove</button></td>
              </tr>
            ))}
            {items.length===0 && <tr><td colSpan={4} className="py-6 text-slate-400">Your watchlist is empty. Add a ticker above and press Enter.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function NewsList(){
  const news = useMemo(()=>[
    { id:1, title: 'Market opens higher as tech leads gains', src: 'Reuters', time: '2h ago' },
    { id:2, title: 'Quarterly earnings beat expectations for major banks', src: 'Bloomberg', time: '5h ago' },
    { id:3, title: 'New guidance suggests cautious optimism on growth', src: 'WSJ', time: '1d ago' },
  ],[])

  return (
    <div className="space-y-3">
      {news.map(n => (
        <div key={n.id} className="p-3 rounded-md hover:bg-slate-800/30">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-slate-200 font-semibold">{n.title}</div>
              <div className="text-xs text-slate-400">{n.src} · {n.time}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Trending(){
  const tickers = ['AAPL','TSLA','NVDA','MSFT','AMZN']
  return (
    <div className="space-y-3">
      {tickers.map(t => (
        <div key={t} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-semibold text-white">{t}</div>
            <div className="text-xs text-slate-400">${(100+Math.random()*900).toFixed(2)}</div>
          </div>
          <div>
            {generateSparkline(Array.from({length:8}).map(()=>100+Math.random()*40))}
          </div>
        </div>
      ))}
    </div>
  )
}
export default function Home() {
  const [landing, setLanding] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(()=>{
    let mounted = true
    mockApi.getLanding().then(j=>{ if (mounted && j && j.ok) setLanding(j.data) }).catch(()=>{})
    // fetch basic auth state to adjust CTA
    mockApi.getMe().then(j=>{ if (mounted && j && j.ok) setUser(j.user) }).catch(()=>{})
    return ()=>{ mounted = false }
  }, [])
  return (
    <div className="min-h-screen">
      <Head>
        <title>FinWisebot — AI financial analyst</title>
        <meta name="description" content="FinWisebot: AI-powered summaries, backtesting and cited research for smarter markets." />
        <meta property="og:title" content="FinWisebot — AI financial analyst" />
        <meta property="og:description" content="FinWisebot: AI-powered summaries, backtesting and cited research for smarter markets." />
        <meta property="og:image" content="/favicon.svg" />
        <meta name="theme-color" content="#071428" />
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>

      <Navbar />

      {/* YFinance-like homepage */}
      <main className="container mx-auto px-6 pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Search bar */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              <input aria-label="Search ticker" className="flex-1 bg-transparent placeholder:text-slate-400 text-white px-4 py-3 rounded-lg border border-slate-700 focus:outline-none" placeholder="Search symbol, company name, or keyword (e.g. AAPL, Tesla)" value={''} onChange={()=>{}} />
              <button className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-md text-black font-semibold">Search</button>
            </div>
            <div className="mt-3 text-sm text-slate-400">Try: AAPL, MSFT, TSLA — demo search performs a synthetic lookup using the frontend mock API.</div>
          </div>

          {/* Market summary tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { name: 'S&P 500', value: '4,567.23', change: '+0.72%' },
              { name: 'Dow Jones', value: '35,123.45', change: '-0.12%' },
              { name: 'Nasdaq', value: '13,789.12', change: '+1.04%' },
            ].map((m) => (
              <div key={m.name} className="bg-gradient-to-br from-slate-800/60 to-black/30 rounded-lg p-4 border border-slate-700">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-sm text-slate-400">{m.name}</div>
                    <div className="mt-1 text-2xl font-semibold text-white">{m.value}</div>
                  </div>
                  <div className={`text-sm font-semibold ${m.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{m.change}</div>
                </div>
                <div className="mt-3 h-8 bg-slate-700/40 rounded-md"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Watchlist + News */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Watchlist</h3>
                  <div className="text-sm text-slate-400">Prices are simulated</div>
                </div>

                <Watchlist />
              </div>

              <div className="bg-slate-800/20 rounded-xl border border-slate-700 p-4">
                <h3 className="text-lg font-semibold mb-3">Latest News</h3>
                <NewsList />
              </div>
            </div>

            {/* Right column: Trending tickers / mini charts */}
            <div>
              <div className="bg-slate-800/20 rounded-xl border border-slate-700 p-4 mb-6">
                <h4 className="text-sm text-slate-300 font-semibold mb-3">Trending Tickers</h4>
                <Trending />
              </div>

              <div className="bg-slate-800/20 rounded-xl border border-slate-700 p-4">
                <h4 className="text-sm text-slate-300 font-semibold mb-3">Quick Prediction</h4>
                <PredictionWidget />
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Testimonials />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
