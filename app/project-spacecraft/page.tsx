import type { Metadata } from "next"
import SpacecraftPage from "./_components/spacecraft"

const description = "小さな人工衛星プロジェクトの責任者になって、ミッションを考え、機体を選び、資金と仲間を集めて宇宙へ送り出すシミュレーションゲーム。宇宙の知識がなくても遊べます。"

export const metadata: Metadata = {
  // 共有用画像などを絶対URLにするための基準
  metadataBase: new URL("https://cb-member.fsif.jp"),
  title: "宇宙機プロジェクトシミュレーター",
  description,
  icons: {
    icon: "/CBspacecraft_icon.png",
    apple: "/CBspacecraft_icon.png",
  },
  openGraph: {
    title: "宇宙機プロジェクトシミュレーター | Cosmo Base",
    description,
    images: [{ url: "/CBspacecraft_og.png", width: 1200, height: 400, alt: "宇宙機シミュレーター" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/CBspacecraft_og.png"],
  },
}

export default SpacecraftPage
