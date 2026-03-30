import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Cosmo Base - 参加者ページ',
  description: '宇宙に興味はあるが何から始めればいいかわからない人のための入口。関心を行動へ変えるコミュニティー。',
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

/* Leafletのタイル表示を安定させる */
.leaflet-container {
  height: 100% !important;
  width: 100% !important;
  z-index: 10 !important;
}

/* タイルの境界線が白く見えるのを防ぐ */
.leaflet-tile-container img {
  box-shadow: 0 0 1px rgba(0,0,0,0.05);
}
