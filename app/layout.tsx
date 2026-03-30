// app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  // ★ 1. タイトルをテンプレート化（他のページで title を設定すると自動で「| Cosmo Base」が付きます）
  title: {
    template: '%s | Cosmo Base - 参加者ページ',
    default: 'Cosmo Base - 参加者ページ',
  },
  description: '宇宙に興味はあるが何から始めればいいかわからない人のための入口。関心を行動へ変えるコミュニティー。',
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ★ 2. 検索エンジン避け（最重要）
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  robots: {
    index: false,  // Googleなどの検索結果に出さない
    follow: false, // ページ内のリンクもクローラーに辿らせない
  },

  icons: {
    icon: [
      {
        url: '/member-only/CB_icon.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/member-only/CB_icon.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/member-only/CB_icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
