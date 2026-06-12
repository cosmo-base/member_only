// app/cosmomatch/rocket/result/page.tsx
"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { ROCKETS } from "@/data/rocket"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts"
import { Award, ArrowRight, RefreshCw, BookOpen, Star, Sparkles, Loader2, ChevronRight } from "lucide-react"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 1. 中身のコンテンツコンポーネント (useSearchParamsを使う部分)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ResultContent() {
  const searchParams = useSearchParams()
  const rocketSlug = searchParams.get("rocket") || "h3"

  // マッチしたロケットを特定
  const rocket = ROCKETS.find(r => r.slug === rocketSlug) || ROCKETS[0]

  // レーダーチャート用のデータ整形
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

  // 推し以外の第2候補をランダムまたは近似で2機選定
  const otherCandidates = ROCKETS.filter(r => r.slug !== rocket.slug).slice(0, 2)

  return (
    <div className="max-w-3xl mx-auto pb-16 animate-in fade-in zoom-in-95 duration-500">
      
      {/* ファーストビュー */}
      <div className="text-center mb-8 relative">
        <span className="px-3 py-1 text-xs font-bold bg-accent/20 text-accent rounded-full border border-accent/30 tracking-widest uppercase glow-sm mb-3 inline-block">
          BEST MATCH
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          あなたの推しは <span className="text-primary">{rocket.name}</span> ！
        </h2>
        <p className="text-lg md:text-xl font-bold text-muted-foreground max-w-xl mx-auto leading-snug">
          「{rocket.catchCopy}」
        </p>
      </div>

      {/* 巨大ビジュアル (シルエットまたはモック画像) */}
      <div className="w-full relative aspect-[21/9] bg-gradient-to-b from-secondary/30 to-background rounded-2xl border border-border/40 overflow-hidden flex items-center justify-center mb-8 shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
        <div className="text-7xl filter drop-shadow-[0_0_20px_rgba(0,242,254,0.5)] transform -rotate-12 animate-bounce duration-1000">
          {rocket.emoji}
        </div>
        <Sparkles className="absolute top-4 right-12 text-accent w-5 h-5 animate-pulse" />
      </div>

      {/* チャート ＆ 納得感セクション */}
      <div className="grid md:grid-cols-5 gap-6 items-center mb-10">
        {/* 左側: チャート */}
        <div className="md:col-span-3 bg-secondary/10 border border-border/40 p-4 rounded-2xl h-[280px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="#38bdf8" opacity={0.2} />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} fontWeight="bold" />
              <Radar name={rocket.name} dataKey="A" stroke="#00f2fe" fill="#00f2fe" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        {/* 右側: 補足説明 */}
        <div className="md:col-span-2 space-y-4">
          <div className="inline-flex items-center gap-2 font-bold text-lg text-foreground bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
            <Award className="w-5 h-5 text-primary" />
            相性同調率: 94%
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            あなたの「惹かれる感情のパラメータ」と、{rocket.name}の持つ機体設計・背景ストーリーのグラフが最も高い純度で美しく重なり合いました。
          </p>
        </div>
      </div>

      {/* 魅力カード */}
      <div className="space-y-4 mb-12">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Star className="w-4 h-4 text-primary fill-primary" />
          ここがあなたの推しポイント！
        </h3>
        <div className="grid gap-3">
          {rocket.highlights.map((point, index) => (
            <div key={index} className="bg-secondary/20 border border-border/50 rounded-xl p-4 flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold mt-0.5 shrink-0">
                {index + 1}
              </span>
              <p className="text-sm text-foreground font-medium leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 第2候補 */}
      {otherCandidates.length > 0 && (
        <div className="mb-12">
          <h3 className="text-sm font-bold text-muted-foreground tracking-wider uppercase mb-4">
            あなたに近い他のロケット候補
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {otherCandidates.map((cand) => (
              <Link key={cand.slug} href={`/cosmomatch/rocket/result?rocket=${cand.slug}`} className="block group">
                <div className="bg-secondary/10 border border-border/40 rounded-xl p-4 flex items-center justify-between hover:border-primary/40 hover:bg-secondary/30 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cand.emoji}</span>
                    <div>
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{cand.name}</h4>
                      <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">{cand.catchCopy}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 最終CTAアクション */}
      <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link href={`/cosmomatch/rocket/dictionary/${rocket.slug}`} className="w-full sm:w-auto">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow h-13 px-8 rounded-full font-bold">
            <BookOpen className="w-4 h-4 mr-2" />
            {rocket.name}の図鑑でもっと深掘りする
          </Button>
        </Link>
        <Link href="/cosmomatch/rocket" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full border-border/60 text-muted-foreground hover:text-foreground h-13 px-6 rounded-full font-bold">
            <RefreshCw className="w-4 h-4 mr-2" />
            もう一度診断する
          </Button>
        </Link>
      </div>

    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 2. ページ本体 (Suspenseで囲んでビルドエラーを回避)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function ResultPage() {
  return (
    <ContentPageLayout title="診断結果" level={1} levelTitle="" logo="">
      <Suspense fallback={
        <div className="max-w-3xl mx-auto py-24 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-bold">結果を生成中...</p>
        </div>
      }>
        <ResultContent />
      </Suspense>
    </ContentPageLayout>
  )
}