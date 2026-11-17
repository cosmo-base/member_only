import { computeBudgets, marginLevel } from '../engine/design';
import { START_MONTHS } from '../engine/engine';
import type { GameState, StatKey, TechKey } from '../engine/types';
import { getValue, LABELS, UNITS } from '../engine/values';

const STAT_HELP: Record<StatKey, string> = {
  budget: '使えるお金の残り',
  months: '打ち上げ予定日までの余裕。マイナスになると間に合わない',
  reliability: '機体と運用がうまくいく見込み',
  mission: '成功したときに得られる成果の大きさ',
  team: 'メンバーの元気さと連携',
  trust: '支援者や関係者からの評価',
  progress: '目標に対してどこまで達成できたか',
};

const TECH_SHOWN: TechKey[] = ['massMargin', 'powerMargin', 'thermalMargin', 'linkMargin', 'coverage', 'issues', 'opsLoad'];

export function Dashboard({ game }: { game: GameState }) {
  const launched = game.phaseIndex >= 8;
  const stats: StatKey[] = launched
    ? ['progress', 'reliability', 'mission', 'team', 'trust', 'budget']
    : ['budget', 'months', 'reliability', 'mission', 'team', 'trust'];

  return (
    <aside className="dashboard" aria-label="プロジェクトの状態">
      <h2 className="panel-title">プロジェクトの状態</h2>
      <ul className="stat-list">
        {stats.map((k) => (
          <StatRow key={k} k={k} value={getValue(game, k)} />
        ))}
      </ul>

      {game.design && game.mode === 'expert' && (
        <>
          <h3 className="panel-subtitle">技術状態</h3>
          <dl className="tech-list">
            {TECH_SHOWN.map((k) => {
              const v = getValue(game, k);
              const warn =
                (k === 'massMargin' || k === 'powerMargin' || k === 'thermalMargin' || k === 'linkMargin') &&
                marginLevel(k, v) !== 'ok';
              return (
                <div key={k} className={warn ? 'warn' : ''}>
                  <dt>{LABELS[k]}</dt>
                  <dd>
                    {v}
                    {UNITS[k]}
                  </dd>
                </div>
              );
            })}
          </dl>
          <DesignSummary game={game} />
        </>
      )}

      {game.design && game.mode === 'beginner' && <BeginnerMargins game={game} />}
    </aside>
  );
}

function StatRow({ k, value }: { k: StatKey; value: number }) {
  const bar = k === 'budget' ? Math.max(0, Math.min(100, value / 30)) : k === 'months' ? Math.max(0, Math.min(100, (value / START_MONTHS) * 100)) : value;
  const low = k === 'budget' ? value < 0 : k === 'months' ? value < 0 : value < 30;
  return (
    <li className={`stat ${low ? 'low' : ''}`}>
      <div className="stat-head">
        <span className="stat-label">{LABELS[k]}</span>
        <span className="stat-value">
          {k === 'budget' ? value.toLocaleString('ja-JP') : value}
          <small>{UNITS[k]}</small>
        </span>
      </div>
      <div className="bar" aria-hidden="true">
        <span style={{ width: `${bar}%` }} />
      </div>
      <span className="stat-help">{STAT_HELP[k]}</span>
    </li>
  );
}

const LEVEL_TEXT = { ok: '余裕あり', tight: 'ギリギリ', short: '足りない' } as const;

function BeginnerMargins({ game }: { game: GameState }) {
  const items: { k: 'powerMargin' | 'massMargin' | 'thermalMargin' | 'linkMargin'; name: string }[] = [
    { k: 'powerMargin', name: '電気' },
    { k: 'massMargin', name: '重さ' },
    { k: 'thermalMargin', name: '温度' },
    { k: 'linkMargin', name: '通信' },
  ];
  return (
    <>
      <h3 className="panel-subtitle">機体の余裕</h3>
      <ul className="margin-list">
        {items.map(({ k, name }) => {
          const lv = marginLevel(k, getValue(game, k));
          return (
            <li key={k} className={`lv-${lv}`}>
              <span>{name}</span>
              <span className="lv">{LEVEL_TEXT[lv]}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function DesignSummary({ game }: { game: GameState }) {
  const b = computeBudgets(game.design!);
  return (
    <p className="small muted design-summary">
      設計値：質量 {b.mass}kg / 発電 {b.generation}W・消費 {b.consumption}W / ミッション上限 {b.missionPotential}
    </p>
  );
}
