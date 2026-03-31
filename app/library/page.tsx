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
              「もっと知りたい」に応える、宇宙知識のアーカイブ。
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                宇宙についてもう少し深く知りたいと思ったときに、必要な情報へすぐにたどり着けるデータベースです。過去のニュースまとめやイベントレポート、講座資料などを体系的に整理して格納しています。
              </p>
              <p>
                断片的な情報や難しすぎる専門知識に迷うことなく、無理のないレベルで理解を深めていくことができます。パートナー企業・団体様の資料も集約され、質の高い情報に触れられる環境が整っています。
              </p>
              <p>
                イベントに参加できなかったときの振り返りや、時間・場所に関係なく自分のペースで学びたいときに最適です。「もっと知りたい」という気持ちの受け皿となるこの場所で、じっくりと宇宙を学んでみてください。
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
