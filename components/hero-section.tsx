import fs from "fs"
import path from "path"
import { AutoSlider } from "@/components/auto-slider"
import { fetchShittokuData } from "@/data/shittoku"

const SHITTOKU_EXTENSIONS = ["png", "jpeg", "jpg", "webp"]

function findShittokuImageSrc(id: number): string | null {
  for (const ext of SHITTOKU_EXTENSIONS) {
    if (fs.existsSync(path.join(process.cwd(), "public", "shittoku", `${id}.${ext}`))) {
      return `/shittoku/${id}.${ext}`
    }
  }
  return null
}

export async function HeroSection() {
  const events = await fetchShittokuData()
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }))
  today.setHours(0, 0, 0, 0)

  // 画像探索はテーマの有無に関わらず全イベントを対象にする
  // （テーマ未入力でも画像が準備済みのケースに対応）
  const searchOrder = [
    ...events
      .filter(e => e.parsedDate >= today && e.eventId > 0)
      .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime()),
    ...events
      .filter(e => e.parsedDate < today && e.eventId > 0)
      .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime()),
  ]

  let shittokuImageSrc: string | null = null
  for (const event of searchOrder) {
    const src = findShittokuImageSrc(event.eventId)
    if (src) {
      shittokuImageSrc = src
      break
    }
  }

  return (
    <section className="relative px-4 pt-24 pb-8">
      <div className="max-w-5xl mx-auto">
        <AutoSlider shittokuImageSrc={shittokuImageSrc} />
      </div>
    </section>
  )
}
