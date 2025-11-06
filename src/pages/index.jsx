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
function generateSparkline(values = [], w = 80, h = 28, color = "#60E0A6", showGradient = false) {
  if (!values || values.length === 0) return null
  const max = Math.max(...values)
  const min = Math.min(...values)
  const len = values.length
  const id = `spark-${Math.random().toString(36).substr(2, 9)}`

  const points = values.map((v, i) => {
    const x = (i / (len - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * h
    return `${x},${y}`
  }).join(' ')

  const areaPoints = `0,${h} ${points} ${w},${h}`

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
      <defs>
        {showGradient && (
          <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        )}
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {showGradient && (
        <path
          d={areaPoints}
          fill={`url(#gradient-${id})`}
          className="transition-all duration-300"
        />
      )}

      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter={`url(#glow-${id})`}
        className="transition-all duration-300"
      />

      {/* Animated end dot */}
      <circle
        cx={(len - 1) / (len - 1) * w}
        cy={h - ((values[len - 1] - min) / (max - min || 1)) * h}
        r="2"
        fill={color}
        className="animate-pulse"
      />
    </svg>
  )
}

function Watchlist() {
  // Avoid accessing localStorage during SSR. Load items on client mount.
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    setMounted(true)
    try {
      const stored = JSON.parse(localStorage.getItem('fw_watchlist') || '[]')
      setItems(stored)
    } catch (e) {
      setItems([])
    }
  }, [])

  // Persist only after mount to avoid SSR/client mismatch
  useEffect(()=>{ if (mounted) localStorage.setItem('fw_watchlist', JSON.stringify(items)) }, [items, mounted])

  function add(symbol){
    if (!symbol) return
    setItems(s => { if (s.find(x=>x.symbol===symbol)) return s; return [...s, { symbol, price: (100 + Math.random()*900).toFixed(2), change: (Math.random()*2-1).toFixed(2) }] })
  }

  function remove(sym){ setItems(s => s.filter(x=>x.symbol !== sym)) }

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <input id="wl-input" className="flex-1 bg-transparent border border-gray-600 dark:border-gray-500 rounded px-3 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400" placeholder="Add ticker (e.g. AAPL)" onKeyDown={(e)=>{ if(e.key==='Enter'){ add(e.target.value.trim().toUpperCase()); e.target.value=''} }} />
        <button className="px-3 py-2 bg-gray-700 dark:bg-gray-600 rounded border border-gray-600 dark:border-gray-500 text-sm text-white dark:text-gray-100" onClick={()=>{ const el = document.getElementById('wl-input'); if(el) { add(el.value.trim().toUpperCase()); el.value='' } }}>Add</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr><th className="pb-2">Symbol</th><th className="pb-2">Price</th><th className="pb-2">Change</th><th className="pb-2"/></tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.symbol} className="border-t border-gray-700 dark:border-gray-600">
                <td className="py-3 font-semibold text-gray-900 dark:text-white">{it.symbol}</td>
                <td className="py-3 text-gray-900 dark:text-white">{mounted ? `$${it.price}` : ''}</td>
                <td className={`py-3 ${Number(it.change) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{mounted ? Number(it.change).toFixed(2) + '%' : ''}</td>
                <td className="py-3"><button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" onClick={()=>remove(it.symbol)}>Remove</button></td>
              </tr>
            ))}
            {items.length===0 && <tr><td colSpan={4} className="py-6 text-gray-500 dark:text-gray-400">Your watchlist is empty. Add a ticker above and press Enter.</td></tr>}
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
        <div key={n.id} className="p-3 rounded-md hover:bg-gray-800 dark:hover:bg-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-200 dark:text-gray-100 font-semibold">{n.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{n.src} · {n.time}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function LiveNews(){
  const samples = [
    { text: 'AAPL surges 3.2% after stronger-than-expected guidance', ticker: 'AAPL', sentiment: 'positive', impact: 'high' },
    { text: 'TSLA announces new battery partnership with major automaker', ticker: 'TSLA', sentiment: 'positive', impact: 'medium' },
    { text: 'NVDA extends rally on AI chip demand surge', ticker: 'NVDA', sentiment: 'positive', impact: 'high' },
    { text: 'MSFT sees steady cloud growth in Q3 earnings', ticker: 'MSFT', sentiment: 'neutral', impact: 'medium' },
    { text: 'Oil prices rise 2.1% on supply concerns', ticker: 'CL=F', sentiment: 'negative', impact: 'medium' },
    { text: 'Federal Reserve signals potential rate pause', ticker: '^TNX', sentiment: 'positive', impact: 'high' },
  ]

  // Avoid creating random prices/sparks during SSR. Enrich feed only on client mount.
  const [mounted, setMounted] = useState(false)
  const [feed, setFeed] = useState(() => samples.map((s,i)=>({ ...s, id: i, time: Date.now() - (i*60000) })))

  useEffect(() => {
    setMounted(true)
    // enrich existing items with price/change/spark on client
    setFeed(f => f.map(x => ({
      ...x,
      price: +(100 + Math.random()*900).toFixed(2),
      change: ((Math.random()*2-1)).toFixed(2),
      sparkValues: Array.from({length:8}).map(()=>100+Math.random()*40),
      volume: Math.floor(Math.random() * 1000000) + 10000
    })))

    const t = setInterval(() => {
      const item = samples[Math.floor(Math.random()*samples.length)]
      const rec = {
        ...item,
        id: Date.now(),
        time: Date.now(),
        price: +(100 + Math.random()*900).toFixed(2),
        change: ((Math.random()*2-1)).toFixed(2),
        sparkValues: Array.from({length:8}).map(()=>100+Math.random()*40),
        volume: Math.floor(Math.random() * 1000000) + 10000
      }
      setFeed(f => [rec, ...f].slice(0, 8))
    }, 4000) // Update every 4 seconds for more realistic news flow
    return () => clearInterval(t)
  }, [])

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'from-emerald-500/20 to-green-500/20 border-emerald-500/30'
      case 'negative': return 'from-red-500/20 to-rose-500/20 border-red-500/30'
      case 'neutral': return 'from-slate-500/20 to-gray-500/20 border-slate-500/30'
      default: return 'from-slate-500/20 to-gray-500/20 border-slate-500/30'
    }
  }

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  return (
    <div className="space-y-3">
      {feed.map((f, index) => (
        <div
          key={f.id}
          className={`relative group overflow-hidden rounded-xl bg-gradient-to-r ${getSentimentColor(f.sentiment)} backdrop-blur-sm border p-4 transition-all duration-300 hover:scale-102`}
          style={{
            animationDelay: `${index * 100}ms`,
            animation: mounted ? 'slideInLeft 0.5s ease-out forwards' : 'none'
          }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              {/* Impact indicator */}
              <div className="flex-shrink-0">
                <div className="text-lg">{getImpactIcon(f.impact)}</div>
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-sm font-bold text-white">{f.ticker}</div>
                  <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    f.sentiment === 'positive' ? 'bg-emerald-500/20 text-emerald-300' :
                    f.sentiment === 'negative' ? 'bg-red-500/20 text-red-300' :
                    'bg-slate-500/20 text-slate-300'
                  }`}>
                    {f.sentiment.toUpperCase()}
                  </div>
                </div>
                <div className="text-sm text-gray-200 leading-relaxed">{f.text}</div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{mounted ? new Date(f.time).toLocaleTimeString() : ''}</span>
                  <span>•</span>
                  <span>Vol: {mounted ? (f.volume / 1000).toFixed(0) + 'K' : ''}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
              <div className="text-right">
                <div className="text-sm text-white font-bold">
                  {mounted && f.price ? `$${f.price}` : ''}
                </div>
                <div className={`text-xs ${Number(f.change) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {mounted && f.change ? (Number(f.change) >= 0 ? '+' : '') + Number(f.change) + '%' : ''}
                </div>
              </div>

              <div className="w-16 sm:w-20">
                {mounted && f.sparkValues ? generateSparkline(
                  f.sparkValues,
                  60,
                  28,
                  Number(f.change) >= 0 ? "#10b981" : "#ef4444",
                  false
                ) : <div style={{height:28}} />}
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="text-xs text-green-400 font-medium">LIVE</div>
              </div>
            </div>
          </div>

          {/* Subtle glow effect */}
          <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            f.sentiment === 'positive' ? 'shadow-lg shadow-emerald-500/10' :
            f.sentiment === 'negative' ? 'shadow-lg shadow-red-500/10' :
            'shadow-lg shadow-slate-500/10'
          }`}></div>
        </div>
      ))}

      {/* News feed stats */}
      <div className="mt-4 p-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">Live Feed</span>
            </div>
            <div className="text-slate-400">
              {feed.length} active stories
            </div>
          </div>
          <div className="text-slate-400">
            Updates every 4s
          </div>
        </div>
      </div>
    </div>
  )
}

