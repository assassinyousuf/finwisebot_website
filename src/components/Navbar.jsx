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

  const closeMenu = () => setOpen(false);
  return (
    <nav className="relative sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="glass border rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-black/10 backdrop-blur-sm border border-white/8"></div>
            </div>
            <h1 className="text-white text-base sm:text-lg font-heading neon">FinWisebot</h1>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-sm text-muted dark:text-gray-300">
            <Link href="/" className="hover:text-white dark:hover:text-gray-100 transition">Home</Link>
            <Link href="/features" className="hover:text-white dark:hover:text-gray-100 transition">Features</Link>
            <Link href="/news" className="hover:text-white dark:hover:text-gray-100 transition">News</Link>
            <Link href="/pricing" className="hover:text-white dark:hover:text-gray-100 transition">Pricing</Link>
            <Link href="/PeekoChat" className="hover:text-white dark:hover:text-gray-100 transition">PeekoChat</Link>
            {/* Admin link shown only if user has admin role */}
            {user && user.roles && user.roles.includes('admin') && (
              <Link href="/admin" className="hover:text-white dark:hover:text-gray-100 transition">Admin</Link>
            )}
            {!user && (
              <Link href="/reports" className="hover:text-white dark:hover:text-gray-100 transition">Reports</Link>
            )}
            <Link href="/user" className="hover:text-white dark:hover:text-gray-100 transition">User</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-muted dark:text-gray-300 hidden lg:inline">{user.email}</span>
                <button onClick={async ()=>{
                  try { await mockApi.logout() } catch(e){}
                  setUser(null)
                  // reload home
                  window.location.href = '/'
                }} className="text-sm hover:underline transition text-muted dark:text-gray-300">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm hover:underline transition text-muted dark:text-gray-300">Login</Link>
                <Link href="/signup" className="btn-cta">Get started</Link>
              </>
            )}
            <ThemeToggle />
          </div>

          <button className="lg:hidden p-2" aria-label="Toggle menu" onClick={() => setOpen(o => !o)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 mx-4 sm:mx-6 lg:mx-8 lg:hidden z-40">
          <div className="glass border border-white/6 rounded-2xl px-4 py-4 shadow-lg">
            <div className="flex flex-col gap-3 text-sm text-muted dark:text-gray-300">
              <Link href="/" onClick={closeMenu} className="hover:text-white dark:hover:text-gray-100 transition">Home</Link>
              <Link href="/features" onClick={closeMenu} className="hover:text-white dark:hover:text-gray-100 transition">Features</Link>
              <Link href="/news" onClick={closeMenu} className="hover:text-white dark:hover:text-gray-100 transition">News</Link>
              <Link href="/pricing" onClick={closeMenu} className="hover:text-white dark:hover:text-gray-100 transition">Pricing</Link>
              <Link href="/PeekoChat" onClick={closeMenu} className="hover:text-white dark:hover:text-gray-100 transition">PeekoChat</Link>
              {!user && <Link href="/reports" onClick={closeMenu} className="hover:text-white dark:hover:text-gray-100 transition">Reports</Link>}
              <Link href="/user" onClick={closeMenu} className="hover:text-white dark:hover:text-gray-100 transition">User</Link>
              {user && user.roles && user.roles.includes('admin') && (
                <Link href="/admin" onClick={closeMenu} className="hover:text-white dark:hover:text-gray-100 transition">Admin</Link>
              )}

              <div className="border-t border-white/10 pt-3 mt-2">
                {user ? (
                  <>
                    <div className="text-sm text-muted dark:text-gray-300 mb-2">{user.email}</div>
                    <button onClick={async ()=>{
                      try { await mockApi.logout() } catch(e){}
                      setUser(null)
                      closeMenu()
                      window.location.href = '/'
                    }} className="text-left text-sm text-muted dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition">Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={closeMenu} className="block hover:text-white dark:hover:text-gray-100 transition">Login</Link>
                    <Link href="/signup" onClick={closeMenu} className="mt-3 block bg-accent text-black px-4 py-2 rounded-lg text-sm font-semibold text-center hover:bg-accent/90 transition">Get started</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
