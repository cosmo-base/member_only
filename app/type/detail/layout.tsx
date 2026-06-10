import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "宇宙タイプ診断 完全版 | Cosmo Base参加者ページ",
  description: "24問の診断で、あなたが宇宙で活躍する未来がわかる。宇宙診断コンテンツ。",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
