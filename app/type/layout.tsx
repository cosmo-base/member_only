import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "宇宙タイプ診断 完全版 | Cosmo Base参加者ページ",
  description: "24の質問で詳細に分析。あなたの宇宙への興味の傾向を多角的に診断します。",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}