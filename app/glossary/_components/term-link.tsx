"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { useGlossaryTerms } from "./glossary-terms-context"

interface TermLinkProps {
  termName: string
}

type TooltipAlign = "center" | "left" | "right"

export function TermLink({ termName }: TermLinkProps) {
  const [open, setOpen] = useState(false)
  const [align, setAlign] = useState<TooltipAlign>("center")
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const termMap = useGlossaryTerms()

  const matched = termMap[termName]

  const cancelHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }

  const scheduleHide = () => {
    hideTimer.current = setTimeout(() => setOpen(false), 120)
  }

  const handleEnter = () => {
    cancelHide()
    // Calculate tooltip alignment before showing to avoid flash
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()
      const tooltipWidth = 256 // w-64
      const center = rect.left + rect.width / 2
      if (center - tooltipWidth / 2 < 8) setAlign("left")
      else if (center + tooltipWidth / 2 > window.innerWidth - 8) setAlign("right")
      else setAlign("center")
    }
    setOpen(true)
  }

  const tooltipPos =
    align === "left"
      ? "left-0"
      : align === "right"
      ? "right-0"
      : "left-1/2 -translate-x-1/2"

  if (!matched) {
    return (
      <span className="text-primary/70 border-b border-dashed border-primary/40">
        {termName}
      </span>
    )
  }

  return (
    <span ref={wrapperRef} className="relative inline-block">
      {/* Term link — hover opens tooltip, click navigates */}
      <Link
        href={`/glossary/term/${matched.slug}`}
        className="text-primary border-b border-dashed border-primary/60 hover:text-primary/80 transition-colors"
        onMouseEnter={handleEnter}
        onMouseLeave={scheduleHide}
      >
        {termName}
      </Link>

      {open && (
        <span
          className={`absolute z-[9999] bottom-full mb-2 w-64 rounded-xl shadow-xl border border-border/60 p-3 text-sm text-left ${tooltipPos}`}
          style={{
            background: "oklch(0.14 0.02 260 / 0.97)",
            backdropFilter: "blur(12px)",
          }}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        >
          <p className="font-semibold text-foreground mb-1">{matched.term}</p>
          <p className="text-muted-foreground leading-relaxed text-xs line-clamp-4">
            {matched.textLv1 ?? matched.textLv2}
          </p>
          <Link
            href={`/glossary/term/${matched.slug}`}
            className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline"
            onClick={() => setOpen(false)}
          >
            <ExternalLink className="w-3 h-3" />
            詳細ページを見る
          </Link>
        </span>
      )}
    </span>
  )
}
