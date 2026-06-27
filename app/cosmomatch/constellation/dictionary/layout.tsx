// app/cosmomatch/constllation/dictionary/layout.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "88星座図鑑 | Cosmo Match",
  description: "88星座を一覧で探せる図鑑。実際の星空のように探すことができます。",
}

export default function DictionaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
