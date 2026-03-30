"use client"

import Image from "next/image"
import { StarBackground } from "@/components/star-background"
import { SiteHeader } from "@/components/site-header"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 1. フッター用のロゴを直接インポートする（最強の解決策）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import footerLogo from "../public/images/cosmo-base-logo.png"

interface ContentPageLayoutProps {
  children: React.ReactNode
  title: string
  level: number
  levelTitle: string
  logo: string
}

export function ContentPageLayout({
  children,
  title,
  level,
  levelTitle,
  logo
}: ContentPageLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <StarBackground />

      <main className="relative z-10">
        {/* Shared Header with hamburger menu */}
        <SiteHeader />

        {/* Spacer for fixed header */}
        <div className="h-16" />

        {/* Header Section */}
        <div className="max-w-5xl mx-auto px-4 pt-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">

          {/* Text Area (Badge & Title) */}
          <div className="flex-1">
            {level > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
                  Level {level}
                </span>
                <span className="text-muted-foreground text-sm">{levelTitle}</span>
              </div>
            )}

            {/* Page Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance" suppressHydrationWarning>
              {title}
            </h1>
          </div>

          {/* Image Area */}
          <div className="ml-10 flex-shrink-0 mb-6">
            <Image 
              src={`/${logo}_logo.png`} 
              alt={`${logo}logo`} 
              width={200}
              height={96}
              className="h-24 w-auto object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 pb-16">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm py-8">
          <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-4">
            {/* ★ 3. フッターのロゴをインポート方式に書き換え */}
            <Image
              src={footerLogo}
              alt="Cosmo Base"
              className="h-8 w-auto opacity-70"
            />
            <p className="text-sm text-muted-foreground">
              &copy; 2026 Cosmo Base. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
