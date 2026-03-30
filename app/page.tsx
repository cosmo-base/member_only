import { StarBackground } from "@/components/star-background"
import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { LevelSection } from "@/components/level-section"
import { ContentCard } from "@/components/content-card"
import { FooterSection } from "@/components/footer-section"
import { HelpCircle,Newspaper,User,Calendar,MessageCircle,MapPin,Camera,Database,Award,BookOpen} from "lucide-react"

// Define content data with proper encoding
const level1Content = [
  {
    icon: "quiz",
    title: "毎日宇宙クイズ",
    description: "毎日気軽に宇宙に触れられるクイズ",
    features: ["過去の問題一覧", "クイズ体験ボタン"],
    href: "/quiz"
  },
  {
    icon: "news",
    title: "週刊宇宙ニュース",
    description: "1週間の宇宙ニュースを分かりやすく整理",
    features: [],
    href: "/news"
  },
  {
    icon: "diagnosis",
    title: "宇宙タイプ診断",
    description: "あなたの宇宙タイプを診断",
    features: ["簡易版", "完全版"],
    href: "/type"
  }
]

const level2Content = [
  {
    icon: "calendar",
    title: "Cosmo Baseで宇宙知っトク",
    description: "毎週開催の宇宙イベント・講座",
    features: ["過去イベント一覧", "今後のイベント", "要望フォーム"],
    href: "/shittoku"
  },
  {
    icon: "message",
    title: "Cosmo Baseで宇宙教えて",
    description: "宇宙の疑問を解決するコミュニティ",
    features: [],
    href: "/oshiete"
  },
  {
    icon: "mappin",
    title: "宇宙に行っといで",
    description: "おすすめ宇宙イベント紹介",
    features: [],
    href: "/ittoide"
  }
]

const level3Content = [
  {
    icon: "camera",
    title: "宇宙のイベント行ってきた",
    description: "イベントレポート＆体験共有",
    features: ["カレンダー表示", "イベントデータベース"],
    href: "/ittekita"
  },
  {
    icon: "database",
    title: "Cosmo Base Event Database",
    description: "全国の宇宙イベント一覧",
    features: [],
    href: "/CBED"
  }
]

const level4Content = [
  {
    icon: "award",
    title: "Space Voyager 検定",
    description: "宇宙知識を体系的に学び、認定を取得",
    features: ["検定とは", "レベル構造", "過去の問題", "次回試験日", "申し込み"],
    href: "/voyager"
  },
  {
    icon: "book",
    title: "Cosmo Base Library",
    description: "宇宙の知識を体系的に整理したライブラリ",
    features: ["カテゴリ別学習", "記事・動画コンテンツ", "ブックマーク機能"],
    href: "/library"
  }
]

function getIcon(iconName: string) {
  switch (iconName) {
    case "quiz": return <HelpCircle className="w-6 h-6" />
    case "news": return <Newspaper className="w-6 h-6" />
    case "diagnosis": return <User className="w-6 h-6" />
    case "calendar": return <Calendar className="w-6 h-6" />
    case "message": return <MessageCircle className="w-6 h-6" />
    case "mappin": return <MapPin className="w-6 h-6" />
    case "camera": return <Camera className="w-6 h-6" />
    case "database": return <Database className="w-6 h-6" />
    case "award": return <Award className="w-6 h-6" />
    case "book": return <BookOpen className="w-6 h-6" />
    default: return <HelpCircle className="w-6 h-6" />
  }
}

export default function CosmoBasePage() {
  return (
    <div className="relative min-h-screen">
      <StarBackground />
      
      <main className="relative z-10">
        <SiteHeader />
        <HeroSection />
        
        <div className="max-w-5xl mx-auto px-4 mt-8">
          <LevelSection level={1} title="習慣化・体験">
            {level1Content.map((item) => (
              <ContentCard
                key={item.href}
                icon={getIcon(item.icon)}
                title={item.title}
                description={item.description}
                features={item.features}
                href={item.href}
              />
            ))}
          </LevelSection>

          <LevelSection level={2} title="対話・学習">
            {level2Content.map((item) => (
              <ContentCard
                key={item.href}
                icon={getIcon(item.icon)}
                title={item.title}
                description={item.description}
                features={item.features}
                href={item.href}
              />
            ))}
          </LevelSection>

          <LevelSection level={3} title="現実世界との接続">
            {level3Content.map((item) => (
              <ContentCard
                key={item.href}
                icon={getIcon(item.icon)}
                title={item.title}
                description={item.description}
                features={item.features}
                href={item.href}
              />
            ))}
          </LevelSection>

          <LevelSection level={4} title="知識の体系化">
            {level4Content.map((item) => (
              <ContentCard
                key={item.href}
                icon={getIcon(item.icon)}
                title={item.title}
                description={item.description}
                features={item.features}
                href={item.href}
              />
            ))}
          </LevelSection>
        </div>

        <FooterSection />
      </main>
    </div>
  )
}
