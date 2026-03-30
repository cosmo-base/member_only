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
              イベントレポート＆体験共有
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                宇宙イベントに参加した体験をシェアする場所です。
                プラネタリウムでの感動、観望会で見た土星の輪、
                JAXA施設で触れた本物のロケットエンジン...
                そんな体験を写真や文章で残しませんか？
              </p>
              <p>
                投稿されたレポートは、まだそのイベントに行ったことのない人の参考になります。
                「このプラネタリウムはここがすごかった」「この観望会はこんな雰囲気だった」など、
                実際に参加した人ならではの情報は貴重です。
              </p>
              <p>
                同じイベントに参加した人同士で感想を共有したり、
                次に行くイベントの参考にしたり。
                宇宙ファンならではのコミュニティを楽しみましょう。
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
