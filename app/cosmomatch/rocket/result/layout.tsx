import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ロケット編 | Cosmo Match",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}