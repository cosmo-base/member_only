// src/data/ittekita.ts
import Papa from "papaparse"

export type IttekitaEvent = {
  id: string | number
  date: string
  title: string
  venue: string
  url?: string
  details?: string
  photoLink?: string
  cbedId?: string; // スプレッドシートの cbedId 列から手入力
}

const CBL_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTiWVQ_iCVoOVIzzsR28wnfaWqniBFolkDs3uOn_kMcquNmiVqg1ZVV_BGjlIfsyCQlRemOXeoL4Mhw/pub?gid=0&single=true&output=csv"
const BUILD_TIMESTAMP = Date.now();

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchIttekitaData(): Promise<IttekitaEvent[]> {
  try {
    const response = await fetchWithTimeout(`${CBL_CSV_URL}&_t=${BUILD_TIMESTAMP}`, 25000)
    if (!response.ok) throw new Error("CBLデータの読み込みに失敗しました")
    const csvText = await response.text()

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

            events.push({
              id: row.id,
              date: targetDate,
              title: row.eventName || row.title || "名称未設定",
              venue: row.venue || "会場未設定",
              url: row.url || "",
              details: row.summary || "",
              photoLink: row.photoLink || "",
              cbedId: row.cbedId ? String(row.cbedId).trim() : undefined,
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
