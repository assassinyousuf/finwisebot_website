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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <Navbar />

      <header className="relative px-4 sm:px-6 py-12 sm:py-16 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Powerful Features
                  </span>
                  <span className="text-white"> for Modern Quant Finance</span>
                </h1>
                <p className="text-gray-300 mb-6 text-sm sm:text-base">This frontend demo showcases client-side RAG, an interactive Signal Generator, profile & auth flows, and a responsive UI. Backtesting is coming soon as an in-browser demo.</p>
                <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start gap-3 justify-center md:justify-start">
                  <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl text-center w-full sm:w-auto border border-white/10">
                    <div className="text-2xl font-bold text-cyan-400">{users.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Active users</div>
                  </div>
                  <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl text-center w-full sm:w-auto border border-white/10">
                    <div className="text-2xl font-bold text-purple-400">{strategies.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Strategies</div>
                  </div>
                  <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl text-center w-full sm:w-auto border border-white/10">
                    <div className="text-2xl font-bold text-pink-400">{signals.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Signals</div>
                  </div>
                </div>
                <div className="mt-6 flex justify-center overflow-x-auto">
                  <svg width="300" height="100" viewBox="0 0 350 120" className="text-cyan-400 min-w-[300px]">
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
                    <text x="5" y="75" fontSize="8" fill="rgba(255,255,255,0.8)">$100</text>
                    <text x="55" y="55" fontSize="8" fill="rgba(255,255,255,0.8)">$120</text>
                    <text x="105" y="85" fontSize="8" fill="rgba(255,255,255,0.8)">$90</text>
                    <text x="155" y="35" fontSize="8" fill="rgba(255,255,255,0.8)">$140</text>
                    <text x="205" y="65" fontSize="8" fill="rgba(255,255,255,0.8)">$110</text>
                    <text x="255" y="45" fontSize="8" fill="rgba(255,255,255,0.8)">$130</text>
                    <text x="305" y="55" fontSize="8" fill="rgba(255,255,255,0.8)">$115</text>
                    {/* Labels */}
                    <text x="0" y="110" fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle">Jan</text>
                    <text x="50" y="110" fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle">Feb</text>
                    <text x="100" y="110" fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle">Mar</text>
                    <text x="150" y="110" fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle">Apr</text>
                    <text x="200" y="110" fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle">May</text>
                    <text x="250" y="110" fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle">Jun</text>
                    <text x="300" y="110" fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle">Jul</text>
                    <text x="-8" y="20" fontSize="8" fill="rgba(255,255,255,0.7)" textAnchor="middle" transform="rotate(-90 -8 20)">$150</text>
                    <text x="-8" y="50" fontSize="8" fill="rgba(255,255,255,0.7)" textAnchor="middle" transform="rotate(-90 -8 50)">$125</text>
                    <text x="-8" y="80" fontSize="8" fill="rgba(255,255,255,0.7)" textAnchor="middle" transform="rotate(-90 -8 80)">$100</text>
                    <text x="-8" y="100" fontSize="8" fill="rgba(255,255,255,0.7)" textAnchor="middle" transform="rotate(-90 -8 100)">$75</text>
                    {/* Title */}
                    <text x="150" y="10" fontSize="11" fill="rgba(255,255,255,0.9)" textAnchor="middle" fontWeight="bold">Sample Stock Price Trend</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 entrance">
        <FeatureCard slug="real-time-insights" dark icon="📈" title="Real-Time Insights" description="Summaries from filings, news, and social sentiment (demo data)." accent="from-cyan-400 to-blue-500" />
        <FeatureCard slug="client-rag" dark icon="🧠" title="Client RAG (Demo)" description="In-browser document retrieval and cited answers — useful for demos and prototyping." accent="from-purple-400 to-pink-500" />
        <FeatureCard slug="signal-engine" dark icon="⚡" title="Signal Generator (Demo)" description="Manually emit sample signals to drive visualizers and chat via the fw:signal bridge." accent="from-yellow-400 to-orange-500" />
        <FeatureCard slug="backtesting" dark icon="📊" title="Backtesting (Coming Soon)" description="Lightweight in-browser backtest planned — runs simple strategies on uploaded CSVs." accent="from-cyan-400 to-teal-500" />
        <FeatureCard slug="cited-research" dark icon="🧾" title="Cited Research" description="Every claim can be linked to source snippets in the demo; citations appear under bot replies." accent="from-purple-400 to-indigo-500" />
        <FeatureCard slug="profile-auth" dark icon="👤" title="Profile & Demo Auth" description="Local-only accounts, avatar, and password reset flows for self-contained demos." accent="from-blue-400 to-cyan-500" />
        <FeatureCard slug="responsive" dark icon="📱" title="Responsive & Accessible" description="Mobile-friendly layout, improved focus states, and ARIA-ready components." accent="from-gray-400 to-slate-500" />
        <FeatureCard slug="integrations" dark icon="🤝" title="Integrations" description="Connectors & broker integrations planned for later phases." accent="from-green-400 to-emerald-500" />
      </main>

      <Footer />
    </div>
  );
}
