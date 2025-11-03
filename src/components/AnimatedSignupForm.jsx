import { useState } from 'react';
import mockApi from '../lib/mockApi';
import { useRouter } from 'next/router'
import Link from 'next/link';

export default function AnimatedSignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [devVerifyToken, setDevVerifyToken] = useState(null)
  const [verifying, setVerifying] = useState(false)

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (password !== confirm) {
      setMessage('Passwords do not match');
      return;
    }

    // basic client-side strength check
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setMessage('Password must be at least 8 characters and include letters and numbers');
      return;
    }

    setLoading(true);
    try {
      const data = await mockApi.login({ email })
      if (!data || !data.ok) {
        setMessage('Signup failed')
      } else {
        setMessage('Account created — signed in (demo)')
        setEmail('')
        setPassword('')
        setConfirm('')
        setTimeout(() => router.push('/'), 700)
      }
    } catch (err) {
      console.error(err)
      setMessage('Signup failed — please try again later')
    } finally { setLoading(false) }
  };

  const passwordStrength = () => {
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return 'Strong'
    if (password.length >= 8) return 'Good'
    if (password.length > 0) return 'Weak'
    return ''
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-[#021025] to-[#071024] overflow-hidden">
      <div className="absolute -left-28 -top-40 w-80 h-80 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 opacity-20 blur-3xl animate-blob"></div>
      <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-25 blur-3xl animate-blob animation-delay-3000"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-strong border border-white/10 rounded-2xl shadow-2xl">
        <h2 className="text-3xl text-white font-bold mb-2">Create your account</h2>
        <p className="text-sm text-white/70 mb-6">Join FinWisebot and start smarter backtests</p>

        <form onSubmit={submit} className="flex flex-col gap-4" aria-label="Signup form">
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
            placeholder="Choose a strong password"
            className="input"
            required
            aria-required="true"
          />

          <label className="text-xs text-muted">Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your password"
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
            {loading ? 'Creating…' : 'Create account'}
          </button>

          <div className="text-xs text-muted mt-1">Password strength: <span className="font-medium">{passwordStrength()}</span></div>

          <div className="text-sm text-muted mt-2">
            Already have an account? <Link href="/login" className="text-accent underline">Sign in</Link>
          </div>

          {message && <div className="mt-3 text-sm" style={{color:'var(--muted)'}}>{message}</div>}
          {devVerifyToken && (
            <div className="mt-3 bg-white/5 p-3 rounded-md">
              <div className="text-xs" style={{color:'var(--muted)'}}>Developer verify token (click to verify):</div>
              <div className="flex items-center gap-2">
                <input readOnly value={devVerifyToken} className="flex-1 p-2 rounded bg-black/10 text-xs" />
                <button onClick={async ()=>{
                  setVerifying(true)
                  try {
                    // in demo mode, verification simply signs the user in
                    await mockApi.login({ email })
                    setMessage('Email verified — signing in and redirecting...')
                    setTimeout(()=>router.push('/'), 700)
                  } catch (e) {
                    console.error('verify click error', e)
                    setMessage('Verification failed — try again')
                  } finally { setVerifying(false) }
                }} className="btn-cta" disabled={verifying}>{verifying ? 'Verifying…' : 'Verify'}</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
