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
    // If user is not logged in, redirect to /demo (login gate happens there)
    let mounted = true
    mockApi.getMe().then(j => { if (mounted && (!j || !j.ok || !j.user)) { router.replace('/demo') } })
    return ()=>{ mounted = false }
  }, [router])

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-slate-900 text-white">
      <DemoBackground />
      <Navbar />
      <main className="flex-1 p-6 max-w-6xl mx-auto flex gap-6">
        <div className="w-full">
          <h1 className="text-2xl font-semibold mb-4">PeekoChat</h1>
        </div>
        <section className="flex-1">
          <ChatWidget />
        </section>

        <aside className="w-96">
          <DemoVisualizer />
        </aside>
      </main>
      <Footer />
    </div>
  )
}
