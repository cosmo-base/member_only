// app/cosmomatch/rocket/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { ROCKETS, RocketStats, Question } from "@/data/CMrockets"
import { Zap, Clock, Rocket as RocketIcon, Loader2, ChevronLeft, ChevronRight } from "lucide-react"

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "一番ワクワクするのは？",
    choices: [
      { text: "圧倒的な迫力やスケール", score: { power: 2, ace: 1 } },
      { text: "「どうやって実現したの？」と思う技術", score: { technology: 2, individuality: 1 } },
      { text: "長い歴史や受け継がれてきた物語", score: { history: 2, trust: 1 } },
      { text: "新しい時代を切り開く挑戦", score: { challenge: 2, future: 1 } }
    ]
  },
  {
    id: 2,
    title: "応援したくなるのは？",
    choices: [
      { text: "頼れる王道の存在", score: { ace: 2, trust: 1 } },
      { text: "失敗しても挑み続ける存在", score: { challenge: 2, future: 1 } },
      { text: "独自の道を進む個性派", score: { individuality: 2, technology: 1 } },
      { text: "長い間活躍してきたベテラン", score: { history: 2, trust: 1 } }
    ]
  },
  {
    id: 3,
    title: "もし打ち上げを見に行くなら？",
    choices: [
      { text: "誰もが注目する大型ミッション", score: { power: 2, ace: 1 } },
      { text: "新型ロケットの初飛行", score: { future: 2, challenge: 1 } },
      { text: "特別な技術が使われたミッション", score: { technology: 2, individuality: 1 } },
      { text: "歴史に残る名機の活躍", score: { history: 2, trust: 1 } }
    ]
  },
  {
    id: 4,
    title: "あなたが惹かれるのは？（二択）",
    choices: [
      { text: "積み重ねてきた長い実績", score: { history: 2, trust: 2 } },
      { text: "前例のない未知への挑戦", score: { challenge: 2, future: 2 } }
    ]
  },
  {
    id: 5,
    title: "直感的にどちらが好き？（二択）",
    choices: [
      { text: "みんなに愛される王道", score: { ace: 2, power: 1 } },
      { text: "唯一無二の尖った個性", score: { individuality: 2, technology: 1 } }
    ]
  }
]

export default function DiagnosePage() {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  const [userStats, setUserStats] = useState<RocketStats>({
    power: 0, technology: 0, history: 0, ace: 0, challenge: 0, individuality: 0, future: 0, trust: 0
  })

  const handleChoice = (score: Partial<RocketStats>) => {
    const updatedStats = { ...userStats }
    Object.keys(score).forEach((key) => {
      const k = key as keyof RocketStats
      updatedStats[k] = (updatedStats[k] || 0) + (score[k] || 0)
    })
    setUserStats(updatedStats)

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      calculateResult(updatedStats)
    }
  }

  const calculateResult = (finalStats: RocketStats) => {
    setIsLoading(true)

    setTimeout(() => {
      let bestRocket = ROCKETS[0]
      let minDistance = Infinity

      ROCKETS.forEach((rocket) => {
        let distance = 0
        Object.keys(rocket.stats).forEach((key) => {
          const k = key as keyof RocketStats
          const userScore = finalStats[k] || 0
          const rocketScore = rocket.stats[k]
          distance += Math.pow(userScore - rocketScore, 2)
        })

        if (distance < minDistance) {
          minDistance = distance
          bestRocket = rocket
        }
      })

      // ★ 修正: ユーザーのスコアもパラメータに含めて結果ページへ渡す
      const queryParams = new URLSearchParams({
        rocket: bestRocket.slug,
        power: String(finalStats.power),
        technology: String(finalStats.technology),
        history: String(finalStats.history),
        ace: String(finalStats.ace),
        challenge: String(finalStats.challenge),
        individuality: String(finalStats.individuality),
        future: String(finalStats.future),
        trust: String(finalStats.trust),
      }).toString()

      router.push(`/cosmomatch/rocket/result?${queryParams}`)
    }, 2200)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      setStarted(false)
    }
  }

  if (!started) {
    return (
      <ContentPageLayout title="推しロケット診断" level={1} levelTitle="" logo="">
        <div className="max-w-2xl mx-auto text-center py-12 animate-in fade-in duration-500">
          <div className="inline-flex items-center justify-center p-5 bg-primary/20 rounded-full mb-6 border border-primary/30 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
            <RocketIcon className="w-12 h-12 text-primary animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground mb-4 tracking-tight">
            あなたの推しロケットは？
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed mb-8">
            直感で答えるだけ。専門知識は一切不要！<br />
            あなたが心の奥で惹かれる「運命の1機」を見つけよう。
          </p>

          <GlassCard className="p-6 mb-8 max-w-sm mx-auto bg-secondary/10 border-border/40">
            <div className="flex items-center justify-around text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Clock className="w-4 h-4 text-accent" /> 約1分
              </span>
              <span className="w-px h-4 bg-border" />
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Zap className="w-4 h-4 text-primary" /> 全5問
              </span>
            </div>
          </GlassCard>

          <Button 
            onClick={() => setStarted(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow h-14 px-12 rounded-full font-bold text-lg transition-transform active:scale-95"
          >
            診断を始める
          </Button>
        </div>
      </ContentPageLayout>
    )
  }

  if (isLoading) {
    return (
      <ContentPageLayout title="推しロケット診断" level={1} levelTitle="" logo="">
        <div className="max-w-md mx-auto text-center py-24 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <Loader2 className="w-12 h-12 text-accent animate-spin mb-6" />
          <h3 className="text-2xl font-bold text-foreground mb-2">推しロケットを分析中...</h3>
          <p className="text-sm text-muted-foreground tracking-wide">
            あなたのワクワクの原動力にシンクロする機体を探しています
          </p>
        </div>
      </ContentPageLayout>
    )
  }

  const currentQuestion = QUESTIONS[currentStep]
  const progressPercent = ((currentStep + 1) / QUESTIONS.length) * 100

  return (
    <ContentPageLayout title="推しロケット診断" level={1} levelTitle="" logo="">
      <div className="max-w-xl mx-auto py-6">
        <div className="flex items-center justify-between mb-8">
          <button onClick={handleBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            戻る
          </button>
          <div className="text-sm font-bold text-muted-foreground bg-secondary/40 px-3 py-1 rounded-full border border-border/40">
            Q {currentQuestion.id} / {QUESTIONS.length}
          </div>
        </div>

        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden mb-10">
          <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8 leading-snug">
            {currentQuestion.title}
          </h3>

          <div className="space-y-4">
            {currentQuestion.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(choice.score)}
                className="w-full text-left p-5 rounded-2xl border border-border/60 bg-secondary/20 hover:bg-primary/10 hover:border-primary/50 text-foreground font-semibold text-base transition-all active:scale-[0.99] shadow-sm backdrop-blur-sm group"
              >
                <div className="flex items-center justify-between">
                  <span>{choice.text}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all transform translate-x-2 group-hover:translate-x-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ContentPageLayout>
  )
}