import { StarBackground } from "@/components/star-background"
import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { LevelSection } from "@/components/level-section"
import { ContentCard } from "@/components/content-card"
import { FooterSection } from "@/components/footer-section"
import { Heart, HelpCircle, Landmark, Newspaper, User, Calendar, MessageCircle, MapPin, Camera, Database, Award, BookOpen, BookMarked } from "lucide-react"

import cbedLogo from "../public/CBED_logo.png"
import cblLogo from "../public/CBL_logo.png" 
import ittekitaLogo from "../public/CBittekita_logo.png" 
import ittoideLogo from "../public/CBittoide_logo.png" 
import newsLogo from "../public/CBnews_logo.png" 
import oshieteLogo from "../public/CBoshiete_logo.png" 
import quizLogo from "../public/CBquiz_logo.png" 
import shittokuLogo from "../public/CBshittoku_logo.png" 
import typeLogo from "../public/CBtype_logo.png" 
import voyagerLogo from "../public/CBvoyager_logo.png"
import cbmdLogo from "../public/CBMD_logo.png"
import cmLogo from "../public/CosmoMatch.png"

// ★ logoプロパティを追加し、インポートした画像をマッピング
const level1Content = [
  {
    icon: "quiz",
    logo: quizLogo,
    title: "毎日宇宙クイズ",
    description: "毎日気軽に宇宙に触れられるクイズ",
    features: ["過去の問題一覧", "クイズ体験ボタン"],
    href: "/quiz"
  },
  {
    icon: "news",
    logo: newsLogo,
    title: "週刊宇宙ニュース",
    description: "1週間の宇宙ニュースを分かりやすく整理",
    features: [],
    href: "/news"
  },
  {
    icon: "diagnosis",
    logo: typeLogo,
    title: "宇宙タイプ診断",
    description: "あなたの宇宙タイプを診断",
    features: ["簡易版", "完全版"],
    href: "/type"
  },
  {
    icon: "Heart",
    logo: cmLogo,
    title: "Cosmo Match",
    description: "あなたの推し○○を探せ",
    features: ["日本のロケット編","88星座編"],
    href: "/cosmomatch"
  }
]

const level2Content = [
  {
    icon: "calendar",
    logo: shittokuLogo,
    title: "Cosmo Baseで宇宙知っトク",
    description: "毎週開催の宇宙イベント・講座",
    features: ["過去イベント一覧", "今後のイベント", "要望フォーム"],
    href: "/shittoku"
  },
  {
    icon: "message",
    logo: oshieteLogo,
    title: "Cosmo Baseで宇宙教えて",
    description: "宇宙の疑問を解決するコミュニティ",
    features: [],
    href: "/oshiete"
  },
  {
    icon: "landmark",
    logo: cbmdLogo,
    title: "Cosmo Base Museum Database",
    description: "日本全国の宇宙関連施設を検索・探索できます。",
    features: [],
    href: "/CBMD"
  },
  {
    icon: "mappin",
    logo: ittoideLogo,
    title: "宇宙に行っといで",
    description: "おすすめ宇宙イベント紹介",
    features: [],
    href: "/ittoide"
  }
]

const level3Content = [
  {
    icon: "camera",
    logo: ittekitaLogo,
    title: "宇宙のイベント行ってきた",
    description: "イベントレポート＆体験共有",
    features: ["カレンダー表示", "イベントデータベース"],
    href: "/ittekita"
  },
  {
    icon: "database",
    logo: cbedLogo,
    title: "Cosmo Base Event Database",
    description: "全国の宇宙イベント一覧",
    features: [],
    href: "/CBED"
  }
]

const level4Content = [
  //{
  //  icon: "glossary",
  //  logo: null,
   // title: "宇宙用語集",
   // description: "宇宙専門用語を3段階で解説するデータベース",
   // features: ["キーワード検索", "カテゴリ・難易度フィルター", "50音索引"],
   // href: "/glossary"
 // },
  {
    icon: "award",
    logo: voyagerLogo,
    title: "Space Voyager 検定",
    description: "宇宙知識を体系的に学び、認定を取得",
    features: ["※毎日宇宙クイズの回答数が20000件を超え次第運営を開始いたします。","検定とは", "レベル構造", "過去の問題", "次回試験日", "申し込み"],
    href: "/voyager"
  },
  {
    icon: "book",
    logo: cblLogo,
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
    case "landmark": return <Landmark className="w-6 h-6" />
    case "mappin": return <MapPin className="w-6 h-6" />
    case "camera": return <Camera className="w-6 h-6" />
    case "database": return <Database className="w-6 h-6" />
    case "award": return <Award className="w-6 h-6" />
    case "book": return <BookOpen className="w-6 h-6" />
    case "glossary": return <BookMarked className="w-6 h-6" />
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
          <LevelSection level={1} title="">
            {level1Content.map((item) => (
              <ContentCard
                key={item.href}
                icon={getIcon(item.icon)}
                logo={item.logo} // ★ ContentCardにロゴ画像を渡す
                title={item.title}
                description={item.description}
                features={item.features}
                href={item.href}
              />
            ))}
          </LevelSection>

          <LevelSection level={2} title="">
            {level2Content.map((item) => (
              <ContentCard
                key={item.href}
                icon={getIcon(item.icon)}
                logo={item.logo}
                title={item.title}
                description={item.description}
                features={item.features}
                href={item.href}
              />
            ))}
          </LevelSection>

          <LevelSection level={3} title="">
            {level3Content.map((item) => (
              <ContentCard
                key={item.href}
                icon={getIcon(item.icon)}
                logo={item.logo}
                title={item.title}
                description={item.description}
                features={item.features}
                href={item.href}
              />
            ))}
          </LevelSection>

          <LevelSection level={4} title="">
            {level4Content.map((item) => (
              <ContentCard
                key={item.href}
                icon={getIcon(item.icon)}
                logo={item.logo}
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
