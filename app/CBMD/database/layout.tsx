import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "一覧|CBMD",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
