import Link from "next/link"
import { notFound } from "next/navigation"
import { ContentPageLayout } from "@/components/content-page-layout"
import { getConstellations } from "@/data/CMconstellation"
import { Globe, Eye, Languages, ExternalLink, ArrowLeft, Bookmark, Activity, Star } from "lucide-react"
import { CMRadarChart } from "@/components/ui/radar-chart"
// ★ 先ほど作ったクライアントコンポーネントを読み込む
import { VisualToggle } from "./visual-toggle"

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

  // 関連データやライバルデータの検索
  const relatedList = constellations.filter(r => constellation.relatedConstellations.includes(r.name))
  const rivalObj = constellations.find(c => c.name === constellation.rival)
  const similarObj = constellations.find(c => c.name === constellation.similar)

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

        <div className="glass-card rounded-2xl p-6 md:p-8 mb-6 border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 z-30 bg-primary" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex flex-wrap gap-2 z-40">
              <span className="bg-primary/20 text-primary border border-primary/30 text-xs font-bold px-3 py-1 rounded-full">{constellation.season}</span>
              <span className="bg-accent/20 text-accent border border-accent/30 text-xs font-bold px-3 py-1 rounded-full">{constellation.visibility}</span>
            </div>
            {/* ★ 画像と星の並びの切り替えコンポーネント */}
            <VisualToggle
              slug={constellation.slug}
              name={constellation.name}
              emoji={constellation.emoji}
              imageUrl={constellation.imageUrl}
            />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground mb-2 relative z-40">{constellation.name}</h2>
          <p className="text-primary font-bold text-lg relative z-40">「{constellation.catchCopy}」</p>
        </div>

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

        {/* ★ 推しポイントの追加 */}
        {constellation.highlights.length > 0 && (
          <div className="space-y-6 mb-10">
            <h3 className="text-xl font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary fill-primary" />
              ここが推しポイント！
            </h3>
            <div className="grid gap-3">
              {constellation.highlights.map((point, index) => (
                <div key={index} className="bg-secondary/20 border border-border/50 rounded-xl p-4 flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold mt-0.5 shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-sm text-foreground font-medium leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6 mb-10">
          <h3 className="text-xl font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            星座パラメーター
          </h3>
          <div className="bg-secondary/10 border border-border/40 p-4 rounded-2xl h-[320px] flex items-center justify-center">
            <CMRadarChart name={constellation.name} data={chartData} />
          </div>
        </div>

        <div className="space-y-6 mb-10">
          <h3 className="text-xl font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-accent" />
            星座の背景
          </h3>

          <div className="space-y-6 bg-secondary/10 p-6 rounded-2xl border border-border/50 leading-relaxed">
            <div>
              <h4 className="text-sm font-bold text-primary mb-1">▼ 名前の由来</h4>
              <p className="text-sm text-muted-foreground">{constellation.nameOrigin}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-2">
              {/* ★ ライバルへのリンク */}
              <div>
                <h4 className="text-sm font-bold text-accent mb-2">▼ ライバル</h4>
                {rivalObj ? (
                  <Link href={`/cosmomatch/constellation/dictionary/${rivalObj.slug}`} className="inline-flex items-center gap-2 bg-background/50 hover:bg-accent/10 border border-border/50 rounded-lg p-2 pr-4 transition-colors group">
                    <span className="text-xl">{rivalObj.emoji}</span>
                    <span className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{rivalObj.name}</span>
                  </Link>
                ) : (
                  <p className="text-sm text-muted-foreground">{constellation.rival || "特になし"}</p>
                )}
              </div>

              {/* ★ 似ている星座へのリンク */}
              <div>
                <h4 className="text-sm font-bold text-foreground mb-2">▼ 似ている星座</h4>
                {similarObj ? (
                  <Link href={`/cosmomatch/constellation/dictionary/${similarObj.slug}`} className="inline-flex items-center gap-2 bg-background/50 hover:bg-primary/10 border border-border/50 rounded-lg p-2 pr-4 transition-colors group">
                    <span className="text-xl">{similarObj.emoji}</span>
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{similarObj.name}</span>
                  </Link>
                ) : (
                  <p className="text-sm text-muted-foreground">{constellation.similar || "特になし"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

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
                <p className="text-sm text-muted-foreground text-center py-4 bg-secondary/10 rounded-xl border border-border/30">関連記事は準備中です</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </ContentPageLayout>
  )
}