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
              忙しいあなたへ。週に一度、宇宙の“今”をお届け。
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                ロケットの打ち上げや新しい発見など、日々動いている宇宙界隈の出来事を、週に一度分かりやすく整理してお届けします。情報が多すぎてどこを見ればいいか分からない方にも最適です。
              </p>
              <p>
                単にニュースを並べるのではなく、何が話題でどんな流れが起きているのかを押さえてまとめているため、専門知識がなくても自然と最新の動向をつかむことができます。
              </p>
              <p>
                忙しい毎日の中で、週に一度だけ立ち止まって宇宙に触れる。その習慣が、私たちの暮らしと宇宙とのつながりをゆるやかに感じさせてくれます。気になった話題を一つ見つけるところから始めましょう。
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
