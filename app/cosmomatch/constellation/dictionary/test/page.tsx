// app/cosmomatch/constellation/dictionary/page.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Constellation, getConstellations } from "@/data/CMconstellation"
import { Loader2, ArrowLeft, Telescope, X, ChevronRight, Info } from "lucide-react"

export default function DictionaryIndexPage() {
  const [constellations, setConstellations] = useState<Constellation[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentFilter, setCurrentFilter] = useState<string>("今月の空")
  
  // タップされた星座の情報を保持するステート
  const [selectedConstellation, setSelectedConstellation] = useState<Constellation | null>(null)

  useEffect(() => {
    getConstellations().then((data) => {
      setConstellations(data);
      setIsLoaded(true);
    });
    // 初期表示を「今の月」の空にする
    const currentMonthNum = new Date().getMonth() + 1;
    setCurrentFilter(`${currentMonthNum}月`);
  }, []);

  // slugから「常に同じX, Y座標（10%〜90%）」を生成する関数（仮の座標）
  const getCoordinates = (slug: string) => {
    let hashX = 0, hashY = 0;
    for (let i = 0; i < slug.length; i++) {
      hashX = slug.charCodeAt(i) + ((hashX << 5) - hashX);
      hashY = slug.charCodeAt(slug.length - 1 - i) + ((hashY << 5) - hashY);
    }
    const x = 10 + (Math.abs(hashX) % 80);
    const y = 10 + (Math.abs(hashY) % 80);
    return { x, y };
  }

  // フィルターされた星座リストと、その座標を計算
  const mapData = useMemo(() => {
    let filtered = constellations;
    
    if (currentFilter.includes("月")) {
      filtered = constellations.filter(c => c.season.includes(currentFilter) || (c.season.includes("春") && currentFilter === "4月") || (c.season.includes("夏") && currentFilter === "8月") || (c.season.includes("秋") && currentFilter === "10月") || (c.season.includes("冬") && currentFilter === "1月"));
    } else if (currentFilter === "通年・北天") {
      filtered = constellations.filter(c => c.season.includes("通年") || c.season.includes("北"));
    } else if (currentFilter === "南天") {
      filtered = constellations.filter(c => c.season.includes("南") || c.season.includes("見えな"));
    } else if (currentFilter === "すべて") {
      filtered = constellations;
    }

    // 座標を付与
    const withCoords = filtered.map(c => ({
      ...c,
      coords: getCoordinates(c.slug)
    }));

    // 星同士を繋ぐための線のデータを生成（近い星同士を繋ぐ簡単なロジック）
    const lines: { x1: number, y1: number, x2: number, y2: number }[] = [];
    if (withCoords.length > 1) {
      for (let i = 0; i < withCoords.length - 1; i++) {
        lines.push({
          x1: withCoords[i].coords.x,
          y1: withCoords[i].coords.y,
          x2: withCoords[i+1].coords.x,
          y2: withCoords[i+1].coords.y,
        });
      }
    }

    return { stars: withCoords, lines };
  }, [constellations, currentFilter]);


  if (!isLoaded) {
    return (
      <ContentPageLayout title="星座図鑑" level={1} levelTitle="" logo="CosmoMatch">
        <div className="max-w-md mx-auto py-32 flex flex-col items-center justify-center animate-in fade-in">
          <Loader2 className="w-12 h-12 text-accent animate-spin mb-6" />
          <p className="text-muted-foreground font-bold">星空のマップを展開中...</p>
        </div>
      </ContentPageLayout>
    )
  }

  // 月切り替え用のタブ配列
  const tabs = [
    "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", "通年・北天", "南天"
  ];

  return (
    <ContentPageLayout title="星座図鑑" level={1} levelTitle="" logo="CosmoMatch">
      <div className="max-w-5xl mx-auto pb-10 animate-in fade-in duration-700">
        
        {/* ヘッダー */}
        <div className="mb-6 pt-4">
          <Link href="/cosmomatch/constellation" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> 診断トップに戻る
          </Link>
          <h2 className="text-3xl font-extrabold text-foreground mb-3 flex items-center gap-3">
            <Telescope className="w-7 h-7 text-primary" />
            Cosmo Base プラネタリウム
          </h2>
          <p className="text-muted-foreground text-sm">
            月ごとの星空マップです。光る星をタップして、星座の物語に触れてみましょう。
          </p>
        </div>

        {/* 季節・月のセレクター（横スクロール） */}
        <div className="flex overflow-x-auto pb-4 mb-4 gap-2 scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => {
                setCurrentFilter(tab);
                setSelectedConstellation(null); // 切り替えたら選択解除
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                currentFilter === tab 
                ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                : 'bg-secondary/50 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ★ プラネタリウム・ビューポート（星空マップ） */}
        <div className="relative w-full h-[600px] md:h-[700px] bg-[#02020a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          
          {/* 背景の天の川グラデーション */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
            <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[200px] bg-accent/20 rounded-full blur-[120px]" />
          </div>

          {/* 方角のガイドテキスト（デザイン用） */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-white/30 tracking-widest font-bold">NORTH</div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white/30 tracking-widest font-bold">SOUTH</div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-white/30 tracking-widest font-bold -rotate-90">EAST</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/30 tracking-widest font-bold rotate-90">WEST</div>

          {/* 星を繋ぐ線（SVG） */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            {mapData.lines.map((line, idx) => (
              <line 
                key={idx} 
                x1={`${line.x1}%`} y1={`${line.y1}%`} 
                x2={`${line.x2}%`} y2={`${line.y2}%`} 
                stroke="white" strokeWidth="1" strokeDasharray="4 4" 
              />
            ))}
          </svg>

          {/* インタラクティブな星（ドット） */}
          {mapData.stars.map((c) => {
            const isSelected = selectedConstellation?.slug === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => setSelectedConstellation(c)}
                className="absolute flex flex-col items-center justify-center group z-10 transition-transform hover:scale-125"
                style={{ 
                  left: `${c.coords.x}%`, 
                  top: `${c.coords.y}%`,
                  transform: 'translate(-50%, -50%)' // 中心を合わせる
                }}
              >
                {/* タップ判定を広くするための透明な枠 */}
                <div className="p-4 rounded-full flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isSelected 
                    ? 'bg-accent shadow-[0_0_20px_rgba(0,242,254,1)] scale-150' 
                    : 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] group-hover:bg-primary group-hover:shadow-[0_0_15px_rgba(0,242,254,0.8)]'
                  }`} />
                </div>
                {/* 星の名前（ホバー時 または 選択時に表示） */}
                <span className={`absolute top-8 whitespace-nowrap text-xs font-bold px-2 py-1 rounded bg-black/60 border border-white/10 backdrop-blur-md transition-opacity duration-300 ${
                  isSelected ? 'opacity-100 text-accent' : 'opacity-0 group-hover:opacity-100 text-white/80'
                }`}>
                  {c.name}
                </span>
              </button>
            )
          })}

          {mapData.stars.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm font-bold tracking-widest">
              この条件の星座はありません
            </div>
          )}

          {/* ★ タップした時に表示される詳細ポップアップカード */}
          {selectedConstellation && (
            <div className="absolute bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[400px] bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 z-50">
              <button 
                onClick={() => setSelectedConstellation(null)}
                className="absolute top-3 right-3 p-1 rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex gap-4 items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#000015] border border-white/10 shrink-0 flex items-center justify-center relative">
                  {selectedConstellation.imageUrl ? (
                    <img src={selectedConstellation.imageUrl} alt={selectedConstellation.name} className="w-full h-full object-cover" />
                  ) : null}
                  <span className="absolute text-3xl opacity-50 -z-10">{selectedConstellation.emoji}</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-primary border border-primary/30 px-2 py-0.5 rounded-full inline-block mb-1">
                    {selectedConstellation.season} 見頃
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{selectedConstellation.name}</h3>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                {selectedConstellation.catchCopy}
              </p>
              
              <Link 
                href={`/cosmomatch/constellation/dictionary/${selectedConstellation.slug}`}
                className="flex items-center justify-center w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors gap-2"
              >
                <Info className="w-4 h-4" /> 図鑑ページへ飛ぶ <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </ContentPageLayout>
  )
}