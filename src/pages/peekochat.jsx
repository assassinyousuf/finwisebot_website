import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ChatWidget from '../components/ChatWidget'
import mockApi from '../lib/mockApi'
import { useRouter } from 'next/router'

const DemoVisualizer = dynamic(() => import('../components/DemoVisualizer'), { ssr: false })
const DemoBackground = dynamic(() => import('../components/DemoBackground'), { ssr: false })

export default function PeekoChatPage(){
  const router = useRouter()

  useEffect(()=>{
    // No redirect needed - PeekoChat is accessible to all
  }, [router])

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
        {[...Array(20)].map((_, i) => (
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

      <DemoBackground />
      <Navbar />
      <main className="relative z-10 flex-1 p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="w-full mb-4 sm:mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Peeko
            </span>
            <span className="text-white">Chat</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl">
            Your AI-powered financial assistant for market insights, analysis, and personalized recommendations.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <section className="flex-1">
            <ChatWidget />
          </section>

          <aside className="w-full lg:w-96">
            <DemoVisualizer />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
