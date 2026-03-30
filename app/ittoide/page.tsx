import Link from "next/link"
import Image from "next/image"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { MapPin, History, CalendarDays } from "lucide-react"

export default function IttoidePage() {
  return (
    <ContentPageLayout
      title="宇宙のイベント行っといで"
      level={3}
      levelTitle="リアル体験"
      logo="CBittoide"
    >
      {/* Hero Section */}
      <div className="glass-card rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/20">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              おすすめ宇宙イベント紹介
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                全国各地で開催される宇宙関連イベントの中から、
                Cosmo Baseがおすすめするイベントをピックアップしてご紹介します。
              </p>
              <p>
                プラネタリウムでの特別投影、天文台での観望会、JAXA施設の特別公開、
                宇宙関連の展示会やワークショップなど、多彩なイベントをチェックできます。
                家族で楽しめるイベントから、マニア向けのディープなイベントまで幅広くカバー。
              </p>
              <p>
                実際に足を運んで体験することで、宇宙への理解と興味がぐっと深まります。
                同じ趣味を持つ仲間との出会いも、リアルイベントの醍醐味です。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Event Image */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">おすすめのイベント</h3>
        <div className="relative aspect-[1260/670] rounded-xl overflow-hidden">
          <Image
            src="/images/ittoide-event.jpg"
            alt="おすすめのイベント"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <History className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">過去おすすめイベント一覧</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            これまでに紹介したおすすめイベントのアーカイブ。
            過去のイベント情報も参考にしてください。
          </p>
          <Link href="/ittoide/archive">
            <Button variant="outline" className="w-full">
              アーカイブを見る
            </Button>
          </Link>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">今後のおすすめイベント</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            これから開催予定のおすすめイベント一覧。
            早めにチェックして予定を立てましょう。
          </p>
          <Link href="/ittoide/upcoming">
            <Button variant="outline" className="w-full">
              スケジュールを見る
            </Button>
          </Link>
        </div>
      </div>
    </ContentPageLayout>
  )
}
