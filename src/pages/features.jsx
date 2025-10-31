import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';

export default function Features() {
  return (
    <div>
      <Navbar />
      <main className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard icon="📈" title="Real-Time Insights" description="Summaries from filings, news, and social sentiment." />
        <FeatureCard icon="💹" title="Signal Engine" description="Actionable trading ideas." />
        <FeatureCard icon="📊" title="Backtesting" description="Validate strategies against historical data." />
        <FeatureCard icon="🧾" title="Cited Research" description="Every claim linked to sources." />
      </main>
      <Footer />
    </div>
  );
}
