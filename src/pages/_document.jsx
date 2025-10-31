import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="alternate icon" href="/favicon.svg" />
          <meta name="theme-color" content="#0f1724" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
