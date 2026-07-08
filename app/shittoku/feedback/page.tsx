// app/shittoku/feedback/page.tsx
import type { Metadata } from "next"
import { fetchShittokuData } from "@/data/shittoku"
import { ShittokuFeedbackClient } from "./_components/feedback-client"

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "アンケート | Cosmo Baseで宇宙知っトク",
}

export default async function ShittokuFeedbackPage() {
  const allEvents = await fetchShittokuData();

  const recentEvents = allEvents
    .filter(event => event.participantsCount > 0)
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())
    .map(event => {
      // "Cosmo Baseで宇宙知っトク#001(4/1)" のようなラジオボタン用テキストを生成
      return `${event.content}(${event.month}/${event.day})`;
    });

  // 万が一該当イベントがまだ1件もない場合のセーフティフォールバック
  if (recentEvents.length === 0) {
    recentEvents.push("アンケート対象のイベントがありません");
  }

  return <ShittokuFeedbackClient recentEventNames={recentEvents} />
}
