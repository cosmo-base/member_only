import type { ReactNode } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface ContentCardProps {
  icon: ReactNode
  title: string
  description: string
  features?: string[]
  href: string
}

export function ContentCard({ icon, title, description, features = [], href }: ContentCardProps) {
  return (
    <Link href={href} className="block">
      <div className="glass-card rounded-xl p-6 transition-all duration-300 flex flex-col h-full group cursor-pointer hover:scale-[1.02]">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
        </div>
        
        {features.length > 0 && (
          <ul className="space-y-2 flex-1">
            {features.map((feature, index) => (
              <li key={`${title}-feature-${index}`} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span suppressHydrationWarning>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  )
}
