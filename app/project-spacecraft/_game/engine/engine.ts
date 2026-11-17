import { EVENTS } from '../data/events';
import { CORE_EVENTS, OPTIONAL_LIMITS, WEIGHT_FOLLOW_UP, WEIGHT_SITUATIONAL } from '../data/pacing';
import { computeBudgets } from './design';
import { nextRandom } from './rng';
import { estimateRisk, OCCURRENCE_RISKS } from './risk';
import type {
  Choice,
  Condition,
  Design,
  Effect,
  EndingId,
  GameEvent,
  GameState,
  LogEntry,
  Mode,
  Outcome,
  PhaseId,
  ValueKey,
} from './types';
import { BOUNDED, getValue, isStat } from './values';

export const PHASES: { id: PhaseId; name: string }[] = [
  { id: 'concept', name: 'ミッション構想' },
  { id: 'goals', name: '目標設定' },
  { id: 'design', name: '機体構成' },
  { id: 'funding', name: '資金調達' },
  { id: 'team', name: 'チーム形成' },
  { id: 'detail', name: '詳細設計' },
  { id: 'integration', name: '製造・統合' },
  { id: 'testing', name: '試験・審査' },
  { id: 'launch', name: '打ち上げ・初期運用' },
  { id: 'operations', name: '定常運用・終了' },
];

const DESIGN_PHASE_MONTHS = 2;
/** 打ち上げまでの期間。1プレイで出るイベント数に合わせて調整している */
export const START_MONTHS = 17;

export function getEvent(id: string): GameEvent {
  const e = EVENTS.find((x) => x.id === id);
  if (!e) throw new Error(`unknown event ${id}`);
  return e;
}

export function newGame(mode: Mode, seed: number = Date.now() >>> 0): GameState {
  const s: GameState = {
    version: 1,
    mode,
    seed: seed >>> 0,
    rng: seed >>> 0,
    phaseIndex: 0,
    currentEventId: null,
    stats: { budget: 2500, months: START_MONTHS, reliability: 50, mission: 20, team: 55, trust: 40, progress: 0 },
    tech: { massMargin: 0, powerMargin: 0, thermalMargin: 0, linkMargin: 0, coverage: 0, issues: 2, opsLoad: 30 },
    design: null,
    flags: [],
    seen: [],
    log: [],
    lastResult: null,
    ending: null,
  };
  return proceed(s);
}

export function checkCondition(s: GameState, c: Condition | undefined): boolean {
  if (!c) return true;
  if (c.flags && !c.flags.every((f) => s.flags.includes(f))) return false;
  if (c.notFlags && c.notFlags.some((f) => s.flags.includes(f))) return false;
  if (c.anyFlags && !c.anyFlags.some((f) => s.flags.includes(f))) return false;
  if (c.min) for (const [k, v] of entries(c.min)) if (getValue(s, k) < v) return false;
  if (c.max) for (const [k, v] of entries(c.max)) if (getValue(s, k) > v) return false;
  if (c.design) {
    if (!s.design) return false;
    for (const [k, ids] of Object.entries(c.design)) {
      if (!ids!.includes(s.design[k as keyof Design])) return false;
    }
  }
  if (c.minPhase && s.phaseIndex < PHASES.findIndex((p) => p.id === c.minPhase)) return false;
  return true;
}

export function availableChoices(s: GameState, e: GameEvent): Choice[] {
  return e.choices.filter((c) => checkCondition(s, c.requires));
}

function matchesMode(s: GameState, e: GameEvent) {
  return e.mode === 'common' || e.mode === s.mode;
}

