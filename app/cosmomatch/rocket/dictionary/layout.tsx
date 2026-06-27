// app/cosmomatch/rocket/dictionary/layout.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "日本のロケット図鑑 | Cosmo Match",
  description: "日本のロケットを一覧で探せるロケット図鑑。ステータスで絞り込み検索できます。",
}

export default function DictionaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
