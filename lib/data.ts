export interface Facility {
  id: string
  name: string
  nameKana: string
  category: string
  prefecture: string
  region: string
  city: string
  address: string
  description: string
  image: string
  tags: string[]
  hasPlanetarium: boolean
  hasEvent: boolean
  openingHours: string
  closedDays: string
  admissionFee: string
  access: string
  website?: string
  twitter?: string
  instagram?: string
  youtube?: string
  planetarium?: {
    titles: string[]
    schedule: string
    duration: string
  }
  events?: {
    title: string
    date: string
    description: string
  }[]
  gallery?: string[]
  updatedAt: string
}

export interface SpaceEvent {
  id: string
  title: string
  facilityId: string
  facilityName: string
  date: string
  description: string
  image: string
}

export const spacecraftTags = [
  "はやぶさ",
  "はやぶさ2",
  "MMX",
  "H3ロケット",
  "ISS",
  "イプシロン",
  "SLIM",
  "かぐや",
  "あかつき",
  "HTV",
]

export const categoryTags = [
  "月",
  "火星",
  "小惑星",
  "木星",
  "土星",
  "太陽系外",
  "ブラックホール",
  "銀河",
]

export const facilityTypes = [
  "科学館",
  "博物館",
  "美術館",
  "JAXA関連施設",
  "大学展示",
  "プラネタリウム",
  "天文台",
  "イベント施設",
]