/** 次に表示するイベントを決める。フェーズ内に候補がなければ次のフェーズへ進む */
export function proceed(prev: GameState): GameState {
  const s = clone(prev);
  s.lastResult = null;
  s.currentEventId = null;
  if (s.ending) return s;

  while (s.phaseIndex < PHASES.length) {
    const phase = PHASES[s.phaseIndex].id;
    const candidates = EVENTS.filter(
      (e) => (e.phase === 'any' || e.phase === phase) && matchesMode(s, e) && !s.seen.includes(e.id),
    ).sort((a, b) => Number(b.phase === 'any') - Number(a.phase === 'any'));

    for (const e of candidates) {
      if (!checkCondition(s, e.conditions)) continue;
      if (isOptional(e) && !pickOptional(s, phase, e, candidates)) {
        // 今回のプレイでは出さない（プレイの長さを保つため）
        s.seen.push(e.id);
        continue;
      }
      if (e.trigger) {
        const { p } = estimateRisk(s, e.trigger);
        const roll = random(s);
        if (roll >= p) {
          // 発生しなかった。後でレポートに「起きなかったリスク」として残せるよう seen に入れる
          s.seen.push(e.id);
          continue;
        }
      }
      s.currentEventId = e.id;
      return s;
    }
    s.phaseIndex += 1;
  }
  s.ending = determineEnding(s);
  return s;
}

/** 柱のイベント・機体設計・フェーズ横断イベント以外は、出現数に上限がある */
function isOptional(e: GameEvent) {
  return e.phase !== 'any' && e.kind !== 'design' && !CORE_EVENTS.has(e.id);
}

function weightOf(e: GameEvent) {
  const c = e.conditions;
  if (c && (c.flags?.length || c.anyFlags?.length)) return WEIGHT_FOLLOW_UP;
  if (c || e.trigger) return WEIGHT_SITUATIONAL;
  return 1;
}

/**
 * 順番に候補を見ながら、残り枠 ÷ 残り候補数 の確率で選ぶ（逐次サンプリング）。
 * 並び順を保ったまま、プレイごとに違う組み合わせになる。
 */
function pickOptional(s: GameState, phase: PhaseId, e: GameEvent, candidates: GameEvent[]): boolean {
  const shown = s.log.filter((l) => l.phase === phase && isOptional(getEvent(l.eventId))).length;
  const remainingSlots = OPTIONAL_LIMITS[s.mode][phase] - shown;
  if (remainingSlots <= 0) return false;
  const remaining = candidates.filter(
    (x) => x.phase === phase && isOptional(x) && !s.seen.includes(x.id) && checkCondition(s, x.conditions),
  ).length;
  const p = Math.min(1, (remainingSlots / Math.max(1, remaining)) * weightOf(e));
  return random(s) < p;
}

export function choose(prev: GameState, choiceId: string): GameState {
  if (!prev.currentEventId) throw new Error('no current event');
  const e = getEvent(prev.currentEventId);
  const choice = availableChoices(prev, e).find((c) => c.id === choiceId);
  if (!choice) throw new Error(`choice ${choiceId} not available`);

  const s = clone(prev);
  const deltas: Effect = {};
  let text = choice.text ?? '';
  let end = choice.end;
  applyOutcome(s, choice, deltas);

  let check: LogEntry['check'];
  if (choice.check) {
    const { p } = estimateRisk(s, choice.check.risk);
    const success = random(s) < p;
    const branch = success ? choice.check.success : choice.check.failure;
    applyOutcome(s, branch, deltas);
    text = [text, branch.text].filter(Boolean).join('\n\n');
    end = branch.end ?? end;
    check = { risk: choice.check.risk, p, success };
  }

  const entry: LogEntry = {
    eventId: e.id,
    eventTitle: e.title,
    phase: e.phase,
    choiceId: choice.id,
    choiceLabel: choice.label,
    text,
    deltas,
    check,
    tags: e.tags,
  };
  s.log.push(entry);
  s.lastResult = entry;
  s.seen.push(e.id);
  s.currentEventId = null;
  if (end) s.ending = end;
  return s;
}

