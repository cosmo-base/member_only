"use client"

import { createContext, useContext } from "react"
import type { GlossaryTerm } from "@/data/glossary"

const GlossaryTermsContext = createContext<GlossaryTerm[]>([])

export function GlossaryTermsProvider({
  terms,
  children,
}: {
  terms: GlossaryTerm[]
  children: React.ReactNode
}) {
  return (
    <GlossaryTermsContext.Provider value={terms}>
      {children}
    </GlossaryTermsContext.Provider>
  )
}

export function useGlossaryTerms(): GlossaryTerm[] {
  return useContext(GlossaryTermsContext)
}
