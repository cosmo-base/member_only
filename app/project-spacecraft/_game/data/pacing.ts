import type { Mode, PhaseId } from '../engine/types';

/**
 * 1回のプレイの長さを決める設定。
 * - 柱となるイベント（CORE_EVENTS）は条件を満たせば必ず出る
 * - それ以外は、フェーズごとに OPTIONAL_LIMITS の数まで、プレイごとにランダムに選ぶ
 *   （前の選択を受けた「伏線回収」のイベントほど選ばれやすい）
 */
export const CORE_EVENTS = new Set<string>([
  'b-intro',
  'c-mission',
  'g-success',
  'd-design',
  'f-grant',
  'te-vibration',
  'te-rehearsal',
  'te-slip',
  'i-mass-check',
  'l-launch',
  'l-nocontact',
  'l-lost',
  'l-deploy',
  'o-first',
  'o-power',
  'o-thermal',
  'o-routine',
  'o-end',
]);

export const OPTIONAL_LIMITS: Record<Mode, Record<PhaseId, number>> = {
  beginner: {
    concept: 2,
    goals: 2,
    design: 1,
    funding: 2,
    team: 2,
    detail: 2,
    integration: 2,
    testing: 2,
    launch: 2,
    operations: 4,
  },
  expert: {
    concept: 2,
    goals: 2,
    design: 2,
    funding: 3,
    team: 3,
    detail: 4,
    integration: 3,
    testing: 3,
    launch: 2,
    operations: 4,
  },
};

/** 選ばれやすさ。前の選択のフラグを条件にするイベントは、選択の結果を感じられるよう優先する */
export const WEIGHT_FOLLOW_UP = 3;
export const WEIGHT_SITUATIONAL = 1.5;
