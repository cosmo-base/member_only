import { useEffect, useRef } from 'react';
import { choose, confirmDesign, getEvent, PHASES, proceed } from '../engine/engine';
import type { Design, GameState } from '../engine/types';
import { Dashboard } from './Dashboard';
import { DesignView } from './DesignView';
import { EventCard } from './EventCard';
import { ResultCard } from './ResultCard';

interface Props {
  game: GameState;
  setGame: (g: GameState) => void;
}

/** 放置して席を外した場合に分析がゆがまないよう、1回の選択にかかった時間は30分で打ち切る */
const MAX_DECISION_MS = 30 * 60 * 1000;

export function GameScreen({ game, setGame }: Props) {
  const event = game.currentEventId ? getEvent(game.currentEventId) : null;
  const mainRef = useRef<HTMLDivElement>(null);
  const shownAt = useRef(Date.now());

  // 画面が切り替わったら、キーボード・読み上げ利用者のためにフォーカスを先頭へ移す
  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
    mainRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [game.currentEventId, game.lastResult]);

  // イベントが表示された時刻（選ぶまでの時間を測る起点）
  useEffect(() => {
    if (game.currentEventId && !game.lastResult) shownAt.current = Date.now();
  }, [game.currentEventId, game.lastResult]);

  /** 選んだ結果の記録に、選ぶまでにかかった時間を付ける（ゲームの進行には影響しない） */
  const withTiming = (next: GameState) => {
    const last = next.log[next.log.length - 1];
    if (last) last.ms = Math.min(MAX_DECISION_MS, Date.now() - shownAt.current);
    return next;
  };

  const openTerm = (term: string) => {
    const opens = game.termOpens ?? {};
    setGame({ ...game, termOpens: { ...opens, [term]: (opens[term] ?? 0) + 1 } });
  };

  return (
    <div className="game">
      <PhaseStepper index={game.phaseIndex} />
      <div className="game-grid">
        <Dashboard game={game} />
        <div className="game-main" ref={mainRef} tabIndex={-1}>
          {game.lastResult ? (
            <ResultCard game={game} entry={game.lastResult} onNext={() => setGame(proceed(game))} />
          ) : event?.kind === 'design' ? (
            <DesignView
              game={game}
              event={event}
              onConfirm={(d: Design) => setGame(withTiming(confirmDesign(game, d)))}
              onTermOpen={openTerm}
            />
          ) : event ? (
            <EventCard game={game} event={event} onChoose={(id) => setGame(withTiming(choose(game, id)))} onTermOpen={openTerm} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PhaseStepper({ index }: { index: number }) {
  const current = PHASES[Math.min(index, PHASES.length - 1)];
  return (
    <nav className="stepper" aria-label="進行状況">
      <p className="stepper-label">
        フェーズ {Math.min(index + 1, PHASES.length)} / {PHASES.length}：<strong>{current.name}</strong>
      </p>
      <ol className="stepper-track">
        {PHASES.map((p, i) => (
          <li
            key={p.id}
            className={i < index ? 'done' : i === index ? 'current' : ''}
            aria-current={i === index ? 'step' : undefined}
            title={p.name}
          >
            <span className="sr-only">{p.name}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
