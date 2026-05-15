import Link from "next/link"
import { Map, Search, Database, ArrowRight, Calendar, Sparkles, MapPin } from "lucide-react"
import { StarField } from "@/components/star-field"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GlassCard } from "@/components/glass-card"
import { TagBadge } from "@/components/tag-badge"
import { Button } from "@/components/ui/button"
import { sampleFacilities, sampleEvents, spacecraftTags } from "@/lib/data"

export default function HomePage() {
  const featuredFacilities = sampleFacilities.slice(0, 4)
  const recentFacilities = sampleFacilities.slice(4, 8)

  return (
    <div className="min-h-screen relative">
      <StarField />
      <Header />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center pt-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">宇宙好きのためのコミュニティポータル</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight text-balance glow-text">
              日本中の宇宙展示を
              <br />
              <span className="text-primary">探しに行こう</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed text-pretty">
              科学館、博物館、プラネタリウム、JAXA施設など、
              日本全国の宇宙関連施設を検索・探索できます。
            </p>

            {/* Main Navigation Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <Link href="/map">
                <GlassCard hover className="h-full">
                  <div className="flex flex-col items-center gap-4 py-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center glow">
                      <Map className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-foreground mb-1">地図から探す</h3>
                      <p className="text-sm text-muted-foreground">日本地図で施設を検索</p>
                    </div>
                  </div>
                </GlassCard>
              </Link>

              <Link href="/search">
                <GlassCard hover className="h-full">
                  <div className="flex flex-col items-center gap-4 py-4">
                    <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
                      <Search className="w-8 h-8 text-accent" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-foreground mb-1">検索で探す</h3>
                      <p className="text-sm text-muted-foreground">条件を指定して検索</p>
                    </div>
                  </div>
                </GlassCard>
              </Link>

              <Link href="/database">
                <GlassCard hover className="h-full">
                  <div className="flex flex-col items-center gap-4 py-4">
                    <div className="w-16 h-16 rounded-2xl bg-chart-3/20 flex items-center justify-center">
                      <Database className="w-8 h-8 text-chart-3" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-foreground mb-1">データベース一覧</h3>
                      <p className="text-sm text-muted-foreground">すべての施設を閲覧</p>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </div>

            <div className="mt-12 animate-float">
              <a href="#featured" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">下にスクロール</span>
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Featured Facilities */}
        <section id="featured" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">注目施設</h2>
                <p className="text-muted-foreground">人気の宇宙関連施設をピックアップ</p>
              </div>
              <Link href="/database">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  すべて見る
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredFacilities.map((facility) => (
                <Link key={facility.id} href={`/facility/${facility.id}`}>
                  <GlassCard hover className="h-full">
                    <div className="aspect-video rounded-xl bg-secondary/30 mb-4 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <MapPin className="w-8 h-8" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <TagBadge variant="primary" className="mb-2">{facility.category}</TagBadge>
                        <h3 className="font-semibold text-foreground line-clamp-2">{facility.name}</h3>
                        <p className="text-sm text-muted-foreground">{facility.prefecture}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {facility.tags.slice(0, 3).map((tag) => (
                          <TagBadge key={tag}>{tag}</TagBadge>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-20 px-4 bg-secondary/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">開催中イベント</h2>
                <p className="text-muted-foreground">今注目の宇宙イベント情報</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleEvents.map((event) => (
                <GlassCard key={event.id} hover>
                  <div className="aspect-video rounded-xl bg-secondary/30 mb-4 overflow-hidden flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-primary font-medium mb-1">{event.date}</p>
                      <h3 className="font-semibold text-foreground line-clamp-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{event.facilityName}</p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Recently Added */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">最近追加された施設</h2>
                <p className="text-muted-foreground">新しく登録された施設情報</p>
              </div>
              <Link href="/database">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  すべて見る
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentFacilities.map((facility) => (
                <Link key={facility.id} href={`/facility/${facility.id}`}>
                  <GlassCard hover className="h-full">
                    <div className="aspect-video rounded-xl bg-secondary/30 mb-4 overflow-hidden flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <TagBadge variant="primary" className="mb-2">{facility.category}</TagBadge>
                        <h3 className="font-semibold text-foreground line-clamp-2">{facility.name}</h3>
                        <p className="text-sm text-muted-foreground">{facility.prefecture}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">更新: {facility.updatedAt}</p>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Spacecraft Tags */}
        <section className="py-20 px-4 bg-secondary/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">宇宙探査機タグ一覧</h2>
              <p className="text-muted-foreground">興味のある探査機から施設を探そう</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {spacecraftTags.map((tag) => (
                <Link key={tag} href={`/search?tag=${encodeURIComponent(tag)}`}>
                  <button className="glass px-6 py-3 rounded-full text-foreground font-medium hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:glow">
                    {tag}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
