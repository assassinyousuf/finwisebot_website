import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function BillingMaintenance() {
  const [animate, setAnimate] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTryDemo = () => {
    setShowConfetti(true);
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements - matching homepage theme */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
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

      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: '1.5s'
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className={`max-w-4xl mx-auto text-center transform transition-all duration-1000 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

          {/* Maintenance Icon - updated to match theme */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>

          {/* Main Content */}
          <h1 className="text-5xl sm:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Billing
            </span>
            <span className="text-white"> System</span>
          </h1>

          <div className="text-2xl sm:text-3xl font-semibold mb-4 text-white">
            Under Maintenance
          </div>

          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl">
            Our payment infrastructure is getting a major upgrade! 🚀<br />
            We're adding new features and improving security to make your experience even better.
          </p>

          {/* Enhanced Progress Section */}
          <div className="mb-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">System Upgrade Progress</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">LIVE</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Infrastructure Upgrade</span>
                    <span className="text-cyan-400 font-medium">85%</span>
                  </div>
                  <div className="bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full animate-pulse" style={{width: '85%'}}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Security Enhancements</span>
                    <span className="text-purple-400 font-medium">92%</span>
                  </div>
                  <div className="bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full animate-pulse" style={{width: '92%'}}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">New Feature Integration</span>
                    <span className="text-emerald-400 font-medium">78%</span>
                  </div>
                  <div className="bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full animate-pulse" style={{width: '78%'}}></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-300">Estimated completion:</span>
                  </div>
                  <span className="text-cyan-400 font-medium">2-3 business days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Features Coming Soon */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Next-Gen Features
                </span>
              </h3>
              <p className="text-gray-300">Revolutionary upgrades powered by AI and advanced analytics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">Advanced Payment Methods</h4>
                    <p className="text-gray-300 text-sm mb-3">Support for 50+ payment methods including crypto, digital wallets, and buy-now-pay-later options</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full">Crypto</span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Apple Pay</span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">BNPL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Dashboard */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">AI-Powered Analytics</h4>
                    <p className="text-gray-300 text-sm mb-3">Real-time billing insights with predictive analytics and automated cost optimization</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">AI Insights</span>
                      <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">Predictive</span>
                      <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">Auto-Optimize</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Collaboration */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">Team Collaboration Hub</h4>
                    <p className="text-gray-300 text-sm mb-3">Multi-user billing management with real-time collaboration and approval workflows</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full">Real-time</span>
                      <span className="px-2 py-1 bg-teal-500/20 text-teal-300 text-xs rounded-full">Workflows</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Multi-user</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">Quantum-Safe Security</h4>
                    <p className="text-gray-300 text-sm mb-3">Military-grade encryption with biometric authentication and fraud prevention AI</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">Biometric</span>
                      <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">AI Fraud</span>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">Quantum Safe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Features Grid */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl mb-2">🚀</div>
                <div className="text-sm font-medium text-white">Instant Setup</div>
                <div className="text-xs text-gray-400">5-minute onboarding</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-medium text-white">API Integration</div>
                <div className="text-xs text-gray-400">REST & GraphQL</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl mb-2">🌐</div>
                <div className="text-sm font-medium text-white">Global Support</div>
                <div className="text-xs text-gray-400">24/7 multi-lingual</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium text-white">Advanced Reporting</div>
                <div className="text-xs text-gray-400">Custom dashboards</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleTryDemo}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              🎉 Try Free Demo Instead
            </button>

            <Link
              href="/"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20 hover:border-white/30"
            >
              Back to Home
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-sm text-gray-400">
            Need immediate access? <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 underline transition-colors">Contact our sales team</Link>
          </div>

          {/* Fun message */}
          <div className="mt-6 text-xs text-gray-500 animate-pulse">
            💡 Pro tip: While you wait, explore our free demo features!
          </div>
        </div>
      </div>
    </div>
  );
}