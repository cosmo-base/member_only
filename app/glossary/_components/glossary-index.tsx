"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, BookOpen, ChevronRight } from "lucide-react"
import { StarBackground } from "@/components/star-background"
import { SiteHeader } from "@/components/site-header"
import { Input } from "@/components/ui/input"
import {
  CATEGORY_LARGE_LIST,
  type CategoryLarge,
  type DifficultyLevel,
  type GlossaryTerm,
} from "@/data/glossary"
import { DifficultyBadge } from "./difficulty-badge"
import { cn } from "@/lib/utils"

const KANA_INDEX = [
  "あ", "い", "う", "え", "お",
  "か", "き", "く", "け", "こ",
  "さ", "し", "す", "せ", "そ",
  "た", "ち", "つ", "て", "と",
  "な", "に", "ぬ", "ね", "の",
  "は", "ひ", "ふ", "へ", "ほ",
  "ま", "み", "む", "め", "も",
  "や", "ゆ", "よ",
  "ら", "り", "る", "れ", "ろ",
  "わ", "を", "ん",
  "A–Z",
]

function kanaRow(kana: string): string {
  if (!kana) return ""
  const first = kana[0]
  if (/[a-zA-Z]/.test(first)) return "A–Z"
  return first
}

interface GlossaryIndexProps {
  terms: GlossaryTerm[]
}

export default function GlossaryIndex({ terms }: GlossaryIndexProps) {
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<CategoryLarge | "">("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 0>(0)
  const [selectedKana, setSelectedKana] = useState("")

  const filtered = useMemo<GlossaryTerm[]>(() => {
    return terms.filter((t) => {
      if (selectedCategory && t.categoryLarge !== selectedCategory) return false
      if (selectedDifficulty && t.difficulty !== selectedDifficulty) return false
      if (selectedKana) {
        const row = kanaRow(t.kana)
        if (row !== selectedKana) return false
      }
      if (query) {
        const q = query.toLowerCase()
        const hit =
          t.term.includes(q) ||
          t.kana.includes(q) ||
          t.english.toLowerCase().includes(q) ||
          t.aliases?.some((a) => a.toLowerCase().includes(q))
        if (!hit) return false
      }
      return true
    })
  }, [terms, query, selectedCategory, selectedDifficulty, selectedKana])

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.kana.localeCompare(b.kana, "ja")),
    [filtered]
  )

  const hasFilter = query || selectedCategory || selectedDifficulty || selectedKana

  return (
    <div className="relative min-h-screen">
      <StarBackground />
      <main className="relative z-10">
        <SiteHeader />
        <div className="h-16" />

        {/* Hero */}
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              宇宙用語集
            </h1>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mt-3">
            宇宙業界の専門用語を、初心者から実務者まで3つのレベルで分かりやすく解説します。
            知識ゼロでも大丈夫。難しい言葉に出会ったとき、ここへ来てください。
          </p>
          <div className="mt-2 text-xs text-muted-foreground">
            現在 <span className="text-primary font-semibold">{terms.length}</span> 語収録
          </div>
        </div>

        {/* Search & Filters */}
        <div className="max-w-5xl mx-auto px-4 mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedKana("")
              }}
              placeholder="用語名・読み・英語で検索…"
              className="pl-10 bg-card/60 border-border/60"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                !selectedCategory
                  ? "bg-primary/20 text-primary border-primary/40"
                  : "bg-card/40 text-muted-foreground border-border/40 hover:border-border"
              )}
            >
              すべて
            </button>
            {CATEGORY_LARGE_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                  selectedCategory === cat
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "bg-card/40 text-muted-foreground border-border/40 hover:border-border"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-2">
            {([0, 1, 2, 3] as const).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d === selectedDifficulty ? 0 : d)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                  selectedDifficulty === d
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "bg-card/40 text-muted-foreground border-border/40 hover:border-border"
                )}
              >
                {d === 0 ? "難易度: すべて" : d === 1 ? "★☆☆ 初級" : d === 2 ? "★★☆ 中級" : "★★★ 上級"}
              </button>
            ))}
          </div>
        </div>

        {/* 50-on index */}
        <div className="max-w-5xl mx-auto px-4 mb-6">
          <div className="glass-card rounded-xl p-3">
            <div className="flex flex-wrap gap-1">
              {KANA_INDEX.map((k) => {
                const hasTerms = terms.some((t) => kanaRow(t.kana) === k)
                return (
                  <button
                    key={k}
                    disabled={!hasTerms}
                    onClick={() => {
                      setSelectedKana(k === selectedKana ? "" : k)
                      setQuery("")
                    }}
                    className={cn(
                      "w-8 h-8 rounded text-xs font-medium transition-colors",
                      selectedKana === k
                        ? "bg-primary text-primary-foreground"
                        : hasTerms
                        ? "bg-card/60 text-foreground hover:bg-primary/20 hover:text-primary"
                        : "text-muted-foreground/30 cursor-not-allowed"
                    )}
                  >
                    {k}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-5xl mx-auto px-4 pb-16">
          {hasFilter && (
            <div className="text-sm text-muted-foreground mb-4">
              {sorted.length > 0 ? (
                <>{sorted.length} 件が見つかりました</>
              ) : (
                <>該当する用語が見つかりませんでした</>
              )}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(hasFilter ? sorted : [...terms].sort((a, b) => a.kana.localeCompare(b.kana, "ja"))).map(
              (term) => (
                <Link
                  key={term.slug}
                  href={`/glossary/term/${term.slug}`}
                  className="glass-card rounded-xl p-4 group block transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {term.term}
                      </p>
                      <p className="text-xs text-muted-foreground">{term.english}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors flex-shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <DifficultyBadge level={term.difficulty} />
                    <span className="text-xs text-muted-foreground">{term.categoryLarge}</span>
                  </div>
                  {term.textLv1 && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {term.textLv1.replace(/\[[^\]]+\]/g, (m) => m.slice(1, -1))}
                    </p>
                  )}
                </Link>
              )
            )}
          </div>
        </div>

        <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm py-8">
          <div className="max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; 2026 Cosmo Base. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  )
}