export const regions = [
  { name: "北海道", prefectures: ["北海道"] },
  { name: "東北", prefectures: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"] },
  { name: "関東", prefectures: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"] },
  { name: "中部", prefectures: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"] },
  { name: "近畿", prefectures: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"] },
  { name: "中国", prefectures: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"] },
  { name: "四国", prefectures: ["徳島県", "香川県", "愛媛県", "高知県"] },
  { name: "九州・沖縄", prefectures: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"] },
]

export const sampleFacilities: Facility[] = [
  {
    id: "jaxa-tsukuba",
    name: "JAXA筑波宇宙センター",
    nameKana: "ジャクサつくばうちゅうセンター",
    category: "JAXA関連施設",
    prefecture: "茨城県",
    region: "関東",
    city: "つくば市",
    address: "茨城県つくば市千現2-1-1",
    description: "日本の宇宙開発の中枢。ロケットや人工衛星の開発・運用が行われています。展示館「スペースドーム」では、実物大の人工衛星やロケットエンジンを間近で見学できます。",
    image: "/images/jaxa-tsukuba.jpg",
    tags: ["H3ロケット", "ISS", "HTV", "はやぶさ2"],
    hasPlanetarium: false,
    hasEvent: true,
    openingHours: "10:00〜17:00",
    closedDays: "月曜日、年末年始",
    admissionFee: "無料",
    access: "つくばエクスプレス「つくば駅」からバス約15分",
    website: "https://www.jaxa.jp/about/centers/tksc/",
    twitter: "JAXA_jp",
    events: [
      {
        title: "特別公開2024",
        date: "2024年4月",
        description: "普段は見られない施設を特別公開"
      }
    ],
    updatedAt: "2024-03-15",
  },
  {
    id: "sagamihara-museum",
    name: "JAXA相模原キャンパス・宇宙科学探査交流棟",
    nameKana: "ジャクサさがみはらキャンパス",
    category: "JAXA関連施設",
    prefecture: "神奈川県",
    region: "関東",
    city: "相模原市",
    address: "神奈川県相模原市中央区由野台3-1-1",
    description: "はやぶさプロジェクトの研究拠点。小惑星探査機「はやぶさ」「はやぶさ2」の実物大模型や、小惑星リュウグウのサンプルを展示しています。",
    image: "/images/sagamihara.jpg",
    tags: ["はやぶさ", "はやぶさ2", "小惑星", "イプシロン"],
    hasPlanetarium: false,
    hasEvent: true,
    openingHours: "10:00〜17:00",
    closedDays: "月曜日、年末年始",
    admissionFee: "無料",
    access: "JR横浜線「淵野辺駅」からバス約10分",
    website: "https://www.isas.jaxa.jp/",
    twitter: "ISABORATORY",
    events: [
      {
        title: "はやぶさ2帰還記念展示",
        date: "常設",
        description: "リュウグウサンプルの展示"
      }
    ],
    updatedAt: "2024-03-10",
  },
  {
    id: "science-museum-tokyo",
    name: "国立科学博物館",
    nameKana: "こくりつかがくはくぶつかん",
    category: "博物館",
    prefecture: "東京都",
    region: "関東",
    city: "台東区",
    address: "東京都台東区上野公園7-20",
    description: "日本最大級の総合科学博物館。宇宙コーナーでは、隕石や月の石、宇宙服などを展示。定期的に宇宙関連の特別展も開催されます。",
    image: "/images/kahaku.jpg",
    tags: ["月", "隕石", "宇宙服"],
    hasPlanetarium: false,
    hasEvent: true,
    openingHours: "9:00〜17:00",
    closedDays: "月曜日",
    admissionFee: "一般630円",
    access: "JR「上野駅」公園口から徒歩5分",
    website: "https://www.kahaku.go.jp/",
    twitter: "museum_kahaku",
    updatedAt: "2024-03-05",
  },
  {
    id: "cosmo-isle-hakui",
    name: "コスモアイル羽咋",
    nameKana: "コスモアイルはくい",
    category: "科学館",
    prefecture: "石川県",
    region: "中部",
    city: "羽咋市",
    address: "石川県羽咋市鶴多町免田25",
    description: "UFOの町・羽咋にある宇宙科学博物館。NASAから借り受けた本物のロケットや宇宙船を展示。プラネタリウムも完備しています。",
    image: "/images/cosmo-isle.jpg",
    tags: ["NASA", "アポロ", "月"],
    hasPlanetarium: true,
    hasEvent: true,
    openingHours: "8:30〜17:00",
    closedDays: "火曜日",
    admissionFee: "大人500円",
    access: "JR七尾線「羽咋駅」から徒歩8分",
    website: "http://www.hakui.ne.jp/ufo/",
    planetarium: {
      titles: ["宇宙への旅立ち", "星空散歩"],
      schedule: "毎時00分",
      duration: "45分"
    },
    updatedAt: "2024-02-28",
  },
  {
    id: "gifu-science-museum",
    name: "岐阜かかみがはら航空宇宙博物館",
    nameKana: "ぎふかかみがはらこうくううちゅうはくぶつかん",
    category: "博物館",
    prefecture: "岐阜県",
    region: "中部",
    city: "各務原市",
    address: "岐阜県各務原市下切町5-1",
    description: "国内最大級の航空宇宙専門博物館。航空機と宇宙機の実物展示が充実しており、フライトシミュレーターも体験できます。",
    image: "/images/gifu-aerospace.jpg",
    tags: ["H-IIA", "ISS", "飛行機"],
    hasPlanetarium: false,
    hasEvent: true,
    openingHours: "10:00〜17:00",
    closedDays: "第1火曜日",
    admissionFee: "大人800円",
    access: "名鉄各務原線「各務原市役所前駅」からバス約10分",
    website: "http://www.sorahaku.net/",
    updatedAt: "2024-03-01",
  },
  {
    id: "tanegashima-space-center",
    name: "種子島宇宙センター",
    nameKana: "たねがしまうちゅうセンター",
    category: "JAXA関連施設",
    prefecture: "鹿児島県",
    region: "九州・沖縄",
    city: "南種子町",
    address: "鹿児島県熊毛郡南種子町茎永字麻津",
    description: "日本最大のロケット発射場。世界一美しいロケット発射場と称されています。宇宙科学技術館では、ロケットや人工衛星について学べます。",
    image: "/images/tanegashima.jpg",
    tags: ["H3ロケット", "H-IIA", "イプシロン"],
    hasPlanetarium: false,
    hasEvent: true,
    openingHours: "9:30〜17:00",
    closedDays: "月曜日、年末年始",
    admissionFee: "無料",
    access: "種子島空港から車で約50分",
    website: "https://www.jaxa.jp/about/centers/tnsc/",
    events: [
      {
        title: "H3ロケット打ち上げ見学",
        date: "不定期",
        description: "ロケット打ち上げの見学イベント"
      }
    ],
    updatedAt: "2024-03-12",
  },
  {
    id: "osaka-science-museum",
    name: "大阪市立科学館",
    nameKana: "おおさかしりつかがくかん",
    category: "科学館",
    prefecture: "大阪府",
    region: "近畿",
    city: "大阪市",
    address: "大阪府大阪市北区中之島4-2-1",
    description: "日本で5番目に大きいプラネタリウムを持つ科学館。宇宙や科学の展示が充実しており、参加型の展示も多数あります。",
    image: "/images/osaka-science.jpg",
    tags: ["プラネタリウム", "太陽系", "銀河"],
    hasPlanetarium: true,
    hasEvent: true,
    openingHours: "9:30〜17:00",
    closedDays: "月曜日",
    admissionFee: "大人400円",
    access: "地下鉄四つ橋線「肥後橋駅」から徒歩約5分",
    website: "https://www.sci-museum.jp/",
    planetarium: {
      titles: ["今夜の星空", "宇宙の果てへ"],
      schedule: "11:00, 14:00, 16:00",
      duration: "50分"
    },
    updatedAt: "2024-02-25",
  },
  {
    id: "nao-mitaka",
    name: "国立天文台 三鷹キャンパス",
    nameKana: "こくりつてんもんだい みたかキャンパス",
    category: "天文台",
    prefecture: "東京都",
    region: "関東",
    city: "三鷹市",
    address: "東京都三鷹市大沢2-21-1",
    description: "日本の天文学研究の中心地。歴史的な望遠鏡や最新の研究成果を見学できます。定期的に観望会も開催しています。",
    image: "/images/nao-mitaka.jpg",
    tags: ["望遠鏡", "銀河", "太陽系外"],
    hasPlanetarium: false,
    hasEvent: true,
    openingHours: "10:00〜17:00",
    closedDays: "年末年始",
    admissionFee: "無料",
    access: "JR中央線「武蔵境駅」からバス約15分",
    website: "https://www.nao.ac.jp/",
    events: [
      {
        title: "定例観望会",
        date: "毎月第2土曜日",
        description: "大型望遠鏡で天体観測"
      }
    ],
    updatedAt: "2024-03-08",
  },
]

export const sampleEvents: SpaceEvent[] = [
  {
    id: "event-1",
    title: "H3ロケット3号機打ち上げパブリックビューイング",
    facilityId: "tanegashima-space-center",
    facilityName: "種子島宇宙センター",
    date: "2024年4月予定",
    description: "H3ロケット3号機の打ち上げをライブ中継でお届けします。",
    image: "/images/h3-launch.jpg",
  },
  {
    id: "event-2",
    title: "春の特別プラネタリウム「宇宙の始まり」",
    facilityId: "osaka-science-museum",
    facilityName: "大阪市立科学館",
    date: "2024年3月〜5月",
    description: "ビッグバンから現在までの宇宙の歴史を迫力の映像で体験できます。",
    image: "/images/planetarium-show.jpg",
  },
  {
    id: "event-3",
    title: "はやぶさ2サンプル特別展示",
    facilityId: "sagamihara-museum",
    facilityName: "JAXA相模原キャンパス",
    date: "2024年通年",
    description: "小惑星リュウグウから持ち帰ったサンプルを間近で見ることができます。",
    image: "/images/hayabusa2-sample.jpg",
  },
]
