import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "宇宙タイプ診断",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}