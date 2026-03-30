import { ContentPageLayout } from "@/components/content-page-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const pastEvents = [
  { month: "3", day: "15", weekday: "水", venue: "オンライン", content: "火星探査の最前線 - マーズローバーが見た世界" },
]

export default function ShittokuArchivePage() {
  return (
    <ContentPageLayout
      title="過去イベント一覧"
      level={2}
      levelTitle="自分を知る"
      logo="CBshittoku"
    >
      <div className="glass-card rounded-xl p-6 mb-8">
        <p className="text-muted-foreground leading-relaxed">
          これまでに開催された「Cosmo Baseで宇宙知っトク」イベントの一覧です。
          各イベントの録画アーカイブは、参加者限定で視聴できます。
        </p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="text-foreground">月</TableHead>
              <TableHead className="text-foreground">日</TableHead>
              <TableHead className="text-foreground">曜日</TableHead>
              <TableHead className="text-foreground">会場</TableHead>
              <TableHead className="text-foreground">内容</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pastEvents.map((event, index) => (
              <TableRow key={index} className="border-border/50 hover:bg-secondary/30">
                <TableCell className="text-muted-foreground">{event.month}月</TableCell>
                <TableCell className="text-muted-foreground">{event.day}日</TableCell>
                <TableCell className="text-muted-foreground">{event.weekday}</TableCell>
                <TableCell className="text-muted-foreground">{event.venue}</TableCell>
                <TableCell className="text-foreground">{event.content}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentPageLayout>
  )
}
