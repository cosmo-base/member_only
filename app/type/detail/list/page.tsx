// app/type/detail/list/page.tsx
import { Metadata } from "next"
import { SpaceTypeDetailList } from "@/components/spacetype-detail-list"
import { ContentPageLayout } from "@/components/content-page-layout"

export const metadata: Metadata = {
  title: "タイプ一覧 | 宇宙タイプ診断 完全版 | Cosmo Base参加者ページ",
  description: "24の質問で詳細に分析。あなたの宇宙への興味の傾向を多角的に診断します。",
}

export default function SpaceTypeListPage() {
  return (
    <ContentPageLayout
      title="宇宙タイプ診断"
      level={1}
      levelTitle=""
      logo="CBtype"
    >
      <SpaceTypeDetailList />
    </ContentPageLayout>
  )
}
