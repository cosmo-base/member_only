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
// ※教えていただいたCSV公開用URLを直接セットしました！
const SPREADSHEET_API_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJU_Qq6TICMIAhDidiH2BYlBcZBvS_Uwy4wth9tT-02RYWkVP_AufdGo0PMAbAyrHKeZrE1x0laETY/pub?gid=0&single=true&output=csv";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 3. 超・強化版 CSVパーサー（セル内の改行に完全対応！）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function parseCSV(csvText: string): SpaceEvent[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = "";
  let inQuotes = false;

  // 1文字ずつ読み込んで、セル内の改行と本物の改行を見分ける
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // セル内の「"」はエスケープとして処理
        currentVal += '"';
        i++; // 次の " をスキップ
      } else {
        // ダブルクォーテーションの開閉
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // カンマで列を区切る
      currentRow.push(currentVal);
      currentVal = "";
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // ダブルクォーテーションの外（＝本物の行の終わり）
      if (char === '\r' && nextChar === '\n') {
        i++; // \r\n の場合は \n をスキップ
      }
      currentRow.push(currentVal);
      rows.push(currentRow);
      currentRow = [];
      currentVal = "";
    } else {
      // 普通の文字を連結
      currentVal += char;
    }
  }
  
  // 最後の行の端数を追加
  if (currentVal !== "" || currentRow.length > 0) {
    currentRow.push(currentVal);
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.trim());
  const events: SpaceEvent[] = [];

  // 2行目以降をデータとして処理
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    // 空行はスキップ
    if (row.length === 1 && row[0].trim() === "") continue;

    const event: any = {};
    headers.forEach((header, index) => {
      let value = row[index] || "";
      // 余白は消しつつ、セル内の改行はそのまま残す
      value = value.trim();
      
      if (header === "lat" || header === "lng") {
        event[header] = value ? parseFloat(value) : undefined;
      } else {
        event[header] = value;
      }
    });

    // ★ 安全装置：万が一 id が空欄だった場合、ビルドが落ちないように行番号をIDにする
    if (!event.id) {
      event.id = `fallback-id-${r}`;
    }
    
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
      // JSON形式の可能性も考慮（念のため）
      return JSON.parse(text) as SpaceEvent[];
    } catch (e) {
      // JSONじゃなければCSVとして強力パース処理へ
      return parseCSV(text);
    }
    
  } catch (error) {
    console.error("CBED fetch error:", error);
    return [];
  }
}
