// app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  // タイトルをテンプレート化
  title: {
    template: '%s | Cosmo Base - 参加者ページ',
    default: 'Cosmo Base - 参加者ページ',
  },
  description: '宇宙に興味はあるが何から始めればいいかわからない人のための入口。関心を行動へ変えるコミュニティー。',
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 検索エンジン避け（最重要）
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  robots: {
    index: false,
    follow: false,
  },

  icons: {
    icon: [
      { url: '/member_only/CB_icon.png', media: '(prefers-color-scheme: light)' },
      { url: '/member_only/CB_icon.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/member_only/CB_icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // ★ GTMのコンテナID
  const GTM_ID = 'GTM-MZM5DKHL';

  return (
    <html lang="ja" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* ★ Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>
      
      <body className="font-sans antialiased" suppressHydrationWarning>
        {/* ★ Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        {children}
      </body>
    </html>
  )
}