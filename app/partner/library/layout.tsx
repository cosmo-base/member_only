import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    absolute: "Cosmo Base Library 資料格納 | Cosmo Baseパートナーページ", 
  },
}

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}