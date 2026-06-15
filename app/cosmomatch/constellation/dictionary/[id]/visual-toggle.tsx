// app/cosmomatch/constellation/dictionary/[id]/visual-toggle.tsx
"use client"

import { useState } from "react"
import { Image as ImageIcon, Sparkles } from "lucide-react"
// ★ 先ほど作ったSVGデータファイルをインポート
import { ConstellationSVGs } from "@/data/CMconstellationSVG"

interface VisualToggleProps {
  slug: string; // SVG引き当て用に追加
  name: string;
  emoji: string;
  imageUrl: string;
}

export function VisualToggle({ slug, name, emoji, imageUrl }: VisualToggleProps) {
  const [view, setView] = useState<'image' | 'svg'>('image')

  // ★ slugに一致するSVGデータを探す。なければ 'default' を使用
  const svgContent = ConstellationSVGs[slug] || ConstellationSVGs["default"];

  return (
    <div className="flex flex-col items-center sm:items-end gap-3 z-40">
      {/* 切り替えボタン */}
      <div className="flex bg-background/80 backdrop-blur-sm rounded-full p-1 border border-border/50 shadow-sm">
        <button 
          onClick={() => setView('image')} 
          className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all flex items-center gap-1 ${view === 'image' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <ImageIcon className="w-3 h-3" /> 画像
        </button>
        <button 
          onClick={() => setView('svg')} 
          className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all flex items-center gap-1 ${view === 'svg' ? 'bg-accent text-accent-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Sparkles className="w-3 h-3" /> 星の並び
        </button>
      </div>

      {/* 表示エリア */}
      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-center overflow-hidden relative shadow-inner">
        {view === 'image' ? (
          imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover animate-in fade-in duration-300" />
          ) : (
            <div className="text-muted-foreground text-xs flex flex-col items-center gap-2">
              <ImageIcon className="w-6 h-6 opacity-50" />
              <span>No Image</span>
            </div>
          )
        ) : (
          // SVG（星の並び）表示モード
          <div className="absolute inset-0 flex items-center justify-center bg-[#000022] animate-in fade-in duration-300 overflow-hidden">
            {/* ★ 外部ファイルから持ってきたSVGパスを描画 */}
            <svg viewBox="0 0 100 100" className="w-full h-full p-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">
              {svgContent}
            </svg>
            
            {/* 装飾用の星 */}
            <Sparkles className="absolute top-2 right-2 text-accent w-4 h-4 opacity-30" />
            <Sparkles className="absolute bottom-4 left-4 text-primary w-3 h-3 opacity-20" />
          </div>
        )}
      </div>
    </div>
  )
}