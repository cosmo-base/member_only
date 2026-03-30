// app/CBED/[id]/page.tsx
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock, ArrowLeft, ExternalLink, User, Users, Building } from "lucide-react"
import Link from "next/link"
import { fetchEventsData } from "@/data/CBED"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const events = await fetchEventsData();
  
  // スプレッドシートにある全イベントのIDをリストにして返す
  return events.map((event) => ({
    id: String(event.id),
  }));
}

// params の型を Promise に変更します
export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {

  // params を await して展開します
  const resolvedParams = await params;
  const eventId = resolvedParams.id;

  const allEvents = await fetchEventsData()

  //  展開した eventId を使って比較します
  const event = allEvents.find(e => String(e.id) === eventId)

  if (!event) {
    notFound()
  }

export const dynamicParams = false; // 指定したID以外のページは404にする
  
  // 主催者チェック
  const isCosmoBaseEvent = event.organizer
    ? event.organizer.replace(/\s+/g, "").toLowerCase().includes("cosmobase")
    : false

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
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${isCosmoBaseEvent ? "bg-primary/20 text-primary border-primary/30" : "bg-secondary text-muted-foreground border-border/50"
              }`}>
              {isCosmoBaseEvent ? "主催イベント" : "外部イベント"}
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
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <span>{event.endDate ? `${event.date} 〜 ${event.endDate}` : event.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-accent shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            {event.capacity && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground shrink-0" />
                <span>定員: {event.capacity}</span>
              </div>
            )}
            {event.speaker && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="line-clamp-1">登壇: {event.speaker}</span>
              </div>
            )}
            {event.organizer && (
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="line-clamp-1">主催: {event.organizer}</span>
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
          <a
            href={`https://www.google.com/maps?q=${event.lat},${event.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button variant="outline" className="w-full">
              Googleマップで開く
              <MapPin className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </ContentPageLayout>
  )
}
