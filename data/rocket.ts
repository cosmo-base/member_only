// src/data/rocket.ts

export interface RocketStats {
  power: number;
  technology: number;
  history: number;
  ace: number;
  challenge: number;
  individuality: number;
  future: number;
  trust: number;
}

export interface Rocket {
  slug: string;
  name: string;
  emoji: string;
  catchCopy: string;
  country: string;
  status: "active" | "retired";
  category: string;
  stats: RocketStats;
  highlights: string[];
  story: {
    origin: string;
    struggle: string;
    today: string;
  };
  relatedRockets: string[]; // 関連ロケットのslug配列
  articleLinks: { title: string; url: string }[]; // CBL記事リンク
}

export interface Choice {
  text: string;
  score: Partial<RocketStats>;
}

export interface Question {
  id: number;
  title: string;
  choices: Choice[];
}

export const ROCKETS: Rocket[] = [
  {
    slug: "h3",
    name: "H3ロケット",
    emoji: "🚀",
    catchCopy: "日本の宇宙輸送を担う新世代の王道エース",
    country: "日本",
    status: "active",
    category: "大型液体ロケット",
    stats: { power: 5, technology: 4, history: 1, ace: 5, challenge: 4, individuality: 2, future: 5, trust: 3 },
    highlights: [
      "日本の新しい大型主力（基幹）ロケット",
      "コストを従来の半分に抑え、ビジネスとしての宇宙を目指す",
      "これからの日本の宇宙開発の中心を担う絶対的存在"
    ],
    story: {
      origin: "長年活躍したH-IIAロケットの後継機として、日本の宇宙輸送の自立性を維持しつつ、世界の商業衛星ビジネスで勝ち残るために開発がスタートしました。",
      struggle: "主エンジン「LE-9」の開発で未知の技術的困難に直面。設計変更を余儀なくされ、打上げ延期を繰り返した末の初号機での苦い経験など、数々の試練を乗り越えてきました。",
      today: "試験機2号機の打上げ成功以降、日本の次世代のエースとして、民間衛星の打ち上げから月探査プロジェクトへの物資輸送まで、日本の未来を背負って稼働しています。"
    },
    relatedRockets: ["h2a", "epsilon"],
    articleLinks: [
      { title: "H3ロケット開発の歴史とLE-9エンジン", url: "https://cosmo-base.github.io/library/" },
      { title: "日本の基幹ロケットの系譜", url: "https://cosmo-base.github.io/library/" }
    ]
  },
  {
    slug: "epsilon",
    name: "イプシロン",
    emoji: "🚀",
    catchCopy: "小さな機体に、驚くほど濃い個性",
    country: "日本",
    status: "active",
    category: "小型固体ロケット",
    stats: { power: 2, technology: 5, history: 3, ace: 2, challenge: 4, individuality: 5, future: 3, trust: 4 },
    highlights: [
      "モバイル管制を可能にした、スマートな高性能固体ロケット",
      "世界に誇る日本の「固体燃料」の伝統と高い技術の結晶",
      "コンパクトながらも小回りがきく機動性の高さ"
    ],
    story: {
      origin: "世界最高峰の性能を誇ったM-VロケットのDNAを受け継ぎ、「もっと手軽に、もっと安く小型衛星を打ち上げる」という思想のもと誕生しました。",
      struggle: "パソコン数台でロケットを自動点検・管制する「モバイル管制」という世界初の革新的なシステムを実装するため、従来の運用の常識をゼロから覆す開発が行われました。",
      today: "大学の小型探査機やベンチャー企業の衛星など、ライトでスピーディーな打ち上げニーズに応える唯一無二の個性派として絶大な支持を集めています。"
    },
    relatedRockets: ["h3", "kairos"],
    articleLinks: [{ title: "イプシロンロケットと固体燃料の魅力", url: "https://cosmo-base.github.io/library/" }]
  },
  {
    slug: "h2a",
    name: "H-IIAロケット",
    emoji: "🚀",
    catchCopy: "長く日本の宇宙開発を支え続けた信頼のベテラン",
    country: "日本",
    status: "active", // 退役間近ですが現役稼働中
    category: "大型液体ロケット",
    stats: { power: 4, technology: 4, history: 5, ace: 4, challenge: 2, individuality: 2, future: 1, trust: 5 },
    highlights: [
      "98%を超える、世界最高水準の打上げ成功率",
      "「はやぶさ2」や「あかつき」など伝説の探査機を送り出した名機",
      "日本の宇宙開発の信頼性を世界に知らしめた金字塔"
    ],
    story: {
      origin: "国産にこだわったH-IIロケットの失敗を受け、その高い技術をベースにしつつ、信頼性の向上と製造コストの削減を両立させるために開発されました。",
      struggle: "6号機での打上げ失敗という最大の危機を経験。そこから徹底的な原因究明と品質管理の改善を重ねた結果、その後40機以上連続成功という驚異の記録を樹立しました。",
      today: "間もなく引退を迎えるベテランですが、その完璧な仕事ぶりは日本の宇宙史に刻まれており、H3へとバトンを繋ぐ最後のミッションへと向かっています。"
    },
    relatedRockets: ["h3"],
    articleLinks: [{ title: "名機H-IIAロケットの軌跡とはやぶさの物語", url: "https://cosmo-base.github.io/library/" }]
  }
]