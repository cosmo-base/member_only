import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    absolute: "イベント登壇申請 | Cosmo Baseパートナーページ", 
  },
}

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}