import type { Design, SubsystemId } from './types';

export interface DesignOption {
  id: string;
  name: string;
  /** 初心者向けのひとこと説明 */
  summary: string;
  pro: string;
  con: string;
  cost: number; // 万円
  mass: number; // kg
  /** 消費電力 W（電源系は発電量として扱う） */
  power: number;
  months: number; // 開発期間への影響（ヶ月）
  reliability: number;
  thermal?: number; // 熱余裕の基準値 ℃（熱制御のみ）
  link?: number; // 通信余裕 dB（通信系のみ）
  missionFactor?: number; // ミッション価値への倍率
  missionBase?: number; // 搭載機器のみ
}

export interface Subsystem {
  id: SubsystemId;
  name: string;
  question: string;
  term?: string;
  options: DesignOption[];
}

/** 6U CubeSat 相当の簡略モデル。実機設計に転用できる精度ではない */
export const BUS = { cost: 400, mass: 4.0, power: 3, massLimit: 12 };

export const SUBSYSTEMS: Subsystem[] = [
  {
    id: 'power',
    name: '電源',
    question: '衛星の電気はどうする？',
    term: '電力収支',
    options: [
      {
        id: 'body', name: 'ボディ実装の太陽電池', summary: '機体の表面に太陽電池を貼る、いちばんシンプルな方法。',
        pro: '壊れにくく安い', con: '発電量が少ない',
        cost: 150, mass: 0.6, power: 14, months: 0, reliability: 4,
      },
      {
        id: 'deploy', name: '展開式太陽電池パネル', summary: '打ち上げ後に翼のように広げて、たくさん発電する。',
        pro: '発電量が多い', con: '展開に失敗するリスクがある',
        cost: 350, mass: 1.0, power: 30, months: 1, reliability: -3,
      },
      {
        id: 'deployBattery', name: '展開式パネル＋大容量バッテリー', summary: '発電量に加えて、日陰の時間に備えて電気をたっぷり蓄える。',
        pro: '電力にいちばん余裕がある', con: '重く、高い',
        cost: 480, mass: 1.6, power: 36, months: 1, reliability: -1,
      },
    ],
  },
  {
    id: 'comm',
    name: '通信',
    question: '地上とどうやって話す？',
    term: '通信余裕',
    options: [
      {
        id: 'uhf', name: 'UHF帯無線機', summary: 'アマチュア衛星でもよく使われる、つながりやすい無線。',
        pro: 'つながりやすく安い', con: '送れるデータ量が少ない',
        cost: 100, mass: 0.3, power: 2, months: 0, reliability: 3, link: 12, missionFactor: 0.6,
      },
      {
        id: 'sband', name: 'S帯通信機', summary: '画像などのデータを、そこそこの速さで送れる。',
        pro: 'データ量と扱いやすさのバランスが良い', con: '電力をそれなりに使う',
        cost: 300, mass: 0.5, power: 6, months: 1, reliability: 0, link: 7, missionFactor: 1.0,
      },
      {
        id: 'xband', name: 'X帯高速通信機', summary: '大量のデータを高速で送れるが、扱いが難しい。',
        pro: 'たくさんのデータを送れる', con: '電力を多く使い、通信の余裕が小さい',
        cost: 600, mass: 0.7, power: 12, months: 2, reliability: -3, link: 3, missionFactor: 1.3,
      },
    ],
  },
  {
    id: 'adcs',
    name: '姿勢制御',
    question: '衛星の向きをどう整える？',
    term: '姿勢制御',
    options: [
      {
        id: 'magnet', name: '磁気トルカのみ', summary: '地球の磁場を利用して、ゆっくり向きを変える。',
        pro: '安く、軽い', con: '狙った方向に正確には向けにくい',
        cost: 100, mass: 0.3, power: 1, months: 0, reliability: 2, missionFactor: 0.7,
      },
      {
        id: 'wheel', name: 'リアクションホイール', summary: 'コマを回す反動で、向きをしっかり制御する。',
        pro: '観測したい方向に向けられる', con: '電力と費用がかかる',
        cost: 400, mass: 1.0, power: 4, months: 1, reliability: 0, missionFactor: 1.0,
      },
      {
        id: 'wheelTracker', name: 'ホイール＋スタートラッカ', summary: '星の位置で自分の向きを正確に知り、精密に制御する。',
        pro: 'もっとも精密に向けられる', con: '高価で、開発に時間がかかる',
        cost: 700, mass: 1.3, power: 6, months: 2, reliability: -2, missionFactor: 1.2,
      },
    ],
  },
  {
    id: 'thermal',
    name: '熱制御',
    question: '暑さ・寒さにどう備える？',
    term: '熱設計',
    options: [
      {
        id: 'passive', name: 'パッシブ熱制御', summary: '塗装や断熱材だけで温度を保つ。',
        pro: '電力を使わず安い', con: '温度の余裕が小さい',
        cost: 50, mass: 0.2, power: 0, months: 0, reliability: 1, thermal: 9,
      },
      {
        id: 'heater', name: 'ヒーター付き熱制御', summary: '寒くなりすぎたらヒーターで温める。',
        pro: '温度の余裕が大きい', con: '電力を使う',
        cost: 120, mass: 0.4, power: 3, months: 0, reliability: 2, thermal: 16,
      },
    ],
  },
  {
    id: 'payload',
    name: '観測機器',
    question: '何を載せて観測する？',
    term: 'ミッション機器',
    options: [
      {
        id: 'small', name: '小型カメラ', summary: '軽くて扱いやすい観測機器。',
        pro: '軽く、電力も少ない', con: '得られる成果は控えめ',
        cost: 300, mass: 1.0, power: 4, months: 0, reliability: 2, missionBase: 50,
      },
      {
        id: 'standard', name: '高性能カメラ', summary: '鮮明なデータが撮れる、標準的な観測機器。',
        pro: '成果と負担のバランスが良い', con: '電力・質量が増える',
        cost: 700, mass: 2.0, power: 8, months: 1, reliability: 0, missionBase: 70,
      },
      {
        id: 'large', name: '大型観測装置', summary: '研究者も驚くような成果を狙える大きな装置。',
        pro: '大きな成果が期待できる', con: '重く、電力・費用・期間の負担が大きい',
        cost: 1200, mass: 3.5, power: 14, months: 3, reliability: -4, missionBase: 90,
      },
    ],
  },
];

