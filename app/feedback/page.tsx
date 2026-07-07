"use client"

import { useState } from "react"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { RequiredBadge } from "@/components/ui/required-badge"
import { CheckCircle2, MessageSquareHeart, Loader2, Send, RotateCcw } from "lucide-react"

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLSe1-ONYP3iTwZTMCtk-kF1fPK72gFj5-OgVKRCHrXxq0HPO7g/formResponse"

const CATEGORY_OPTIONS = [
  "💡 アイデア・要望（イベント希望など）",
  "💬 コミュニティの雰囲気について",
  "🆘 困りごと・相談",
  "📝 その他",
]

const SHARE_OPTIONS: { label: string; value: string; sub: string }[] = [
  {
    label: "共有してもOK",
    value: "はい",
    sub: "個人が特定されない形で紹介する場合があります",
  },
  {
    label: "運営のみに留めてほしい",
    value: "いいえ",
    sub: "非公開",
  },
]

const INITIAL_FORM_DATA = { category: "", categoryOther: "", content: "", share: "", name: "" }
const CONTENT_MAX_LENGTH = 2000

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const categoryValue =
      formData.category === "📝 その他" && formData.categoryOther.trim()
        ? `📝 その他：${formData.categoryOther.trim()}`
        : formData.category

    const submitData = new FormData()
    submitData.append("entry.7963631", categoryValue)
    submitData.append("entry.262316761", formData.content)
    submitData.append("entry.287386767", formData.share)
    if (formData.name.trim()) {
      submitData.append("entry.522516717", formData.name.trim())
    }

    try {
      // no-cors のため opaque response が返り、成功・失敗を判定できない。
      // ネットワーク障害以外のエラー（フォーム無効など）は検知不可の fire-and-forget 送信。
      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        body: submitData,
      })
      setIsSuccess(true)
    } catch (error) {
      // ネットワーク障害時のみここに到達する
      console.error("送信エラー:", error)
      alert("送信に失敗しました。通信環境をご確認の上、再度お試しください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setIsSuccess(false)
    setFormData(INITIAL_FORM_DATA)
  }

  return (
    <ContentPageLayout title="意見箱" level={0} levelTitle="" logo="">
      {isSuccess ? (
        <div className="glass-card rounded-xl p-10 max-w-2xl mx-auto border border-primary/30 text-center animate-in fade-in zoom-in duration-500">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">
            ご意見ありがとうございました！
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            送信しました。<br />
            いただいたご意見は運営メンバーが確認し、コミュニティの改善に活かしていきます。<br />
            <span className="text-xs mt-2 block">届かない場合は運営に直接ご連絡ください。</span>
          </p>
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            もう一件送る
          </Button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">

          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <MessageSquareHeart className="w-10 h-10 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm md:text-base text-balance">
              Cosmo Baseをより良くするためのご意見・ご要望をお聞かせください。<br />
              無記名でもご投稿いただけます。
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-xl p-6 md:p-10 border border-border/50 shadow-sm space-y-10"
          >
            {/* Q1: カテゴリ */}
            <div>
              <label className="flex items-center text-base font-bold text-foreground mb-3">
                1. どのような内容ですか？
                <RequiredBadge />
              </label>
              <div className="grid grid-cols-1 gap-3">
                {CATEGORY_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.category === option
                        ? "border-primary bg-primary/10"
                        : "border-border/50 bg-secondary/20 hover:bg-secondary/50"
                    }`}
                  >
                    <input
                      required
                      type="radio"
                      name="category"
                      value={option}
                      checked={formData.category === option}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, category: e.target.value }))
                      }
                      className="w-4 h-4 text-primary bg-background border-border focus:ring-primary/50 shrink-0"
                    />
                    <span className="text-sm text-foreground font-medium">{option}</span>
                  </label>
                ))}
              </div>
              {formData.category === "📝 その他" && (
                <div className="mt-3">
                  <input
                    type="text"
                    required
                    value={formData.categoryOther}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, categoryOther: e.target.value }))
                    }
                    placeholder="内容を入力してください"
                    className="w-full p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              )}
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* Q2: 内容 */}
            <div>
              <label
                htmlFor="content"
                className="flex items-center text-base font-bold text-foreground mb-3"
              >
                2. ご意見・ご要望の内容
                <RequiredBadge />
              </label>
              <textarea
                id="content"
                name="content"
                required
                maxLength={CONTENT_MAX_LENGTH}
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="自由にご記入ください"
                rows={5}
                className="w-full p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {formData.content.length} / {CONTENT_MAX_LENGTH}
              </p>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* Q3: 共有可否 */}
            <div>
              <label className="flex items-center text-base font-bold text-foreground mb-3">
                3. このご意見をコミュニティ内で共有・紹介してもよろしいですか？
                <RequiredBadge />
              </label>
              <div className="grid grid-cols-1 gap-3">
                {SHARE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.share === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border/50 bg-secondary/20 hover:bg-secondary/50"
                    }`}
                  >
                    <input
                      required
                      type="radio"
                      name="share"
                      value={option.value}
                      checked={formData.share === option.value}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, share: e.target.value }))
                      }
                      className="w-4 h-4 text-primary bg-background border-border focus:ring-primary/50 shrink-0"
                    />
                    <span className="text-sm text-foreground">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-muted-foreground ml-1">（{option.sub}）</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-border/50" />

            {/* Q4: お名前（任意） */}
            <div>
              <label
                htmlFor="name"
                className="block text-base font-bold text-foreground mb-1"
              >
                4. お名前またはユーザー名
                <span className="ml-2 text-xs font-normal text-muted-foreground">任意</span>
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                運営からの直接のサポートをご希望の場合のみご記入ください。無記名でも問題ありません。
              </p>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="任意記入"
                className="w-full p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* 送信ボタン */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    送信中...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 mr-2" />
                    意見を送信する
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </ContentPageLayout>
  )
}
