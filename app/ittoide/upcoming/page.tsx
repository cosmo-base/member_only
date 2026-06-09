// app/ittoide/upcoming/page.tsx
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchEventsData } from "@/data/CBED"

export const dynamic = 'force-static';

export default async function IttoideUpcomingPage() {
  const allEvents = await fetchEventsData();
  
  // 今日の日付を取得（0時0分にリセット）
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  today.setHours(0, 0, 0, 0);

  // isRecommendがtrue かつ dateが存在し、今日以降のイベントを抽出
  const upcomingEvents = allEvents
    .filter(event => event.isRecommend === true && !!event.date) // ★ event.date が空でないことを保証
    .filter(event => {
      const eventDate = new Date(event.date as string); // ★ stringとして安全に変換
      // endDateがある場合はendDateを基準に、無い場合はdateを基準にする
      const eventEndDate = event.endDate ? new Date(event.endDate as string) : eventDate;
      return eventEndDate >= today;
    })
    .sort((a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime()); // 日付が近い順

  return (
    <ContentPageLayout
      title="今後のおすすめイベント"
      level={2}
      levelTitle=""
      logo="CBittoide"
    >
      <div className="glass-card rounded-xl p-6 mb-8">
        <p className="text-muted-foreground leading-relaxed">
          これから開催予定の「宇宙のイベント行っといで」おすすめイベントの一覧です。<br/>
          気になるイベントは早めにチェックして、予定を立てましょう。イベント名をクリックすると詳細が見られます。
        </p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {upcomingEvents.length > 0 ? (
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
              {upcomingEvents.map((event) => {
                // ★ ここでも as string で型を明示
                const dateObj = new Date(event.date as string);
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
                      <Link href={`/CBED/${event.id}`} className="text-primary hover:underline hover:text-primary/80 transition-colors">
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
            現在、予定されているおすすめイベントはありません。
          </div>
        )}
      </div>
    </ContentPageLayout>
  )
}
