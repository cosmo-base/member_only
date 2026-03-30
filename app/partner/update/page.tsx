// app/partner/update/page.tsx
"use client"

import { useState } from "react"
import { StarBackground } from "@/components/star-background"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle2, Loader2, UploadCloud, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

// ★ 発行していただいたGASのURL
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbxuct1PbLjnQmUg9VMjsU6V2BkTmHRDC-mRmOO4CM5v-9d1qYnKdM6peWG6WV9529bb/exec"

export default function PartnerUpdateFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [fileName, setFileName] = useState<string>("")

  // どの項目を開くかを管理するState
  const [edits, setEdits] = useState({
    furigana: false,
    partnerType: false,
    activity: false,
    achievements: false,
    intros: false,
    logo: false,
    sns: false,
  })

  const toggleEdit = (key: keyof typeof edits) => {
    setEdits((prev) => ({ ...prev, [key]: !prev[key] }))
  }

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
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0]
        
        // ① 新しく作った安全なファイル名
        const fileExtension = file.name.split('.').pop();
        const safeFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('logos')
          .upload(`public/${safeFileName}`, file)  // ← ② ここは safeFileName になっているはず

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('logos')
          // ↓ ③ ★ここが uniqueFileName のまま残っているので、safeFileName に変えます！★
          .getPublicUrl(`public/${safeFileName}`) 
          
        uploadedFileUrl = publicUrl
        data.logoUrl = uploadedFileUrl
      }

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

  const EditSection = ({ id, title, checked, children }: { id: keyof typeof edits, title: string, checked: boolean, children: React.ReactNode }) => (
    <div className={`border rounded-lg transition-all duration-200 overflow-hidden ${checked ? "border-primary/50 bg-secondary/10" : "border-border/50 bg-secondary/20 hover:bg-secondary/30"}`}>
      <label className="flex items-center justify-between p-4 cursor-pointer select-none">
        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            checked={checked} 
            onChange={() => toggleEdit(id)} 
            className="w-5 h-5 rounded border-primary/50 text-primary focus:ring-primary focus:ring-offset-background bg-background" 
          />
          <span className={`font-semibold ${checked ? "text-primary" : "text-foreground"}`}>{title}</span>
        </div>
        {checked ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </label>
      {checked && (
        <div className="p-4 pt-0 border-t border-primary/20 bg-background/50">
          <div className="mt-4 space-y-4">
            {children}
          </div>
        </div>
      )}
    </div>
  )

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
            <h1 className="text-2xl md:text-3xl font-bold mb-2">パートナー情報修正</h1>
            <p className="text-muted-foreground">
              修正・更新が必要な項目にチェックを入れて、新しい内容をご入力ください。
            </p>
          </div>

          {isSuccess ? (
            <div className="glass-card rounded-xl p-10 text-center border border-primary/30 bg-primary/5 shadow-lg">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">送信完了しました</h2>
              <p className="text-muted-foreground mb-8">
                情報修正の申請を受け付けました。反映まで今しばらくお待ちください。
              </p>
              <Link href="/partner">
                <Button>マイページに戻る</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 md:p-8 space-y-8 shadow-lg">
              
              {/* ▼ 必須の基本情報 ▼ */}
              <div className="space-y-5">
                <h3 className="text-lg font-bold border-b border-border/50 pb-2">基本情報</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">企業・団体名 <span className="text-red-500">*</span></label>
                  <Input name="companyName" required className="bg-secondary/50" placeholder="現在の企業・団体名をご記入ください" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">担当者名</label>
                    {/* ★ 必須を外し、プレースホルダーで案内を追加 */}
                    <Input name="contactName" className="bg-secondary/50" placeholder="変更がある場合にご記入ください" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">メールアドレス</label>
                    {/* ★ 必須を外し、プレースホルダーで案内を追加 */}
                    <Input type="email" name="email" className="bg-secondary/50" placeholder="変更がある場合にご記入ください" />
                  </div>
                </div>
              </div>

              {/* ▼ 修正項目（折り畳み式） ▼ */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold border-b border-border/50 pb-2 mb-4">修正する項目</h3>
                
                <EditSection id="furigana" title="ふりがなの修正" checked={edits.furigana}>
                  <label className="block text-sm font-medium mb-2">新しいふりがな</label>
                  <Input name="furigana" className="bg-secondary/50" placeholder="かぶしきがいしゃこずもべーす" />
                </EditSection>

                <EditSection id="partnerType" title="パートナー種別の変更" checked={edits.partnerType}>
                  <label className="block text-sm font-medium mb-2">新しいパートナー種別</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["宇宙系企業", "宇宙系学生団体", "非宇宙系企業", "非宇宙系学生団体"].map((type) => (
                      <label key={type} className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-secondary/30 cursor-pointer hover:bg-secondary/50">
                        <input type="radio" name="partnerType" value={type} className="text-primary focus:ring-primary" />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </EditSection>

                <EditSection id="activity" title="活動・事業内容の修正" checked={edits.activity}>
                  <label className="block text-sm font-medium mb-2">新しい活動・事業内容</label>
                  <textarea name="activity" className="w-full min-h-[100px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </EditSection>

                <EditSection id="achievements" title="主な実績の修正・追加" checked={edits.achievements}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">主な実績【書き換え】</label>
                      {/* ★ Inputからtextareaに変更し、しっかり書き込めるようにしました */}
                      <textarea name="achievementRewrite" className="w-full min-h-[100px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">主な実績【追加】</label>
                      {/* ★ Inputからtextareaに変更し、しっかり書き込めるようにしました */}
                      <textarea name="achievementAdd" className="w-full min-h-[100px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                </EditSection>

                <EditSection id="intros" title="団体紹介文の修正" checked={edits.intros}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">団体紹介の文章 (50文字以下)</label>
                      <p className="text-[10px] text-muted-foreground mb-2">用途：SNSでの紹介やロゴ掲載時のキャプション等</p>
                      <textarea name="intro50" maxLength={50} className="w-full min-h-[80px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">団体紹介の文章 (250文字以下)</label>
                      <p className="text-[10px] text-muted-foreground mb-2">用途：Cosmo Base内のチャンネルや公式HP、資料等</p>
                      <textarea name="intro250" maxLength={250} className="w-full min-h-[120px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                </EditSection>

                <EditSection id="logo" title="ロゴ画像の変更" checked={edits.logo}>
                  <label className="block text-sm font-medium mb-2">新しいロゴ画像をアップロード</label>
                  <p className="text-[10px] text-muted-foreground mb-3">正方形及び横長の透過PNG/AIデータを推奨します。</p>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 border-border/50 bg-secondary/20 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className={`w-8 h-8 mb-3 ${fileName ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className="mb-2 text-sm text-muted-foreground">
                          {fileName ? (
                            <span className="font-semibold text-primary">{fileName} を選択中</span>
                          ) : (
                            <span className="font-semibold text-primary">クリックしてファイルを選択</span>
                          )}
                        </p>
                      </div>
                      <input 
                        type="file" 
                        name="logoFile" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFileName(e.target.files[0].name)
                          }
                        }}
                      />
                    </label>
                  </div>
                </EditSection>

                <EditSection id="sns" title="SNS・各種リンクの修正" checked={edits.sns}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-xs font-medium mb-1">HP (Webサイト)</label><Input name="snsHp" placeholder="https://" className="bg-secondary/50" /></div>
                    <div><label className="block text-xs font-medium mb-1">X (旧Twitter)</label><Input name="snsX" placeholder="https://" className="bg-secondary/50" /></div>
                    <div><label className="block text-xs font-medium mb-1">Instagram</label><Input name="snsInsta" placeholder="https://" className="bg-secondary/50" /></div>
                    <div><label className="block text-xs font-medium mb-1">Facebook</label><Input name="snsFb" placeholder="https://" className="bg-secondary/50" /></div>
                    <div><label className="block text-xs font-medium mb-1">note</label><Input name="snsNote" placeholder="https://" className="bg-secondary/50" /></div>
                    <div><label className="block text-xs font-medium mb-1">その他①</label><Input name="snsOther1" placeholder="https://" className="bg-secondary/50" /></div>
                    <div><label className="block text-xs font-medium mb-1">その他②</label><Input name="snsOther2" placeholder="https://" className="bg-secondary/50" /></div>
                  </div>
                </EditSection>
              </div>

              {/* ▼ 送信ボタン ▼ */}
              <div className="pt-6 border-t border-border/50">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full h-14 text-lg font-bold shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      送信中...
                    </>
                  ) : (
                    "チェックした内容で修正申請を送信する"
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
