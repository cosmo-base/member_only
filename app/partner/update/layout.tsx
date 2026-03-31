import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    absolute: "パートナー情報修正 | Cosmo Baseパートナーページ", 
  },
}

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}