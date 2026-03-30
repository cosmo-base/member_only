import { ContentPageLayout } from "@/components/content-page-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const upcomingEvents = [
  { month: "4", day: "1", weekday: "水", venue: "Discordイベント用VC", content: "アルテミス計画解説" },
  { month: "4", day: "8", weekday: "水", venue: "Discordイベント用VC", content: "ニュース解説&雑談" },
  { month: "4", day: "15", weekday: "水", venue: "", content: "未定" },
  { month: "4", day: "22", weekday: "水", venue: "Discordイベント用VC", content: "H3ロケット解説" },
  { month: "4", day: "29", weekday: "水", venue: "Discordイベント用VC", content: "ニュース解説&雑談" },
]

export default function ShittokuUpcomingPage() {
  return (
    <ContentPageLayout
      title="今後のイベント"
      level={2}
      levelTitle="自分を知る"
      logo="CBshittoku"
    >
      <div className="glass-card rounded-xl p-6 mb-8">
        <p className="text-muted-foreground leading-relaxed">
          これから開催予定の「Cosmo Baseで宇宙知っトク」イベントの一覧です。<br/>
          参加希望の方は、各イベントの申込フォームからお申し込みください。
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
