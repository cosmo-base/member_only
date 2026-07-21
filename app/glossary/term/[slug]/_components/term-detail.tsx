"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, BookOpen } from "lucide-react"
import { type GlossaryTerm } from "@/data/glossary"
import { type RelatedTermGroups } from "@/lib/glossary-fetch"
import { DifficultyBadge } from "@/app/glossary/_components/difficulty-badge"
import { LevelText } from "@/app/glossary/_components/level-text"
import { cn } from "@/lib/utils"
import { GlossaryTermsProvider, type TermMap } from "@/app/glossary/_components/glossary-terms-context"

const LEVEL_LABELS = {
  lv1: { label: "Lv.1 初心者", sublabel: "Concept", color: "text-emerald-400" },
  lv2: { label: "Lv.2 中級者", sublabel: "Standard", color: "text-amber-400" },
  lv3: { label: "Lv.3 上級者", sublabel: "Professional", color: "text-rose-400" },
} as const

type LevelKey = keyof typeof LEVEL_LABELS

interface TermDetailProps {
  term: GlossaryTerm
  relatedGroups: RelatedTermGroups
  termMap: TermMap
}

export function TermDetail({ term, relatedGroups, termMap }: TermDetailProps) {
  const availableLevels = (["lv1", "lv2", "lv3"] as LevelKey[]).filter(
    (lv) =>
      (lv === "lv1" && term.textLv1) ||
      (lv === "lv2" && term.textLv2) ||
      (lv === "lv3" && term.textLv3)
  )

  const [activeLevel, setActiveLevel] = useState<LevelKey>(availableLevels[0] ?? "lv1")

  const activeText =
    activeLevel === "lv1"
      ? term.textLv1
      : activeLevel === "lv2"
      ? term.textLv2
      : term.textLv3

  return (
    <GlossaryTermsProvider termMap={termMap}>
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/glossary" className="flex items-center gap-1 hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4" />
          宇宙用語集
        </Link>
        <span>/</span>
        <span className="text-foreground">{term.term}</span>
      </nav>

      {/* Term Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">{term.kana}</div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{term.term}</h1>
            <div className="text-base text-muted-foreground">{term.english}</div>
          </div>
          <div className="p-3 rounded-lg bg-primary/10">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <DifficultyBadge level={term.difficulty} />
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-primary/10 text-primary border-primary/30">
            {term.categoryLarge}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-card/40 text-muted-foreground border-border/40">
            {term.categoryMedium}
          </span>
        </div>
      </div>

      {/* Level Tabs */}
      <div className="glass-card rounded-xl">
        <div className="flex border-b border-border/40">
          {availableLevels.map((lv) => {
            const meta = LEVEL_LABELS[lv]
            return (
              <button
                key={lv}
                onClick={() => setActiveLevel(lv)}
                className={cn(
                  "flex-1 py-3 px-2 text-sm font-medium transition-colors border-b-2",
                  activeLevel === lv
                    ? `border-current ${meta.color} bg-primary/5`
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-primary/5"
                )}
              >
                <div className={activeLevel === lv ? meta.color : ""}>{meta.label}</div>
                <div className="text-xs opacity-60">{meta.sublabel}</div>
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {activeText ? (
            <p className="leading-relaxed text-foreground/90 text-base">
              <LevelText text={activeText} />
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">このレベルの解説は準備中です。</p>
          )}
        </div>
      </div>

      {/* Related term groups */}
      {(relatedGroups.related.length > 0 || relatedGroups.similar.length > 0 || relatedGroups.opposite.length > 0) && (
        <div className="glass-card rounded-xl p-6 space-y-5">
          {relatedGroups.related.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                関連語
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedGroups.related.map((rt) => (
                  <TermChip key={rt.slug} term={rt} />
                ))}
              </div>
            </div>
          )}
          {relatedGroups.similar.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                類義語
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedGroups.similar.map((rt) => (
                  <TermChip key={rt.slug} term={rt} />
                ))}
              </div>
            </div>
          )}
          {relatedGroups.opposite.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                対義語
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedGroups.opposite.map((rt) => (
                  <TermChip key={rt.slug} term={rt} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Credit */}
      <div className="text-xs text-muted-foreground/60 text-right">
        作成・監修：{term.credit ?? "Cosmo Base運営"}
      </div>
    </div>
    </GlossaryTermsProvider>
  )
}

function TermChip({ term }: { term: GlossaryTerm }) {
  return (
    <Link
      href={`/glossary/term/${term.slug}`}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-border/50 bg-card/40 text-foreground hover:text-primary hover:border-primary/40 transition-colors"
    >
      {term.term}
      <DifficultyBadge level={term.difficulty} className="text-[10px]" />
    </Link>
  )
}
