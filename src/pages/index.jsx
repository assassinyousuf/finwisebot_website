import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import dynamic from 'next/dynamic';
import HeroShowcase from '../components/HeroShowcase';

// These components rely on random client-side animations/values.
// Render them client-side only to avoid server/client hydration mismatch.
const StockTicker = dynamic(() => import('../components/StockTicker'), { ssr: false, loading: () => <div className="h-16" /> });
const HeroMarketBackground = dynamic(() => import('../components/HeroMarketBackground'), { ssr: false });
const HeroLiveChart = dynamic(() => import('../components/HeroLiveChart'), { ssr: false });
const VideoBackground = dynamic(() => import('../components/VideoBackground'), { ssr: false });

export default function Home() {
  return (
    <div>
      <Head>
        <title>FinWisebot — AI financial analyst</title>
        <meta name="description" content="FinWisebot: AI-powered summaries, backtesting and cited research for smarter markets." />
      </Head>

      <Navbar />

  <header className="hero-bg text-white min-h-screen flex flex-col justify-center items-center text-center p-6 relative overflow-hidden">
  {/* optional video watermark (place /background.mp4 in public/) */}
  <VideoBackground />
  <HeroMarketBackground />
  <HeroLiveChart height={260} />
  <div className="max-w-6xl w-full relative z-40">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="px-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/6 rounded-2xl px-8 py-8 shadow-xl max-w-xl">
          <h1 className="text-4xl md:text-5xl font-heading mb-4">FinWisebot</h1>
          <p className="text-base md:text-lg mb-6 text-white/90">Turn raw filings, news, and sentiment into concise, cited insights — and test your trading ideas with reliable backtests. Beautifully visualized, and built for rapid iteration.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <a href="/demo" className="bg-accent text-black px-6 py-3 rounded-lg font-semibold hover:opacity-95">Try Demo</a>
            <a href="/features" className="border border-white/20 text-white px-5 py-3 rounded-lg">Explore Features</a>
            <a href="/pricing" className="text-sm text-white/70 px-3 py-2">Pricing</a>
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm text-white/70">
            <div className="bg-white/3 px-3 py-2 rounded-md">Backtest-ready</div>
            <div className="bg-white/3 px-3 py-2 rounded-md">Cited Research</div>
            <div className="bg-white/3 px-3 py-2 rounded-md">Signal Lab</div>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* right-side showcase */}
        <div className="flex justify-center md:justify-end">
          <div className="transform hover:scale-[1.01] transition-all duration-300">
            <HeroShowcase />
          </div>
        </div>
      </div>
    </div>
  </div>
        
        {/* live tickers removed for a cleaner hero (per request) */}
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
