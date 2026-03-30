import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { BookOpen, ExternalLink } from "lucide-react"

export default function LibraryPage() {
  return (
    <ContentPageLayout
      title="Cosmo Base Library"
      level={4}
      levelTitle="体系化"
      logo="CBL"
    >
      {/* Hero Section */}
      <div className="glass-card rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/20">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              宇宙の知識を体系的に学ぶ
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                Cosmo Base Libraryは、宇宙に関する知識を分野ごとに整理し、
                初心者から上級者まで段階的に学習できるように設計されたデジタルライブラリです。
              </p>
              <p>
                太陽系の惑星、恒星と銀河、宇宙開発の歴史、ロケット技術、宇宙飛行士、
                天体観測の方法など、幅広いトピックを網羅。
                記事、図解、動画など多様な形式のコンテンツで、
                自分のペースで楽しく学習を進められます。
              </p>
              <p>
                週刊宇宙ニュースのバックナンバーや、「行ってきた」のイベントレポートも
                アーカイブとして閲覧可能。検定対策にも最適な学習リソースが揃っています。
              </p>
              <p>
                検索機能やブックマーク機能で、知りたい情報にすぐアクセス。
                学習進捗管理機能で、自分の成長を可視化することもできます。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="glass-card rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          ライブラリを探索する
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          宇宙の知識を深めましょう
        </p>
        <a
          href="https://cosmo-base.github.io/library/index.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="bg-primary/80 hover:bg-primary/70">
            <BookOpen className="w-4 h-4 mr-2" />
            Cosmo Base Libraryを開く
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </a>
      </div>
    </ContentPageLayout>
  )
}
