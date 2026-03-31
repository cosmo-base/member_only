import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { HelpCircle, History, Award } from "lucide-react"

export default function QuizPage() {
  return (
    <ContentPageLayout
      title="毎日宇宙クイズ"
      level={1}
      levelTitle="習慣化"
      logo="CBquiz"
    >
      {/* Hero Section */}
      <div className="glass-card rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/20">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              1日1問、数十秒から始まる宇宙への第一歩。
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                「宇宙って難しそう」と感じている方にこそおすすめしたいのが、毎日宇宙クイズです。専門知識は一切不要で、スキマ時間にボタン一つで誰でも気軽に挑戦できるコンテンツです。
              </p>
              <p>
                毎日少しずつ宇宙に触れることで、知らなかったことを知る楽しさや、理解が深まる感覚を自然と味わえます。間違えても大丈夫。「知らなかった」を楽しむことこそが、宇宙への一番の入口です。
              </p>
              <p>
                この小さな毎日の習慣が、イベント参加やSpace Voyager 検定への挑戦など、次のステップへとつながっていきます。まずは今日の1問から、気軽に取り組んでみてください。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <History className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">過去の問題一覧</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            これまでに出題されたクイズを振り返ることができます。
            見逃した問題に挑戦したり、復習して知識を定着させましょう。
            カテゴリ別や日付順で検索も可能です。
          </p>
          <Button variant="outline" className="w-full">
            近日公開
          </Button>
          {/* <Link href="/quiz/archive">
            <Button variant="outline" className="w-full">
              過去の問題を見る
            </Button>
          </Link>*/}
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Space Voyager検定</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            クイズで身につけた知識を検定で証明しよう。
            毎日のクイズは検定対策にも最適です。
            初級から上級まで、あなたのレベルに合わせて挑戦できます。
          </p>
          <Link href="/voyager">
            <Button variant="outline" className="w-full">
              検定の詳細を見る
            </Button>
          </Link>
        </div>
      </div>
    </ContentPageLayout>
  )
}
