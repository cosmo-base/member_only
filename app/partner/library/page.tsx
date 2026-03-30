// app/partner/library/page.tsx
"use client"

import { useState } from "react"
import { StarBackground } from "@/components/star-background"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle2, Loader2, UploadCloud, FileText } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

// ★ いただいた最新のGASのURLに差し替えました
const GAS_API_URL = "https://script.google.com/macros/s/AKfycby72VihR68Qn9d_4y98g5tP-AdrY0zggdD2sNc86sefGjzmZQkp-NpIc4X_t2X4xqSA/exec"

export default function LibraryUploadPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [fileName, setFileName] = useState<string>("")

  // 「その他」の選択状態を管理
  const [docType, setDocType] = useState("")
  const [category, setCategory] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const data: Record<string, any> = {}

    // テキストデータをまとめる
    formData.forEach((value, key) => {
      if (key !== "fileData") {
        data[key] = value
      }
    })

    // 「その他」が選ばれた場合の処理
    if (data.documentType === "その他") data.documentType = `その他: ${data.documentTypeOther}`
    if (data.category === "その他") data.category = `その他: ${data.categoryOther}`

    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement
    let uploadedFileUrl = ""

    try {
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0]
        const uniqueFileName = `${Date.now()}_${file.name}`

        // 'library' バケツにアップロード
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('library')
          .upload(`public/${uniqueFileName}`, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('library')
          .getPublicUrl(`public/${uniqueFileName}`)
          
        uploadedFileUrl = publicUrl
        data.fileUrl = uploadedFileUrl
      } else {
        throw new Error("ファイルが選択されていません。")
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
      alert("送信に失敗しました。ファイルが選択されているか確認し、再度お試しください。")
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
          <div className="mb-6">
            <Link href="/partner">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground -ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                パートナーマイページに戻る
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Cosmo Base Library 資料格納</h1>
            <p className="text-muted-foreground">
              Cosmo Base Libraryに格納する資料の情報を入力し、ファイルをアップロードしてください。
            </p>
          </div>

          {isSuccess ? (
            <div className="glass-card rounded-xl p-10 text-center border border-primary/30 bg-primary/5 shadow-lg">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">アップロード完了しました</h2>
              <p className="text-muted-foreground mb-8">
                資料の格納を受け付けました。Libraryへの反映まで今しばらくお待ちください。
              </p>
              <Link href="/partner">
                <Button>マイページに戻る</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 md:p-8 space-y-8 shadow-lg">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">企業・団体名 <span className="text-red-500">*</span></label>
                  <Input name="companyName" required className="bg-secondary/50" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">資料のタイトル <span className="text-red-500">*</span></label>
                  <Input name="title" required className="bg-secondary/50" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">紹介文 <span className="text-red-500">*</span></label>
                  <p className="text-[10px] text-muted-foreground mb-2">100文字以下程度で資料の紹介文をお書きください。</p>
                  <textarea name="description" required maxLength={150} className="w-full min-h-[80px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                {/* 資料の種類 */}
                <div>
                  <label className="block text-sm font-medium mb-2">資料の種類 <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    {["イベント資料", "活動報告", "チラシ", "その他"].map((type) => (
                      <label key={type} className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-secondary/30 cursor-pointer hover:bg-secondary/50">
                        <input type="radio" name="documentType" value={type} required onChange={(e) => setDocType(e.target.value)} className="text-primary focus:ring-primary" />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                  {docType === "その他" && (
                    <Input name="documentTypeOther" required placeholder="その他の種類を入力" className="bg-secondary/50 mt-2" />
                  )}
                </div>

                {/* ★ 対象レベルを変更 */}
                <div>
                  <label className="block text-sm font-medium mb-2">対象レベル <span className="text-red-500">*</span></label>
                  <div className="bg-secondary/20 p-3 rounded-lg border border-border/50 mb-3 text-xs text-muted-foreground space-y-1">
                    <p><strong>初心者向け：</strong>宇宙にこれまで関わってきていなかった層</p>
                    <p><strong>中級者向け：</strong>宇宙は好きだけどあまりイベント等には行ったことが無かった層</p>
                    <p><strong>上級者向け：</strong>宇宙が好きで仕事や研究などで関わっている層</p>
                    <p><strong>中級者以上向け：</strong>中級者から上級者まで幅広く対象とする場合</p>
                    <p><strong>全レベル：</strong>誰でも参加・理解できる内容</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {["初心者向け", "中級者向け", "上級者向け", "中級者以上向け", "全レベル"].map((level) => (
                      <label key={level} className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-secondary/30 cursor-pointer hover:bg-secondary/50">
                        <input type="radio" name="targetLevel" value={level} required className="text-primary focus:ring-primary" />
                        <span className="text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* カテゴリー */}
                <div>
                  <label className="block text-sm font-medium mb-2">カテゴリー <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    {["宇宙開発", "天文・観測", "宇宙ビジネス", "エンタメ", "ニュース", "その他"].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-secondary/30 cursor-pointer hover:bg-secondary/50">
                        <input type="radio" name="category" value={cat} required onChange={(e) => setCategory(e.target.value)} className="text-primary focus:ring-primary" />
                        <span className="text-sm">{cat}</span>
                      </label>
                    ))}
                  </div>
                  {category === "その他" && (
                    <Input name="categoryOther" required placeholder="その他のカテゴリーを入力" className="bg-secondary/50 mt-2" />
                  )}
                </div>

                {/* ファイルアップロード */}
                <div className="pt-4 border-t border-border/50">
                  <label className="block text-sm font-medium mb-2">格納する資料をアップロードしてください <span className="text-red-500">*</span></label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 border-border/50 bg-secondary/20 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {fileName ? <FileText className="w-8 h-8 mb-3 text-primary" /> : <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />}
                        <p className="mb-2 text-sm text-muted-foreground">
                          {fileName ? (
                            <span className="font-semibold text-primary">{fileName}</span>
                          ) : (
                            <span className="font-semibold text-primary">クリックしてファイルを選択</span>
                          )}
                        </p>
                      </div>
                      <input 
                        type="file" 
                        name="fileData" 
                        required
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFileName(e.target.files[0].name)
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

              </div>

              {/* 送信ボタン */}
              <div className="pt-6 border-t border-border/50">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full h-14 text-lg font-bold shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      アップロード中...
                    </>
                  ) : (
                    "資料を格納する"
                  )}
                </Button>
              </div>

            </form>
          )}
        </main>
      </div>
    </div>
  )
}