import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "週刊宇宙ニュース",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}