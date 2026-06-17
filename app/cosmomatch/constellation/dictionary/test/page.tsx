"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Constellation, getConstellations } from "@/data/CMconstellation"
import { Loader2, ArrowLeft, Telescope, X, ChevronRight, Info, ChevronLeft } from "lucide-react"

// 全天の幅と、1ヶ月あたりの移動幅の定数
const TOTAL_SKY_WIDTH = 300; 
const MONTH_WIDTH = 25; 

// slugから一定の数値を出すためのヘルパー
function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function DictionaryIndexPage() {
  const [constellations, setConstellations] = useState<Constellation[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedConstellation, setSelectedConstellation] = useState<Constellation | null>(null)

  // 初期ロード時の月を基準として記憶
  const initialMonth = useMemo(() => new Date().getMonth() + 1, []);
  // 「初期月から何ヶ月分移動したか」を管理することで、無限回転を実現
  const [monthOffset, setMonthOffset] = useState(0);

  // 現在画面の中央にある月
  const selectedMonth = ((initialMonth - 1 + monthOffset) % 12 + 12) % 12 + 1;

  useEffect(() => {
    getConstellations().then((data) => {
      setConstellations(data);
      setIsLoaded(true);
    });
  }, []);

  // 特定の月に最短距離で回転移動する関数
  const goToMonth = (targetMonth: number) => {
    let diff = targetMonth - selectedMonth;
    if (diff > 6) diff -= 12;
    if (diff < -5) diff += 12;
    setMonthOffset(prev => prev + diff);
    setSelectedConstellation(null);
  }

  // 背景の「名もなき星」を生成
  const staticStars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.1
    }));
  }, []);

  // 【ステップ1】全星座の「絶対座標」を計算し、衝突を回避して配置する
  const celestialMap = useMemo(() => {
    const placed: { x: number, y: number, slug: string }[] = [];
    
    return constellations.map(c => {
      const s = c.season || '';
      let baseY = 50;
      let type: 'seasonal' | 'circumpolar' | 'southern' = 'seasonal';
      
      // Y座標（高さ）のベース決定
      if (s.includes('北') || s.includes('通年')) {
        baseY = 15 + (hashCode(c.slug) % 20); // 15-35%
        type = 'circumpolar';
      } else if (s.includes('南') || s.includes('見えな')) {
        baseY = 75 + (hashCode(c.slug) % 15); // 75-90%
        type = 'southern';
      } else {
        baseY = 40 + (hashCode(c.slug) % 30); // 40-70%
      }

      // X座標（東西）のベース決定
      let baseX = 0;
      const monthMatch = s.match(/(\d+)月/);
      if (monthMatch && type === 'seasonal') {
        const peakMonth = parseInt(monthMatch[1], 10);
        // 月ごとの基本位置にランダムノイズを足す
        baseX = (peakMonth - 1) * MONTH_WIDTH + (hashCode(c.slug + "x") % 15 - 7.5);
      } else {
        baseX = hashCode(c.slug + "x") % TOTAL_SKY_WIDTH;
      }

      // 衝突回避アルゴリズム（スパイラルサーチ）
      let finalX = baseX;
      let finalY = baseY;
      let angle = 0;
      let radius = 0;
      const MIN_DIST = 6.5; // 星同士が重ならない最低距離（%）
      
      while(true) {
        finalY = Math.max(10, Math.min(90, baseY + radius * Math.sin(angle)));
        finalX = (baseX + radius * Math.cos(angle) * 1.5) % TOTAL_SKY_WIDTH; 
        if (finalX < 0) finalX += TOTAL_SKY_WIDTH;

        const collision = placed.find(p => {
          let dx = Math.abs(p.x - finalX);
          if (dx > TOTAL_SKY_WIDTH / 2) dx = TOTAL_SKY_WIDTH - dx; // ループ空間の距離計算
          const dy = p.y - finalY;
          return Math.sqrt(dx * dx + dy * dy) < MIN_DIST;
        });

        if (!collision) break; // 衝突がなければ配置確定
        
        angle += Math.PI / 4;
        radius += 0.5;
        if (radius > 30) break; // 安全装置
      }
      
      placed.push({ x: finalX, y: finalY, slug: c.slug });

      // 星座の骨組み（線）
      const lines = [];
      const numStars = 3 + (hashCode(c.slug) % 3);
      for (let i = 0; i < numStars; i++) {
        lines.push({
          dx: (hashCode(c.slug + i) % 20 - 10) * 0.4,
          dy: (hashCode(c.slug + i + "y") % 20 - 10) * 0.4,
        });
      }

      return { ...c, absoluteX: finalX, y: finalY, lines, type };
    });
  }, [constellations]);

  // 【ステップ2】現在のカメラ位置に基づいて、画面上の座標(screenX)を計算する
  const displayStars = useMemo(() => {
    // カメラの現在地（月を進めるごとに右へ移動する）
    const cameraX = (initialMonth - 1 + monthOffset) * MONTH_WIDTH;

    return celestialMap.map(c => {
      // カメラからの相対距離
      let dx = c.absoluteX - cameraX;
      // -150 〜 +150 の範囲に正規化（最短距離）
      dx = ((dx + TOTAL_SKY_WIDTH/2) % TOTAL_SKY_WIDTH + TOTAL_SKY_WIDTH) % TOTAL_SKY_WIDTH - TOTAL_SKY_WIDTH/2;
      
      // 星空は東(左)から昇り、西(右)へ沈むため、カメラが進むと星は左へズレる
      const screenX = 50 - dx; 

      let status: 'current' | 'adjacent' | 'background' = 'background';
      const absDx = Math.abs(dx);
      
      // 画面中央付近の判定
      if (absDx <= MONTH_WIDTH * 0.8) {
        status = 'current'; // 主役（今月）
      } else if (absDx <= MONTH_WIDTH * 1.8) {
        status = 'adjacent'; // 脇役（前後1ヶ月）
      }

      // 通年・南天は常にうっすら表示
      if (c.type === 'circumpolar' || c.type === 'southern') {
         if (absDx <= MONTH_WIDTH * 2.5) status = 'adjacent';
      }

      return { ...c, screenX, status };
    });
  }, [celestialMap, initialMonth, monthOffset]);


  if (!isLoaded) {
    return (
      <ContentPageLayout title="星座図鑑" level={1} levelTitle="" logo="CosmoMatch">
        <div className="max-w-md mx-auto py-32 flex flex-col items-center justify-center animate-in fade-in">
          <Loader2 className="w-12 h-12 text-accent animate-spin mb-6" />
          <p className="text-muted-foreground font-bold">天球の座標を計算中...</p>
        </div>
      </ContentPageLayout>
    )
  }

  return (
    <ContentPageLayout title="星座図鑑" level={1} levelTitle="" logo="CosmoMatch">
      <div className="max-w-6xl mx-auto pb-10 animate-in fade-in duration-700">
        
        <div className="mb-6 pt-4 px-2 sm:px-0">
          <Link href="/cosmomatch/constellation" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> 診断トップに戻る
          </Link>
          
          <div className="mb-4">
            <h2 className="text-3xl font-extrabold text-foreground mb-2 flex items-center gap-3">
              <Telescope className="w-7 h-7 text-primary" />
              プラネタリウム図鑑
            </h2>
            <p className="text-muted-foreground text-sm">
              操作パネルで月を進めると、星空が東から西へ巡ります。光る星座をタップしてください。
            </p>
          </div>

          {/* ★ 常時表示される月切り替えナビゲーション */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between bg-secondary/30 p-2 sm:p-3 rounded-2xl border border-border/50 shadow-inner">
            <button 
              onClick={() => goToMonth(selectedMonth - 1)} 
              className="flex items-center justify-center gap-1 px-3 py-2 bg-background hover:bg-secondary rounded-xl text-sm font-bold text-foreground transition-colors shrink-0"
            >
              <ChevronLeft className="w-4 h-4" /> 前の月
            </button>
            
            <div className="flex flex-wrap justify-center gap-1.5 flex-1 px-2">
              {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                <button
                  key={m}
                  onClick={() => goToMonth(m)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                    selectedMonth === m 
                    ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                    : 'bg-background hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40'
                  }`}
                >
                  {m}月
                </button>
              ))}
            </div>

            <button 
              onClick={() => goToMonth(selectedMonth + 1)} 
              className="flex items-center justify-center gap-1 px-3 py-2 bg-background hover:bg-secondary rounded-xl text-sm font-bold text-foreground transition-colors shrink-0"
            >
              次の月 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- プラネタリウム本体 --- */}
        <div className="relative w-full h-[650px] md:h-[750px] bg-[#02020a] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
          
          {/* 背景の天の川グラデーション */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
            <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[200px] bg-accent/20 rounded-full blur-[120px]" />
          </div>

          {/* 方角ラベル */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/20 tracking-[1em] font-bold z-0">NORTH</div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/20 tracking-[1em] font-bold z-0">SOUTH</div>
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] text-white/20 tracking-[1em] font-bold -rotate-90 z-0">EAST</div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-white/20 tracking-[1em] font-bold rotate-90 z-0">WEST</div>
          
          {/* 南天エリアの地平線演出 */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none opacity-80 z-0" />

          {/* 1. 静止した星々 */}
          {staticStars.map(s => (
            <div key={s.id} className="absolute rounded-full bg-white z-0" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, opacity: s.opacity }} />
          ))}

          {/* 2. 星座の描画 */}
          {displayStars.map((c) => {
            // 画面の少し外まではレンダリングしておく（スライド時のため）
            if (c.screenX < -20 || c.screenX > 120) return null;

            const isCurrent = c.status === 'current';
            const isAdjacent = c.status === 'adjacent';
            const isSelected = selectedConstellation?.slug === c.slug;

            return (
              <div 
                key={c.slug} 
                className="absolute transition-all duration-1000 ease-in-out"
                style={{ left: `${c.screenX}%`, top: `${c.y}%` }}
              >
                {/* 星座線 (SVG) */}
                <svg className="absolute overflow-visible pointer-events-none" style={{ transform: 'translate(-50%, -50%)' }}>
                  {c.lines.map((l, i) => (
                    <line key={i} x1="0" y1="0" x2={`${l.dx * 10}`} y2={`${l.dy * 10}`} 
                          stroke={isCurrent ? "rgba(0,242,254,0.3)" : isAdjacent ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"} 
                          strokeWidth={isCurrent ? "1.5" : "1"} />
                  ))}
                </svg>

                {/* メインの星ボタン */}
                <button
                  onClick={() => setSelectedConstellation(c)}
                  className={`group relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
                    isCurrent ? 'scale-110 opacity-100 z-30' : 
                    isAdjacent ? 'scale-90 opacity-70 hover:opacity-100 z-20' : 
                    'scale-50 opacity-20 hover:opacity-100 z-10'
                  }`}
                >
                  <div className={`rounded-full transition-all duration-500 flex items-center justify-center ${
                    isSelected ? 'w-5 h-5 bg-accent shadow-[0_0_20px_#00f2fe]' : 
                    isCurrent ? 'w-4 h-4 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:bg-primary' : 
                    isAdjacent ? 'w-3 h-3 bg-white/80 hover:bg-white' : 
                    'w-2 h-2 bg-white/50 hover:bg-white'
                  }`}>
                    {/* 中心点 */}
                    <div className="w-1 h-1 bg-black/20 rounded-full" />
                  </div>
                  
                  {/* 星座名 */}
                  <span className={`absolute top-6 whitespace-nowrap text-[10px] font-bold px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 transition-all duration-300 pointer-events-none ${
                    isSelected ? 'opacity-100 text-accent border-accent/50 scale-110 z-50' : 
                    isCurrent ? 'opacity-100 text-white z-40' : 
                    'opacity-0 group-hover:opacity-100 text-white/80 z-30'
                  }`}>
                    {c.name}
                  </span>
                </button>
              </div>
            );
          })}

          {/* 3. 詳細ポップアップ */}
          {selectedConstellation && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] bg-background/95 backdrop-blur-2xl border border-border/50 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-8 z-50">
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