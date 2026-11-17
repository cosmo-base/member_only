import { useState } from 'react';
import { computeBudgets, DEFAULT_DESIGN, marginLevel, SUBSYSTEMS } from '../engine/design';
import type { Design, GameEvent, GameState } from '../engine/types';
import { Glossary } from './Glossary';
import { Paragraphs } from './Paragraphs';

interface Props {
  game: GameState;
  event: GameEvent;
  onConfirm: (d: Design) => void;
  onTermOpen?: (term: string) => void;
}

const LEVEL_TEXT = { ok: '余裕あり', tight: 'ギリギリ', short: '足りない' } as const;

export function DesignView({ game, event, onConfirm, onTermOpen }: Props) {
  const [design, setDesign] = useState<Design>(DEFAULT_DESIGN);
  const expert = game.mode === 'expert';
  const b = computeBudgets(design);
  const remaining = game.stats.budget - b.cost;
  const overMass = b.massMargin < 0;

  const meters = [
    { k: 'powerMargin' as const, name: '電気の余裕', value: `${b.powerMargin}%`, detail: `発電 ${b.generation}W ／ 消費 ${b.consumption}W` },
    { k: 'massMargin' as const, name: '重さの余裕', value: `${b.massMargin}%`, detail: `${b.mass}kg ／ 上限 12kg` },
    { k: 'thermalMargin' as const, name: '温度の余裕', value: `${b.thermalMargin}℃`, detail: '消費電力が増えると発熱も増える' },
    { k: 'linkMargin' as const, name: '通信の余裕', value: `${b.linkMargin}dB`, detail: '大きいほどつながりやすい' },
  ];

  return (
    <article className="card design-card" aria-labelledby="design-title">
      <h2 id="design-title">{event.title}</h2>
      <Paragraphs text={event.body} />

      <div className="design-layout">
        <div className="subsystems">
          {SUBSYSTEMS.map((sub) => (
            <fieldset key={sub.id} className="subsystem">
              <legend>
                <span className="sub-name">{sub.name}</span>
                <span className="sub-q">{sub.question}</span>
              </legend>
              <div className="options">
                {sub.options.map((o) => {
                  const checked = design[sub.id] === o.id;
                  return (
                    <label key={o.id} className={`option ${checked ? 'checked' : ''}`}>
                      <input
                        type="radio"
                        name={sub.id}
                        value={o.id}
                        checked={checked}
                        onChange={() => setDesign({ ...design, [sub.id]: o.id })}
                      />
                      <span className="option-name">{o.name}</span>
                      <span className="option-summary">{o.summary}</span>
                      <span className="procon">
                        <span className="pro">○ {o.pro}</span>
                        <span className="con">△ {o.con}</span>
                      </span>
                      <span className="option-spec">
                        {o.cost}万円
                        {expert && (
                          <>
                            {' '}・{o.mass}kg・{sub.id === 'power' ? `発電${o.power}W` : `${o.power}W`}
                            {o.months > 0 && `・+${o.months}ヶ月`}
                          </>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <aside className="design-budget" aria-live="polite">
          <h3 className="panel-subtitle">この構成の見通し</h3>
          <div className={`budget-line ${remaining < 0 ? 'neg' : ''}`}>
            <span>総費用</span>
            <strong>{b.cost.toLocaleString('ja-JP')}万円</strong>
          </div>
          <div className={`budget-line ${remaining < 0 ? 'neg' : ''}`}>
            <span>決定後の資金</span>
            <strong>{remaining.toLocaleString('ja-JP')}万円</strong>
          </div>
          <div className="budget-line">
            <span>開発期間</span>
            <strong>+{b.months + 2}ヶ月</strong>
          </div>
          <div className="budget-line">
            <span>ミッション価値の上限</span>
            <strong>{b.missionPotential}</strong>
          </div>

          <ul className="margin-list">
            {meters.map((m) => {
              const lv = marginLevel(m.k, b[m.k]);
              return (
                <li key={m.k} className={`lv-${lv}`}>
                  <span>
                    {m.name}
                    {expert && <small className="muted"> {m.detail}</small>}
                  </span>
                  <span className="lv">{expert ? m.value : LEVEL_TEXT[lv]}</span>
                </li>
              );
            })}
          </ul>

          {remaining < 0 && (
            <p className="hint">今の資金を超える構成です。この後の資金調達で補う必要があります。</p>
          )}
          {b.powerMargin < 0 && (
            <p className="hint">ここで少し立ち止まって、電力に余裕があるか見てみましょう。消費電力が発電量を上回っています。</p>
          )}
          {overMass && <p className="hint warn">ロケットに載せられる重さの上限を超えています。どこかを軽い機器にしてみましょう。</p>}

          <button className="btn primary block" disabled={overMass} onClick={() => onConfirm(design)}>
            この構成で進める
          </button>
        </aside>
      </div>

      {/* スマホ幅では見通しが一番下になるので、要約を画面下に固定して選びながら確認できるようにする */}
      <div className="design-sticky" role="region" aria-label="この構成の見通し（要約）">
        <div className="sticky-info">
          <span className={remaining < 0 ? 'neg' : ''}>
            残りの資金 <strong>{remaining.toLocaleString('ja-JP')}万円</strong>
          </span>
          <span className="sticky-levels">
            {meters.map((m) => {
              const lv = marginLevel(m.k, b[m.k]);
              return (
                <span key={m.k} className={`lv-${lv}`}>
                  {m.name.replace('の余裕', '')}
                  <span className="lv">{expert ? m.value : LEVEL_TEXT[lv]}</span>
                </span>
              );
            })}
          </span>
        </div>
        <button className="btn primary" disabled={overMass} onClick={() => onConfirm(design)}>
          決定
        </button>
      </div>

      {event.terms && (
        <Glossary
          terms={[...event.terms, ...SUBSYSTEMS.map((s) => s.term!).filter((t) => !event.terms!.includes(t))]}
          onOpen={onTermOpen}
        />
      )}
    </article>
  );
}
