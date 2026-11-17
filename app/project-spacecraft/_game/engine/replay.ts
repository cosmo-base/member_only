import type { PlayPayload } from './analytics';
import { choose, confirmDesign, getEvent, newGame, proceed } from './engine';
import type { GameState } from './types';

/**
 * 送られてきたプレイデータから、同じ展開を再現する（改善・分析用）。
 * 同じ appVersion のコードで実行すること。イベントや数値が変わっていると、途中で食い違う。
 */
export function replayPlay(p: Pick<PlayPayload, 'mode' | 'seed' | 'design' | 'choiceIds'>): GameState {
  if (p.seed == null) throw new Error('seed がないため再現できません');
  let s = newGame(p.mode, p.seed);
  for (const [i, item] of p.choiceIds.entries()) {
    const [eventId, choiceId] = item.split(':');
    if (s.currentEventId !== eventId) {
      throw new Error(`${i + 1} 手目で食い違い：記録は ${eventId}、再現では ${s.currentEventId}（バージョン違いの可能性）`);
    }
    if (getEvent(eventId).kind === 'design') {
      if (!p.design) throw new Error('機体構成の記録がありません');
      s = confirmDesign(s, p.design);
    } else {
      s = choose(s, choiceId);
    }
    s = proceed(s);
  }
  return s;
}
