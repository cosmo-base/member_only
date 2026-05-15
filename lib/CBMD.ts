// lib/CBMD.ts
import { fetchEventsData, SpaceEvent } from "@/data/CBED"

export interface Facility {
  id: string
  name: string
  nameKana: string
  category: string
  prefecture: string
  region: string
  city: string
  address: string
  description: string
  image: string
  tags: string[]
  hasPlanetarium: boolean
  hasEvent: boolean
  openingHours: string
  closedDays: string
  admissionFee: string
  access: string
  website?: string
  twitter?: string
  instagram?: string
  youtube?: string
  events?: SpaceEvent[]
  updatedAt: string
}

const CBMD_SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDvzMbN9CNa_PXwmre1IFid8fw7rD2yG0IlBnifsjtrtDN0cy3n-nQlEFvKQbE4w06TXTHoZ4edpzj/pub?gid=0&single=true&output=csv&v=1";

export const facilityTypes = ["科学館", "博物館", "美術館", "JAXA関連施設", "大学展示", "プラネタリウム", "天文台", "イベント施設"]
export const spacecraftTags = ["はやぶさ", "はやぶさ2", "MMX", "H3ロケット", "ISS", "イプシロン", "SLIM", "かぐや", "あかつき", "HTV"]
export const categoryTags = ["月", "火星", "小惑星", "木星", "土星", "太陽系外", "ブラックホール", "銀河"]
export const regions = [
  { name: "北海道", prefectures: ["北海道"] },
  { name: "東北", prefectures: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"] },
  { name: "関東", prefectures: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"] },
  { name: "中部", prefectures: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"] },
  { name: "近畿", prefectures: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"] },
  { name: "中国", prefectures: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"] },
  { name: "四国", prefectures: ["徳島県", "香川県", "愛媛県", "高知県"] },
  { name: "九州・沖縄", prefectures: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"] },
]

function parseFacilityCSV(csvText: string): any[] {
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
  if (arr.length < 2) return [];
  const headers = arr[0].map(h => h.trim());
  const facilities: any[] = [];
  for (let r = 1; r < arr.length; r++) {
    const rowData = arr[r];
    if (!rowData.some(val => val.trim() !== "")) continue;
    const item: any = {};
    headers.forEach((header, index) => {
      item[header] = (rowData[index] || "").trim();
    });
    if (item.id) facilities.push(item);
  }
  return facilities;
}

export async function fetchFacilitiesData(): Promise<Facility[]> {
  try {
    const [facilitiesRes, allEvents] = await Promise.all([
      fetch(CBMD_SPREADSHEET_URL, { next: { revalidate: 60 } }),
      fetchEventsData()
    ]);

    if (!facilitiesRes.ok) throw new Error("CBMDデータの取得に失敗");
    
    const text = await facilitiesRes.text();
    const rawFacilities = parseFacilityCSV(text);

    return rawFacilities.map(raw => {
      const relatedEvents = allEvents.filter(event => 
        event.location && event.location.includes(raw.name)
      );

      return {
        id: String(raw.id),
        name: String(raw.name),
        nameKana: String(raw.nameKana || ""),
        category: String(raw.category || ""),
        prefecture: String(raw.prefecture || ""),
        region: String(raw.region || ""),
        city: String(raw.city || ""),
        address: String(raw.address || ""),
        description: String(raw.description || ""),
        image: String(raw.image || "/images/placeholder.jpg"),
        tags: raw.tags ? String(raw.tags).split(',').map(t => t.trim()).filter(Boolean) : [],
        hasPlanetarium: String(raw.hasPlanetarium).toUpperCase() === "TRUE",
        hasEvent: relatedEvents.length > 0, 
        openingHours: String(raw.openingHours || ""),
        closedDays: String(raw.closedDays || ""),
        admissionFee: String(raw.admissionFee || ""),
        access: String(raw.access || ""),
        website: raw.website || undefined,
        twitter: raw.twitter || undefined,
        instagram: raw.instagram || undefined,
        youtube: raw.youtube || undefined,
        events: relatedEvents,
        updatedAt: String(raw.updatedAt || ""),
      } as Facility;
    });
  } catch (error) {
    console.error("CBMD fetch error:", error);
    return [];
  }
}
