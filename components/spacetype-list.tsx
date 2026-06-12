// components/spacetype-list.tsx
"use client";

import { Telescope, Satellite, Rocket, Earth, Search, ChevronRight } from "lucide-react"
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
            <div className="flex justify-center mb-8">
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

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-6">
                    {BASIC_TYPES.map((type) => {
                        const Icon = type.icon;
                        return (
                            <GlassCard key={type.id} className="relative overflow-hidden p-6 group">
                                
                                {/* ★ 修正: GlassCard自体にstyleを渡すのをやめ、内側に色付きの絶対配置要素を置いて左ボーダーを表現 */}
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-current" style={{ backgroundColor: type.color }} />
                                
                                {/* 背景のうっすらグラデーション */}
                                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none transition-opacity group-hover:opacity-20" style={{ backgroundColor: type.color }} />

                                <div className="relative z-10 flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/10" style={{ backgroundColor: `${type.color}20` }}>
                                        <Icon className="w-7 h-7" style={{ color: type.color }} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-1">{type.emoji} {type.title}</h3>
                                        <p className="text-sm font-bold mb-3" style={{ color: type.color }}>「{type.catchcopy}」</p>
                                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{type.explanation}</p>
                                    </div>
                                </div>
                            </GlassCard>
                        )
                    })}
                </div>

                <div className="mt-10 text-center">
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