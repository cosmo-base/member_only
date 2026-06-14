// app/cosmomatch/page.tsx
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { Heart, Rocket, Stars } from "lucide-react"

export const metadata = {
  title: "Cosmo Match",
  description: "直感で答えるだけ。広大な宇宙の中から、あなたにぴったりの「推し」を見つける参加型シリーズ。",
}

export default function CosmoMatchTopPage() {
  return (
    <ContentPageLayout
      title="Cosmo Match - あなたの推し○○を探せ"
      level={1}
      levelTitle=""
      logo="CosmoMatch"
    >
      <div className="max-w-4xl mx-auto py-8">
        {/* ヒーローセクション */}
        <div className="glass-card rounded-xl p-8 mb-8 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-2">
            <div className="p-3 rounded-lg bg-primary/20 shrink-0">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                あなたの「推し」を見つけよう。
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  「学ぶ」のではなく、「推す」ことから始めてみませんか？<br />
                  Cosmo Matchは、知識ゼロからあなただけの「推し」を見つけるための参加型シリーズです。いくつかの簡単な質問に直感で答えるだけで、あなたが心惹かれ、応援したくなる運命の対象をナビゲートします。
                </p>
                <p>
                  ロケットから始まり、天体や宇宙ミッションなど、出会える推しのジャンルは今後どんどん追加されていきます。難しい勉強は後回しにして、まずは気軽に遊んでみてください。「私の推しはこれ！」とコミュニティでシェアすれば、そこから新しい宇宙の楽しみ方が始まります。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* テーマ一覧 */}
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          
          {/* 第1弾：ロケット編 */}
          <div className="glass-card rounded-xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">~ロケット編~</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-6 flex-1 leading-relaxed">
              日本の宇宙輸送を担うエースから、独自路線を貫く個性派まで。あなたの「ワクワクの原動力」にシンクロする運命の1機をマッチングします。
            </p>
            <Link href="/cosmomatch/rocket">
              <Button variant="outline" className="w-full bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:text-primary font-bold">
                マッチングを始める
              </Button>
            </Link>
          </div>

          {/* 第2弾：星座編 */}
          <div className="glass-card rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Stars className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground">~星座編~</h3>
              </div>
              <span className="px-2 py-1 text-[10px] font-bold bg-secondary text-muted-foreground border border-border/50 rounded-md">
                Vol.2
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-6 flex-1 leading-relaxed opacity-80">
              季節を彩る星々の並びや、裏側に隠された神話の物語。あなたの性格や情緒に最もフィットする「夜空の道標」を見つけ出します。
            </p>
            <Button variant="outline" className="w-full text-muted-foreground opacity-60 cursor-not-allowed" disabled>
              近日公開
            </Button>
          </div>

        </div>
      </div>
    </ContentPageLayout>
  )
}