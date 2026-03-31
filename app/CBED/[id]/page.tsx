// app/CBED/[id]/page.tsx
import { Metadata } from "next"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock, ArrowLeft, ExternalLink, User, Users, Building } from "lucide-react"
import Link from "next/link"
import { fetchEventsData } from "@/data/CBED"
import { notFound } from "next/navigation"

export const dynamicParams = false;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 1. ページ生成の指示出し（ここで146件分の指示を強制的に出させます！）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function generateStaticParams() {
  const events = await fetchEventsData();
  
  // 重複IDや空のIDを排除して確実に全件渡す最強のロジック
  const uniqueIds = new Set<string>();
  const params: { id: string }[] = [];
  
  events.forEach(event => {
    const idStr = String(event.id).trim();
    if (idStr && !uniqueIds.has(idStr)) {
      uniqueIds.add(idStr);
      params.push({ id: idStr });
    }
  });

  // ターミナルに強制的に生成件数を表示させます！
  console.log(`\n=========================================`);
  console.log(`🚀 generateStaticParams が ${params.length} ページ分の作成を指示しました！`);
  console.log(`=========================================\n`);

  return params;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 2. メタデータ（タブのタイトル）の生成
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  // Next.jsのURLエンコード（%20など）のバグ対策
  const eventId = decodeURIComponent(resolvedParams.id);

  const allEvents = await fetchEventsData();
  const event = allEvents.find(e => String(e.id).trim() === eventId);

  if (!event) {
    return { title: "イベントが見つかりません" }
  }

  const descriptionText = event.description 
    ? event.description.slice(0, 100) + "..." 
    : `${event.title}の詳細情報ページです。`;

  return {
    title: `${event.title} | CBED`,
    description: descriptionText,
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 3. ページ本体の表示
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const eventId = decodeURIComponent(resolvedParams.id);

  const allEvents = await fetchEventsData()
  const event = allEvents.find(e => String(e.id).trim() === eventId)

  // ページ生成時に見つからなかった場合は404ページを出す（ここで弾かれていた可能性大）
  if (!event) {
    notFound()
  }  
  
  const isCosmoBaseEvent = event.organizer
    ? String(event.organizer).replace(/\s+/g, "").toLowerCase().includes("cosmobase")
    : false
  const isPartnerEvent = Boolean(event.isPartner && String(event.isPartner).toUpperCase() === "TRUE")

  let orgLabel = "外部イベント"
  let orgStyle = "bg-secondary text-muted-foreground border-border/50"

  if (isCosmoBaseEvent) {
    orgLabel = "主催イベント"
    orgStyle = "bg-primary/20 text-primary border-primary/30"
  } else if (isPartnerEvent) {
    orgLabel = "パートナー"
    orgStyle = "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
  }

  return (
    <ContentPageLayout title="イベント詳細" level={4} levelTitle="体系化" logo="CBED">
      <div className="mb-6">
        <Link href="/CBED/search">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            一覧に戻る
          </Button>
        </Link>
      </div>

      <div className="glass-card rounded-xl p-6 md:p-8 max-w-3xl mx-auto border border-border/50">
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${orgStyle}`}>
              {orgLabel}
            </span>
            
            {event.type && String(event.type).split(',').map((t, idx) => (
              <span key={idx} className="px-3 py-1 text-xs font-medium rounded-full bg-accent/20 text-accent border border-accent/30">
                {t.trim()}
              </span>
            ))}
            {event.difficulty && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary border border-border/50 text-foreground">
                {event.difficulty}
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">
            {event.title}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-sm text-foreground bg-secondary/30 p-5 rounded-lg border border-border/50">
            {event.date && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary shrink-0" />
                <span>{event.endDate ? `${event.date} 〜 ${event.endDate}` : event.date}</span>
              </div>
            )}
            {event.time && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                {/* ★ 修正：時間が複数行になっても綺麗に表示されるように whitespace-pre-wrap を追加 */}
                <span className="whitespace-pre-wrap leading-relaxed">{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>{event.location}</span>
              </div>
            )}
            {event.capacity && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground shrink-0" />
                <span>定員: {event.capacity}</span>
              </div>
            )}
            {event.speaker && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground shrink-0" />
                <span>登壇: {event.speaker}</span>
              </div>
            )}
            {event.organizer && (
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-muted-foreground shrink-0" />
                <span>主催: {event.organizer}</span>
              </div>
            )}
          </div>
        </div>

        {event.description && (
          <div className="prose prose-sm dark:prose-invert max-w-none mb-10">
            <h3 className="text-lg font-semibold border-b border-border/50 pb-2 mb-4">イベントについて</h3>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/50">
          {event.link && (
            <a href={event.link} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button className="w-full bg-primary/80 hover:bg-primary/70 text-primary-foreground">
                詳細・申し込みページへ
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          )}
          
          {event.lat && event.lng && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=$${event.lat},${event.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="outline" className="w-full">
                Googleマップで開く
                <MapPin className="w-4 h-4 ml-2" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </ContentPageLayout>
  )
}
