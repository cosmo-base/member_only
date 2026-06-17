"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Constellation, getConstellations } from "@/data/CMconstellation"
import { Loader2, ArrowLeft, Telescope, X, ChevronRight, Info, ChevronLeft, Globe } from "lucide-react"

// ★ 88星座の実際の概算座標（RA: 赤経 0-24h, Dec: 赤緯 -90〜+90度）
const REAL_COORDS: Record<string, {ra: number, dec: number}> = {
  "アンドロメダ座": { ra: 1.0, dec: 40 }, "ポンプ座": { ra: 10.5, dec: -35 }, "ふうちょう座": { ra: 16.0, dec: -75 },
  "みずがめ座": { ra: 22.5, dec: -10 }, "わし座": { ra: 19.5, dec: 3 }, "さいだん座": { ra: 17.5, dec: -55 },
  "おひつじ座": { ra: 2.5, dec: 20 }, "ぎょしゃ座": { ra: 6.0, dec: 42 }, "うしかい座": { ra: 14.5, dec: 30 },
  "かに座": { ra: 8.5, dec: 20 }, "おおいぬ座": { ra: 6.8, dec: -22 }, "こいぬ座": { ra: 7.6, dec: 5 },
  "やぎ座": { ra: 21.0, dec: -20 }, "りゅうこつ座": { ra: 9.0, dec: -60 }, "カシオペヤ座": { ra: 1.0, dec: 60 },
  "ケンタウルス座": { ra: 13.0, dec: -50 }, "ケフェウス座": { ra: 22.0, dec: 70 }, "くじら座": { ra: 1.5, dec: -10 },
  "カメレオン座": { ra: 11.0, dec: -80 }, "コンパス座": { ra: 15.0, dec: -60 }, "はと座": { ra: 5.5, dec: -35 },
  "かみのけ座": { ra: 13.0, dec: 20 }, "かんむり座": { ra: 15.5, dec: 30 }, "からす座": { ra: 12.5, dec: -20 },
  "コップ座": { ra: 11.0, dec: -15 }, "みなみじゅうじ座": { ra: 12.5, dec: -60 }, "はくちょう座": { ra: 20.5, dec: 40 },
  "いるか座": { ra: 20.5, dec: 15 }, "かじき座": { ra: 5.0, dec: -65 }, "りゅう座": { ra: 17.0, dec: 65 },
  "こうま座": { ra: 21.0, dec: 5 }, "エリダヌス座": { ra: 3.5, dec: -30 }, "ろ座": { ra: 2.5, dec: -30 },
  "ふたご座": { ra: 7.0, dec: 20 }, "つる座": { ra: 22.0, dec: -45 }, "ヘルクレス座": { ra: 17.0, dec: 30 },
  "とけい座": { ra: 3.0, dec: -50 }, "うみへび座": { ra: 10.0, dec: -20 }, "みずへび座": { ra: 2.0, dec: -75 },
  "インディアン座": { ra: 21.0, dec: -55 }, "とかげ座": { ra: 22.5, dec: 45 }, "しし座": { ra: 10.5, dec: 15 },
  "こじし座": { ra: 10.0, dec: 35 }, "うさぎ座": { ra: 5.5, dec: -20 }, "てんびん座": { ra: 15.0, dec: -15 },
  "おおかみ座": { ra: 15.0, dec: -45 }, "やまねこ座": { ra: 8.0, dec: 45 }, "こと座": { ra: 18.5, dec: 35 },
  "テーブルさん座": { ra: 5.0, dec: -75 }, "けんびきょう座": { ra: 21.0, dec: -35 }, "いっかくじゅう座": { ra: 7.0, dec: -5 },
  "はえ座": { ra: 12.0, dec: -70 }, "じょうぎ座": { ra: 16.0, dec: -50 }, "はちぶんぎ座": { ra: 21.0, dec: -85 },
  "へびつかい座": { ra: 17.0, dec: 0 }, "オリオン座": { ra: 5.5, dec: 5 }, "くじゃく座": { ra: 19.0, dec: -65 },
  "ペガスス座": { ra: 22.5, dec: 20 }, "ペルセウス座": { ra: 3.0, dec: 45 }, "ほうおう座": { ra: 0.5, dec: -50 },
  "がか座": { ra: 5.0, dec: -50 }, "うお座": { ra: 1.0, dec: 15 }, "みなみのうお座": { ra: 22.5, dec: -30 },
  "とも座": { ra: 7.5, dec: -30 }, "らしんばん座": { ra: 9.0, dec: -30 }, "レチクル座": { ra: 4.0, dec: -60 },
  "や座": { ra: 19.5, dec: 20 }, "いて座": { ra: 19.0, dec: -25 }, "さそり座": { ra: 16.5, dec: -30 },
  "ちょうこくしつ座": { ra: 0.0, dec: -30 }, "たて座": { ra: 18.5, dec: -10 }, "へび座": { ra: 16.0, dec: 5 },
  "ろくぶんぎ座": { ra: 10.0, dec: 0 }, "おうし座": { ra: 4.5, dec: 15 }, "ぼうえんきょう座": { ra: 19.0, dec: -50 },
  "さんかく座": { ra: 2.0, dec: 30 }, "みなみのさんかく座": { ra: 16.0, dec: -65 }, "きょしちょう座": { ra: 22.0, dec: -60 },
  "おおぐま座": { ra: 11.0, dec: 50 }, "こぐま座": { ra: 15.0, dec: 75 }, "ほ座": { ra: 9.0, dec: -45 },
  "おとめ座": { ra: 13.0, dec: -5 }, "とびうお座": { ra: 8.0, dec: -70 }, "こぎつね座": { ra: 20.0, dec: 25 },
  "ちょうこくぐ座": { ra: 4.5, dec: -40 }, "りょうけん座": { ra: 13.0, dec: 40 }, "みなみのかんむり座": { ra: 19.0, dec: -40 },
};

