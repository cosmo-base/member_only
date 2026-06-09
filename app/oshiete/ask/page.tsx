// app/oshiete/ask/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Send, Loader2, Info, ChevronLeft } from "lucide-react"

export default function OshieteAskPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // ラジオボタンの初期値
  const [genre, setGenre] = useState("🛰️ 宇宙開発")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      // 抽出したGoogleフォームのaction URL
      await fetch(
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdHWPTtr7r7miuussTxMyR4oDxljnmxjQSeT3Q8Q7OoSVQauw/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          body: formData,
        }
      )
      setSubmitted(true)
    } catch (error) {
      console.error("送信エラー:", error)
      alert("送信に失敗しました。時間をおいて再度お試しください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ContentPageLayout
      title="匿名質問フォーム"
      level={2}
      levelTitle=""
      logo="CBoshiete"
    >
      <div className="max-w-3xl mx-auto mb-8">
        <div className="glass-card rounded-xl p-6 border border-border/50 shadow-lg bg-background/50 backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20 shrink-0">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                完全匿名・宇宙の質問箱
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                宇宙の基礎的な疑問、ニュースで気になったこと、「こんなこと聞いていいのかな？」という雑談レベルの質問までなんでもOKです。<br />
                いただいた質問は、Discord内や定期コンテンツを通してCosmo Baseメンバーがわかりやすく回答します！
              </p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="glass-card rounded-xl p-10 text-center animate-in fade-in slide-in-from-bottom-4 border border-border/50 shadow-xl bg-background/50 backdrop-blur-md mt-8">
            <div className="p-4 rounded-full bg-emerald-500/20 w-fit mx-auto mb-6">
              <Send className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              質問が送信されました！
            </h3>
            <p className="text-muted-foreground mb-8 text-balance">
              ご質問ありがとうございます。<br />
              いただいた内容は運営メンバーが確認し、Discordやイベント等で順次お答えします！
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/oshiete">
                <Button variant="outline" className="border-border/50 hover:bg-secondary/50">
                  教えてページに戻る
                </Button>
              </Link>
              <Button
                onClick={() => setSubmitted(false)}
                className="bg-primary/20 text-primary hover:bg-primary/30 font-bold"
              >
                続けて別の質問を送る
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 sm:p-8 space-y-8 border border-border/50 shadow-xl bg-background/50 backdrop-blur-md mt-8">
            
            {/* 1. 質問内容 (必須) */}
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-semibold text-foreground">
                聞いてみたいことを自由に書いてください <span className="text-destructive">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">短くても大丈夫です。個人が特定される情報は書かないでください。</p>
              <Textarea
                name="entry.527030224" // Googleフォーム側のentry ID
                placeholder="例: ブラックホールに吸い込まれたらどうなるの？"
                required
                rows={6}
                className="bg-secondary/30 border-border/50 focus:bg-background resize-y text-base"
              />
            </div>

            {/* 2. 質問ジャンル (必須) */}
            <div className="space-y-3 animate-in fade-in slide-in-from-top-3">
              <label className="block text-sm font-semibold text-foreground">
                質問ジャンル <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "🛰️ 宇宙開発",
                  "🌌 天文・観測",
                  "💼 宇宙ビジネス",
                  "🎪 エンタメ・その他",
                  "❓ よくわからない／雑談レベル"
                ].map((type) => (
                  <label key={type} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${genre === type ? "border-primary bg-primary/10" : "border-border/50 bg-secondary/30 hover:bg-secondary/50"}`}>
                    <input
                      type="radio"
                      name="entry.1150715333" // ジャンルのentry ID
                      value={type}
                      checked={genre === type}
                      onChange={(e) => setGenre(e.target.value)}
                      required
                      className="mr-3 w-4 h-4 text-primary focus:ring-primary border-border bg-background"
                    />
                    <span className="text-sm font-medium text-foreground">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary/30 border border-border/30">
              <Info className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground">
                このフォームは完全匿名で送信されます。Googleアカウント等の情報は収集されません。
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow h-14 text-lg font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  匿名で質問を送る
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </ContentPageLayout>
  )
}
