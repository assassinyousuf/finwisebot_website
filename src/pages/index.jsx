import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';

export default function Home() {
  return (
    <div>
      <Head>
        <title>FinWisebot — AI financial analyst</title>
        <meta name="description" content="FinWisebot: AI-powered summaries, backtesting and cited research for smarter markets." />
      </Head>

      <Navbar />

      <header className="bg-gradient-to-b from-[#071428] via-[#0A1931] to-[#0f2a4b] text-white min-h-screen flex flex-col justify-center items-center text-center p-6">
        <div className="max-w-3xl">
          <h1 className="text-6xl font-heading mb-6">FinWisebot</h1>
          <p className="text-xl mb-8 opacity-90">Turn raw filings, news, and sentiment into concise, cited insights — and test your trading ideas with reliable backtests.</p>
          <div className="flex items-center justify-center gap-4">
            <a href="/demo" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90">Try Demo</a>
            <a href="/features" className="border border-white/20 text-white px-5 py-3 rounded-lg">Explore Features</a>
          </div>
        </div>
      </header>

      <section className="py-20 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50">
        <FeatureCard 
          icon="📈" 
          title="Real-Time Insights" 
          description="Instant summaries and cited insights from filings, news, and social sentiment." 
        />
        <FeatureCard 
          icon="💹" 
          title="Signal Engine" 
          description="Generate actionable trading ideas driven by sentiment and events." 
        />
        <FeatureCard 
          icon="📊" 
          title="Backtesting" 
          description="Validate strategies against historical data before risking capital." 
        />
        <FeatureCard 
          icon="📝" 
          title="Cited Research" 
          description="All claims are linked to reliable sources for full transparency." 
        />
      </section>

      <Footer />
    </div>
  );
}
