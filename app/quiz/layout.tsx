import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "毎日宇宙クイズ",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}