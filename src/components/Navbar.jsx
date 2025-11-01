import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-4 left-0 right-0 mx-6 z-50">
      <div className="glass border border-white/6 rounded-2xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-white text-lg font-heading">FinWisebot</h1>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/demo">Demo</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/70">Login</Link>
          <Link href="/signup" className="bg-accent text-black px-4 py-2 rounded-lg text-sm font-semibold">Get started</Link>
        </div>

        <button className="md:hidden text-white" aria-label="Toggle menu" onClick={() => setOpen(o => !o)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="mt-3 glass border border-white/6 rounded-2xl px-4 py-4 md:hidden mx-0">
          <div className="flex flex-col gap-3 text-sm text-white/80">
            <Link href="/">Home</Link>
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/demo">Demo</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup" className="mt-2 bg-accent text-black px-4 py-2 rounded-lg text-sm font-semibold">Get started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