function hashCode(str: string) {
  let hash = 0; for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
}

export default function DictionaryIndexPage() {
  const [constellations, setConstellations] = useState<Constellation[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedConstellation, setSelectedConstellation] = useState<(Constellation & { isSouthern?: boolean, originalSeason?: string }) | null>(null)

  const initialMonth = useMemo(() => new Date().getMonth() + 1, []);
  const [monthOffset, setMonthOffset] = useState(0);

  const selectedMonth = ((initialMonth - 1 + monthOffset) % 12 + 12) % 12 + 1;

  useEffect(() => {
    getConstellations().then((data) => {
      setConstellations(data);
      setIsLoaded(true);
    });
  }, []);

  const goToMonth = (targetMonth: number) => {
    let diff = targetMonth - selectedMonth;
    if (diff > 6) diff -= 12;
    if (diff < -5) diff += 12;
    setMonthOffset(prev => prev + diff);
    setSelectedConstellation(null);
  }

  const shiftSky = (dir: 1 | -1) => {
    setMonthOffset(prev => prev + dir);
    setSelectedConstellation(null);
  }

  const celestialMap = useMemo(() => {
    const placedMain: { ra: number, y: number, name: string }[] = [];
    const placedSouth: { ra: number, y: number, name: string }[] = [];
    
    return constellations.map(c => {
      const coords = REAL_COORDS[c.name] || { ra: (hashCode(c.slug) % 240) / 10, dec: (hashCode(c.slug + "y") % 140) - 50 };
      const { ra, dec } = coords;
      
      const isSouthern = dec < -55;

      let baseY = isSouthern 
        ? (( -55 - dec ) / 35) * 100
        : (( 90 - dec ) / 145) * 100;
      
      let finalRA = ra;
      let finalY = baseY;
      let angle = 0;
      let radius = 0;
      const targetList = isSouthern ? placedSouth : placedMain;
      
      while(true) {
        finalY = Math.max(5, Math.min(95, baseY + radius * Math.sin(angle)));
        finalRA = (ra + radius * Math.cos(angle) * 0.1) % 24; 
        if (finalRA < 0) finalRA += 24;

        const collision = targetList.find(p => {
          let dra = Math.abs(p.ra - finalRA);
          if (dra > 12) dra = 24 - dra;
          const dy = Math.abs(p.y - finalY);
          return dra < 0.6 && dy < 6;
        });

        if (!collision) break;
        angle += Math.PI / 4;
        radius += 1;
        if (radius > 50) break;
      }
      targetList.push({ ra: finalRA, y: finalY, name: c.name });

      const lines = [];
      const numStars = 3 + (hashCode(c.slug) % 3);
      for (let i = 0; i < numStars; i++) {
        lines.push({
          dx: (hashCode(c.slug + i) % 20 - 10) * 0.4,
          dy: (hashCode(c.slug + i + "y") % 20 - 10) * 0.4,
        });
      }

      return { ...c, absoluteX: finalRA, y: finalY, lines, type: 'seasonal', isSouthern, originalSeason: c.season || '' };
    });
  }, [constellations]);

  const displayStars = useMemo(() => {
    const cameraRA = (4 + (selectedMonth - 1) * 2) % 24;

    return celestialMap.map(c => {
      let dx = c.absoluteX - cameraRA;
      dx = ((dx + 12) % 24 + 24) % 24 - 12;
      
      // ★ 修正ポイント1：UIの期待に合わせるため、右をEAST・左をWESTとし「＋」に変更（天球儀モデル）
      // 月が進む（右矢印を押す）と、星空全体が左へスライドし、右から新しい星が来るようになります。
      const screenX = 50 + (dx / 8) * 100; 
      
      let status: 'current' | 'adjacent' | 'background' = 'background';
      const absDx = Math.abs(dx);
      
      if (absDx <= 1.5) status = 'current';
      else if (absDx <= 3.5) status = 'adjacent';

      if (c.y < 30 || c.isSouthern) {
        if (absDx <= 5) status = 'adjacent';
      }

      return { ...c, screenX, status };
    });
  }, [celestialMap, selectedMonth]);

  const staticStars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.1
    }));
  }, []);

  const mainSkyStars = displayStars.filter(c => !c.isSouthern);
  const southernSkyStars = displayStars.filter(c => c.isSouthern);

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
      <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in duration-700 relative">
        
        <div className="mb-6 pt-4 px-4 sm:px-8">
          <Link href="/cosmomatch/constellation" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> 診断トップに戻る
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-foreground mb-2 flex items-center gap-3">
                <Telescope className="w-7 h-7 text-primary" />
                プラネタリウム図鑑
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg">
                実際の天球座標（赤経・赤緯）を再現した星空マップです。文字や光る星をタップして詳細を覗いてみましょう。
              </p>
            </div>

            <div className="bg-secondary/30 p-3 rounded-2xl border border-border/50 shadow-inner w-full lg:w-auto">
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                  <button
                    key={m}
                    onClick={() => goToMonth(m)}
                    className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                      selectedMonth === m 
                      ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                      : 'bg-background hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40'
                    }`}
                  >
                    {m}月
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            メイン空（日本から見える星空）
        ========================================= */}
        <div className="relative w-full h-[600px] md:h-[700px] bg-[#02020a] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden mb-6 flex items-center group/sky">
          
          <button onClick={() => shiftSky(-1)} className="absolute left-4 z-40 p-4 rounded-full bg-black/40 border border-white/10 text-white/50 hover:text-white hover:bg-black/60 hover:scale-110 transition-all backdrop-blur-md opacity-0 group-hover/sky:opacity-100 hidden sm:block">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button onClick={() => shiftSky(1)} className="absolute right-4 z-40 p-4 rounded-full bg-black/40 border border-white/10 text-white/50 hover:text-white hover:bg-black/60 hover:scale-110 transition-all backdrop-blur-md opacity-0 group-hover/sky:opacity-100 hidden sm:block">
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[200px] bg-accent/20 rounded-full blur-[120px]" />
          </div>
          
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/20 tracking-[1em] font-bold z-0 pointer-events-none">NORTH</div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/20 tracking-[1em] font-bold z-0 pointer-events-none">SOUTH</div>
          {/* ★ 修正ポイント1の連動：EASTとWESTのラベルを天球儀モデルに合わせて反転 */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] text-white/20 tracking-[1em] font-bold -rotate-90 z-0 pointer-events-none">WEST</div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-white/20 tracking-[1em] font-bold rotate-90 z-0 pointer-events-none">EAST</div>
          
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#000005] to-transparent pointer-events-none opacity-90 z-0" />

          {staticStars.map(s => (
            <div key={s.id} className="absolute rounded-full bg-white z-0 pointer-events-none" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, opacity: s.opacity }} />
          ))}

          {mainSkyStars.map((c) => {
            if (c.screenX < -20 || c.screenX > 120) return null;
            const isCurrent = c.status === 'current';
            const isAdjacent = c.status === 'adjacent';
            const isSelected = selectedConstellation?.slug === c.slug;

            return (
              <button
                key={c.slug}
                onClick={() => setSelectedConstellation(c)}
                className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-[1500ms] ease-in-out group outline-none"
                style={{ left: `${c.screenX}%`, top: `${c.y}%`, zIndex: isCurrent ? 30 : isAdjacent ? 20 : 10 }}
              >
                <div className={`p-4 rounded-full flex flex-col items-center justify-center transition-all duration-700 ${isCurrent ? 'opacity-100 scale-110' : isAdjacent ? 'opacity-60 scale-90 hover:opacity-100 hover:scale-100' : 'opacity-20 scale-75 hover:opacity-100 hover:scale-90'}`}>
                  <div className={`rounded-full transition-all duration-300 flex items-center justify-center ${
                    isSelected ? 'w-5 h-5 bg-accent shadow-[0_0_25px_#00f2fe]' : 
                    isCurrent ? 'w-4 h-4 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:bg-primary' : 
                    'w-3 h-3 bg-white/70'
                  }`}>
                    <div className="w-1 h-1 bg-black/30 rounded-full" />
                  </div>
                  
                  <span className={`mt-2 whitespace-nowrap text-[11px] font-bold px-3 py-1 rounded-md backdrop-blur-md border transition-all duration-300 ${
                    isSelected ? 'bg-black/90 text-accent border-accent/50 scale-110 shadow-lg shadow-accent/20' : 
                    isCurrent ? 'bg-black/60 text-white border-white/20' : 
                    'bg-black/40 text-white/70 border-transparent group-hover:border-white/20 group-hover:text-white group-hover:bg-black/60'
                  }`}>
                    {c.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* =========================================
            南天エリア（日本から見えない空）
        ========================================= */}
        <div className="relative w-full h-[250px] bg-[#05050f] rounded-3xl border border-white/5 shadow-inner overflow-hidden flex items-center mb-10">
          <div className="absolute top-4 left-6 flex items-center gap-2 text-white/40 font-bold text-sm tracking-wider pointer-events-none z-10">
            <Globe className="w-5 h-5" /> SOUTHERN SKY <span className="text-xs font-normal opacity-70 ml-2">地平線の下（南半球の空）</span>
          </div>
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#000005] to-transparent pointer-events-none opacity-90 z-0" />

          {southernSkyStars.map((c) => {
            if (c.screenX < -20 || c.screenX > 120) return null;
            const isSelected = selectedConstellation?.slug === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => setSelectedConstellation(c)}
                className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-[1500ms] ease-in-out group outline-none z-20"
                style={{ left: `${c.screenX}%`, top: `${c.y}%` }}
              >
                <div className="p-3 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity duration-300">
                  <div className={`rounded-full transition-all duration-300 ${isSelected ? 'w-4 h-4 bg-emerald-400 shadow-[0_0_15px_#34d399]' : 'w-2 h-2 bg-white/70'}`} />
                  <span className={`mt-1.5 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded bg-black/50 border transition-all ${isSelected ? 'text-emerald-400 border-emerald-400/50' : 'text-white/50 border-transparent group-hover:border-white/20'}`}>
                    {c.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* =========================================
            詳細ポップアップ（共通）
        ========================================= */}
        {selectedConstellation && (
          <div className="fixed bottom-16 sm:bottom-12 left-1/2 -translate-x-1/2 w-[95%] max-w-[420px] bg-background/95 backdrop-blur-3xl border border-border/50 rounded-3xl p-5 shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-8 z-[100]">
            {/* ★ スマホ下部のバー被りを防止 */}
            <button onClick={() => setSelectedConstellation(null)} className="absolute top-4 right-4 p-2 bg-secondary/50 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
            <div className="flex gap-4 items-center mb-5 pr-8">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#000015] border border-white/10 shrink-0 flex items-center justify-center relative shadow-inner">
                {selectedConstellation.imageUrl ? <img src={selectedConstellation.imageUrl} alt="" className="w-full h-full object-cover" /> : null}
                <span className="absolute text-4xl opacity-30 -z-10">{selectedConstellation.emoji}</span>
              </div>
              <div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1.5 uppercase tracking-wider ${selectedConstellation.isSouthern ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : 'text-primary bg-primary/10 border border-primary/20'}`}>
                  {selectedConstellation.isSouthern ? "南半球の星座" : `${selectedConstellation.originalSeason} 見頃`}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">{selectedConstellation.name}</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed italic">「{selectedConstellation.catchCopy}」</p>
            <Link href={`/cosmomatch/constellation/dictionary/${selectedConstellation.slug}`} className="flex items-center justify-center w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all gap-2 shadow-lg shadow-primary/20">
              <Info className="w-4 h-4" /> 星座図鑑のデータを見る <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </ContentPageLayout>
  )
}