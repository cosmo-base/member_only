// app/shittoku/survey/page.tsx
"use client"

import { useState } from "react"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ClipboardList, Loader2, Send } from "lucide-react"

export default function ShittokuSurveyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // フォームの入力状態を管理
  const [formData, setFormData] = useState({
    // ★ 初期値としてチェックを入れた状態にしておきます
    eventName: "Cosmo Baseで宇宙知っトク#002(4/8)", 
    satisfaction: "",
    satisfactionReason: "",
    purposes: [] as string[],
    purposeReason: "",
    operation: "",
    operationReason: "",
    futureThemes: [] as string[],
    futureThemeDetail: ""
  })

  // テキスト・ラジオボタン・セレクトの変更ハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // チェックボックス（複数選択）の変更ハンドラー
  const handleCheckboxChange = (field: "purposes" | "futureThemes", value: string) => {
    setFormData(prev => {
      const currentList = prev[field]
      if (currentList.includes(value)) {
        return { ...prev, [field]: currentList.filter(item => item !== value) }
      } else {
        return { ...prev, [field]: [...currentList, value] }
      }
    })
  }

  // 送信処理（Googleフォームへ裏側でPOSTする）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 宇宙知っトクアンケート用のGoogleフォームaction URL
    const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSftfcnBxZVaMgmitAxRAWFTlYkFcT6AaRubrhNuGAUAuS_2ZA/formResponse"

    const submitData = new FormData()
    
    // 抽出した entry.ID にデータを紐付け
    submitData.append("entry.263692542", formData.eventName)
    submitData.append("entry.1237209169", formData.satisfaction)
    submitData.append("entry.2086647135", formData.satisfactionReason)
    submitData.append("entry.1218135070", formData.purposeReason) // 2つ目の「上記の理由」
    submitData.append("entry.438738199", formData.operation)
    submitData.append("entry.1425566875", formData.operationReason) // 3つ目の「上記の理由」
    submitData.append("entry.1211293726", formData.futureThemeDetail)

    // 複数選択（チェックボックス）は、同じキーで複数回 append する
    formData.purposes.forEach(purpose => {
      submitData.append("entry.912796663", purpose)
    })
    formData.futureThemes.forEach(theme => {
      submitData.append("entry.1960934867", theme)
    })

    try {
      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        body: submitData,
      })
      setIsSuccess(true)
    } catch (error) {
      console.error("送信エラー:", error)
      alert("送信に失敗しました。通信環境をご確認の上、再度お試しください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 必須マーク用の共通コンポーネント
  const RequiredBadge = () => (
    <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-500 border border-red-500/30">
      必須
    </span>
  )

  // 成功画面
  if (isSuccess) {
    return (
      <ContentPageLayout title="参加後アンケート" level={0} levelTitle="" logo="CBshittoku">
        <div className="glass-card rounded-xl p-10 max-w-2xl mx-auto border border-primary/30 text-center animate-in fade-in zoom-in duration-500">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">ご協力ありがとうございました！</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            アンケートの送信が完了しました。<br />
            いただいた貴重なご意見は、今後のイベント運営やコンテンツ作りに活用させていただきます。
          </p>
        </div>
      </ContentPageLayout>
    )
  }

  return (
    <ContentPageLayout title="参加後アンケート" level={0} levelTitle="" logo="CBshittoku">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
            <ClipboardList className="w-10 h-10 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm md:text-base text-balance">
            本日はイベントにご参加いただき、誠にありがとうございました。<br/>
            今後のより良いイベント運営のため、アンケートへのご協力をお願いいたします。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 md:p-10 border border-border/50 shadow-sm space-y-10">
          
          {/* イベント名称（ラジオボタンに変更！） */}
          <div>
            <label className="flex items-center text-sm font-bold text-foreground mb-3">
              イベント名称 <RequiredBadge />
            </label>
            <div className="flex flex-col gap-3">
              {[
                "Cosmo Baseで宇宙知っトク#002(4/8)"
                // 今後イベントが増えたらここに追加できます
              ].map((option) => (
                <label key={option} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/50 cursor-pointer transition-colors w-fit pr-6">
                  <input
                    required
                    type="radio"
                    name="eventName"
                    value={option}
                    checked={formData.eventName === option}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary bg-background border-border focus:ring-primary/50"
                  />
                  <span className="text-sm text-foreground font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-border/50 my-8"></div>

          {/* 1. 満足度 */}
          <div className="space-y-4">
            <label className="flex items-center text-base font-bold text-foreground mb-3">
              1. 今回のイベントの満足度を教えてください。 <RequiredBadge />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "5：非常に満足",
                "4：満足",
                "3：普通",
                "2：やや不満",
                "1：不満"
              ].map((option) => (
                <label key={option} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/50 cursor-pointer transition-colors">
                  <input
                    required
                    type="radio"
                    name="satisfaction"
                    value={option}
                    checked={formData.satisfaction === option}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary bg-background border-border focus:ring-primary/50"
                  />
                  <span className="text-sm text-foreground">{option}</span>
                </label>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-sm font-semibold text-foreground mb-2">上記の理由</label>
              <textarea 
                name="satisfactionReason" 
                value={formData.satisfactionReason} 
                onChange={handleChange} 
                placeholder="満足度の理由を自由にご記入ください" 
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
              />
            </div>
          </div>

          <div className="w-full h-px bg-border/50 my-8"></div>

          {/* 2. 参加の目的 */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-base font-bold text-foreground mb-1">
                2. 参加の目的（複数回答可）
              </label>
              <p className="text-xs text-muted-foreground mb-3">今回のイベントに参加した主な理由は何ですか？</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "宇宙ビジネス・業界への興味",
                "他分野の方とのネットワーキング",
                "登壇者や特定の参加者に会いたかった",
                "テーマが面白そうだった",
                "ニュースを知りたかった",
                "なんとなく面白そうだった"
              ].map((option) => (
                <label key={option} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.purposes.includes(option)}
                    onChange={() => handleCheckboxChange("purposes", option)}
                    className="mt-0.5 w-4 h-4 text-primary rounded bg-background border-border focus:ring-primary/50"
                  />
                  <span className="text-sm text-foreground leading-snug">{option}</span>
                </label>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-sm font-semibold text-foreground mb-2">上記の理由（その他など）</label>
              <textarea 
                name="purposeReason" 
                value={formData.purposeReason} 
                onChange={handleChange} 
                placeholder="その他の目的や、具体的な理由があればご記入ください" 
                className="w-full min-h-[80px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
              />
            </div>
          </div>

          <div className="w-full h-px bg-border/50 my-8"></div>

          {/* 4. 運営・進行について */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-base font-bold text-foreground mb-1">
                3. 運営・進行について <RequiredBadge />
              </label>
              <p className="text-xs text-muted-foreground mb-3">受付や進行の導線はいかがでしたか？</p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                "スムーズだった",
                "概ね問題なかった",
                "改善の余地がある"
              ].map((option) => (
                <label key={option} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/50 cursor-pointer transition-colors w-fit pr-6">
                  <input
                    required
                    type="radio"
                    name="operation"
                    value={option}
                    checked={formData.operation === option}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary bg-background border-border focus:ring-primary/50"
                  />
                  <span className="text-sm text-foreground">{option}</span>
                </label>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-sm font-semibold text-foreground mb-2">上記の理由</label>
              <textarea 
                name="operationReason" 
                value={formData.operationReason} 
                onChange={handleChange} 
                placeholder="良かった点や、改善が必要だと感じた点をご記入ください" 
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
              />
            </div>
          </div>

          <div className="w-full h-px bg-border/50 my-8"></div>

          {/* 5. 今後のテーマについて */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-base font-bold text-foreground mb-1">
                4. 今後のテーマについて
              </label>
              <p className="text-xs text-muted-foreground mb-3">今後、どのようなイベントがあれば参加したいですか？（複数回答可）</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "特定の技術（エンジニアリング系）に特化した勉強会",
                "宇宙ビジネスの市場動向に関するセミナー",
                "今回のような自由な交流メインの会",
                "ワークショップ型（一緒に何かを作る・考える）",
                "特定のテーマの講演会"
              ].map((option) => (
                <label key={option} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.futureThemes.includes(option)}
                    onChange={() => handleCheckboxChange("futureThemes", option)}
                    className="mt-0.5 w-4 h-4 text-primary rounded bg-background border-border focus:ring-primary/50"
                  />
                  <span className="text-sm text-foreground leading-snug">{option}</span>
                </label>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-sm font-semibold text-foreground mb-2">具体的なテーマ希望があれば教えてください</label>
              <textarea 
                name="futureThemeDetail" 
                value={formData.futureThemeDetail} 
                onChange={handleChange} 
                placeholder="例: ロケットの推進剤について、宇宙法について など" 
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
              />
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="pt-8">
            <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6 mr-2" />
                  アンケートを送信する
                </>
              )}
            </Button>
          </div>
          
        </form>
      </div>
    </ContentPageLayout>
  )
}
