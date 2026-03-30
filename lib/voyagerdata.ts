// Space Voyager検定 データ（Cosmo Base連携版）

export const navItems = [
  { label: "検定とは", href: "#about" },
  { label: "級・認定", href: "#levels" },
  { label: "出題テーマ", href: "#themes" },
  { label: "得られるもの", href: "#benefits" },
  { label: "Cosmo Base", href: "#cosmo-base" },
  { label: "FAQ", href: "#faq" },
];

export const newsItems = [
  {
    id: 1,
    date: "2026.03.20",
    category: "お知らせ",
    title: "Space Voyager検定 公式サイトをオープンしました",
  },
  {
    id: 2,
    date: "2026.03.15",
    category: "学習",
    title: "Cosmo Baseで検定対策コンテンツの配信を開始",
  },
  {
    id: 3,
    date: "2026.03.10",
    category: "イベント",
    title: "検定説明会をオンラインで開催予定です",
  },
];

// 級・認定データ（2レーン構成）
export const examLevels = [
  {
    id: "5",
    name: "5級",
    subtitle: "入門",
    description: "宇宙への興味を持ち始めた方へ。太陽系の基礎から学べます。",
    requirement: "どなたでも受験可能",
    lane: "exam",
  },
  {
    id: "4",
    name: "4級",
    subtitle: "基礎",
    description: "宇宙の基本知識を体系的に身につけたい方へ。",
    requirement: "どなたでも受験可能",
    lane: "exam",
  },
  {
    id: "3",
    name: "3級",
    subtitle: "標準",
    description: "天文学や宇宙探査について深く学びたい方へ。",
    requirement: "どなたでも受験可能",
    lane: "exam",
  },
  {
    id: "2",
    name: "2級",
    subtitle: "応用",
    description: "宇宙ビジネスや宇宙政策まで幅広く理解したい方へ。",
    requirement: "どなたでも受験可能",
    lane: "exam",
  },
  {
    id: "1",
    name: "1級",
    subtitle: "専門",
    description: "宇宙分野のエキスパートを目指す方へ。",
    requirement: "2級認定者が対象",
    lane: "exam",
  },
  {
    id: "explorer",
    name: "Space Explorer",
    subtitle: "最上位認定",
    description: "宇宙を切り開く冒険者としての上位認定。4択問題に加えて記述を含む総合問題で、深い知識と思考力を問います。",
    requirement: "1級認定者が対象",
    lane: "exam",
  },
];

export const navigatorLevel = {
  id: "navigator",
  name: "Space Navigator",
  subtitle: "コミュニティ活性化認定",
  description: "コミュニティを導き活性化する案内人としての認定。宇宙好きの仲間をつなぎ、学びの輪を広げる役割を担います。",
  requirement: "宇宙に関する検定で1つ以上認定された方が対象",
  lane: "community",
};

// 出題テーマ
export const examThemes = [
  {
    id: "astronomy",
    name: "天文",
    icon: "Star",
    description: "星、銀河、宇宙の構造",
  },
  {
    id: "development",
    name: "宇宙開発",
    icon: "Rocket",
    description: "ロケット、人工衛星、ISS",
  },
  {
    id: "business",
    name: "宇宙ビジネス",
    icon: "Briefcase",
    description: "民間宇宙産業、衛星利用",
  },
  {
    id: "history",
    name: "歴史",
    icon: "History",
    description: "宇宙探査の歴史、人類の挑戦",
  },
  {
    id: "policy",
    name: "宇宙政策",
    icon: "Scale",
    description: "宇宙法、国際協力",
  },
  {
    id: "exploration",
    name: "宇宙探査",
    icon: "Compass",
    description: "月、火星、深宇宙探査",
  },
  {
    id: "basics",
    name: "宇宙基礎",
    icon: "BookOpen",
    description: "宇宙の基本原理、科学",
  },
];

// 試験概要
export const examOverview = {
  format: "4択問題（Space Explorerは4択＋記述の総合問題）",
  themeSelection: "毎回7テーマの中から5テーマを選択",
  questionsPerTheme: 10,
  totalQuestions: 50,
  duration: 100,
  announcement: "テーマ構成は試験の2か月前までに公開",
  method: "オンライン/オフライン両対応を予定",
};

