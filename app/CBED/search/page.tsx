// app/CBED/search/page.tsx
"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Calendar, Loader2, Filter, RotateCcw } from "lucide-react"
import { fetchEventsData, SpaceEvent } from "@/data/CBED"

export default function EventSearchPage() {
  const [events, setEvents] = useState<SpaceEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // フィルター用の状態
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all") 
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedOrganizer, setSelectedOrganizer] = useState("all")
  // ★追加：過去イベント表示用トグル
  const [showPastEvents, setShowPastEvents] = useState(false)

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true)
      const data = await fetchEventsData()
      setEvents(data)
      setIsLoading(false)
    }
    loadEvents()
  }, [])

  const uniqueTypes = useMemo(() => {
    const typesSet = new Set<string>()
    events.forEach(event => {
      if (event.type) {
        String(event.type).split(',').forEach(t => {
          const trimmed = t.trim()
          if (trimmed) typesSet.add(trimmed)
        })
      }
    })
    
    return Array.from(typesSet).sort((a, b) => {
      if (a === "その他") return 1;
      if (b === "その他") return -1;
      return 0;
    })
  }, [events])

  const handleReset = () => {
    setSearchQuery("")
    setSelectedType("all")
    setSelectedDifficulty("all")
    setSelectedOrganizer("all")
    setShowPastEvents(false) // トグルもリセット
  }

  // フィルタリングと並び替え処理
  const filteredEvents = useMemo(() => {
    // 今日の日付文字列（yyyy-mm-dd）を作成
    const d = new Date()
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    const filtered = events.filter((event) => {
      const title = event.title ? String(event.title).toLowerCase() : ""
      const location = event.location ? String(event.location).toLowerCase() : ""
      
      const eventTypes = event.type ? String(event.type).split(',').map(t => t.trim()) : []
      const difficulty = event.difficulty ? String(event.difficulty).trim() : ""
      const query = searchQuery.toLowerCase().trim()

      const isCosmoBaseEvent = event.organizer 
        ? String(event.organizer).replace(/\s+/g, "").toLowerCase().includes("cosmobase")
        : false

      // ★追加：過去イベントかどうかの判定（終了日があれば終了日、なければ開始日で判定）
      const targetDate = event.endDate || event.date || ""
      const isPastEvent = targetDate !== "" && targetDate < todayStr

      // 0. 過去イベントを非表示にする設定なら弾く
      if (!showPastEvents && isPastEvent) {
        return false
      }

      // 1. キーワード検索
      const matchQuery = !query || title.includes(query) || location.includes(query)
      
      // 2. 形式フィルター
      const matchType = selectedType === "all" || eventTypes.includes(selectedType)
      
      // 3. 難易度フィルター
      let matchDifficulty = true
      if (selectedDifficulty !== "all") {
        if (difficulty === "全レベル") {
          matchDifficulty = true
        } else if (selectedDifficulty === "初心者向け") {
          matchDifficulty = difficulty === "初心者向け"
        } else if (selectedDifficulty === "中級者向け") {
          matchDifficulty = difficulty === "中級者向け" || difficulty === "中級者以上"
        } else if (selectedDifficulty === "上級者向け") {
          matchDifficulty = difficulty === "上級者向け" || difficulty === "中級者以上"
        } else {
          matchDifficulty = false
        }
      }

      // 4. 主催フィルター
      let matchOrganizer = true
      if (selectedOrganizer === "cosmobase") {
        matchOrganizer = isCosmoBaseEvent
      } else if (selectedOrganizer === "others") {
        matchOrganizer = !isCosmoBaseEvent
      }

      return matchQuery && matchType && matchDifficulty && matchOrganizer
    })

    // ★追加：日付の昇順（直近のイベントから順に）並び替える
    return filtered.sort((a, b) => {
      const dateA = a.date || ""
      const dateB = b.date || ""
      return dateA.localeCompare(dateB)
    })

  }, [events, searchQuery, selectedType, selectedDifficulty, selectedOrganizer, showPastEvents])

  return (
    <ContentPageLayout title="詳細検索" level={4} levelTitle="体系化" logo="CBED">
      <div className="glass-card rounded-xl p-5 md:p-6 mb-8 border border-border/50 shadow-sm">
        
        {/* 検索バー ＆ リセットボタン */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="イベント名や会場で検索..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary/50 border-border/50"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="shrink-0 text-muted-foreground hover:text-foreground"
            title="絞り込みをリセット"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">リセット</span>
          </Button>
        </div>

        {/* フィルタープルダウン群 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <span className="text-xs font-semibold text-muted-foreground block mb-2">主催・運営</span>
            <select 
              value={selectedOrganizer}
              onChange={(e) => setSelectedOrganizer(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border/50 bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">すべてのイベント</option>
              <option value="cosmobase">Cosmo Base主催</option>
              <option value="others">外部イベント</option>
            </select>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted-foreground block mb-2">イベントの形式</span>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border/50 bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">すべての形式</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted-foreground block mb-2">対象者のレベル</span>
            <select 
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border/50 bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">すべてのレベル</option>
              <option value="初心者向け">初心者向け</option>
              <option value="中級者向け">中級者向け</option>
              <option value="上級者向け">上級者向け</option>
            </select>
          </div>
