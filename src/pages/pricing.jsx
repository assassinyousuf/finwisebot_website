import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PriceCard({ name, priceMonthly, priceYearly, features, popular, billing }) {
  const price = billing === 'monthly' ? priceMonthly : Math.round(priceYearly / 12);
  return (
    <div className={`p-6 rounded-2xl shadow-xl transform hover:-translate-y-2 transition-all ${popular ? 'border-2 border-accent bg-gradient-to-br from-slate-800/60 to-slate-800/40' : 'bg-slate-800/30'}`}>
      {popular && <div className="text-xs text-accent font-semibold mb-2">Most popular</div>}
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <div className="flex items-baseline gap-2">
        <div className="text-4xl font-bold">${price}</div>
        <div className="text-sm text-gray-400">/mo</div>
      </div>
      <p className="text-sm text-gray-300 my-3">{name} includes:</p>
      <ul className="text-sm text-gray-400 space-y-1 mb-4">
        {features.map((f, i) => <li key={i}>• {f}</li>)}
      </ul>
      <button className="w-full bg-accent text-black py-2 rounded-lg font-semibold">Get started</button>
    </div>
  );
}

export default function Pricing() {
  const [billing, setBilling] = useState('monthly');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(t);
  }, []);

  const tiers = [
    { name: 'Hobbyist', monthly: 10, yearly: 96, features: ['Chat access', 'Basic signals', 'Community support'], popular: false },
    { name: 'Professional', monthly: 49, yearly: 490, features: ['Priority signals', 'Backtesting credits', 'Advanced insights'], popular: true },
    { name: 'Enterprise', monthly: 199, yearly: 1990, features: ['Dedicated infra', 'SLA & support', 'Onboarding & training'], popular: false },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-heading font-bold">Pricing</h1>
          <p className="text-gray-400 mt-2">Flexible plans for hobbyists, professionals and teams. Try free or contact sales for custom enterprise plans.</p>
        </header>

        <div className="mb-6 flex items-center gap-4">
          <div className="text-sm text-gray-300">Billing</div>
          <div className="bg-slate-800/30 p-1 rounded-full flex items-center"> 
            <button onClick={() => setBilling('monthly')} className={`px-3 py-1 rounded-full ${billing === 'monthly' ? 'bg-accent text-black' : 'text-gray-300'}`}>Monthly</button>
            <button onClick={() => setBilling('yearly')} className={`px-3 py-1 rounded-full ${billing === 'yearly' ? 'bg-accent text-black' : 'text-gray-300'}`}>Yearly</button>
          </div>
          <div className="text-sm text-gray-400 ml-4">{billing === 'yearly' ? 'Save 20% when billed yearly' : ''}</div>
        </div>

        <section className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${animate ? 'animate-fade' : ''}`}>
          {tiers.map((t, i) => (
            <PriceCard key={i} name={t.name} priceMonthly={t.monthly} priceYearly={t.yearly} features={t.features} popular={t.popular} billing={billing} />
          ))}
        </section>

        <section className="mt-12 p-6 bg-slate-800/30 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">Compare features</h3>
          <div className="overflow-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead>
                <tr>
                  <th className="py-2">Feature</th>
                  <th className="py-2">Hobbyist</th>
                  <th className="py-2">Professional</th>
                  <th className="py-2">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-2">Chat access</td><td>✔</td><td>✔</td><td>✔</td></tr>
                <tr><td className="py-2">Backtesting credits</td><td>—</td><td>✔</td><td>Unlimited</td></tr>
                <tr><td className="py-2">Priority signals</td><td>—</td><td>✔</td><td>✔</td></tr>
                <tr><td className="py-2">SLA & support</td><td>—</td><td>—</td><td>24/7</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
