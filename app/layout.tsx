// app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script' // ★ 1. next/script をインポート
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
    index: false,  // Googleなどの検索結果に出さない
    follow: false, // ページ内のリンクもクローラーに辿らせない
  },

  icons: {
    icon: [
      {
        url: '/member_only/CB_icon.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/member_only/CB_icon.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/member_only/CB_icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* ★ 2. ここにGA4のタグを追記（G-XXXXXXXXXX をご自身の測定IDに変更してください） */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TESQF1HQ8J"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TESQF1HQ8J');
          `}
        </Script>
      </head>

      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}