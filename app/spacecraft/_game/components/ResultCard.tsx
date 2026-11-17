import { useEffect } from 'react';
import { RISK_NAMES } from '../data/riskNames';
import { describeChance } from '../engine/risk';
import type { GameState, LogEntry } from '../engine/types';
import { TECH_KEYS } from '../engine/values';
import { EffectChips } from './EffectChips';
import { Paragraphs } from './Paragraphs';

interface Props {
  game: GameState;
  entry: LogEntry;
  onNext: () => void;
}

export function ResultCard({ game, entry, onNext }: Props) {
  const expert = game.mode === 'expert';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNext]);

  return (
    <article className="card result-card" aria-live="polite">
      <p className="eyebrow">{entry.eventTitle}</p>
      <h2>「{entry.choiceLabel}」</h2>
      {entry.check && (
        <p className={`check-badge ${entry.check.success ? 'ok' : 'ng'}`}>
          {RISK_NAMES[entry.check.risk]}：{entry.check.success ? 'うまくいきました' : 'うまくいきませんでした'}
          <span className="small">
            （見込み {describeChance(entry.check.p)}
            {expert && ` ${Math.round(entry.check.p * 100)}%`}）
          </span>
        </p>
      )}
      <Paragraphs text={entry.text} />
      {/* 初心者モードでは少数の共通指標だけを見せる */}
      <EffectChips effects={entry.deltas} hide={expert ? [] : TECH_KEYS} />
      <div className="actions">
        <button className="btn primary" onClick={onNext}>
          {game.ending ? 'ミッションレポートへ' : '次へ'}
        </button>
      </div>
    </article>
  );
}
