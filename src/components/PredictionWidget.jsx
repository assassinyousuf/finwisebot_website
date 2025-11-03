import { useState } from 'react';
import mockApi from '../lib/mockApi';

export default function PredictionWidget() {
  const [symbol, setSymbol] = useState('AAPL');
  const [history, setHistory] = useState('100,101,102,103');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const payload = { symbol, history: history.split(',').map(s => parseFloat(s.trim())).filter(n => !Number.isNaN(n)) };
    try {
      const json = await mockApi.predict(payload)
      setResult({ ok: true, data: json })
    } catch (err) {
      setResult({ ok: false, error: String(err) });
    } finally { setLoading(false) }
  }

  return (
    <div className="p-4 rounded-md glass">
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-muted">Symbol</label>
          <input value={symbol} onChange={e => setSymbol(e.target.value)} className="input mt-1 w-full" aria-label="symbol" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted">History (comma-separated)</label>
          <textarea value={history} onChange={e => setHistory(e.target.value)} className="input mt-1 w-full" rows={3} aria-label="history" />
        </div>
        <div>
          <button className="btn-cta" disabled={loading} aria-busy={loading}>{loading ? 'Predicting…' : 'Predict'}</button>
        </div>
      </form>

      {result && (
        <pre className="mt-3 text-sm bg-black/10 p-3 rounded" style={{color:'var(--muted)'}}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
