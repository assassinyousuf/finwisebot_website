import { useState } from 'react';
import Link from 'next/link';

export default function AnimatedSignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (password !== confirm) {
      setMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      // placeholder: mimic API call
      await new Promise((r) => setTimeout(r, 900));
      setMessage('Account created (demo) — you can now log in');
    } catch (err) {
      setMessage('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-[#021025] to-[#071024] overflow-hidden">
      <div className="absolute -left-28 -top-40 w-80 h-80 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 opacity-20 blur-3xl animate-blob"></div>
      <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-25 blur-3xl animate-blob animation-delay-3000"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-strong border border-white/10 rounded-2xl shadow-2xl">
        <h2 className="text-3xl text-white font-bold mb-2">Create your account</h2>
        <p className="text-sm text-white/70 mb-6">Join FinWisebot and start smarter backtests</p>

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
            placeholder="Choose a strong password"
            className="p-3 rounded-md bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />

          <label className="text-xs text-white/70">Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your password"
            className="p-3 rounded-md bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />

          <button
            type="submit"
            className="mt-2 bg-accent text-black font-semibold py-2 rounded-md shadow hover:scale-[1.01] transition-transform disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>

          <div className="text-sm text-white/70 mt-2">
            Already have an account? <Link href="/login" className="text-accent underline">Sign in</Link>
          </div>

          {message && <div className="mt-3 text-sm text-white/80">{message}</div>}
        </form>
      </div>
    </div>
  );
}
