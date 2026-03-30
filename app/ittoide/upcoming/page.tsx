import { ContentPageLayout } from "@/components/content-page-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const upcomingEvents = [
  { month: "", day: "", weekday: "", venue: "", content: "" },
]

export default function IttoideUpcomingPage() {
  return (
    <ContentPageLayout
      title="今後のおすすめイベント"
      level={3}
      levelTitle="リアル体験"
      logo="CBittoide"
    >
      <div className="glass-card rounded-xl p-6 mb-8">
        <p className="text-muted-foreground leading-relaxed">
          これから開催予定の「宇宙のイベント行っといで」おすすめイベントの一覧です。
          気になるイベントは早めにチェックして、予定を立てましょう。
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
            {upcomingEvents.map((event, index) => (
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
