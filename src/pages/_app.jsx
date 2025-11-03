import Head from 'next/head'
import '../styles/globals.css'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { initTheme } from '../lib/theme'

const GlobalBackground = dynamic(() => import('../components/GlobalBackground'), { ssr: false })

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // initialize theme on client
    initTheme()
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
      </Head>
      <GlobalBackground />
      <Component {...pageProps} />
    </>
  )
}
