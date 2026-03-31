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
// ★ 2. データの取得先URLの設定
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SPREADSHEET_API_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJU_Qq6TICMIAhDidiH2BYlBcZBvS_Uwy4wth9tT-02RYWkVP_AufdGo0PMAbAyrHKeZrE1x0laETY/pub?gid=0&single=true&output=csv";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 3. 最強のCSVパーサー（セル内の改行・カンマに完全対応！）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function parseCSV(csvText: string): SpaceEvent[] {
  const arr: string[][] = [];
  let quote = false;
  let col = 0, row = 0;

  // 1文字ずつ順番に読み込んで、正確に列と行を振り分ける
  for (let c = 0; c < csvText.length; c++) {
    let cc = csvText[c], nc = csvText[c + 1];
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';

    // セル内のエスケープされたダブルクォーテーション ("")
    if (cc === '"' && quote && nc === '"') {
      arr[row][col] += cc;
      ++c; // 次の " をスキップ
      continue;
    }

    // ダブルクォーテーションの開閉
    if (cc === '"') {
      quote = !quote;
      continue;
    }

    // 文字列の外にあるカンマ ＝ 次の列へ
    if (cc === ',' && !quote) {
      ++col;
      continue;
    }

    // 文字列の外にある改行 ＝ 次の行へ
    if (cc === '\r' && nc === '\n' && !quote) {
      ++row; col = 0; ++c; continue;
    }
    if (cc === '\n' && !quote) {
      ++row; col = 0; continue;
    }
    if (cc === '\r' && !quote) {
      ++row; col = 0; continue;
    }

    // 通常の文字を追加
    arr[row][col] += cc;
  }

  if (arr.length < 2) return [];

  const headers = arr[0].map(h => h.trim());
  const events: SpaceEvent[] = [];

  // 2行目以降をデータとして組み立て
  for (let r = 1; r < arr.length; r++) {
    const rowData = arr[r];
    // 完全に空っぽの行はスキップ
    if (rowData.length === 1 && rowData[0].trim() === "") continue;

    const event: any = {};
    headers.forEach((header, index) => {
      let value = rowData[index] || "";
      // 前後の不要な空白だけ消す（セル内の改行はそのまま残る）
      value = value.trim();
      
      if (header === "lat" || header === "lng") {
        event[header] = value ? parseFloat(value) : undefined;
      } else {
        event[header] = value;
      }
    });

    // IDが空欄だった場合の安全装置
    if (!event.id) event.id = `fallback-${r}`;
    
    events.push(event as SpaceEvent);
  }

  return events;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 4. データの取得処理
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
    
    try {
      return JSON.parse(text) as SpaceEvent[];
    } catch (e) {
      // 完璧にCSVを解析する！
      return parseCSV(text);
    }
    
  } catch (error) {
    console.error("CBED fetch error:", error);
    return [];
  }
}
