import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { StarBackground } from "@/components/star-background"
import { SiteHeader } from "@/components/site-header"
import { fetchGlossaryTerms, getTermBySlug, getRelatedTerms } from "@/lib/glossary-fetch"
import { TermDetail } from "./_components/term-detail"
import type { TermMap } from "@/app/glossary/_components/glossary-terms-context"
import type { GlossaryTerm } from "@/data/glossary"

function buildTermMap(texts: (string | undefined)[], terms: GlossaryTerm[]): TermMap {
  const mentioned = new Set<string>()
  for (const text of texts) {
    if (!text) continue
    for (const m of text.matchAll(/\[([^\]]+)\]/g)) mentioned.add(m[1])
  }
  const map: TermMap = {}
  for (const t of terms) {
    const nameHit = mentioned.has(t.term)
    const aliasHit = t.aliases?.some((a) => mentioned.has(a)) ?? false
    if (nameHit || aliasHit) {
      const entry = { slug: t.slug, term: t.term, textLv1: t.textLv1, textLv2: t.textLv2 }
      map[t.term] = entry
      for (const alias of t.aliases ?? []) {
        if (mentioned.has(alias)) map[alias] = entry
      }
    }
  }
  return map
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const terms = await fetchGlossaryTerms()
  return terms.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const terms = await fetchGlossaryTerms()
  const term = getTermBySlug(terms, slug)
  if (!term) return { title: "用語が見つかりません" }
  return {
    title: `${term.term}（${term.english}）`,
    description: term.textLv1?.replace(/\[[^\]]+\]/g, (m) => m.slice(1, -1)).slice(0, 120),
  }
}

export default async function TermPage({ params }: PageProps) {
  const { slug } = await params
  const terms = await fetchGlossaryTerms()
  const term = getTermBySlug(terms, slug)
  if (!term) notFound()

  const relatedTerms = getRelatedTerms(terms, term)
  const termMap = buildTermMap([term.textLv1, term.textLv2, term.textLv3], terms)

  return (
    <div className="relative min-h-screen">
      <StarBackground />
      <main className="relative z-10">
        <SiteHeader />
        <div className="h-16" />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <TermDetail term={term} relatedTerms={relatedTerms} termMap={termMap} />
        </div>
        <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm py-8 mt-8">
          <div className="max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; 2026 Cosmo Base. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  )
}
