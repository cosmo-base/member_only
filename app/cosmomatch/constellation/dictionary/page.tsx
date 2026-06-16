// app/cosmomatch/constellation/dictionary/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Constellation, getConstellations } from "@/data/CMconstellation"
import { Loader2, Search, Sparkles, Compass, Map as MapIcon, Moon, ArrowLeft } from "lucide-react"

export default function DictionaryIndexPage() {
  const [constellations, setConstellations] = useState<Constellation[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSeasonIndex, setCurrentSeasonIndex] = useState(0)

  // 季節の定義と順番（0:春, 1:夏, 2:秋, 3:冬）
  const seasons = [
    { key: '春', name: '春の星座', desc: '過ぎ去った季節の余韻', icon: <Sparkles className="w-5 h-5 text-pink-300" /> },
    { key: '夏', name: '夏の星座', desc: '今夜、見上げればそこにある星々', icon: <Moon className="w-5 h-5 text-yellow-300" /> },
    { key: '秋', name: '秋の星座', desc: '近づく季節の足音', icon: <MapIcon className="w-5 h-5 text-orange-300" /> },
    { key: '冬', name: '冬の星座', desc: '半年後の澄んだ夜空', icon: <Compass className="w-5 h-5 text-blue-300" /> },
  ];

  useEffect(() => {
    // データ取得
    getConstellations().then((data) => {
      setConstellations(data);
      setIsLoaded(true);
    });

    // ユーザーの現在の「月」を取得して季節を判定
    const month = new Date().getMonth() + 1;
    let seasonIdx = 0; // デフォルトは春
    if (month >= 3 && month <= 5) seasonIdx = 0; // 春
    else if (month >= 6 && month <= 8) seasonIdx = 1; // 夏
    else if (month >= 9 && month <= 11) seasonIdx = 2; // 秋
    else seasonIdx = 3; // 冬

    setCurrentSeasonIndex(seasonIdx);
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

  // 今の季節を起点に、春・夏・秋・冬の順番を並び替える（今→次→半年後→前）
  const orderedSeasons = [
    seasons[currentSeasonIndex],                           // 今の季節
    seasons[(currentSeasonIndex + 1) % 4],                 // 次の季節
    seasons[(currentSeasonIndex + 2) % 4],                 // 半年後
    seasons[(currentSeasonIndex + 3) % 4],                 // 過ぎた季節
  ];

  // データをカテゴリごとに分類
  const groupedData: Record<string, Constellation[]> = {
    '春': [], '夏': [], '秋': [], '冬': [], '通年': [], '南天': [], 'その他': []
  };

  constellations.forEach(c => {
    const s = c.season || '';
    if (s.includes('南') || s.includes('見えない')) {
      groupedData['南天'].push(c);
    } else if (s.includes('通年') || s.includes('北')) {
      groupedData['通年'].push(c);
    } else if (s.includes('春')) {
      groupedData['春'].push(c);
    } else if (s.includes('夏')) {
      groupedData['夏'].push(c);
    } else if (s.includes('秋')) {
      groupedData['秋'].push(c);
    } else if (s.includes('冬')) {
      groupedData['冬'].push(c);
    } else {
      groupedData['その他'].push(c);
    }
  });

  // 描画用のセクション配列を作成
  const sections = [
    // 1〜4. 四季の星座（動的順序）
    ...orderedSeasons.map((season, index) => {
      // 一番上の「今の季節」だけ説明文を特別にする
      const titleDesc = index === 0 ? "今夜の夜空（20時頃に見やすい星座）" : season.desc;
      const titleColor = index === 0 ? "text-primary" : "text-foreground";
      return {
        title: season.name,
        desc: titleDesc,
        icon: season.icon,
        color: titleColor,
        data: groupedData[season.key]
      }
    }),
    // 5. 通年の星座
    {
      title: "北天・通年の星座",
      desc: "一年中、いつも北の空で輝く星々",
      icon: <Compass className="w-5 h-5 text-indigo-300" />,
      color: "text-foreground",
      data: groupedData['通年']
    },
    // 6. 南天の星座
    {
      title: "南天の星座",
      desc: "日本からは見えない、地球の裏側の未知なる星々",
      icon: <MapIcon className="w-5 h-5 text-emerald-300" />,
      color: "text-foreground",
      data: groupedData['南天']
    }
  ].filter(section => section.data.length > 0); // データが空のセクションは非表示

  // その他分類できなかったものがあれば追加
  if (groupedData['その他'].length > 0) {
    sections.push({
      title: "その他の星座",
      desc: "分類外の星座群",
      icon: <Search className="w-5 h-5 text-muted-foreground" />,
      color: "text-muted-foreground",
      data: groupedData['その他']
    });
  }

  return (
    <ContentPageLayout title="星座図鑑" level={1} levelTitle="" logo="CosmoMatch">
      <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-700 relative">
        
        {/* 背景の装飾 */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden -z-10 opacity-30">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute top-[40%] right-[10%] w-80 h-80 bg-accent/20 rounded-full blur-[120px]" />
        </div>

        {/* ヘッダーエリア */}
        <div className="mb-8">
          <Link href="/cosmomatch/constellation" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> 診断トップに戻る
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-foreground mb-2 flex items-center gap-3">
                <Search className="w-7 h-7 text-primary" />
                Cosmo Base 星座図鑑
              </h2>
              <p className="text-muted-foreground text-sm">
                広大な夜空に描かれた、88の物語と軌跡。
              </p>
            </div>
            <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-secondary/30 rounded-full border border-border/50 shadow-inner">
              <Compass className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </div>
        </div>

        {/* セクションごとの描画 */}
        <div className="space-y-16">
          {sections.map((section, idx) => (
            <div key={idx} className="relative">
              {/* セクションタイトル */}
              <div className="mb-6 flex items-end gap-3 border-b border-border/40 pb-3">
                <div className="bg-secondary/40 p-2 rounded-xl border border-border/50">
                  {section.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${section.color}`}>{section.title}</h3>
                  <p className="text-xs text-muted-foreground tracking-wider">{section.desc}</p>
                </div>
              </div>

              {/* 星座カードのグリッド（空に散らばるようなレイアウト） */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {section.data.map((c) => (
                  <Link 
                    key={c.slug} 
                    href={`/cosmomatch/constellation/dictionary/${c.slug}`} 
                    className="group relative bg-[#0a0a1a]/50 backdrop-blur-md border border-[#ffffff10] rounded-2xl p-4 flex flex-col items-center text-center hover:bg-[#111133] hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden shadow-lg"
                  >
                    {/* ホバー時の発光エフェクト */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent transition-opacity duration-500 pointer-events-none" />
                    
                    <span className="text-5xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] mb-3 transform group-hover:scale-110 transition-transform duration-500 z-10">
                      {c.emoji}
                    </span>
                    
                    <h4 className="font-bold text-foreground text-sm mb-1 z-10 group-hover:text-primary transition-colors">
                      {c.name}
                    </h4>
                    
                    <p className="text-[10px] text-muted-foreground line-clamp-2 z-10 leading-relaxed">
                      {c.catchCopy}
                    </p>
                    
                    {/* 小さな装飾星 */}
                    <Sparkles className="absolute top-2 right-2 w-3 h-3 text-accent/0 group-hover:text-accent/50 transition-colors duration-500" />
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