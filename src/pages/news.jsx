import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load news from localStorage (managed by admin panel)
    const storedNews = JSON.parse(localStorage.getItem('finwise_mock_news') || '[]')
    
    // If no stored news, use default mock data
    const mockNews = storedNews.length > 0 ? storedNews : [
      {
        title: "Stock Market Today: Dow Jones rises as tech shares rebound",
        summary: "The Dow Jones Industrial Average climbed higher as technology stocks recovered from recent losses, with gains in major indices.",
        url: "https://finance.yahoo.com/news/stock-market-today-dow-jones-123456789.html",
        publishedAt: "2025-11-05T10:00:00Z"
      },
      {
        title: "Tesla shares surge on new EV model announcement",
        summary: "Tesla's stock price jumped 8% following the unveiling of their latest electric vehicle, beating analyst expectations.",
        url: "https://finance.yahoo.com/news/tesla-shares-surge-new-ev-123456789.html",
        publishedAt: "2025-11-05T09:30:00Z"
      },
      {
        title: "Federal Reserve signals potential rate cuts in 2026",
        summary: "Fed Chair Jerome Powell hinted at possible interest rate reductions next year amid cooling inflation data.",
        url: "https://finance.yahoo.com/news/federal-reserve-rate-cuts-2026-123456789.html",
        publishedAt: "2025-11-05T08:45:00Z"
      },
      {
        title: "Cryptocurrency market sees volatility as Bitcoin hits new highs",
        summary: "Bitcoin reached a new all-time high above $100,000, driving gains across the crypto market.",
        url: "https://finance.yahoo.com/news/crypto-bitcoin-highs-123456789.html",
        publishedAt: "2025-11-05T07:20:00Z"
      },
      {
        title: "Oil prices stabilize after OPEC+ production decision",
        summary: "Crude oil futures steadied following OPEC+'s announcement of unchanged production quotas.",
        url: "https://finance.yahoo.com/news/oil-prices-opec-production-123456789.html",
        publishedAt: "2025-11-05T06:15:00Z"
      },
      {
        title: "Apple announces record quarterly earnings",
        summary: "Apple reported better-than-expected earnings driven by strong iPhone sales and services revenue growth.",
        url: "https://finance.yahoo.com/news/apple-earnings-record-123456789.html",
        publishedAt: "2025-11-04T16:30:00Z"
      }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              FinWise
            </span>
            <span className="text-white"> News</span>
          </h1>
          <p className="text-gray-300 text-lg">Stay updated with the latest financial news from Yahoo Finance. Click on any article to read more.</p>
        </div>

        {/* Market Overview Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dow Jones */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Dow Jones</h3>
                  <div className="text-2xl font-bold text-cyan-400">42,500.25</div>
                  <div className="text-sm text-cyan-300">+1.25% (+525.50)</div>
                </div>
                <div className="text-right text-xs text-gray-400">Today</div>
              </div>
              <svg width="100%" height="60" viewBox="0 0 200 60" className="text-cyan-400">
                {/* Grid lines */}
                <line x1="0" y1="15" x2="200" y2="15" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="0" y1="45" x2="200" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="50" y1="0" x2="50" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="100" y1="0" x2="100" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="150" y1="0" x2="150" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                {/* Chart line */}
                <path d="M0,50 L20,45 L40,52 L60,38 L80,42 L100,35 L120,40 L140,32 L160,38 L180,30 L200,35" stroke="currentColor" strokeWidth="2" fill="none" />
                {/* Data points */}
                <circle cx="0" cy="50" r="2" fill="currentColor" />
                <circle cx="100" cy="35" r="2" fill="currentColor" />
                <circle cx="200" cy="35" r="2" fill="currentColor" />
                {/* Price labels */}
                <text x="5" y="45" fontSize="8" fill="rgba(255,255,255,0.8)">42.2k</text>
                <text x="105" y="30" fontSize="8" fill="rgba(255,255,255,0.8)">42.4k</text>
                <text x="175" y="30" fontSize="8" fill="rgba(255,255,255,0.8)">42.5k</text>
              </svg>
            </div>

            {/* S&P 500 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">S&P 500</h3>
                  <div className="text-2xl font-bold text-purple-400">5,680.50</div>
                  <div className="text-sm text-purple-300">+0.95% (+53.25)</div>
                </div>
                <div className="text-right text-xs text-gray-400">Today</div>
              </div>
              <svg width="100%" height="60" viewBox="0 0 200 60" className="text-purple-400">
                {/* Grid lines */}
                <line x1="0" y1="15" x2="200" y2="15" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="0" y1="45" x2="200" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="50" y1="0" x2="50" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="100" y1="0" x2="100" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="150" y1="0" x2="150" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                {/* Chart line */}
                <path d="M0,45 L20,42 L40,48 L60,35 L80,40 L100,32 L120,38 L140,28 L160,35 L180,25 L200,30" stroke="currentColor" strokeWidth="2" fill="none" />
                {/* Data points */}
                <circle cx="0" cy="45" r="2" fill="currentColor" />
                <circle cx="100" cy="32" r="2" fill="currentColor" />
                <circle cx="200" cy="30" r="2" fill="currentColor" />
                {/* Price labels */}
                <text x="5" y="40" fontSize="8" fill="rgba(255,255,255,0.8)">5.62k</text>
                <text x="105" y="27" fontSize="8" fill="rgba(255,255,255,0.8)">5.65k</text>
                <text x="175" y="25" fontSize="8" fill="rgba(255,255,255,0.8)">5.68k</text>
              </svg>
            </div>

            {/* Nasdaq */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Nasdaq</h3>
                  <div className="text-2xl font-bold text-pink-400">17,250.75</div>
                  <div className="text-sm text-pink-300">-0.45% (-78.25)</div>
                </div>
                <div className="text-right text-xs text-gray-400">Today</div>
              </div>
              <svg width="100%" height="60" viewBox="0 0 200 60" className="text-pink-400">
                {/* Grid lines */}
                <line x1="0" y1="15" x2="200" y2="15" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="0" y1="45" x2="200" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="50" y1="0" x2="50" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="100" y1="0" x2="100" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="150" y1="0" x2="150" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                {/* Chart line */}
                <path d="M0,30 L20,35 L40,28 L60,42 L80,38 L100,45 L120,40 L140,48 L160,42 L180,50 L200,45" stroke="currentColor" strokeWidth="2" fill="none" />
                {/* Data points */}
                <circle cx="0" cy="30" r="2" fill="currentColor" />
                <circle cx="100" cy="45" r="2" fill="currentColor" />
                <circle cx="200" cy="45" r="2" fill="currentColor" />
                {/* Price labels */}
                <text x="5" y="25" fontSize="8" fill="rgba(255,255,255,0.8)">17.3k</text>
                <text x="105" y="50" fontSize="8" fill="rgba(255,255,255,0.8)">17.2k</text>
                <text x="175" y="40" fontSize="8" fill="rgba(255,255,255,0.8)">17.25k</text>
              </svg>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.id || item.title}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 hover:border-cyan-400/30 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/20"
                onClick={() => window.open(item.url, '_blank')}
              >
                <h2 className="text-xl font-semibold mb-3 text-cyan-300 hover:text-cyan-200 transition-colors">
                  {item.title}
                </h2>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{formatDate(item.publishedAt)}</span>
                  <span className="text-cyan-400 hover:text-cyan-300 transition-colors">Read more →</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}