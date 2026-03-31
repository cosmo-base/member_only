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
// ★ 2. データの取得処理
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ※「ここにGASのURL」の部分は、今まで使っていたURLをそのまま貼り付けてください。
// もし環境変数 (.env) に入れている場合は、 process.env.NEXT_PUBLIC_XXX のままでOKです。
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJU_Qq6TICMIAhDidiH2BYlBcZBvS_Uwy4wth9tT-02RYWkVP_AufdGo0PMAbAyrHKeZrE1x0laETY/pub?gid=0&single=true&output=csv"

export async function fetchEventsData(): Promise<SpaceEvent[]> {
  try {
    const response = await fetch(SPREADSHEET_API_URL, {
      // 必要に応じてキャッシュの設定をしてください（例: { revalidate: 3600 } で1時間ごとに更新）
      next: { revalidate: 60 }, // 1分キャッシュ（テスト用に短め）
    });

    if (!response.ok) {
      throw new Error("イベントデータの取得に失敗しました");
    }

    const data = await response.json();
    
    // 取得したデータをSpaceEventの配列として返す
    return data as SpaceEvent[];
    
  } catch (error) {
    console.error("CBED fetch error:", error);
    return []; // エラー時は空の配列を返してアプリがクラッシュするのを防ぐ
  }
}
