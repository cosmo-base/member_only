export type Mode = 'beginner' | 'expert';

export type PhaseId =
  | 'concept'
  | 'goals'
  | 'design'
  | 'funding'
  | 'team'
  | 'detail'
  | 'integration'
  | 'testing'
  | 'launch'
  | 'operations';

/** 共通状態値（初心者・玄人の両方で表示） */
export type StatKey = 'budget' | 'months' | 'reliability' | 'mission' | 'team' | 'trust' | 'progress';

/** 玄人モードで表示する技術状態値。margin系は設計値＋イベント補正で求める */
export type TechKey =
  | 'massMargin'
  | 'powerMargin'
  | 'thermalMargin'
  | 'linkMargin'
  | 'coverage'
  | 'issues'
  | 'opsLoad';

export type ValueKey = StatKey | TechKey;

export type Effect = Partial<Record<ValueKey, number>>;

export type SubsystemId = 'power' | 'comm' | 'adcs' | 'thermal' | 'payload';
export type Design = Record<SubsystemId, string>;

export type RiskId =
  | 'grant'
  | 'crowdfunding'
  | 'emergencyFunding'
  | 'vibration'
  | 'contact'
  | 'recoverIsolate'
  | 'recoverProcedure'
  | 'recoverLast'
  | 'deploy'
  | 'payloadHang'
  | 'reset'
  | 'extended'
  | 'safetyReview'
  | 'debrisPass'
  | 'grantRetry'
  // 以下は発生確率（高いほど起きやすい）
  | 'testFind'
  | 'launchDelay'
  | 'tumble'
  | 'solarStorm'
  | 'conjunction'
  | 'groundFault'
  | 'partShortage';

export type EndingId = 'success' | 'partial' | 'extended' | 'lesson' | 'early';

export interface Condition {
  flags?: string[];
  notFlags?: string[];
  /** いずれかのフラグを持っていれば成立 */
  anyFlags?: string[];
  min?: Effect;
  max?: Effect;
  /** 指定サブシステムが指定の選択肢のいずれか */
  design?: Partial<Record<SubsystemId, string[]>>;
  /** この フェーズ以降でのみ成立（グローバルイベント用） */
  minPhase?: PhaseId;
}

export interface Outcome {
  effects?: Effect;
  flags?: string[];
  removeFlags?: string[];
  text: string;
  end?: EndingId;
}

export interface Choice extends Partial<Outcome> {
  id: string;
  label: string;
  pro?: string;
  con?: string;
  requires?: Condition;
  /** 確率判定。基本の effects/flags を適用した後に success/failure を適用する */
  check?: { risk: RiskId; success: Outcome; failure: Outcome };
}

export interface GameEvent {
  id: string;
  /** 'any' はフェーズを問わず条件を満たした時点で割り込むイベント */
  phase: PhaseId | 'any';
  mode: 'common' | Mode;
  kind?: 'design';
  title: string;
  body: string;
  /** 玄人モードで本文に追記する技術的な補足 */
  expertNote?: string;
  terms?: string[];
  tags: string[];
  conditions?: Condition;
  /** 発生確率の判定。条件を満たしても、この判定に通ったときだけ発生する */
  trigger?: RiskId;
  /** 追加イベントの挿入位置。指定したイベントの直前に並べる（発生順を決める） */
  before?: string;
  /** クイズの正解の選択肢ID（分析で正答率を出すため。ゲームの進行には使わない） */
  answer?: string;
  choices: Choice[];
}

export interface RiskFactor {
  label: string;
  positive: boolean;
}

export interface RiskEstimate {
  p: number;
  factors: RiskFactor[];
}

export interface LogEntry {
  eventId: string;
  eventTitle: string;
  phase: PhaseId | 'any';
  choiceId: string;
  choiceLabel: string;
  text: string;
  deltas: Effect;
  check?: { risk: RiskId; p: number; success: boolean };
  tags: string[];
  /** イベントが表示されてから選ぶまでの時間（ミリ秒）。画面側で記録し、ゲームの進行には使わない */
  ms?: number;
}

export interface GameState {
  version: 1;
  mode: Mode;
  /** 開始時の乱数シード。プレイの展開を再現するために使う（古いセーブデータにはない） */
  seed?: number;
  /** プレイごとの使い捨てID。途中経過とエンディングの記録を結び付けるために、画面側で開始時に付ける */
  playId?: string;
  /** 用語ボタンを開いた回数（用語ごと）。画面側で記録する */
  termOpens?: Record<string, number>;
  rng: number;
  phaseIndex: number;
  currentEventId: string | null;
  stats: Record<StatKey, number>;
  tech: Record<TechKey, number>;
  design: Design | null;
  flags: string[];
  seen: string[];
  log: LogEntry[];
  lastResult: LogEntry | null;
  ending: EndingId | null;
}
