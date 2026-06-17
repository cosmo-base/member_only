"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Constellation, getConstellations } from "@/data/CMconstellation"
import { Loader2, ArrowLeft, Telescope, X, ChevronRight, Info, ChevronLeft, Globe } from "lucide-react"

// ★ Pudno a koordenada dagiti 88 a konstelasion (RA: 0-24h, Dec: -90 aginggana +90 grado)
const REAL_COORDS: Record<string, {ra: number, dec: number}> = {
  And: { ra: 1.0, dec: 40 }, Ant: { ra: 10.5, dec: -35 }, Aps: { ra: 16.0, dec: -75 },
  Aqr: { ra: 22.5, dec: -10 }, Aql: { ra: 19.5, dec: 3 }, Ara: { ra: 17.5, dec: -55 },
  Ari: { ra: 2.5, dec: 20 }, Aur: { ra: 6.0, dec: 42 }, Boo: { ra: 14.5, dec: 30 },
  Cae: { ra: 4.5, dec: -40 }, Cam: { ra: 6.0, dec: 70 }, Cnc: { ra: 8.5, dec: 20 },
  CVn: { ra: 13.0, dec: 40 }, CMa: { ra: 6.8, dec: -22 }, CMi: { ra: 7.6, dec: 5 },
  Cap: { ra: 21.0, dec: -20 }, Car: { ra: 9.0, dec: -60 }, Cas: { ra: 1.0, dec: 60 },
  Cen: { ra: 13.0, dec: -50 }, Cep: { ra: 22.0, dec: 70 }, Cet: { ra: 1.5, dec: -10 },
  Cha: { ra: 11.0, dec: -80 }, Cir: { ra: 15.0, dec: -60 }, Col: { ra: 5.5, dec: -35 },
  Com: { ra: 13.0, dec: 20 }, CrA: { ra: 19.0, dec: -40 }, CrB: { ra: 15.5, dec: 30 },
  Crv: { ra: 12.5, dec: -20 }, Crt: { ra: 11.0, dec: -15 }, Cru: { ra: 12.5, dec: -60 },
  Cyg: { ra: 20.5, dec: 40 }, Del: { ra: 20.5, dec: 15 }, Dor: { ra: 5.0, dec: -65 },
  Dra: { ra: 17.0, dec: 65 }, Equ: { ra: 21.0, dec: 5 }, Eri: { ra: 3.5, dec: -30 },
  For: { ra: 2.5, dec: -30 }, Gem: { ra: 7.0, dec: 20 }, Gru: { ra: 22.0, dec: -45 },
  Her: { ra: 17.0, dec: 30 }, Hor: { ra: 3.0, dec: -50 }, Hya: { ra: 10.0, dec: -20 },
  Hyi: { ra: 2.0, dec: -75 }, Ind: { ra: 21.0, dec: -55 }, Lac: { ra: 22.5, dec: 45 },
  Leo: { ra: 10.5, dec: 15 }, LMi: { ra: 10.0, dec: 35 }, Lep: { ra: 5.5, dec: -20 },
  Lib: { ra: 15.0, dec: -15 }, Lup: { ra: 15.0, dec: -45 }, Lyn: { ra: 8.0, dec: 45 },
  Lyr: { ra: 18.5, dec: 35 }, Men: { ra: 5.0, dec: -75 }, Mic: { ra: 21.0, dec: -35 },
  Mon: { ra: 7.0, dec: -5 }, Mus: { ra: 12.0, dec: -70 }, Nor: { ra: 16.0, dec: -50 },
  Oct: { ra: 21.0, dec: -85 }, Oph: { ra: 17.0, dec: 0 }, Ori: { ra: 5.5, dec: 5 },
  Pav: { ra: 19.0, dec: -65 }, Peg: { ra: 22.5, dec: 20 }, Per: { ra: 3.0, dec: 45 },
  Phe: { ra: 0.5, dec: -50 }, Pic: { ra: 5.0, dec: -50 }, Psc: { ra: 1.0, dec: 15 },
  PsA: { ra: 22.5, dec: -30 }, Pup: { ra: 7.5, dec: -30 }, Pyx: { ra: 9.0, dec: -30 },
  Ret: { ra: 4.0, dec: -60 }, Sge: { ra: 19.5, dec: 20 }, Sgr: { ra: 19.0, dec: -25 },
  Sco: { ra: 16.5, dec: -30 }, Scl: { ra: 0.0, dec: -30 }, Sct: { ra: 18.5, dec: -10 },
  Ser: { ra: 16.0, dec: 5 }, Sex: { ra: 10.0, dec: 0 }, Tau: { ra: 4.5, dec: 15 },
  Tel: { ra: 19.0, dec: -50 }, Tri: { ra: 2.0, dec: 30 }, TrA: { ra: 16.0, dec: -65 },
  Tuc: { ra: 22.0, dec: -60 }, UMa: { ra: 11.0, dec: 50 }, UMi: { ra: 15.0, dec: 75 },
  Vel: { ra: 9.0, dec: -45 }, Vir: { ra: 13.0, dec: -5 }, Vol: { ra: 8.0, dec: -70 },
  Vul: { ra: 20.0, dec: 25 },
};

