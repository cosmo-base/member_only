import { useState } from 'react';
import { clearAll, DEFAULT_PREFS, type Prefs } from '../storage';
import { ConsentDetails } from './ConsentDetails';

interface Props {
  prefs: Prefs;
  consented: boolean;
  onChange: (p: Prefs) => void;
  onBack: () => void;
}

export function DataSettings({ prefs, consented, onChange, onBack }: Props) {
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);

  return (
    <div className="data-settings">
      <section className="card">
        <h1>保存とデータの設定</h1>
        <p className="body-text">
          このゲームはアカウント登録なしで遊べます。プレイの進み具合をサーバーに保存することはありません。
        </p>
      </section>

      <section className="card">
        <h2>この端末への途中経過の保存</h2>
        <label className="checkbox">
          <input type="checkbox" checked={prefs.localSave} onChange={(e) => onChange({ ...prefs, localSave: e.target.checked })} />
          途中経過をこのブラウザに保存する
        </label>
        <p className="small muted">
          保存するかどうかは自由に選べます。保存先はお使いのブラウザの中だけです。オフにすると保存済みの途中経過は消去されます。ブラウザのサイトデータを消去しても消えます。
        </p>
      </section>

      <section className="card">
        <h2>プレイデータの利用</h2>
        <p className="body-text">
          現在の状態：<strong>{consented ? '同意しています' : '同意していません'}</strong>
        </p>
        <ConsentDetails />
        {consented &&
          (confirmWithdraw ? (
            <div className="hint withdraw-note">
              <p>同意を撤回すると、以後の送信は止まり、もう一度同意するまでゲームを遊べなくなります。撤回しますか？</p>
              <div className="actions">
                <button
                  className="btn primary"
                  onClick={() => {
                    setConfirmWithdraw(false);
                    onChange({ ...prefs, analyticsConsent: false, consentVersion: null });
                  }}
                >
                  撤回する
                </button>
                <button className="btn on-cream" onClick={() => setConfirmWithdraw(false)}>
                  やめる
                </button>
              </div>
            </div>
          ) : (
            <div className="actions">
              <button className="btn" onClick={() => setConfirmWithdraw(true)}>
                同意を撤回する
              </button>
            </div>
          ))}
      </section>

      <section className="card">
        <h2>すべて消去</h2>
        <p className="small muted">この端末に保存した途中経過と設定（同意の状態を含む）を消去します。</p>
        <button
          className="btn"
          onClick={() => {
            clearAll();
            onChange(DEFAULT_PREFS);
          }}
        >
          保存データと設定を消去する
        </button>
      </section>

      <div className="actions center">
        <button className="btn primary" onClick={onBack}>
          戻る
        </button>
      </div>
    </div>
  );
}
