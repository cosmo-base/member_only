// components/content-card.tsx
import Link from "next/link"
import Image, { StaticImageData } from "next/image"
import { ChevronRight, CheckCircle2 } from "lucide-react"

export interface ContentCardProps {
  icon?: React.ReactNode
  logo?: StaticImageData | string | any // ★ 追加: ロゴ画像を受け取る
  title: string
  description: string
  features?: string[]
  // 省略すると準備中（Coming Soon）として、リンクなしで表示する
  href?: string
}

export function ContentCard({ icon, logo, title, description, features, href }: ContentCardProps) {
  const card = (
      <div className={`glass-card rounded-xl p-6 md:p-8 h-full flex flex-col border border-border/50 transition-all duration-300 relative overflow-hidden ${href ? "hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,242,254,0.15)]" : ""}`}>
        
        {/* 背景の装飾グロウ */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:bg-primary/10" />

        {/* ヘッダー部分（ロゴ画像 or 従来のアイコン） */}
        <div className="flex items-center gap-4 mb-5 relative z-10">
          {logo ? (
            <div className="relative h-10 w-40 sm:h-12 sm:w-48 shrink-0">
              <Image 
                src={logo} 
                alt={title} 
                fill 
                className="object-contain object-left transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 transition-colors group-hover:bg-primary/20">
              {icon}
            </div>
          )}
        </div>

        {/* タイトルと説明 */}
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors relative z-10">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow relative z-10">
          {description}
        </p>

        {/* サブ機能のリスト */}
        {features && features.length > 0 && (
          <div className="space-y-2 mb-6 relative z-10">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}

        {/* アクセスボタン（準備中は Coming Soon） */}
        {href ? (
          <div className="mt-auto flex items-center text-sm font-bold text-primary group-hover:text-accent transition-colors relative z-10">
            コンテンツを見る
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        ) : (
          <div className="mt-auto relative z-10">
            <span className="inline-block px-3 py-1 text-sm font-bold rounded-full bg-primary/10 text-primary border border-primary/30">
              Coming Soon
            </span>
          </div>
        )}
        
      </div>
  )

  if (!href) return <div className="block h-full">{card}</div>

  return (
    <Link href={href} className="block group h-full">
      {card}
    </Link>
  )
}