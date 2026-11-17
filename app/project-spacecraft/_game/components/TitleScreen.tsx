import { PHASES } from '../engine/engine';
import type { GameState, Mode } from '../engine/types';

interface Props {
  onStart: (mode: Mode) => void;
  saved: GameState | null;
  onContinue: () => void;
  onOpenData: () => void;
}

export function TitleScreen({ onStart, saved, onContinue, onOpenData }: Props) {
  return (
    <div className="title-screen">
      <section className="hero">
        <p className="eyebrow">PROJECT SPACECRAFT</p>
        <h1 className="serif">宇宙機プロジェクトシミュレーター</h1>
        <p className="hero-lead">
          宇宙の知識がなくても大丈夫。<br />
          興味から始めて、宇宙機づくりを体験しよう。
        </p>
        <p className="hero-body">
          あなたは小さな人工衛星プロジェクトの責任者です。ミッションを考え、機体を選び、資金と仲間を集め、試験を重ねて、宇宙へ送り出します。
          唯一の正解はありません。限られた予算と時間の中で、何を大切にするかを選んでいきましょう。
        </p>
      </section>

      {saved && (
        <div className="continue-card">
          <div>
            <strong>前回の続きがあります</strong>
            <span className="muted">
              {saved.mode === 'beginner' ? '初心者モード' : '玄人モード'}・{PHASES[Math.min(saved.phaseIndex, PHASES.length - 1)].name}
            </span>
          </div>
          <button className="btn primary" onClick={onContinue}>
            続きから
          </button>
        </div>
      )}

      <section className="mode-grid" aria-label="モードを選ぶ">
        <button className="mode-card" onClick={() => onStart('beginner')}>
          <span className="mode-name">まずは体験する</span>
          <span className="mode-tag">初心者モード</span>
          <span className="mode-desc">
            専門用語にはやさしい説明つき。予算・期間・信頼性などの少ない指標で、宇宙機づくりの流れを楽しめます。
          </span>
        </button>
        <button className="mode-card" onClick={() => onStart('expert')}>
          <span className="mode-name">設計を深く考える</span>
          <span className="mode-tag">玄人モード</span>
          <span className="mode-desc">
            質量・電力・熱・通信のマージン、検証カバレッジ、運用負荷まで。サブシステム間の整合性とトレードオフに向き合います。
          </span>
        </button>
      </section>
      <p className="center muted small">
        2つのモードは難易度の上下ではなく、体験の深さの違いです。どちらからでもどうぞ。
      </p>

      <section className="flow">
        <h2>プロジェクトの流れ</h2>
        <ol className="flow-list">
          {PHASES.map((p, i) => (
            <li key={p.id}>
              <span className="flow-num">{i + 1}</span>
              {p.name}
            </li>
          ))}
        </ol>
      </section>

      <p className="center small">
        アカウント登録は不要です。途中経過のブラウザ内保存は{' '}
        <button className="link-button inline" onClick={onOpenData}>
          保存とデータの設定
        </button>{' '}
        から任意で有効にできます。
      </p>
    </div>
  );
}
