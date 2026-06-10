// app/shittoku/feedback/page.tsx
import { fetchShittokuData } from "@/data/shittoku"
import { ShittokuFeedbackClient } from "./feedback-client"

export const dynamic = 'force-static';

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