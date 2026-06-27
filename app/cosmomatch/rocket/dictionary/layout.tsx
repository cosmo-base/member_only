// app/cosmomatch/rocket/dictionary/layout.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ロケット図鑑 | Cosmo Match",
  description: "世界のロケットを一覧で探せるロケット図鑑。国・ステータスで絞り込み検索できます。",
}

export default function DictionaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
