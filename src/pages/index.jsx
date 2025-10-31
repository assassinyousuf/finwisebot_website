import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import StockTicker from '../components/StockTicker';

export default function Home() {
  return (
    <div>
      <Head>
        <title>FinWisebot — AI financial analyst</title>
        <meta name="description" content="FinWisebot: AI-powered summaries, backtesting and cited research for smarter markets." />
      </Head>

      <Navbar />

      <header className="bg-gradient-to-b from-[#071428] via-[#0A1931] to-[#0f2a4b] text-white min-h-screen flex flex-col justify-center items-center text-center p-6 relative overflow-hidden">
        <div className="max-w-3xl">
          <h1 className="text-6xl font-heading mb-6">FinWisebot</h1>
          <p className="text-xl mb-8 opacity-90">Turn raw filings, news, and sentiment into concise, cited insights — and test your trading ideas with reliable backtests.</p>
          <div className="flex items-center justify-center gap-4">
            <a href="/demo" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90">Try Demo</a>
            <a href="/features" className="border border-white/20 text-white px-5 py-3 rounded-lg">Explore Features</a>
          </div>
        </div>
        
        {/* Live tickers row */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StockTicker symbol="AAPL" />
            <StockTicker symbol="NVDA" />
            <StockTicker symbol="TSLA" />
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
