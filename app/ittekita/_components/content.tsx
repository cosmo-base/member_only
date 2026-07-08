// app/ittekita/page.tsx
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { Camera, Calendar, Image as ImageIcon, Archive, ExternalLink, MapPin, Clock, Info } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { fetchIttekitaData } from "@/data/ittekita"

export const dynamic = 'force-static';

export default async function IttekitaPage() {
  const events = await fetchIttekitaData();
  const latestEvent = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <ContentPageLayout
      title="宇宙のイベント行ってきた"
      level={3}
      levelTitle=""
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
                日々進む宇宙の世界の"今"を知ることは、とても刺激的な体験です。レポートを読むことが「次は行ってみたい」というモチベーションにもつながります。少しだけのぞいてみる感覚で、気軽にお楽しみください。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 最新のレポートピックアップ */}
      {latestEvent && (
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
            最新のレポート
          </h3>

          <GlassCard className="relative overflow-hidden p-6 md:p-8 group">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00f2fe] z-20" />
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 bg-accent pointer-events-none transition-opacity group-hover:opacity-20" />

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
              <div className="flex-grow space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 bg-secondary/40 border border-border/50 px-2.5 py-1 rounded-md">
                    <Clock className="w-4 h-4 text-accent" />
                    {latestEvent.date}
                  </span>
                  {latestEvent.venue && (
                    <span className="flex items-center gap-1.5 bg-secondary/40 border border-border/50 px-2.5 py-1 rounded-md">
                      <MapPin className="w-4 h-4 text-primary" />
                      {latestEvent.venue}
                    </span>
                  )}
                </div>

                <h4 className="text-xl md:text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                  {latestEvent.title}
                </h4>

                {latestEvent.details && (
                  <p className="text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-3">
                    {latestEvent.details}
                  </p>
                )}
              </div>

              <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                {latestEvent.url && (
                  <a href={latestEvent.url} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow font-bold h-12 px-6 rounded-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      レポートを読む
                    </Button>
                  </a>
                )}
                {/* ★ 追加: CBEDのIDが登録されている場合のみ詳細ボタンを表示 */}
                {latestEvent.cbedId && (
                  <Link href={`/events/${latestEvent.cbedId}`}>
                    <Button className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-bold h-12 px-6 rounded-full border border-border/50">
                      <Info className="w-4 h-4 mr-2 text-primary" />
                      イベント詳細
                    </Button>
                  </Link>
                )}
                {latestEvent.photoLink && (
                  <a href={latestEvent.photoLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full font-bold border-accent/50 hover:bg-accent/10 text-accent h-12 px-6 rounded-full">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      会場の写真を見る
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      )}

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
            <Button variant="outline" className="w-full font-bold">
              カレンダーを見る
            </Button>
          </Link>
        </div>

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
            href="https://cosmo-base.github.io/library/index.html?utm_source=CBMO&utm_medium=ittekita"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="w-full font-bold">
              CBLで探す
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </ContentPageLayout>
  )
}
