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
// ★ 3. 最強のCSVパーサー（空行スキップ機能を搭載）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function parseCSV(csvText: string): SpaceEvent[] {
  const arr: string[][] = [];
  let quote = false;
  let col = 0, row = 0;

  for (let c = 0; c < csvText.length; c++) {
    let cc = csvText[c], nc = csvText[c + 1];
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';

    if (cc === '"' && quote && nc === '"') {
      arr[row][col] += cc;
      ++c; 
      continue;
    }
    if (cc === '"') {
      quote = !quote;
      continue;
    }
    if (cc === ',' && !quote) {
      ++col;
      continue;
    }
    if (cc === '\r' && nc === '\n' && !quote) {
      ++row; col = 0; ++c; continue;
    }
    if (cc === '\n' && !quote) {
      ++row; col = 0; continue;
    }
    if (cc === '\r' && !quote) {
      ++row; col = 0; continue;
    }

    arr[row][col] += cc;
  }

  if (arr.length < 2) return [];

  const headers = arr[0].map(h => h.trim());
  const events: SpaceEvent[] = [];

  for (let r = 1; r < arr.length; r++) {
    const rowData = arr[r];
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ★ 修正箇所：カンマだけの行（全て空白の行）を完全にスキップ！
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (!rowData.some(val => val.trim() !== "")) continue;

    const event: any = {};
    headers.forEach((header, index) => {
      let value = rowData[index] || "";
      value = value.trim();
      
      if (header === "lat" || header === "lng") {
        event[header] = value ? parseFloat(value) : undefined;
      } else {
        event[header] = value;
      }
    });

    // ★ 修正箇所：IDもタイトルも空っぽの場合は「イベントではない」と判定してスキップ
    if (!event.id && !event.title) continue;

    // IDがない場合は仮IDを振るが、基本的にはスプシのIDを使用する
    if (!event.id) event.id = `fallback-${r}`;
    
    // ★ 修正箇所：IDの前後に誤ってスペースが入っていた場合（" 90 " など）に404になるのを防ぐ
    event.id = String(event.id).trim();

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
      return parseCSV(text);
    }
    
  } catch (error) {
    console.error("CBED fetch error:", error);
    return [];
  }
}
