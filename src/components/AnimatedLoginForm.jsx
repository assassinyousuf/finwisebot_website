import { useState } from 'react';
import Link from 'next/link';

export default function AnimatedLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // placeholder: mimic API call
      await new Promise((r) => setTimeout(r, 800));
      setMessage('Login succeeded (demo)');
    } catch (err) {
      setMessage('Login failed');
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

        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="text-xs text-white/70">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="p-3 rounded-md bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />

          <label className="text-xs text-white/70">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="p-3 rounded-md bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />

          <button
            type="submit"
            className="mt-2 bg-accent text-black font-semibold py-2 rounded-md shadow hover:scale-[1.01] transition-transform disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="text-sm text-white/70 mt-2">
            Don’t have an account? <Link href="/signup"><a className="text-accent underline">Sign up</a></Link>
          </div>

          {message && <div className="mt-3 text-sm text-white/80">{message}</div>}
        </form>
      </div>
    </div>
  );
}
