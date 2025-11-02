// Dynamic landing data for homepage (mocked).
export default function handler(req, res) {
  const data = {
    hero: {
      title: 'FinWisebot',
      subtitle: 'AI analysis, backtesting and cited research — all in one place.',
    },
    stats: [
      { label: 'Backtests run', value: 1423 },
      { label: 'Strategies', value: 312 },
      { label: 'Trusted sources', value: 1284 },
    ],
    features: [
      { icon: '📈', title: 'Real-Time Insights', desc: 'Instant summaries and cited insights from filings, news, and social sentiment.' },
      { icon: '💹', title: 'Signal Engine', desc: 'Generate actionable trading ideas driven by sentiment and events.' },
      { icon: '📊', title: 'Backtesting', desc: 'Validate strategies against historical data before risking capital.' },
      { icon: '📝', title: 'Cited Research', desc: 'All claims are linked to reliable sources for full transparency.' },
    ],
  }

  res.status(200).json({ ok: true, data })
}
