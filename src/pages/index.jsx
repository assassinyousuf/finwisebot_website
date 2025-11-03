import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import dynamic from 'next/dynamic';
import HeroShowcase from '../components/HeroShowcase';
import ChatWidget from '../components/ChatWidget';
const PredictionWidget = dynamic(() => import('../components/PredictionWidget'), { ssr: false })
import { useEffect, useState } from 'react'
import mockApi from '../lib/mockApi'

const Testimonials = dynamic(() => import('../components/Testimonials'), { ssr: false })

// Ambient orbs are client-only to avoid SSR/hydration issues
const AmbientOrbs = dynamic(() => import('../components/AmbientOrbs'), { ssr: false });

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

      {/* Clean bold hero */}
      <main className="container mx-auto px-6 pt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Bold headline & CTA */}
            <div className="py-12">
              <p className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-700">Live Demo</p>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">FinWisebot — AI research & strategy insights for traders</h1>
              <p className="mt-6 text-lg text-slate-300 max-w-2xl">Instantly summarize filings, test strategies, and generate confidence-scored predictions — all in a lightweight frontend demo you can point at your own backend later.</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a className="inline-flex items-center px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-md" href="#try-demo">Try demo</a>
                <a className="inline-flex items-center px-5 py-3 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800" href="#features">Features</a>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="bg-slate-800/40 rounded-xl p-4">
                  <div className="text-sm text-slate-300">Return</div>
                  <div className="mt-2 text-xl font-semibold">+12.4%</div>
                </div>
                <div className="bg-slate-800/40 rounded-xl p-4">
                  <div className="text-sm text-slate-300">Win Rate</div>
                  <div className="mt-2 text-xl font-semibold">68%</div>
                </div>
              </div>
            </div>

            {/* Right: Demo card (chat + prediction) */}
            <div id="try-demo" className="py-6">
              <div className="bg-gradient-to-br from-slate-800/70 to-black/40 rounded-2xl p-6 shadow-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Interactive demo</h3>
                    <p className="text-sm text-slate-400">Chat with the demo assistant or run a quick synthetic prediction.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <ChatWidget compact />
                  </div>
                  <div className="pt-2">
                    <PredictionWidget />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature grid */}
          <section id="features" className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon="📈" title="Real-Time Insights" description="Summaries, signals and cited insights from filings and news." dark />
            <FeatureCard icon="💹" title="Signal Engine" description="Actionable trading ideas and confidence scores." dark />
            <FeatureCard icon="📊" title="Backtesting" description="Validate strategies against historical data." dark />
            <FeatureCard icon="📝" title="Cited Research" description="Traceable sources for every claim." dark />
          </section>

          {/* Testimonials (kept as a block for social proof) */}
          <div className="mt-16">
            <Testimonials />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
