"use client"

import { useState } from "react"
import Image from "next/image"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Speaker {
  id: string
  name: string
  affiliation: string
  photo: string
  biography: string
  events: { name: string; date: string }[]
}

const speakers: Speaker[] = [
  {
    id: "1",
    name: "山田 太郎",
    affiliation: "宇宙航空研究開発機構（JAXA）",
    photo: "/images/speaker-placeholder.jpg",
    biography: "東京大学大学院工学研究科修了。2010年よりJAXAにて有人宇宙技術の研究に従事。国際宇宙ステーション計画にも参画し、日本実験棟「きぼう」の運用に携わる。宇宙教育の普及活動にも力を入れている。",
    events: [
      { name: "国際宇宙ステーションの1日", date: "2026年1月18日" },
      { name: "宇宙飛行士の訓練プログラム", date: "2026年3月8日" },
    ],
  },
  {
    id: "2",
    name: "佐藤 花子",
    affiliation: "国立天文台",
    photo: "/images/speaker-placeholder.jpg",
    biography: "京都大学理学部卒業後、国立天文台にて太陽系外惑星の研究に従事。すばる望遠鏡を用いた観測プロジェクトを多数主導。サイエンスコミュニケーション活動も積極的に行っている。",
    events: [
      { name: "太陽系外惑星の発見と探索", date: "2026年4月26日" },
    ],
  },
  {
    id: "3",
    name: "鈴木 一郎",
    affiliation: "スペーステック株式会社",
    photo: "/images/speaker-placeholder.jpg",
    biography: "早稲田大学理工学部卒業。大手重工メーカーでロケットエンジン開発に携わった後、宇宙ベンチャーを起業。民間主導の宇宙開発を推進し、複数の衛星打ち上げプロジェクトを成功させている。",
    events: [
      { name: "宇宙ビジネス最前線", date: "2026年1月11日" },
      { name: "民間宇宙旅行の最前線", date: "2026年5月17日" },
    ],
  },
  {
    id: "4",
    name: "田中 美咲",
    affiliation: "プラネタリウム解説員",
    photo: "/images/speaker-placeholder.jpg",
    biography: "日本大学天文学科卒業後、全国のプラネタリウムで解説員として活動。星座や天体の魅力を分かりやすく伝えることに定評がある。天文関連の書籍も多数執筆。",
    events: [
      { name: "冬の星座観測ガイド", date: "2025年12月21日" },
      { name: "春の星座と神話の世界", date: "2026年4月5日" },
    ],
  },
  {
    id: "5",
    name: "高橋 健太",
    affiliation: "惑星科学研究所",
    photo: "/images/speaker-placeholder.jpg",
    biography: "東北大学大学院理学研究科博士課程修了。火星や小惑星の地質学的研究を専門とし、複数の探査ミッションに科学チームとして参加。一般向けの講演活動も精力的に行っている。",
    events: [
      { name: "火星探査の最前線", date: "2026年3月15日" },
      { name: "小惑星探査機はやぶさの軌跡", date: "2025年12月14日" },
    ],
  },
]

function SpeakerModal({ speaker, onClose }: { speaker: Speaker; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="glass-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary/50">
                <Image
                  src={speaker.photo}
                  alt={speaker.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">{speaker.name}</h2>
              <p className="text-muted-foreground">{speaker.affiliation}</p>
            </div>
          </div>

          {/* Biography */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">経歴</h3>
            <p className="text-muted-foreground leading-relaxed">{speaker.biography}</p>
          </div>

          {/* Events */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">登壇イベント</h3>
            <ul className="space-y-2">
              {speaker.events.map((event, index) => (
                <li key={index} className="text-muted-foreground">
                  {event.name}（{event.date}）
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShittokuSpeakersPage() {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)

  return (
    <ContentPageLayout
      title="登壇者紹介"
      level={2}
      levelTitle="自分を知る"
      logo="CBshittoku"
    >
      <div className="glass-card rounded-xl p-6 mb-8">
        <p className="text-muted-foreground leading-relaxed">
          「Cosmo Baseで宇宙知っトク」にご登壇いただいた専門家・愛好家の皆様をご紹介します。
          各登壇者をクリックすると、詳細なプロフィールをご覧いただけます。
        </p>
      </div>

      {/* Speakers Grid */}
      <div className="space-y-4">
        {speakers.map((speaker) => (
          <div
            key={speaker.id}
            onClick={() => setSelectedSpeaker(speaker)}
            className="glass-card rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-all flex items-center gap-4"
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-secondary/50 shrink-0">
              <Image
                src={speaker.photo}
                alt={speaker.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{speaker.name}</h3>
              <p className="text-sm text-muted-foreground">{speaker.affiliation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedSpeaker && (
        <SpeakerModal
          speaker={selectedSpeaker}
          onClose={() => setSelectedSpeaker(null)}
        />
      )}
    </ContentPageLayout>
  )
}
