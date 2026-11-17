import { computeBudgets } from './design';
import type { GameState, StatKey, TechKey, ValueKey } from './types';

export const STAT_KEYS: StatKey[] = ['budget', 'months', 'reliability', 'mission', 'team', 'trust', 'progress'];
export const TECH_KEYS: TechKey[] = [
  'massMargin',
  'powerMargin',
  'thermalMargin',
  'linkMargin',
  'coverage',
  'issues',
  'opsLoad',
];

/** 設計値に加算される補正（margin系）か、そのものの値か */
type DerivedKey = 'massMargin' | 'powerMargin' | 'thermalMargin' | 'linkMargin';
const DESIGN_DERIVED: DerivedKey[] = ['massMargin', 'powerMargin', 'thermalMargin', 'linkMargin'];
const isDerived = (k: ValueKey): k is DerivedKey => (DESIGN_DERIVED as string[]).includes(k);

export function isStat(k: ValueKey): k is StatKey {
  return (STAT_KEYS as string[]).includes(k);
}

/** 表示・条件判定に使う実効値。margin 系は「設計値＋イベント補正」 */
export function getValue(s: GameState, k: ValueKey): number {
  if (isStat(k)) return s.stats[k];
  if (isDerived(k)) {
    const base = s.design ? computeBudgets(s.design)[k] : 0;
    return Math.round((base + s.tech[k]) * 10) / 10;
  }
  return s.tech[k];
}

export const LABELS: Record<ValueKey, string> = {
  budget: '資金',
  months: '打ち上げまでの余裕',
  reliability: '信頼性',
  mission: 'ミッション価値',
  team: 'チーム状態',
  trust: '社会的信頼',
  progress: 'ミッション達成度',
  massMargin: '質量マージン',
  powerMargin: '電力マージン',
  thermalMargin: '熱余裕',
  linkMargin: '通信余裕',
  coverage: '検証カバレッジ',
  issues: '未解決不具合',
  opsLoad: '運用負荷',
};

export const UNITS: Record<ValueKey, string> = {
  budget: '万円',
  months: 'ヶ月',
  reliability: '',
  mission: '',
  team: '',
  trust: '',
  progress: '%',
  massMargin: '%',
  powerMargin: '%',
  thermalMargin: '℃',
  linkMargin: 'dB',
  coverage: '%',
  issues: '件',
  opsLoad: '',
};

/** 値が大きいほど悪い指標 */
export const LOWER_IS_BETTER: ValueKey[] = ['issues', 'opsLoad'];

/** 0〜100 に収める指標 */
export const BOUNDED: ValueKey[] = ['reliability', 'mission', 'team', 'trust', 'progress', 'coverage', 'opsLoad'];
