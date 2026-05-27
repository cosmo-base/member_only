import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "お問い合わせ | CBMD | Cosmo Base - 参加者ページ",
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
