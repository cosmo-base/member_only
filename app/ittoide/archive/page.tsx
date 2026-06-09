// app/ittoide/archive/page.tsx
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchEventsData } from "@/data/CBED"

export const dynamic = 'force-static';

export default async function IttoideArchivePage() {
  const allEvents = await fetchEventsData();
  
  // 今日の日付を取得（0時0分にリセット）
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  today.setHours(0, 0, 0, 0);

  // isRecommendがtrue かつ、昨日以前に終了したイベントを抽出
  const pastEvents = allEvents
    .filter(event => event.isRecommend === true)
    .filter(event => {
      const eventDate = new Date(event.date);
      const eventEndDate = event.endDate ? new Date(event.endDate) : eventDate;
      return eventEndDate < today;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 新しい順（降順）

  return (
    <ContentPageLayout
      title="過去おすすめイベント一覧"
      level={2}
      levelTitle=""
      logo="CBittoide"
    >
      <div className="glass-card rounded-xl p-6 mb-8">
        <p className="text-muted-foreground leading-relaxed">
          これまでに紹介した「宇宙のイベント行っといで」おすすめイベントの一覧です。<br/>
          過去のイベント情報を参考に、次回の開催をチェックしてみてください。イベント名から当時の詳細ページを見ることができます。
        </p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {pastEvents.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-foreground whitespace-nowrap">日付</TableHead>
                <TableHead className="text-foreground whitespace-nowrap">時間</TableHead>
                <TableHead className="text-foreground whitespace-nowrap">会場</TableHead>
                <TableHead className="text-foreground">イベント内容</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastEvents.map((event) => {
                const dateObj = new Date(event.date);
                const month = dateObj.getMonth() + 1;
                const day = dateObj.getDate();
                const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
                const weekday = weekdays[dateObj.getDay()];

                return (
                  <TableRow key={event.id} className="border-border/50 hover:bg-secondary/30">
                    <TableCell className="text-muted-foreground font-medium whitespace-nowrap">
                      {month}月{day}日 ({weekday})
                      {event.endDate && event.endDate !== event.date && (
                        <span className="text-xs ml-1">〜</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">{event.time || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{event.location || "-"}</TableCell>
                    <TableCell className="text-foreground font-bold">
                      <Link href={`/CBED/${event.id}`} className="text-muted-foreground hover:underline hover:text-primary transition-colors">
                        {event.title}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            過去のおすすめイベントデータがありません。
          </div>
        )}
      </div>
    </ContentPageLayout>
  )
}
