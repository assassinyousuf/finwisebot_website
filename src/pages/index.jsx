import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FeatureCard from '../../components/FeatureCard';

export default function Home() {
  return (
    <div>
      <Navbar />
      <header className="bg-primary text-white h-screen flex flex-col justify-center items-center text-center p-4">
        <h1 className="text-5xl font-heading mb-4">FinWisebot</h1>
        <p className="text-xl mb-6">Your AI-powered financial analyst. Summaries, insights, and backtested trading signals.</p>
        <a href="/demo" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90">Try Demo</a>
      </header>

      <section className="py-20 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard 
          icon="📈" 
          title="Real-Time Insights" 
          description="Get instant summaries and cited insights from filings, news, and social sentiment." 
        />
        <FeatureCard 
          icon="💹" 
          title="Signal Engine" 
          description="Generate actionable trading ideas based on sentiment and market events." 
        />
        <FeatureCard 
          icon="📊" 
          title="Backtesting" 
          description="Test strategies against historical data to validate performance before execution." 
        />
        <FeatureCard 
          icon="📝" 
          title="Cited Research" 
          description="Every claim is linked to reliable sources for full transparency." 
        />
      </section>

      <Footer />
    </div>
  );
}
