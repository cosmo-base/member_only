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

// ★ 新しく発行するGASのURLを貼り付けます
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbw2GY6EKyoAdbegq089wKGARZgSAbP2nqz9H0QHx2wq5CsqPphRMKguj3Rog_QhgG6PWA/exec"

export default function PartnerJoinPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [fileName, setFileName] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const data: Record<string, any> = {}

    formData.forEach((value, key) => {
      if (key !== "logoFile") {
        data[key] = value
      }
    })

    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement
    let uploadedFileUrl = ""

    try {
      // Supabaseへのロゴアップロード
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0]
        // ファイルの拡張子だけを取得（.png など）
        const fileExtension = file.name.split('.').pop();
        // タイムスタンプとランダムな文字列だけでファイル名を作る（日本語を排除）
        const safeFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('logos') // libraryバケツの場合はここを 'library' に
        .upload(`public/${safeFileName}`, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('logos')
          .getPublicUrl(`public/${uniqueFileName}`)
          
        uploadedFileUrl = publicUrl
        data.logoUrl = uploadedFileUrl
      }

      // GASへ送信
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
            <p className="text-muted-foreground">
              理念「宇宙をもっと身近にする」にご共感いただきありがとうございます。必要事項をご入力ください。
            </p>
          </div>

          {isSuccess ? (
            <div className="glass-card rounded-xl p-10 text-center border border-primary/30 bg-primary/5 shadow-lg">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">申請を受け付けました</h2>
              <p className="text-muted-foreground mb-8">
                パートナー申請ありがとうございます。内容を確認の上、担当者よりご連絡いたします。
              </p>
              <Link href="/partner">
                <Button>マイページに戻る</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 md:p-8 space-y-10 shadow-lg">
              
              {/* セクション1：基本情報 */}
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

                <div>
                  <label className="block text-sm font-medium mb-2">パートナー種別 <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["宇宙系企業", "宇宙系学生団体", "非宇宙系企業", "非宇宙系学生団体"].map((type) => (
                      <label key={type} className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-secondary/30 cursor-pointer hover:bg-secondary/50">
                        <input type="radio" name="partnerType" value={type} required className="text-primary focus:ring-primary" />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">担当者名 <span className="text-red-500">*</span></label>
                    <Input name="contactName" required className="bg-secondary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">メールアドレス <span className="text-red-500">*</span></label>
                    <Input type="email" name="email" required className="bg-secondary/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">活動・事業内容 <span className="text-red-500">*</span></label>
                  <textarea name="activity" required className="w-full min-h-[120px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">主な実績 <span className="text-red-500">*</span></label>
                  <textarea name="achievements" required className="w-full min-h-[100px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">ロゴ画像 <span className="text-red-500">*</span></label>
                  <p className="text-[10px] text-muted-foreground mb-3">正方形および横長の透過PNG/Aiデータを推奨します。</p>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 border-border/50 bg-secondary/20 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {fileName ? <FileText className="w-8 h-8 mb-3 text-primary" /> : <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />}
                      <p className="text-sm text-muted-foreground">
                        {fileName ? <span className="font-semibold text-primary">{fileName}</span> : "クリックしてファイルを選択"}
                      </p>
                    </div>
                    <input type="file" name="logoFile" required className="hidden" onChange={(e) => e.target.files && setFileName(e.target.files[0].name)} />
                  </label>
                </div>

                <div className="space-y-4">
                  <div><label className="block text-xs font-medium mb-1">SNSリンク(HP) <span className="text-red-500">*</span></label><Input name="snsHp" required placeholder="https://" className="bg-secondary/50" /></div>
                  <div><label className="block text-xs font-medium mb-1">SNSリンク(X) <span className="text-red-500">*</span></label><Input name="snsX" required placeholder="https://" className="bg-secondary/50" /></div>
                  <div><label className="block text-xs font-medium mb-1">SNSリンク(Instagram)</label><Input name="snsInsta" placeholder="https://" className="bg-secondary/50" /></div>
                  <div><label className="block text-xs font-medium mb-1">SNSリンク(Facebook)</label><Input name="snsFb" placeholder="https://" className="bg-secondary/50" /></div>
                  <div><label className="block text-xs font-medium mb-1">SNSリンク(note)</label><Input name="snsNote" placeholder="https://" className="bg-secondary/50" /></div>
                  <div><label className="block text-xs font-medium mb-1">そのほか①</label><Input name="snsOther1" className="bg-secondary/50" /></div>
                  <div><label className="block text-xs font-medium mb-1">そのほか②</label><Input name="snsOther2" className="bg-secondary/50" /></div>
                </div>
              </div>

              {/* セクション2：確認事項 */}
              <div className="space-y-6 pt-6 border-t border-border/50">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> 確認事項
                </h3>
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" required className="mt-1 w-5 h-5 rounded border-primary/50 text-primary focus:ring-primary bg-background" />
                    <span className="text-sm leading-relaxed group-hover:text-primary transition-colors">
                      「宇宙をもっと身近にする」という理念に共感し、共に宇宙産業の土壌を育てることに同意します。 <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4">
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
