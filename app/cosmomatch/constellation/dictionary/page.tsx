// app/cosmomatch/constellation/dictionary/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Constellation, getConstellations } from "@/data/CMconstellation"
import { Loader2, Search, Sparkles, Compass, Map as MapIcon, Moon, ArrowLeft, CalendarDays } from "lucide-react"

export default function DictionaryIndexPage() {
  const [constellations, setConstellations] = useState<Constellation[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(1)

  useEffect(() => {
    getConstellations().then((data) => {
      setConstellations(data);
      setIsLoaded(true);
    });
    setCurrentMonth(new Date().getMonth() + 1);
  }, []);

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

  // 今月を先頭にした12ヶ月の配列（例: 今が6月なら [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5]）
  const orderedMonths = Array.from({ length: 12 }, (_, i) => {
    let m = currentMonth + i;
    if (m > 12) m -= 12;
    return m;
  });

  // 分類用の箱
  const groupedData: Record<string, Constellation[]> = {
    '通年': [], '南天': [], 'その他': []
  };
  for (let i = 1; i <= 12; i++) {
    groupedData[`${i}月`] = [];
  }

  constellations.forEach(c => {
    const s = c.season || '';

    if (s.includes('南') || s.includes('見えな')) {
      groupedData['南天'].push(c);
      return;
    }
    if (s.includes('通年') || s.includes('一年中') || s.includes('北')) {
      groupedData['通年'].push(c);
      return;
    }

    const monthMatch = s.match(/(\d+)月/);
    if (monthMatch) {
      const monthNum = parseInt(monthMatch[1], 10);
      if (monthNum >= 1 && monthNum <= 12) {
        groupedData[`${monthNum}月`].push(c);
        return;
      }
    }

    groupedData['その他'].push(c);
  });

  // ★ 同じ月の中で「上旬→中旬→下旬」の順番になるようにソート
  Object.keys(groupedData).forEach(key => {
    groupedData[key].sort((a, b) => (a.season || "").localeCompare(b.season || ""));
  });

  // 描画用のセクション配列
  const sections: any[] = [];

  orderedMonths.forEach((m, idx) => {
    const data = groupedData[`${m}月`];
    if (data.length === 0) return;

    let title = `${m}月の星空`;
    let desc = `${m}月に一番の見頃を迎える星座たち`;
    let color = "text-foreground";
    let icon = <CalendarDays className="w-5 h-5 text-blue-300" />;

    // 今月と来月だけ特別な装飾
    if (idx === 0) {
      title = `今月の星空（${m}月）`;
      desc = "今夜、空を見上げればそこにある主役たち";
      color = "text-primary";
      icon = <Moon className="w-5 h-5 text-yellow-300" />;
    } else if (idx === 1) {
      title = `来月の星空（${m}月）`;
      desc = "もう少しで一番の見頃を迎える星々";
      icon = <Sparkles className="w-5 h-5 text-accent" />;
    }

    sections.push({ title, desc, icon, color, data });
  });

  if (groupedData['通年'].length > 0) {
    sections.push({
      title: "北天・通年の星座",
      desc: "季節を問わず、いつも北の空で輝く星々",
      icon: <Compass className="w-5 h-5 text-indigo-300" />,
      color: "text-foreground",
      data: groupedData['通年']
    });
  }
  if (groupedData['南天'].length > 0) {
    sections.push({
      title: "南天の星座",
      desc: "日本からは見えない、地球の裏側の未知なる星々",
      icon: <MapIcon className="w-5 h-5 text-emerald-300" />,
      color: "text-foreground",
      data: groupedData['南天']
    });
  }
  if (groupedData['その他'].length > 0) {
    sections.push({
      title: "その他の星座",
      desc: "見頃の時期が特定されていない星座群",
      icon: <Search className="w-5 h-5 text-muted-foreground" />,
      color: "text-muted-foreground",
      data: groupedData['その他']
    });
  }

  return (
    <ContentPageLayout title="星座図鑑" level={1} levelTitle="" logo="CosmoMatch">
      <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-700 relative min-h-screen">
        
        {/* 背景の装飾 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute top-[50%] right-[10%] w-[600px] h-[400px] bg-accent/10 rounded-full blur-[150px]" />
        </div>

        {/* ヘッダーエリア */}
        <div className="mb-12 pt-4">
          <Link href="/cosmomatch/constellation" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> 診断トップに戻る
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-foreground mb-3 flex items-center gap-3">
                <Sparkles className="w-7 h-7 text-primary" />
                Cosmo Base 星座マップ
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                ただの一覧ではありません。今の季節にリンクして、今夜見上げたい星座から順番に並ぶ星空のタイムラインです。
              </p>
            </div>
          </div>
        </div>

        {/* セクションごとの描画 */}
        <div className="space-y-16 sm:space-y-24">
          {sections.map((section, idx) => (
            <div key={idx} className="relative">
              
              {/* セクションタイトル */}
              <div className="mb-8 flex items-center gap-4">
                <div className="bg-secondary/40 p-3 rounded-2xl border border-border/50 shadow-inner">
                  {section.icon}
                </div>
                <div>
                  <h3 className={`text-xl sm:text-2xl font-bold ${section.color}`}>{section.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{section.desc}</p>
                </div>
              </div>

              {/* ★ グリッドレイアウト（文字のかぶりを解消し、整列） */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-12 px-2">
                {section.data.map((c: Constellation) => (
                  <Link 
                    key={c.slug} 
                    href={`/cosmomatch/constellation/dictionary/${c.slug}`} 
                    className="group flex flex-col items-center w-full transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* 画像フレーム */}
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_25px_rgba(0,242,254,0.3)] group-hover:border-primary/80 transition-all duration-500 bg-[#000015] flex items-center justify-center relative mb-4">
                      {c.imageUrl ? (
                        <img 
                          src={c.imageUrl} 
                          alt={c.name} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                      {/* 画像がない時の絵文字 */}
                      <span className="absolute text-5xl opacity-30 group-hover:opacity-60 transition-opacity -z-10">{c.emoji}</span>
                    </div>
                    
                    {/* 星座名と見頃テキスト */}
                    <div className="text-center w-full px-1">
                      <h4 className="font-bold text-sm sm:text-base text-white/90 group-hover:text-primary transition-colors mb-1.5 truncate">
                        {c.name}
                      </h4>
                      <span className="inline-block px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs text-white/60 group-hover:text-white/90 group-hover:border-primary/30 transition-colors whitespace-nowrap">
                        {c.season}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </ContentPageLayout>
  )
}