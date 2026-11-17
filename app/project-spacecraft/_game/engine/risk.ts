import type { GameState, RiskEstimate, RiskFactor, RiskId } from './types';
import { getValue } from './values';

type Builder = (s: GameState) => { base: number; terms: [number, string][] };

const has = (s: GameState, f: string) => s.flags.includes(f);

/**
 * 確率は「なぜその見込みなのか」を必ず要因として返す。
 * 不可解なランダム罰を避けるため、画面には要因を一緒に表示する。
 */
const RISKS: Record<RiskId, Builder> = {
  grant: (s) => ({
    base: 0.35,
    terms: [
      [(getValue(s, 'trust') - 40) * 0.006, '社会的信頼'],
      [has(s, 'clearGoal') ? 0.15 : 0, '成功条件が明確'],
      [has(s, 'tieredGoals') ? 0.08 : 0, '段階的な目標設定'],
      [getValue(s, 'mission') >= 60 ? 0.05 : 0, 'ミッションの価値が高い'],
      [has(s, 'partnerLab') ? 0.08 : 0, '研究室との共同体制'],
    ],
  }),
  crowdfunding: (s) => ({
    base: 0.4,
    terms: [
      [(getValue(s, 'trust') - 40) * 0.008, '社会的信頼'],
      [has(s, 'missionNight') ? 0.1 : 0, '共感を呼びやすいテーマ'],
      [has(s, 'sponsor') ? 0.05 : 0, 'スポンサーの後押し'],
    ],
  }),
  emergencyFunding: (s) => ({
    base: 0.3,
    terms: [
      [(getValue(s, 'trust') - 40) * 0.008, '社会的信頼'],
      [has(s, 'sponsor') ? 0.1 : 0, 'スポンサーとの関係'],
      [getValue(s, 'reliability') >= 60 ? 0.1 : 0, 'これまでの開発の確かさ'],
    ],
  }),
  vibration: (s) => ({
    base: 0.55,
    terms: [
      [(getValue(s, 'reliability') - 50) * 0.008, '機体の信頼性'],
      [-getValue(s, 'issues') * 0.04, '未解決の不具合'],
      [has(s, 'expertHelp') ? 0.1 : 0, '経験者のレビュー'],
    ],
  }),
  contact: (s) => ({
    base: 0.5,
    terms: [
      [Math.min(getValue(s, 'linkMargin'), 12) * 0.02, '通信の余裕'],
      [has(s, 'opsRehearsal') ? 0.15 : 0, '運用リハーサル実施'],
      [has(s, 'groundCommercial') ? 0.06 : 0, '商用地上局の利用'],
      [has(s, 'e2eTest') ? 0.06 : 0, '地上局とつないだ通信試験'],
      [has(s, 'antennaDeploy') ? -0.05 : 0, 'アンテナ展開の成否'],
      [-getValue(s, 'issues') * 0.03, '未解決の不具合'],
      [getValue(s, 'coverage') * 0.001, '試験の網羅度'],
    ],
  }),
  recoverIsolate: (s) => ({
    base: 0.45,
    terms: [
      [(getValue(s, 'team') - 50) * 0.005, 'チームの状態'],
      [has(s, 'opsRehearsal') ? 0.12 : 0, '運用リハーサルの経験'],
      [has(s, 'expertHelp') ? 0.1 : 0, '経験者の協力'],
    ],
  }),
  recoverProcedure: (s) => ({
    base: 0.25,
    terms: [
      [has(s, 'opsRehearsal') ? 0.35 : 0, '用意していた復旧手順'],
      [has(s, 'finalCheck') ? 0.1 : 0, '打ち上げ前の入念な確認'],
    ],
  }),
  recoverLast: (s) => ({
    base: 0.2,
    terms: [
      [Math.min(getValue(s, 'linkMargin'), 12) * 0.015, '通信の余裕'],
      [has(s, 'groundCommercial') ? 0.1 : 0, '商用地上局の大型アンテナ'],
    ],
  }),
  deploy: (s) => ({
    base: 0.72,
    terms: [
      [has(s, 'vibrationFull') ? 0.15 : has(s, 'vibrationLite') ? 0.06 : 0, '振動試験で展開機構を確認'],
      [has(s, 'thermalVacFull') ? 0.06 : 0, '熱真空試験の実施'],
      [has(s, 'deployTested') ? 0.08 : 0, '展開試験の繰り返し'],
      [-getValue(s, 'issues') * 0.02, '未解決の不具合'],
    ],
  }),
  // 発生確率（高いほど起きやすい）
  payloadHang: (s) => ({
    base: 0.2,
    terms: [
      [getValue(s, 'issues') * 0.07, '未解決の不具合'],
      [-getValue(s, 'coverage') * 0.002, '試験の網羅度'],
      [has(s, 'radCots') ? 0.15 : 0, '民生部品を放射線対策なしで使用'],
      [has(s, 'radSpace') ? -0.1 : 0, '宇宙用部品の採用'],
    ],
  }),
  reset: (s) => ({
    base: 0.55,
    terms: [
      [getValue(s, 'coverage') * 0.003, 'ソフトウェア検証の網羅度'],
      [has(s, 'radCots') ? -0.1 : 0, '放射線による損傷の可能性'],
    ],
  }),
  extended: (s) => ({
    base: 0.35,
    terms: [
      [(getValue(s, 'reliability') - 50) * 0.006, '機体の信頼性'],
      [getValue(s, 'powerMargin') >= 15 ? 0.1 : -0.05, '電力の余裕'],
      [getValue(s, 'thermalMargin') >= 8 ? 0.05 : -0.05, '熱の余裕'],
      [(getValue(s, 'team') - 50) * 0.003, 'チームの状態'],
      [has(s, 'orbitIss') ? -0.15 : 0, '低い軌道で高度が下がりやすい'],
      [has(s, 'batteryCare') ? 0.1 : 0, 'バッテリーをいたわる運用'],
    ],
  }),
  safetyReview: (s) => ({
    base: 0.45,
    terms: [
      [has(s, 'expertHelp') ? 0.2 : 0, '経験者のレビュー'],
      [has(s, 'docs') ? 0.15 : 0, '整えておいた設計資料'],
      [has(s, 'fmea') ? 0.1 : 0, '故障モードの分析'],
      [-getValue(s, 'issues') * 0.03, '未解決の不具合'],
    ],
  }),
  debrisPass: () => ({
    base: 0.88,
    terms: [],
  }),
  grantRetry: (s) => ({
    base: 0.4,
    terms: [
      [(getValue(s, 'trust') - 40) * 0.006, '社会的信頼'],
      [has(s, 'clearGoal') ? 0.1 : 0, '成功条件が明確'],
      [has(s, 'mentorAdvice') ? 0.1 : 0, '先輩チームの助言'],
    ],
  }),
  testFind: (s) => ({
    base: 0.15,
    terms: [
      [getValue(s, 'issues') * 0.08, '未解決の不具合'],
      [has(s, 'altPart') ? 0.15 : 0, '実績の少ない代替部品'],
      [has(s, 'fmea') ? -0.08 : 0, '故障モードの分析'],
    ],
  }),
  launchDelay: () => ({
    base: 0.35,
    terms: [],
  }),
  tumble: (s) => ({
    base: 0.3,
    terms: [
      [s.design?.adcs === 'magnet' ? 0.2 : 0, '磁気トルカのみの姿勢制御'],
      [has(s, 'opsRehearsal') ? -0.1 : 0, '運用リハーサルで手順を確認'],
      [has(s, 'hils') ? -0.08 : 0, 'ソフトウェアの統合試験'],
    ],
  }),
  solarStorm: (s) => ({
    base: 0.3,
    terms: [
      [has(s, 'longMission') ? 0.15 : 0, '長い運用期間'],
      [has(s, 'orbitHigh') ? 0.1 : 0, '放射線の多い高めの軌道'],
    ],
  }),
  groundFault: (s) => ({
    base: 0.2,
    terms: [
      [has(s, 'groundCommercial') ? -0.1 : 0.05, has(s, 'groundCommercial') ? '商用地上局の保守体制' : '自前の地上局'],
      [has(s, 'e2eTest') ? -0.05 : 0, '地上局を含めた通信試験'],
    ],
  }),
  partShortage: (s) => ({
    base: 0.3,
    terms: [
      [has(s, 'budgetPlan') ? -0.12 : 0, '早めの費用計画'],
      [has(s, 'factoryNetwork') ? -0.08 : 0, '地域の工場とのつながり'],
    ],
  }),
  conjunction: (s) => ({
    base: 0.15,
    terms: [
      [has(s, 'orbitHigh') ? 0.15 : 0, '物体の多い高めの軌道'],
      [has(s, 'longMission') ? 0.1 : 0, '長い運用期間'],
    ],
  }),
};

export function estimateRisk(s: GameState, id: RiskId): RiskEstimate {
  const { base, terms } = RISKS[id](s);
  const p = clamp(base + terms.reduce((a, [v]) => a + v, 0), 0.05, 0.95);
  const factors: RiskFactor[] = terms
    .filter(([v]) => Math.abs(v) >= 0.005)
    .map(([v, label]) => ({ label, positive: OCCURRENCE_RISKS.includes(id) ? v < 0 : v > 0 }));
  return { p: Math.round(p * 100) / 100, factors };
}

/** 発生確率を表すリスク（高いほど悪い） */
export const OCCURRENCE_RISKS: RiskId[] = [
  'payloadHang',
  'testFind',
  'launchDelay',
  'tumble',
  'solarStorm',
  'conjunction',
  'groundFault',
  'partShortage',
];

export function describeChance(p: number, occurrence = false) {
  if (occurrence) return p >= 0.5 ? '起きやすい' : p >= 0.25 ? 'ときどき起きる' : '起きにくい';
  return p >= 0.75 ? '高め' : p >= 0.5 ? 'やや高め' : p >= 0.3 ? '五分五分よりやや低め' : '低め';
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}
