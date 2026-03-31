// app/partner/join/page.tsx
"use client"

import { useState } from "react"
import { StarBackground } from "@/components/star-background"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle2, Loader2, UploadCloud, FileText, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbw2GY6EKyoAdbegq089wKGARZgSAbP2nqz9H0QHx2wq5CsqPphRMKguj3Rog_QhgG6PWA/exec"

export default function PartnerJoinPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [fileName, setFileName] = useState<string>("")
  const [partnerType, setPartnerType] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const data: Record<string, any> = {}

    // ロゴファイル以外のデータをまとめる
    formData.forEach((value, key) => {
      if (key !== "logoFile") {
        data[key] = value
      }
    })

    // パートナー種別が「その他」の場合の処理
    if (data.partnerType === "その他") {
      data.partnerType = `その他: ${data.partnerTypeOther}`
    }

    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement
    let uploadedFileUrl = ""

    try {
      // 1. Supabaseへのロゴアップロード
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0]
        
        // ★日本語ファイル名エラー対策（安全なファイル名を生成）
        const fileExtension = file.name.split('.').pop()
        const safeFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('logos') // logosバケツを使用
          .upload(`public/${safeFileName}`, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('logos')
          .getPublicUrl(`public/${safeFileName}`)
          
        uploadedFileUrl = publicUrl
        data.logoUrl = uploadedFileUrl
      } else {
        throw new Error("ロゴ画像が選択されていません。")
      }

      // 2. GAS（スプレッドシート）へ全データを送信
      await fetch(GAS_API_URL, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "text/plain" },
      })
      
      setIsSuccess(true)
    } catch (error) {
      console.error("送信エラー:", error)
      alert("送信に失敗しました。時間をおいて再度お試しください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <StarBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Cosmo Base パートナー申請</h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Cosmo Baseの理念「宇宙をもっと身近にする」にご共感いただき、ありがとうございます。<br/>
              必要事項をご入力ください。
            </p>
          </div>

          {isSuccess ? (
            <div className="glass-card rounded-xl p-10 text-center border border-primary/30 bg-primary/5 shadow-lg">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">申請を受け付けました</h2>
              <p className="text-muted-foreground mb-8">
                パートナー申請ありがとうございます。内容を確認の上、担当者よりご連絡いたします。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 md:p-8 space-y-10 shadow-lg">
              
              {/* ━━━━ セクション1：基本情報 ━━━━ */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold border-b border-border/50 pb-2 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full" /> 基本情報
                </h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">企業・団体名 <span className="text-red-500">*</span></label>
                  <Input name="companyName" required className="bg-secondary/50" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">ふりがな <span className="text-red-500">*</span></label>
                  <Input name="furigana" required className="bg-secondary/50" />
                </div>

                {/* パートナー種別 */}
                <div>
                  <label className="block text-sm font-medium mb-2">パートナー種別 <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    {["宇宙系企業", "宇宙系学生団体", "非宇宙系企業", "非宇宙系学生団体"].map((type) => (
                      <label key={type} className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-secondary/30 cursor-pointer hover:bg-secondary/50">
                        <input type="radio" name="partnerType" value={type} required onChange={(e) => setPartnerType(e.target.value)} className="text-primary focus:ring-primary" />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                  {partnerType === "その他" && (
                    <Input name="partnerTypeOther" required placeholder="その他の種別を入力" className="bg-secondary/50 mt-2" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">担当者名 <span className="text-red-500">*</span></label>
                  <Input name="contactName" required className="bg-secondary/50" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">メールアドレス <span className="text-red-500">*</span></label>
                    <Input type="email" name="email" required className="bg-secondary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">確認用メールアドレス <span className="text-red-500">*</span></label>
                    <Input type="email" name="emailConfirm" required className="bg-secondary/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">活動・事業内容 <span className="text-red-500">*</span></label>
                  <textarea name="activity" required className="w-full min-h-[100px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">主な実績 <span className="text-red-500">*</span></label>
                  <textarea name="achievements" required className="w-full min-h-[100px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                {/* 追加項目：団体紹介の文章 */}
                <div>
                  <label className="block text-sm font-medium mb-1">団体紹介の文章（50文字以下） <span className="text-red-500">*</span></label>
                  <p className="text-[10px] text-muted-foreground mb-2">用途：SNSでの紹介やロゴ掲載時のキャプション等に使用します。</p>
                  <textarea name="intro50" maxLength={50} required className="w-full min-h-[60px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">団体紹介の文章（250文字以下） <span className="text-red-500">*</span></label>
                  <p className="text-[10px] text-muted-foreground mb-2">用途：Cosmo Base内チャンネルや公式HP、資料等での紹介に使用します。</p>
                  <textarea name="intro250" maxLength={250} required className="w-full min-h-[100px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                {/* ロゴ画像 */}
                <div className="pt-2">
                  <label className="block text-sm font-medium mb-2">ロゴ画像 <span className="text-red-500">*</span></label>
                  <p className="text-[10px] text-muted-foreground mb-3">正方形および横長の透過PNG/Aiデータを推奨します。利用条件等がある場合は別途メールにてお送りください。</p>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 border-border/50 bg-secondary/20 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {fileName ? <FileText className="w-8 h-8 mb-3 text-primary" /> : <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />}
                      <p className="text-sm text-muted-foreground text-center px-4">
                        {fileName ? <span className="font-semibold text-primary">{fileName}</span> : "クリックしてファイルを選択 (最大10MBまで)"}
                      </p>
                    </div>
                    <input type="file" name="logoFile" accept="image/*,.ai" required className="hidden" onChange={(e) => e.target.files && setFileName(e.target.files[0].name)} />
                  </label>
                </div>

                {/* SNSリンク群 */}
                <div className="pt-2">
                  <h4 className="text-sm font-bold mb-4">SNSリンク <span className="text-[10px] font-normal text-muted-foreground ml-2">※他にリンクがある場合は「そのほか」に入力してください。</span></h4>
                  <div className="space-y-3">
                    <div><label className="block text-xs font-medium mb-1">HP</label><Input name="snsHp" placeholder="https://" className="bg-secondary/50" /></div>
                    <div><label className="block text-xs font-medium mb-1">X (Twitter)</label><Input name="snsX" placeholder="https://" className="bg-secondary/50" /></div>
                    <div><label className="block text-xs font-medium mb-1">Instagram</label><Input name="snsInsta" placeholder="https://" className="bg-secondary/50" /></div>
                    <div><label className="block text-xs font-medium mb-1">Facebook</label><Input name="snsFb" placeholder="https://" className="bg-secondary/50" /></div>
                    <div><label className="block text-xs font-medium mb-1">note</label><Input name="snsNote" placeholder="https://" className="bg-secondary/50" /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div><label className="block text-xs font-medium mb-1">そのほか①</label><Input name="snsOther1" placeholder="https://" className="bg-secondary/50" /></div>
                      <div><label className="block text-xs font-medium mb-1">そのほか②</label><Input name="snsOther2" placeholder="https://" className="bg-secondary/50" /></div>
                      <div><label className="block text-xs font-medium mb-1">そのほか③</label><Input name="snsOther3" placeholder="https://" className="bg-secondary/50" /></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ━━━━ セクション2：確認事項 ━━━━ */}
              <div className="space-y-6 pt-6 border-t border-border/50">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> 確認事項
                </h3>
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" name="agreement" required className="mt-1 w-5 h-5 rounded border-primary/50 text-primary focus:ring-primary bg-background shrink-0" />
                    <span className="text-sm leading-relaxed group-hover:text-primary transition-colors">
                      「宇宙をもっと身近にする」という理念に共感し、共に宇宙産業の土壌を育てることに同意します。 <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-bold shadow-md">
                  {isSubmitting ? <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> 送信中...</> : "パートナー申請を送信する"}
                </Button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  )
}
