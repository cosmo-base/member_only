import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { User, Zap, BarChart, Users, Clock } from "lucide-react"

export default function DiagnosisPage() {
  return (
    <ContentPageLayout
      title="宇宙タイプ診断"
      level={2}
      levelTitle="自分を知る"
      logo="CBtype"
    >
      {/* Hero Section */}
      <div className="glass-card rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/20">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              4タイプで気軽に、16タイプで本格的に。あなたらしい宇宙の楽しみ方。
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                「宇宙に興味はあるけれど、自分に合った関わり方が分からない」という方のために用意したのが、宇宙タイプ診断です。数分で答えられる直感的な質問から、あなたにぴったりの宇宙との向き合い方が分かります。
              </p>
              <p>
                まずは気軽に試せる「簡易版（4タイプ）」で、ロマンを楽しむ、社会とのつながりを捉えるなど、ご自身の大きな方向性を知ることができます。さらに、より深く自分を知りたい方向けに、16タイプに細分化された「詳細版」もご用意しています。
              </p>
              <p>
                自分の興味が言葉になることで、宇宙との距離はぐっと近くなります。ご自身のペースで楽しむのはもちろん、参加者同士で結果を共有し合い、新しい視点や関わり方を見つけるきっかけとしてぜひご活用ください。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis Options */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 border-2 border-primary/30">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">簡易版</h3>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Clock className="w-4 h-4" />
            <span>所要時間: 約2分</span>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            5つの質問でサクッと診断。まずはお気軽に試してみてください。
            結果はSNSでシェアできます。
          </p>
          <a href="https://cosmo-base.github.io/opening/projects/space-type/content">
            <Button className="w-full bg-primary/70 hover:bg-primary/60 text-primary-foreground">
              簡易診断を始める
            </Button>
          </a>
        </div>

        <div className="glass-card rounded-xl p-6 border-2 border-accent/30">
          <div className="flex items-center gap-3 mb-4">
            <BarChart className="w-6 h-6 text-accent" />
            <h3 className="text-xl font-semibold text-foreground">完全版</h3>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Clock className="w-4 h-4" />
            <span>所要時間: 約10分</span>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            24の質問で詳細に分析。あなたの宇宙への興味の傾向を多角的に診断します。おすすめコンテンツも紹介。
          </p>
          {/*<Link href="/diagnosis/full">*/}
          <Button className="w-full" variant="outline">
            近日公開{/*完全診断を始める*/}
          </Button>
          {/*</Link>*/}
        </div>
      </div>

      {/* Type List */}
      {/*<div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">タイプ一覧</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          全8種類の宇宙タイプを紹介。それぞれの特徴と
          おすすめの楽しみ方をチェックしてみましょう。
        </p>
        <Link href="/diagnosis/types">
          <Button variant="outline" className="w-full">
            タイプ一覧を見る
          </Button>
        </Link>
      </div>*/}
    </ContentPageLayout>
  )
}
