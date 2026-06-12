// components/spacetype-detail-list.tsx
"use client";

import Link from "next/link"
import { ExternalLink, Search, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"

const FULL_TYPES = [
  { id: "RVXI", typeTitle: "宇宙ロマン志向", roleName: "夢想家タイプ", catchphrase: "宇宙を“楽しむ才能”を持っている人", color: "#D1B3E8", emoji: "🌌", noteUrl: "nce1b2d13ffba" },
  { id: "RVXS", typeTitle: "未来観察志向", roleName: "観測者タイプ", catchphrase: "宇宙の“未来を見届ける”人", color: "#BCA2DC", emoji: "🌕", noteUrl: "n9bcf0ea435fa" },
  { id: "RVMI", typeTitle: "天体愛好志向", roleName: "探訪者タイプ", catchphrase: "宇宙の“美しさを発見する”人", color: "#E4C3F0", emoji: "🪐", noteUrl: "nfd1a6d44e08e" },
  { id: "RVMS", typeTitle: "探査共感志向", roleName: "見守り手タイプ", catchphrase: "宇宙への“挑戦を応援する”人", color: "#C5B9D6", emoji: "🌠", noteUrl: "n425e90388cf0" },
  { id: "RAXI", typeTitle: "宇宙探求志向", roleName: "探求者タイプ", catchphrase: "宇宙の“謎を深掘りする”人", color: "#F2F2C4", emoji: "🛸", noteUrl: "nd4786982c7a4" },
  { id: "RAXS", typeTitle: "宇宙伝道志向", roleName: "語り部タイプ", catchphrase: "宇宙の“面白さを翻訳する”人", color: "#F5E69C", emoji: "🎙️", noteUrl: "n8adc260aef46" },
  { id: "RAMI", typeTitle: "趣味没頭志向", roleName: "職人タイプ", catchphrase: "宇宙への愛を“形にする”人", color: "#E8E8B6", emoji: "📸", noteUrl: "n63161e14ddd4" },
  { id: "RAMS", typeTitle: "宇宙カルチャー志向", roleName: "仕掛け人タイプ", catchphrase: "宇宙で“熱狂を生み出す”人", color: "#FCE877", emoji: "🎉", noteUrl: "ned8d2501350f" },
  { id: "PVXI", typeTitle: "宇宙教養志向", roleName: "学び手タイプ", catchphrase: "宇宙を“教養として吸収する”人", color: "#96CE9C", emoji: "📖", noteUrl: "n1df477d8ef83" },
  { id: "PVXS", typeTitle: "産業分析志向", roleName: "分析者タイプ", catchphrase: "宇宙を“構造で理解する”人", color: "#72B879", emoji: "🧩", noteUrl: "n69df42dedef4" },
  { id: "PVMI", typeTitle: "最新テック志向", roleName: "追跡者タイプ", catchphrase: "宇宙の“最前線を追う”人", color: "#A8DCAE", emoji: "📡", noteUrl: "n61cdda622097" },
  { id: "PVMS", typeTitle: "社会応用志向", roleName: "つなぎ手タイプ", catchphrase: "宇宙と社会の“架け橋になる”人", color: "#8BCA83", emoji: "🤝", noteUrl: "nfa5188a43e7e" },
  { id: "PAXI", typeTitle: "宇宙キャリア志向", roleName: "開拓者タイプ", catchphrase: "宇宙で“道を切り拓く”人", color: "#76C5E8", emoji: "🧭", noteUrl: "na83781965fb6" },
  { id: "PAXS", typeTitle: "産業推進志向", roleName: "推進者タイプ", catchphrase: "宇宙産業を“前に進める”人", color: "#9AD4EE", emoji: "🏁", noteUrl: "ned5b5e70b522" },
  { id: "PAMI", typeTitle: "技術開発志向", roleName: "創り手タイプ", catchphrase: "宇宙の未来を“実装する”人", color: "#6CB6D9", emoji: "🔧", noteUrl: "n44568e50d40f" },
  { id: "PAMS", typeTitle: "社会課題解決志向", roleName: "実装者タイプ", catchphrase: "宇宙を“社会課題に使う”人", color: "#5AADD6", emoji: "🌐", noteUrl: "n68c931f9739d" }
];

export function SpaceTypeDetailList() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* ヒーローセクション */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-primary/20 rounded-full mb-4">
          <Search className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          すべての宇宙タイプを知る
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          宇宙タイプ診断には、サクッと分かる「簡易版（4分類）」と、より深く行動特性を分析する「完全版（16分類）」があります。気になるタイプを見つけて、周りの友達と見比べてみましょう。
        </p>
      </div>

      {/* ページ遷移用タブ */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-secondary/30 p-1.5 rounded-full border border-border/50">
          <Link 
            href="/type/content/list" 
            className="px-8 py-3 rounded-full text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
          >
            簡易版（4タイプ）
          </Link>
          <div className="px-8 py-3 rounded-full text-sm font-bold bg-accent text-accent-foreground shadow-lg shadow-accent/25 cursor-default">
            完全版（16タイプ）
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FULL_TYPES.map((type) => (
            <a
              key={type.id}
              href={`https://note.com/cosmo_base/n/${type.noteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <GlassCard className="h-full p-5 border border-border/40 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none transition-opacity group-hover:opacity-20" style={{ backgroundColor: type.color }} />

                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="text-3xl filter drop-shadow-md">{type.emoji}</div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>

                <div className="relative z-10">
                  <p className="text-xs font-bold mb-1" style={{ color: type.color }}>{type.roleName}</p>
                  <h3 className="text-base font-bold text-foreground mb-2 leading-tight">{type.typeTitle}</h3>
                  <p className="text-[11px] text-muted-foreground leading-snug">「{type.catchphrase}」</p>
                </div>
              </GlassCard>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/type/detail">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 glow h-14 px-8 rounded-full font-bold text-base shadow-lg shadow-accent/20">
              完全版診断を受けてみる
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}