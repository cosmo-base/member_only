import type { GameState } from './engine/types';

/** ブラウザ内ローカル保存（任意）。サーバーには何も送らない */
const SAVE_KEY = 'ps-save-v1';
const PREFS_KEY = 'ps-prefs-v1';

export interface Prefs {
  localSave: boolean;
  analyticsConsent: boolean;
  /** 同意した説明文の版。説明を変えたら CONSENT_VERSION を上げて同意を取り直す */
  consentVersion: number | null;
}

export const DEFAULT_PREFS: Prefs = { localSave: false, analyticsConsent: false, consentVersion: null };

export function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePrefs(p: Prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  } catch {
    /* 保存できない環境でもゲームは遊べる */
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as GameState;
    return s.version === 1 ? s : null;
  } catch {
    return null;
  }
}

export function saveGame(s: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
  } catch {
    /* noop */
  }
}

export function clearGame() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* noop */
  }
}

export function clearAll() {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(PREFS_KEY);
  } catch {
    /* noop */
  }
}
