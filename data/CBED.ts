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
  isRecommend?: boolean; // ★ おすすめイベントかどうかのフラグ
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 2. データの取得先URLの設定
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CBED_SPREADSHEET_BASE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJU_Qq6TICMIAhDidiH2BYlBcZBvS_Uwy4wth9tT-02RYWkVP_AufdGo0PMAbAyrHKeZrE1x0laETY/pub?gid=0&single=true&output=csv";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 3. 最強のCSVパーサー（空行スキップ・セル内改行対応）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function parseCSV(csvText: string): SpaceEvent[] {
  const arr: string[][] = [];
  let quote = false;
  let col = 0, row = 0;

  for (let c = 0; c < csvText.length; c++) {
    let cc = csvText[c], nc = csvText[c + 1];
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';

    // セル内のエスケープされたダブルクォーテーション ("")
    if (cc === '"' && quote && nc === '"') {
      arr[row][col] += cc;
      ++c; 
      continue;
    }
    // ダブルクォーテーションの開閉
    if (cc === '"') {
      quote = !quote;
      continue;
    }
    // 列の区切り（カンマ）
    if (cc === ',' && !quote) {
      ++col;
      continue;
    }
    // 行の区切り（改行コード）
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

  for (let r = 1; r < arr.length; r++) {
    const rowData = arr[r];
    
    // カンマだけの行（全て空白の行）を完全にスキップ
    if (!rowData.some(val => val.trim() !== "")) continue;

    const event: any = {};
    headers.forEach((header, index) => {
      let value = rowData[index] || "";
      value = value.trim();
      
      // ★ 特殊な型の変換処理
      if (header === "lat" || header === "lng") {
        event[header] = value ? parseFloat(value) : undefined;
      } else if (header === "isRecommend") {
        // "TRUE", "true", "1" などを真偽値に変換
        event[header] = value.toUpperCase() === "TRUE" || value === "1";
      } else if (header === "isPartner") {
        event[header] = value.toUpperCase() === "TRUE" || value === "1" || value;
      } else {
        event[header] = value;
      }
    });

    // IDもタイトルも空っぽの場合は「イベントではない」と判定してスキップ
    if (!event.id && !event.title) continue;

    // IDがない場合は仮IDを振る
    if (!event.id) event.id = `fallback-${r}`;
    
    // IDの前後に誤ってスペースが入っていた場合（" 90 " など）の404対策
    event.id = String(event.id).trim();

    events.push(event as SpaceEvent);
  }

  return events;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ★ 4. データの取得処理（クリーンな本番用）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function fetchEventsData(): Promise<SpaceEvent[]> {
  try {
    // ★ 改善1: タイムスタンプを関数内に移動し、アクセスするたびに新しい値を生成（キャッシュ対策）
    const currentTimestamp = Date.now();
    const cacheBusterUrl = `${CBED_SPREADSHEET_BASE_URL}&_t=${currentTimestamp}`;
    
    // ★ 改善2: Next.jsのエッジ環境やVercelデプロイ時を考慮し、明示的にno-store（キャッシュしない）を設定
    const res = await fetch(cacheBusterUrl, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error(`CBEDデータの取得に失敗: HTTP ${res.status}`);
    }

    const text = await res.text();
    
    // ★ 改善3: エンドポイントがCSV固定のため、無駄なJSON.parseのtry-catchを廃止して直接パース
    const parsedEvents = parseCSV(text);

    // ターミナルで無事に読み込めたか確認するための安心ログ
    console.log(`✅ CBED.ts: スプレッドシートから ${parsedEvents.length} 件のイベントを読み込みました！`);

    return parsedEvents;
    
  } catch (error) {
    console.error("CBED fetch error:", error);
    return []; // エラー時は空配列を返してアプリのクラッシュを防ぐ
  }
}
