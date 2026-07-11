import type {
  GlossaryTerm,
  DifficultyLevel,
  CategoryLarge,
  GlossaryStatus,
} from "@/data/glossary"

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vREYAYZ8Rj2WMeCdvOleh8xoWlPlA5UZ5Ijr3SVxhxe_FAafTUHkQiPfWpHDGYM6rsahZOio82umrY6/pub?gid=0&single=true&output=csv"

function parseDifficulty(val: string): DifficultyLevel {
  if (val.startsWith("★★★")) return 3
  if (val.startsWith("★★")) return 2
  return 1
}

// RFC-4180 compliant CSV line parser
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}

function splitList(val: string): string[] {
  return val
    ? val
        .split(/[,、]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : []
}

let cachedTerms: GlossaryTerm[] | null = null

export async function fetchGlossaryTerms(): Promise<GlossaryTerm[]> {
  if (cachedTerms) return cachedTerms

  try {
    const res = await fetch(SHEET_CSV_URL, { cache: "no-store" })
    if (!res.ok) {
      console.warn(`[glossary] CSV fetch failed: ${res.status}`)
      return []
    }

    const text = await res.text()
    const lines = text.split(/\r?\n/).filter((l) => l.trim())
    if (lines.length < 2) return []

    // Skip header row (index 0)
    // Columns: id,term,kana,english,category_large,category_medium,category_small,
    //          difficulty,text_lv1,text_lv2,text_lv3,status,credit,
    //          aliases,internal,related,opposite,similar,image
    const terms: GlossaryTerm[] = []

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i])
      // id is col[0] (empty), term is col[1]
      const [
        ,
        term,
        kana,
        english,
        categoryLarge,
        categoryMedium,
        categorySmall,
        difficulty,
        textLv1,
        textLv2,
        textLv3,
        status,
        credit,
        aliases,
        internal,
        related,
        opposite,
        similar,
      ] = cols

      const termStr = term?.trim()
      if (!termStr) continue

      const kanaStr = kana?.trim() || ""
      // slug: use kana reading (hiragana), unique per term
      const slug = kanaStr || termStr

      terms.push({
        slug,
        term: termStr,
        kana: kanaStr,
        english: english?.trim() || "",
        aliases: splitList(aliases || ""),
        categoryLarge: (categoryLarge?.trim() || "宇宙輸送・ロケット") as CategoryLarge,
        categoryMedium: categoryMedium?.trim() || "",
        categorySmall: categorySmall?.trim() || "",
        difficulty: parseDifficulty(difficulty?.trim() || ""),
        textLv1: textLv1?.trim() || undefined,
        textLv2: textLv2?.trim() || undefined,
        textLv3: textLv3?.trim() || undefined,
        internal: splitList(internal || ""),
        related: splitList(related || ""),
        opposite: splitList(opposite || ""),
        similar: splitList(similar || ""),
        status: (status?.trim() || "未着手") as GlossaryStatus,
        credit: credit?.trim() || "Cosmo Base運営",
      })
    }

    cachedTerms = terms
    return terms
  } catch (err) {
    console.warn("[glossary] Failed to fetch CSV:", err)
    return []
  }
}

export function getTermBySlug(
  terms: GlossaryTerm[],
  slug: string
): GlossaryTerm | undefined {
  return terms.find((t) => t.slug === slug)
}

export function getRelatedTerms(
  terms: GlossaryTerm[],
  term: GlossaryTerm
): GlossaryTerm[] {
  const names = new Set([
    ...(term.related ?? []),
    ...(term.internal ?? []),
    ...(term.similar ?? []),
  ])
  return terms.filter(
    (t) =>
      t.slug !== term.slug &&
      (names.has(t.term) || t.aliases?.some((a) => names.has(a)))
  )
}
