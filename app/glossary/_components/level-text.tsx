"use client"

import { TermLink } from "./term-link"

interface LevelTextProps {
  text: string
}

export function LevelText({ text }: LevelTextProps) {
  // Split on [term] patterns and render inline TermLink for each
  const parts = text.split(/\[([^\]]+)\]/)

  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <TermLink key={i} termName={part} />
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}
