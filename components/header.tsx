import Image from "next/image"
import Link from "next/link"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202026-03-16%20131704-ezTYVUhhNXEETW5qctCrrvK9KtrEmE.png"
            alt="Cosmo Base"
            width={180}
            height={60}
            className="h-12 w-auto"
          />
        </div>
        <Button asChild variant="outline" className="gap-2 border-border/50 hover:bg-secondary/50">
          <Link href="https://fsifofficial.github.io/CosmoBase/partners" target="_blank">
            <Users className="h-4 w-4" />
            パートナー一覧
          </Link>
        </Button>
      </div>
    </header>
  )
}