// 得られるもの
export const benefits = [
  {
    id: 1,
    title: "認定証・認定書",
    description: "合格すると受験認定書、認定後は正式な認定証が届きます。",
    icon: "Award",
  },
  {
    id: 2,
    title: "回答データ・分析",
    description: "自分の回答データや認定率などの分析結果を確認できます。",
    icon: "BarChart",
  },
  {
    id: 3,
    title: "コミュニティ内ロール",
    description: "Cosmo Baseでの認定者ロールが付与されます。",
    icon: "UserCheck",
  },
  {
    id: 4,
    title: "認定者チャンネル",
    description: "認定者限定のチャンネルに招待されます。",
    icon: "MessageCircle",
  },
  {
    id: 5,
    title: "学びの現在地",
    description: "自分の宇宙知識がどのレベルにあるか可視化できます。",
    icon: "Target",
  },
  {
    id: 6,
    title: "より深い参加",
    description: "Cosmo Baseでの会話や活動がより深く楽しくなります。",
    icon: "Users",
  },
];

// Cosmo Base連携コンテンツ
export const cosmoBaseFeatures = [
  {
    id: "quiz",
    title: "毎日宇宙クイズ",
    description: "毎日配信される宇宙クイズで知識をチェック",
    icon: "HelpCircle",
  },
  {
    id: "news",
    title: "週刊宇宙ニュース",
    description: "最新の宇宙ニュースをわかりやすく解説",
    icon: "Newspaper",
  },
  {
    id: "tips",
    title: "宇宙知っトク",
    description: "知って得する宇宙のトリビアを毎週お届け",
    icon: "Lightbulb",
  },
  {
    id: "ED",
    title: "Event Database",
    description: "イベントに行って宇宙の知識をインプット",
    icon: "Calendar",
  },
  {
    id: "library",
    title: "ライブラリ",
    description: "学習に役立つ資料やリンク集",
    icon: "Library",
  },
  {
    id: "exam",
    title: "Space Voyager検定",
    description: "学んだ知識を体系化して確認",
    icon: "GraduationCap",
  },
];

// FAQ
export const faqItems = [
  {
    question: "宇宙初心者でも受験できますか？",
    answer: "はい、もちろんです。5級は宇宙への興味を持ち始めた方向けの入門レベルです。Cosmo Baseの毎日宇宙クイズや宇宙知っトクで楽しみながら学んでいただくと、自然と受験準備になります。",
  },
  {
    question: "どの級から受ければよいですか？",
    answer: "宇宙にあまり詳しくない方は5級から、ある程度知識がある方は4級や3級からスタートするのがおすすめです。どの級からでも受験可能です（1級とSpace Explorerを除く）。",
  },
  {
    question: "1級の受験条件はありますか？",
    answer: "1級は2級認定者が対象です。Space Explorerは1級認定者が対象となります。段階的にステップアップしていく形式です。",
  },
  {
    question: "Space Explorerとは何ですか？",
    answer: "宇宙を切り開く冒険者としての最上位認定です。4択問題に加えて記述を含む総合問題で、深い知識と思考力を問います。1級認定者が対象です。",
  },
  {
    question: "Space Navigatorとは何ですか？",
    answer: "コミュニティを導き活性化する案内人としての認定です。宇宙に関する検定で1つ以上認定された方が対象で、宇宙好きの仲間をつなぎ、学びの輪を広げる役割を担います。",
  },
  /*{
    question: "Cosmo Baseに参加していなくても受験できますか？",
    answer: "はい、受験自体はCosmo Baseへの参加に関わらず可能です。ただし、認定後のコミュニティロール付与や認定者チャンネルへの招待などの特典は、Cosmo Base参加者向けとなります。",
  },*/
  {
    question: "学習コンテンツはありますか？",
    answer: "Cosmo Baseでは毎日宇宙クイズ、週刊宇宙ニュース、宇宙知っトクなど、楽しみながら学べるコンテンツを提供しています。検定対策にもなる学習ライブラリも準備中です。",
  },
];

// フッターリンク
export const footerLinks = {
  about: [
    { label: "Space Voyager検定とは", href: "#about" },
    { label: "級・認定について", href: "#levels" },
    { label: "出題テーマ", href: "#themes" },
  ],
  support: [
    { label: "よくある質問", href: "#faq" },
    { label: "お問い合わせ", href: "#contact" },
  ],
  cosmoBase: [
    { label: "Cosmo Baseとは", href: "#cosmo-base" },
    { label: "コミュニティに参加", href: "#" },
  ],
};

// クイズサンプル
export const quizQuestion = {
  question: "国際宇宙ステーション（ISS）は地球の上空およそ何kmを周回していますか？",
  options: [
    "約100km",
    "約400km",
    "約1,000km",
    "約36,000km",
  ],
  correctIndex: 1,
  explanation: "ISSは地球の上空約400kmを周回しています。これは低軌道（LEO）と呼ばれる領域で、約90分で地球を1周します。ちなみに36,000kmは静止軌道の高度です。",
};
