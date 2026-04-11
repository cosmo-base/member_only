"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Users, BookOpen, Database, Globe, HelpCircle, Twitter, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

import logoImg from "../../../public/images/cosmo-base-logo.png"
import cbIcon from "../../../public/CB_icon.png"
import xIcon from "../../../public/X.png"
import instaIcon from "../../../public/Instagram.png"
import noteIcon from "../../../public/note.png"

// --- データ定義 ---

const typesData: Record<string, any> = {
  RVXI: { typeTitle: "宇宙ロマン志向", roleName: "夢想家タイプ", catchphrase: "宇宙を“楽しむ才能”を持っている人", analysis: "宇宙の美しい画像や神秘的な話に触れるだけで心が満たされるタイプ。「実用性」や「役に立つか」という話になると、少し距離を感じてしまうかも？", strength: "理由なく純粋に宇宙を楽しめる“感性”は一番の価値です。", mottainai: "「自分は詳しくないから」と、感じたワクワクを自分の中だけで終わらせてしまうこと。", firstStep: "好きな宇宙の画像を1枚保存してみる。", cta: "「#写真・画像」チャンネルで誰かの投稿にスタンプを押すか、まずは数十秒で終わる「毎日宇宙クイズ」を解いて、宇宙の面白さに少しだけ触れてみましょう。", emoji: "🌌", color: "#D1B3E8" },
  RVXS: { typeTitle: "未来観察志向", roleName: "観測者タイプ", catchphrase: "宇宙の“未来を見届ける”人", analysis: "「人類が月へ」「宇宙旅行」など、未来のワクワクする話が好き。でも、ロケットの仕組みなどの細かい話になると、少し難しく感じてしまうかも。", strength: "大きな流れや、未来の可能性を楽しむ“全体を見る力”を持っています。", mottainai: "「難しそう」という理由だけで、情報からそっと離れてしまうこと。", firstStep: "週に1回だけ、宇宙のトピックを眺めてみる。", cta: "「週刊宇宙ニュース」を流し読みして、気になった見出しを1つ見つけるか、自分の「宇宙タイプ診断」の結果をSNSでシェアして未来の仲間を探してみましょう。", emoji: "🌕", color: "#BCA2DC" },
  RVMI: { typeTitle: "天体愛好志向", roleName: "探訪者タイプ", catchphrase: "宇宙の“美しさを発見する”人", analysis: "「綺麗」「かっこいい」といった直感で動く感性型。星空や造形の細かな魅力に気づける人です。ただ、その感動を誰かと共有する機会が少ないのでは？", strength: "人が気づかない宇宙の魅力を見つける“独自の視点”。", mottainai: "素敵なものを見つけたのに、誰にも教えないこと。", firstStep: "「これ好きかも」という直感を大事にする。", cta: "「#天文・観測」チャンネルや「Cosmo Base Library（CBL）」で、お気に入りの画像を1つ探してブックマークしてみましょう。", emoji: "🪐", color: "#E4C3F0" },
  RVMS: { typeTitle: "探査共感志向", roleName: "見守り手タイプ", catchphrase: "宇宙への“挑戦を応援する”人", analysis: "自分が前に出るより、挑戦している人やプロジェクトを応援するのが好きなタイプ。でも心の奥底には「自分も少し関わってみたい」気持ちがあるのでは？", strength: "誰かの熱意に寄り添える“共感力”。", mottainai: "完全なROM専（見るだけ）に徹して、自分の存在を消してしまうこと。", firstStep: "「すごい！」「がんばれ」と心の中でエールを送る。", cta: "「#宇宙開発」で応援スタンプを押したり、周りの友人に「宇宙タイプ診断」を勧めて、それぞれの宇宙の楽しみ方を共有してみましょう。", emoji: "🌠", color: "#C5B9D6" },
  RAXI: { typeTitle: "宇宙探求志向", roleName: "探求者タイプ", catchphrase: "宇宙の“謎を深掘りする”人", analysis: "「宇宙人はいる？」「ブラックホールの中は？」など、答えのない問いを考えるのが好き。でも、頭の中で考えて満足してしまい、人に話すことが少ないのでは？", strength: "疑問をトコトン深掘りできる“知的好奇心”。", mottainai: "アウトプットせずに、自分の頭の中だけで完結させてしまうこと。", firstStep: "ふと思った素朴な疑問を言葉にしてみる。", cta: "「Cosmo Baseで宇宙教えて（#質問部屋）」で、「ずっと気になってたんだけど…」と気軽な疑問を1つ投げてみましょう。", emoji: "🛸", color: "#F2F2C4" },
  RAXS: { typeTitle: "宇宙伝道志向", roleName: "語り部タイプ", catchphrase: "宇宙の“面白さを翻訳する”人", analysis: "「これ面白い！」と思ったことを誰かに伝えたくなる人。ただ、完璧に説明しようとして、うまく言葉にできず止まってしまうことはありませんか？", strength: "自分のワクワクを他人に伝播させる“伝える力”。", mottainai: "綺麗にまとめようと準備しすぎて、結局発信をやめてしまうこと。", firstStep: "1行だけでいいから、面白かったことを人に言う。", cta: "「#エンタメ」チャンネルで面白かったニュースをつぶやいたり、自分の「宇宙タイプ診断」結果と一緒にCosmo Baseの魅力を発信してみましょう。", emoji: "🎙️", color: "#F5E69C" },
  RAMI: { typeTitle: "趣味没頭志向", roleName: "職人タイプ", catchphrase: "宇宙への愛を“形にする”人", analysis: "模型を作ったり、写真を撮ったり、調べたことをまとめたりするのが好きなタイプ。でも、完成するまで人に見せるのをためらっていませんか？", strength: "好きなことに徹底的に向き合える“没頭力”。", mottainai: "100%完成するまで、誰にも見せずに隠しておくこと。", firstStep: "「いま、こんなの作ってる（調べてる）」と見せてみる。", cta: "「#写真・画像」に制作途中のものをシェアするか、「毎日宇宙クイズ」に挑戦して、自分のマニアックな知識をこっそりアップデートしてみましょう。", emoji: "📸", color: "#E8E8B6" },
  RAMS: { typeTitle: "宇宙カルチャー志向", roleName: "仕掛け人タイプ", catchphrase: "宇宙で“熱狂を生み出す”人", analysis: "「こんなことやったら面白そう！」とアイデアを出すのが得意。でも、自分一人でやり切るのは少し苦手で、誰かと一緒に盛り上がりたいタイプですよね？", strength: "人を巻き込んで企画を動かす“巻き込み力”。", mottainai: "アイデアを思いついたのに、「どうせ無理か」と寝かせてしまうこと。", firstStep: "「これやりたい！」と声に出してみる。", cta: "「#雑談」で「こんなイベント面白くない？」と提案するか、「宇宙タイプ診断」をシェアして、一緒に盛り上がれる仲間を探してみましょう。", emoji: "🎉", color: "#FCE877" },
  PVXI: { typeTitle: "宇宙教養志向", roleName: "学び手タイプ", catchphrase: "宇宙を“教養として吸収する”人", analysis: "情報収集が得意で、ニュースや記事をよく読んでいるタイプ。インプット量は多いのに、それを外に出す機会がなくてインプット過多になっていませんか？", strength: "知識をスポンジのように吸収する“学習意欲”。", mottainai: "学んだことを「自分の中だけの知識」で終わらせてしまうこと。", firstStep: "学んだことを一言だけメモしてみる。", cta: "「週刊宇宙ニュース」を読んで「#宇宙ニュース」に感想を書き残すか、日々の教養として「毎日宇宙クイズ」を解く習慣をつけてみましょう。", emoji: "📖", color: "#96CE9C" },
  PVXS: { typeTitle: "産業分析志向", roleName: "分析者タイプ", catchphrase: "宇宙を“構造で理解する”人", analysis: "「なぜこうなるのか」「産業としてどう動くのか」を論理的に考えるのが好き。でも、「間違ったことを言いたくない」という思いから発言を控えていませんか？", strength: "物事の全体像と仕組みを解き明かす“整理力”。", mottainai: "100%正しいと確信できるまで、自分の意見を言わないこと。", firstStep: "「たぶんこうだと思う」という仮説を口にしてみる。", cta: "「Cosmo Baseで宇宙知っトク」に参加して、解説を聞きながら「これってこういう構造ですか？」と気軽にチャットで聞いてみましょう。", emoji: "🧩", color: "#72B879" },
  PVMI: { typeTitle: "最新テック志向", roleName: "追跡者タイプ", catchphrase: "宇宙の“最前線を追う”人", analysis: "最新技術やロケットのスペックなど、具体的なディテールを追うのが好きなタイプ。ただ、そのマニアックな面白さを周りにどう伝えていいか迷っていませんか？", strength: "正確な情報と最新の動向を掴む“精度”。", mottainai: "「他の人には難しすぎるかも」と遠慮して、情報をシェアしないこと。", firstStep: "「これすごい！」と思った技術記事をシェアする。", cta: "「#宇宙開発」に気になった技術記事をシェアするか、自分の知識の腕試しとして「Space Voyager 検定」に向けた学習をCBLで始めてみましょう。", emoji: "📡", color: "#A8DCAE" },
  PVMS: { typeTitle: "社会応用志向", roleName: "つなぎ手タイプ", catchphrase: "宇宙と社会の“架け橋になる”人", analysis: "宇宙技術って、地上の〇〇に使えるよね」と、他分野とのつながりを考えるのが得意。でも、自分の本業や専門分野と宇宙を実際に結びつけて語る機会が少ないのでは？", strength: "異なる分野同士の共通点を見つける“橋渡し力”。", mottainai: "頭の中でつながっているのに、それを言葉にして提示しないこと。", firstStep: "「自分の仕事・興味 × 宇宙」について考えてみる。", cta: "「#自己紹介」や「#宇宙ビジネス」で本業と宇宙の接点を書くか、「宇宙タイプ診断」を異業種の同僚に勧めて新しい視点を取り入れてみましょう。", emoji: "🤝", color: "#8BCA83" },
  PAXI: { typeTitle: "宇宙キャリア志向", roleName: "開拓者タイプ", catchphrase: "宇宙で“道を切り拓く”人", analysis: "宇宙分野でやりたいことや明確な目標があるタイプ。でも、「まずは完璧な計画を立ててから…」と、最初の一歩を重く考えすぎて足踏みしていませんか？", strength: "新しいことに挑む“挑戦力”。", mottainai: "準備に時間をかけすぎて、行動を起こすタイミングを逃すこと。", firstStep: "今年の目標や、やってみたいことを宣言する。", cta: "「宇宙のイベント行ってきた」を読んで刺激を受けたら、「宇宙に行っといで」で紹介されているイベントに直接申し込んでみましょう。", emoji: "🧭", color: "#76C5E8" },
  PAXS: { typeTitle: "産業推進志向", roleName: "推進者タイプ", catchphrase: "宇宙産業を“前に進める”人", analysis: "プロジェクト全体を俯瞰し、ビジネスとして前に進めたい人。ただ、熱量が高すぎて、周りのペースを少し置いてきぼりにしてしまうことはありませんか？", strength: "組織やプロジェクトを引っ張る“推進力”。", mottainai: "正論や効率ばかりを求めて、周りの「楽しい」という感情を見落とすこと。", firstStep: "肩の力を抜いて、誰かと「宇宙の面白さ」だけを語り合う。", cta: "「#雑談」で仕事の枠を外して純粋に好きなところを話すか、「Cosmo Baseで宇宙知っトク」に参加して初心者層の熱量に直接触れてみましょう。", emoji: "🏁", color: "#9AD4EE" },
  PAMI: { typeTitle: "技術開発志向", roleName: "創り手タイプ", catchphrase: "宇宙の未来を“実装する”人", analysis: "実際に手を動かして開発や研究をするのが得意なタイプ。でも、作業に没頭するあまり、他の分野の人やコミュニティとのつながりが希薄になっていませんか？", strength: "アイデアを形にする“実装力”。", mottainai: "一人で開発に閉じこもり、外からの新しい刺激を遮断してしまうこと。", firstStep: "今作っているものや研究していることの「進捗」をシェアする。", cta: "「#宇宙開発」で未完成な状態の進捗を共有するか、「Space Voyager 検定」の上位認定を目指して、自身の知識体系を強固にしてみましょう。", emoji: "🔧", color: "#6CB6D9" },
  PAMS: { typeTitle: "社会課題解決志向", roleName: "実装者タイプ", catchphrase: "宇宙を“社会課題に使う”人", analysis: "宇宙技術を使って地球の課題を解決したいという強い志を持つ人。でも、解決したいテーマが広がりすぎて、どこから手をつけていいか迷っていませんか？", strength: "理想を現実の課題解決に結びつける“実行力”。", mottainai: "テーマを広げすぎて、具体的な「最初のアクション」が見えなくなること。", firstStep: "今一番解決したいテーマを「1つだけ」に絞る。", cta: "「Cosmo Base Library（CBL）」で過去の事例を調べつつ、「#宇宙ビジネス」で「宇宙技術で〇〇を解決したい」と1つだけテーマを投稿してみましょう。", emoji: "🌐", color: "#5AADD6" }
};

