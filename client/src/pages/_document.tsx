import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta name="description" content="Whatsapp" />
        <link rel="icon" href="/favicon.png" sizes="any" />
      </Head>
      <body>
        <div id="photo-picker-element"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
