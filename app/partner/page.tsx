// partner/page.tsx
import {  FileEdit,  FolderUp,  Mic,  ClipboardList,Users} from "lucide-react"
import { StarBackground } from "@/components/star-background"
import { Header } from "@/components/header"
import { AdminNotice } from "@/components/admin-notice"
import { FormCard } from "@/components/form-card"

const formCards = [
  {
    title: "パートナー情報修正",
    description: "登録済み情報の修正・更新が必要な場合はこちらから申請してください。",
    href: "/member_only/partner/update",
    icon: FileEdit,
    note: "", //
  },
  {
    title: "CBL（Cosmo Base Library）資料格納",
    description: "パートナー様の資料をCosmo Base Libraryにアップロードいただけます。",
    href: "/member_only/partner/library",
    icon: FolderUp,
    note: "", 
  },
  {
    title: "イベント登壇・イベントPR申請",
    description: "Cosmo Base主催オンラインイベントへの登壇希望やPR掲載のお申し込みはこちらから。",
    href: "/member_only/partner/event",
    icon: Mic,
    note: "", 
  },
  {
    title: "アンケート確認・市場調査内容確認依頼",
    description: "参加者に対するアンケートの確認や、参加者に対する市場調査確認のご依頼はこちらからお願いします。",
    href: "/member_only/partner/survey",
    icon: ClipboardList,
    note: "", 
  },
  {
    title: "メンバー申請",
    description: "Discordでパートナー限定チャンネルに招待いたします。こちらのフォームより申請をお願いします。",
    href: "/member_only/partner/member",
    icon: Users,
    note: "", 
  },
]

export default function PartnerDashboard() {
  return (
    <div className="min-h-screen relative">
      <StarBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-balance">
              パートナーページ
            </h1>
            <p className="text-muted-foreground text-lg">
              宇宙を、楽しむ。
            </p>
          </div>

          {/* Admin Notice */}
         {/* <div className="mb-10 max-w-4xl mx-auto">
            <AdminNotice />
          </div>*/}

          {/* Form Cards Grid */}
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              各種申請フォーム
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {formCards.map((card) => (
                <FormCard
                  key={card.title}
                  title={card.title}
                  description={card.description}
                  href={card.href}
                  icon={card.icon}
                  note={card.note}
                />
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-border/50 bg-background/80 backdrop-blur-sm py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; 2026 Cosmo Base. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              宇宙世代を共に創るパートナーの皆様へ
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