const binaryQuestions = [
  { id: 'q1', axis: 'RP', text: '宇宙のニュースでつい見てしまうのは？', options: [{ label: '未知の銀河やブラックホール', val: 1 }, { label: '宇宙ビジネスやロケット開発', val: -1 }] },
  { id: 'q2', axis: 'RP', text: '宇宙の魅力はどっちに近い？', options: [{ label: '神秘やロマン', val: 1 }, { label: '可能性や実用性', val: -1 }] },
  { id: 'q3', axis: 'RP', text: 'もし宇宙関連で自由に1万円使えるなら？', options: [{ label: '星空ツアーや高画質な写真集', val: 1 }, { label: '専門書や最新技術サロン', val: -1 }] },
  { id: 'q4', axis: 'RP', text: '宇宙について話すなら？', options: [{ label: '「宇宙人いると思う？」', val: 1 }, { label: '「この技術、地上で使えるね」', val: -1 }] },
  { id: 'q7', axis: 'VA', text: '面白い宇宙コンテンツを見たら？', options: [{ label: '満足して終わる', val: 1 }, { label: '誰かに話す・発信する', val: -1 }] },
  { id: 'q8', axis: 'VA', text: '最近の宇宙との関わりは？', options: [{ label: '見る・読む', val: 1 }, { label: '話す・投稿・参加', val: -1 }] },
  { id: 'q9', axis: 'VA', text: 'コミュニティに入ったら？', options: [{ label: 'まずは様子を見る', val: 1 }, { label: 'とりあえず発言してみる', val: -1 }] },
  { id: 'q10', axis: 'VA', text: '本音として近いのは？', options: [{ label: '発信や制作はハードル高い', val: 1 }, { label: '見てるだけだと物足りない', val: -1 }] },
  { id: 'q13', axis: 'MX', text: 'ロケットで気になるのは？', options: [{ label: '構造や仕組み', val: 1 }, { label: '社会への影響', val: -1 }] },
  { id: 'q14', axis: 'MX', text: '新しい宇宙プロジェクトが発表されたら？', options: [{ label: 'どんな技術で動くの？', val: 1 }, { label: '人類の未来をどう変えるの？', val: -1 }] },
  { id: 'q15', axis: 'MX', text: '展示で見入るのは？', options: [{ label: '部品や構造', val: 1 }, { label: '歴史や未来', val: -1 }] },
  { id: 'q16', axis: 'MX', text: 'モヤっとするのは？', options: [{ label: '仕組みが分からない説明', val: 1 }, { label: '全体像が見えない話', val: -1 }] },
  { id: 'q19', axis: 'IS', text: '宇宙との関わり方は？', options: [{ label: '趣味として楽しみたい', val: 1 }, { label: '仕事や活動にしたい', val: -1 }] },
  { id: 'q20', axis: 'IS', text: '宇宙に時間を使うなら？', options: [{ label: '楽しいこと優先', val: 1 }, { label: '役に立つこと優先', val: -1 }] },
  { id: 'q21', axis: 'IS', text: '理想の関わり方は？', options: [{ label: '自分のペース', val: 1 }, { label: '社会に影響', val: -1 }] },
  { id: 'q22', axis: 'IS', text: '冷める瞬間は？', options: [{ label: '義務や成果を求められる時', val: 1 }, { label: '何も生まれない時', val: -1 }] },
];

