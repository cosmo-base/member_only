// src/data/ittekita.ts
import Papa from "papaparse"
import { fetchEventsData } from "./CBED" // ★ CBEDのデータ取得関数をインポート

export type IttekitaEvent = {
  id: string | number
  date: string // イベント開催日
  title: string // イベント名称
  venue: string // 会場
  url?: string
  details?: string
  photoLink?: string
  cbedId?: string; // 自動取得、または手動指定されたCBEDのイベントID
}

const CBL_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTiWVQ_iCVoOVIzzsR28wnfaWqniBFolkDs3uOn_kMcquNmiVqg1ZVV_BGjlIfsyCQlRemOXeoL4Mhw/pub?gid=0&single=true&output=csv"
const BUILD_TIMESTAMP = Date.now();

// 日付の表記揺れ（スラッシュやハイフン）を統一して比較するためのヘルパー関数
function normalizeDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.trim();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function fetchIttekitaData(): Promise<IttekitaEvent[]> {
  try {
    // 1. CBLのデータをフェッチ
    const response = await fetch(`${CBL_CSV_URL}&_t=${BUILD_TIMESTAMP}`)
    if (!response.ok) throw new Error("CBLデータの読み込みに失敗しました")
    const csvText = await response.text()

    // 2. ★ 同時にCBEDの全イベントデータも裏側で取得
    const cbedEvents = await fetchEventsData();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const events: IttekitaEvent[] = []

          for (const row of results.data as any[]) {
            if (!row.id || row.type !== "宇宙のイベント行ってきた") continue;

            const targetDate = row.eventDate || row.date;
            if (!targetDate) continue;

            const targetTitle = row.eventName || row.title || "名称未設定";
            const targetVenue = row.venue || "会場未設定";

            // ★ CBED IDの自動判定ロジック
            let finalCbedId = row.cbedId ? String(row.cbedId).trim() : "";

            // スプシ側に明示的なIDが書かれていない場合、自動でCBED内を探しに行く
            if (!finalCbedId && cbedEvents.length > 0) {
              const matchedEvent = cbedEvents.find(cbed => {
                // a. 開催日の比較（フォーマットを YYYY-MM-DD に統一して比較）
                const cbedDateNorm = normalizeDate(cbed.date || "");
                const ittekitaDateNorm = normalizeDate(targetDate);
                if (cbedDateNorm !== ittekitaDateNorm) return false;

                // b. タイトルの部分一致（「宇宙産業フォーラム」と「【FSIF】宇宙産業フォーラム」などを救済）
                const cbedTitle = (cbed.title || "").toLowerCase();
                const ittekitaTitle = targetTitle.toLowerCase();
                const isTitleMatch = cbedTitle.includes(ittekitaTitle) || ittekitaTitle.includes(cbedTitle);

                return isTitleMatch;
              });

              // 合致するイベントが見つかった場合、そのIDを自動セット
              if (matchedEvent) {
                finalCbedId = String(matchedEvent.id).trim();
              }
            }

            events.push({
              id: row.id,
              date: targetDate,
              title: targetTitle,
              venue: targetVenue,
              url: row.url || "",
              details: row.summary || "", 
              photoLink: row.photoLink || "",
              cbedId: finalCbedId // 自動、または手動で解決されたIDがここに入ります
            })
          }

          resolve(events)
        },
        error: (error: Error) => reject(error)
      })
    })
  } catch (error) {
    console.error("行ってきたデータの取得エラー:", error)
    return []
  }
}