// app/partner/logos/page.tsx
"use client"

import Link from "next/link"
import { StarBackground } from "@/components/star-background"
import { ContentPageLayout } from "@/components/content-page-layout"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Download, Image as ImageIcon, ShieldAlert, CheckCircle2, FileDown, ArrowRight } from "lucide-react"

// ダウンロード対象のロゴアセット定義
const logoAssets = [
  {
    id: "CB_main",
    title: "メインロゴ（フルカラー）",
    description: "Webサイトや印刷物など、最も優先的に使用する標準のロゴマークです。",
    previewBg: "bg-secondary/20", // プレビュー時の背景色（透明PNGが見えやすいように）
    formats: [
      { type: "PNG", size: "1658x348 px", path: "/member_only/CosmoBase.png" },
    ]
  },
  {
    id: "CBicon",
    title: "シンボルマーク（アイコン）",
    description: "SNSのアイコンや、スペースが限られた正方形・円形の領域で使用します。",
    previewBg: "bg-secondary/20",
    formats: [
      { type: "PNG", size: "528x522 px", path: "/member_only/CB_icon.png" },
    ]
  },
  {
    id: "CB_light",
    title: "メインロゴ（白抜きモノトーン）",
    description: "背景色が暗い場所や、宇宙の背景画像の上に重ねて使用する場合に使用します。",
    previewBg: "bg-neutral-950", // 白抜きが見えるように背景を真っ黒に
    formats: [
      { type: "PNG", size: "1658x348 px", path: "/member_only/images/cosmo-base-logo.png" },
    ]
  }
]

export default function LogoDownloadPage() {
  return (
    <div className="min-h-screen relative">
      <StarBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
          <div className="mb-6">
            <Link href="/partner">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground -ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                パートナーマイページに戻る
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">ロゴデータ・ダウンロード</h1>
            <p className="text-muted-foreground">
              Cosmo Baseのパートナー・連携団体の皆様が、広報活動、メディア掲載、イベントタイアップ等で使用できる公式アセットです。利用規約・ガイドラインに準拠してご利用ください。
            </p>
          </div>

          {/* ロゴダウンロードセクション */}
          <div className="space-y-8 mb-16">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileDown className="w-5 h-5 text-primary" />
              <span>公式ブランドマーク一覧</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {logoAssets.map((logo) => (
                <GlassCard key={logo.id} className="flex flex-col h-full border-border/40">
                  {/* ロゴプレビューエリア */}
                  <div className={`w-full aspect-[2/1] rounded-xl flex items-center justify-center p-8 relative overflow-hidden ${logo.previewBg} border border-border/20`}>
                    <img 
                      src={logo.formats[0].path} 
                      alt={logo.title} 
                      className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                      // 画像がまだ無い場合のリンク切れ対策
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    {/* 画像リンク切れや未配置の時のダミーアイコン */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  </div>

                  {/* ロゴ情報 */}
                  <div className="mt-4 flex-1 flex flex-col justify-between">
                    <div className="mb-6">
                      <h3 className="font-bold text-lg text-foreground mb-2">{logo.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{logo.description}</p>
                    </div>

                    {/* フォーマット別ダウンロードボタン */}
                    <div className="space-y-2">
                      {logo.formats.map((format) => (
                        <div key={format.type} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border/40 text-sm">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                              {format.type}
                            </span>
                            <span className="text-xs text-muted-foreground">{format.size}</span>
                          </div>
                          
                          {/* ★Next.jsでの静的ファイル強制ダウンロードリンク */}
                          <a 
                            href={format.path} 
                            download={logo.title ? `${logo.id}.${format.type.toLowerCase()}` : true}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10">
                              <Download className="w-3.5 h-3.5 mr-1.5" /> ダウンロード
                            </Button>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* ミニガイドラインセクション */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 許可される使い方 */}
            <GlassCard className="border-l-4 border-l-emerald-500 bg-background/40">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>推奨される使用例</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">・</span>
                  <span>パートナーシップ締結に関するプレスリリースや特設サイトへの掲載</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">・</span>
                  <span>共同開催、または協賛・協力する宇宙イベントの告知ポスター・スライド</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">・</span>
                  <span>コミュニティ連携、学生団体アライアンスの紹介資料へのマーク配置</span>
                </li>
              </ul>
            </GlassCard>

            {/* 禁止事項 */}
            <GlassCard className="border-l-4 border-l-destructive bg-background/40">
              <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-destructive" />
                <span>使用における禁止事項</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold shrink-0">・</span>
                  <span>ロゴの縦横比の変更、変形、回転、一部分のみの切り出し抽出</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold shrink-0">・</span>
                  <span>指定色以外のカラーへの変更、過度なグラデーション・影エフェクトの追加</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold shrink-0">・</span>
                  <span>ロゴマークの周囲に十分な余白（アイソレーション）を確保しない配置</span>
                </li>
              </ul>
            </GlassCard>
            
          </div>

          {/* 問い合わせへの導線 */}
          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground">
              ガイドラインに記載のない特殊な媒体への配置や、高解像度の別素材が必要な場合は、
              <Link href="/CBMD/inquiry" className="text-primary hover:underline inline-flex items-center ml-1">
                運営チームまでお問い合わせください <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </p>
          </div>

        </main>
      </div>
    </div>
  )
}
