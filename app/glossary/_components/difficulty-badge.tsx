import { cn } from "@/lib/utils"
import type { DifficultyLevel } from "@/data/glossary"

interface DifficultyBadgeProps {
  level: DifficultyLevel
  className?: string
}

const STARS: Record<DifficultyLevel, string> = {
  1: "★☆☆",
  2: "★★☆",
  3: "★★★",
}

const LABEL: Record<DifficultyLevel, string> = {
  1: "初級",
  2: "中級",
  3: "上級",
}

const COLOR: Record<DifficultyLevel, string> = {
  1: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  2: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  3: "bg-rose-500/20 text-rose-300 border-rose-500/30",
}

export function DifficultyBadge({ level, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        COLOR[level],
        className
      )}
    >
      <span className="tracking-tight">{STARS[level]}</span>
      <span>{LABEL[level]}</span>
    </span>
  )
}
