// app/shittoku/feedback/page.tsx
import { fetchShittokuData } from "@/data/shittoku"
import { ShittokuFeedbackClient as ShittokuFeedbackClient } from "./feedback-client"

export const dynamic = 'force-static';

export default async function ShittokuSurveyPage() {
  const allEvents = await fetchShittokuData();

  // 現在時刻と、1ヶ月前の時刻を取得
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  today.setHours(23, 59, 59, 999); // 今日の終わりまで

  // 1. 過去1ヶ月以内である
  // 2. 「参加者数」などから実際に開催されたか（または参加者がいたか）を判定
  // ※スプシの「CB参加者」に該当する判定が `shittoku.ts` に無い場合は、単純に過去1ヶ月の全イベントを表示します。
  // 今回は「過去1ヶ月の過去イベント」を抽出します。
  const recentEvents = allEvents
    .filter(event => {
      return event.parsedDate >= oneMonthAgo && event.parsedDate <= today;
    })
    .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime()) // 新しい順
    .map(event => {
      // "Cosmo Baseで宇宙知っトク#002(4/8)" のような形式に整形
      return `${event.content}(${event.month}/${event.day})`;
    });

  // 万が一イベントが0件だった場合のフォールバック
  if (recentEvents.length === 0) {
    recentEvents.push("最近のイベントがありません");
  }

  return <ShittokuFeedbackClient recentEventNames={recentEvents} />
}