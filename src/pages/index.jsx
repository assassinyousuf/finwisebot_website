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

function LiveNews(){
  const samples = [
    { text: 'AAPL up 2.3% after stronger-than-expected guidance', ticker: 'AAPL' },
    { text: 'TSLA announces new battery partnership, shares jump', ticker: 'TSLA' },
    { text: 'NVDA extends rally on AI chip demand', ticker: 'NVDA' },
    { text: 'MSFT sees steady cloud growth in Q3', ticker: 'MSFT' },
  ]
  // Avoid rendering timestamps during SSR to prevent hydration mismatches.
  const [mounted, setMounted] = useState(false)
  const [feed, setFeed] = useState(() => samples.map((s,i)=>({ ...s, id: i, time: Date.now() - (i*60000) })))

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => {
      const item = samples[Math.floor(Math.random()*samples.length)]
      const rec = { ...item, id: Date.now(), time: Date.now() }
      setFeed(f => [rec, ...f].slice(0, 8))
    }, 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="space-y-2">
      {feed.map(f => (
        <div key={f.id} className="flex items-start justify-between p-3 rounded-md bg-slate-900/30">
          <div>
            <div className="text-sm text-slate-200">{f.text}</div>
            <div className="text-xs text-slate-400 mt-1">{f.ticker}{mounted ? ` · ${new Date(f.time).toLocaleTimeString()}` : ''}</div>
          </div>
          <div className="ml-4 text-xs text-emerald-300 font-semibold">LIVE</div>
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

      {/* Minimalistic homepage */}
      <main className="min-h-[70vh] flex flex-col items-center justify-start py-16 px-6">
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">FinWisebot</h1>
          <p className="mt-4 text-lg text-slate-400">Market intelligence made simple. Peek into stocks, learn, and get advice.</p>

          {/* Centered search */}
          <div className="mt-8">
            <div className="flex items-center gap-3 bg-slate-800/10 border border-slate-700 rounded-full px-4 py-2">
              <input aria-label="Search ticker" className="flex-1 bg-transparent placeholder:text-slate-500 text-white px-3 py-3 rounded-full focus:outline-none" placeholder="Search (e.g. AAPL, TSLA)" />
              <button className="px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold">Search</button>
            </div>
          </div>

          {/* Live news section */}
          <div className="mt-10 text-left">
            <h3 className="text-lg font-semibold text-white mb-3">Live Market Updates</h3>
            <LiveNews />
          </div>

          {/* PeekoChat section */}
          <div className="mt-10 text-left w-full">
            <h3 className="text-lg font-semibold text-white mb-2">PeekoChat</h3>
            <p className="text-sm text-slate-400 mb-4">Peek into stocks, learn about them, and get advice from the chat. Login to start a PeekoChat session.</p>

            <div>
              {user ? (
                <div>
                  <ChatWidget />
                </div>
              ) : (
                <div className="bg-slate-800/20 rounded-lg p-6 border border-slate-700 text-center">
                  <p className="text-slate-300 mb-4">Please log in to use PeekoChat.</p>
                  <a href="/login" className="inline-flex items-center px-4 py-2 bg-emerald-500 text-black rounded-md font-semibold">Log in</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
