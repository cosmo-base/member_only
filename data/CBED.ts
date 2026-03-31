// data/CBED.ts

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 1. イベントデータの型定義
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface SpaceEvent {
  id: string | number;
  title?: string;
  date?: string;
  endDate?: string;
  time?: string;
  location?: string;
  type?: string;
  difficulty?: string;
  organizer?: string;
  isPartner?: boolean | string; 
  capacity?: string | number;
  speaker?: string;
  description?: string;
  link?: string;
  lat?: number;
  lng?: number;
}
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 4. データの取得処理（クリーン版・完成形！）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function fetchEventsData(): Promise<SpaceEvent[]> {
  try {
    const response = await fetch(SPREADSHEET_API_URL, {
      next: { revalidate: 60 }, 
    });

    if (!response.ok) {
      throw new Error("イベントデータの取得に失敗しました");
    }

    const text = await response.text();
    let parsedEvents: SpaceEvent[] = [];
    
    try {
      parsedEvents = JSON.parse(text) as SpaceEvent[];
    } catch (e) {
      parsedEvents = parseCSV(text);
    }
    console.log(`✅ 読み込んだ全イベント数: ${parsedEvents.length}件`);

    return parsedEvents;
    
  } catch (error) {
    console.error("CBED fetch error:", error);
    return [];
  }
}
