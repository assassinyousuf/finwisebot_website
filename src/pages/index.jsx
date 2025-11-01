import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import dynamic from 'next/dynamic';

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

      <header className="bg-gradient-to-b from-[#071428] via-[#0A1931] to-[#0f2a4b] text-white min-h-screen flex flex-col justify-center items-center text-center p-6 relative overflow-hidden">
  {/* optional video watermark (place /background.mp4 in public/) */}
  <VideoBackground />
  <HeroMarketBackground />
  <HeroLiveChart height={260} />
  <div className="max-w-3xl relative z-40">
          <div className="bg-white/5 backdrop-blur-md border border-white/6 rounded-2xl px-10 py-8 shadow-xl max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-heading mb-4">FinWisebot</h1>
            <p className="text-lg md:text-xl mb-6 text-white/90">Turn raw filings, news, and sentiment into concise, cited insights — and test your trading ideas with reliable backtests.</p>
            <div className="flex items-center justify-center gap-4">
              <a href="/demo" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90">Try Demo</a>
              <a href="/features" className="border border-white/20 text-white px-5 py-3 rounded-lg">Explore Features</a>
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
