import { useState } from 'react';
import mockApi from '../lib/mockApi';
import Link from 'next/link';
import { useRouter } from 'next/router'

export default function AnimatedLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const router = useRouter()

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = await mockApi.login({ email, password })
      if (!data || !data.ok) {
        setMessage('Login failed')
      } else {
        setMessage('Login succeeded')
        // redirect to main page
        router.push('/')
      }
    } catch (err) {
      console.error('login submit error', err)
      setMessage('Login failed — please try again')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-[#0f172a] to-[#071024] overflow-hidden">
      {/* animated background blobs */}
      <div className="absolute -left-32 -top-52 w-96 h-96 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-30 blur-3xl animate-blob"></div>
      <div className="absolute -right-40 -bottom-56 w-96 h-96 rounded-full bg-gradient-to-r from-yellow-400 to-red-400 opacity-20 blur-3xl animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
        <h2 className="text-3xl text-white font-bold mb-2">Welcome back</h2>
        <p className="text-sm text-white/70 mb-6">Log in to access your FinWisebot dashboard</p>

        <form onSubmit={submit} className="flex flex-col gap-4" aria-label="Login form">
          <label className="text-xs text-muted">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="input"
            required
            aria-required="true"
          />

          <label className="text-xs text-muted">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input"
            required
            aria-required="true"
          />

          <button
            type="submit"
            className="btn-cta mt-2"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="text-sm text-muted mt-2">
            Don’t have an account? <Link href="/signup" className="text-accent underline">Sign up</Link>
          </div>

          {message && <div className="mt-3 text-sm" style={{color:'var(--muted)'}}>{message}</div>}
        </form>
      </div>
    </div>
  );
}
