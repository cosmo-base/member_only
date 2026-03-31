import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    absolute: " | Cosmo Baseパートナーページ", 
  },
}

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}