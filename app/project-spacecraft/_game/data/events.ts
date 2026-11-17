import type { GameEvent } from '../engine/types';
import { EXTRA_EVENTS } from './eventsExtra';
import { EXTRA_EVENTS_2 } from './eventsExtra2';

/** 追加イベントを `before` の位置に差し込む。指定がなければ末尾に並べる */
function mergeEvents(base: GameEvent[], extra: GameEvent[]): GameEvent[] {
  const out = [...base];
  for (const e of extra) {
    const i = e.before ? out.findIndex((x) => x.id === e.before) : -1;
    if (e.before && i < 0) throw new Error(`event ${e.id}: unknown before target ${e.before}`);
    if (i < 0) out.push(e);
    else out.splice(i, 0, e);
  }
  return out;
}

/**
 * イベントデータ。ゲーム中に文章を生成せず、ここに用意した内容だけを参照する。
 * 並び順がフェーズ内の発生順になる。
 */
const BASE_EVENTS: GameEvent[] = [
  // ───────── フェーズ横断（条件を満たすと割り込む） ─────────
  {
    id: 'g-budget-1',
    phase: 'any',
    mode: 'common',
    title: '資金が足りなくなってきた',
    body: '計算してみると、予定している作業をすべて進めるには資金が足りません。ここで少し立ち止まって、どう補うか考えてみましょう。',
    tags: ['資金'],
    conditions: { max: { budget: -1 }, minPhase: 'team' },
    choices: [
      {
        id: 'ask', label: '支援者・スポンサーに追加支援をお願いする',
        pro: 'うまくいけば計画を変えずに進められる', con: '信頼が足りないと断られる',
        effects: { months: -1 }, flags: ['budgetWarned'],
        check: {
          risk: 'emergencyFunding',
          success: { effects: { budget: 800, trust: -3 }, text: '事情を丁寧に説明したところ、追加の支援をいただけました。報告の機会を増やして、期待に応えていきましょう。' },
          failure: { effects: { trust: -5 }, text: '今回は支援が見送られました。これまでの進捗や説明の分かりやすさを積み重ねると、次は結果が変わるかもしれません。' },
        },
      },
      {
        id: 'downsize', label: '計画を縮小して費用を抑える',
        pro: '確実に資金を確保できる', con: 'ミッションの価値が下がる',
        effects: { budget: 900, mission: -15, reliability: -3 }, flags: ['budgetWarned', 'downsized'],
        text: '観測の頻度や機能の一部を見直し、費用を抑えました。できることは減りましたが、プロジェクトを前に進められます。',
      },
    ],
  },
  {
    id: 'g-budget-2',
    phase: 'any',
    mode: 'common',
    title: 'まだ資金が足りない',
    body: '工夫を重ねてきましたが、まだ資金が足りません。打ち上げまでたどり着くには、もう一段の判断が必要です。',
    tags: ['資金'],
    conditions: { max: { budget: -1 }, flags: ['budgetWarned'] },
    choices: [
      {
        id: 'downsize', label: '観測機能を大きく絞って続ける',
        pro: 'プロジェクトを続けられる', con: 'ミッションの価値が大きく下がる',
        requires: { notFlags: ['downsized'] },
        effects: { budget: 900, mission: -20, reliability: -3 }, flags: ['downsized', 'budgetFinal'],
        text: '観測機能を最低限に絞りました。「最低限ここまでは」という目標を守るための判断です。',
      },
      {
        id: 'close', label: 'ここで区切りをつけ、成果をまとめる',
        effects: {},
        text: '資金の制約から、今回は打ち上げ前にプロジェクトを終えることにしました。設計資料や試験の記録は、次の挑戦の出発点になります。',
        end: 'early',
      },
    ],
  },
  {
    id: 'g-budget-3',
    phase: 'any',
    mode: 'common',
    title: 'プロジェクトの区切り',
    body: 'あらゆる手を尽くしましたが、打ち上げまでの費用を確保する見通しが立ちませんでした。ここまでの設計や試験の成果は、次のプロジェクトに引き継ぐことができます。',
    tags: ['資金'],
    conditions: { max: { budget: -1 }, flags: ['budgetWarned'], minPhase: 'launch' },
    choices: [
      {
        id: 'close', label: 'ここで区切りをつけ、成果をまとめる',
        effects: {},
        text: '資金の制約から、今回は打ち上げ前にプロジェクトを終えることにしました。設計資料や試験の記録は、次の挑戦の出発点になります。',
        end: 'early',
      },
    ],
  },

  // ───────── 1. ミッション構想 ─────────
  {
    id: 'b-intro',
    phase: 'concept',
    mode: 'beginner',
    title: 'ようこそ、プロジェクト責任者さん',
    body: 'あなたは小さな人工衛星プロジェクトの責任者になりました。衛星づくりでは、機体の性能だけでなく、お金・人・時間・試験の準備がすべて結果を左右します。\n\n画面の左（スマートフォンでは上）にある数値が、プロジェクトの状態です。わからない言葉は、カードの下にある用語ボタンで確認できます。',
    terms: ['人工衛星', 'バス'],
    tags: ['チュートリアル'],
    choices: [
      { id: 'go', label: 'はじめる', text: 'まずは「何をしたいか」から考えていきましょう。' },
    ],
  },
  {
    id: 'c-mission',
    phase: 'concept',
    mode: 'common',
    title: '何を宇宙から見てみたい？',
    body: 'すべてのプロジェクトは「宇宙で何をしたいか」から始まります。あなたのチームは、どんなテーマに取り組みますか？',
    expertNote: 'ミッション定義は後続の機器選定・軌道・運用計画すべての前提になります。',
    terms: ['ミッション'],
    tags: ['構想'],
    choices: [
      {
        id: 'earth', label: '地球の環境（森林・海・雲）',
        pro: '研究機関の関心が高く、助成金と相性が良い', con: '地道な観測の積み重ねが必要',
        effects: { mission: 10, trust: 3 }, flags: ['missionEarth'],
        text: '地球環境の変化を宇宙から見守るミッションに決まりました。長く観測を続けるほど価値が高まるテーマです。',
      },
      {
        id: 'night', label: '夜の街の明かり',
        pro: '多くの人の共感を集めやすい', con: '撮影の条件が限られる',
        effects: { mission: 6, trust: 8 }, flags: ['missionNight'],
        text: '夜の地球を撮るミッションに決まりました。街の明かりは人の暮らしそのもの。多くの人が興味を持ってくれそうです。',
      },
      {
        id: 'weather', label: '宇宙天気（太陽の活動と放射線）',
        pro: '科学的な価値が高い', con: '一般の人には少し伝わりにくい',
        effects: { mission: 12, trust: 0 }, flags: ['missionWeather'],
        text: '太陽活動が宇宙環境に与える影響を調べるミッションに決まりました。将来の衛星運用にも役立つ、価値の高いデータが期待できます。',
      },
    ],
  },
  {
    id: 'c-team',
    phase: 'concept',
    mode: 'common',
    title: '誰と一緒に始める？',
    body: 'ミッションのテーマが決まりました。最初の仲間をどこに求めるかで、プロジェクトの雰囲気が変わります。',
    tags: ['チーム'],
    choices: [
      {
        id: 'lab', label: '大学の研究室と組む',
        pro: '技術的な知見と設備を借りられる', con: '意思決定に時間がかかることがある',
        effects: { reliability: 5, months: -1, team: 5 }, flags: ['partnerLab'],
        text: '研究室の先生と学生が仲間に加わりました。試験設備を借りられる見込みも立ちました。',
      },
      {
        id: 'factory', label: '地元の町工場と組む',
        pro: '精密な部品づくりが得意で、話が早い', con: '宇宙特有のノウハウはこれから',
        effects: { budget: 200, team: 8, trust: 3 }, flags: ['partnerFactory'],
        text: '町工場の皆さんが「おもしろそうだ」と協力してくれることに。部品の一部を手頃な費用で作ってもらえそうです。',
      },
      {
        id: 'open', label: 'SNSで仲間を広く募る',
        pro: 'いろいろな背景を持つ人が集まる', con: 'まとめ役の負担が大きい',
        effects: { trust: 8, team: -3 }, flags: ['openTeam'],
        text: '思いがけずたくさんの人が手を挙げてくれました。多様な視点はこの先きっと役に立ちます。まとめ役は少し大変そうです。',
      },
    ],
  },

  // ───────── 2. 目標設定 ─────────
  {
    id: 'g-success',
    phase: 'goals',
    mode: 'common',
    title: '成功の条件を決めよう',
    body: '「何ができたら成功か」を先に決めておくと、困ったときの判断がぶれにくくなります。どんな目標の立て方にしますか？',
    expertNote: 'ミニマムサクセス／フルサクセス／エクストラサクセスの段階設定は、縮退運用時の優先順位付けにも効きます。',
    terms: ['ミニマムサクセス'],
    tags: ['目標'],
    choices: [
      {
        id: 'tiered', label: '段階的に決める（最低限・標準・挑戦）',
        pro: '想定外が起きても、どこまでできたか評価しやすい', con: '整理に少し時間がかかる',
        effects: { months: -1, reliability: 3 }, flags: ['tieredGoals', 'clearGoal'],
        text: '「最低限ここまで」「できればここまで」「挑戦としてここまで」と段階を決めました。運用中の判断の拠り所になります。',
      },
      {
        id: 'clear', label: '一つの明確な目標に絞る',
        pro: '分かりやすく、説明しやすい', con: '途中で計画が崩れると評価が難しい',
        effects: { trust: 3 }, flags: ['clearGoal'],
        text: '目標を一つに絞りました。支援者への説明がぐっと分かりやすくなりました。',
      },
      {
        id: 'ambitious', label: 'できるだけ大きな目標を掲げる',
        pro: '話題性があり、チームの士気が上がる', con: '達成のハードルが高くなる',
        effects: { mission: 8, team: 5, trust: 3, reliability: -3 }, flags: ['ambitious'],
        text: '大きな目標を掲げました。チームは盛り上がっています。後で優先順位に迷ったら、もう一度立ち返りましょう。',
      },
    ],
  },
  {
    id: 'g-duration',
    phase: 'goals',
    mode: 'common',
    title: '運用期間はどれくらいにする？',
    body: '衛星を宇宙でどのくらいの期間動かすかを決めます。長く動かすほど成果は増えますが、機器への負担や運用の手間も増えます。',
    terms: ['運用'],
    tags: ['目標', '運用'],
    choices: [
      {
        id: 'half', label: '半年',
        pro: '機体と運用の負担が小さい', con: '得られるデータは少なめ',
        effects: { reliability: 5, mission: -5, opsLoad: -5 },
        text: '運用期間は半年に決めました。短い期間に集中して成果を狙います。',
      },
      {
        id: 'year', label: '1年',
        pro: '季節の変化も観測できる', con: '標準的な負担',
        effects: {},
        text: '運用期間は1年に決めました。季節ごとの変化も捉えられそうです。',
      },
      {
        id: 'two', label: '2年',
        pro: '成果が大きくなる', con: '部品の劣化や運用体制の維持が課題',
        effects: { mission: 8, reliability: -5, opsLoad: 10 }, flags: ['longMission'],
        text: '運用期間は2年に決めました。長く動き続けられる設計と体制づくりが大切になります。',
      },
    ],
  },

  // ───────── 3. 機体構成 ─────────
  {
    id: 'd-design',
    phase: 'design',
    mode: 'common',
    kind: 'design',
    title: '機体構成を決めよう',
    body: '電源・通信・姿勢制御・熱制御・観測機器を選びます。高性能な機器ほど、費用・電力・質量・期間などの負担も大きくなります。正解は一つではありません。',
    terms: ['バス', '電力収支', '質量マージン'],
    tags: ['設計'],
    choices: [],
  },
  {
    id: 'x-review',
    phase: 'design',
    mode: 'expert',
    title: '概念設計審査（CDR前のシステムレビュー）',
    body: '外部の有識者を招いて、システム全体の整合性を確認する審査会を開きます。電力収支・質量予算・熱設計について指摘を受けました。',
    expertNote: 'マージンが小さい項目ほど、後工程での変更コストが大きくなります。',
    terms: ['設計審査'],
    tags: ['設計', 'レビュー'],
    choices: [
      {
        id: 'rework', label: '指摘を反映して設計を見直す',
        pro: 'マージンが改善する', con: '期間と費用がかかる',
        effects: { months: -1, budget: -100, powerMargin: 6, massMargin: 3, thermalMargin: 2, issues: -1, reliability: 4 },
        text: '負荷の運用スケジュールを見直し、構造を一部軽量化しました。各マージンが改善しています。',
      },
      {
        id: 'note', label: '指摘を記録し、詳細設計で対応する',
        pro: '今の日程を守れる', con: '課題が後工程に残る',
        effects: { issues: 1 },
        text: '指摘事項をアクションアイテムとして登録しました。詳細設計フェーズで忘れずに対応する必要があります。',
      },
    ],
  },

  // ───────── 4. 資金調達 ─────────
  {
    id: 'f-grant',
    phase: 'funding',
    mode: 'common',
    title: '助成金の公募が始まった',
    body: '宇宙技術の実証を支援する助成金の公募が始まりました。採択されれば大きな助けになりますが、申請書の準備には時間がかかります。',
    terms: ['助成金'],
    tags: ['資金'],
    choices: [
      {
        id: 'apply', label: '申請する',
        pro: '採択されれば大きな資金になる', con: '準備に1ヶ月かかり、不採択の可能性もある',
        effects: { months: -1 },
        check: {
          risk: 'grant',
          success: { effects: { budget: 1000, trust: 5 }, flags: ['grant'], text: '採択されました！ミッションの意義と実現の道筋が、審査員にしっかり伝わったようです。' },
          failure: { effects: { team: -3 }, flags: ['grantRejected'], text: '今回は不採択でした。審査コメントには「成功の条件をもう少し具体的に」とあります。次の機会に活かせそうです。' },
        },
      },
      {
        id: 'skip', label: '今回は見送る',
        pro: '開発に時間を使える', con: '資金の当てが一つ減る',
        effects: {},
        text: '今回は見送り、開発に集中することにしました。',
      },
    ],
  },
  {
    id: 'f-sponsor',
    phase: 'funding',
    mode: 'common',
    title: '企業からスポンサーの申し出',
    body: 'ある企業が、プロジェクトを応援したいと声をかけてくれました。ただし、ロゴの掲出や定期的な成果報告をお願いしたいそうです。',
    terms: ['スポンサー'],
    tags: ['資金', '広報'],
    choices: [
      {
        id: 'money', label: '資金援助として受ける',
        pro: 'まとまった資金が得られる', con: '報告や広報の対応で時間を使う',
        effects: { budget: 600, months: -0.5, trust: 5, opsLoad: 5 }, flags: ['sponsor'],
        text: 'スポンサー契約を結びました。定期報告の準備も、プロジェクトを見直す良い機会になりそうです。',
      },
      {
        id: 'parts', label: '部品や試験設備の提供として受ける',
        pro: '品質の高い部品が手に入る', con: '資金そのものは増えない',
        effects: { budget: 250, reliability: 6, trust: 3 }, flags: ['sponsor', 'sponsorParts'],
        text: '実績のある部品と、試験設備の利用枠を提供してもらえることになりました。',
      },
      {
        id: 'decline', label: '今回はお断りする',
        pro: '自分たちのペースで進められる', con: '資金の余裕が増えない',
        effects: { team: 3 },
        text: '丁寧にお礼を伝えてお断りしました。将来また別の形で協力できるかもしれません。',
      },
    ],
  },
  {
    id: 'f-crowd',
    phase: 'funding',
    mode: 'common',
    title: '支援者を広く募ってみる？',
    body: 'プロジェクトのことを広く紹介して、応援してくれる人から支援を募る方法があります。共感を集められれば大きな力になりますが、説明責任も生まれます。',
    tags: ['資金', '広報'],
    choices: [
      {
        id: 'run', label: '支援を募る',
        pro: '資金と応援してくれる人が増える', con: '準備に時間がかかり、目標に届かないこともある',
        effects: { months: -1, team: -3 },
        check: {
          risk: 'crowdfunding',
          success: { effects: { budget: 500, trust: 10 }, flags: ['crowdSupport'], text: '目標を達成しました！「打ち上げを楽しみにしています」というメッセージがたくさん届いています。' },
          failure: { effects: { budget: 100, trust: 2 }, text: '目標には届きませんでしたが、応援してくれる人とつながることができました。活動を発信し続けると、輪は少しずつ広がります。' },
        },
      },
      {
        id: 'skip', label: '今は開発に集中する',
        pro: '時間を開発に使える', con: '資金も応援も増えない',
        effects: {},
        text: '今は開発に集中することにしました。',
      },
    ],
  },

  // ───────── 5. チーム形成 ─────────
  {
    id: 't-people',
    phase: 'team',
    mode: 'common',
    title: '人手が足りない',
    body: '設計が進むにつれて、作業量がどんどん増えてきました。このままでは手が回りません。',
    tags: ['チーム'],
    choices: [
      {
        id: 'students', label: '学生メンバーを募集する',
        pro: '費用を抑えて人手が増え、教育にもなる', con: '慣れるまで時間がかかる',
        effects: { team: 8, months: -0.5, issues: 1 },
        text: '新しい学生メンバーが加わりました。最初は戸惑いもありますが、成長が楽しみです。',
      },
      {
        id: 'expert', label: '経験者に外部協力をお願いする',
        pro: '設計の見落としに気づける', con: '費用がかかる',
        effects: { budget: -250, reliability: 8, team: 4 }, flags: ['expertHelp'],
        text: '衛星開発の経験者がアドバイザーとして加わりました。「ここは試験で確かめておきましょう」と具体的な助言をもらえています。',
      },
      {
        id: 'push', label: '今のメンバーで頑張る',
        pro: '費用がかからない', con: 'チームが疲れやすくなる',
        effects: { team: -15, issues: 1 },
        text: '今のメンバーで乗り切ることにしました。無理が続かないよう、様子を見ていきましょう。',
      },
    ],
  },
  {
    id: 'b-ground',
    phase: 'team',
    mode: 'beginner',
    title: '地上局ってなに？',
    body: '衛星と話すには、地上に大きなアンテナを備えた「地上局」が必要です。衛星は空を通り過ぎていくので、話せるのは頭上にいる数分間だけ。どの地上局を使うか決めましょう。',
    terms: ['地上局', '可視時間'],
    tags: ['運用', '通信'],
    choices: [
      {
        id: 'own', label: '研究室や仲間の無線局を使う',
        pro: '費用がほとんどかからない', con: 'アンテナが小さく、通信の余裕が少ない',
        effects: { team: 3 },
        text: '仲間の無線局を使わせてもらうことに。自分たちで運用する経験も積めます。',
      },
      {
        id: 'commercial', label: '商用の地上局サービスを契約する',
        pro: '大きなアンテナで通信が安定する', con: '費用がかかる',
        effects: { budget: -150, linkMargin: 3 }, flags: ['groundCommercial'],
        text: '商用地上局と契約しました。大きなアンテナのおかげで通信の余裕が増えました。',
      },
    ],
  },
  {
    id: 'x-ground',
    phase: 'team',
    mode: 'expert',
    title: '地上局ネットワークの構成',
    body: '可視時間とダウンリンク容量を考慮して、地上局の構成を決めます。',
    expertNote: '低軌道では1パスあたり5〜10分程度。データ量と可視時間からダウンリンク容量を見積もりましょう。',
    terms: ['地上局', '可視時間'],
    tags: ['運用', '通信'],
    choices: [
      {
        id: 'single', label: '自前の単一局で運用',
        pro: '費用最小', con: '通信機会とリンクマージンが限られる',
        effects: { opsLoad: 10 },
        text: '自前局1局で運用します。パスごとの運用計画を綿密に組む必要があります。',
      },
      {
        id: 'network', label: '商用地上局ネットワークと契約',
        pro: '通信機会とアンテナ利得が増える', con: '費用がかかる',
        effects: { budget: -200, linkMargin: 3, opsLoad: -5 }, flags: ['groundCommercial'],
        text: '商用ネットワークと契約しました。複数局のおかげで1日あたりの通信機会が増えます。',
      },
    ],
  },
  {
    id: 't-tired',
    phase: 'team',
    mode: 'common',
    title: 'チームが疲れてきた',
    body: '連日の作業で、メンバーの疲れが目立ってきました。小さなミスも増えているようです。',
    terms: [],
    tags: ['チーム'],
    conditions: { max: { team: 45 } },
    choices: [
      {
        id: 'rest', label: 'みんなで休みを取る',
        pro: 'チームが元気を取り戻す', con: 'スケジュールが少し遅れる',
        effects: { team: 20, months: -1 },
        text: '思い切って休みを取りました。戻ってきたメンバーの表情が明るくなっています。',
      },
      {
        id: 'push', label: '打ち上げまで踏ん張る',
        pro: 'スケジュールを守れる', con: 'ミスや不具合が増えやすい',
        effects: { team: -5, issues: 2, reliability: -4 },
        text: 'このまま進めることにしました。疲れからくる見落としが、後で不具合として表れるかもしれません。',
      },
    ],
  },

  // ───────── 6. 詳細設計 ─────────
  {
    id: 'dd-parts',
    phase: 'detail',
    mode: 'common',
    title: '部品の納期が遅れている',
    body: '注文していた主要部品の納期が、2ヶ月遅れると連絡がありました。',
    tags: ['設計', 'スケジュール'],
    choices: [
      {
        id: 'wait', label: '予定の部品を待つ',
        pro: '設計を変えずに済む', con: 'スケジュールが遅れる',
        effects: { months: -2 },
        text: '部品を待つことにしました。その間に、他の作業を前倒しで進めます。',
      },
      {
        id: 'alt', label: '代わりの部品を探す',
        pro: 'スケジュールへの影響が小さい', con: '実績の少ない部品になり、確認作業が増える',
        effects: { months: -0.5, reliability: -4, issues: 1 }, flags: ['altPart'],
        text: '代わりの部品が見つかりました。宇宙での実績は少ないので、試験でしっかり確かめる必要があります。',
      },
      {
        id: 'rush', label: '追加費用を払って急いでもらう',
        pro: '設計もスケジュールも守れる', con: '費用がかかる',
        effects: { budget: -250 },
        text: '特急対応をお願いしました。費用はかかりましたが、予定どおり部品が届きそうです。',
      },
    ],
  },
  {
    id: 'x-radiation',
    phase: 'detail',
    mode: 'expert',
    title: '放射線対策と部品選定',
    body: '軌道上では放射線によるシングルイベント効果や累積線量が問題になります。搭載計算機の部品方針を決めます。',
    expertNote: 'SEL（ラッチアップ）対策の過電流保護、SEU対策のウォッチドッグ／EDACも合わせて検討しましょう。',
    terms: ['放射線'],
    tags: ['設計', 'リスク'],
    choices: [
      {
        id: 'space', label: '宇宙用（耐放射線）部品を採用',
        pro: '放射線起因の不具合が起きにくい', con: '高価で納期が長い',
        effects: { budget: -300, months: -1, reliability: 6 }, flags: ['radSpace'],
        text: '耐放射線部品を採用しました。費用はかかりましたが、軌道上での安心感が増しました。',
      },
      {
        id: 'screen', label: '民生品＋スクリーニング＋保護回路',
        pro: 'コストを抑えつつリスクを下げる', con: '試験と設計の手間が増える',
        effects: { budget: -100, months: -0.5, reliability: 3, coverage: 5 },
        text: '民生品をロット選別し、過電流保護とウォッチドッグを追加しました。',
      },
      {
        id: 'cots', label: '民生品をそのまま使う',
        pro: '安く、早い', con: '軌道上で不具合が起きやすい',
        effects: {}, flags: ['radCots'],
        text: '民生品をそのまま採用しました。運用中のリセット対応を想定しておく必要があります。',
      },
    ],
  },
  {
    id: 'dd-mass',
    phase: 'detail',
    mode: 'common',
    title: '機体が重くなってきた',
    body: '詳細な設計を詰めていくと、配線や固定具の分だけ機体が予定より重くなってきました。ロケットに載せられる質量には上限があります。',
    expertNote: '詳細設計段階での質量増加は一般的です。概念設計時のマージン設定が効いてきます。',
    terms: ['質量マージン'],
    tags: ['設計'],
    conditions: { max: { massMargin: 12 } },
    choices: [
      {
        id: 'lighten', label: '軽量化設計に取り組む',
        pro: '機能を保ったまま軽くできる', con: '費用と時間がかかる',
        effects: { budget: -150, months: -1, massMargin: 4 },
        text: '構造の肉抜きや配線の見直しで軽量化しました。設計の工夫で乗り切れました。',
      },
      {
        id: 'cut', label: '一部の機能を削る',
        pro: '確実に軽くなる', con: 'ミッションの価値が下がる',
        effects: { massMargin: 6, mission: -8 },
        text: '優先度の低い機能を外しました。成功の条件に照らして、何を残すかを判断できました。',
      },
      {
        id: 'keep', label: 'このまま進める',
        pro: '手間がかからない', con: 'さらに重くなると対応が難しくなる',
        effects: { massMargin: -3, issues: 1 },
        text: 'このまま進めます。これ以上の質量増加が起きないよう、注意深く管理する必要があります。',
      },
    ],
  },
  {
    id: 'x-power',
    phase: 'detail',
    mode: 'expert',
    title: '電力収支の再評価',
    body: '詳細な機器仕様が揃い、各モードでの電力収支を再計算しました。日陰時間（食）を含めると、観測モードでのバッテリー放電深度が想定より深くなっています。',
    expertNote: '放電深度（DoD）が深いほどバッテリー劣化が早まり、長期運用に影響します。',
    terms: ['電力収支', '食'],
    tags: ['設計', '電力'],
    conditions: { max: { powerMargin: 20 } },
    choices: [
      {
        id: 'duty', label: '観測のデューティ比を下げる運用設計',
        pro: '費用をかけずに収支を改善', con: '取得データ量が減る',
        effects: { powerMargin: 8, mission: -5, opsLoad: 5 },
        text: '観測を日照時に集中させる運用計画にしました。',
      },
      {
        id: 'battery', label: 'バッテリーセルを追加',
        pro: '性能を落とさずに済む', con: '質量・費用が増える',
        effects: { powerMargin: 10, massMargin: -3, budget: -120 },
        text: 'セルを追加しました。質量マージンを少し消費しています。',
      },
      {
        id: 'accept', label: '現状で許容する',
        pro: '変更なし', con: '軌道上で電力不足になるリスク',
        effects: { issues: 1 },
        text: 'リスクとして登録し、現状で進めます。',
      },
    ],
  },
  {
    id: 'dd-redundancy',
    phase: 'detail',
    mode: 'common',
    title: 'もしものための予備をつける？',
    body: '大事な機器が故障したときのために、予備の機器（冗長系）を載せる方法があります。もしもの時に切り替えられますが、そのぶん重く、高くなります。',
    terms: ['冗長系'],
    tags: ['設計', 'リスク'],
    choices: [
      {
        id: 'add', label: '搭載計算機を二重にする',
        pro: '故障しても切り替えて運用を続けられる', con: '費用・質量が増える',
        effects: { budget: -200, massMargin: -2, reliability: 5 }, flags: ['redundancy'],
        requires: { min: { massMargin: 3 } },
        text: '計算機を二重化しました。片方が止まっても、もう片方に切り替えられます。',
      },
      {
        id: 'none', label: '予備はつけず、試験で確かめる',
        pro: '軽く、安く済む', con: '故障すると機能を失う',
        effects: {},
        text: '予備はつけないことにしました。そのぶん、試験でしっかり確かめていきましょう。',
      },
    ],
  },

  // ───────── 7. 製造・統合 ─────────
  {
    id: 'i-interface',
    phase: 'integration',
    mode: 'common',
    title: '機器同士がうまく話さない',
    body: '部品を組み立てて電源を入れてみると、通信機と搭載計算機の間でデータがうまくやり取りできません。',
    expertNote: 'ICD（インターフェース管理文書）の記載と実装の不一致が疑われます。',
    terms: ['インターフェース'],
    tags: ['統合', 'リスク'],
    choices: [
      {
        id: 'investigate', label: 'じっくり原因を調べる',
        pro: '根本的に解決できる', con: '時間がかかる',
        effects: { months: -1, issues: -1, reliability: 4, coverage: 5 },
        text: '調べてみると、データの送り方の取り決めに食い違いがありました。資料を直し、他の機器にも同じ問題がないか確認しました。',
      },
      {
        id: 'patch', label: 'ソフトウェアで応急的に直す',
        pro: 'すぐに作業を再開できる', con: '根本原因が残るかもしれない',
        effects: { months: -0.2, issues: 1 },
        text: 'ソフトウェアで対処して動くようになりました。根本原因は分かっていないので、記録に残しておきます。',
      },
    ],
  },
  {
    id: 'i-pr',
    phase: 'integration',
    mode: 'common',
    title: '科学館のイベントに出てみない？',
    body: '近くの科学館から、組み立て中の衛星について話してほしいと依頼がありました。子どもたちも来るそうです。',
    tags: ['広報'],
    choices: [
      {
        id: 'join', label: '参加する',
        pro: '応援してくれる人が増える', con: '開発の時間を使う',
        effects: { trust: 10, months: -0.5, team: 5 }, flags: ['prEvent'],
        text: '「宇宙ってこんなふうに作るんだ！」と目を輝かせる子どもたちに、チームも元気をもらいました。',
      },
      {
        id: 'decline', label: '今回は見送る',
        pro: '開発に集中できる', con: '応援を広げる機会を逃す',
        effects: {},
        text: '今回は見送りました。打ち上げ後に改めてお話しできるといいですね。',
      },
    ],
  },
  {
    id: 'i-mass-check',
    phase: 'integration',
    mode: 'common',
    title: '組み上がった機体の重さを量る',
    body: '組み立てが終わり、実際の機体の重さを量りました。',
    tags: ['統合'],
    conditions: { max: { massMargin: 0 } },
    choices: [
      {
        id: 'remove', label: '観測機器の一部を外して重さを合わせる',
        pro: 'ロケットに載せられる', con: 'ミッションの価値が下がる',
        effects: { massMargin: 5, mission: -12, months: -1 },
        text: 'ロケットの質量上限を超えていたため、観測機器の一部を外しました。詳細設計の段階で余裕を確保しておくと、こうした判断を避けやすくなります。',
      },
    ],
  },

  // ───────── 8. 試験・審査 ─────────
  {
    id: 'te-vibration',
    phase: 'testing',
    mode: 'common',
    title: '振動試験',
    body: 'ロケットの打ち上げはとても激しく揺れます。その揺れに耐えられるか、試験装置で確かめます。',
    terms: ['振動試験'],
    tags: ['試験'],
    choices: [
      {
        id: 'full', label: '本番と同じ条件でしっかり試験する',
        pro: '弱いところを見つけられる', con: '費用と時間がかかる',
        effects: { budget: -150, months: -1, coverage: 25 }, flags: ['vibrationFull'],
        check: {
          risk: 'vibration',
          success: { effects: { reliability: 8 }, text: '試験は無事に合格。機体の丈夫さを確かめられました。' },
          failure: { effects: { reliability: 10, months: -0.5, budget: -50 }, text: 'ネジのゆるみが見つかりました。打ち上げ前に見つかって本当によかった。修理して再試験し、合格しました。' },
        },
      },
      {
        id: 'lite', label: '条件をゆるめて短時間で試験する',
        pro: '費用と時間を抑えられる', con: '見逃す弱点があるかもしれない',
        effects: { budget: -60, months: -0.5, coverage: 10, reliability: 3 }, flags: ['vibrationLite'],
        text: '簡易的な試験を行い、大きな問題はありませんでした。本番の揺れでどうなるかは、少しだけ不安が残ります。',
      },
      {
        id: 'skip', label: '試験を省略する',
        pro: '費用と時間がかからない', con: '打ち上げで壊れるリスクが残る',
        effects: { reliability: -8 },
        text: '試験を省略しました。設計の計算を信じて進みます。',
      },
    ],
  },
  {
    id: 'te-thermal',
    phase: 'testing',
    mode: 'common',
    title: '熱真空試験',
    body: '宇宙は空気がなく、日なたはとても暑く、日陰はとても寒い場所です。真空の容器に機体を入れて、温度の変化に耐えられるか確かめます。',
    terms: ['熱真空試験'],
    tags: ['試験', '熱'],
    choices: [
      {
        id: 'full', label: '温度サイクルを何度も繰り返して試験する',
        pro: '温度の想定外を見つけやすい', con: '費用と時間がかかる',
        effects: { budget: -150, months: -1, coverage: 25, reliability: 6, thermalMargin: 2 }, flags: ['thermalVacFull'],
        text: '試験の中で、ある機器が想定より熱くなることが分かりました。取り付け方を工夫して、熱が逃げやすくしました。',
      },
      {
        id: 'lite', label: '一度だけ確認する',
        pro: '費用と時間を抑えられる', con: '繰り返しの温度変化への強さは分からない',
        effects: { budget: -60, months: -0.5, coverage: 10, reliability: 2 },
        text: '一度の確認では大きな問題はありませんでした。',
      },
      {
        id: 'skip', label: '試験を省略する',
        pro: '費用と時間がかからない', con: '軌道上で温度の想定外が起きやすい',
        effects: { reliability: -6, thermalMargin: -2 },
        text: '試験を省略しました。熱の計算に頼って進みます。',
      },
    ],
  },
  {
    id: 'x-emc',
    phase: 'testing',
    mode: 'expert',
    title: 'EMC試験',
    body: '機器同士の電磁干渉を確認します。統合試験で通信機の受信感度がわずかに低下する現象が見られています。',
    expertNote: 'DC-DCコンバータのスイッチングノイズが受信帯域に乗っている可能性があります。',
    terms: ['EMC'],
    tags: ['試験', '通信'],
    choices: [
      {
        id: 'fix', label: 'フィルタ追加とハーネス再配線',
        pro: '通信余裕を回復', con: '期間と費用がかかる',
        effects: { budget: -80, months: -0.5, linkMargin: 2, coverage: 10, issues: -1 },
        text: 'フェライトとLCフィルタを追加し、ハーネスを分離しました。受信感度が回復しました。',
      },
      {
        id: 'accept', label: '劣化量をリンク計算に織り込んで許容',
        pro: '日程を守れる', con: '通信余裕が減る',
        effects: { linkMargin: -2 },
        text: '感度劣化を考慮してリンクバジェットを更新しました。',
      },
    ],
  },
  {
    id: 'te-rehearsal',
    phase: 'testing',
    mode: 'common',
    title: '運用リハーサル',
    body: '打ち上げ後に何をするか、本番さながらに練習しておく方法があります。うまくいかなかったときの手順も、あらかじめ考えておけます。',
    terms: ['運用リハーサル'],
    tags: ['試験', '運用'],
    choices: [
      {
        id: 'do', label: 'リハーサルを行い、復旧手順も用意する',
        pro: 'いざというときに落ち着いて対応できる', con: '時間がかかる',
        effects: { months: -1, team: 5, coverage: 15, opsLoad: -10 }, flags: ['opsRehearsal'],
        text: '「通信がつながらなかったら」「電力が足りなかったら」と、いくつもの場面を練習しました。チームの動きがそろってきました。',
      },
      {
        id: 'skip', label: '省略して機体の仕上げに集中する',
        pro: '時間を機体に使える', con: '想定外の場面で判断に迷いやすい',
        effects: { reliability: 2 },
        text: 'リハーサルは省略しました。打ち上げ後は、その場で考えながら対応することになります。',
      },
    ],
  },
  {
    id: 'te-final',
    phase: 'testing',
    mode: 'common',
    title: '打ち上げ前の最終チェック',
    body: 'いよいよ機体をロケットに引き渡す日が近づいてきました。最後の確認にどれくらい時間をかけますか？',
    tags: ['試験'],
    choices: [
      {
        id: 'careful', label: '時間をかけて確認する',
        pro: '残っている不具合を減らせる', con: 'スケジュールに余裕が必要',
        effects: { months: -1, issues: -2, reliability: 5, coverage: 5 }, flags: ['finalCheck'],
        text: 'チェックリストを一つずつ確認し、気になっていた不具合を直しました。',
      },
      {
        id: 'schedule', label: '日程を優先する',
        pro: 'スケジュールを守れる', con: '不具合が残ったままになるかもしれない',
        effects: {},
        text: '日程を優先し、予定どおり引き渡しの準備に入りました。',
      },
    ],
  },
  {
    id: 'te-slip',
    phase: 'testing',
    mode: 'common',
    title: '打ち上げに間に合わない',
    body: '作業を積み重ねた結果、予定していた打ち上げの日までに準備が終わらないことが分かりました。',
    terms: ['打ち上げウィンドウ'],
    tags: ['スケジュール'],
    conditions: { max: { months: -0.1 } },
    choices: [
      {
        id: 'rebook', label: '次の打ち上げ機会を予約し直す',
        pro: '準備を終えてから打ち上げられる', con: '追加の費用がかかり、信頼も少し下がる',
        effects: { budget: -400, months: 6, trust: -5 },
        text: '次の打ち上げ機会を確保しました。待つ間に、残っていた作業を落ち着いて仕上げられます。',
      },
      {
        id: 'ship', label: '残りの作業を省いて引き渡す',
        pro: '予定どおり打ち上げられる', con: '確認しきれない部分が残る',
        effects: { months: 3, reliability: -10, issues: 2 },
        text: '確認が終わっていない部分を残したまま、機体を引き渡しました。軌道上では慎重な運用が必要です。',
      },
    ],
  },

  // ───────── 9. 打ち上げ・初期運用 ─────────
  {
    id: 'l-launch',
    phase: 'launch',
    mode: 'common',
    title: '打ち上げ！',
    body: 'カウントダウンが始まりました。ロケットが轟音とともに空へ昇っていきます。しばらくして、衛星がロケットから切り離されたという知らせが届きました。\n\n次は、衛星と初めての通信を試みます。',
    terms: ['分離'],
    tags: ['打ち上げ'],
    choices: [
      {
        id: 'contact', label: '最初の通信を試みる',
        effects: {},
        check: {
          risk: 'contact',
          success: { flags: ['contactOk'], effects: { trust: 5, team: 5 }, text: '衛星からの電波を受信しました！機体の温度も電圧も、予定どおりの値です。管制室に拍手が広がりました。' },
          failure: { flags: ['noContact'], text: '予定の時刻になっても、衛星からの電波が受信できません……。' },
        },
      },
    ],
  },
  {
    id: 'l-nocontact',
    phase: 'launch',
    mode: 'common',
    title: '衛星から返事がない！',
    body: '最初の通信がうまくいきませんでした。原因は地上局の設定かもしれないし、衛星の電源や向きかもしれません。限られた通信の機会で、どう動きますか？',
    expertNote: '切り分け対象：地上局設定（周波数・ドップラー補正）、TLE精度、アンテナ展開、電源、送信機設定。',
    terms: ['テレメトリ', '可視時間'],
    tags: ['異常', '運用'],
    conditions: { flags: ['noContact'] },
    choices: [
      {
        id: 'isolate', label: '原因を一つずつ切り分ける',
        pro: '根本原因に近づける', con: 'チームの経験と体力が必要',
        effects: { team: -5 },
        check: {
          risk: 'recoverIsolate',
          success: { flags: ['contactOk'], removeFlags: ['noContact'], effects: { progress: -5 }, text: '軌道の予測値が少しずれていたことが分かりました。アンテナの向きを修正すると、衛星の声が聞こえてきました！' },
          failure: { flags: ['contactLost'], text: '地上局側には問題が見つかりませんでした。衛星側に何かが起きているのかもしれません。' },
        },
      },
      {
        id: 'procedure', label: '事前に用意した手順に沿って復旧を試みる',
        pro: '準備していれば落ち着いて対応できる', con: '手順がなければ手探りになる',
        effects: {},
        check: {
          risk: 'recoverProcedure',
          success: { flags: ['contactOk'], removeFlags: ['noContact'], text: '手順書の3番目「受信周波数を補正する」を試したところ、通信がつながりました。リハーサルが活きました！' },
          failure: { flags: ['contactLost'], text: '手順を一通り試しましたが、つながりませんでした。' },
        },
      },
    ],
  },
  {
    id: 'l-lost',
    phase: 'launch',
    mode: 'common',
    title: 'もう一度だけ',
    body: '衛星からの電波は、まだ届きません。バッテリーが空になって自動で再起動すれば、声が聞こえる可能性もあります。',
    tags: ['異常', '運用'],
    conditions: { flags: ['contactLost'], notFlags: ['contactOk'] },
    choices: [
      {
        id: 'wait', label: '数週間、毎日呼びかけ続ける',
        pro: 'わずかでも可能性に賭けられる', con: 'チームの負担が続く',
        effects: { team: -5 },
        check: {
          risk: 'recoverLast',
          success: { flags: ['contactOk'], effects: { progress: -10, trust: 5 }, text: '3週間後のある夜、ついに衛星の電波を受信しました！自動再起動が働いたようです。諦めなかったことが実を結びました。' },
          failure: { text: '呼びかけを続けましたが、衛星からの応答はありませんでした。ここで運用を終えることにします。', end: 'lesson' },
        },
      },
      {
        id: 'stop', label: 'ここで運用を終え、原因を振り返る',
        effects: {},
        text: '運用を終えることにしました。取得できた情報から、何が起きた可能性があるかを整理します。',
        end: 'lesson',
      },
    ],
  },
  {
    id: 'l-deploy',
    phase: 'launch',
    mode: 'common',
    title: '太陽電池パネルを広げる',
    body: '通信がつながったので、次は太陽電池パネルを広げます。ここがうまくいけば、たっぷり発電できるようになります。',
    terms: ['展開機構'],
    tags: ['運用', '電力'],
    conditions: { flags: ['contactOk'], design: { power: ['deploy', 'deployBattery'] } },
    choices: [
      {
        id: 'deploy', label: '展開コマンドを送る',
        effects: {},
        check: {
          risk: 'deploy',
          success: { effects: { reliability: 3 }, text: 'パネルが無事に広がり、発電量がぐんと増えました！' },
          failure: { flags: ['panelPartial'], effects: { powerMargin: -20 }, text: '4枚のうち1枚のパネルが開ききりませんでした。発電量は予定より少なくなります。' },
        },
      },
    ],
  },
  {
    id: 'l-checkout',
    phase: 'launch',
    mode: 'common',
    title: '機器を順番に確かめる',
    body: '衛星が安定してきました。観測を始める前に、機器を一つずつ確かめる「初期チェック」を行います。',
    terms: ['ヘルスチェック'],
    tags: ['運用'],
    conditions: { flags: ['contactOk'] },
    choices: [
      {
        id: 'careful', label: 'じっくり時間をかけて確かめる',
        pro: '不具合の兆しを早めに見つけられる', con: '観測の開始が遅れる',
        effects: { issues: -1, reliability: 3, progress: 5 },
        text: '各機器の状態を丁寧に確認しました。観測の準備が整いました。',
      },
      {
        id: 'quick', label: '早く観測を始めたいので手短に',
        pro: '早くデータが取れる', con: '不具合の兆しを見逃すかもしれない',
        effects: { progress: 10 },
        text: '必要最低限の確認で、観測を始めました。',
      },
    ],
  },

  // ───────── 10. 定常運用・終了 ─────────
  {
    id: 'o-first',
    phase: 'operations',
    mode: 'common',
    title: '初めての観測データ',
    body: '最初の観測データが地上に届きました！画面に映し出された地球の姿に、チームのみんなが見入っています。',
    tags: ['運用', '成果'],
    conditions: { flags: ['contactOk'] },
    choices: [
      {
        id: 'share', label: 'すぐに支援者にも共有する',
        pro: '応援してくれた人と喜びを分かち合える', con: '解析前のデータなので説明に注意が必要',
        effects: { progress: 15, trust: 10 },
        text: '「本当に宇宙から撮ったんですね！」とたくさんの反響がありました。',
      },
      {
        id: 'analyze', label: 'まずはしっかり解析する',
        pro: 'データの質を確かめられる', con: '公開は少し先になる',
        effects: { progress: 20, mission: 3 },
        text: 'データを丁寧に解析し、観測機器の特性を把握しました。今後の観測計画に活かせます。',
      },
    ],
  },
  {
    id: 'o-power',
    phase: 'operations',
    mode: 'common',
    title: '発電量が足りない',
    body: '観測を続けていると、バッテリーの電圧が少しずつ下がってきました。消費する電力に対して、発電量が追いついていないようです。',
    expertNote: '姿勢（太陽指向）、日照条件（β角）、パネル劣化、負荷スケジュールを確認しましょう。',
    terms: ['電力収支', '食'],
    tags: ['異常', '電力'],
    conditions: { flags: ['contactOk'], max: { powerMargin: 9 } },
    choices: [
      {
        id: 'reduce', label: '観測の回数を減らす',
        pro: '電力が安定する', con: '得られるデータが減る',
        effects: { progress: 5, mission: -5 },
        text: '観測の回数を減らして、電力を回復させました。量より確実さを選んだ判断です。',
      },
      {
        id: 'attitude', label: '衛星の向きを工夫して発電を増やす',
        pro: '観測を続けられるかもしれない', con: '姿勢制御の性能が必要',
        requires: { design: { adcs: ['wheel', 'wheelTracker'] } },
        effects: { progress: 12, opsLoad: 10 },
        text: '観測していない時間はパネルを太陽に向けるようにしました。運用は少し複雑になりましたが、観測を続けられます。',
      },
      {
        id: 'continue', label: '様子を見ながら観測を続ける',
        pro: 'データを取り続けられる', con: '電力が尽きると衛星が止まる',
        effects: { progress: 8, reliability: -10, issues: 1 },
        text: '観測を続けましたが、ある日衛星が自動で省電力モードに入りました。復帰はできましたが、機器に負担がかかっています。',
      },
    ],
  },
  {
    id: 'o-thermal',
    phase: 'operations',
    mode: 'common',
    title: '温度が想定より高い',
    body: '観測機器の温度が、予定していた範囲の上限に近づいています。このままでは機器の寿命が縮むかもしれません。',
    terms: ['熱設計'],
    tags: ['異常', '熱'],
    conditions: { flags: ['contactOk'], max: { thermalMargin: 7 } },
    choices: [
      {
        id: 'pause', label: '観測機器を一時的に止めて冷やす',
        pro: '機器を守れる', con: '観測が一時止まる',
        effects: { progress: 3, reliability: 3 },
        text: '機器を止めて冷ましました。温度の高い時間帯を避けて観測する計画に変えました。',
      },
      {
        id: 'continue', label: '上限に近いまま観測を続ける',
        pro: 'データを取り続けられる', con: '機器の劣化が進む',
        effects: { progress: 8, reliability: -8 },
        text: '観測を続けました。データは取れていますが、機器の劣化が少しずつ進んでいます。',
      },
    ],
  },
  {
    id: 'o-hang',
    phase: 'operations',
    mode: 'common',
    title: '観測機器が応答しない',
    body: 'ある日、観測機器からの応答が突然なくなりました。放射線の影響か、ソフトウェアの不具合かもしれません。',
    expertNote: 'SEUによるハングアップ、SELによる過電流、ソフトウェアのデッドロックなどが考えられます。',
    terms: ['セーフモード', '冗長系', '放射線'],
    tags: ['異常', '運用'],
    conditions: { flags: ['contactOk'] },
    trigger: 'payloadHang',
    choices: [
      {
        id: 'reset', label: '機器をリセットする',
        pro: '一時的な不具合ならすぐ直る', con: '壊れていたら直らない',
        effects: {},
        check: {
          risk: 'reset',
          success: { effects: { progress: 5 }, text: 'リセットで機器が復帰しました。一時的な不具合だったようです。' },
          failure: { effects: { progress: -5, mission: -10 }, text: 'リセットしても復帰しませんでした。機器が損傷しているのかもしれません。残された機能で観測を続けます。' },
        },
      },
      {
        id: 'ota', label: 'ソフトウェアを書き換えて直す',
        pro: '原因がソフトなら根本的に直せる', con: '書き換え作業そのものにも慎重さが必要',
        requires: { flags: ['otaCapable'] },
        effects: { progress: 8, issues: -1, opsLoad: 5 },
        text: '記録を調べると、特定の条件で処理が止まるソフトの不具合でした。修正版を地上から送り込み、観測機器は元気に復帰しました。書き換えできる設計にしておいてよかった。',
      },
      {
        id: 'switch', label: '予備の計算機に切り替える',
        pro: '確実に運用を続けられる', con: '予備は一度きり',
        requires: { flags: ['redundancy'] },
        effects: { progress: 5, reliability: -3 },
        text: '予備の計算機に切り替えて、観測を再開しました。予備をつけておいた判断が活きました。',
      },
      {
        id: 'safe', label: 'セーフモードで様子を見る',
        pro: '衛星を安全な状態に保てる', con: '観測が止まる期間が長くなる',
        effects: { progress: -3, reliability: 3, issues: -1 },
        text: '衛星を安全な状態にして、原因を調べました。数日後、慎重に観測を再開できました。',
      },
    ],
  },
  {
    id: 'x-safemode',
    phase: 'operations',
    mode: 'expert',
    title: '運用負荷の増大',
    body: '定常運用に入り、パス毎のコマンド計画・テレメトリ確認・データ処理で運用チームの負荷が高まっています。',
    expertNote: '運用の自動化（タイムラインコマンド、自動異常検知）は運用負荷と人的ミスを減らします。',
    terms: ['テレメトリ'],
    tags: ['運用'],
    conditions: { flags: ['contactOk'], min: { opsLoad: 40 } },
    choices: [
      {
        id: 'automate', label: 'タイムライン運用と自動監視を導入',
        pro: '負荷とミスを低減', con: 'ソフト改修に工数がかかる',
        effects: { opsLoad: -20, team: 5, progress: 5 },
        text: '地上側に自動監視スクリプトを導入し、定型コマンドをタイムライン化しました。',
      },
      {
        id: 'shift', label: '当番制で人手を確保',
        pro: '即座に対応', con: 'チームの疲労',
        effects: { team: -10, progress: 8 },
        text: '当番制で全パスをカバーしました。データ取得量は増えましたが、疲労が蓄積しています。',
      },
    ],
  },
  {
    id: 'o-routine',
    phase: 'operations',
    mode: 'common',
    title: '観測の日々',
    body: '衛星は毎日地球を何周もしながら、観測を続けています。データが少しずつ積み重なってきました。観測の進め方をどうしますか？',
    tags: ['運用', '成果'],
    conditions: { flags: ['contactOk'] },
    choices: [
      {
        id: 'plan', label: '成功の条件に沿って計画的に観測する',
        pro: '大事な目標から確実に達成できる', con: '思いがけない発見は少なめ',
        effects: { progress: 30 },
        text: '計画に沿って観測を積み重ね、目標に着実に近づいています。',
      },
      {
        id: 'explore', label: '面白そうな現象を見つけたら狙ってみる',
        pro: '思いがけない発見があるかもしれない', con: '計画どおりの成果は少し減る',
        effects: { progress: 22, mission: 6, trust: 5 },
        text: '台風の目や珍しい夜光雲を捉えることができました。予定外の成果に、研究者からも問い合わせが届いています。',
      },
    ],
  },
  {
    id: 'o-share',
    phase: 'operations',
    mode: 'common',
    title: 'データをどう公開する？',
    body: '観測データが十分に集まりました。このデータを、どのように世の中に届けますか？',
    tags: ['広報', '成果'],
    conditions: { flags: ['contactOk'] },
    choices: [
      {
        id: 'open', label: 'だれでも使えるように公開する',
        pro: '多くの人に使ってもらえる', con: 'データの整理と説明に手間がかかる',
        effects: { progress: 10, trust: 10, team: -3 },
        text: 'データを公開すると、学校の授業や研究で使いたいという声が届きました。',
      },
      {
        id: 'paper', label: 'まずは研究論文にまとめる',
        pro: '成果の価値をしっかり示せる', con: '一般の人に届くまで時間がかかる',
        effects: { progress: 12, mission: 3 },
        text: '研究成果として発表しました。専門家から高い評価を受けています。',
      },
    ],
  },
  {
    id: 'o-end',
    phase: 'operations',
    mode: 'common',
    title: '運用期間の終わり',
    body: '予定していた運用期間が終わりに近づいてきました。衛星はまだ動いています。これからどうしますか？',
    terms: ['デオービット'],
    tags: ['運用', '終了'],
    conditions: { flags: ['contactOk'] },
    choices: [
      {
        id: 'extend', label: '延長して運用を続ける',
        pro: 'さらに成果を積み重ねられる', con: '機体が持たないこともある',
        effects: { team: -3 },
        check: {
          risk: 'extended',
          success: { flags: ['extended'], effects: { progress: 15, trust: 5 }, text: '延長運用は順調です。予定を超えて観測を続け、貴重な長期データが得られました。' },
          failure: { effects: { progress: 3 }, text: '延長運用を始めてまもなく、バッテリーの劣化で衛星が停止しました。それでも、予定の期間はしっかり働いてくれました。' },
        },
      },
      {
        id: 'finish', label: '計画どおりに運用を終える',
        pro: '宇宙ごみを残さない、責任ある終わり方', con: 'これ以上の成果は得られない',
        requires: { anyFlags: ['orbitSso', 'orbitIss', 'deorbitDevice'] },
        effects: { trust: 8, progress: 5 }, flags: ['deorbit'],
        text: '衛星の機能を安全に停止し、運用を終えました。やがて大気圏に入り、燃え尽きます。',
      },
      {
        id: 'finishHigh', label: '計画どおりに運用を終え、機能を安全に停止する',
        pro: '電池や電波が他の衛星の迷惑にならないようにできる', con: '高い軌道のため、長く宇宙に残る',
        requires: { flags: ['orbitHigh'], notFlags: ['deorbitDevice'] },
        effects: { trust: 2, progress: 5 },
        text: '電池を放電させ、電波も止めて、衛星を安全な状態にしました。ただ、この高さでは大気圏に落ちるまで何十年もかかります。次は軌道離脱の手段も考えておきたいところです。',
      },
    ],
  },
];

export const EVENTS: GameEvent[] = mergeEvents(BASE_EVENTS, [...EXTRA_EVENTS, ...EXTRA_EVENTS_2]);
