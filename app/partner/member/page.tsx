// app/partner/join/page.tsx (※お好みのパスに配置してください)
"use client"

import { useState } from "react"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Users, Loader2, Send } from "lucide-react"

export default function PartnerJoinFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // フォームの入力状態を管理
  const [formData, setFormData] = useState({
    groupName: "",
    discord: "",
  })

  // 入力変更ハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 送信処理（Googleフォームへ裏側でPOSTする）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 新しいGoogleフォームのaction URL
    const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSd4vMtItQzOYHDkIdYlqIFhOEnEzKUQQsK8D1mD8p_uBVp8Gw/formResponse"

    // 抽出した entry.ID にデータを紐付け
    const submitData = new FormData()
    submitData.append("entry.1112089264", formData.groupName) // 団体名
    submitData.append("entry.87242204", formData.discord)     // Discordの名前

    try {
      // CORSエラーを回避するために mode: 'no-cors' を指定
      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        body: submitData,
      })
      // no-cors の場合、正確なレスポンスは取れないので、エラーでなければ成功とみなす
      setIsSuccess(true)
    } catch (error) {
      console.error("送信エラー:", error)
      alert("送信に失敗しました。通信環境をご確認の上、再度お試しください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 送信成功時の画面
  if (isSuccess) {
    return (
      <ContentPageLayout title="メンバー申請" level={0} levelTitle="" logo="">
        <div className="glass-card rounded-xl p-10 max-w-2xl mx-auto border border-primary/30 text-center animate-in fade-in zoom-in duration-500">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">申請を受け付けました</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            ご入力ありがとうございます。内容を確認の上、<br />
            記載いただいたDiscordアカウントへパートナー限定チャンネルへの招待をお送りいたします。
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" className="w-full sm:w-auto">
            別の申請を送信する
          </Button>
        </div>
      </ContentPageLayout>
    )
  }

  // 入力フォーム画面
  return (
    <ContentPageLayout title="メンバー申請" level={0} levelTitle="" logo="">
      <div className="max-w-2xl mx-auto">
        
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm md:text-base text-balance">
            Discordでパートナー限定チャンネルに招待いたします。<br/>
            以下のフォームより申請をお願いします。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 md:p-10 border border-border/50 shadow-sm space-y-8">
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                団体名 <span className="text-red-500 ml-1">*</span>
              </label>
              <Input 
                required 
                type="text" 
                name="groupName" 
                value={formData.groupName} 
                onChange={handleChange} 
                placeholder="宇宙研究会" 
                className="bg-secondary/50 h-12" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Discordの名前 <span className="text-red-500 ml-1">*</span>
              </label>
              <Input 
                required 
                type="text" 
                name="discord" 
                value={formData.discord} 
                onChange={handleChange} 
                placeholder="CosmoPartner#5678" 
                className="bg-secondary/50 h-12" 
              />
            </div>
          </div>

          <div className="pt-6">
            <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  申請を送信する
                </>
              )}
            </Button>
          </div>
          
        </form>
      </div>
    </ContentPageLayout>
  )
}
