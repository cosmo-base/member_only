import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "宇宙Voyager検定",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}