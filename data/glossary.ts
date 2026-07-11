export type DifficultyLevel = 1 | 2 | 3
export type CategoryLarge =
  | "宇宙輸送・ロケット"
  | "人工衛星・探査機"
  | "軌道・宇宙環境"
  | "宇宙ビジネス・法規制"
  | "衛星データ・利用"
  | "天文学・宇宙科学"

export type GlossaryStatus = "未着手" | "AI生成済" | "レビュー中" | "公開済"

export interface GlossaryTerm {
  slug: string
  term: string
  kana: string
  english: string
  aliases?: string[]
  categoryLarge: CategoryLarge
  categoryMedium: string
  categorySmall: string
  difficulty: DifficultyLevel
  textLv1?: string
  textLv2?: string
  textLv3?: string
  internal?: string[]
  related?: string[]
  opposite?: string[]
  similar?: string[]
  status: GlossaryStatus
  credit?: string
}

export const CATEGORY_LARGE_LIST: CategoryLarge[] = [
  "宇宙輸送・ロケット",
  "人工衛星・探査機",
  "軌道・宇宙環境",
  "宇宙ビジネス・法規制",
  "衛星データ・利用",
  "天文学・宇宙科学",
]

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  1: "★☆☆ 初級",
  2: "★★☆ 中級",
  3: "★★★ 上級",
}
