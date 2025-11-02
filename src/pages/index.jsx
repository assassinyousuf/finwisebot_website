import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import dynamic from 'next/dynamic';
import HeroShowcase from '../components/HeroShowcase';
import ChatWidget from '../components/ChatWidget';
import Hero from '../components/Hero';
import dynamic from 'next/dynamic'

const Testimonials = dynamic(() => import('../components/Testimonials'), { ssr: false })
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

      <Hero landing={landing} user={user} />

      {/* Small showcase panel (kept visually next to hero on large screens) */}
      <div className="container mt-[-4rem] mb-8">
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="bg-gradient-to-br from-slate-800/60 to-black/30 rounded-2xl p-4 shadow-2xl glass">
              <HeroShowcase />
              <div className="mt-4">
                <ChatWidget />
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Testimonials */}
      <Testimonials />

      <Footer />
    </div>
  );
}
