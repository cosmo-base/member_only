// src/data/ittekita.ts
import Papa from "papaparse"

// ★ 行ってきたカレンダー用のデータ型（詳細と写真リンクを追加！）
export type IttekitaEvent = {
  id: string | number
  date: string
  title: string
  venue: string
  url?: string
  details?: string
  photoLink?: string
}

// ★ ここに新しく作ったスプレッドシートの「ウェブに公開(CSV)」のURLを貼り付けます
const ITTEKITA_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQjzMbNg3t-gYtvk_pb_d8nbO2sicsas63HkFR7-_ALOBPuy8GVULSHLZn982qR2lcYcy2XFVYFZ56x/pub?gid=0&single=true&output=csv"

export async function fetchIttekitaData(): Promise<IttekitaEvent[]> {
  try {
    const response = await fetch(ITTEKITA_CSV_URL, { cache: "no-store" })
    if (!response.ok) throw new Error("スプレッドシートの読み込みに失敗しました")
    
    const csvText = await response.text()

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          // id, date, title が入力されている行だけを抽出
          const validEvents = (results.data as any[]).filter(
            event => event.id != null && event.date != null && event.title != null
          )
          resolve(validEvents as IttekitaEvent[])
        },
        error: (error: Error) => reject(error)
      })
    })
  } catch (error) {
    console.error("行ってきたデータの取得エラー:", error)
    return []
  }
}