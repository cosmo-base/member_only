import { useState } from 'react';
import { ConsentDetails } from './ConsentDetails';

interface Props {
  onAgree: () => void;
}

/** 初回起動時の同意画面。同意するまでゲームは始められない */
export function ConsentScreen({ onAgree }: Props) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="consent">
      <section className="hero">
        <p className="eyebrow">PROJECT SPACECRAFT</p>
        <h1 className="serif">宇宙機プロジェクトシミュレーター</h1>
        <p className="hero-lead">宇宙の知識がなくても大丈夫。はじめる前に、ひとつだけ確認させてください。</p>
      </section>

      <section className="card consent-card" aria-labelledby="consent-title">
        <h2 id="consent-title">プレイデータの利用について</h2>
        <p className="body-text">
          このゲームをもっとおもしろく、分かりやすくするために、遊んだ結果のデータを使わせてください。あなたが誰かを特定できる情報は集めません。
        </p>
        <ConsentDetails />
        <p className="small muted withdraw-note">アカウント登録は不要です。プレイの進み具合をサーバーに保存することもありません。</p>

        <label className="checkbox">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          上記の内容を読み、プレイデータの利用に同意します
        </label>
        <div className="actions">
          <button className="btn primary" disabled={!checked} onClick={onAgree}>
            同意してはじめる
          </button>
        </div>
        <p className="small muted">このゲームを遊ぶには、プレイデータの利用への同意が必要です。</p>
      </section>
    </div>
  );
}
