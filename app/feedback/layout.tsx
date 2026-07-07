import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "意見箱 | Cosmo Base",
}

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
