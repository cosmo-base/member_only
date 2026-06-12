// app/type/content/list/page.tsx
import { Metadata } from "next"
import { SpaceTypeList } from "@/components/spacetype-list"
import { ContentPageLayout } from "@/components/content-page-layout"

export const metadata: Metadata = {
  title: "タイプ一覧 | 宇宙タイプ診断 簡易版 | Cosmo Base参加者ページ",
  description: "30秒の診断で、あなたが宇宙で活躍する未来がわかる。宇宙診断コンテンツ。",
}

export default function SpaceTypeListPage() {
  return (
    <ContentPageLayout
      title="宇宙タイプ診断"
      level={1}
      levelTitle=""
      logo="CBtype"
    >
      <SpaceTypeList />
    </ContentPageLayout>
  )
}
