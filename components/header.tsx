// components/header.tsx
import Image from "next/image"
import Link from "next/link"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"

// ★ 1. 画像ファイルを「直接インポート」する（これが最強の解決策です）
// ※ components フォルダから見て public フォルダの中を指定します
import logoImg from "../public/images/cosmo-base-logo.png"

export function Header() {
  return (
    <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          {/* ★ 2. src にインポートした変数（logoImg）を直接渡す */}
          <Image
            src={logoImg}
            alt="Cosmo Base"
            className="h-12 w-auto"
            // インポート方式の場合、Next.jsが元画像のサイズを自動計算してくれるため、
            // width と height の指定すら不要になります！
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
