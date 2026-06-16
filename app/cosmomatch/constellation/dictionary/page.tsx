// app/cosmomatch/constellation/dictionary/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Constellation, getConstellations } from "@/data/CMconstellation"
import { Loader2, Search, Sparkles, Compass, Map as MapIcon, Moon, ArrowLeft, Sunrise, Sunset } from "lucide-react"

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

  // カテゴリ分類用の箱
  const visibleTonight: Constellation[] = []; // 今夜見える（夕方〜深夜）
  const upcomingMidnight: Constellation[] = []; // 真夜中〜明け方に見える（数ヶ月後に見頃）
  const outOfSeason: Constellation[] = []; // 太陽の方向にあるため見えない（季節外れ）
  const circumpolar: Constellation[] = []; // 通年（北天）
  const southern: Constellation[] = []; // 日本から見えない（南天）
  const others: Constellation[] = []; // 分類不能

  constellations.forEach(c => {
    const s = c.season || '';

    if (s.includes('南') || s.includes('見えな')) {
      southern.push(c);
      return;
    }
    if (s.includes('通年') || s.includes('一年中') || s.includes('北')) {
      circumpolar.push(c);
      return;
    }

    const monthMatch = s.match(/(\d+)月/);
    if (monthMatch) {
      const peakMonth = parseInt(monthMatch[1], 10);
      
      // 今の月から見て、見頃が「何ヶ月後か」を計算（-6 〜 +5 の範囲に収める）
      let diff = peakMonth - currentMonth;
      if (diff < -6) diff += 12;
      if (diff > 5) diff -= 12;

      // 天文学的な見え方の分類
      // ピークの -2ヶ月(夕方に沈む) 〜 +3ヶ月(夜更けに昇る) は「今夜の空」にいる
      if (diff >= -2 && diff <= 3) {
        visibleTonight.push(c);
      } 
      // ピークの +4ヶ月, +5ヶ月 は「明け方」にならないと昇ってこない
      else if (diff >= 4 && diff <= 5) {
        upcomingMidnight.push(c);
      } 
      // それ以外（太陽の向こう側にあるため、昼間空にある＝夜は見えない）
      else {
        outOfSeason.push(c);
      }
      return;
    }

    others.push(c);
  });

  // 描画用のセクション配列
  const sections = [
    {
      title: "今夜の星空",
      desc: "日没から深夜にかけて、今の夜空を彩っている星座たち",
      icon: <Moon className="w-5 h-5 text-yellow-300" />,
      color: "text-primary",
      data: visibleTonight
    },
    {
      title: "真夜中〜明け方の星空",
      desc: "みんなが寝静まった後、東の空から静かに昇ってくる星座たち",
      icon: <Sunrise className="w-5 h-5 text-accent" />,
      color: "text-foreground",
      data: upcomingMidnight
    },
    {
      title: "太陽の向こう側（季節外れ）",
      desc: "今は昼間の空にいるため、夜には見えない星座たち",
      icon: <Sunset className="w-5 h-5 text-orange-400 opacity-60" />,
      color: "text-muted-foreground",
      data: outOfSeason
    },
    {
      title: "北天・通年の星座",
      desc: "季節を問わず、いつも北の空で輝く星々",
      icon: <Compass className="w-5 h-5 text-indigo-300" />,
      color: "text-foreground",
      data: circumpolar
    },
    {
      title: "南天の星座",
      desc: "日本からは見えない、地球の裏側の未知なる星々",
      icon: <MapIcon className="w-5 h-5 text-emerald-300" />,
      color: "text-foreground",
      data: southern
    }
  ].filter(section => section.data.length > 0);

  if (others.length > 0) {
    sections.push({
      title: "その他の星座",
      desc: "見頃の時期が特定されていない星座群",
      icon: <Search className="w-5 h-5 text-muted-foreground" />,
      color: "text-muted-foreground",
      data: others
    });
  }

  return (
    <ContentPageLayout title="星座図鑑" level={1} levelTitle="" logo="CosmoMatch">
      <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-700 relative min-h-screen">
        
        {/* 背景の装飾（天の川のようなグラデーション） */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute top-[50%] right-[10%] w-[600px] h-[400px] bg-accent/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
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
                Cosmo Base 星空マップ
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                ただの一覧ではありません。今の季節、あなたが見上げている夜空にリンクして、星座たちがリアルタイムに配置を変える星空図鑑です。
              </p>
            </div>
          </div>
        </div>

        {/* セクションごとの描画 */}
        <div className="space-y-24">
          {sections.map((section, idx) => (
            <div key={idx} className="relative">
              
              {/* セクションタイトル */}
              <div className="mb-10 flex items-center gap-4">
                <div className="bg-secondary/40 p-3 rounded-2xl border border-border/50 shadow-inner">
                  {section.icon}
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${section.color}`}>{section.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{section.desc}</p>
                </div>
              </div>

              {/* ★ 星空レイアウト（Flexによるジグザグ配置） */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-12 sm:gap-x-10 sm:gap-y-16 px-4">
                {section.data.map((c, i) => {
                  // インデックスを使って、上下にランダムっぽくズラす（星空感を演出）
                  const translateY = i % 3 === 0 ? 'translate-y-0' : i % 3 === 1 ? 'translate-y-8 sm:translate-y-12' : '-translate-y-6 sm:-translate-y-8';
                  
                  return (
                    <Link 
                      key={c.slug} 
                      href={`/cosmomatch/constellation/dictionary/${c.slug}`} 
                      className={`group relative flex flex-col items-center w-28 sm:w-36 transition-all duration-500 hover:z-50 ${translateY}`}
                    >
                      {/* 画像の円形フレーム */}
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_30px_rgba(0,242,254,0.4)] group-hover:border-primary/80 transition-all duration-500 bg-[#000015] flex items-center justify-center relative">
                        {c.imageUrl ? (
                          <img 
                            src={c.imageUrl} 
                            alt={c.name} 
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                            onError={(e) => {
                              // 画像エラー時は非表示にして絵文字フォールバックを見せる
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        
                        {/* 画像がない、または読み込めなかった時のフォールバック（絵文字） */}
                        <span className="absolute text-5xl opacity-40 group-hover:opacity-80 transition-opacity -z-10">{c.emoji}</span>
                      </div>
                      
                      {/* 星座名と見頃テキスト */}
                      <div className="mt-4 text-center">
                        <h4 className="font-bold text-sm sm:text-base text-white/80 group-hover:text-primary transition-colors mb-1 drop-shadow-md">
                          {c.name}
                        </h4>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs text-white/50 group-hover:text-white/80 group-hover:border-primary/30 transition-colors">
                          {c.season}
                        </span>
                      </div>

                      {/* 空間をつなぐような光のライン（疑似要素で演出） */}
                      <div className="absolute top-1/2 left-1/2 w-[150%] h-px bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-1/2 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rotate-12" />
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </ContentPageLayout>
  )
}