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

export default function DiagnosePage() {
  const router = useRouter()
  
  const [constellations, setConstellations] = useState<Constellation[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const [started, setStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  
  // 計算フェーズに入ったかどうかのフラグ
  const [isCalculating, setIsCalculating] = useState(false)
  
  // ★ 変更：ユーザーが「どの問題で何を選んだか」のスコアオブジェクトそのものを履歴として保存する
  const [userChoices, setUserChoices] = useState<Record<number, Partial<ConstellationStats>>>({})
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})

  useEffect(() => {
    getConstellations().then((data) => {
      setConstellations(data);
      setIsDataLoaded(true);
    });
  }, []);

  const handleChoice = (score: Partial<ConstellationStats>, choiceText: string) => {
    // 現在のステップ（Q1なら0）の回答スコアとテキストを保存
    setUserChoices(prev => ({ ...prev, [currentStep]: score }))
    setUserAnswers(prev => ({ ...prev, [currentStep + 1]: choiceText }))

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsCalculating(true)
    }
  }

  useEffect(() => {
    if (isCalculating && isDataLoaded) {
      setTimeout(() => {
        executeMatching();
      }, 1500);
    }
  }, [isCalculating, isDataLoaded]);

  const executeMatching = () => {
    if (constellations.length === 0) return;

    // ★ 平均値算出アルゴリズムの実行
    const finalStats = {} as ConstellationStats;

    STAT_KEYS.forEach(key => {
      // 1. 初期値として「5」を配列に入れておく
      const values: number[] = [5];
      
      // 2. ユーザーが選んだ5つの選択肢の中に、該当する軸のスコアがあれば配列に追加
      Object.values(userChoices).forEach(choiceScore => {
        if (choiceScore[key] !== undefined) {
          values.push(choiceScore[key] as number);
        }
      });
      
      // 3. 平均値を算出し、四捨五入して1〜9の間に収める
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      finalStats[key] = Math.max(1, Math.min(9, Math.round(avg)));
    });

    let bestConstellation = constellations[0]
    let minDistance = Infinity

    // ★ マッチング計算（ユークリッド距離の二乗）
    constellations.forEach((Constellation) => {
      let distance = 0
      STAT_KEYS.forEach((key) => {
        const userScore = finalStats[key]
        const constellationScore = Constellation.stats[key] || 5 // CSVが空なら5とみなす
        distance += Math.pow(userScore - constellationScore, 2)
      })

      if (distance < minDistance) {
        minDistance = distance
        bestConstellation = Constellation
      }
    })

    // 同調率の計算（絶対値の差分の合計から算出。最大56差）
    const totalDiff = STAT_KEYS.reduce((acc, key) => {
      return acc + Math.abs(finalStats[key] - (bestConstellation.stats[key] || 5))
    }, 0)
    const matchPercent = Math.max(60, Math.min(99, Math.round(100 - totalDiff * 1.5)));

    // GASへの送信
    const GAS_URL = "https://script.google.com/macros/s/AKfycbxfhx-DlgYauECo0vPZ8TJNjs1pIL96GxhifeB4FTfxN__jIpYoz9JdNMnLub9euDtORQ/exec";
    const payload = {
      rocket: bestConstellation.name,
      matchPercent: matchPercent,
      ...finalStats, // 1〜9の綺麗なデータ
      q1: userAnswers[1] || "",
      q2: userAnswers[2] || "",
      q3: userAnswers[3] || "",
      q4: userAnswers[4] || "",
      q5: userAnswers[5] || "",
    };
    
    fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    }).catch(err => console.error("GAS Error:", err));

    // URL用パラメータのエンコード (1〜9の数値なのでそのまま36進数にしても1文字に収まる)
    const encodedStats = STAT_KEYS.map(k => Math.min(35, finalStats[k] || 5).toString(36)).join('');

    router.push(`/cosmomatch/constellation/result?c=${bestConstellation.slug}&s=${encodedStats}`)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setIsCalculating(false)
    } else {
      setStarted(false)
    }
  }

  if (!started) {
    return (
      <ContentPageLayout title="Cosmo Match～星座編～" level={1} levelTitle="" logo="CosmoMatch">
        <div className="max-w-2xl mx-auto text-center py-12 animate-in fade-in duration-500">
          <div className="inline-flex items-center justify-center p-5 bg-primary/20 rounded-full mb-6 border border-primary/30 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
            <ConstellationIcon className="w-12 h-12 text-primary animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground mb-4 tracking-tight">
            Cosmo Match - あなたの推しを探せ <br/>～星座編～
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