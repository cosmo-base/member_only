// app/CBMD/inquiry/page.tsx
"use client"

import { useState, Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquarePlus, Send, Loader2, Home, Map as MapIcon, Search, Database } from "lucide-react"

function InquiryContent() {
  const searchParams = useSearchParams()
  const facilityParam = searchParams.get("facility") || ""

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inquiryType, setInquiryType] = useState("新しい施設を追加してほしい")

  // 施設名の初期値をURLパラメータから設定
  const [facilityName, setFacilityName] = useState("")

  useEffect(() => {
    if (facilityParam) {
      setFacilityName(facilityParam)
      setInquiryType("既存施設の情報を更新・修正してほしい")
    }
  }, [facilityParam])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      // no-cors のため opaque response が返り、成功・失敗を判定できない。fire-and-forget として扱う
      await fetch(
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLScA3WyNS-YPdzfkprvFzCsjs4DP_AwL4drDilq0fmiGIZWD-Q/formResponse",
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
      title="Cosmo Base Museum Database"
      level={2}
      levelTitle=""
      logo="CBMD"
    >
      <div className="min-h-screen relative">
        <main className="relative z-10 pt-8 pb-12 px-4">

          <div className="max-w-7xl mx-auto mb-8 border-b border-border/30 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/CBMD"><Button variant="outline" size="sm" className="bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground"><Home className="w-4 h-4 mr-2" /> トップ</Button></Link>
              <Link href="/CBMD/map"><Button variant="outline" size="sm" className="bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground"><MapIcon className="w-4 h-4 mr-2" /> マップ</Button></Link>
              <Link href="/CBMD/search"><Button variant="outline" size="sm" className="bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground"><Search className="w-4 h-4 mr-2" /> 検索</Button></Link>
              <Link href="/CBMD/database"><Button variant="outline" size="sm" className="bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground"><Database className="w-4 h-4 mr-2" /> データベース一覧</Button></Link>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="glass-card rounded-xl p-6 mb-8 border border-border/50 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/20 shrink-0">
                  <MessageSquarePlus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    CBMD お問い合わせ・情報リクエスト
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    施設の新規追加、既存情報の修正・更新、機能の要望などはこちらからお送りください。<br />
                    皆様からのタレコミが、データベースの成長に繋がります！
                  </p>
                </div>
              </div>
            </div>

            {submitted ? (
              <div className="glass-card rounded-xl p-10 text-center animate-in fade-in slide-in-from-bottom-4 border border-border/50 shadow-xl bg-background/50 backdrop-blur-md">
                <div className="p-4 rounded-full bg-emerald-500/20 w-fit mx-auto mb-6">
                  <Send className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  送信が完了しました！
                </h3>
                <p className="text-muted-foreground mb-8 text-balance">
                  情報のご提供、誠にありがとうございます。<br />
                  内容を確認の上、随時データベースへ反映させていただきます。<br />
                  <span className="text-xs">うまく送信できなかった場合は再度お試しください。</span>
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/CBMD">
                    <Button variant="outline" className="border-border/50 hover:bg-secondary/50">CBMDトップに戻る</Button>
                  </Link>
                  <Button onClick={() => { setSubmitted(false); setFacilityName(""); }} className="bg-primary/20 text-primary hover:bg-primary/30">
                    続けてリクエストを送る
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 sm:p-8 space-y-8 border border-border/50 shadow-xl bg-background/50 backdrop-blur-md">

                {/* 1. お問い合わせの種類 (必須) */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-foreground">
                    お問い合わせの種類 <span className="text-destructive">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "新しい施設を追加してほしい",
                      "既存施設の情報を更新・修正してほしい",
                      "欲しい情報・機能の要望がある",
                      "その他・お問い合わせ"
                    ].map((type) => (
                      <label key={type} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${inquiryType === type ? "border-primary bg-primary/10" : "border-border/50 bg-secondary/30 hover:bg-secondary/50"}`}>
                        <input
                          type="radio"
                          name="entry.597751418" // お問い合わせの種類のentry ID
                          value={type}
                          checked={inquiryType === type}
                          onChange={(e) => setInquiryType(e.target.value)}
                          required
                          className="mr-3 w-4 h-4 text-primary focus:ring-primary border-border bg-background"
                        />
                        <span className="text-sm font-medium text-foreground">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. 施設名 (施設追加/修正の場合は必須) */}
                {(inquiryType === "新しい施設を追加してほしい" || inquiryType === "既存施設の情報を更新・修正してほしい") && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-semibold text-foreground">
                      施設名 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="entry.1169031779" // 施設名のentry ID
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                      placeholder="例: コスモベース科学館"
                      required
                      className="bg-secondary/30 border-border/50 focus:bg-background h-12"
                    />
                    {facilityParam && <p className="text-xs text-primary">※施設ページから遷移したため自動入力されています</p>}
                  </div>
                )}

                {/* 条件分岐による入力フィールド */}

                {/* ▼ 新規追加の場合のみ表示 ▼ */}
                {inquiryType === "新しい施設を追加してほしい" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 p-5 rounded-xl border border-primary/20 bg-primary/5">
                    <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2"><span className="w-1.5 h-4 bg-primary rounded-full"></span>新規追加情報</h3>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">都道府県 <span className="text-destructive">*</span></label>
                      <select name="entry.2054240521" required className="flex h-12 w-full rounded-md border border-border/50 bg-secondary/30 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="">選択してください</option>
                        {["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"].map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">公式サイトなどのURL <span className="text-muted-foreground text-xs ml-2">【任意】</span></label>
                      <Input name="entry.1631440826" placeholder="https://..." className="bg-secondary/30 border-border/50 h-12" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">どんな宇宙展示・体験がありますか？ <span className="text-destructive">*</span></label>
                      <Textarea name="entry.1935955630" placeholder="例: ロケットの模型があります！週末はプラネタリウムで星空解説をやっています。" required rows={4} className="bg-secondary/30 border-border/50 resize-y" />
                    </div>
                  </div>
                )}

                {/* ▼ 既存情報の更新・修正の場合のみ表示 ▼ */}
                {inquiryType === "既存施設の情報を更新・修正してほしい" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 p-5 rounded-xl border border-accent/20 bg-accent/5">
                    <h3 className="text-sm font-bold text-accent mb-4 flex items-center gap-2"><span className="w-1.5 h-4 bg-accent rounded-full"></span>修正・更新情報</h3>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">修正・更新したい項目 <span className="text-muted-foreground text-xs ml-2">（複数選択可）</span></label>
                      <div className="grid grid-cols-2 gap-2">
                        {["営業時間 / 休館日", "入館料", "展示内容・カテゴリ", "URL・SNSリンクの切れ", "施設が閉館している", "その他"].map((item) => (
                          <label key={item} className="flex items-center space-x-2 text-sm text-foreground">
                            <input type="checkbox" name="entry.1424572921" value={item} className="rounded border-border/50 text-accent focus:ring-accent bg-secondary/30" />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">正しい情報や変更内容の詳細 <span className="text-destructive">*</span></label>
                      <Textarea name="entry.7018100" placeholder="例: 入館料が500円から600円に変更されていました。" required rows={4} className="bg-secondary/30 border-border/50 resize-y" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">情報元となるURL <span className="text-muted-foreground text-xs ml-2">【任意】</span></label>
                      <Input name="entry.331204866" placeholder="公式サイトのお知らせページのURLなど" className="bg-secondary/30 border-border/50 h-12" />
                    </div>
                  </div>
                )}

                {/* ▼ 要望・その他の場合のみ表示 ▼ */}
                {(inquiryType === "欲しい情報・機能の要望がある" || inquiryType === "その他・お問い合わせ") && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 p-5 rounded-xl border border-chart-3/20 bg-chart-3/5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">ご要望・お問い合わせ内容 <span className="text-destructive">*</span></label>
                      <Textarea name="entry.1820109078" placeholder="CBMDに関するご要望やご意見をお書きください" required rows={5} className="bg-secondary/30 border-border/50 resize-y" />
                    </div>
                  </div>
                )}

                {/* 共通: メールアドレス */}
                <div className="pt-4 border-t border-border/30">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    メールアドレス <span className="text-muted-foreground text-xs font-normal ml-2">【任意】対応完了の連絡が必要な方はご入力ください</span>
                  </label>
                  <Input
                    type="email"
                    name="entry.1022519992" // メールアドレスのentry ID
                    placeholder="your@email.com"
                    className="bg-secondary/30 border-border/50 h-12 max-w-md"
                  />
                </div>

                {/* 送信ボタン */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow h-14 text-lg font-bold mt-8"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      送信中...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      リクエストを送信する
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </main>
      </div>
    </ContentPageLayout>
  )
}

export default function InquiryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="text-muted-foreground">読み込み中...</div></div>}>
      <InquiryContent />
    </Suspense>
  )
}
