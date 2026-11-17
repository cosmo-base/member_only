import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { buildFeedbackPayload, buildPlayPayload, FEEDBACK_MAX, newPlayId, sendAnalytics, type SendResult } from '../engine/analytics';
import { buildReport, reportToText } from '../engine/report';
import type { GameState } from '../engine/types';

interface Props {
  game: GameState;
  onRestart: () => void;
}

// プレイごとの送信状態はメモリ上だけで持つ（ブラウザには保存しない）
const playIds = new WeakMap<GameState, string>();
const sentPlays = new WeakSet<GameState>();

function playIdFor(game: GameState) {
  if (game.playId) return game.playId;
  let id = playIds.get(game);
  if (!id) {
    id = newPlayId();
    playIds.set(game, id);
  }
  return id;
}

export function ReportScreen({ game, onRestart }: Props) {
  const report = useMemo(() => buildReport(game), [game]);
  const text = useMemo(() => reportToText(game, report), [game, report]);
  const [copied, setCopied] = useState(false);
  const playId = playIdFor(game);

  // エンディングに着いたら、プレイ結果を1回だけ送る（同意済みの参加者だけがここに来る）。
  // 設定画面から戻って再表示されても、同じプレイは送り直さない
  useEffect(() => {
    if (sentPlays.has(game)) return;
    sentPlays.add(game);
    void sendAnalytics(buildPlayPayload(game, playId), true);
  }, [game, playId]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="report">
      <section className="card report-hero">
        <p className="eyebrow">MISSION REPORT</p>
        <h1 className="serif">{report.endingTitle}</h1>
        <p className="body-text">{report.endingLead}</p>
        {game.flags.includes('contactOk') && (
          <div className="progress-big" aria-label={`ミッション達成度 ${game.stats.progress}%`}>
            <div className="bar">
              <span style={{ width: `${game.stats.progress}%` }} />
            </div>
            <span>
              ミッション達成度 <strong>{game.stats.progress}%</strong>
            </span>
          </div>
        )}
      </section>

      <div className="report-grid">
        <Section title="機体構成">
          {report.design.length ? (
            <dl className="kv">
              {report.design.map((d) => (
                <div key={d.name}>
                  <dt>{d.name}</dt>
                  <dd>{d.option}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="muted">機体構成を決める前に終了しました。</p>
          )}
        </Section>
        <Section title="得られた成果">
          <List items={report.achievements} />
        </Section>
        <Section title="トラブル・うまくいかなかったこと">
          {report.troubles.length ? <List items={report.troubles} /> : <p className="muted">大きなトラブルはありませんでした。</p>}
        </Section>
        <Section title="次に向けたヒント">
          <List items={report.improvements} />
        </Section>
      </div>

      <section className="card">
        <h2>選択の記録</h2>
        <ol className="history">
          {report.keyChoices.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ol>
      </section>

      <section className="card">
        <h2>レポートを共有する（任意）</h2>
        <p className="small muted">下のテキストはこの端末の中だけで作られています。必要なときにコピーしてお使いください。</p>
        <textarea className="report-text" readOnly value={text} rows={10} aria-label="ミッションレポートのテキスト" />
        <div className="actions">
          <button className="btn" onClick={copy}>
            {copied ? 'コピーしました' : 'テキストをコピー'}
          </button>
        </div>
      </section>

      <Feedback playId={playId} />

      <section className="card next-step">
        <h2>次の一歩（任意）</h2>
        <p className="body-text">
          「あ、宇宙機ってこうやって作るんだ」と感じたら、Cosmo Base の記事やイベント、コミュニティで、もう少し宇宙に触れてみませんか。
          もちろん、もう一度ちがう選択で遊んでみるのも大歓迎です。
        </p>
      </section>

      <div className="actions center">
        <button className="btn primary" onClick={onRestart}>
          タイトルに戻る
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="bullets">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

const SEND_MESSAGES: Record<SendResult, string> = {
  sent: '送信しました。ご協力ありがとうございます。',
  'no-consent': 'データ収集に同意していないため、送信は行われませんでした。',
  'not-configured': '送信先が設定されていない開発版のため、送信は行われませんでした。内容はどこにも保存されていません。',
  error: '送信できませんでした。時間をおいてお試しください。',
};

/** ゲームは同意後にしか遊べないため、ここに来た時点で同意済み */
function Feedback({ playId }: { playId: string }) {
  const [text, setText] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  // ご意見の送信では、ご意見と playId だけを送る（プレイの中身は ① で送り済み）
  const payload = buildFeedbackPayload(playId, text.trim());

  const submit = async () => {
    setSending(true);
    setResult(await sendAnalytics(payload, true));
    setSending(false);
  };

  return (
    <section className="card feedback">
      <h2>ご意見・ご感想（任意）</h2>
      <p className="body-text">ゲームの改善のため、気づいたことや感想を自由にお書きください。</p>
      <p className="notice">
        氏名、メールアドレス、住所、所属先など、個人を特定できる情報は入力しないでください。入力内容はゲームの改善・分析に利用する場合があります。送信前に、個人情報が含まれていないことをご確認ください。
      </p>
      <label className="sr-only" htmlFor="feedback">
        ご意見・ご感想
      </label>
      <textarea
        id="feedback"
        value={text}
        maxLength={FEEDBACK_MAX}
        rows={5}
        placeholder="例：玄人モードの電力収支が難しかった。設計変更の理由が分かる説明が欲しい。"
        onChange={(e) => {
          setText(e.target.value);
          setResult(null);
        }}
      />
      <p className="small muted right">
        {text.length} / {FEEDBACK_MAX} 文字
      </p>
      <p className="small muted">入力は任意です。空欄のままでも大丈夫です。</p>

      <label className="checkbox">
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
        個人を特定できる情報を入力していないことを確認しました
      </label>
      <button className="link-button" onClick={() => setShowPreview(!showPreview)} aria-expanded={showPreview}>
        {showPreview ? '送信内容を閉じる' : '送信される内容を確認する'}
      </button>
      {showPreview && <pre className="payload">{JSON.stringify(payload, null, 2)}</pre>}
      <div className="actions">
        <button className="btn primary" disabled={!confirmed || !text.trim() || sending || result === 'sent'} onClick={submit}>
          {sending ? '送信中…' : result === 'sent' ? '送信しました' : '送信する'}
        </button>
      </div>
      {result && <p className="info-note">{SEND_MESSAGES[result]}</p>}
    </section>
  );
}
