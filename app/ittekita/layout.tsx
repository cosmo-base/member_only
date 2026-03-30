import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "宇宙のイベント行ってきた",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}