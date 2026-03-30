// app/partner/event/page.tsx
"use client"

import { useState, useMemo } from "react"
import { StarBackground } from "@/components/star-background"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle2, Loader2, Monitor, MapPin } from "lucide-react"
import Link from "next/link"

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbxOPo6aPYd8d6da-4YPvTT1miqNX3DdqzHblsR22sFNUaL_kFVH9HRUbVvtCRKvUAriRA/exec"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 2層目：リアルイベントの手動追加リスト
// ※ 日時を過ぎると自動で消えます
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const REAL_EVENTS = [
  {
    id: "real-01",
    name: "宇宙ビジネス交流会 in 東京",
    date: "2026-03-10", // 消去判定用の日付(YYYY-MM-DD)
    displayDate: "4月10日(金) 18:00〜", // 表示用のテキスト
    location: "東京都港区某所"
  },
]

export default function EventSpeakerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [speakType, setSpeakType] = useState("")

  // 今日の日付を取得（判定用）
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  // 1層目：オンライン（Discord）水曜日リストの自動計算
  const onlineDates = useMemo(() => {
    const dates = []
    const twoMonthsLater = new Date(today)
    twoMonthsLater.setMonth(today.getMonth() + 2)

    const dayOfWeek = today.getDay()
    const daysUntilWed = (3 - dayOfWeek + 7) % 7
    
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() + daysUntilWed)

    const excludeDates = ["12月31日", "1月1日","4月15日"]

    while (currentDate <= twoMonthsLater) {
      const dateStr = `${currentDate.getMonth() + 1}月${currentDate.getDate()}日`
      if (!excludeDates.includes(dateStr)) {
        dates.push(dateStr)
      }
      currentDate.setDate(currentDate.getDate() + 7)
    }
    return dates
  }, [today])

  // 2層目：リアルイベントのフィルタリング
  const activeRealEvents = useMemo(() => {
    return REAL_EVENTS.filter(event => new Date(event.date) >= today)
  }, [today])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const data: Record<string, any> = {}

    // チェックボックスの値をまとめる
    const selectedDates = formData.getAll("dates")
    formData.forEach((value, key) => {
      if (key !== "dates") data[key] = value
    })
    data.dates = selectedDates.join(", ")

    if (data.speakType === "その他") data.speakType = `その他: ${data.speakTypeOther}`

    try {
      await fetch(GAS_API_URL, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "text/plain" },
      })
      setIsSuccess(true)
    } catch (error) {
      console.error("送信エラー:", error)
      alert("送信に失敗しました。")
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
            <h1 className="text-2xl md:text-3xl font-bold mb-2">イベント登壇申請</h1>
            <p className="text-muted-foreground">登壇を希望するイベント・日程を選択してください。</p>
          </div>

          {isSuccess ? (
            <div className="glass-card rounded-xl p-10 text-center border border-primary/30 bg-primary/5 shadow-lg">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">送信完了しました</h2>
              <p className="text-muted-foreground mb-8">登壇のお申し込みを受け付けました。担当者からの連絡をお待ちください。</p>
              <Link href="/partner"><Button>マイページに戻る</Button></Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 md:p-8 space-y-10 shadow-lg">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">企業・団体名 <span className="text-red-500">*</span></label>
                  <Input name="companyName" required className="bg-secondary/50" />
                </div>

                {/* 登壇の種類 */}
                <div>
                  <label className="block text-sm font-medium mb-2">登壇の種類 <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    {["企業・団体紹介", "主催・共催・協賛イベント紹介", "特別登壇機会の提供", "その他"].map((type) => (
                      <label key={type} className="flex items-start gap-2 p-3 rounded-lg border border-border/50 bg-secondary/30 cursor-pointer hover:bg-secondary/50">
                        <input type="radio" name="speakType" value={type} required onChange={(e) => setSpeakType(e.target.value)} className="mt-1 text-primary focus:ring-primary shrink-0" />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                  {speakType === "その他" && <Input name="speakTypeOther" required placeholder="その他の内容を入力" className="bg-secondary/50 mt-2" />}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">内容 <span className="text-red-500">*</span></label>
                  <textarea name="content" required placeholder="話す内容の概要をご記入ください" className="w-full min-h-[100px] p-3 rounded-md border border-input bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>

                {/* --- 1層目：オンライン --- */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-primary">
                    <Monitor className="w-5 h-5" />
                    <h3 className="font-bold">オンライン登壇（Cosmo Baseで宇宙知っトク）</h3>
                  </div>
                  <p className="text-[10px] text-muted-foreground">場所：Discord / 形式：ライトニングトーク・対談等</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {onlineDates.map((date) => (
                      <label key={date} className="flex items-center gap-2 p-2 rounded-lg border border-border/50 bg-secondary/30 cursor-pointer hover:bg-secondary/50">
                        <input type="checkbox" name="dates" value={`オンライン:${date}`} className="text-primary rounded border-primary/50" />
                        <span className="text-sm">{date}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* --- 2層目：リアルイベント --- */}
                {activeRealEvents.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-accent">
                      <MapPin className="w-5 h-5" />
                      <h3 className="font-bold">リアルイベント登壇・ブース出展</h3>
                    </div>
                    <div className="space-y-2">
                      {activeRealEvents.map((event) => (
                        <label key={event.id} className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border/50 bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors">
                          <div className="flex-1">
                            <p className="font-bold text-sm text-foreground">{event.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{event.displayDate} ＠ {event.location}</p>
                          </div>
                          <input type="checkbox" name="dates" value={`リアル:${event.name}(${event.date})`} className="w-5 h-5 text-accent rounded border-border/50" />
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-2">
                  <label className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-secondary/20 cursor-pointer">
                    <input type="checkbox" name="dates" value="それ以降・別途調整" className="text-primary rounded" />
                    <span className="text-sm font-medium">上記以外・それ以降の日程を希望</span>
                  </label>
                </div>

              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-bold shadow-md">
                {isSubmitting ? <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> 送信中...</> : "登壇を申し込む"}
              </Button>
            </form>
          )}
        </main>
      </div>
    </div>
  )
}