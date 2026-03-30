import Papa from "papaparse"

export type SpaceEvent = {
  id: string | number
  title: string
  date: string       // yyyy-mm-dd
  endDate?: string
  time: string       // xx:xx - yy:yy
  location: string   // イベント会場
  lat: number        // 地図に必須！
  lng: number        // 地図に必須！
  type: string       // イベント形式
  difficulty: string // 対象者のレベル
  capacity?: string | number // 定員（空欄OK）
  description?: string       // 詳細説明（空欄OK）
  speaker?: string           // 登壇者（空欄OK）
  organizer?: string         // 主催団体名（空欄OK）
  link?: string              // 申込リンク（空欄OK）
}

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJU_Qq6TICMIAhDidiH2BYlBcZBvS_Uwy4wth9tT-02RYWkVP_AufdGo0PMAbAyrHKeZrE1x0laETY/pub?gid=0&single=true&output=csv"

export async function fetchEventsData(): Promise<SpaceEvent[]> {
  try {
    const response = await fetch(SHEET_CSV_URL, { cache: "no-store" })
    if (!response.ok) throw new Error("スプレッドシートの読み込みに失敗しました")

    const csvText = await response.text()

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validEvents = (results.data as any[]).filter(
            event => event.id != null && event.title != null
          )
          resolve(validEvents as SpaceEvent[])
        },
        error: (error: Error) => reject(error)
      })
    })
  } catch (error) {
    console.error("イベントデータの取得エラー:", error)
    return []
  }
}