import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cosmo Baseで宇宙教えて",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}