function MarketOverview(){
  const indices = [
    { name: 'S&P 500', ticker: '^GSPC', sector: 'Broad Market', type: 'index' },
    { name: 'Dow 30', ticker: '^DJI', sector: 'Blue Chip', type: 'index' },
    { name: 'Nasdaq', ticker: '^IXIC', sector: 'Technology', type: 'index' },
    { name: 'Russell 2000', ticker: '^RUT', sector: 'Small Cap', type: 'index' },
    { name: 'VIX', ticker: '^VIX', sector: 'Volatility', type: 'index' },
    { name: 'Bitcoin', ticker: 'BTC-USD', sector: 'Cryptocurrency', type: 'crypto' },
  ]

  // Avoid rendering dynamic text during SSR to prevent hydration mismatches.
  const [mounted, setMounted] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [liveData, setLiveData] = useState({})

  useEffect(() => {
    setMounted(true)

    // Simulate live data updates
    const interval = setInterval(() => {
      setLiveData(prev => {
        const newData = { ...prev }
        indices.forEach(index => {
          const basePrice = index.type === 'crypto' ? 50000 + Math.random() * 30000 : 2000 + Math.random() * 3000
          const change = (Math.random() - 0.5) * 4 // -2% to +2%
          const volume = Math.floor(Math.random() * 1000000) + 100000
          newData[index.ticker] = {
            price: basePrice * (1 + change / 100),
            change: change,
            volume: volume,
            marketCap: index.type === 'crypto' ? basePrice * 21000000 : basePrice * 1000000,
            pe: index.type === 'index' ? null : (10 + Math.random() * 20),
            lastUpdate: Date.now()
          }
        })
        return newData
      })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [])

  const data = indices.map(i => ({
    ...i,
    ...(liveData[i.ticker] || {
      price: i.type === 'crypto' ? 50000 + Math.random() * 30000 : 2000 + Math.random() * 3000,
      change: (Math.random() - 0.5) * 4,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      marketCap: i.type === 'crypto' ? 50000000000 : 2000000000,
      pe: i.type === 'index' ? null : (10 + Math.random() * 20),
      lastUpdate: Date.now()
    }),
    spark: Array.from({length:20}).map((_, idx) => {
      const base = i.type === 'crypto' ? 50000 : 2000
      return base + Math.sin(idx * 0.5) * 500 + Math.random() * 200
    })
  }))

  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T'
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num.toFixed(2)
  }

  const formatPrice = (price, ticker) => {
    if (ticker.includes('BTC') || ticker.includes('USD')) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    }
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div className="space-y-6">
      {/* Market Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400 font-medium">MARKETS OPEN</span>
          <span className="text-xs text-gray-400">Last updated: {mounted ? new Date().toLocaleTimeString() : ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
          <span className="text-xs text-cyan-400">LIVE DATA</span>
        </div>
      </div>

      {/* Market Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.map(d => {
          const isPositive = d.change >= 0
          const isSelected = selectedIndex === d.ticker
          const liveUpdate = liveData[d.ticker]

          return (
            <div
              key={d.ticker}
              className={`relative group cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'transform scale-105'
                  : 'hover:scale-102'
              }`}
              onClick={() => setSelectedIndex(isSelected ? null : d.ticker)}
            >
              {/* Glow effect for selected */}
              {isSelected && (
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-lg animate-pulse"></div>
              )}

              {/* Main Card */}
              <div className={`relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 ${
                isSelected
                  ? 'border-cyan-400/50 shadow-2xl shadow-cyan-500/10'
                  : 'border-slate-700/50 hover:border-slate-600/50 hover:shadow-xl hover:shadow-slate-500/5'
              }`}>

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{d.name}</h3>
                      {liveUpdate && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{d.sector}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                      isPositive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {isPositive ? '+' : ''}{d.change.toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="mb-4">
                  <div className="text-2xl font-bold text-white">
                    ${formatPrice(d.price, d.ticker)}
                  </div>
                  <div className={`text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPositive ? '↗' : '↘'} {Math.abs(d.change).toFixed(2)}% today
                  </div>
                </div>

                {/* Enhanced Sparkline Chart */}
                <div className="mb-4 relative">
                  <div className="h-16 bg-gradient-to-t from-slate-800/50 to-transparent rounded-lg p-2">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 200 60"
                      className="overflow-visible"
                    >
                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id={`gradient-${d.ticker}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
                          <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.05" />
                        </linearGradient>
                        <filter id={`glow-${d.ticker}`}>
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Area fill */}
                      <path
                        d={`M0,60 ${d.spark.map((val, idx) => {
                          const x = (idx / (d.spark.length - 1)) * 200
                          const max = Math.max(...d.spark)
                          const min = Math.min(...d.spark)
                          const y = 60 - ((val - min) / (max - min || 1)) * 50
                          return `L${x},${y}`
                        }).join(' ')} L200,60 Z`}
                        fill={`url(#gradient-${d.ticker})`}
                        className="transition-all duration-500"
                      />

                      {/* Line */}
                      <path
                        d={`M0,${60 - ((d.spark[0] - Math.min(...d.spark)) / (Math.max(...d.spark) - Math.min(...d.spark) || 1)) * 50} ${d.spark.map((val, idx) => {
                          const x = (idx / (d.spark.length - 1)) * 200
                          const max = Math.max(...d.spark)
                          const min = Math.min(...d.spark)
                          const y = 60 - ((val - min) / (max - min || 1)) * 50
                          return `L${x},${y}`
                        }).join(' ')}`}
                        fill="none"
                        stroke={isPositive ? "#10b981" : "#ef4444"}
                        strokeWidth="2"
                        filter={`url(#glow-${d.ticker})`}
                        className="transition-all duration-500"
                      />

                      {/* Animated dots */}
                      {isSelected && (
                        <>
                          {d.spark.map((val, idx) => {
                            if (idx % 4 !== 0) return null // Show every 4th point
                            const x = (idx / (d.spark.length - 1)) * 200
                            const max = Math.max(...d.spark)
                            const min = Math.min(...d.spark)
                            const y = 60 - ((val - min) / (max - min || 1)) * 50
                            return (
                              <circle
                                key={idx}
                                cx={x}
                                cy={y}
                                r="3"
                                fill={isPositive ? "#10b981" : "#ef4444"}
                                className="animate-pulse"
                              />
                            )
                          })}
                        </>
                      )}
                    </svg>
                  </div>

                  {/* Time indicators */}
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1H</span>
                    <span>NOW</span>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-slate-400">Volume</div>
                    <div className="text-white font-medium">{formatNumber(d.volume)}</div>
                  </div>
                  {d.pe && (
                    <div>
                      <div className="text-slate-400">P/E</div>
                      <div className="text-white font-medium">{d.pe.toFixed(1)}</div>
                    </div>
                  )}
                  {d.type === 'crypto' && (
                    <div>
                      <div className="text-slate-400">Market Cap</div>
                      <div className="text-white font-medium">{formatNumber(d.marketCap)}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-slate-400">Status</div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                </div>

                {/* Expand indicator */}
                <div className="absolute bottom-2 right-2 text-slate-500">
                  {isSelected ? '−' : '+'}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Market Summary Stats */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          Market Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {data.filter(d => d.change > 0).length}
            </div>
            <div className="text-xs text-slate-400">Gainers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {data.filter(d => d.change < 0).length}
            </div>
            <div className="text-xs text-slate-400">Decliners</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {formatNumber(data.reduce((sum, d) => sum + d.volume, 0))}
            </div>
            <div className="text-xs text-slate-400">Total Volume</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {((data.reduce((sum, d) => sum + d.change, 0) / data.length)).toFixed(2)}%
            </div>
            <div className="text-xs text-slate-400">Avg Change</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Trending(){
  const tickers = ['AAPL','TSLA','NVDA','MSFT','AMZN']
  // Avoid rendering random numbers during SSR
  const [mounted, setMounted] = useState(false)
  const [vals, setVals] = useState(() => tickers.map(t => ({ symbol: t })))

  useEffect(() => {
    setMounted(true)
    setVals(tickers.map(t => ({ symbol: t, price: (100+Math.random()*900).toFixed(2), spark: Array.from({length:8}).map(()=>100+Math.random()*40) })))
  }, [])

  return (
    <div className="space-y-3">
      {vals.map(v => (
        <div key={v.symbol} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-semibold text-white dark:text-gray-100">{v.symbol}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{mounted && v.price ? `$${v.price}` : ''}</div>
          </div>
          <div>
            {mounted && v.spark ? generateSparkline(v.spark) : <div style={{height:28}} />}
          </div>
        </div>
      ))}
    </div>
  )
}

function SearchBar(){
  const [q, setQ] = useState('')
  const [result, setResult] = useState(null)

  function performSearch() {
    const symbol = (q || '').trim().toUpperCase()
    if (!symbol) return
    // synthetic demo quote
    const price = +(100 + Math.random()*900).toFixed(2)
    const change = ((Math.random()*2-1)).toFixed(2)
    const sparkValues = Array.from({length:12}).map(()=>price - (Math.random()*6))
    const res = { symbol, price, change, sparkValues }
    setResult(res)
  }

  function addToWatchlist(sym){
    try{
      const key = 'fw_watchlist'
      const cur = JSON.parse(localStorage.getItem(key) || '[]')
      if (!cur.find(x=>x.symbol===sym)) cur.push({ symbol: sym, price: (+((100+Math.random()*900).toFixed(2))), change: (Math.random()*2-1).toFixed(2) })
      localStorage.setItem(key, JSON.stringify(cur))
      alert(`${sym} added to watchlist (demo).`)
    } catch(e){ console.warn(e); alert('Failed to add') }
  }

  function openInPeekoChat(sym){
    try { localStorage.setItem('peek_selected', sym) } catch(e){}
    // navigate to demo (PeekoChat)
    window.location.href = '/PeekoChat'
  }

  return (
    <div>
      <div className="flex items-center gap-3 bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-full px-4 py-2">
        <input aria-label="Search ticker" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') performSearch() }} className="flex-1 bg-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-white px-3 py-3 rounded-full focus:outline-none" placeholder="Search (e.g. AAPL, TSLA)" />
        <button onClick={performSearch} className="px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold">Search</button>
      </div>

      {result && (
        <div className="mt-4 bg-gray-900 dark:bg-gray-800 border border-gray-700 dark:border-gray-600 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">{result.symbol}</div>
            <div className="text-2xl font-semibold text-white dark:text-gray-100">${result.price}</div>
            <div className={`text-sm ${result.change.startsWith('-') ? 'text-rose-400' : 'text-emerald-400'}`}>{result.change}%</div>
          </div>
          <div className="flex-1 min-w-0">
            {generateSparkline(result.sparkValues, 120, 40)}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <button onClick={()=>addToWatchlist(result.symbol)} className="px-3 py-2 bg-gray-700 dark:bg-gray-600 rounded text-sm text-white dark:text-gray-100 hover:bg-gray-600 dark:hover:bg-gray-500 transition">Add to Watchlist</button>
            <button onClick={()=>openInPeekoChat(result.symbol)} className="px-3 py-2 bg-emerald-500 rounded text-sm text-black font-semibold hover:bg-emerald-400 transition">Open in PeekoChat</button>
          </div>
        </div>
      )}
    </div>
  )
}
export default function Home() {
  const [landing, setLanding] = useState(null)
  const [user, setUser] = useState(null)
  const [animate, setAnimate] = useState(false)

  useEffect(()=>{
    const timer = setTimeout(() => setAnimate(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(()=>{
    let mounted = true
    mockApi.getLanding().then(j=>{ if (mounted && j && j.ok) setLanding(j.data) }).catch(()=>{})
    // fetch basic auth state to adjust CTA
    mockApi.getMe().then(j=>{ if (mounted && j && j.ok) setUser(j.user) }).catch(()=>{})
    return ()=>{ mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className={`relative z-10 max-w-6xl mx-auto text-center transform transition-all duration-1000 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Main Title */}
          <div className="mb-6">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                FinWise
              </span>
              <span className="text-white">bot</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto rounded-full"></div>
          </div>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI-powered financial intelligence for smarter investing.
            <span className="block text-lg sm:text-xl text-gray-400 mt-2">
              Summaries, backtesting, signals & research — all in one place.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="#search"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Exploring
            </a>
            <a
              href="/features"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400">10K+</div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">500+</div>
              <div className="text-sm text-gray-400">Stocks Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-pink-400">99.9%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search" className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Explore Markets</h2>
            <p className="text-gray-400 text-lg">Search for stocks, add to watchlist, and get instant insights</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Market Overview</h2>
            <p className="text-gray-400 text-lg">Real-time market data and trending indicators</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <MarketOverview />
          </div>
        </div>
      </section>

      {/* Live Updates & PeekoChat */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Live Market Updates */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              Live Market Updates
            </h3>
            <LiveNews />
          </div>

          {/* PeekoChat */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">AI Assistant</h3>
            <p className="text-gray-400 mb-6">Get personalized insights and analysis with our AI-powered chat assistant.</p>

            {user ? (
              <div className="space-y-4">
                <ChatWidget />
                <div className="text-center">
                  <a
                    href="/PeekoChat"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105"
                  >
                    Open Full Chat
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-gray-300 mb-4">Sign in to unlock AI-powered insights</div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/login"
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-gray-400 text-lg mb-12">Everything you need for informed investment decisions</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Market Analysis</h3>
              <p className="text-gray-400">Advanced technical analysis and market insights powered by AI</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Backtesting</h3>
              <p className="text-gray-400">Test trading strategies against historical data with detailed performance metrics</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Chat</h3>
              <p className="text-gray-400">Interactive AI assistant for personalized investment advice and market insights</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
