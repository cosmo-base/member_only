// app/cosmomatch/constellation/dictionary/[id]/layout.tsx
import type { Metadata } from "next"
import { getConstellations } from "@/data/CMconstellation" 

// [id] を受け取って、動的にメタデータ（タブのタイトル）を生成する関数
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const currentId = resolvedParams.id;
  
  const constellations = await getConstellations();
  const constellation = constellations.find(c => c.slug === currentId);
  
  if (!constellation) {
    return {
      title: "星座が見つかりません | 88星座図鑑 | Cosmo Match",
    }
  }

  return {
    title: `${constellation.name} | 88星座編 | Cosmo Match`,
    description: `88星座「${constellation.name}」の図鑑ページ。${constellation.catchCopy}`,
  }
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
