"use client"

import dynamic from "next/dynamic"
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google"
import { ContentPageLayout } from "@/components/content-page-layout"
import "../_game/spacecraft.css"

// ゲームの書体。ビルド時に取り込んで同梱する（閲覧者のIPを第三者に送らないため）
const notoSans = Noto_Sans_JP({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-noto-sans-jp" })
const notoSerif = Noto_Serif_JP({ weight: ["700"], subsets: ["latin"], variable: "--font-noto-serif-jp" })

// 進行状況や同意の状態はブラウザ内（localStorage）にあるため、ブラウザでだけ描画する
const SpacecraftGame = dynamic(() => import("../_game/App"), { ssr: false })

export default function SpacecraftPage() {
  return (
    <ContentPageLayout>
      <div className={`${notoSans.variable} ${notoSerif.variable}`}>
        <SpacecraftGame />
      </div>
    </ContentPageLayout>
  )
}
