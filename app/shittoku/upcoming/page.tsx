// app/shittoku/upcoming/page.tsx
import { ContentPageLayout } from "@/components/content-page-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchShittokuData } from "@/data/shittoku"

export const dynamic = 'force-static';

export default async function ShittokuUpcomingPage() {
  const allEvents = await fetchShittokuData();

  // 今日の日付（日本時間基準・時刻リセット）
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  today.setHours(0, 0, 0, 0);

  // 今日以降のイベント かつ 「テーマが空白でない」ものを抽出し、日付の近い順にソート
  const upcomingEvents = allEvents
    .filter(event => event.parsedDate >= today)
    .filter(event => event.theme.trim() !== "") // ★ ここを追加（テーマが空の行を表示しない）
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

  return (
    <ContentPageLayout
      title="今後のイベント"
      level={2}
      levelTitle=""
      logo="CBshittoku"
    >
      <div className="glass-card rounded-xl p-6 mb-8">
        <p className="text-muted-foreground leading-relaxed">
          これから開催予定の「Cosmo Baseで宇宙知っトク」イベントの一覧です。<br/>
          参加希望の方は、各イベントの申込フォームからお申し込みください。
        </p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {upcomingEvents.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-foreground whitespace-nowrap">月</TableHead>
                <TableHead className="text-foreground whitespace-nowrap">日</TableHead>
                <TableHead className="text-foreground whitespace-nowrap">曜日</TableHead>
                <TableHead className="text-foreground">会場</TableHead>
                <TableHead className="text-foreground">内容</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingEvents.map((event, index) => (
                <TableRow key={index} className="border-border/50 hover:bg-secondary/30">
                  <TableCell className="text-muted-foreground font-medium">{event.month}月</TableCell>
                  <TableCell className="text-muted-foreground font-medium">{event.day}日</TableCell>
                  <TableCell className="text-muted-foreground">{event.weekday || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{event.venue || "Discordイベント用VC"}</TableCell>
                  <TableCell className="text-foreground font-bold">{event.content}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-12 text-center text-muted-foreground bg-secondary/10">
            現在、確定している今後のイベントはありません。
          </div>
        )}
      </div>
    </ContentPageLayout>
  )
}