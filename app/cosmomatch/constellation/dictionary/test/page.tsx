// app/cosmomatch/constellation/dictionary/page.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Constellation, getConstellations } from "@/data/CMconstellation"
import { Loader2, ArrowLeft, Telescope, X, ChevronRight, Info, Sparkles } from "lucide-react"

export default function DictionaryIndexPage() {
  const [constellations, setConstellations] = useState<Constellation[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const [selectedConstellation, setSelectedConstellation] = useState<Constellation | null>(null)

  useEffect(() => {
    getConstellations().then((data) => {
      setConstellations(data);
      setIsLoaded(true);
    });
  }, []);

  // 背景の「名もなき星」を生成（1回だけ計算）
  const staticStars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2,
      opacity: Math.random() * 0.5 + 0.1
    }));
  }, []);

  // 星座の座標と骨組みを計算
  const starMap = useMemo(() => {
    return constellations.map(c => {
      const s = c.season || '';
      let x = 0;
      let y = 0;
      let type: 'seasonal' | 'circumpolar' | 'southern' = 'seasonal';

      // --- 1. Y座標（高さ）の決定 ---
      if (s.includes('北') || s.includes('通年')) {
        y = 10 + (hashCode(c.slug) % 15); // 上部 10-25%
        type = 'circumpolar';
      } else if (s.includes('南') || s.includes('見えな')) {
        y = 80 + (hashCode(c.slug) % 10); // 下部 80-90%
        type = 'southern';
      } else {
        y = 35 + (hashCode(c.slug) % 35); // 中央 35-70%
        type = 'seasonal';
      }

      // --- 2. X座標（左右）の決定 ---
      const monthMatch = s.match(/(\d+)月/);
      if (monthMatch && type === 'seasonal') {
        const peakMonth = parseInt(monthMatch[1], 10);
        let diff = peakMonth - selectedMonth;
        if (diff < -6) diff += 12;
        if (diff > 5) diff -= 12;
        
        // 選択月が中央(50%)、前後1ヶ月につき15%ずらす
        x = 50 + (diff * 15) + (hashCode(c.slug + "x") % 10 - 5);
      } else {
        x = 10 + (hashCode(c.slug + "fixed") % 80);
      }

      // --- 3. 星座の形（骨組み）の生成 ---
      const lines = [];
      const numStars = 3 + (hashCode(c.slug) % 3); // 3〜5個の星
      for (let i = 0; i < numStars; i++) {
        lines.push({
          dx: (hashCode(c.slug + i) % 20 - 10) * 0.4, // 中心からのズレ
          dy: (hashCode(c.slug + i + "y") % 20 - 10) * 0.4,
        });
      }

      return { ...c, x, y, lines, type };
    });
  }, [constellations, selectedMonth]);

  if (!isLoaded) {
    return (
      <ContentPageLayout title="星座図鑑" level={1} levelTitle="" logo="CosmoMatch">
        <div className="max-w-md mx-auto py-32 flex flex-col items-center justify-center animate-in fade-in">
          <Loader2 className="w-12 h-12 text-accent animate-spin mb-6" />
          <p className="text-muted-foreground font-bold">満天の星を読み込み中...</p>
        </div>
      </ContentPageLayout>
    )
  }

  return (
    <ContentPageLayout title="星座図鑑" level={1} levelTitle="" logo="CosmoMatch">
      <div className="max-w-6xl mx-auto pb-10 animate-in fade-in duration-700">
        
        <div className="mb-6 pt-4 px-4">
          <Link href="/cosmomatch/constellation" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> 診断トップに戻る
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-foreground mb-2 flex items-center gap-3">
                <Telescope className="w-7 h-7 text-primary" />
                星空マップ
              </h2>
              <p className="text-muted-foreground text-sm">見たい月を選んでください。明るく光るのがその時期の星座です。</p>
            </div>
            {/* 月セレクター */}
            <div className="flex bg-secondary/30 p-1 rounded-xl border border-border/50 overflow-x-auto no-scrollbar">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <button
                  key={m}
                  onClick={() => { setSelectedMonth(m); setSelectedConstellation(null); }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${selectedMonth === m ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {m}月
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- プラネタリウム本体 --- */}
        <div className="relative w-full h-[650px] md:h-[750px] bg-[#02020a] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden cursor-crosshair">
          
          {/* 1. 背景の静止した星々 */}
          {staticStars.map(s => (
            <div key={s.id} className="absolute rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, opacity: s.opacity }} />
          ))}

          {/* 2. 方角ラベル */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/20 tracking-[1em] font-bold">NORTH (ZENITH)</div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/20 tracking-[1em] font-bold">SOUTH (HORIZON)</div>
          
          {/* 南天エリアの地平線演出 */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none opacity-80" />

          {/* 3. 星座の骨組みと光る星 */}
          {starMap.map((c) => {
            const isTarget = c.season.includes(`${selectedMonth}月`) || (c.season.includes("春") && selectedMonth === 4);
            const isSelected = selectedConstellation?.slug === c.slug;
            
            // X座標が画面外(0-100以外)なら描画しない
            if (c.x < -10 || c.x > 110) return null;

            return (
              <div 
                key={c.slug} 
                className="absolute transition-all duration-1000 ease-in-out"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                {/* 星座線 (SVG) */}
                <svg className="absolute overflow-visible pointer-events-none" style={{ transform: 'translate(-50%, -50%)' }}>
                  {c.lines.map((l, i) => (
                    <line key={i} x1="0" y1="0" x2={`${l.dx * 10}`} y2={`${l.dy * 10}`} 
                          stroke={isTarget ? "rgba(0,242,254,0.4)" : "rgba(255,255,255,0.1)"} 
                          strokeWidth={isTarget ? "1.5" : "1"} />
                  ))}
                </svg>

                {/* メインの星ボタン */}
                <button
                  onClick={() => setSelectedConstellation(c)}
                  className={`relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${isTarget ? 'scale-110 opacity-100' : 'scale-75 opacity-30 hover:opacity-60'}`}
                >
                  <div className={`rounded-full transition-all duration-500 ${
                    isSelected ? 'w-4 h-4 bg-accent shadow-[0_0_20px_#00f2fe]' : 
                    isTarget ? 'w-3 h-3 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'w-2 h-2 bg-white'
                  }`} />
                  
                  {/* 星座名（ターゲットまたは選択時のみ） */}
                  {(isTarget || isSelected) && (
                    <span className={`absolute top-6 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm border border-white/10 transition-colors ${isSelected ? 'text-accent border-accent/50' : 'text-white/70'}`}>
                      {c.name}
                    </span>
                  )}
                </button>
              </div>
            );
          })}

          {/* 4. 詳細ポップアップ（前回同様） */}
          {selectedConstellation && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] bg-background/90 backdrop-blur-2xl border border-border/50 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-8 z-50">
              <button onClick={() => setSelectedConstellation(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
              <div className="flex gap-5 items-center mb-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#000015] border border-white/10 shrink-0 flex items-center justify-center relative shadow-inner">
                  {selectedConstellation.imageUrl ? <img src={selectedConstellation.imageUrl} alt="" className="w-full h-full object-cover" /> : null}
                  <span className="absolute text-4xl opacity-30 -z-10">{selectedConstellation.emoji}</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full inline-block mb-1.5 uppercase tracking-wider">{selectedConstellation.season} 見頃</div>
                  <h3 className="text-2xl font-bold text-foreground">{selectedConstellation.name}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed italic">「{selectedConstellation.catchCopy}」</p>
              <Link href={`/cosmomatch/constellation/dictionary/${selectedConstellation.slug}`} className="flex items-center justify-center w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all gap-2 shadow-lg shadow-primary/20">
                <Info className="w-4 h-4" /> 星座図鑑を見る <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </ContentPageLayout>
  )
}

// slugから一定の数値を出すためのヘルパー
function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}