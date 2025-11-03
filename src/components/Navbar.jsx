import Link from 'next/link';
import { useState, useEffect } from 'react';
import mockApi from '../lib/mockApi';
import ThemeToggle from './ThemeToggle'

// Simple client-side auth-aware navbar: uses client mockApi to detect logged-in user

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null)

  useEffect(()=>{
    let mounted = true
    async function load() {
      try {
        const j = await mockApi.getMe()
        if (j && j.ok && mounted) setUser(j.user)
      } catch (e) {
        // ignore
      }
    }
    load()
    return ()=>{ mounted = false }
  }, [])
  return (
    <nav className="relative sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="glass border rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm" style={{alignItems:'center'}}>
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center">
            <div className="w-7 h-7 rounded-lg bg-black/10 backdrop-blur-sm border border-white/8"></div>
          </div>
          <h1 className="text-white text-lg font-heading neon">FinWisebot</h1>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm" style={{color:'var(--muted)'}}>
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/features" className="hover:text-white transition">Features</Link>
          <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
          <Link href="/demo" className="hover:text-white transition">Demo</Link>
          {/* Admin link shown only if user has admin role */}
          {user && user.roles && user.roles.includes('admin') && (
            <Link href="/admin" className="hover:text-white transition">Admin</Link>
          )}
          {user && (
            <>
              <Link href="/reports" className="hover:text-white transition">Reports</Link>
              <Link href="/settings" className="hover:text-white transition">Settings</Link>
            </>
          )}
        </div>
        <div className="hidden md:flex items-center gap-3">
            {user ? (
            <>
              <span className="text-sm" style={{color:'var(--muted)'}}>{user.email}</span>
              <button onClick={async ()=>{
                try { await mockApi.logout() } catch(e){}
                setUser(null)
                // reload home
                window.location.href = '/'
              }} className="text-sm hover:underline transition" style={{color:'var(--muted)'}}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:underline transition" style={{color:'var(--muted)'}}>Login</Link>
              <Link href="/signup" className="btn-cta">Get started</Link>
            </>
          )}
          <ThemeToggle />
        </div>

        <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen(o => !o)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
  </div>
  </div>

  {/* mobile menu */}
      {open && (
        <div className="mt-3 max-w-6xl mx-auto px-6 md:hidden">
          <div className="glass border border-white/6 rounded-2xl px-4 py-4">
          <div className="flex flex-col gap-3 text-sm text-white/80">
            <Link href="/">Home</Link>
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/demo">Demo</Link>
            <Link href="/reports">Reports</Link>
            <Link href="/settings">Settings</Link>
            {user ? (
              <>
                <div className="text-sm text-white/80">{user.email}</div>
                <button onClick={async ()=>{
                  try { await mockApi.logout() } catch(e){}
                  setUser(null)
                  window.location.href = '/'
                }} className="text-left text-sm text-white/70">Logout</button>
                <Link href="/reports" className="text-left text-sm text-white/70">Reports</Link>
                <Link href="/settings" className="mt-2 bg-accent text-black px-4 py-2 rounded-lg text-sm font-semibold">Settings</Link>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/signup" className="mt-2 bg-accent text-black px-4 py-2 rounded-lg text-sm font-semibold">Get started</Link>
              </>
            )}
          </div>
          </div>
        </div>
      )}
    </nav>
  );
}
