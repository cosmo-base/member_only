import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { Calendar, History, CalendarDays, MessageSquare, Users } from "lucide-react"

export default function ShittokuPage() {
  return (
    <ContentPageLayout
      title="Cosmo Baseで宇宙知っトク"
      level={2}
      levelTitle="自分を知る"
      logo="CBshittoku"
    >
      {/* Hero Section */}
      <div className="glass-card rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/20">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              毎週開催の宇宙イベント・講座
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                オンラインで気軽に参加できる宇宙イベントや講座を毎週開催しています。
                宇宙の専門家や研究者、そして宇宙愛好家が登壇し、様々なテーマでお話しします。
              </p>
              <p>
                惑星科学、ロケット工学、宇宙ビジネス、天体観測のコツなど、
                幅広いジャンルをカバー。初心者の方も大歓迎で、質問タイムでは自由に質問できます。
                録画アーカイブも残るので、リアルタイムで参加できなくても後から視聴可能です。
              </p>
              <p>
                「宇宙に興味はあるけど、何から始めればいいかわからない」という方にぴったり。
                専門家の話を聞くことで、宇宙への理解がぐっと深まります。
              </p>
            </div>
          </div>
        </div>
      </div>

{/* Current Month Event Image */}
      <div className="mb-8 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-foreground mb-4 self-start w-full">
          今月のイベント
        </h3>

        <div className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden border border-border/50 shadow-md">
          <img
            src="/member-only/shittoku/2604.jpeg"
            alt="今月のイベント"
            className="w-full h-auto object-cover transition-transform duration-500"
          />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <History className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">過去イベント一覧</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            これまでに開催されたイベントのアーカイブ。<br />
            見逃したイベントも録画で視聴できます。
          </p>
          {/*<Link href="/shittoku/archive">*/}
            <Button variant="outline" className="w-full">
              近日公開{/*アーカイブを見る*/}
            </Button>
          {/*</Link>*/}
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">今後のイベント</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            これから開催予定のイベント一覧。<br />
            気になるイベントはカレンダーに追加しよう。
          </p>
          <Link href="/shittoku/upcoming">
            <Button variant="outline" className="w-full">
              スケジュールを見る
            </Button>
          </Link>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">要望フォーム</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            「こんなテーマを扱ってほしい」というリクエストをお寄せください。皆さんの声でイベントを作ります。
          </p>
          <Link href="/shittoku/request">
            <Button variant="outline" className="w-full">
              リクエストを送る
            </Button>
          </Link>
        </div>

        {/*<div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">登壇者紹介</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            これまでにご登壇いただいた方のプロフィールを紹介します。
          </p>
          <Link href="/shittoku/speakers">
            <Button variant="outline" className="w-full">
              登壇者を見る
            </Button>
          </Link>
        </div>*/}
      </div>
    </ContentPageLayout>
  )
}
