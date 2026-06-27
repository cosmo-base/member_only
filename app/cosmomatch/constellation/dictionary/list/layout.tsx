// app/cosmomatch/constllation/dictionary/list/layout.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "88星座図鑑 | Cosmo Match",
  description: "88星座を一覧で探せる図鑑。ステータスで絞り込み検索できます。",
}

export default function DictionaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
