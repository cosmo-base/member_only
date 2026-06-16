"use client"

import { useState } from "react"
import { Image as ImageIcon, Sparkles } from "lucide-react"
import { ConstellationSVGs } from "@/data/CMconstellationSVG"

interface VisualToggleProps {
  slug: string;
  name: string;
  emoji: string;
  imageUrl: string;
  size?: 'default' | 'large'; // ★ サイズ指定を追加
}

export function VisualToggle({ slug, name, emoji, imageUrl, size = 'default' }: VisualToggleProps) {
  const [view, setView] = useState<'image' | 'svg'>('image')

  const svgContent = ConstellationSVGs[slug] || ConstellationSVGs["default"];

  // ★ サイズごとのCSSクラスを定義
  const containerClasses = size === 'large' 
    ? "w-full max-w-[280px] aspect-square rounded-[2rem]" 
    : "w-40 h-40 sm:w-48 sm:h-48 rounded-2xl";
    
  const emojiClasses = size === 'large' ? "text-8xl sm:text-9xl" : "text-6xl sm:text-7xl";

  return (
    <div className={`flex flex-col items-center gap-3 z-40 ${size === 'large' ? 'mx-auto' : 'sm:items-end'}`}>
      
      {/* 切り替えボタン */}
      <div className="flex bg-background/80 backdrop-blur-sm rounded-full p-1.5 border border-border/50 shadow-sm">
        <button 
          onClick={() => setView('image')} 
          className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${view === 'image' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <ImageIcon className="w-3.5 h-3.5" /> 画像
        </button>
        <button 
          onClick={() => setView('svg')} 
          className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${view === 'svg' ? 'bg-accent text-accent-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Sparkles className="w-3.5 h-3.5" /> 星の並び
        </button>
      </div>

      {/* 表示エリア */}
      <div className={`${containerClasses} bg-secondary/30 border border-border/50 flex items-center justify-center overflow-hidden relative shadow-inner`}>
        {view === 'image' ? (
          imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover animate-in fade-in duration-300" />
          ) : (
            <div className="text-muted-foreground text-sm flex flex-col items-center gap-2">
              <ImageIcon className="w-8 h-8 opacity-50" />
              <span>No Image</span>
            </div>
          )
        ) : (
          // SVG表示モード
          <div className="absolute inset-0 flex items-center justify-center bg-[#000022] animate-in fade-in duration-300 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full p-4 drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
              {svgContent}
            </svg>
            <div className={`${emojiClasses} absolute opacity-10 filter blur-sm pointer-events-none`}>{emoji}</div>
            <Sparkles className="absolute top-4 right-4 text-accent w-6 h-6 opacity-40 animate-pulse" />
            <Sparkles className="absolute bottom-6 left-6 text-primary w-4 h-4 opacity-30 animate-pulse delay-300" />
          </div>
        )}
      </div>
    </div>
  )
}