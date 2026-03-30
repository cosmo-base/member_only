import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { Award, Rocket, Users, ExternalLink } from "lucide-react"

export default function CertificationPage() {
  return (
    <ContentPageLayout
      title="Space Voyager 検定"
      level={4}
      levelTitle="体系化"
      logo="CBvoyager"
    >
      {/* Hero Section */}
      <div className="glass-card rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/20">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              宇宙知識を体系的に学び、認定を取得
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Space Voyager検定は、宇宙に関する知識を体系的に学び、
              その理解度を証明できる検定試験です。
              宇宙の認定とコミュニティの認定、2つの軸で構成されています。
            </p>
          </div>
        </div>
      </div>

      {/* Two Certifications */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 border-2 border-primary/30">
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">宇宙の認定</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            宇宙に関する知識を問う認定です。太陽系、恒星・銀河、宇宙開発、
            ロケット技術など幅広い分野から出題されます。
            初級（Cosmic Explorer）から上級（Star Commander）まで
            3つのレベルがあり、段階的にステップアップできます。
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>初級: Cosmic Explorer</span>
              <span>宇宙の基礎知識</span>
            </div>
            <div className="flex justify-between">
              <span>中級: Space Navigator</span>
              <span>天文学・宇宙工学基礎</span>
            </div>
            <div className="flex justify-between">
              <span>上級: Star Commander</span>
              <span>専門知識・最新研究</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border-2 border-accent/30">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-accent" />
            <h3 className="text-xl font-semibold text-foreground">コミュニティの認定</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Cosmo Baseコミュニティへの貢献度を認定します。
            イベントへの参加、質問への回答、レポートの投稿など、
            コミュニティ活動を通じてレベルアップしていきます。
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Level 1: Member</span>
              <span>参加者</span>
            </div>
            <div className="flex justify-between">
              <span>Level 2: Contributor</span>
              <span>貢献者</span>
            </div>
            <div className="flex justify-between">
              <span>Level 3: Ambassador</span>
              <span>大使</span>
            </div>
          </div>
        </div>
      </div>

      {/* Both Certifications */}
      <div className="glass-card rounded-xl p-6 mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30">
        <div className="flex items-center gap-3 mb-3">
          <Award className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">両方の認定を取得すると...</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          宇宙の認定とコミュニティの認定、両方を取得すると「Space Voyager」として認定されます。
          Space Voyagerには特別なバッジが付与され、Cosmo Baseの各種イベントで優先参加権などの特典があります。
        </p>
      </div>

      {/* External Link */}
      <div className="glass-card rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          検定の詳細を見る
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          試験概要、出題範囲、申込方法などの詳細はこちら
        </p>
        <a
          href="https://v0.app/chat/space-voyager-gHZtzHqXJlE?b=b_rsDntVI1SBY&f=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="bg-primary hover:bg-primary/90">
            検定紹介ページを開く
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </a>
      </div>

      {/* FAQ */}
      <div className="glass-card rounded-xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">よくある質問</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-1">試験はオンラインで受けられますか？</h4>
            <p className="text-sm text-muted-foreground">
              はい、全レベルの試験をオンラインで受験できます。指定の日時にご自宅から受験可能です。
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">合格基準は何点ですか？</h4>
            <p className="text-sm text-muted-foreground">
              各レベルとも100点満点中70点以上で合格となります。
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">不合格の場合、再受験はできますか？</h4>
            <p className="text-sm text-muted-foreground">
              はい、次回以降の試験日程で再受験が可能です。受験回数に制限はありません。
            </p>
          </div>
        </div>
      </div>
    </ContentPageLayout>
  )
}
