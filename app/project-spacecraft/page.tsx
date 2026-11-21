import type { Metadata } from "next"
import SpacecraftPage from "./_components/spacecraft"

const description = "小さな人工衛星プロジェクトの責任者になって、ミッションを考え、機体を選び、資金と仲間を集めて宇宙へ送り出すシミュレーションゲーム。宇宙の知識がなくても遊べます。"

export const metadata: Metadata = {
  // 共有用画像などを絶対URLにするための基準
  metadataBase: new URL("https://cb-member.fsif.jp"),
  title: "宇宙機シミュレーター",
  description,
  icons: {
    icon: "/brand/spacecraft/spacecraft_square_navy.png",
    apple: "/brand/spacecraft/spacecraft_square_navy.png",
  },
  openGraph: {
    title: "宇宙機シミュレーター | Cosmo Base",
    description,
    images: [{ url: "/brand/spacecraft/spacecraft_horizontal_navy.png", width: 1800, height: 600, alt: "宇宙機シミュレーター" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/spacecraft/spacecraft_horizontal_navy.png"],
  },
}

export default SpacecraftPage
