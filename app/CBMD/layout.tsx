import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cosmo Base Museum Database",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