export const DEFAULT_DESIGN: Design = {
  power: 'deploy',
  comm: 'sband',
  adcs: 'wheel',
  thermal: 'heater',
  payload: 'standard',
};

export function getOption(sub: SubsystemId, id: string): DesignOption {
  const s = SUBSYSTEMS.find((x) => x.id === sub)!;
  const o = s.options.find((x) => x.id === id);
  if (!o) throw new Error(`unknown option ${sub}:${id}`);
  return o;
}

export interface DesignBudgets {
  cost: number;
  mass: number;
  massMargin: number; // %
  generation: number; // W
  consumption: number; // W
  powerMargin: number; // %
  thermalMargin: number; // ℃
  linkMargin: number; // dB
  months: number;
  reliability: number;
  missionPotential: number; // 0-100
}

/** 設計から各予算を計算する純粋関数。高性能な機器ほど別の負担が生じる */
export function computeBudgets(design: Design): DesignBudgets {
  const opts = (Object.keys(design) as SubsystemId[]).map((k) => getOption(k, design[k]));
  const power = getOption('power', design.power);
  const cost = BUS.cost + opts.reduce((a, o) => a + o.cost, 0);
  const mass = BUS.mass + opts.reduce((a, o) => a + o.mass, 0);
  const consumption = BUS.power + opts.filter((o) => o !== power).reduce((a, o) => a + o.power, 0);
  const generation = power.power;
  const thermal = getOption('thermal', design.thermal).thermal ?? 0;
  // 消費電力が大きいほど発熱が増え、熱の余裕が減る
  const thermalMargin = round1(thermal - Math.max(0, consumption - 15) * 0.3);
  const payload = getOption('payload', design.payload);
  const missionPotential = Math.min(
    100,
    Math.round(
      (payload.missionBase ?? 0) *
        (getOption('comm', design.comm).missionFactor ?? 1) *
        (getOption('adcs', design.adcs).missionFactor ?? 1),
    ),
  );
  return {
    cost,
    mass: round1(mass),
    massMargin: round1(((BUS.massLimit - mass) / BUS.massLimit) * 100),
    generation,
    consumption,
    powerMargin: Math.round(((generation - consumption) / consumption) * 100),
    thermalMargin,
    linkMargin: getOption('comm', design.comm).link ?? 0,
    months: opts.reduce((a, o) => a + o.months, 0),
    reliability: opts.reduce((a, o) => a + o.reliability, 0),
    missionPotential,
  };
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

/** 余裕の大きさを初心者向けの言葉にする */
export function marginLevel(key: 'massMargin' | 'powerMargin' | 'thermalMargin' | 'linkMargin', v: number) {
  const th = { massMargin: [0, 10], powerMargin: [0, 15], thermalMargin: [3, 8], linkMargin: [3, 6] }[key];
  if (v < th[0]) return 'short' as const;
  if (v < th[1]) return 'tight' as const;
  return 'ok' as const;
}
