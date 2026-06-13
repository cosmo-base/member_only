// app/cosmomatch/rocket/dictionary/[id]/page.tsx
import Link from "next/link"
import { notFound } from "next/navigation"
import { ContentPageLayout } from "@/components/content-page-layout"
import { ROCKETS } from "@/data/CMrockets"
import { Globe, Shield, Layers, ExternalLink, ArrowLeft, Bookmark, Activity } from "lucide-react"
import { CMRadarChart } from "@/components/ui/radar-chart"

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return ROCKETS.map((rocket) => ({
    id: rocket.slug, 
  }))
}

interface PageProps {
  params: Promise<{ id: string }> | { id: string } | any;
}

export default async function RocketDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const currentId = resolvedParams?.id;

  const rocket = ROCKETS.find(r => r.slug === currentId)
  
  if (!rocket) notFound()

  const relatedList = ROCKETS.filter(r => rocket.relatedRockets.includes(r.slug))

  // チャート用のデータ整形
  const chartData = [
    { subject: "パワー", A: rocket.stats.power },
    { subject: "技術", A: rocket.stats.technology },
    { subject: "歴史", A: rocket.stats.history },
    { subject: "エース", A: rocket.stats.ace },
    { subject: "挑戦", A: rocket.stats.challenge },
    { subject: "個性", A: rocket.stats.individuality },
    { subject: "未来", A: rocket.stats.future },
    { subject: "信頼", A: rocket.stats.trust },
  ]

  return (
    <ContentPageLayout title="ロケット図鑑" level={1} levelTitle="" logo="CosmoMatch">
      <div className="max-w-4xl mx-auto pb-16 animate-in fade-in duration-500">
        
        <div className="mb-6">
          <Link href="/cosmomatch/rocket" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> 診断トップに戻る
          </Link>
        </div>

        {/* 1. ファーストビュー */}
        <div className="glass-card rounded-2xl p-6 md:p-8 mb-6 border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 z-30" style={{ backgroundColor: rocket.stats.ace > 4 ? '#00f2fe' : '#38bdf8' }} />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary/20 text-primary border border-primary/30 text-xs font-bold px-3 py-1 rounded-full">{rocket.country}</span>
              <span className="bg-accent/20 text-accent border border-accent/30 text-xs font-bold px-3 py-1 rounded-full">{rocket.category}</span>
              <span className="bg-secondary text-muted-foreground border border-border/50 text-xs font-bold px-3 py-1 rounded-full">
                {rocket.status === "active" ? "● 現役稼働" : "✖ 退役機"}
              </span>
            </div>
            <div className="text-4xl filter drop-shadow-md">{rocket.emoji}</div>
          </div>
          <h2 className="text-3xl font-extrabold text-foreground mb-2">{rocket.name}</h2>
          <p className="text-primary font-bold text-lg">「{rocket.catchCopy}」</p>
        </div>

        {/* 2. 基本スペック */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-secondary/20 p-4 rounded-xl border border-border/40">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Globe className="w-3.5 h-3.5" /> 国 / 地域</span>
            <p className="text-sm font-bold text-foreground">{rocket.country}</p>
          </div>
          <div className="bg-secondary/20 p-4 rounded-xl border border-border/40">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Layers className="w-3.5 h-3.5" /> カテゴリ</span>
            <p className="text-sm font-bold text-foreground truncate">{rocket.category}</p>
          </div>
          <div className="bg-secondary/20 p-4 rounded-xl border border-border/40">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Shield className="w-3.5 h-3.5" /> 運用ステータス</span>
            <p className="text-sm font-bold text-foreground">{rocket.status === "active" ? "現役" : "退役"}</p>
          </div>
        </div>

        {/* 3. 機体パラメーター (レーダーチャート) */}
        <div className="space-y-6 mb-10">
          <h3 className="text-xl font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            機体パラメーター
          </h3>
          <div className="bg-secondary/10 border border-border/40 p-4 rounded-2xl h-[320px] flex items-center justify-center">
            {/* ★ クライアントコンポーネントを呼び出す */}
            <CMRadarChart rocketName={rocket.name} data={chartData} />
          </div>
        </div>

        {/* 4. ドラマチックストーリー */}
        <div className="space-y-6 mb-10">
          <h3 className="text-xl font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-accent" />
            機体ストーリー・背景
          </h3>
          
          <div className="space-y-6 bg-secondary/10 p-6 rounded-2xl border border-border/50 leading-relaxed">
            <div>
              <h4 className="text-sm font-bold text-primary mb-1">▼ なぜ生まれたのか？</h4>
              <p className="text-sm text-muted-foreground">{rocket.story.origin}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-accent mb-1">▼ どんな試練や苦労があったのか？</h4>
              <p className="text-sm text-muted-foreground">{rocket.story.struggle}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-1">▼ 宇宙開発において、今どういう存在か？</h4>
              <p className="text-sm text-muted-foreground">{rocket.story.today}</p>
            </div>
          </div>
        </div>

        {/* 5. コミュニティ回遊層 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-bold text-foreground text-base">関連するロケット</h4>
            <div className="space-y-2">
              {relatedList.map((rel) => (
                <Link key={rel.slug} href={`/cosmomatch/rocket/dictionary/${rel.slug}`} className="block bg-background/50 hover:bg-secondary/30 border border-border/50 rounded-xl p-3 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{rel.emoji}</span>
                    <span className="text-sm font-medium text-foreground">{rel.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-foreground text-base">CBL（ライブラリ）で知識を深める</h4>
            <div className="space-y-2">
              {rocket.articleLinks.map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-background/50 hover:bg-secondary/30 border border-border/50 rounded-xl p-3 transition-colors group">
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors truncate max-w-[240px]">
                    {link.title}
                  </span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </ContentPageLayout>
  )
}