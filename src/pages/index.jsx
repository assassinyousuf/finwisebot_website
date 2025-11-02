import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import dynamic from 'next/dynamic';
import HeroShowcase from '../components/HeroShowcase';
import ChatWidget from '../components/ChatWidget';
import { useEffect, useState } from 'react'

// Ambient orbs are client-only to avoid SSR/hydration issues
const AmbientOrbs = dynamic(() => import('../components/AmbientOrbs'), { ssr: false });

export default function Home() {
  const [landing, setLanding] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(()=>{
    let mounted = true
    fetch('/api/landing').then(r=>r.json()).then(j=>{
      if (mounted && j && j.ok) setLanding(j.data)
    }).catch(()=>{})
    // fetch basic auth state to adjust CTA
    fetch('/api/me', { credentials: 'include' }).then(r=>r.json()).then(j=>{
      if (mounted && j && j.ok) setUser(j.user)
    }).catch(()=>{})
    return ()=>{ mounted = false }
  }, [])
  return (
    <div>
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

  <header className="hero-bg text-white min-h-screen flex flex-col justify-center items-center text-center p-6 relative overflow-hidden">
  <AmbientOrbs />
  <div className="max-w-6xl w-full relative z-40">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="px-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/6 rounded-3xl px-8 py-10 shadow-xl max-w-xl float-up relative overflow-hidden">
          <h1 className="hero-title font-heading mb-4 gradient-text">{landing?.hero?.title || 'FinWisebot'}</h1>
          <p className="text-lg mb-6 text-white/85">{landing?.hero?.subtitle || 'AI analysis, backtesting and cited research — all in one place.'}</p>

          <div className="flex items-center gap-4 flex-wrap">
            {user ? (
              <a href="/demo" className="cta-primary">Open Chat</a>
            ) : (
              <a href="/demo" className="btn-cta">Try Demo</a>
            )}
            <a href="/features" className="border border-white/20 text-white px-5 py-3 rounded-lg">Explore Features</a>
            <a href="/pricing" className="text-sm text-white/70 px-3 py-2">Pricing</a>
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm text-white/70">
            {(landing?.stats || []).map(s=> (
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
          <div className="transform hover:scale-[1.02] transition-all duration-500">
            <div className="bg-gradient-to-br from-slate-800/60 to-black/30 rounded-2xl p-4 shadow-2xl glass">
              <HeroShowcase />
              <div className="mt-4">
                <ChatWidget />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
      </header>
      <section className="py-20 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-900">
        <FeatureCard 
          icon="📈" 
          title="Real-Time Insights" 
          description="Instant summaries and cited insights from filings, news, and social sentiment." 
          dark
        />
        <FeatureCard 
          icon="💹" 
          title="Signal Engine" 
          description="Generate actionable trading ideas driven by sentiment and events." 
          dark
        />
        <FeatureCard 
          icon="📊" 
          title="Backtesting" 
          description="Validate strategies against historical data before risking capital." 
          dark
        />
        <FeatureCard 
          icon="📝" 
          title="Cited Research" 
          description="All claims are linked to reliable sources for full transparency." 
          dark
        />
      </section>

      <Footer />
    </div>
  );
}
