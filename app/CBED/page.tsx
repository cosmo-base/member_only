import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { Button } from "@/components/ui/button"
import { Database, Map, Calendar, Filter, PlusCircle } from "lucide-react"

export default function EventsPage() {
  return (
    <ContentPageLayout
      title="Cosmo Base Event Database"
      level={4}
      levelTitle="体系化"
      logo="CBED"
    >
      {/* Hero Section */}
      <div className="glass-card rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/20">
            <Database className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              全国の宇宙イベント一覧
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              <p>
                日本全国で開催される宇宙関連イベントを網羅したデータベースです。
                プラネタリウム、科学館、天文台のイベントから、
                企業や大学主催の講演会まで幅広く掲載しています。
              </p>
              <p>
                地図検索では、現在地やお住まいの地域から近いイベントを簡単に見つけられます。
                カレンダー検索では、行きたい日程に開催されるイベントを確認できます。
                詳細検索では、カテゴリ（観望会、講演会、ワークショップなど）、
                参加費（無料/有料）、対象年齢などで絞り込みが可能です。
              </p>
              <p>
                イベント主催者の方は、イベント登録フォームからイベント情報を登録できます。
                登録されたイベントは審査後に掲載され、多くの宇宙ファンに届きます。
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                掲載されているイベントの内容は予告なく変更・中止される場合があります。
                また、当サイトに掲載されたイベントへの参加によって生じたいかなるトラブルや損害等についても、Cosmo Base運営では一切の責任を負いかねます。
                ご参加にあたってはご自身の判断と責任において、必ず主催者の公式情報をご確認ください。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Map className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">地図で探す</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            日本地図上でイベントを探せます。<br />
            お近くのイベントを見つけましょう。
          </p>
          <Link href="/CBED/map">
            <Button variant="outline" className="w-full">
              地図で探す
            </Button>
          </Link>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">カレンダーで探す</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            月間カレンダーでイベントをチェック。<br />
            スケジュール管理に便利です。
          </p>
          <a href="https://fsifofficial.github.io/CosmoBase/events">
            <Button variant="outline" className="w-full">
              カレンダーで探す
            </Button>
          </a>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">詳細検索</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            日付、エリア、カテゴリ、参加費など<br />様々な条件で絞り込み検索。
          </p>
          <Link href="/CBED/search">
            <Button variant="outline" className="w-full">
              詳細検索
            </Button>
          </Link>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <PlusCircle className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">イベント登録</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            イベント主催者の方はこちらから<br />
            イベント情報を登録できます。
          </p>
          <Link href="/CBED/register">
            <Button variant="outline" className="w-full">
              イベント登録
            </Button>
          </Link>
        </div>
      </div>
    </ContentPageLayout>
  )
}
