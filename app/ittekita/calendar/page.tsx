// app/ittekita/calendar/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2, Image as ImageIcon, ExternalLink, Info } from "lucide-react"
import { fetchIttekitaData, IttekitaEvent } from "@/data/ittekita"

const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
const weekdays = ["月", "火", "水", "木", "金", "土", "日"]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export default function IttekitaCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const [eventsMap, setEventsMap] = useState<Record<string, IttekitaEvent[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true)
      const data = await fetchIttekitaData()
      
      const mappedData: Record<string, IttekitaEvent[]> = {}
      data.forEach(event => {
        const dateStr = String(event.date).trim()
        if (!mappedData[dateStr]) {
          mappedData[dateStr] = []
        }
        mappedData[dateStr].push(event)
      })
      
      setEventsMap(mappedData)
      setIsLoading(false) 
    }
    loadEvents()
  }, [])

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOffset = getFirstDayOfMonth(year, month)

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const days = []

  for (let i = 0; i < firstDayOffset; i++) {
    days.push(<div key={`empty-${i}`} className="p-2" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayEvents = eventsMap[dateStr] || []
    const hasEvents = dayEvents.length > 0

    days.push(
      <div
        key={day}
        className={`p-2 min-h-[110px] border border-border/30 rounded-lg flex flex-col gap-1 ${hasEvents ? "bg-primary/5" : ""}`}
      >
        <span className={`text-sm font-medium ${hasEvents ? "text-primary" : "text-muted-foreground"}`}>
          {day}
        </span>

        {dayEvents.map((event, index) => (
          <div key={index} className="bg-background rounded shadow-sm border border-border/50 p-1.5 flex flex-col gap-1">
            <p className="text-xs font-bold text-foreground leading-tight">{event.title}</p>
            {event.venue && <p className="text-[10px] text-muted-foreground truncate">{event.venue}</p>}
            
            <div className="flex flex-wrap gap-1 mt-1">
              {event.url && (
                <a href={event.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5 text-[10px] text-primary hover:underline bg-primary/10 px-1.5 py-0.5 rounded">
                  <ExternalLink className="w-3 h-3" /> レポ
                </a>
              )}
              {event.cbedId && (
                <Link href={`/events/${event.cbedId}`} className="flex items-center gap-0.5 text-[10px] text-foreground hover:underline bg-secondary/60 px-1.5 py-0.5 rounded border border-border/40">
                  <Info className="w-3 h-3 text-primary" /> 詳細
                </Link>
              )}
              {event.photoLink && (
                <a href={event.photoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5 text-[10px] text-accent hover:underline bg-accent/10 px-1.5 py-0.5 rounded">
                  <ImageIcon className="w-3 h-3" /> 写真
                </a>
              )}
            </div>
            {event.details && (
              <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5 border-t border-border/50 pt-0.5" title={event.details}>
                {event.details}
              </p>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <ContentPageLayout
      title="イベントカレンダー"
      level={3}
      levelTitle=""
      logo="CBittekita"
    >
      <div className="glass-card rounded-xl p-6 mb-8">
        <p className="text-muted-foreground leading-relaxed">
          過去に投稿された「行ってきた」レポートをカレンダー形式で確認できます。
          イベントの詳細もこちらからアクセス可能です。
        </p>
      </div>

      <div className="glass-card rounded-xl p-6 relative min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">データを読み込み中...</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold text-foreground">
            {year}年 {months[month]}
          </h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    </ContentPageLayout>
  )
}