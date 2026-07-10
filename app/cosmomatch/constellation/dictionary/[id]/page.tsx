import type { Metadata } from "next"
import { getConstellations } from "@/data/CMconstellation"
export const dynamic = 'force-static'
export { generateStaticParams } from "./_components/detail"
import ConstellationDetailPage from "./_components/detail"

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

export default ConstellationDetailPage
