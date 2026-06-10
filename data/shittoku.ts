// data/shittoku.ts

export interface ShittokuEvent {
  month: string;
  day: string;
  weekday: string;
  venue: string;
  content: string;
  theme: string; // ★ テーマの判定用に追加
  parsedDate: Date; // 自動ソート・未来過去判定用のDate型
}

// 🆕 ご提供いただいた「宇宙知っトク」専用の独立スプレッドシートURL
const SHITTOKU_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLLj6DB0iMVlhvHqUbfQhAhE7JEl5cps2zkE-WG-P2Vr-YiJWhdaOqO2QCzsXR-fjKFV1P44-0n7l3/pub?gid=0&single=true&output=csv";

// ビルド単位でキャッシュを強制的に破壊するタイムスタンプ
const BUILD_TIMESTAMP = Date.now();

function parseShittokuCSV(csvText: string): ShittokuEvent[] {
  const arr: string[][] = [];
  let quote = false;
  let col = 0, row = 0;

  for (let c = 0; c < csvText.length; c++) {
    let cc = csvText[c], nc = csvText[c + 1];
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || '';

    if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; ++c; continue; }
    if (cc === '"') { quote = !quote; continue; }
    if (cc === ',' && !quote) { ++col; continue; }
    if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue; }
    if (cc === '\n' && !quote) { ++row; col = 0; continue; }
    if (cc === '\r' && !quote) { ++row; col = 0; continue; }
    arr[row][col] += cc;
  }

  // 変則構造（1行目セクション、2行目ヘッダー、3行目補足、4行目データ）の最低行数チェック
  if (arr.length < 4) return [];

  const headers = arr[1].map(h => h.trim()); // ★ 2行目から正確に列名ヘッダーを抽出
  const events: ShittokuEvent[] = [];
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

  // ★ 4行目（インデックス 3）から実際のデータを処理
  for (let r = 3; r < arr.length; r++) {
    const rowData = arr[r];
    if (!rowData.some(val => val.trim() !== "")) continue;

    const rowObj: any = {};
    headers.forEach((header, index) => {
      if (header) {
        rowObj[header] = (rowData[index] || "").trim();
      }
    });

    const kaisaiDateStr = rowObj["開催日"];
    if (!kaisaiDateStr) continue;

    const parsedDate = new Date(kaisaiDateStr);
    if (isNaN(parsedDate.getTime())) continue;

    // 日付オブジェクトからカレンダーに必要な要素を自動抽出
    const month = String(parsedDate.getMonth() + 1);
    const day = String(parsedDate.getDate());
    const weekday = weekdays[parsedDate.getDay()];

    const meisho = rowObj["名称"] || "";
    const tema = rowObj["テーマ"] || "";
    const keishiki = rowObj["形式"] || "";

    // 💡 形式（ keishiki ）を元に会場をスマートに自動マッピング
    let venue = "Discordイベント用VC";
    if (keishiki === "講演・講座") {
      venue = "オンライン(Zoom等)";
    }

    // 💡 名称とテーマを美しくマージした内容（ content ）を自動生成
    let content = "";
    if (meisho && tema) {
      content = `${meisho} 「${tema}」`;
    } else {
      content = tema || meisho || "内容未定";
    }

    events.push({
      month,
      day,
      weekday,
      venue,
      content,
      theme: tema, // ★ 追加: 判定用にテーマの文字列をそのまま持たせる
      parsedDate
    });
  }

  return events;
}

export async function fetchShittokuData(): Promise<ShittokuEvent[]> {
  try {
    const cacheBusterUrl = `${SHITTOKU_CSV_URL}&_t=${BUILD_TIMESTAMP}`;
    const res = await fetch(cacheBusterUrl);

    if (!res.ok) throw new Error(`知っトクデータの取得に失敗: HTTP ${res.status}`);

    const text = await res.text();
    const parsed = parseShittokuCSV(text);
    
    console.log(`✅ shittoku.ts: 変則スプレッドシートから ${parsed.length} 件の知っトクイベントを完璧にパースしました！`);
    return parsed;
  } catch (error) {
    console.error("Shittoku fetch error:", error);
    return [];
  }
}