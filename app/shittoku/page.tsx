import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { Calendar, History, CalendarDays, MessageSquare, Users } from "lucide-react"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 画像を直接インポートする
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import eventImg from "../../public/shittoku/2604.jpeg"

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
              「ちょっと気になる」をみんなで楽しむ、気軽な学びの場。
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                宇宙に関するテーマを、分かりやすく楽しく学べる定期イベントです。ニュースの解説やミニ講座、座談会など、毎回さまざまな形式で開催され、専門知識がなくても気軽に参加できます。
              </p>
              <p>
                一方的に話を聞くだけでなく、気になったことをその場で質問したり、他の参加者の意見を聞けたりと、自然な会話が生まれるのが特徴です。「少し知ってみたい」という気持ちがあれば十分楽しめます。
              </p>
              <p>
                毎週水曜日の定期開催により、宇宙に触れる心地よいリズムが生まれます。「知る」だけでなく「話す」「共有する」体験を通じて、宇宙をもっと身近でワクワクするものに変えていきましょう。
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
          {/*インポートした画像の .src を指定します */}
          <img
            src={eventImg.src}
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