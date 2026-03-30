"use client"

import { useState } from "react"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Loader2 } from "lucide-react"

export default function ShittokuRequestPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // フォームのデータを取得
    const formData = new FormData(e.currentTarget)

    try {
      // Googleフォームのaction URLへPOST送信
      await fetch(
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSef7zRGC8CbFccMO5pctpvEZw5QAkYlqv-EUxU9IJe4R2aQLg/formResponse",
        {
          method: "POST",
          mode: "no-cors", // CORSエラーを回避するために必須
          body: formData,
        }
      )
      // 送信成功（no-corsのためステータスコードは不透明ですが、通常は成功します）
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
      title="要望フォーム"
      level={2}
      levelTitle="自分を知る"
      logo="CBshittoku"
    >
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              あなたの声でイベントを作ります
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              「こんなテーマを扱ってほしい」「この分野をもっと深く知りたい」など、
              皆さんのリクエストをお待ちしています。頂いたご要望は、
              今後のイベント企画の参考にさせていただきます。
            </p>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="glass-card rounded-xl p-8 text-center animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 rounded-full bg-accent/20 w-fit mx-auto mb-4">
            <Send className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            ご要望を受け付けました
          </h3>
          <p className="text-muted-foreground">
            貴重なご意見をありがとうございます。
            今後のイベント企画の参考にさせていただきます。
          </p>
          {/* 必要に応じて「続けてリクエストする」ボタンなどを追加 */}
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => setSubmitted(false)}
          >
            別のリクエストを送る
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              テーマ 
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              例：ホリエモンのロケットは凄いの？、NASAはどんな計画をやってるの？
            </p>
            {/* Googleフォームの「テーマ」のIDを指定 */}
            <Textarea
              name="entry.1250221228"
              placeholder="どんな内容を聞きたいか教えてください"
              rows={4}
              className="bg-secondary/50 border-border/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              登壇者（任意）
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              こちらは参考にさせていただきますが、ご希望の登壇者を必ずお呼びできるお約束はできかねます。あらかじめご了承ください。
            </p>
            {/* Googleフォームの「登壇者」のIDを指定 */}
            <Input
              name="entry.2020876000"
              placeholder="希望する登壇者がいればご記入ください"
              className="bg-secondary/50 border-border/50"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            // 先ほど調整したボタンのカラーを使用
            className="w-full bg-primary/70 hover:bg-primary/60 text-primary-foreground transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                送信中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                リクエストを送信
              </>
            )}
          </Button>
        </form>
      )}
    </ContentPageLayout>
  )
}