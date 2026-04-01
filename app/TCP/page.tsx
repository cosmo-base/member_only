// app/TCP/page.tsx (※お好みのパスで作成してください)
"use client"

import { useState } from "react"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Rocket, Loader2, Send } from "lucide-react"

export default function Project1000FormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // フォームの入力状態を管理
  const [formData, setFormData] = useState({
    name: "",
    kana: "",
    email: "",
    discord: "",
    region: "",
    age: "",
    involvement: ""
  })

  // 入力変更ハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 送信処理（Googleフォームへ裏側でPOSTする）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Googleフォームのaction URL
    const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/u/0/d/e/1FAIpQLScL35E58VV_GzKsYwTFqwCRLSwjgjRZnbNopIckmDStjXOtpw/formResponse"

    // 抽出した entry.ID にデータを紐付け
    const submitData = new FormData()
    submitData.append("entry.1945872439", formData.name)
    submitData.append("entry.281428900", formData.kana)
    submitData.append("entry.1445140678", formData.email)
    submitData.append("entry.162862560", formData.discord)
    submitData.append("entry.379605324", formData.region)
    submitData.append("entry.688177955", formData.age)
    submitData.append("entry.201530021", formData.involvement)

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

  if (isSuccess) {
    return (
      <ContentPageLayout title="1000人乗船プロジェクト" level={1} levelTitle="参加" logo="CBED">
        <div className="glass-card rounded-xl p-10 max-w-2xl mx-auto border border-primary/30 text-center animate-in fade-in zoom-in duration-500">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">乗船手続きが完了しました！</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            ご入力ありがとうございます。限定案内やDiscordへのご招待をお送りいたします。<br />
            Cosmo Baseの宇宙の旅へようこそ！
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" className="w-full sm:w-auto">
            続けて回答する
          </Button>
        </div>
      </ContentPageLayout>
    )
  }

  return (
    <ContentPageLayout title="1000人乗船プロジェクト" level={1} levelTitle="参加" logo="CBED">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
            <Rocket className="w-10 h-10 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm md:text-base text-balance">
            必要事項をご記入の上、送信してください。<br/>
            いただいた情報は、認定書への掲載や限定イベント・チャンネルのご案内に活用いたします。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 md:p-10 border border-border/50 shadow-sm space-y-8">
          
          {/* 基本情報セクション */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                お名前 <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">認定書への掲載や今後の限定有料イベントでの割引確認に活用いたします。</p>
              <Input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="宇宙 太郎" className="bg-secondary/50" />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                フリガナ <span className="text-red-500 ml-1">*</span>
              </label>
              <Input required type="text" name="kana" value={formData.kana} onChange={handleChange} placeholder="ウチュウ タロウ" className="bg-secondary/50" />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                メールアドレス <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">限定案内などをお送りさせていただきます。</p>
              <Input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@cosmobase.com" className="bg-secondary/50" />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Discordのお名前 <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">限定チャンネル招待のために活用いたします。</p>
              <Input required type="text" name="discord" value={formData.discord} onChange={handleChange} placeholder="CosmoUser#1234" className="bg-secondary/50" />
            </div>
          </div>

          <div className="w-full h-px bg-border/50 my-8"></div>

          {/* アンケートセクション */}
          <div className="space-y-8">
            <h3 className="text-lg font-bold text-primary">アンケート</h3>
            <p className="text-sm text-muted-foreground -mt-4">以降はCosmo Baseのイベント開催などで活用いたします。</p>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                主な活動地域 <span className="text-red-500 ml-1">*</span>
              </label>
              <Input required type="text" name="region" value={formData.region} onChange={handleChange} placeholder="東京都、オンライン中心 など" className="bg-secondary/50" />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-3">
                年齢 <span className="text-red-500 ml-1">*</span>
              </label>
              <select 
                required 
                name="age" 
                value={formData.age} 
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="" disabled>選択してください</option>
                <option value="10代">10代</option>
                <option value="10代(社会人)">10代(社会人)</option>
                <option value="10代(大学生)">10代(大学生)</option>
                <option value="20代(大学生)">20代(大学生)</option>
                <option value="20代">20代</option>
                <option value="30代">30代</option>
                <option value="40代">40代</option>
                <option value="50代">50代</option>
                <option value="60代">60代</option>
                <option value="70代">70代</option>
                <option value="それ以降">それ以降</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-3">
                宇宙との関わり度合 <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="space-y-3">
                {[
                  "宇宙に関する研究や活動を行っている。",
                  "宇宙に関する研究や仕事はしていないが、イベントなどには行く。",
                  "宇宙は好きだけど、イベントなどには行っていない。",
                  "宇宙に興味が無かったが宇宙について知りたい"
                ].map((option) => (
                  <label key={option} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/50 cursor-pointer transition-colors">
                    <input
                      required
                      type="radio"
                      name="involvement"
                      value={option}
                      checked={formData.involvement === option}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-primary bg-background border-border focus:ring-primary/50"
                    />
                    <span className="text-sm text-foreground leading-snug">{option}</span>
                  </label>
                ))}
              </div>
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
                  プロジェクトに参加する
                </>
              )}
            </Button>
          </div>
          
        </form>
      </div>
    </ContentPageLayout>
  )
}