// Paamo a mapataud ti random para kadagiti saan nga agpadis a konstelasion
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

  // Agdama a maipakita a bulan
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

  // 1. Karkuluen ti koordenada ti amin a konstelasion (pakairamanan panangliklik iti panagdinnungpar)
  const celestialMap = useMemo(() => {
    const placedMain: { ra: number, y: number, name: string }[] = [];
    const placedSouth: { ra: number, y: number, name: string }[] = [];
    
    return constellations.map(c => {
      const s = c.season || '';
      
      // Usaren ti ID (slug) tapno mabirokan ti koordenada
      const slugKey = c.slug.charAt(0).toUpperCase() + c.slug.slice(1).toLowerCase();
      const coords = REAL_COORDS[c.slug] || REAL_COORDS[slugKey];
      
      let ra = 0;
      let dec = 0;

      if (coords) {
        ra = coords.ra;
        dec = coords.dec;
      } else {
        const monthMatch = s.match(/(\d+)月/);
        if (monthMatch) {
          const m = parseInt(monthMatch[1], 10);
          ra = (4 + (m - 1) * 2) % 24; 
        } else if (s.includes('春')) ra = 12;
        else if (s.includes('夏')) ra = 18;
        else if (s.includes('秋')) ra = 22;
        else if (s.includes('冬')) ra = 6;
        else ra = (hashCode(c.slug) % 240) / 10;

        if (s.includes('北') || s.includes('通年')) dec = 60 + (hashCode(c.slug) % 30);
        else if (s.includes('南') || s.includes('見えな')) dec = -60 - (hashCode(c.slug) % 30);
        else dec = (hashCode(c.slug + "y") % 100) - 40;
      }
      
      // Paka-imatan manipud Hapon (35 degrees latitude amianan): Ti kina-baba ngem -55 degrees ket langit iti abagatan (saan a makita)
      const isSouthern = dec < -55 || s.includes('南') || s.includes('見えな');

      let baseY = isSouthern 
        ? (( -55 - dec ) / 35) * 100
        : (( 90 - dec ) / 145) * 100;
      
      let finalRA = ra;
      let finalY = Math.max(5, Math.min(95, baseY));
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

  // 2. Karkuluen ti koordenada iti uneg ti iskrin (X) a nakabasar iti posision ti kamera
  const displayStars = useMemo(() => {
    const cameraRA = (4 + (selectedMonth - 1) * 2) % 24;

    return celestialMap.map(c => {
      let dx = c.absoluteX - cameraRA;
      dx = ((dx + 12) % 24 + 24) % 24 - 12;
      
      // No umabante ti bulan (pinduten ti makannawan a pana), ag-slide pa-kannigid ti intero a langit ti bituen, ken umay dagiti baro a bituen manipud kannawan.
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
      <ContentPageLayout title="Diksionario ti Konstelasion" level={1} levelTitle="" logo="CosmoMatch">
        <div className="max-w-md mx-auto py-32 flex flex-col items-center justify-center animate-in fade-in">
          <Loader2 className="w-12 h-12 text-accent animate-spin mb-6" />
          <p className="text-muted-foreground font-bold">Karkuluen ti koordenada ti law-ang...</p>
        </div>
      </ContentPageLayout>
    )
  }

  return (
    <ContentPageLayout title="Diksionario ti Konstelasion" level={1} levelTitle="" logo="CosmoMatch">
      <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in duration-700 relative">
        
        <div className="mb-6 pt-4 px-4 sm:px-8">
          <Link href="/cosmomatch/constellation" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Agsubli iti Top ti Diagnotiko
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-foreground mb-2 flex items-center gap-3">
                <Telescope className="w-7 h-7 text-primary" />
                Planetarium a Diksionario
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg">
                Pudno a koordenada ti law-ang (RA/Dec) a mapa ti bituen. Tappem dagiti teksto wenno bituen tapno makita ti detalye.
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
                    {m} Bulan
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

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
          
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/20 tracking-[1em] font-bold z-0 pointer-events-none">AMIANAN</div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/20 tracking-[1em] font-bold z-0 pointer-events-none">ABAGATAN</div>
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] text-white/20 tracking-[1em] font-bold -rotate-90 z-0 pointer-events-none">LAUD</div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-white/20 tracking-[1em] font-bold rotate-90 z-0 pointer-events-none">DAYA</div>
          
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

        <div className="relative w-full h-[250px] bg-[#05050f] rounded-3xl border border-white/5 shadow-inner overflow-hidden flex items-center mb-10">
          <div className="absolute top-4 left-6 flex items-center gap-2 text-white/40 font-bold text-sm tracking-wider pointer-events-none z-10">
            <Globe className="w-5 h-5" /> LANGIT ITI ABAGATAN <span className="text-xs font-normal opacity-70 ml-2">Baba ti horisonte (Langit iti Abagatan a Hemisperio)</span>
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

        {selectedConstellation && (
          <div className="fixed bottom-16 sm:bottom-12 left-1/2 -translate-x-1/2 w-[95%] max-w-[420px] bg-background/95 backdrop-blur-3xl border border-border/50 rounded-3xl p-5 shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-8 z-[100]">
            <button onClick={() => setSelectedConstellation(null)} className="absolute top-4 right-4 p-2 bg-secondary/50 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
            <div className="flex gap-4 items-center mb-5 pr-8">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#000015] border border-white/10 shrink-0 flex items-center justify-center relative shadow-inner">
                {selectedConstellation.imageUrl ? <img src={selectedConstellation.imageUrl} alt="" className="w-full h-full object-cover" /> : null}
                <span className="absolute text-4xl opacity-30 -z-10">{selectedConstellation.emoji}</span>
              </div>
              <div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1.5 uppercase tracking-wider ${selectedConstellation.isSouthern ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : 'text-primary bg-primary/10 border border-primary/20'}`}>
                  {selectedConstellation.isSouthern ? "Konstelasion iti Abagatan" : `${selectedConstellation.originalSeason} Kaimbagan a buyaen`}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">{selectedConstellation.name}</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed italic">「{selectedConstellation.catchCopy}」</p>
            <Link href={`/cosmomatch/constellation/dictionary/${selectedConstellation.slug}`} className="flex items-center justify-center w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all gap-2 shadow-lg shadow-primary/20">
              <Info className="w-4 h-4" /> Kitaen ti datos ti diksionario <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </ContentPageLayout>
  )
}