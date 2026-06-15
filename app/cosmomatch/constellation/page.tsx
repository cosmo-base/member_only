// app/cosmomatch/constellation/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { Constellation, ConstellationStats, QUESTIONS, getConstellations } from "@/data/CMconstellation"
import { Zap, Clock, Stars as ConstellationIcon, Loader2, ChevronLeft, ChevronRight } from "lucide-react"

const STAT_KEYS = ['origin', 'energy', 'role', 'bond', 'form', 'mood', 'presence'] as const;

// ★ 修正：新しい配点に合わせた各軸の「最大獲得可能スコア」
const MAX_SCORES: Record<keyof ConstellationStats, number> = {
  origin: 5, energy: 7, role: 5, bond: 7, form: 6, mood: 7, presence: 7
};

export default function DiagnosePage() {
  const router = useRouter()

  const [constellations, setConstellations] = useState<Constellation[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const [started, setStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  // 計算フェーズに入ったかどうかのフラグ
  const [isCalculating, setIsCalculating] = useState(false)

  const [userStats, setUserStats] = useState<ConstellationStats>({
    origin: 0, energy: 0, role: 0, bond: 0, form: 0, mood: 0, presence: 0
  })

  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})

  // ★ ページを開いた瞬間から裏側でCSVを読み込み開始
  useEffect(() => {
    getConstellations().then((data) => {
      setConstellations(data);
      setIsDataLoaded(true);
    });
  }, []);

  const handleChoice = (score: Partial<ConstellationStats>, choiceText: string) => {
    const updatedStats = { ...userStats }
    Object.keys(score).forEach((key) => {
      const k = key as keyof ConstellationStats
      updatedStats[k] = (updatedStats[k] || 0) + (score[k] || 0)
    })
    setUserStats(updatedStats)

    const updatedAnswers = { ...userAnswers, [currentStep + 1]: choiceText }
    setUserAnswers(updatedAnswers)

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // 最後の質問に答えたら、計算モードに入る
      setIsCalculating(true)
    }
  }

  // ★ 計算モードに入り、かつデータが読み込めている場合のみ実行される
  useEffect(() => {
    if (isCalculating && isDataLoaded) {
      // 演出として少しだけローディングを見せる
      setTimeout(() => {
        executeMatching(userStats, userAnswers);
      }, 1500);
    }
  }, [isCalculating, isDataLoaded]);

  // 実際のマッチングと送信処理
  const executeMatching = (finalStats: ConstellationStats, finalAnswers: Record<number, string>) => {
    if (constellations.length === 0) return;

    // ユーザーのスコアを0〜9に正規化
    const normalizedStats = {} as ConstellationStats;
    STAT_KEYS.forEach(key => {
      const rawScore = finalStats[key] || 0;
      const maxScore = MAX_SCORES[key] || 1;
      normalizedStats[key] = Math.min(9, Math.round((rawScore / maxScore) * 9));
    });

    let bestConstellation = constellations[0]
    let minDistance = Infinity

    constellations.forEach((Constellation) => {
      let distance = 0
      STAT_KEYS.forEach((key) => {
        const userScore = normalizedStats[key]
        const ConstellationScore = Constellation.stats[key] || 0
        distance += Math.pow(userScore - ConstellationScore, 2)
      })

      if (distance < minDistance) {
        minDistance = distance
        bestConstellation = Constellation
      }
    })

    const totalDiff = STAT_KEYS.reduce((acc, key) => {
      return acc + Math.abs(normalizedStats[key] - (bestConstellation.stats[key] || 0))
    }, 0)
    const matchPercent = Math.max(60, Math.min(99, Math.round(100 - totalDiff * 1.5)));

    const GAS_URL = "https://script.google.com/macros/s/AKfycbxfhx-DlgYauECo0vPZ8TJNjs1pIL96GxhifeB4FTfxN__jIpYoz9JdNMnLub9euDtORQ/exec";
    const payload = {
      rocket: bestConstellation.name,
      matchPercent: matchPercent,
      ...normalizedStats,
      q1: finalAnswers[1] || "",
      q2: finalAnswers[2] || "",
      q3: finalAnswers[3] || "",
      q4: finalAnswers[4] || "",
      q5: finalAnswers[5] || "",
    };

    fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    }).catch(err => console.error("GAS Error:", err));

    const encodedStats = STAT_KEYS.map(k => Math.min(35, normalizedStats[k] || 0).toString(36)).join('');

    router.push(`/cosmomatch/constellation/result?c=${bestConstellation.slug}&s=${encodedStats}`)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      setStarted(false)
    }
  }

  // ★ 最初の画面。ボタンは無条件で押せるように修正
  if (!started) {
    return (
      <ContentPageLayout title="Cosmo Match～星座編～" level={1} levelTitle="" logo="CosmoMatch">
        <div className="max-w-2xl mx-auto text-center py-12 animate-in fade-in duration-500">
          <div className="inline-flex items-center justify-center p-5 bg-primary/20 rounded-full mb-6 border border-primary/30 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
            <ConstellationIcon className="w-12 h-12 text-primary animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground mb-4 tracking-tight">
            Cosmo Match - あなたの推しを探せ <br />～星座編～
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed mb-8">
            直感で答えるだけ。専門知識は一切不要！<br />
            あなたが心の奥で惹かれる「運命の星座」を見つけよう。
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

          <Button id="btn-cosmomatch-constellation"
            onClick={() => setStarted(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow h-14 px-12 rounded-full font-bold text-lg transition-transform active:scale-95"
          >
            マッチングを始める
          </Button>
        </div>
      </ContentPageLayout>
    )
  }

  // ★ 計算フェーズのローディング
  if (isCalculating) {
    return (
      <ContentPageLayout title="Cosmo Match～星座編～" level={1} levelTitle="" logo="CosmoMatch">
        <div className="max-w-md mx-auto text-center py-24 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <Loader2 className="w-12 h-12 text-accent animate-spin mb-6" />
          <h3 className="text-2xl font-bold text-foreground mb-2">推し星座を分析中...</h3>
          <p className="text-sm text-muted-foreground tracking-wide">
            {isDataLoaded ? "あなたのワクワクの原動力にシンクロする星々を探しています" : "最新の星座データを読み込んでいます..."}
          </p>
        </div>
      </ContentPageLayout>
    )
  }

  const currentQuestion = QUESTIONS[currentStep]
  const progressPercent = ((currentStep + 1) / QUESTIONS.length) * 100

  return (
    <ContentPageLayout title="Cosmo Match～星座編～" level={1} levelTitle="" logo="CosmoMatch">
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
                onClick={() => handleChoice(choice.score, choice.text)}
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