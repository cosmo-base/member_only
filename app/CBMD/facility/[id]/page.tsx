import { notFound } from "next/navigation"
import Link from "next/link"
import { 
  MapPin, Clock, Calendar, DollarSign, Train, 
  ExternalLink, Globe, Image as ImageIcon,
  Star, ChevronLeft, Twitter, Instagram, Youtube
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { TagBadge } from "@/components/tag-badge"
import { Button } from "@/components/ui/button"
import { sampleFacilities } from "@/lib/CBMD"
import { ContentPageLayout } from "@/components/content-page-layout"

interface FacilityPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  return sampleFacilities.map((facility) => ({
    id: facility.id,
  }))
}

export default async function FacilityPage({ params }: FacilityPageProps) {
  const { id } = await params
  const facility = sampleFacilities.find((f) => f.id === id)

  if (!facility) {
    notFound()
  }

  return (
   <ContentPageLayout
      title="Cosmo Base Museum Database"
      level={4}
      levelTitle="体系化"
      logo="CBMD"
   >
    <div className="min-h-screen relative">
      <main className="relative z-10 pt-24 pb-12">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link href="/CBMD/database">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-1" />
              一覧に戻る
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="aspect-[21/9] rounded-3xl bg-secondary/30 overflow-hidden flex items-center justify-center glass">
            <div className="text-center">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">施設画像</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Tags */}
              <div>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <TagBadge variant="primary">{facility.category}</TagBadge>
                  {facility.hasPlanetarium && (
                    <TagBadge variant="accent">
                      <Star className="w-3 h-3 mr-1" />
                      プラネタリウム
                    </TagBadge>
                  )}
                  {facility.hasEvent && (
                    <TagBadge variant="accent">
                      <Calendar className="w-3 h-3 mr-1" />
                      イベント開催中
                    </TagBadge>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{facility.name}</h1>
                <p className="text-lg text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {facility.address}
                </p>
              </div>

              {/* Tags */}
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

              {/* Description */}
              <GlassCard>
                <h2 className="text-lg font-semibold text-foreground mb-4">施設紹介</h2>
                <p className="text-muted-foreground leading-relaxed">{facility.description}</p>
              </GlassCard>

              {/* Planetarium Section */}
              {facility.planetarium && (
                <GlassCard>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-accent" />
                    <h2 className="text-lg font-semibold text-foreground">プラネタリウム情報</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-2">上映タイトル</h3>
                      <div className="flex flex-wrap gap-2">
                        {facility.planetarium.titles.map((title, index) => (
                          <TagBadge key={index}>{title}</TagBadge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-1">上映時間</h3>
                        <p className="text-muted-foreground">{facility.planetarium.duration}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-1">スケジュール</h3>
                        <p className="text-muted-foreground">{facility.planetarium.schedule}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Events Section */}
              {facility.events && facility.events.length > 0 && (
                <GlassCard>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-accent" />
                    <h2 className="text-lg font-semibold text-foreground">イベント情報</h2>
                  </div>
                  <div className="space-y-4">
                    {facility.events.map((event, index) => (
                      <div key={index} className="glass-strong rounded-xl p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-foreground mb-1">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                          <TagBadge variant="accent">{event.date}</TagBadge>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Gallery Placeholder */}
              <GlassCard>
                <h2 className="text-lg font-semibold text-foreground mb-4">ギャラリー</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl bg-secondary/30 flex items-center justify-center"
                    >
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 mt-8 lg:mt-0">
              {/* Info Card */}
              <GlassCard className="sticky top-24">
                <h2 className="text-lg font-semibold text-foreground mb-4">基本情報</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground">営業時間</h3>
                      <p className="text-sm text-muted-foreground">{facility.openingHours}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground">休館日</h3>
                      <p className="text-sm text-muted-foreground">{facility.closedDays}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground">入館料</h3>
                      <p className="text-sm text-muted-foreground">{facility.admissionFee}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Train className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground">アクセス</h3>
                      <p className="text-sm text-muted-foreground">{facility.access}</p>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="mt-6 pt-6 border-t border-border/30">
                  <h3 className="text-sm font-medium text-foreground mb-3">リンク</h3>
                  <div className="flex flex-wrap gap-2">
                    {facility.website && (
                      <a
                        href={facility.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass p-2.5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {facility.twitter && (
                      <a
                        href={`https://twitter.com/${facility.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass p-2.5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {facility.instagram && (
                      <a
                        href={`https://instagram.com/${facility.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass p-2.5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {facility.youtube && (
                      <a
                        href={`https://youtube.com/${facility.youtube}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass p-2.5 rounded-xl hover:bg-primary/20 hover:text-primary transition-all"
                      >
                        <Youtube className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                {facility.website && (
                  <div className="mt-6">
                    <a
                      href={facility.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow">
                        公式サイトを見る
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                )}

                {/* Last Updated */}
                <div className="mt-6 pt-4 border-t border-border/30">
                  <p className="text-xs text-muted-foreground text-center">
                    最終更新: {facility.updatedAt}
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
   </ContentPageLayout>
  )
}
