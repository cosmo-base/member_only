import { AutoSlider } from "@/components/auto-slider"
import { fetchNextShittokuEventId } from "@/data/shittoku"

export async function HeroSection() {
  const shittokuImageId = await fetchNextShittokuEventId()

  return (
    <section className="relative px-4 pt-24 pb-8">
      <div className="max-w-5xl mx-auto">
        <AutoSlider shittokuImageId={shittokuImageId} />
      </div>
    </section>
  )
}
