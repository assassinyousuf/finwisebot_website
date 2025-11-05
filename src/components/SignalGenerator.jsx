import { useState } from 'react'

export default function SignalGenerator({ onEmit }) {
  const [payload, setPayload] = useState('')

  const examples = [
    { id: 'sig_buy_ema', type: 'signal', name: 'EMA Crossover (BUY)', symbol: 'AAPL', side: 'buy', score: 0.78 },
    { id: 'sig_sell_vol', type: 'signal', name: 'Volume Spike (SELL)', symbol: 'TSLA', side: 'sell', score: 0.64 },
    { id: 'sig_neutral_news', type: 'signal', name: 'News Sentiment (NEUTRAL)', symbol: 'MSFT', side: 'neutral', score: 0.45 },
  ]

  function emit(sample) {
    const s = typeof sample === 'string' ? JSON.parse(sample) : sample
    if (onEmit) onEmit(s)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fw:signal', { detail: s }))
    }
  }

  function handleCustomEmit(e) {
    e.preventDefault()
    try {
      const obj = JSON.parse(payload)
      emit(obj)
      setPayload('')
    } catch (err) {
      alert('Invalid JSON: ' + err.message)
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold">Signal generator</h3>
      <div className="mt-3 space-y-3">
        {examples.map(s => (
          <div key={s.id} className="flex items-center justify-between">
            <div className="text-sm">
              <div className="font-medium">{s.name}</div>
              <div className="muted-sm">{s.symbol} • {s.side.toUpperCase()} • score {s.score}</div>
            </div>
            <button onClick={()=>emit(s)} className="cta-ghost">Emit</button>
          </div>
        ))}

        <form onSubmit={handleCustomEmit} className="mt-2">
          <label className="text-xs muted-sm">Custom JSON</label>
          <textarea value={payload} onChange={e=>setPayload(e.target.value)} placeholder='{"type":"signal","symbol":"AAPL","side":"buy","score":0.5}' className="input" style={{height:80}} />
          <div className="mt-2 flex gap-2">
            <button className="btn-cta" type="submit">Emit JSON</button>
            <button type="button" className="cta-ghost" onClick={()=>setPayload('')}>Clear</button>
          </div>
        </form>
      </div>
    </div>
  )
}
