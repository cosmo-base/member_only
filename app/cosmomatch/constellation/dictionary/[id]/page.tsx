import Link from "next/link"
import { notFound } from "next/navigation"
import { ContentPageLayout } from "@/components/content-page-layout"
import { getConstellations } from "@/data/CMconstellation"
import { Globe, Eye, Languages, ExternalLink, ArrowLeft, Bookmark, Activity } from "lucide-react"
import { CMRadarChart } from "@/components/ui/radar-chart"

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const constellations = await getConstellations()
  return constellations.map((c) => ({
    id: c.slug, 
  }))
}

interface PageProps {
  params: Promise<{ id: string }> | { id: string } | any;
}

export default async function ConstellationDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const currentId = resolvedParams?.id;

  const constellations = await getConstellations()
  const constellation = constellations.find(r => r.slug === currentId)
  
  if (!constellation) notFound()

  // 関連する星座（一緒に好きになりそうな星座）のリストを取得
  const relatedList = constellations.filter(r => constellation.relatedConstellations.includes(r.name))

  const chartData = [
    { subject: "物語", A: constellation.stats.origin },
    { subject: "活動", A: constellation.stats.energy },
    { subject: "役割", A: constellation.stats.role },
    { subject: "関係", A: constellation.stats.bond },
    { subject: "対象", A: constellation.stats.form },
    { subject: "温度", A: constellation.stats.mood },
    { subject: "存在", A: constellation.stats.presence },
  ]

  return (
    <ContentPageLayout title="星座図鑑" level={1} levelTitle="" logo="CosmoMatch">
      <div className="max-w-4xl mx-auto pb-16 animate-in fade-in duration-500">
        
        <div className="mb-6">
          <Link href="/cosmomatch/constellation" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> 診断トップに戻る
          </Link>
        </div>

        {/* 1. ファーストビュー */}
        <div className="glass-card rounded-2xl p-6 md:p-8 mb-6 border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 z-30 bg-primary" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              <span className="bg-primary/20 text-primary border border-primary/30 text-xs font-bold px-3 py-1 rounded-full">{constellation.season}</span>
              <span className="bg-accent/20 text-accent border border-accent/30 text-xs font-bold px-3 py-1 rounded-full">{constellation.visibility}</span>
            </div>
            <div className="text-4xl filter drop-shadow-md">{constellation.emoji}</div>
          </div>
          <h2 className="text-3xl font-extrabold text-foreground mb-2">{constellation.name}</h2>
          <p className="text-primary font-bold text-lg">「{constellation.catchCopy}」</p>
        </div>

        {/* 2. 基本スペック */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-secondary/20 p-4 rounded-xl border border-border/40">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Globe className="w-3.5 h-3.5" /> 見頃の季節</span>
            <p className="text-sm font-bold text-foreground">{constellation.season}</p>
          </div>
          <div className="bg-secondary/20 p-4 rounded-xl border border-border/40">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Languages className="w-3.5 h-3.5" /> 英語名</span>
            <p className="text-sm font-bold text-foreground truncate">{constellation.englishName}</p>
          </div>
          <div className="bg-secondary/20 p-4 rounded-xl border border-border/40">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Eye className="w-3.5 h-3.5" /> 見つけやすさ</span>
            <p className="text-sm font-bold text-foreground">{constellation.visibility}</p>
          </div>
        </div>

        {/* 3. 星座パラメーター (レーダーチャート) */}
        <div className="space-y-6 mb-10">
          <h3 className="text-xl font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            星座パラメーター
          </h3>
          <div className="bg-secondary/10 border border-border/40 p-4 rounded-2xl h-[320px] flex items-center justify-center">
            <CMRadarChart name={constellation.name} data={chartData} />
          </div>
        </div>

        {/* 4. 星座ストーリー */}
        <div className="space-y-6 mb-10">
          <h3 className="text-xl font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-accent" />
            星座の物語・背景
          </h3>
          
          <div className="space-y-6 bg-secondary/10 p-6 rounded-2xl border border-border/50 leading-relaxed">
            <div>
              <h4 className="text-sm font-bold text-primary mb-1">▼ 名前の由来</h4>
              <p className="text-sm text-muted-foreground">{constellation.nameOrigin}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-accent mb-1">▼ 星座にまつわる物語</h4>
              <p className="text-sm text-muted-foreground">{constellation.story}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-1">▼ ライバル・似ている星座</h4>
              <p className="text-sm text-muted-foreground">
                【ライバル】 {constellation.rival || "特になし"}<br/>
                【似ている星座】 {constellation.similar || "特になし"}
              </p>
            </div>
          </div>
        </div>

        {/* 5. コミュニティ回遊層 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-bold text-foreground text-base flex items-center gap-2">
              関連する星座
            </h4>
            <div className="space-y-2">
              {relatedList.length > 0 ? relatedList.map((rel) => (
                <Link key={rel.slug} href={`/cosmomatch/constellation/dictionary/${rel.slug}`} className="block bg-background/50 hover:bg-secondary/30 border border-border/50 rounded-xl p-3 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{rel.emoji}</span>
                    <span className="text-sm font-medium text-foreground">{rel.name}</span>
                  </div>
                </Link>
              )) : (
                <p className="text-sm text-muted-foreground">関連データはありません</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-foreground text-base">CBL（ライブラリ）で知識を深める</h4>
            <div className="space-y-2">
              {constellation.articleLinks && constellation.articleLinks.length > 0 ? constellation.articleLinks.map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-background/50 hover:bg-secondary/30 border border-border/50 rounded-xl p-3 transition-colors group">
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors truncate max-w-[240px]">
                    {link.title}
                  </span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                </a>
              )) : (
                <p className="text-sm text-muted-foreground">関連記事は準備中です</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </ContentPageLayout>
  )
}