export type DifficultyLevel = 1 | 2 | 3
export type CategoryLarge =
  | "宇宙輸送・ロケット"
  | "人工衛星・探査機"
  | "軌道・宇宙環境"
  | "宇宙ビジネス・法規制"
  | "衛星データ・利用"
  | "天文学・宇宙科学"

export type GlossaryStatus = "未着手" | "AI生成済" | "レビュー中" | "公開済"

export interface GlossaryTerm {
  slug: string              // URL用スラグ（英数字・ハイフン）
  term: string              // 用語名（日本語）
  kana: string              // 読み仮名
  english: string           // 英語表記
  aliases?: string[]        // 表記ゆれ・エイリアス
  categoryLarge: CategoryLarge
  categoryMedium: string
  categorySmall: string
  difficulty: DifficultyLevel
  textLv1?: string
  textLv2?: string
  textLv3?: string
  internal?: string[]       // 本文中の[]リンク先用語
  related?: string[]        // 関連用語
  opposite?: string[]       // 対義語
  similar?: string[]        // 類義語
  status: GlossaryStatus
  credit?: string
}

export const CATEGORY_LARGE_LIST: CategoryLarge[] = [
  "宇宙輸送・ロケット",
  "人工衛星・探査機",
  "軌道・宇宙環境",
  "宇宙ビジネス・法規制",
  "衛星データ・利用",
  "天文学・宇宙科学",
]

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  1: "★☆☆ 初級",
  2: "★★☆ 中級",
  3: "★★★ 上級",
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "artificial-satellite",
    term: "人工衛星",
    kana: "じんこうえいせい",
    english: "Artificial Satellite",
    aliases: ["衛星"],
    categoryLarge: "人工衛星・探査機",
    categoryMedium: "衛星の用途",
    categorySmall: "通信・観測・測位",
    difficulty: 1,
    textLv1:
      "人間が作って宇宙に打ち上げた機械で、地球の周りをぐるぐると回り続けています。カーナビのGPSやテレビの衛星放送、天気予報の雲の画像も、すべてこの人工衛星が空の上から届けてくれています。いわば、宇宙に浮かぶ「生活を支えるインフラ」です。",
    textLv2:
      "[ロケット]で打ち上げられ、地球の重力に引かれながら一定速度で周回し続ける人工物体です。高度によって[低軌道]・[静止軌道]など軌道の種類が分かれており、目的に合わせて使い分けられます。通信・気象観測・測位（GPS）・地球観測・科学研究など幅広い用途があり、現在地球周辺には数千機以上が稼働しています。私たちの日常生活を静かに、しかし確実に支える社会インフラです。",
    textLv3:
      "人工衛星（Artificial Satellite）とは、第一宇宙速度（約7.9 km/s）以上の速度で軌道に投入された人工天体の総称である。軌道種別によりLEO・MEO・GEO・HEO等に分類され、用途・コスト・カバレッジの観点から最適軌道が選定される。2020年代以降はStarlink・OneWebをはじめとするLEOコンステレーションの急拡大により、全衛星数が数万機規模へ増加し、[スペースデブリ]問題や天文観測への影響が国際的課題となっている。商業衛星の製造・打ち上げ・運用にはITAR（国際武器取引規制）やEAR（輸出管理規則）が適用されるケースがあり、各国の宇宙活動法・電波法に基づく許認可取得も必須となる。",
    internal: ["ロケット", "低軌道", "静止軌道", "スペースデブリ"],
    related: ["ロケット", "低軌道", "静止軌道", "スペースデブリ", "コンステレーション"],
    status: "公開済",
    credit: "Cosmo Base運営",
  },
  {
    slug: "rocket",
    term: "ロケット",
    kana: "ろけっと",
    english: "Rocket / Launch Vehicle",
    aliases: ["打ち上げロケット", "ロケット打ち上げ機"],
    categoryLarge: "宇宙輸送・ロケット",
    categoryMedium: "輸送システム",
    categorySmall: "使い捨て型・再使用型",
    difficulty: 1,
    textLv1:
      "ものすごい勢いで燃料を燃やして、その反動で空高く飛び上がる乗り物です。新幹線の最高速度が時速約320kmなのに対し、宇宙に行くロケットは時速約28,000kmという、想像を超えるスピードで飛びます。宇宙への唯一の「乗り物」といえます。",
    textLv2:
      "燃料（推進剤）を燃やして噴出するガスの反力（推力）で上昇する飛翔体で、[人工衛星]や探査機を宇宙へ届ける唯一の手段です。多段式構造が一般的で、燃料を使い切った段ごとに切り離すことで効率よく加速します。かつては使い捨てが主流でしたが、SpaceXのFalconシリーズなど「再使用型ロケット」の実用化が進み、打ち上げコストの大幅な低減が実現されています。",
    textLv3:
      "ロケット（Launch Vehicle / Rocket）は推進剤の燃焼による反作用推力で飛行する宇宙輸送機である。軌道投入に必要な速度（第一宇宙速度：約7.9 km/s）を得るため、多段式構造（マルチステージ）を採用し、各段を分離しながら加速する。推進剤の種類により液体燃料・固体燃料・ハイブリッド型に分類され、比推力（Isp）が性能指標となる。2010年代以降、Falcon 9の第1段回収・再利用がコストパラダイムを変革し、2020年代には[再使用型ロケット]が標準的なビジネスモデルへ移行しつつある。日本ではJAXAのH3ロケットが基幹ロケットとして開発・運用されており、民間ではインターステラテクノロジズ（IST）がZERO等の開発を進めている。",
    internal: ["人工衛星", "再使用型ロケット"],
    related: ["人工衛星", "ペイロード", "射場", "再使用型ロケット"],
    status: "公開済",
    credit: "Cosmo Base運営",
  },
  {
    slug: "iss",
    term: "国際宇宙ステーション",
    kana: "こくさいうちゅうすてーしょん",
    english: "International Space Station (ISS)",
    aliases: ["ISS"],
    categoryLarge: "軌道・宇宙環境",
    categoryMedium: "宇宙環境",
    categorySmall: "微小重力",
    difficulty: 1,
    textLv1:
      "地球から約400km上空を飛んでいる、サッカーグラウンドほどの大きさを持つ巨大な宇宙の実験施設です。宇宙飛行士が長期間生活しながら、地球上ではできない実験や研究を行っています。晴れた夜空を見上げると、明るい光の点として肉眼でも見ることができます。",
    textLv2:
      "地球の[低軌道]（高度約400km）を約90分で1周しながら飛行する、常駐型の宇宙実験施設です。アメリカ・ロシア・日本・欧州・カナダが協力して建設・運用しており、1998年から建設が始まりました。日本が担当する実験棟「きぼう」は最大の実験モジュールのひとつです。微小重力環境を活かした医学・生命科学・材料科学などの研究が行われています。",
    textLv3:
      "ISSは高度約408 kmのLEOを軌道傾斜角51.6°で周回する国際共同宇宙実験施設である。米国NASAが主導し、ロシア（ロスコスモス）・日本（JAXA）・欧州（ESA）・カナダ（CSA）の15か国が参加するパートナーシップで運用される。日本実験棟「きぼう」（JEM: Japanese Experiment Module）はISS最大のモジュールであり、船内実験室・船外実験プラットフォーム・船内保管室で構成される。現在のISSは2030年前後の退役が計画されており、NASAはAxiom SpaceやBlue Origin等の民間企業による後継商業宇宙ステーション（CSS）への移行を推進している。",
    internal: ["低軌道"],
    related: ["低軌道", "宇宙飛行士", "微小重力", "きぼう"],
    status: "公開済",
    credit: "Cosmo Base運営",
  },
  {
    slug: "leo",
    term: "低軌道",
    kana: "ていきどう",
    english: "Low Earth Orbit (LEO)",
    aliases: ["LEO", "地球低軌道"],
    categoryLarge: "軌道・宇宙環境",
    categoryMedium: "軌道の種類",
    categorySmall: "LEO",
    difficulty: 2,
    textLv1:
      "地球から約200〜2,000kmという比較的近い場所にある宇宙の「道」です。東京から博多までの距離（約1,100km）が宇宙の上に広がっているイメージです。[国際宇宙ステーション]もこのあたりを飛んでいます。",
    textLv2:
      "地球表面から高度約200〜2,000kmの範囲を指す軌道帯です。高度が低いため[ロケット]の打ち上げコストが安く、地球との通信遅延も少ないという利点があります。一方で、大気抵抗の影響で徐々に高度が下がるため、[人工衛星]は定期的に軌道を修正する必要があります。[国際宇宙ステーション]や地球観測衛星の多くがこの軌道に存在します。",
    textLv3:
      "LEO（Low Earth Orbit）は高度約160〜2,000 kmの軌道帯であり、大気圏外かつヴァン・アレン帯の下部に位置する。打ち上げデルタV（ΔV）が低く、通信遅延が約20〜40 msであることから、コンステレーション衛星・有人ミッション・地球観測に多用される。一方、残留大気（原子状酸素等）による軌道減衰が生じるため、衛星寿命設計において推進系によるステーションキーピングが不可欠である。SpaceXのStarlinkは2024年時点で約6,000機以上をLEOに展開しており、周波数・軌道スロットの国際調整（ITU調整）や[スペースデブリ]リスク管理が急務となっている。",
    internal: ["国際宇宙ステーション", "ロケット", "人工衛星", "スペースデブリ"],
    related: ["静止軌道", "太陽同期軌道", "スペースデブリ", "コンステレーション"],
    opposite: ["静止軌道"],
    status: "公開済",
    credit: "Cosmo Base運営",
  },
  {
    slug: "geo",
    term: "静止軌道",
    kana: "せいしきどう",
    english: "Geostationary Orbit (GEO)",
    aliases: ["GEO", "静止衛星軌道"],
    categoryLarge: "軌道・宇宙環境",
    categoryMedium: "軌道の種類",
    categorySmall: "GEO",
    difficulty: 2,
    textLv1:
      "地球から約36,000km（東京〜ニューヨーク間を約3往復した距離）上空にある特別な宇宙の「道」です。この高さでは衛星の速度と地球の自転速度がぴったり合うため、地上から見ると衛星がいつも空の同じ場所に止まって見えます。テレビの衛星放送やBS放送はここから届いています。",
    textLv2:
      "赤道上空、高度約35,786kmの特定の軌道を指します。この高度では[人工衛星]の周回周期（約24時間）が地球の自転周期と完全に一致するため、地上から見ると衛星が常に空の同じ位置に静止しているように見えます。アンテナを常時向け続けられるため、放送・通信衛星に最適な軌道です。ただし、地球から遠いため打ち上げコストが高く、通信遅延も約0.24秒と大きくなります。",
    textLv3:
      "GEO（Geostationary Earth Orbit）は赤道上の高度約35,786 kmに存在する唯一の円形軌道であり、軌道周期が地球自転周期（恒星日：23時間56分4秒）に一致する。コヴェナント軌道とも呼ばれるクラーク軌道（Arthur C. Clarkeが1945年に提唱）に由来し、全世界をカバーする放送・通信衛星が集中している。軌道スロットはITU（国際電気通信連合）が管理し、軌道位置の申請・調整には国際的な先着登録制度が適用される。GEO衛星は寿命末期（EOL: End of Life）に推進剤を消費してグレーヤードオービット（Graveyard Orbit: 高度+300 km程度）へ移動する慣行があり、長期的なデブリリスク管理が国際的に議論されている。",
    internal: ["人工衛星"],
    related: ["低軌道", "太陽同期軌道", "通信衛星"],
    opposite: ["低軌道"],
    status: "公開済",
    credit: "Cosmo Base運営",
  },
  {
    slug: "payload",
    term: "ペイロード",
    kana: "ぺいろーど",
    english: "Payload",
    categoryLarge: "宇宙輸送・ロケット",
    categoryMedium: "機体構造・部品",
    categorySmall: "フェアリング",
    difficulty: 2,
    textLv1:
      "宅配便でいう「荷物」に当たる部分です。[ロケット]が宇宙へ運んでいくもの（[人工衛星]・探査機・補給物資など）のことをペイロードと呼びます。ロケット本体はあくまで「宅配トラック」であり、ペイロードこそが本来の目的物です。",
    textLv2:
      "[ロケット]が宇宙へ運ぶ積み荷全般を指す言葉です。[人工衛星]・宇宙探査機・宇宙ステーションへの補給物資・有人宇宙船など、ミッションの目的物すべてがペイロードに含まれます。ロケットの性能はしばしば「ある軌道への最大ペイロード能力（kg）」で表現されます。ペイロードはロケット先端のフェアリング（先端カバー）に格納され、打ち上げ後に宇宙空間でフェアリングが開いて分離されます。",
    textLv3:
      "ペイロード（Payload）はミッション目的物の総称であり、宇宙輸送の文脈ではロケットが軌道上へ投入する衛星・探査機・有人宇宙船等を指す。性能指標として「打ち上げ能力（Launch Capacity）」が用いられ、LEO・GTO（静止遷移軌道）・TLI（月遷移軌道）ごとに最大搭載質量（kg）が定義される。商業打ち上げ市場では複数の顧客衛星を一括輸送するライドシェア（相乗り）ビジネスが拡大しており、SpaceXのTransporterミッションやRocket Labのライドシェアサービスが代表例である。衛星側のペイロードという文脈ではバス機器（電源・姿勢制御等）に対するミッション固有の機器（センサ・通信機器等）を指すこともあり、文脈による意味の使い分けが必要である。",
    internal: ["ロケット", "人工衛星"],
    related: ["ロケット", "フェアリング", "ライドシェア", "打ち上げ能力"],
    status: "公開済",
    credit: "Cosmo Base運営",
  },
  {
    slug: "space-debris",
    term: "スペースデブリ",
    kana: "すぺーすでぶり",
    english: "Space Debris / Orbital Debris",
    aliases: ["宇宙ゴミ", "宇宙デブリ", "軌道デブリ"],
    categoryLarge: "軌道・宇宙環境",
    categoryMedium: "宇宙ハザード",
    categorySmall: "スペースデブリ",
    difficulty: 2,
    textLv1:
      "宇宙に浮かんだままになっているゴミのことです。役目を終えた古い[人工衛星]や、[ロケット]の燃え殻などが宇宙を漂っています。ピストルの弾の10倍以上の速さ（時速約28,000km）で飛び続けるため、現役の衛星にぶつかると大変危険です。",
    textLv2:
      "役割を終えた[人工衛星]、[ロケット]の上段、打ち上げ時の破片など、地球軌道上を漂う人工的な廃棄物の総称です。現在、追跡可能な10cm以上のデブリだけで約3万個以上が軌道上に存在するとされています。これらは時速約28,000kmで飛行しており、現役の衛星や[国際宇宙ステーション]に衝突すると壊滅的な損害を与えます。デブリ問題は宇宙開発の持続可能性に関わる重要な国際課題です。",
    textLv3:
      "スペースデブリ（Space Debris / Orbital Debris）は地球軌道上に残留する人工物体の総称であり、追跡対象（10 cm以上）は約3万個、1 cm以上は約100万個、1 mm以上は数億個と推定されている（NASA/ESAデータ、2020年代）。LEOでの相対速度は最大約15 km/s（対向軌道時）に達し、1 cmのデブリが金属ブロックに与える衝撃はリフル弾に相当するエネルギーを持つ。[ケスラーシンドローム]はデブリ密度が臨界点を超えた際に衝突による破砕→新たなデブリの連鎖崩壊が自己持続するシナリオであり、LEOの長期利用を脅かすリスクとして認識されている。対策技術としてADR（Active Debris Removal）開発が各国で進んでおり、日本のアストロスケール社のELSAミッションが先駆的事例として注目されている。",
    internal: ["人工衛星", "ロケット", "国際宇宙ステーション", "ケスラーシンドローム"],
    related: ["ケスラーシンドローム", "低軌道", "ADR", "アストロスケール"],
    status: "公開済",
    credit: "Cosmo Base運営",
  },
  {
    slug: "new-space",
    term: "ニュースペース",
    kana: "にゅーすぺーす",
    english: "New Space / NewSpace",
    categoryLarge: "宇宙ビジネス・法規制",
    categoryMedium: "ビジネスモデル",
    categorySmall: "ニュースペース",
    difficulty: 2,
    textLv1:
      "かつて国や大企業だけのものだった宇宙ビジネスに、スタートアップや新興企業が次々と参入し、新しいアイデアや低コストな技術で宇宙産業を塗り替えていこうとする動きのことです。スマートフォンが電話の概念を変えたように、宇宙業界でもイノベーションの波が押し寄せています。",
    textLv2:
      "2000年代以降に登場した民間主導の宇宙産業の新潮流を指します。SpaceX・Blue Originのような企業が登場し、[ロケット]の再使用化・小型衛星の大量展開・宇宙旅行など、従来の官主導モデルでは考えられなかった革新的な技術やビジネスモデルが次々と生まれています。日本でも同様の流れが生まれており、インターステラテクノロジズや宇宙ベンチャー各社が宇宙産業への新規参入を果たしています。",
    textLv3:
      "ニュースペース（New Space）は政府・宇宙機関主導（Old Space）に対する、民間ベンチャー主導の宇宙開発エコシステムを指す概念的用語である。Elon Musk（SpaceX, 2002年設立）とJeff Bezos（Blue Origin, 2000年設立）が象徴的牽引者であり、再使用ロケット・小型衛星コンステレーション・宇宙観光・軌道上サービスなど従来の宇宙調達モデルに依存しないビジネスが台頭した。資金調達面では宇宙スタートアップへのVC投資が2021年に過去最高の約175億ドルに達し、SPACを通じた上場事例も相次いだ。日本では2018年の宇宙活動法施行・2020年代の宇宙基本計画等を背景に、政府が打ち上げ・観測・データ利用の官民共創を推進しており、宇宙戦略基金（2024年創設）が民間への資金供給を加速させている。",
    internal: ["ロケット"],
    related: ["宇宙ベンチャー", "コンステレーション", "再使用型ロケット", "宇宙基本計画"],
    status: "公開済",
    credit: "Cosmo Base運営",
  },
  {
    slug: "kessler-syndrome",
    term: "ケスラーシンドローム",
    kana: "けすらーしんどろーむ",
    english: "Kessler Syndrome",
    categoryLarge: "軌道・宇宙環境",
    categoryMedium: "宇宙ハザード",
    categorySmall: "スペースデブリ",
    difficulty: 3,
    textLv2:
      "[スペースデブリ]が増え続けた末に起こる「連鎖崩壊」シナリオです。デブリが[人工衛星]に衝突→粉砕されて新たなデブリが大量発生→そのデブリがまた別の衛星に衝突…というドミノ倒しが自動的に続き、特定の軌道が永久に使えなくなる状態を指します。宇宙利用の持続可能性に関わる最も深刻なリスクのひとつです。",
    textLv3:
      "ケスラーシンドローム（Kessler Syndrome）は、1978年にNASAの科学者Donald J. Kesslerが提唱した軌道デブリの連鎖崩壊モデルである。軌道上の[スペースデブリ]密度が臨界値を超えた場合、衝突→破砕→新規デブリ増加という正フィードバックループが形成され、外部入力なしに自己増殖的にデブリが増加し続ける状態となる。特にLEO（高度600〜800 km帯）での発生リスクが高く、2009年のコスモス2251・イリジウム33衝突事故はその現実性を示した典型例である。この状態が実現した場合、該当軌道帯の長期利用が事実上不可能になり、[GPS]・気象衛星・通信インフラ全体が機能不全に陥るリスクがある。対策として国連COPUOS（宇宙空間平和利用委員会）のデブリ低減ガイドライン（寿命25年以内の軌道離脱等）が策定されているが、法的拘束力を持たない課題も残る。",
    internal: ["スペースデブリ", "人工衛星", "GPS"],
    related: ["スペースデブリ", "ADR", "低軌道", "宇宙条約"],
    status: "公開済",
    credit: "Cosmo Base運営",
  },
  {
    slug: "remote-sensing",
    term: "リモートセンシング",
    kana: "りもーとせんしんぐ",
    english: "Remote Sensing",
    categoryLarge: "衛星データ・利用",
    categoryMedium: "観測技術",
    categorySmall: "光学センサ・SAR",
    difficulty: 2,
    textLv1:
      "直接触れることなく、離れた場所から対象を観測する技術です。お医者さんが体を切らずにレントゲンで体内を調べるように、宇宙から地球の状態（農作物の育ち具合、海面の温度、被災地の状況など）を離れたまま詳しく調べることができます。",
    textLv2:
      "地上から離れた場所（主に[人工衛星]や航空機）で地球表面を観測し、データを取得する技術の総称です。可視光・赤外線・電波（SAR）など様々な波長を使い分けることで、農作物の生育状況・海面水温・洪水被害の範囲・森林の変化など、地上では把握しにくい広域の情報を短時間で収集できます。農業・防災・環境監視・インフラ管理など様々な分野で活用されています。",
    textLv3:
      "リモートセンシング（Remote Sensing）は電磁波を媒介として対象物と直接接触せずに情報を取得する観測技術の総称であり、宇宙からの地球観測に広く応用される。センサ種別により、パッシブセンサ（光学・赤外線）とアクティブセンサ（SAR: Synthetic Aperture Radar・LiDAR）に大別される。SARは昼夜・雲天候に依存しない全天候型観測が可能であり、ALOS-2（だいち2号）やSentinel-1等が実用衛星として稼働している。取得データの解析にはGISとの統合・機械学習モデルの適用が進んでおり、農業分野ではスマート農業（精密農業）、インフラ分野では地盤沈下・橋梁変位の監視、防災分野では浸水域マッピングへの応用が実用化段階にある。データの商用利用にはライセンス条件の確認が必要であり、Copernicus（ESA）のオープンデータポリシーと商業衛星のプロプライエタリデータの使い分けが重要なビジネス要素となっている。",
    internal: ["人工衛星"],
    related: ["SAR衛星", "GIS", "地球観測", "スマート農業"],
    status: "公開済",
    credit: "Cosmo Base運営",
  },
]

export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug)
}

export function getAllSlugs(): string[] {
  return glossaryTerms.map((t) => t.slug)
}

export function searchTerms(query: string): GlossaryTerm[] {
  const q = query.toLowerCase()
  return glossaryTerms.filter(
    (t) =>
      t.term.includes(q) ||
      t.kana.includes(q) ||
      t.english.toLowerCase().includes(q) ||
      t.aliases?.some((a) => a.toLowerCase().includes(q))
  )
}

export function filterTerms(
  terms: GlossaryTerm[],
  category?: CategoryLarge | "",
  difficulty?: DifficultyLevel | 0
): GlossaryTerm[] {
  return terms.filter((t) => {
    if (category && t.categoryLarge !== category) return false
    if (difficulty && t.difficulty !== difficulty) return false
    return true
  })
}
