// app/cosmomatch/rocket/dictionary/[id]/layout.tsx
import type { Metadata } from "next"
import { getRockets } from "@/data/CMrockets"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const currentId = decodeURIComponent(resolvedParams.id);

  const rockets = await getRockets();
  const rocket = rockets.find(r => r.slug === currentId);

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
