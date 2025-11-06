import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import mockApi from '../lib/mockApi';
import { useRouter } from 'next/router'

// Dynamically load heavy visual components client-side to reduce initial bundle size
const DemoVisualizer = dynamic(() => import('../components/DemoVisualizer'), {
  ssr: false,
  loading: () => (
    <div className="h-24 w-full flex items-center justify-center text-sm text-gray-400">Loading visualizer...</div>
  ),
});
import SignalGenerator from '../components/SignalGenerator';

const DemoBackground = dynamic(() => import('../components/DemoBackground'), { ssr: false });

export default function Demo() {
  // If the user is logged in, send them to the canonical /peekochat page.
  // If not logged in, keep them on the demo page (simpler demo chat).
  const router = useRouter()
  useEffect(() => {
    let mounted = true
    async function check() {
      try {
        const j = await mockApi.getMe()
        if (!mounted) return
        if (j && j.ok && j.user) {
          // signed in → go to advanced PeekoChat
          router.replace('/PeekoChat')
        }
      } catch (e) {
        // on error, stay on demo
      }
    }
    check()
    return () => { mounted = false }
  }, [router])

  function handleSignalClick(signal) {
    // dispatch a cross-component event that ChatWidget listens for
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fw:signal', { detail: signal }))
    }
  }

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

      <DemoBackground />
      <Navbar />
      <main className="relative z-10 flex-1 p-6 max-w-6xl mx-auto flex gap-6">
        <div className="w-full">
          <h1 className="text-2xl font-semibold mb-4 text-white">PeekoChat</h1>
        </div>
        <section className="flex-1">
          <ChatWidget />
        </section>

        <aside className="w-96">
          <DemoVisualizer onSignalClick={handleSignalClick} />
          <div className="mt-4">
            <SignalGenerator onEmit={handleSignalClick} />
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
