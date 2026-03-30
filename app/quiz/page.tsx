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
              毎日気軽に宇宙に触れられるクイズ
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                毎日1問、宇宙に関するクイズを出題します。惑星、恒星、宇宙探査、ロケット、宇宙飛行士など、
                幅広いジャンルから出題されるので、毎日新しい発見があります。
              </p>
              <p>
                クイズは初心者から上級者まで楽しめる難易度設定。答え合わせの際には詳しい解説がついているので、
                正解でも不正解でも宇宙の知識が身につきます。1日1問のペースで無理なく続けられるので、
                気づいた頃には宇宙博士に近づいているかもしれません。
              </p>
              <p>
                また、クイズの結果はSpace Voyager検定の対策にもなります。
                毎日の積み重ねが、体系的な知識習得への第一歩です。
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
