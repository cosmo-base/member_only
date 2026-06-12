// components/spacetype-list.tsx
"use client";

import { Telescope, Satellite, Rocket, Earth, Search, ChevronRight, CheckCircle2, Star } from "lucide-react"
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"

const BASIC_TYPES = [
    {
        id: "RI",
        title: "🔭 天文台トラベラー",
        emoji: "🔭",
        icon: Telescope,
        catchcopy: "宇宙、普通にロマンすぎない？",
        explanation: "・難しい話はちょっと苦手\n・でも宇宙はめちゃくちゃ気になる\n・気づいたら宇宙の画像見てる",
        howToSpend: "👉 まずは“見るだけ”でOK",
        contents: ["毎日宇宙クイズ", "週刊宇宙ニュース", "Cosmo Baseで宇宙知っトク"],
        shareText: "宇宙、ロマンすぎない？って思ってる【天文台トラベラー】でした🔭 #CosmoBase宇宙タイプ診断",
        img: "RI.png",
        img_share: "RI_share.png",
        color: "#cbace4",
    },
    {
        id: "DI",
        title: "🛰️ 人工衛星",
        emoji: "🛰️",
        icon: Satellite,
        catchcopy: "宇宙って色んな楽しみ方あるよね",
        explanation: "・ニュースも気になる\n・雑談も好き\n・とりあえず全部ちょっとずつ見たい",
        howToSpend: "👉 気になるところからつまみ食いでOK",
        contents: ["週刊宇宙ニュース", "Cosmo Baseで宇宙教えて", "Cosmo Base Library"],
        shareText: "いろんな角度から宇宙楽しみたい【人工衛星】タイプでした🛰️ #CosmoBase宇宙タイプ診断",
        img: "DI.png",
        img_share: "DI_share.png",
        color: "#85c68b",
    },
    {
        id: "RO",
        title: "🚀 ロケット打ち上げ",
        emoji: "🚀",
        icon: Rocket,
        catchcopy: "それ、実際に行けるの？",
        explanation: "・イベント見つけたら調べてる\n・気づいたら応募ページ見てる\n・とりあえず一歩踏みがち",
        howToSpend: "👉 小さくてもいいから1回動いてみる",
        contents: ["宇宙に行っといで", "Cosmo Base Event Database", "Cosmo Baseで宇宙教えて"],
        shareText: "気づいたら一歩踏み出してる【ロケット打ち上げ】でした🚀 #CosmoBase宇宙タイプ診断",
        img: "RO.png",
        img_share: "RO_share.png",
        color: "#EEEEBB",
    },
    {
        id: "DO",
        title: "🌍 宇宙ステーション",
        emoji: "🌍",
        icon: Earth,
        catchcopy: "それ、どういう仕組み？",
        explanation: "・ちゃんと理解したい\n・人に説明したくなる\n・気づいたら深掘りしてる",
        howToSpend: "👉 知識を“誰かに話す”と一気に楽しくなる",
        contents: ["Space Voyager 検定", "Cosmo Base Library", "宇宙のイベント行ってきた"],
        shareText: "気づいたら詳しくなってる【宇宙ステーション】でした🌍 #CosmoBase宇宙タイプ診断",
        img: "DO.png",
        img_share: "DO_share.png",
        color: "#83CBEB",
    }
];

export function SpaceTypeList() {
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
            <div className="flex justify-center mb-12">
                <div className="inline-flex bg-secondary/30 p-1.5 rounded-full border border-border/50">
                    <div className="px-8 py-3 rounded-full text-sm font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 cursor-default">
                        簡易版（4タイプ）
                    </div>
                    <Link 
                        href="/type/detail/list" 
                        className="px-8 py-3 rounded-full text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
                    >
                        完全版（16タイプ）
                    </Link>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                {BASIC_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                        <GlassCard key={type.id} className="relative overflow-hidden p-0 group">
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-current z-20" style={{ backgroundColor: type.color }} />
                            
                            <div className="flex flex-col md:flex-row relative z-10">
                                {/* 画像エリア */}
                                <div className="md:w-5/12 lg:w-1/3 relative bg-secondary/30 aspect-square md:aspect-auto flex items-center justify-center overflow-hidden pl-2">
                                    <img 
                                        src={`/images/${type.img}`} // ★ 画像パス（適宜修正してください）
                                        alt={type.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            // 画像が見つからなかった場合のフォールバック
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                    {/* 画像がない時の代替表示 */}
                                    <div className="hidden absolute inset-0 flex flex-col items-center justify-center bg-secondary/50">
                                        <Icon className="w-20 h-20 opacity-50" style={{ color: type.color }} />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background hidden md:block" />
                                </div>

                                {/* 詳細テキストエリア */}
                                <div className="p-6 md:p-8 md:w-7/12 lg:w-2/3 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                                            <Icon className="w-5 h-5" style={{ color: type.color }} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground">{type.title}</h3>
                                    </div>
                                    
                                    <p className="text-lg font-bold mb-6" style={{ color: type.color }}>
                                        「{type.catchcopy}」
                                    </p>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">特徴</h4>
                                                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                                    {type.explanation}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">おすすめの過ごし方</h4>
                                                <p className="text-sm font-medium text-accent">
                                                    {type.howToSpend}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-secondary/20 p-4 rounded-xl border border-border/50">
                                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                <Star className="w-3.5 h-3.5 text-primary" />
                                                相性の良いコンテンツ
                                            </h4>
                                            <ul className="space-y-2">
                                                {type.contents.map((content, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground font-medium">
                                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                        {content}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    )
                })}

                <div className="mt-12 text-center">
                    <Link href="/type/content">
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow h-14 px-8 rounded-full font-bold text-base">
                            簡易版診断を受けてみる
                            <ChevronRight className="w-5 h-5 ml-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}