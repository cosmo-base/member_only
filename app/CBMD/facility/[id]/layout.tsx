// app/CBMD/facility/[id]/layout.tsx
import type { Metadata } from "next"
import { fetchFacilitiesData } from "@/lib/CBMD"

// ★追加: レイアウト側にも静的指定を行う
export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const facilities = await fetchFacilitiesData();
    if (!facilities || facilities.length === 0) return [];
    return facilities.map((facility) => ({ id: String(facility.id).trim() }));
  } catch (error) {
    return [];
  }
}

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
