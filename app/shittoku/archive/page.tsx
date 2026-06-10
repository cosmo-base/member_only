// app/shittoku/archive/page.tsx
import { ContentPageLayout } from "@/components/content-page-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchShittokuData } from "@/data/shittoku"

export const dynamic = 'force-static';

export default async function ShittokuArchivePage() {
  const allEvents = await fetchShittokuData();

  // 今日の日付（日本時間基準・時刻リセット）
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  today.setHours(0, 0, 0, 0);

  // 昨日以前の過去イベントを抽出し、新しい順にソート
  const pastEvents = allEvents
    .filter(event => event.parsedDate < today)
    .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime());

  return (
    <ContentPageLayout
      title="過去イベント一覧"
      level={2}
      levelTitle=""
      logo="CBshittoku"
    >
      <div className="glass-card rounded-xl p-6 mb-8">
        <p className="text-muted-foreground leading-relaxed">
          これまでに開催された「Cosmo Baseで宇宙知っトク」イベントの一覧です。<br/>
          各イベントの録画アーカイブは、参加者限定で視聴できます。
        </p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {pastEvents.length > 0 ? (
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
              {pastEvents.map((event, index) => (
                <TableRow key={index} className="border-border/50 hover:bg-secondary/30">
                  <TableCell className="text-muted-foreground font-medium">{event.month}月</TableCell>
                  <TableCell className="text-muted-foreground font-medium">{event.day}日</TableCell>
                  <TableCell className="text-muted-foreground">{event.weekday || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{event.venue || "オンライン"}</TableCell>
                  <TableCell className="text-foreground font-medium">{event.content}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-12 text-center text-muted-foreground bg-secondary/10">
            過去のイベントアーカイブデータはありません。
          </div>
        )}
      </div>
    </ContentPageLayout>
  )
}