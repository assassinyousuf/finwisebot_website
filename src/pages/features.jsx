import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';

export default function Features() {
  const [users, setUsers] = useState(0);
  const [strategies, setStrategies] = useState(0);
  const [signals, setSignals] = useState(0);

  // simple count-up animation for stats
  useEffect(() => {
    let raf;
    const start = Date.now();
    const duration = 1200;
    const aTarget = 12450, bTarget = 382, cTarget = 94213;

    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // eased
      setUsers(Math.floor(aTarget * ease));
      setStrategies(Math.floor(bTarget * ease));
      setSignals(Math.floor(cTarget * ease));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Navbar />

      <header className="hero-bg px-6 py-16 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="hero-card">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight mb-4">Powerful features for modern quant finance — demo-ready</h1>
                <p className="text-gray-200 mb-6">This frontend demo showcases client-side RAG, an interactive Signal Generator, profile & auth flows, and a responsive UI. Backtesting is coming soon as an in-browser demo.</p>
                <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start gap-3 justify-center md:justify-start">
                  <div className="p-3 bg-white/5 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-300">{users.toLocaleString()}</div>
                    <div className="text-xs text-gray-300">Active users</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg text-center">
                    <div className="text-2xl font-bold text-amber-300">{strategies.toLocaleString()}</div>
                    <div className="text-xs text-gray-300">Strategies</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg text-center">
                    <div className="text-2xl font-bold text-cyan-300">{signals.toLocaleString()}</div>
                    <div className="text-xs text-gray-300">Signals</div>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <svg width="350" height="120" viewBox="0 0 350 120" className="text-green-400">
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="0" y1="100" x2="300" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="100" y1="0" x2="100" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="150" y1="0" x2="150" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="200" y1="0" x2="200" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="250" y1="0" x2="250" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    {/* Chart line */}
                    <path d="M0,80 L50,60 L100,90 L150,40 L200,70 L250,50 L300,60" stroke="currentColor" strokeWidth="2" fill="none" className="draw-line" />
                    {/* Data points */}
                    <circle cx="0" cy="80" r="3" fill="currentColor" />
                    <circle cx="50" cy="60" r="3" fill="currentColor" />
                    <circle cx="100" cy="90" r="3" fill="currentColor" />
                    <circle cx="150" cy="40" r="3" fill="currentColor" />
                    <circle cx="200" cy="70" r="3" fill="currentColor" />
                    <circle cx="250" cy="50" r="3" fill="currentColor" />
                    <circle cx="300" cy="60" r="3" fill="currentColor" />
                    {/* Price labels */}
                    <text x="5" y="75" fontSize="9" fill="rgba(255,255,255,0.8)">$100</text>
                    <text x="55" y="55" fontSize="9" fill="rgba(255,255,255,0.8)">$120</text>
                    <text x="105" y="85" fontSize="9" fill="rgba(255,255,255,0.8)">$90</text>
                    <text x="155" y="35" fontSize="9" fill="rgba(255,255,255,0.8)">$140</text>
                    <text x="205" y="65" fontSize="9" fill="rgba(255,255,255,0.8)">$110</text>
                    <text x="255" y="45" fontSize="9" fill="rgba(255,255,255,0.8)">$130</text>
                    <text x="305" y="55" fontSize="9" fill="rgba(255,255,255,0.8)">$115</text>
                    {/* Labels */}
                    <text x="0" y="110" fontSize="10" fill="rgba(255,255,255,0.7)" textAnchor="middle">Jan</text>
                    <text x="50" y="110" fontSize="10" fill="rgba(255,255,255,0.7)" textAnchor="middle">Feb</text>
                    <text x="100" y="110" fontSize="10" fill="rgba(255,255,255,0.7)" textAnchor="middle">Mar</text>
                    <text x="150" y="110" fontSize="10" fill="rgba(255,255,255,0.7)" textAnchor="middle">Apr</text>
                    <text x="200" y="110" fontSize="10" fill="rgba(255,255,255,0.7)" textAnchor="middle">May</text>
                    <text x="250" y="110" fontSize="10" fill="rgba(255,255,255,0.7)" textAnchor="middle">Jun</text>
                    <text x="300" y="110" fontSize="10" fill="rgba(255,255,255,0.7)" textAnchor="middle">Jul</text>
                    <text x="-10" y="20" fontSize="10" fill="rgba(255,255,255,0.7)" textAnchor="middle" transform="rotate(-90 -10 20)">$150</text>
                    <text x="-10" y="50" fontSize="10" fill="rgba(255,255,255,0.7)" textAnchor="middle" transform="rotate(-90 -10 50)">$125</text>
                    <text x="-10" y="80" fontSize="10" fill="rgba(255,255,255,0.7)" textAnchor="middle" transform="rotate(-90 -10 80)">$100</text>
                    <text x="-10" y="100" fontSize="10" fill="rgba(255,255,255,0.7)" textAnchor="middle" transform="rotate(-90 -10 100)">$75</text>
                    {/* Title */}
                    <text x="150" y="10" fontSize="12" fill="rgba(255,255,255,0.9)" textAnchor="middle" fontWeight="bold">Sample Stock Price Trend</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 entrance">
        <FeatureCard slug="real-time-insights" dark icon="📈" title="Real-Time Insights" description="Summaries from filings, news, and social sentiment (demo data)." accent="from-emerald-300 to-green-400" />
        <FeatureCard slug="client-rag" dark icon="🧠" title="Client RAG (Demo)" description="In-browser document retrieval and cited answers — useful for demos and prototyping." accent="from-pink-300 to-purple-400" />
        <FeatureCard slug="signal-engine" dark icon="⚡" title="Signal Generator (Demo)" description="Manually emit sample signals to drive visualizers and chat via the fw:signal bridge." accent="from-yellow-300 to-amber-400" />
        <FeatureCard slug="backtesting" dark icon="📊" title="Backtesting (Coming Soon)" description="Lightweight in-browser backtest planned — runs simple strategies on uploaded CSVs." accent="from-cyan-300 to-blue-400" />
        <FeatureCard slug="cited-research" dark icon="🧾" title="Cited Research" description="Every claim can be linked to source snippets in the demo; citations appear under bot replies." accent="from-pink-300 to-purple-400" />
        <FeatureCard slug="profile-auth" dark icon="👤" title="Profile & Demo Auth" description="Local-only accounts, avatar, and password reset flows for self-contained demos." accent="from-indigo-300 to-violet-400" />
        <FeatureCard slug="responsive" dark icon="📱" title="Responsive & Accessible" description="Mobile-friendly layout, improved focus states, and ARIA-ready components." accent="from-gray-300 to-slate-400" />
        <FeatureCard slug="integrations" dark icon="🤝" title="Integrations" description="Connectors & broker integrations planned for later phases." accent="from-emerald-200 to-teal-400" />
      </main>

      <Footer />
    </div>
  );
}