const scaleQuestions = [
  { id: 'q5', axis: 'RP', text: '宇宙の美しさやスケールに、理由なく心を動かされることがある', invert: false },
  { id: 'q6', axis: 'RP', text: '宇宙は“ビジネスや社会を変える手段”として興味がある', invert: true },
  { id: 'q11', axis: 'VA', text: '面白いものを見るだけで満足できるタイプだ', invert: false },
  { id: 'q12', axis: 'VA', text: '自分の考えや好きなことを、何かしらの形で外に出したいと思う', invert: true },
  { id: 'q17', axis: 'MX', text: '細かい仕組みや構造を理解すると満足感がある', invert: false },
  { id: 'q18', axis: 'MX', text: '大きな流れや未来の方向性を理解するとワクワクする', invert: true },
  { id: 'q23', axis: 'IS', text: '自分が楽しいと思えることを最優先したい', invert: false },
  { id: 'q24', axis: 'IS', text: '自分の行動が誰かや社会に影響することにやりがいを感じる', invert: true },
];

const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export default function SpaceTypeDiagnosis() {
  const [step, setStep] = useState<'start' | 'page1' | 'page2' | 'page3' | 'loading' | 'result'>('start');
  const [answers, setAnswers] = useState<Record<string, { val: number, axis: string }>>({});
  
  const [page1Qs, setPage1Qs] = useState<any[]>([]);
  const [page2Qs, setPage2Qs] = useState<any[]>([]);
  const [page3Qs, setPage3Qs] = useState<any[]>([]);

  useEffect(() => {
    const shuffledBinary = shuffle(binaryQuestions);
    setPage1Qs(shuffledBinary.slice(0, 8));
    setPage2Qs(shuffledBinary.slice(8, 16));
    setPage3Qs(shuffle(scaleQuestions));
  }, []);

  const handleStepChange = (newStep: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(newStep);
  };

  const handleSelect = (qId: string, val: number, axis: string, qsList: any[], currentIndex: number) => {
    setAnswers(prev => ({ ...prev, [qId]: { val, axis } }));
    
    // 次の質問へ自動スクロール
    if (currentIndex < qsList.length - 1) {
      const nextQId = qsList[currentIndex + 1].id;
      setTimeout(() => {
        const nextEl = document.getElementById(`q-${nextQId}`);
        if (nextEl) {
          nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 250);
    }
  };

  const isPageComplete = (qs: any[]) => qs.every(q => answers[q.id] !== undefined);

  const calculateResult = () => {
    let rp = 0, va = 0, mx = 0, is = 0;
    Object.values(answers).forEach(ans => {
      if (ans.axis === 'RP') rp += ans.val;
      if (ans.axis === 'VA') va += ans.val;
      if (ans.axis === 'MX') mx += ans.val;
      if (ans.axis === 'IS') is += ans.val;
    });

    const typeStr = 
      (rp >= 0 ? 'R' : 'P') +
      (va >= 0 ? 'V' : 'A') +
      (mx > 0 ? 'M' : 'X') + 
      (is >= 0 ? 'I' : 'S');

    return { typeStr, scores: { rp, va, mx, is } };
  };

  const handleFinish = () => {
    handleStepChange('loading');
    setTimeout(() => {
      handleStepChange('result');
    }, 2000);
  };

  // --- UI レンダリング関数 ---

  const renderBinaryQuestion = (q: any, index: number, qsList: any[]) => (
    <div id={`q-${q.id}`} key={q.id} className="mb-8 p-5 bg-[#111144] rounded-2xl border border-[#EEEEFF]/20 shadow-lg">
      <p className="font-bold mb-4 text-center leading-relaxed">{q.text}</p>
      {/* 2択を横並びに */}
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt: any) => {
          const isSelected = answers[q.id]?.val === opt.val;
          return (
            <button
              key={opt.label}
              onClick={() => handleSelect(q.id, opt.val, q.axis, qsList, index)}
              className={`p-3 rounded-xl text-center transition-all duration-300 text-sm font-bold flex items-center justify-center min-h-[60px] ${
                isSelected ? 'bg-[#EEEEFF] text-[#000033] shadow-[0_0_15px_rgba(238,238,255,0.4)] scale-[1.02]' : 'bg-[#000033] border border-[#EEEEFF]/50 text-[#EEEEFF] hover:bg-[#EEEEFF]/10'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderScaleQuestion = (q: any, index: number, qsList: any[]) => {
    // 5択の円形ボタンデータ (左が+2, 右が-2となるように配置)
    const circleOptions = [
      { val: q.invert ? -2 : 2, size: 'w-12 h-12', label: 'とてもそう思う' },
      { val: q.invert ? -1 : 1, size: 'w-10 h-10', label: '' },
      { val: 0, size: 'w-8 h-8', label: '0' }, // 真ん中は最も小さい
      { val: q.invert ? 1 : -1, size: 'w-10 h-10', label: '' },
      { val: q.invert ? 2 : -2, size: 'w-12 h-12', label: '全くそう思わない' },
    ];

    return (
      <div id={`q-${q.id}`} key={q.id} className="mb-8 p-5 bg-[#111144] rounded-2xl border border-[#EEEEFF]/20 shadow-lg">
        <p className="font-bold mb-6 text-center leading-relaxed">{q.text}</p>
        
        <div className="flex justify-between items-center px-1 sm:px-4">
          <div className="text-center w-10">
            <span className="text-lg font-bold text-[#EEEEFF]">+2</span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-1">
            {circleOptions.map((opt, i) => {
              const isSelected = answers[q.id]?.val === opt.val;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(q.id, opt.val, q.axis, qsList, index)}
                  className={`rounded-full transition-all duration-300 flex items-center justify-center ${opt.size} ${
                    isSelected 
                      ? 'bg-[#83CBEB] border-none shadow-[0_0_15px_rgba(252,232,119,0.6)] scale-110' 
                      : 'bg-transparent border-2 border-[#EEEEFF]/30 hover:border-[#EEEEFF]/70'
                  }`}
                />
              );
            })}
          </div>

          <div className="text-center w-10">
            <span className="text-lg font-bold text-[#EEEEFF]/60">-2</span>
          </div>
        </div>
      </div>
    );
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#000033] text-[#EEEEFF] font-sans flex flex-col">
      <header className="p-4 border-b border-[#EEEEFF]/20 text-center">
         <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Back button + Logo - Left */}
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={logoImg}
              alt="Cosmo Base"
              className="h-10 w-auto"
              priority
              loading="eager"
            />
            <span className="text-xs text-muted-foreground border-l border-border pl-3 hidden sm:block">
              参加者ページ
            </span>
          </Link>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {/* Partners button */}
          <a href="https://fsifofficial.github.io/CosmoBase/partners">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">パートナー一覧</span>
            </Button>
          </a>

          {/* Usage guide button */}
          <Link href="/guide">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <HelpCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">使い方</span>
            </Button>
          </Link>

          {/* Hamburger menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Dropdown menu - right half only */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 w-full sm:w-[320px] bg-background/95 backdrop-blur-xl border-b border-l border-border/50 rounded-bl-2xl shadow-2xl animate-in slide-in-from-top-2 fade-in duration-200">
          <nav className="p-3">
            <ul className="flex flex-col gap-1">

              <li>
                <a
                  href="https://fsifofficial.github.io/CosmoBase/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200 shrink-0">
                    <img src={cbIcon.src} className="w-5 h-5 object-contain" alt="Cosmo Base" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Cosmo Base</p>
                    <p className="text-xs text-muted-foreground mt-0.5">公式サイト</p>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href="https://cosmo-base.github.io/library/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200 shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Cosmo Base Library</p>
                    <p className="text-xs text-muted-foreground mt-0.5">宇宙の知識を体系的に学ぶ</p>
                  </div>
                </a>
              </li>

              {/* 区切り線 */}
              <div className="h-px w-full bg-border/50 my-1 rounded-full" />

              <li>
                <a
                  href="https://x.com/CosmoBase"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200 shrink-0">
                    <img src={xIcon.src} alt="X" className="w-4 h-4 object-contain" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">X (Twitter)</p>
                    <p className="text-xs text-muted-foreground mt-0.5">最新情報をチェック</p>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href="https://www.instagram.com/cosmobase.official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200 shrink-0">
                    <img src={instaIcon.src} alt="Instagram" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Instagram</p>
                    <p className="text-xs text-muted-foreground mt-0.5">活動の様子をチェック</p>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href="https://note.com/cosmobase"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200 shrink-0">
                    <img src={noteIcon.src} alt="note" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">note</p>
                    <p className="text-xs text-muted-foreground mt-0.5">記事を読む</p>
                  </div>
                </a>
              </li>

            </ul>
          </nav>
        </div>
      )}
      </header>
      <main className="flex-1 p-4 sm:p-8 flex justify-center">
        <div className="max-w-2xl w-full">
          {step === 'start' && (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in">
              <img src="/member_only/CBtype_logo.png" alt="宇宙タイプ診断" className="w-64 sm:w-80 h-auto mb-6 drop-shadow-lg"/>
              <p className="mb-8 opacity-80 leading-relaxed">
                あなたの「関心」や「関わり方」から<br />
                16種類のタイプを分析します。
              </p>
            <button onClick={() => handleStepChange('page1')} className="bg-[#EEEEFF] text-[#000033] font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform">
              診断を始める
            </button>
          </div>
        )}

        {step === 'page1' && (
          <div className="animate-fade-in pb-20">
            <h2 className="text-xl font-bold mb-6 text-center">質問 (1/3ページ)</h2>
            {page1Qs.map((q, i) => renderBinaryQuestion(q, i, page1Qs))}
            <button disabled={!isPageComplete(page1Qs)} onClick={() => handleStepChange('page2')} className={`w-full py-4 rounded-full font-bold transition-all ${isPageComplete(page1Qs) ? 'bg-[#EEEEFF] text-[#000033] shadow-[0_0_20px_rgba(238,238,255,0.3)]' : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'}`}>
              次へ
            </button>
          </div>
        )}

        {step === 'page2' && (
          <div className="animate-fade-in pb-20">
            <h2 className="text-xl font-bold mb-6 text-center">質問 (2/3ページ)</h2>
            {page2Qs.map((q, i) => renderBinaryQuestion(q, i, page2Qs))}
            <button disabled={!isPageComplete(page2Qs)} onClick={() => handleStepChange('page3')} className={`w-full py-4 rounded-full font-bold transition-all ${isPageComplete(page2Qs) ? 'bg-[#EEEEFF] text-[#000033] shadow-[0_0_20px_rgba(238,238,255,0.3)]' : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'}`}>
              次へ
            </button>
          </div>
        )}

        {step === 'page3' && (
          <div className="animate-fade-in pb-20">
            <h2 className="text-xl font-bold mb-6 text-center">質問 (3/3ページ)</h2>
            {page3Qs.map((q, i) => renderScaleQuestion(q, i, page3Qs))}
            <button disabled={!isPageComplete(page3Qs)} onClick={handleFinish} className={`w-full py-4 rounded-full font-bold transition-all ${isPageComplete(page3Qs) ? 'bg-gradient-to-r from-[#83CBEB] to-[#F5E69C] text-[#000033] shadow-[0_0_20px_rgba(252,232,119,0.4)]' : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'}`}>
              結果を見る
            </button>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-pulse">
            <div className="w-16 h-16 border-4 border-[#EEEEFF] border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-lg font-bold">診断中...</p>
            <p className="text-sm opacity-70 mt-2">あなたの宇宙の関わり方を分析しています</p>
          </div>
        )}

        {step === 'result' && (() => {
          const { typeStr, scores } = calculateResult();
          const tData = typesData[typeStr];
          
          // 新しいパラメーター計算ロジック
          const getAxisResult = (score: number, leftLabel: string, rightLabel: string, axisName: string, isLeftNegative: boolean) => {
            // スコア(-8〜8)から左側の割合を計算
            const leftRatio = isLeftNegative ? ((8 - score) / 16) * 100 : ((score + 8) / 16) * 100;
            const dominant = leftRatio >= 50 ? leftLabel : rightLabel;
            const perc = leftRatio >= 50 ? Math.round(leftRatio) : Math.round(100 - leftRatio);
            
            let strength = 'バランス型';
            if (perc >= 80) strength = 'かなり強め';
            else if (perc >= 60) strength = '強め';

            return { axisName, leftLabel, rightLabel, dominant, perc, strength };
          };

          const axisResults = [
            getAxisResult(scores.rp, 'R', 'P', '関心', false),
            getAxisResult(scores.va, 'V', 'A', '行動', false),
            getAxisResult(scores.mx, 'X', 'M', '視点', true),
            getAxisResult(scores.is, 'I', 'S', '距離', false),
          ];

          return (
            <div className="animate-fade-in pb-12">
              <h2 className="text-center text-sm tracking-widest opacity-80 mb-2">あなたの診断結果</h2>
              <h1 className="text-3xl font-bold text-center mb-6">
                <span className="block text-lg font-normal mb-1">{tData.typeTitle}</span>
                {tData.roleName}
              </h1>

              {/* キャラクター画像エリア */}
              <div className="w-full h-64 flex flex-col items-center justify-center rounded-2xl mb-8 relative overflow-hidden shadow-2xl" style={{ backgroundColor: tData.color }}>
                <span className="text-8xl drop-shadow-lg z-10">{tData.emoji}</span>
              </div>

              <div className="text-center bg-[#EEEEFF] text-[#000033] py-4 px-2 rounded-xl font-bold text-lg mb-8 shadow-md">
                {tData.catchphrase}
              </div>

              {/* 分析パラメーターUI */}
              <div className="bg-[#111144] p-5 sm:p-6 rounded-xl mb-8 border border-[#EEEEFF]/10 shadow-lg">
                <h3 className="font-bold border-b border-[#EEEEFF]/20 pb-3 mb-6 text-center text-lg">分析パラメーター</h3>
                <div className="space-y-4 sm:space-y-5">
                  {axisResults.map((ar, idx) => (
                    <div key={idx} className="flex items-center text-sm sm:text-base font-bold">
                      <span className="w-10 sm:w-12 opacity-70 font-normal text-xs sm:text-sm">{ar.axisName}</span>
                      
                      <span className={`w-5 sm:w-6 text-right ${ar.dominant === ar.leftLabel ? 'text-[#83CBEB]' : 'text-[#EEEEFF]'}`}>
                        {ar.leftLabel}
                      </span>
                      
                      <div className="flex-1 mx-2 sm:mx-3 h-3 bg-[#EEEEFF]/20 rounded-full overflow-hidden relative shadow-inner">
                        {ar.dominant === ar.leftLabel ? (
                          <div className="absolute top-0 left-0 h-full bg-[#EEEEFF] transition-all duration-1000" style={{ width: `${ar.perc}%` }} />
                        ) : (
                          <div className="absolute top-0 right-0 h-full bg-[#EEEEFF] transition-all duration-1000" style={{ width: `${ar.perc}%` }} />
                        )}
                      </div>
                      
                      <span className={`w-5 sm:w-6 text-left ${ar.dominant === ar.rightLabel ? 'text-[#83CBEB]' : 'text-[#EEEEFF]'}`}>
                        {ar.rightLabel}
                      </span>
                      
                      <span className="w-28 sm:w-32 text-[10px] sm:text-xs text-right opacity-90 font-normal tracking-tighter sm:tracking-normal">
                        ({ar.dominant} {ar.strength}({ar.perc}%))
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center"><span className="text-xl mr-2">🔎</span> 分析</h3>
                  <p className="leading-relaxed opacity-90">{tData.analysis}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center text-[#FCE877]"><span className="text-xl mr-2">✨</span> 本当の強み</h3>
                  <p className="leading-relaxed opacity-90">{tData.strength}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 flex items-center text-[#ff9999]"><span className="text-xl mr-2">⚠️</span> もったいない行動</h3>
                  <p className="leading-relaxed opacity-90">{tData.mottainai}</p>
                </div>
                <div className="bg-[#111144] p-5 rounded-xl border border-[#EEEEFF]/20">
                  <h3 className="text-lg font-bold mb-2 flex items-center"><span className="text-xl mr-2">👣</span> 最初の一歩</h3>
                  <p className="font-bold text-[#EEEEFF] mb-4">{tData.firstStep}</p>
                  <p className="text-sm opacity-80 leading-relaxed border-t border-[#EEEEFF]/20 pt-3">{tData.cta}</p>
                </div>
              </div>

              {/* 改修版：各タイプの詳細 note リンク (リッチなボタン) */}
              <div className="mt-12 mb-8 text-center bg-[#111144] p-6 sm:p-8 rounded-2xl border border-[#EEEEFF]/20 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3">さらに詳しい分析を知りたい方へ</h3>
                  <p className="text-sm opacity-80 mb-6 leading-relaxed">
                    各タイプの詳細な解説や、同じタイプの人の傾向を<br className="hidden sm:block" />noteで公開しています。
                  </p>
                  <a 
                    href={`https://note.com/cosmobase/n/type_${typeStr.toLowerCase()}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center gap-2 bg-[#2cb696] text-white font-bold py-4 px-8 rounded-full shadow-[0_4px_20px_rgba(44,182,150,0.4)] hover:scale-105 hover:bg-[#259c80] transition-all duration-300 w-full sm:w-auto group"
                  >
                    <span className="bg-white text-[#2cb696] text-xs font-black px-2 py-1 rounded-md tracking-wider group-hover:scale-110 transition-transform">note</span>
                    <span className="text-base sm:text-lg">で詳細を読む</span>
                    <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Cosmo Baseへの導線CTA */}
              <div className="mt-8 p-6 border-2 border-[#EEEEFF] rounded-2xl text-center bg-gradient-to-b from-[#111144] to-[#000033] shadow-2xl relative overflow-hidden">
                <h3 className="text-2xl font-bold mb-3 z-10 relative">Cosmo Baseに参加する</h3>
                <p className="text-sm mb-6 opacity-90 z-10 relative">宇宙を「遠い存在」から「自分の選択肢」へ。<br/>専門知識ゼロでも歓迎のオープンコミュニティです。</p>
                <a 
                  href="https://discord.gg/4tW8RcFkrK" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="relative z-10 inline-block bg-[#EEEEFF] text-[#000033] font-bold py-4 px-8 rounded-full hover:scale-105 transition-transform"
                >
                  Discordに参加する (無料)
                </a>
              </div>

              <div className="mt-12 text-center">
                <button onClick={() => handleStepChange('start')} className="text-sm opacity-50 hover:opacity-100 transition-opacity underline">
                  最初からやり直す
                </button>
              </div>
            </div>
          );
        })()}
        </div>
      </main>
      <footer className="p-6 border-t border-[#EEEEFF]/20 text-center text-sm opacity-70">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-4">
            <Image
              src={footerLogo}
              alt="Cosmo Base"
              className="h-8 w-auto opacity-70"
            />
            <p className="text-sm text-muted-foreground">
              &copy; 2026 Cosmo Base. All rights reserved.
            </p>
          </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}} />
    </div>
  );
}
