"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { glossaryTerms } from "@/data/glossary"

interface TermLinkProps {
  termName: string
}

export function TermLink({ termName }: TermLinkProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const matched = glossaryTerms.find(
    (t) => t.term === termName || t.aliases?.includes(termName)
  )

  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleOutside)
      document.addEventListener("touchstart", handleOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleOutside)
      document.removeEventListener("touchstart", handleOutside)
    }
  }, [open])

  if (!matched) {
    return (
      <span className="text-primary/70 border-b border-dashed border-primary/40">
        {termName}
      </span>
    )
  }

  return (
    <span ref={ref} className="relative inline-block">
      <span
        className="text-primary border-b border-dashed border-primary/60 cursor-pointer hover:text-primary/80 transition-colors"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
      >
        {termName}
      </span>

      {open && (
        <span
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-xl shadow-xl border border-border/60 p-3 text-sm text-left"
          style={{
            background: "oklch(0.14 0.02 260 / 0.97)",
            backdropFilter: "blur(12px)",
          }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
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
