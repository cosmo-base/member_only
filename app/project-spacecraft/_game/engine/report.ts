import { ENDINGS } from '../data/endings';
import { computeBudgets, getOption, SUBSYSTEMS } from './design';
import { determineEnding } from './engine';
import type { GameState } from './types';
import { getValue } from './values';

export interface MissionReport {
  endingTitle: string;
  endingLead: string;
  design: { name: string; option: string }[];
  keyChoices: string[];
  troubles: string[];
  achievements: string[];
  improvements: string[];
}

export function buildReport(s: GameState): MissionReport {
  const ending = ENDINGS[determineEnding(s)];
  const design = s.design
    ? SUBSYSTEMS.map((sub) => ({ name: sub.name, option: getOption(sub.id, s.design![sub.id]).name }))
    : [];

  const keyChoices = s.log
    .filter((l) => !l.tags.includes('チュートリアル'))
    .map((l) => `${l.eventTitle} → ${l.choiceLabel}${l.check ? (l.check.success ? '（うまくいった）' : '（うまくいかなかった）') : ''}`);

  const troubles = s.log
    .filter((l) => l.tags.includes('異常') || (l.check && !l.check.success))
    .map((l) => `${l.eventTitle}：${l.choiceLabel}`);

  const achievements: string[] = [];
  if (s.flags.includes('contactOk')) achievements.push(`ミッション達成度 ${s.stats.progress}%`);
  if (s.flags.includes('grant')) achievements.push('助成金に採択された');
  if (s.flags.includes('crowdSupport')) achievements.push('多くの支援者から応援を集めた');
  if (s.flags.includes('extended')) achievements.push('予定を超えて運用を続けた');
  if (s.flags.includes('deorbit')) achievements.push('宇宙ごみを残さない運用終了を行った');
  if (s.flags.includes('deorbitDevice')) achievements.push('軌道離脱装置を載せ、宇宙ごみを残さない設計にした');
  if (s.flags.includes('schoolContact')) achievements.push('子どもたちと一緒に衛星からのデータを受信した');
  if (s.flags.includes('viral')) achievements.push('宇宙からの写真で、たくさんの人を宇宙に誘った');
  if (s.flags.includes('stormData')) achievements.push('太陽フレアの貴重な観測データを得た');
  if (s.flags.includes('namePlate')) achievements.push('支援者の名前を宇宙へ届けた');
  if (s.flags.includes('factoryNetwork')) achievements.push('地域の工場とともに「わが町の衛星」をつくった');
  if (s.flags.includes('hamNetwork')) achievements.push('世界中の無線家と一緒に衛星を見守った');
  if (s.flags.includes('lessonsDoc')) achievements.push('学びをまとめ、次の衛星への出発点をつくった');
  if (s.stats.trust >= 70) achievements.push('社会からの信頼を大きく高めた');
  if (achievements.length === 0) achievements.push('設計・試験の記録という、次につながる資産を残した');

  return { endingTitle: ending.title, endingLead: ending.lead, design, keyChoices, troubles, achievements, improvements: suggestImprovements(s) };
}

/** 失敗を責めず「次にどう活かせるか」を、状態から規則的に導く */
export function suggestImprovements(s: GameState): string[] {
  const out: string[] = [];
  const f = (x: string) => s.flags.includes(x);
  if (getValue(s, 'coverage') < 40)
    out.push('試験の範囲を広げると、打ち上げ前に不具合を見つけやすくなります。費用と時間の配分を、少し試験寄りにしてみるのも一案です。');
  if (!f('opsRehearsal'))
    out.push('運用リハーサルで異常時の手順を用意しておくと、通信トラブルなどへの対応の選択肢が増えます。');
  if (getValue(s, 'issues') >= 3)
    out.push('未解決の不具合が多いまま打ち上げを迎えました。統合の段階で原因をじっくり調べると、軌道上の想定外が減ります。');
  if (s.design) {
    const b = computeBudgets(s.design);
    if (b.powerMargin < 15)
      out.push('電力の余裕が小さい構成でした。発電量を増やすか、消費電力の少ない機器を組み合わせると運用が楽になります。');
    if (b.massMargin < 10) out.push('質量の余裕が小さく、設計後半の変更が難しくなりました。最初の構成で余裕を残しておくと安心です。');
    if (b.thermalMargin < 8) out.push('熱の余裕が小さめでした。ヒーター付きの熱制御や、消費電力の見直しが効きます。');
    if (b.missionPotential < 40)
      out.push('観測機器・通信・姿勢制御の組み合わせで、得られる成果の大きさが変わります。次は成果の上限を少し上げる構成も試してみましょう。');
  }
  if (f('noContact') && !f('groundCommercial'))
    out.push('大きなアンテナの地上局を使うと、通信の余裕が増えてつながりやすくなります。');
  if (f('unresolvedReset'))
    out.push('試験中に一度だけ起きた異常は、宇宙でも起きることがあります。再現しなくても、原因を突き止めておくと安心です。');
  if (f('orbitHigh') && !f('deorbitDevice'))
    out.push('高めの軌道では、運用後も長く宇宙に残ります。軌道離脱装置を載せると、宇宙ごみを減らせます。');
  if (!f('otaCapable') && s.log.some((l) => l.tags.includes('ソフトウェア') || l.eventId === 'o-hang'))
    out.push('打ち上げ後にソフトを書き換えられる設計にしておくと、軌道上の不具合を直せる選択肢が増えます。');
  if (f('launchLate') && s.log.some((l) => l.eventId === 'te-slot'))
    out.push('ロケットの席は早めに押さえておくと、終盤の日程や費用の心配が減ります。');
  if (f('noContact') && !f('e2eTest'))
    out.push('打ち上げ前に本番の地上局とつないで通信試験をしておくと、最初の通信が成功しやすくなります。');
  if (s.stats.team < 40) out.push('チームの疲れが溜まっていました。休む判断も、プロジェクトを前に進める大切な選択です。');
  if (s.stats.trust < 40) out.push('広報や成果の共有を増やすと、資金調達や困ったときの支援につながりやすくなります。');
  if (out.length === 0) out.push('バランスの良いプロジェクトでした。次は別のミッションや、もう一段挑戦的な構成も試してみましょう。');
  return out;
}

export function reportToText(s: GameState, r: MissionReport): string {
  const lines = [
    '【宇宙機プロジェクトシミュレーター ミッションレポート】',
    `モード：${s.mode === 'beginner' ? 'まずは体験する（初心者モード）' : '設計を深く考える（玄人モード）'}`,
    `結果：${r.endingTitle}`,
    '',
    '■ 機体構成',
    ...(r.design.length ? r.design.map((d) => `・${d.name}：${d.option}`) : ['・（未決定）']),
    '',
    '■ 得られた成果',
    ...r.achievements.map((a) => `・${a}`),
    '',
    '■ トラブル・うまくいかなかったこと',
    ...(r.troubles.length ? r.troubles.map((t) => `・${t}`) : ['・大きなトラブルはありませんでした']),
    '',
    '■ 次に向けたヒント',
    ...r.improvements.map((i) => `・${i}`),
  ];
  return lines.join('\n');
}
