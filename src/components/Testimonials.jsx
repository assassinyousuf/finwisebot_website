import React from 'react'

const testimonials = [
  { quote: 'FinWisebot saved me hours of research and gave clear, cited insights.', who: 'A. Rahman, Retail Investor' },
  { quote: 'The signal engine helped validate an idea quickly with backtests.', who: 'S. Khan, Quant' },
  { quote: 'Love the transparent sourcing — I can trace every claim.', who: 'L. Ahmed, Researcher' },
]

export default function Testimonials() {
  return (
    <section className="py-12">
      <div className="container">
        <h3 className="text-center text-white text-2xl font-heading mb-6">What users say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="card entrance">
              <p className="text-white/90 mb-4">“{t.quote}”</p>
              <div className="text-sm text-white/70">— {t.who}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