/** 機体構成画面での決定。設計の負担（費用・期間・信頼性）とミッション価値を反映する */
export function confirmDesign(prev: GameState, design: Design): GameState {
  if (!prev.currentEventId) throw new Error('no current event');
  const e = getEvent(prev.currentEventId);
  if (e.kind !== 'design') throw new Error('not a design event');
  const b = computeBudgets(design);
  if (b.massMargin < 0) throw new Error('mass limit exceeded');

  const s = clone(prev);
  s.design = { ...design };
  const deltas: Effect = {};
  applyEffect(s, { budget: -b.cost, months: -(DESIGN_PHASE_MONTHS + b.months), reliability: b.reliability }, deltas);
  applyEffect(s, { mission: b.missionPotential - 40 }, deltas);

  const notes: string[] = [`機体構成が決まりました。総費用は ${b.cost} 万円です。`];
  if (b.powerMargin < 0) notes.push('発電量より消費電力が大きい構成です。運用中に機器を止めながら使う場面が出てきそうです。');
  else if (b.powerMargin < 15) notes.push('電力の余裕は小さめです。日照条件によっては機器の運用を絞る必要があるかもしれません。');
  if (b.massMargin < 10) notes.push('質量の余裕が小さいので、この先の追加や変更は慎重に進める必要がありそうです。');
  if (b.thermalMargin < 8) notes.push('熱の余裕が小さめです。温度の想定外に注意しましょう。');
  if (s.stats.budget < 0) notes.push('今の資金では足りません。次の資金調達フェーズで補う必要があります。');

  const entry: LogEntry = {
    eventId: e.id,
    eventTitle: e.title,
    phase: e.phase,
    choiceId: 'design',
    choiceLabel: '機体構成を決定',
    text: notes.join('\n\n'),
    deltas,
    tags: e.tags,
  };
  s.log.push(entry);
  s.lastResult = entry;
  s.seen.push(e.id);
  s.currentEventId = null;
  return s;
}

export function determineEnding(s: GameState): EndingId {
  if (s.ending) return s.ending;
  if (!s.flags.includes('contactOk')) return 'lesson';
  const p = s.stats.progress;
  if (p >= 70) return s.flags.includes('extended') ? 'extended' : 'success';
  if (p >= 35) return 'partial';
  return 'lesson';
}

function applyOutcome(s: GameState, o: Partial<Outcome>, deltas: Effect) {
  if (o.effects) applyEffect(s, o.effects, deltas);
  for (const f of o.flags ?? []) if (!s.flags.includes(f)) s.flags.push(f);
  if (o.removeFlags) s.flags = s.flags.filter((f) => !o.removeFlags!.includes(f));
}

/** ミッション価値が高いほど、同じ運用でも得られる成果が大きい */
export function progressScale(s: GameState) {
  return Math.min(1.3, Math.max(0.5, s.stats.mission / 55));
}

function applyEffect(s: GameState, eff: Effect, deltas: Effect) {
  for (const [k, raw] of entries(eff)) {
    const v = k === 'progress' && raw > 0 ? Math.round(raw * progressScale(s)) : raw;
    const before = isStat(k) ? s.stats[k] : s.tech[k];
    let after = before + v;
    if (BOUNDED.includes(k)) after = Math.min(100, Math.max(0, after));
    if (k === 'issues') after = Math.max(0, after);
    after = Math.round(after * 10) / 10;
    if (isStat(k)) s.stats[k] = after;
    else s.tech[k] = after;
    deltas[k] = Math.round(((deltas[k] ?? 0) + after - before) * 10) / 10;
  }
}

function random(s: GameState): number {
  const [v, next] = nextRandom(s.rng);
  s.rng = next;
  return v;
}

function entries(e: Effect) {
  return Object.entries(e) as [ValueKey, number][];
}

function clone(s: GameState): GameState {
  return JSON.parse(JSON.stringify(s));
}

/** 選択肢の判定見込み。判定は基本の効果を適用した後に行うので、同じ順序で見積もる */
export function previewRisk(s: GameState, choice: Choice) {
  if (!choice.check) return null;
  const t = clone(s);
  applyOutcome(t, choice, {});
  return estimateRisk(t, choice.check.risk);
}

export function isOccurrenceRisk(id: string) {
  return (OCCURRENCE_RISKS as string[]).includes(id);
}
