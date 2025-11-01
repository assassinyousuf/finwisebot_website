import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
              {/* Fonts loaded once in document for best FOUT handling */}
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
              <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
              <link rel="alternate icon" href="/favicon.svg" />
              <meta name="theme-color" content="#071428" />
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
