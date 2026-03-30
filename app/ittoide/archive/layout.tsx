import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "過去のおすすめ | 宇宙に行っといで",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}