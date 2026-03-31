import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { Camera, Calendar, Image, Archive, ExternalLink } from "lucide-react"

export default function IttekitaPage() {
  return (
    <ContentPageLayout
      title="宇宙のイベント行ってきた"
      level={3}
      levelTitle="リアル体験"
      logo="CBittekita"
    >
      {/* Hero Section */}
      <div className="glass-card rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/20">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              行けなかったイベントの熱量と空気を、あなたのお手元へ。
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                日程や場所の都合で参加できなかったイベントの様子を、運営メンバーが代わりに体験し、レポートとして不定期でお届けするコンテンツです。どんな議論があったのか、分かりやすく整理して発信します。
              </p>
              <p>
                単なる情報まとめではなく、会場の雰囲気や参加者の熱量など、実際に行ったからこそ分かる「その場の体験」を持ち帰れるのが特徴です。遠方の方や予定が合わなかった方も、リアルな空気感を感じることができます。
              </p>
              <p>
                日々進む宇宙の世界の“今”を知ることは、とても刺激的な体験です。レポートを読むことが「次は行ってみたい」というモチベーションにもつながります。少しだけのぞいてみる感覚で、気軽にお楽しみください。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">カレンダー</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            過去の「行ってきた」レポートを
            カレンダー形式で振り返れます。
          </p>
          <Link href="/ittekita/calendar">
            <Button variant="outline" className="w-full">
              カレンダーを見る
            </Button>
          </Link>
        </div>


        {/* Backnumber link */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Archive className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">バックナンバー</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            過去のイベントレポートをCosmo Base Libraryで読むことができます。
            詳細な体験記事やイベントの記録をチェック。
          </p>
          <a
            href="https://cosmo-base.github.io/library/index.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="w-full">
              Cosmo Base Libraryで読む
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </ContentPageLayout>
  )
}
