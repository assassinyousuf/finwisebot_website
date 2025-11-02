import Head from 'next/head'
import '../styles/globals.css'
import dynamic from 'next/dynamic'

const GlobalBackground = dynamic(() => import('../components/GlobalBackground'), { ssr: false })

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark" />
      </Head>
      <GlobalBackground />
      <Component {...pageProps} />
    </>
  )
}
