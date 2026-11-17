import { useEffect } from 'react';
import { OCCURRENCE_NOTES } from '../data/riskNames';
import { availableChoices, isOccurrenceRisk, previewRisk } from '../engine/engine';
import { describeChance } from '../engine/risk';
import type { Choice, GameEvent, GameState } from '../engine/types';
import { EffectChips } from './EffectChips';
import { Glossary } from './Glossary';
import { Paragraphs } from './Paragraphs';

interface Props {
  game: GameState;
  event: GameEvent;
  onChoose: (choiceId: string) => void;
  onTermOpen?: (term: string) => void;
}

export function EventCard({ game, event, onChoose, onTermOpen }: Props) {
  const choices = availableChoices(game, event);
  const expert = game.mode === 'expert';

  // 数字キー 1〜4 で選択できる
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const n = Number(e.key);
      if (n >= 1 && n <= choices.length) onChoose(choices[n - 1].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choices, onChoose]);

  return (
    <article className="card event-card" aria-labelledby="event-title">
      <div className="tags">
        {event.tags.map((t) => (
          <span key={t} className={`tag ${t === '異常' ? 'tag-alert' : ''}`}>
            {t}
          </span>
        ))}
      </div>
      <h2 id="event-title">{event.title}</h2>
      <Paragraphs text={event.body} />
      {expert && event.expertNote && <p className="expert-note">{event.expertNote}</p>}
      {event.trigger && <OccurrenceNote event={event} />}

      <ul className="choice-list">
        {choices.map((c, i) => (
          <li key={c.id}>
            <button className="choice" onClick={() => onChoose(c.id)}>
              <span className="choice-key" aria-hidden="true">
                {i + 1}
              </span>
              <span className="choice-body">
                <span className="choice-label">{c.label}</span>
                {(c.pro || c.con) && (
                  <span className="procon">
                    {c.pro && <span className="pro">○ {c.pro}</span>}
                    {c.con && <span className="con">△ {c.con}</span>}
                  </span>
                )}
                {expert && c.effects && <EffectChips effects={c.effects} />}
                <ChanceHint game={game} choice={c} expert={expert} />
              </span>
            </button>
          </li>
        ))}
      </ul>
      {choices.length > 1 && <p className="small muted">キーボードの数字キーでも選べます。</p>}

      {event.terms && event.terms.length > 0 && <Glossary terms={event.terms} onOpen={onTermOpen} />}
    </article>
  );
}

function ChanceHint({ game, choice, expert }: { game: GameState; choice: Choice; expert: boolean }) {
  const est = previewRisk(game, choice);
  if (!est) return null;
  return (
    <span className="chance">
      <span className="chance-main">
        うまくいく見込み：{describeChance(est.p)}
        {expert && `（${Math.round(est.p * 100)}%）`}
      </span>
      {est.factors.length > 0 && (
        <span className="factors">
          {est.factors.map((f) => (
            <span key={f.label} className={f.positive ? 'f-pos' : 'f-neg'}>
              {f.positive ? '＋' : '－'}
              {f.label}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}

/** 発生判定で起きたイベントには、なぜ起きたのかを示す */
function OccurrenceNote({ event }: { event: GameEvent }) {
  if (!event.trigger || !isOccurrenceRisk(event.trigger)) return null;
  const note = OCCURRENCE_NOTES[event.trigger];
  return note ? <p className="info-note">{note}</p> : null;
}
