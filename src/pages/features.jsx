import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';

function Sparkline({ className = '' }) {
  // Simple animated SVG sparkline for a finance feel
  return (
    <svg viewBox="0 0 100 30" className={`w-full h-16 sparkline ${className}`} preserveAspectRatio="none">
      <path d="M0 24 C15 18 25 8 40 12 C55 16 70 6 85 10 C95 13 100 8 100 8" />
    </svg>
  );
}

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
    <div>
      <Navbar />

      <header className="px-6 py-12 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 float-up">
            <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight mb-4">Powerful features for modern quant finance</h1>
            <p className="text-gray-300 mb-6">FinWisebot blends real-time signals, backtests, and research into a single interface so you can iterate faster and trade smarter.</p>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-green-300 pulse-soft">{users.toLocaleString()}</div>
                <div className="text-xs text-gray-300">Active users</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-amber-300 pulse-soft">{strategies.toLocaleString()}</div>
                <div className="text-xs text-gray-300">Strategies backtested</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-cyan-300 pulse-soft">{signals.toLocaleString()}</div>
                <div className="text-xs text-gray-300">Signals generated</div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="bg-white/6 rounded-xl p-4 shadow-lg">
              <div className="text-sm text-gray-200 mb-2">Live demo</div>
              <div className="bg-gradient-to-tr from-slate-800 to-slate-700 p-4 rounded">
                <Sparkline />
                <div className="flex items-center justify-between mt-3 text-xs text-gray-300">
                  <div>1D</div>
                  <div className="text-sm font-semibold text-green-300">+3.4%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <FeatureCard icon="📈" title="Real-Time Insights" description="Summaries from filings, news, and social sentiment." accent="from-emerald-300 to-green-400" />
        <FeatureCard icon="💹" title="Signal Engine" description="Actionable trading ideas using ensemble models." accent="from-yellow-300 to-amber-400" />
        <FeatureCard icon="📊" title="Backtesting" description="Validate strategies against historical data with event-level accuracy." accent="from-cyan-300 to-blue-400" />
        <FeatureCard icon="🧾" title="Cited Research" description="Every claim linked to primary sources and filings." accent="from-pink-300 to-purple-400" />
        <FeatureCard icon="🔁" title="Workflow Automation" description="Schedule backtests and alerts with priority queues." accent="from-indigo-300 to-violet-400" />
        <FeatureCard icon="🔒" title="Privacy-first" description="Keep your strategies private; export reproducible results." accent="from-gray-300 to-slate-400" />
        <FeatureCard icon="⚡" title="Low-latency" description="Optimized paths for fast signal delivery." accent="from-red-300 to-rose-400" />
        <FeatureCard icon="🤝" title="Integrations" description="Connect to brokers, data feeds, and notebooks." accent="from-emerald-200 to-teal-400" />
      </main>

      <Footer />
    </div>
  );
}
