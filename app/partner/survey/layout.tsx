import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    absolute: "アンケート確認依頼 | Cosmo Baseパートナーページ", 
  },
}

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}