import Papa from 'papaparse';

export interface ConstellationStats {
  origin: number;   // 物語
  energy: number;   // 活動
  role: number;     // 役割
  bond: number;     // 関係
  form: number;     // 対象
  mood: number;     // 温度
  presence: number; // 存在
}

export interface Constellation {
  slug: string;          // ID
  name: string;          // 星座名
  englishName: string;   // 英語名
  emoji: string;         // アイコン
  season: string;        // 見頃の季節
  visibility: string;    // 見つけやすさ
  catchCopy: string;     // キャッチコピー
  highlights: string[];  // 推しポイント1~3
  nameOrigin: string;    // 名前の由来
  rival: string;         // ライバル
  similar: string;       // 似ている星座
  relatedConstellations: string[]; // 一緒に好きになりそうな星座
  imageUrl: string;      // 画像URL
  appearance: number;    // 出現係数
  story: string;         // 物語
  stats: ConstellationStats;
  articleLinks: { title: string; url: string }[]; // ※必要に応じて手動拡張用
}

export interface Choice {
  text: string;
  score: Partial<ConstellationStats>;
}

export interface Question {
  id: number;
  title: string;
  choices: Choice[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "星空を見上げたとき、一番「心惹かれる」のはどんな要素？",
    choices: [
      { text: "星座にまつわる神話や、語り継がれる伝説", score: { origin: 1 } },
      { text: "星々が光る物理的な仕組みや、科学的な発見", score: { origin: 2 } },
      { text: "誰にも気づかれないような、奥深い星のディテールや観測データ", score: { presence: 2 } },
      { text: "誰もが知っている王道の輝きや、伝説的な英雄の物語", score: { presence: 1 } }
    ]
  },
  {
    id: 2,
    title: "もし未知の惑星を探査するチームの一員になったら、どんな役割がしっくりくる？",
    choices: [
      { text: "最前線で困難に立ち向かい、道を切り拓くリーダー", score: { energy: 1, role: 1 } },
      { text: "確実な技術で仲間を支え、ミッションを完遂させる職人・エンジニア", score: { role: 2, bond: 2 } },
      { text: "誰も知らない現象をじっくり観察し、真理を解き明かす研究者", score: { energy: 2, bond: 1 } },
    ]
  },
  {
    id: 3,
    title: "あなたの「相棒」にするなら、どんな存在がいい？",
    choices: [
      { text: "言葉を交わせるような、頼もしい仲間や生き物", score: { form: 1, bond: 2 } },
      { text: "高機能で頼りになる、最新鋭の探査ツールや機械", score: { form: 2, bond: 1 } },
    ]
  },
  {
    id: 4,
    title: "あなたの情熱のタイプはどっち？",
    choices: [
      { text: "熱血！どんな困難も情熱で突き進む", score: { mood: 1 } },
      { text: "クール！静かに分析し、美学を貫く", score: { mood: 2 } }
    ]
  },
  {
    id: 5,
    title: "これまでの人生で、つい惹かれてしまうのはどんな瞬間？",
    choices: [
      { text: "多くの人を熱狂させる、華やかな成功や偉業の物語", score: { origin: 2, presence: 1 } },
      { text: "誰かの支えになった瞬間の温もりや、調和のとれた空気感", score: { role: 2, bond: 2 } },
      { text: "あまり理解されないけれど、自分だけが「最高に美しい」と感じる瞬間", score: { presence: 2, mood: 2 } }
    ]
  }
];

// ★ スプレッドシートからデータを取得する非同期関数
export async function getConstellations(): Promise<Constellation[]> {
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQTbfWKxGFEmOkuaszkGJNUcX4FySkqmdxKJtaXG0esrjJoHSo5zmEoOGLTmzH09YJd9BZY1DyqNc7P/pub?gid=0&single=true&output=csv";

  try {
    const res = await fetch(CSV_URL, { cache: 'no-store' });
    const csvText = await res.text();

    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data.map((row: any) => {
            return {
              slug: row['ID'] || '',
              name: row['星座名'] || '',
              englishName: row['英語名'] || '',
              emoji: row['アイコン'] || '✨',
              season: row['見頃の季節'] || '',
              visibility: row['見つけやすさ'] || '',
              catchCopy: row['キャッチコピー'] || '',
              highlights: [row['推しポイント1'], row['推しポイント2'], row['推しポイント3']].filter(Boolean),
              nameOrigin: row['名前の由来'] || '',
              rival: row['ライバル'] || '',
              similar: row['似ている星座'] || '',
              relatedConstellations: row['一緒に好きになりそうな星座'] ? row['一緒に好きになりそうな星座'].split(',').map((s: string) => s.trim()) : [],
              imageUrl: row['画像URL'] || '',
              appearance: Number(row['出現係数']) || 1,
              story: row['物語'] || '',
              stats: {
                // parseIntを用いて全角・半角スペース混入などのエラーを防止
                origin: parseInt(row['物語']) || 3,
                energy: parseInt(row['活動']) || 3,
                role: parseInt(row['役割']) || 3,
                bond: parseInt(row['関係']) || 3,
                form: parseInt(row['対象']) || 3,
                mood: parseInt(row['温度']) || 3,
                presence: parseInt(row['存在']) || 3,
              },
              articleLinks: [] 
            } as Constellation;
          });
          resolve(data);
        }
      });
    });
  } catch (error) {
    console.error("星座データの取得に失敗しました:", error);
    return [];
  }
}