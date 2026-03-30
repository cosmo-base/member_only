import { ContentPageLayout } from "@/components/content-page-layout"
import { Home, Menu, Users, BookOpen, Calendar, Award, MessageCircle, Map } from "lucide-react"

export default function GuidePage() {
  return (
    <ContentPageLayout
      title="このページの使い方"
      level={0}
      levelTitle=""
      logo=""
    >
      <div className="space-y-8">
        {/* Overview */}
        <section className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">参加者ページとは</h2>
          <p className="text-muted-foreground leading-relaxed">
            Cosmo Base参加者ページは、宇宙コミュニティー「Cosmo Base」に参加している方向けのポータルサイトです。
            宇宙に関する様々なコンテンツやイベント情報、学習リソースにアクセスできます。
            4つのレベルに分かれたコンテンツを通じて、宇宙をより身近に感じていただけます。
          </p>
        </section>

        {/* Navigation Guide */}
        <section className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">ナビゲーション</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">ロゴ</h3>
                <p className="text-sm text-muted-foreground">左上のロゴをクリックすると、いつでもホームに戻れます。</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">パートナー一覧</h3>
                <p className="text-sm text-muted-foreground">Cosmo Baseと連携している企業・団体の一覧を確認できます。</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Menu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">メニュー</h3>
                <p className="text-sm text-muted-foreground">右上のハンバーガーメニューから、外部リンク（公式サイト、Library、SNSなど）にアクセスできます。</p>
              </div>
            </div>
          </div>
        </section>

        {/* Level Guide */}
        <section className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">4つのレベル</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
              <h3 className="font-medium text-foreground mb-2">Level 1 - 習慣化</h3>
              <p className="text-sm text-muted-foreground">毎日の宇宙クイズや週刊ニュースで、宇宙に触れる習慣を作ります。</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
              <h3 className="font-medium text-foreground mb-2">Level 2 - 自分を知る</h3>
              <p className="text-sm text-muted-foreground">宇宙タイプ診断で自分の興味関心を発見し、コミュニティで質問できます。</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
              <h3 className="font-medium text-foreground mb-2">Level 3 - リアル体験</h3>
              <p className="text-sm text-muted-foreground">イベントへの参加や体験レポートで、宇宙をリアルに感じます。</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
              <h3 className="font-medium text-foreground mb-2">Level 4 - 体系化</h3>
              <p className="text-sm text-muted-foreground">検定やライブラリで知識を体系化し、イベントデータベースで情報を発信します。</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">お問い合わせ</h2>
          <p className="text-muted-foreground leading-relaxed">
            ご不明な点やご要望がございましたら、意見箱からお気軽にお知らせください。
            また、各SNSのDMでもお問い合わせを受け付けています。
          </p>
        </section>
      </div>
    </ContentPageLayout>
  )
}
