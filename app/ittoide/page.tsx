import Link from "next/link"
import Image from "next/image"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { MapPin, History, CalendarDays } from "lucide-react"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 画像を直接インポートする
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import ittoideEventImg from "../../public/images/ittoide-event.jpg"

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
              一歩踏み出すあなたを応援する、厳選イベントガイド。
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                宇宙に興味を持ち、実際に何か行動してみたいけれどハードルを感じている方の背中を押すコンテンツです。交流会や勉強会、展示イベントなど、運営がおすすめする様々な体験機会をご紹介します。
              </p>
              <p>
                宇宙は知るだけでも楽しいですが、実際に足を運び、その場の空気や参加者の熱量を感じることで、また違った面白さに出会えます。レベル別に情報が整理されているため、自分に合ったイベントを探せます。
              </p>
              <p>
                最初から大きな一歩を踏み出す必要はありません。「ちょっと気になるから行ってみる」という気軽な行動が、次につながるきっかけや新しいパートナーとの連携を創出します。ぜひ一度、足を運んでみてください。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Event Image */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">おすすめのイベント</h3>
        <div className="relative aspect-[1260/670] rounded-xl overflow-hidden">
          {/* ★ Imageタグのsrcをインポートした変数に変更 */}
          <Image
            src={ittoideEventImg}
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
