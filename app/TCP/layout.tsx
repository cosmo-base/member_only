import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "1000人乗船プロジェクト",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
