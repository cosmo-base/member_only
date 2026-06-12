// components/spacetype-detail-list.tsx
"use client";

import Link from "next/link"
import { ExternalLink, Search, ChevronRight, Activity, ArrowRight, Lightbulb, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"

const FULL_TYPES = [
  { id: "RVXI", typeTitle: "宇宙ロマン志向", roleName: "夢想家タイプ", catchphrase: "宇宙を“楽しむ才能”を持っている人", analysis: "宇宙の美しい画像や神秘的な話に触れるだけで心が満たされるタイプ。「実用性」や「役に立つか」という話になると、少し距離を感じてしまうかも？", strength: "理由なく純粋に宇宙を楽しめる“感性”は一番の価値です。", mottainai: "「自分は詳しくないから」と、感じたワクワクを自分の中だけで終わらせてしまうこと。", firstStep: "好きな宇宙の画像を1枚保存してみる。", cta: "「#写真・画像」チャンネルで誰かの投稿にスタンプを押すか、まずは数十秒で終わる「毎日宇宙クイズ」を解いて、宇宙の面白さに少しだけ触れてみましょう。", emoji: "🌌", color: "#D1B3E8", noteUrl: "nce1b2d13ffba" },
  { id: "RVXS", typeTitle: "未来観察志向", roleName: "観測者タイプ", catchphrase: "宇宙の“未来を見届ける”人", analysis: "「人類が月へ」「宇宙旅行」など、未来のワクワクする話が好き。でも、ロケットの仕組みなどの細かい話になると、少し難しく感じてしまうかも。", strength: "大きな流れや、未来の可能性を楽しむ“全体を見る力”を持っています。", mottainai: "「難しそう」という理由だけで、情報からそっと離れてしまうこと。", firstStep: "週に1回だけ、宇宙のトピックを眺めてみる。", cta: "「週刊宇宙ニュース」を流し読みして、気になった見出しを1つ見つけるか、自分の「宇宙タイプ診断」の結果をSNSでシェアして未来の仲間を探してみましょう。", emoji: "🌕", color: "#BCA2DC", noteUrl: "n9bcf0ea435fa" },
  { id: "RVMI", typeTitle: "天体愛好志向", roleName: "探訪者タイプ", catchphrase: "宇宙の“美しさを発見する”人", analysis: "「綺麗」「かっこいい」といった直感で動く感性型。星空や造形の細かな魅力に気づける人です。ただ、その感動を誰かと共有する機会が少ないのでは？", strength: "人が気づかない宇宙の魅力を見つける“独自の視点”。", mottainai: "素敵なものを見つけたのに、誰にも教えないこと。", firstStep: "「これ好きかも」という直感を大事にする。", cta: "「#天文・観測」チャンネルや「Cosmo Base Library（CBL）」で、お気に入りの画像を1つ探してブックマークしてみましょう。", emoji: "🪐", color: "#E4C3F0", noteUrl: "nfd1a6d44e08e" },
  { id: "RVMS", typeTitle: "探査共感志向", roleName: "見守り手タイプ", catchphrase: "宇宙への“挑戦を応援する”人", analysis: "自分が前に出るより、挑戦している人やプロジェクトを応援するのが好きなタイプ。でも心の奥底には「自分も少し関わってみたい」気持ちがあるのでは？", strength: "誰かの熱意に寄り添える“共感力”。", mottainai: "完全なROM専（見るだけ）に徹して、自分の存在を消してしまうこと。", firstStep: "「すごい！」「がんばれ」と心の中でエールを送る。", cta: "「#宇宙開発」で応援スタンプを押したり、周りの友人に「宇宙タイプ診断」を勧めて、それぞれの宇宙の楽しみ方を共有してみましょう。", emoji: "🌠", color: "#C5B9D6", noteUrl: "n425e90388cf0" },
  { id: "RAXI", typeTitle: "宇宙探求志向", roleName: "探求者タイプ", catchphrase: "宇宙の“謎を深掘りする”人", analysis: "「宇宙人はいる？」「ブラックホールの中は？」など、答えのない問いを考えるのが好き。でも、頭の中で考えて満足してしまい、人に話すことが少ないのでは？", strength: "疑問をトコトン深掘りできる“知的好奇心”。", mottainai: "アウトプットせずに、自分の頭の中だけで完結させてしまうこと。", firstStep: "ふと思った素朴な疑問を言葉にしてみる。", cta: "「Cosmo Baseで宇宙教えて（#質問部屋）」で、「ずっと気になってたんだけど…」と気軽な疑問を1つ投げてみましょう。", emoji: "🛸", color: "#F2F2C4", noteUrl: "nd4786982c7a4" },
  { id: "RAXS", typeTitle: "宇宙伝道志向", roleName: "語り部タイプ", catchphrase: "宇宙の“面白さを翻訳する”人", analysis: "「これ面白い！」と思ったことを誰かに伝えたくなる人。ただ、完璧に説明しようとして、うまく言葉にできず止まってしまうことはありませんか？", strength: "自分のワクワクを他人に伝播させる“伝える力”。", mottainai: "綺麗にまとめようと準備しすぎて、結局発信をやめてしまうこと。", firstStep: "1行だけでいいから、面白かったことを人に言う。", cta: "「#エンタメ」チャンネルで面白かったニュースをつぶやいたり、自分の「宇宙タイプ診断」結果と一緒にCosmo Baseの魅力を発信してみましょう。", emoji: "🎙️", color: "#F5E69C", noteUrl: "n8adc260aef46" },
  { id: "RAMI", typeTitle: "趣味没頭志向", roleName: "職人タイプ", catchphrase: "宇宙への愛を“形にする”人", analysis: "模型を作ったり、写真を撮ったり、調べたことをまとめたりするのが好きなタイプ。でも、完成するまで人に見せるのをためらっていませんか？", strength: "好きなことに徹底的に向き合える“没頭力”。", mottainai: "100%完成するまで、誰にも見せずに隠しておくこと。", firstStep: "「いま、こんなの作ってる（調べてる）」と見せてみる。", cta: "「#写真・画像」に制作途中のものをシェアするか、「毎日宇宙クイズ」に挑戦して、自分のマニアックな知識をこっそりアップデートしてみましょう。", emoji: "📸", color: "#E8E8B6", noteUrl: "n63161e14ddd4" },
  { id: "RAMS", typeTitle: "宇宙カルチャー志向", roleName: "仕掛け人タイプ", catchphrase: "宇宙で“熱狂を生み出す”人", analysis: "「こんなことやったら面白そう！」とアイデアを出すのが得意。でも、自分一人でやり切るのは少し苦手で、誰かと一緒に盛り上がりたいタイプですよね？", strength: "人を巻き込んで企画を動かす“巻き込み力”。", mottainai: "アイデアを思いついたのに、「どうせ無理か」と寝かせてしまうこと。", firstStep: "「これやりたい！」と声に出してみる。", cta: "「#雑談」で「こんなイベント面白くない？」と提案するか、「宇宙タイプ診断」をシェアして、一緒に盛り上がれる仲間を探してみましょう。", emoji: "🎉", color: "#FCE877", noteUrl: "ned8d2501350f" },
  { id: "PVXI", typeTitle: "宇宙教養志向", roleName: "学び手タイプ", catchphrase: "宇宙を“教養として吸収する”人", analysis: "情報収集が得意で、ニュースや記事をよく読んでいるタイプ。インプット量は多いのに、それを外に出す機会がなくてインプット過多になっていませんか？", strength: "知識をスポンジのように吸収する“学習意欲”。", mottainai: "学んだことを「自分の中だけの知識」で終わらせてしまうこと。", firstStep: "学んだことを一言だけメモしてみる。", cta: "「週刊宇宙ニュース」を読んで「#宇宙ニュース」に感想を書き残すか、日々の教養として「毎日宇宙クイズ」を解く習慣をつけてみましょう。", emoji: "📖", color: "#96CE9C", noteUrl: "n1df477d8ef83" },
  { id: "PVXS", typeTitle: "産業分析志向", roleName: "分析者タイプ", catchphrase: "宇宙を“構造で理解する”人", analysis: "「なぜこうなるのか」「産業としてどう動くのか」を論理的に考えるのが好き。でも、「間違ったことを言いたくない」という思いから発言を控えていませんか？", strength: "物事の全体像と仕組みを解き明かす“整理力”。", mottainai: "100%正しいと確信できるまで、自分の意見を言わないこと。", firstStep: "「たぶんこうだと思う」という仮説を口にしてみる。", cta: "「Cosmo Baseで宇宙知っトク」に参加して、解説を聞きながら「これってこういう構造ですか？」と気軽にチャットで聞いてみましょう。", emoji: "🧩", color: "#72B879", noteUrl: "n69df42dedef4" },
  { id: "PVMI", typeTitle: "最新テック志向", roleName: "追跡者タイプ", catchphrase: "宇宙の“最前線を追う”人", analysis: "最新技術やロケットのスペックなど、具体的なディテールを追うのが好きなタイプ。ただ、そのマニアックな面白さを周りにどう伝えていいか迷っていませんか？", strength: "正確な情報と最新の動向を掴む“精度”。", mottainai: "「他の人には難しすぎるかも」と遠慮して、情報をシェアしないこと。", firstStep: "「これすごい！」と思った技術記事をシェアする。", cta: "「#宇宙開発」に気になった技術記事をシェアするか、自分の知識の腕試しとして「Space Voyager 検定」に向けた学習をCBLで始めてみましょう。", emoji: "📡", color: "#A8DCAE", noteUrl: "n61cdda622097" },
  { id: "PVMS", typeTitle: "社会応用志向", roleName: "つなぎ手タイプ", catchphrase: "宇宙と社会の“架け橋になる”人", analysis: "宇宙技術って、地上の〇〇に使えるよね」と、他分野とのつながりを考えるのが得意。でも、自分の本業や専門分野と宇宙を実際に結びつけて語る機会が少ないのでは？", strength: "異なる分野同士の共通点を見つける“橋渡し力”。", mottainai: "頭の中でつながっているのに、それを言葉にして提示しないこと。", firstStep: "「自分の仕事・興味 × 宇宙」について考えてみる。", cta: "「#自己紹介」や「#宇宙ビジネス」で本業と宇宙の接点を書くか、「宇宙タイプ診断」を異業種の同僚に勧めて新しい視点を取り入れてみましょう。", emoji: "🤝", color: "#8BCA83", noteUrl: "nfa5188a43e7e" },
  { id: "PAXI", typeTitle: "宇宙キャリア志向", roleName: "開拓者タイプ", catchphrase: "宇宙で“道を切り拓く”人", analysis: "宇宙分野でやりたいことや明確な目標があるタイプ。でも、「まずは完璧な計画を立ててから…」と、最初の一歩を重く考えすぎて足踏みしていませんか？", strength: "新しいことに挑む“挑戦力”。", mottainai: "準備に時間をかけすぎて、行動を起こすタイミングを逃すこと。", firstStep: "今年の目標や、やってみたいことを宣言する。", cta: "「宇宙のイベント行ってきた」を読んで刺激を受けたら、「宇宙に行っといで」で紹介されているイベントに直接申し込んでみましょう。", emoji: "🧭", color: "#76C5E8", noteUrl: "na83781965fb6" },
  { id: "PAXS", typeTitle: "産業推進志向", roleName: "推進者タイプ", catchphrase: "宇宙産業を“前に進める”人", analysis: "プロジェクト全体を俯瞰し、ビジネスとして前に進めたい人。ただ、熱量が高すぎて、周りのペースを少し置いてきぼりにしてしまうことはありませんか？", strength: "組織やプロジェクトを引っ張る“推進力”。", mottainai: "正論や効率ばかりを求めて、周りの「楽しい」という感情を見落とすこと。", firstStep: "肩の力を抜いて、誰かと「宇宙の面白さ」だけを語り合う。", cta: "「#雑談」で仕事の枠を外して純粋に好きなところを話すか、「Cosmo Baseで宇宙知っトク」に参加して初心者層の熱量に直接触れてみましょう。", emoji: "🏁", color: "#9AD4EE", noteUrl: "ned5b5e70b522" },
  { id: "PAMI", typeTitle: "技術開発志向", roleName: "創り手タイプ", catchphrase: "宇宙の未来を“実装する”人", analysis: "実際に手を動かして開発や研究をするのが得意なタイプ。でも、作業に没頭するあまり、他の分野の人やコミュニティとのつながりが希薄になっていませんか？", strength: "アイデアを形にする“実装力”。", mottainai: "一人で開発に閉じこもり、外からの新しい刺激を遮断してしまうこと。", firstStep: "今作っているものや研究していることの「進捗」をシェアする。", cta: "「#宇宙開発」で未完成な状態の進捗を共有するか、「Space Voyager 検定」の上位認定を目指して、自身の知識体系を強固にしてみましょう。", emoji: "🔧", color: "#6CB6D9", noteUrl: "n44568e50d40f" },
  { id: "PAMS", typeTitle: "社会課題解決志向", roleName: "実装者タイプ", catchphrase: "宇宙を“社会課題に使う”人", analysis: "宇宙技術を使って地球の課題を解決したいという強い志を持つ人。でも、解決したいテーマが広がりすぎて、どこから手をつけていいか迷っていませんか？", strength: "理想を現実の課題解決に結びつける“実行力”。", mottainai: "テーマを広げすぎて、具体的な「最初のアクション」が見えなくなること。", firstStep: "今一番解決したいテーマを「1つだけ」に絞る。", cta: "「Cosmo Base Library（CBL）」で過去の事例を調べつつ、「#宇宙ビジネス」で「宇宙技術で〇〇を解決したい」と1つだけテーマを投稿してみましょう。", emoji: "🌐", color: "#5AADD6", noteUrl: "n68c931f9739d" }
];

export function SpaceTypeDetailList() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* ヒーローセクション */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-primary/20 rounded-full mb-4">
          <Search className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          すべての宇宙タイプを知る
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          宇宙タイプ診断には、サクッと分かる「簡易版（4分類）」と、より深く行動特性を分析する「完全版（16分類）」があります。気になるタイプを見つけて、周りの友達と見比べてみましょう。
        </p>
      </div>

      {/* ページ遷移用タブ */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-secondary/30 p-1.5 rounded-full border border-border/50">
          <Link 
            href="/type/content/list" 
            className="px-8 py-3 rounded-full text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
          >
            簡易版（4タイプ）
          </Link>
          <div className="px-8 py-3 rounded-full text-sm font-bold bg-accent text-accent-foreground shadow-lg shadow-accent/25 cursor-default">
            完全版（16タイプ）
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid md:grid-cols-2 gap-6">
          {FULL_TYPES.map((type) => (
            <GlassCard key={type.id} className="relative overflow-hidden p-0 flex flex-col h-full group">
              
              {/* ★ エラー修正: GlassCardのstyleを外し、一番上に絶対配置でカラー線を引く */}
              <div className="absolute top-0 left-0 right-0 h-1.5 z-30" style={{ backgroundColor: type.color }} />
              
              {/* 背景のグロウ */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none z-0" style={{ backgroundColor: type.color }} />

              {/* ★ 追加: 画像エリア (フル幅) */}
              <div className="w-full relative aspect-video bg-secondary/30 overflow-hidden flex items-center justify-center z-10 border-b border-border/30">
                <img 
                  src={`/type/${type.id}.png`} // フォルダ指定: public/type/〇〇.png
                  alt={type.typeTitle}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // 画像が見つからなかった場合のフォールバック
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                {/* 画像がない時の代替表示（絵文字） */}
                <div className="hidden absolute inset-0 flex flex-col items-center justify-center bg-secondary/50">
                  <div className="text-6xl filter drop-shadow-md opacity-30">{type.emoji}</div>
                </div>
                {/* 自然なフェードグラデーション */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              </div>

              {/* コンテンツエリア */}
              <div className="p-6 md:p-8 flex-grow flex flex-col relative z-20">
                
                {/* 1. ヘッダー部分 */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl filter drop-shadow-lg">{type.emoji}</div>
                  <div>
                    <p className="text-sm font-bold tracking-wider mb-1" style={{ color: type.color }}>{type.roleName}</p>
                    <h3 className="text-2xl font-bold text-foreground leading-tight">{type.typeTitle}</h3>
                  </div>
                </div>
                <p className="text-base font-bold text-foreground mb-6">「{type.catchphrase}」</p>

                {/* 2. 詳細情報部分 */}
                <div className="flex-grow space-y-4">
                  
                  {/* 分析 */}
                  <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      性格と傾向
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed">{type.analysis}</p>
                  </div>

                  {/* 強みと弱み */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                      <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5" />
                        一番の強み
                      </h4>
                      <p className="text-xs text-foreground leading-relaxed">{type.strength}</p>
                    </div>
                    <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                      <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        もったいない点
                      </h4>
                      <p className="text-xs text-foreground leading-relaxed">{type.mottainai}</p>
                    </div>
                  </div>

                  {/* アクション */}
                  <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 mt-4">
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">👣 最初の一歩</h4>
                      <p className="text-sm text-foreground font-medium">{type.firstStep}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-1.5">🎯 おすすめのアクション</h4>
                      <p className="text-xs text-foreground leading-relaxed">{type.cta}</p>
                    </div>
                  </div>

                </div>

                {/* noteへのリンク */}
                <div className="mt-6 pt-4 border-t border-border/50 flex justify-end">
                  <a
                    href={`https://note.com/cosmo_base/n/${type.noteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
                  >
                    noteでさらに詳しく読む
                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>

              </div>
            </GlassCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/type/detail">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 glow h-14 px-8 rounded-full font-bold text-base shadow-lg shadow-accent/20">
              完全版診断を受けてみる
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}