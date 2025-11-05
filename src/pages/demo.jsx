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
          router.replace('/peekochat')
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
  <div className="flex flex-col min-h-screen relative overflow-hidden bg-slate-900 text-white">
      <DemoBackground />
      <Navbar />
      <main className="flex-1 p-6 max-w-6xl mx-auto flex gap-6">
        <div className="w-full">
          <h1 className="text-2xl font-semibold mb-4">PeekoChat</h1>
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
