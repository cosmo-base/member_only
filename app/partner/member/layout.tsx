import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    absolute: "メンバー申請フォーム | Cosmo Baseパートナーページ", 
  },
}

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
