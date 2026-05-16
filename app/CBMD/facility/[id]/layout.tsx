// app/CBMD/facility/[id]/layout.tsx
import type { Metadata } from "next"
import { fetchFacilitiesData } from "@/lib/CBMD"

interface Props {
  params: Promise<{ id: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const facilities = await fetchFacilitiesData()
  const facility = facilities.find((f) => f.id === id)

  return {
    title: facility ? `${facility.name} | CBMD` : "施設詳細 | CBMD",
  }
}

export default function FacilityLayout({ children }: Props) {
  return <>{children}</>
}