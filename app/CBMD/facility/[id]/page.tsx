// app/CBMD/facility/[id]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  MapPin, Clock, Calendar, DollarSign, Train, 
  ExternalLink, Globe,
  Star, ChevronLeft, Twitter, Instagram, Youtube, Home, Map as MapIcon, Search, Database
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { TagBadge } from "@/components/tag-badge"
import { Button } from "@/components/ui/button"
import { fetchFacilitiesData } from "@/lib/CBMD"
import { ContentPageLayout } from "@/components/content-page-layout"
import { LinkedEvents } from "./linked-events"

// ★追加: CBEDと同じように強制的に静的ページとして書き出す設定
export const dynamic = 'force-static';
export const dynamicParams = false;

interface FacilityPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  try {
    const facilities = await fetchFacilitiesData();
    if (!facilities || facilities.length === 0) return [];

    // ★追加: ビルド時に何ページ作られたか確認できるログ
    console.log(`\n=========================================`);
    console.log(`🚀 CBMD generateStaticParams が ${facilities.length} ページ分の作成を指示しました！`);
    console.log(`=========================================\n`);

    return facilities.map((facility) => ({ id: String(facility.id).trim() }));
  } catch (error) {
    console.error("CBMD generateStaticParams Error:", error);
    return [];
  }
}

export default async function FacilityPage({ params }: FacilityPageProps) {
  const { id } = await params
  const facilities = await fetchFacilitiesData()
  const facility = facilities.find((f) => f.id === id)

  if (!facility) notFound()

  return (
   <ContentPageLayout
      title="Cosmo Base Museum Database"
      level={3}
      levelTitle="リアル体験"
      logo="CBMD"
   >
    <div className="min-h-screen relative">
      <main className="relative z-10 pt-8 pb-12">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 border-b border-border/30 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/CBMD"><Button variant="outline" size="sm" className="bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground"><Home className="w-4 h-4 mr-2" /> トップ</Button></Link>
            <Link href="/CBMD/map"><Button variant="outline" size="sm" className="bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground"><MapIcon className="w-4 h-4 mr-2" /> マップ</Button></Link>
            <Link href="/CBMD/search"><Button variant="outline" size="sm" className="bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground"><Search className="w-4 h-4 mr-2" /> 検索</Button></Link>
            <Link href="/CBMD/database"><Button variant="outline" size="sm" className="bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground"><Database className="w-4 h-4 mr-2" /> データベース一覧</Button></Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link href="/CBMD/database">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-1" /> 一覧に戻る
            </Button>
          </Link>
        </div>

        {facility.image && facility.image !== "/images/placeholder.jpg" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="aspect-[21/9] rounded-3xl bg-secondary/30 overflow-hidden flex items-center justify-center glass relative">
              <Image 
                src={facility.image} 
                alt={facility.name} 
                fill
                sizes="100vw"
                priority
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <TagBadge variant="primary">{facility.category}</TagBadge>
                  {facility.hasPlanetarium && <TagBadge variant="accent"><Star className="w-3 h-3 mr-1" />プラネタリウム</TagBadge>}
                  {facility.hasEvent && <TagBadge variant="accent"><Calendar className="w-3 h-3 mr-1" />イベント開催中</TagBadge>}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{facility.name}</h1>
                <p className="text-lg text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5" />{facility.address}
                </p>
              </div>

              {facility.tags && facility.tags.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-3">展示タグ</h2>
                  <div className="flex flex-wrap gap-2">
                    {facility.tags.map((tag) => (
                      <Link key={tag} href={`/CBMD/search?tag=${encodeURIComponent(tag)}`}>
                        <button className="glass px-4 py-2 rounded-full text-foreground text-sm font-medium hover:bg-primary/20 hover:text-primary transition-all">
                          {tag}
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {facility.description && (
                <GlassCard>
                  <h2 className="text-lg font-semibold text-foreground mb-4">施設紹介</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{facility.description}</p>
                </GlassCard>
              )}

              {facility.events && facility.events.length > 0 && (
                <LinkedEvents events={facility.events} />
              )}
            </div>

            <div className="space-y-6 mt-8 lg:mt-0">
              <GlassCard className="sticky top-24">
                <h2 className="text-lg font-semibold text-foreground mb-4">基本情報</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3"><Clock className="w-5 h-5 text-primary mt-0.5" /><div><h3 className="text-sm font-medium text-foreground">営業時間</h3><p className="text-sm text-muted-foreground">{facility.openingHours || "-"}</p></div></div>
                  <div className="flex items-start gap-3"><Calendar className="w-5 h-5 text-primary mt-0.5" /><div><h3 className="text-sm font-medium text-foreground">休館日</h3><p className="text-sm text-muted-foreground">{facility.closedDays || "-"}</p></div></div>
                  <div className="flex items-start gap-3"><DollarSign className="w-5 h-5 text-primary mt-0.5" /><div><h3 className="text-sm font-medium text-foreground">入館料</h3><p className="text-sm text-muted-foreground">{facility.admissionFee || "-"}</p></div></div>
                  <div className="flex items-start gap-3"><Train className="w-5 h-5 text-primary mt-0.5" /><div><h3 className="text-sm font-medium text-foreground">アクセス</h3><p className="text-sm text-muted-foreground">{facility.access || "-"}</p></div></div>
                </div>

                {(facility.website || facility.twitter || facility.instagram || facility.youtube) && (
                  <div className="mt-6 pt-6 border-t border-border/30">
                    <h3 className="text-sm font-medium text-foreground mb-3">リンク</h3>
                    <div className="flex flex-wrap gap-2">
                      {facility.website && <a href={facility.website} target="_blank" rel="noopener noreferrer" className="glass p-2.5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all"><Globe className="w-5 h-5" /></a>}
                      {facility.twitter && <a href={facility.twitter.startsWith('http') ? facility.twitter : `https://twitter.com/${facility.twitter}`} target="_blank" rel="noopener noreferrer" className="glass p-2.5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all"><Twitter className="w-5 h-5" /></a>}
                      {facility.instagram && <a href={facility.instagram.startsWith('http') ? facility.instagram : `https://instagram.com/${facility.instagram}`} target="_blank" rel="noopener noreferrer" className="glass p-2.5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all"><Instagram className="w-5 h-5" /></a>}
                      {facility.youtube && <a href={facility.youtube.startsWith('http') ? facility.youtube : `https://youtube.com/channel/${facility.youtube}`} target="_blank" rel="noopener noreferrer" className="glass p-2.5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all"><Youtube className="w-5 h-5" /></a>}
                    </div>
                  </div>
                )}

                {facility.website && (
                  <div className="mt-6">
                    <a href={facility.website} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow">公式サイトを見る <ExternalLink className="w-4 h-4 ml-2" /></Button>
                    </a>
                  </div>
                )}

                {facility.updatedAt && (
                  <div className="mt-6 pt-4 border-t border-border/30">
                    <p className="text-xs text-muted-foreground text-center">最終更新: {facility.updatedAt}</p>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
   </ContentPageLayout>
  )
}
