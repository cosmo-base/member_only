import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { Newspaper, Archive, ExternalLink } from "lucide-react"

export default function NewsPage() {
  return (
    <ContentPageLayout
      title="週刊宇宙ニュース"
      level={1}
      levelTitle="習慣化"
      logo="CBnews"
    >
      {/* Hero Section */}
      <div className="glass-card rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/20">
            <Newspaper className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              1週間の宇宙ニュースを分かりやすく整理
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                毎週、世界中の宇宙関連ニュースを厳選してお届けします。
                NASA、JAXA、SpaceX、そして世界各国の宇宙機関から発信される情報を、
                Cosmo Base編集部が分かりやすくまとめています。
              </p>
              <p>
                難しい専門用語も丁寧に解説するので、宇宙初心者の方でも安心。
                ロケットの打ち上げ、惑星探査の最新成果、宇宙ステーションでの実験、
                新しい宇宙ビジネスの動向など、多角的な視点でお届けします。
              </p>
              <p>
                忙しい毎日でも、週1回のチェックで宇宙の最新動向をキャッチアップ。
                気になったニュースは詳細記事で深掘りすることもできます。
                宇宙がどんどん進化していく様子を、一緒に追いかけましょう。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Link */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Archive className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">バックナンバー</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          過去の週刊ニュースをアーカイブ。見逃したニュースも
          いつでも振り返ることができます。テーマ別や時系列での検索も可能です。
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
    </ContentPageLayout>
  )
}
