// app/cosmomatch/rocket/dictionary/[id]/layout.tsx
import type { Metadata } from "next"
import { ROCKETS } from "@/data/CMrockets" // ※ファイル名が異なる場合は適宜修正してください

// ★ [id] を受け取って、動的にメタデータ（タブのタイトル）を生成する関数
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const currentId = resolvedParams.id;
  
  // URLのslugからロケットのデータを検索
  const rocket = ROCKETS.find(r => r.slug === currentId);
  
  if (!rocket) {
    return {
      title: "ロケットが見つかりません | ロケット図鑑 | Cosmo Match",
    }
  }

  return {
    title: `${rocket.name} | ロケット編 | Cosmo Match`,
    description: `推しロケット「${rocket.name}」の図鑑ページ。${rocket.catchCopy}`,
  }
}

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}