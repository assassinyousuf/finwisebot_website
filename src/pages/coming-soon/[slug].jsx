import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ROBOT_SVG = () => (
  <svg viewBox="0 0 200 200" className="w-64 h-64" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" fillRule="evenodd">
      <rect x="40" y="40" width="120" height="100" rx="12" fill="#0f1724" />
      <rect x="72" y="64" width="56" height="36" rx="6" fill="#111827" />
      <circle cx="88" cy="82" r="6" fill="#f59e0b" />
      <circle cx="112" cy="82" r="6" fill="#f59e0b" />
      <rect x="84" y="100" width="32" height="8" rx="3" fill="#374151" />
      <path d="M40 140c20 0 40 10 60 10s40-10 60-10" stroke="#4b5563" strokeWidth="4" strokeLinecap="round" />
      {/* wrench animated */}
      <path className="wrench" d="M10 170 L28 152 L36 160 L18 178 Z" fill="#f59e0b" transform="translate(120 -20) rotate(10)" />
    </g>
  </svg>
);

export default function ComingSoon() {
  const router = useRouter();
  const { slug } = router.query;

  const title = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Feature';

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="p-6 bg-slate-800/40 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold mb-2">{title} — Coming Soon</h1>
            <p className="text-gray-300 mb-4">We're working on bringing this feature live. Our robots are currently repairing the pipelines and wiring the data feeds.</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Live data integration</li>
              <li>• Backtesting orchestration</li>
              <li>• Inline citations and source links</li>
            </ul>

            <div className="mt-6 flex gap-3">
              <button onClick={() => router.push('/features')} className="bg-white/5 text-white px-4 py-2 rounded">Back to features</button>
              <button onClick={() => alert('Subscribed (demo)')} className="bg-accent text-black px-4 py-2 rounded">Notify me</button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="robot-bob">
                <ROBOT_SVG />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 animate-gear">
                <svg viewBox="0 0 48 48" className="w-16 h-16" xmlns="http://www.w3.org/2000/svg">
                  <g fill="#94a3b8">
                    <circle cx="24" cy="24" r="10" />
                    <path d="M24 10v-4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
