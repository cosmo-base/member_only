import type { Metadata } from "next"
import { getRockets } from "@/data/CMrockets"
export const dynamic = 'force-static'
export { generateStaticParams } from "./_components/detail"
import RocketDetailPage from "./_components/detail"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const currentId = decodeURIComponent(resolvedParams.id);

  const rockets = await getRockets();
  const rocket = rockets.find(r => r.slug === currentId);

  if (!rocket) {
    return {
      title: "ロケットが見つかりません | 日本のロケット図鑑 | Cosmo Match",
    }
  }

  return {
    title: `${rocket.name} | 日本のロケット編 | Cosmo Match`,
    description: `日本のロケット「${rocket.name}」の図鑑ページ。${rocket.catchCopy}`,
  }
}

export default RocketDetailPage
