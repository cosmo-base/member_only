import { determineEnding } from './engine';
import { buildReport, reportToText, type MissionReport } from './report';
import type { Design, Effect, GameState, Mode, RiskId, ValueKey } from './types';
import { getValue, STAT_KEYS, TECH_KEYS } from './values';

/**
 * 分析用データ。改善と今後のコンテンツ開発のため、プレイの展開を再現できる情報を含める。
 * 人を特定する情報は含めない。セーブデータとは別物で、ここからゲームの続きを遊ぶことはできない。
 *
 * - type 'play'：エンディング到達時に自動で1回送る
 * - type 'progress'：プレイ途中にページを閉じた・別のタブに切り替えたときに、その時点の到達地点を送る（離脱の分析用）
 * - type 'feedback'：ご意見欄の送信ボタンを押したときに、ご意見と playId だけを送る
 * playId はプレイごとに作る使い捨ての乱数で、同じプレイの記録どうしを結び付けるためだけに使う。
 */
export interface PlayLogItem {
  event: string;
  choice: string;
  deltas: Effect;
  check?: { risk: RiskId; p: number; success: boolean };
  /** 選ぶまでにかかった時間（ミリ秒） */
  ms?: number;
}

export const SCHEMA = 4;

export interface PlayPayload {
  schema: typeof SCHEMA;
  type: 'play';
  playId: string;
  /** 再現には同じバージョンのイベントデータが必要 */
  appVersion: string;
  mode: Mode;
  seed: number | null;
  ending: string;
  phaseReached: number;
  progressBand: string;
  design: Design | null;
  finalValues: Record<ValueKey, number>;
  flags: string[];
  choiceIds: string[];
  log: PlayLogItem[];
  report: MissionReport & { text: string };
  /** 選ぶまでにかかった時間の合計（秒）。結果画面を読む時間は含まない */
  durationSec: number;
  /** 用語ボタンを開いた回数（用語ごと） */
  termOpens: Record<string, number>;
}

/** プレイ途中の到達地点（離脱の分析用） */
export interface ProgressPayload {
  schema: typeof SCHEMA;
  type: 'progress';
  playId: string;
  appVersion: string;
  mode: Mode;
  phaseReached: number;
  eventCount: number;
  durationSec: number;
  /** 最後に表示されていたイベント */
  lastEvent: string;
}

export interface FeedbackPayload {
  schema: typeof SCHEMA;
  type: 'feedback';
  playId: string;
  appVersion: string;
  feedback: string;
}

export type AnalyticsPayload = PlayPayload | ProgressPayload | FeedbackPayload;

/** イベントや数値を変えたら上げる。再現するときは同じバージョンのコードを使う */
export const APP_VERSION = '0.4.0';

const durationSecOf = (s: GameState) => Math.round(s.log.reduce((sum, l) => sum + (l.ms ?? 0), 0) / 1000);

export function buildPlayPayload(s: GameState, playId: string): PlayPayload {
  const band = Math.floor(s.stats.progress / 20) * 20;
  const report = buildReport(s);
  return {
    schema: SCHEMA,
    type: 'play',
    playId,
    appVersion: APP_VERSION,
    mode: s.mode,
    seed: s.seed ?? null,
    ending: determineEnding(s),
    phaseReached: s.phaseIndex,
    progressBand: `${band}-${band + 19}`,
    design: s.design,
    finalValues: Object.fromEntries([...STAT_KEYS, ...TECH_KEYS].map((k) => [k, getValue(s, k)])) as Record<ValueKey, number>,
    flags: [...s.flags],
    choiceIds: s.log.map((l) => `${l.eventId}:${l.choiceId}`),
    log: s.log.map((l) => ({
      event: l.eventId,
      choice: l.choiceId,
      deltas: l.deltas,
      ...(l.check ? { check: l.check } : {}),
      ...(l.ms != null ? { ms: l.ms } : {}),
    })),
    report: { ...report, text: reportToText(s, report) },
    durationSec: durationSecOf(s),
    termOpens: { ...(s.termOpens ?? {}) },
  };
}

export function buildProgressPayload(s: GameState, playId: string): ProgressPayload {
  return {
    schema: SCHEMA,
    type: 'progress',
    playId,
    appVersion: APP_VERSION,
    mode: s.mode,
    phaseReached: s.phaseIndex,
    eventCount: s.log.length,
    durationSec: durationSecOf(s),
    lastEvent: s.currentEventId ?? s.lastResult?.eventId ?? '',
  };
}

export function buildFeedbackPayload(playId: string, feedback: string): FeedbackPayload {
  return { schema: SCHEMA, type: 'feedback', playId, appVersion: APP_VERSION, feedback };
}

export function newPlayId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

/**
 * 送信先（Google Apps Script のウェブアプリ URL）。
 * ビルド時に環境変数 NEXT_PUBLIC_SPACECRAFT_GAS_URL で指定する。未設定なら送信は発生しない。
 */
export const ANALYTICS_ENDPOINT: string = process.env.NEXT_PUBLIC_SPACECRAFT_GAS_URL ?? '';

export type SendResult = 'sent' | 'no-consent' | 'not-configured' | 'error';

export async function sendAnalytics(payload: AnalyticsPayload, consent: boolean): Promise<SendResult> {
  if (!consent) return 'no-consent';
  if (!ANALYTICS_ENDPOINT) return 'not-configured';
  try {
    // Apps Script は CORS の事前確認（preflight）に応答しないため、text/plain で送る。
    // Cookie などの認証情報は送らない（Google アカウントとひも付かない）。
    const res = await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      credentials: 'omit',
      redirect: 'follow',
    });
    if (!res.ok) return 'error';
    const body = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    return body?.ok ? 'sent' : 'error';
  } catch {
    return 'error';
  }
}

/**
 * ページを閉じる・別のタブに切り替える瞬間でも届くように送る（応答は待たない）。
 * navigator.sendBeacon は Cookie を必ず付けて送るため使わず、keepalive 付きの fetch で認証情報なしに送る。
 */
export function sendAnalyticsOnLeave(payload: AnalyticsPayload, consent: boolean) {
  if (!consent || !ANALYTICS_ENDPOINT) return;
  try {
    void fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      credentials: 'omit',
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* 送れなくてもゲームには影響しない */
  }
}

export const FEEDBACK_MAX = 1000;

/** 同意画面の説明内容の版。説明を変更したら上げる（全員に同意を取り直す） */
export const CONSENT_VERSION = 4;
