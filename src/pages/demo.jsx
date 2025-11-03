import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

// Dynamically load heavy visual components client-side to reduce initial bundle size
const DemoVisualizer = dynamic(() => import('../components/DemoVisualizer'), {
  ssr: false,
  loading: () => (
    <div className="h-24 w-full flex items-center justify-center text-sm text-gray-400">Loading visualizer...</div>
  ),
});

const DemoBackground = dynamic(() => import('../components/DemoBackground'), { ssr: false });

export default function Demo() {
  // Demo now uses unified ChatWidget (PeekoChat)

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
        </aside>
      </main>
      <Footer />
    </div>
  );
}
