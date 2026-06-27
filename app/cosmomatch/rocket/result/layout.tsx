import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "日本のロケット編 | Cosmo Match",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
