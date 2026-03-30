import { ContentPageLayout } from "@/components/content-page-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const pastEvents = [
  { month: "", day: "", weekday: "", venue: "", content: "" },
]

export default function IttoideArchivePage() {
  return (
    <ContentPageLayout
      title="過去おすすめイベント一覧"
      level={3}
      levelTitle="リアル体験"
      logo="CBittoide"
    >
      <div className="glass-card rounded-xl p-6 mb-8">
        <p className="text-muted-foreground leading-relaxed">
          これまでに紹介した「宇宙のイベント行っといで」おすすめイベントの一覧です。
          過去のイベント情報を参考に、次回の開催をチェックしてみてください。
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
