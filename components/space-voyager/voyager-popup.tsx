// components/space-voyager/voyager-popup.tsx
"use client"

import { useState, useEffect } from "react"
import { Award, X, Sparkles, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VoyagerPopup() {
  // ポップアップの表示状態を管理（初期値はtrue）
  const [isOpen, setIsOpen] = useState(true)

  // 画面マウント時に少し遅れて表示させたい場合はuseEffectを使うことも可能です
  // 今回はマウント直後にアニメーション付きで表示されます

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* カード本体 */}
      <div className="relative w-full max-w-md bg-secondary/40 backdrop-blur-xl border border-primary/40 shadow-[0_0_40px_rgba(0,242,254,0.15)] rounded-3xl overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* 背景の装飾グロウ */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        {/* 閉じるボタン */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 p-8 flex flex-col items-center text-center">
          
          {/* アイコン */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
            <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/50 rounded-full">
              <Award className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(0,242,254,0.8)]" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-pulse" />
          </div>

          {/* タイトル */}
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-2 flex items-center justify-center gap-2">
            VOYAGER検定
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-primary to-transparent rounded-full mb-6" />

          {/* メッセージ */}
          <p className="text-lg font-bold text-foreground mb-4 leading-snug">
            新たな宇宙の称号への挑戦が、<br />
            まもなく始まります。
          </p>

          <div className="bg-background/60 border border-border/50 rounded-xl p-4 mb-8 w-full">
            <p className="text-sm font-medium text-primary flex items-center justify-center gap-2">
              <Rocket className="w-4 h-4 shrink-0" />
              <span>
                ※毎日宇宙クイズの回答数が<br className="sm:hidden"/>
                <strong className="text-accent text-lg">20,000件</strong> を超え次第、運営を開始いたします！
              </span>
            </p>
          </div>

          {/* アクションボタン */}
          <Button 
            onClick={() => setIsOpen(false)}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow h-12 rounded-full font-bold text-base transition-transform active:scale-95"
          >
            楽しみに待つ
          </Button>

        </div>
      </div>
    </div>
  )
}