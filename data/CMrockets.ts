// data/CMrockets.ts
import Papa from 'papaparse';

export interface RocketStats {
  power: number;
  technology: number;
  history: number;
  ace: number;
  challenge: number;
  individuality: number;
  future: number;
  trust: number;
}

export interface Rocket {
  slug: string;
  name: string;
  reading: string;
  emoji: string;
  catchCopy: string;
  intro: string;
  country: string;
  status: "active" | "retired" | "development";
  category: string;
  appearance: number;
  stats: RocketStats;
  highlights: string[];
  story: {
    origin: string;
    struggle: string;
    today: string;
  };
  relatedRockets: string[];
  articleLinks: { title: string; url: string }[];
}

export interface Choice {
  text: string;
  score: Partial<RocketStats>;
}

export interface Question {
  id: number;
  title: string;
  choices: Choice[];
}

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQENBPEZ3ep1J54G09l7I-vPMaMC6wNxr55bXBsdAdj_xp6gy5ksoM27EyITCuGObi0Kzxbzu2HpLM1/pub?gid=0&single=true&output=csv";

function parseStatus(val: string): "active" | "retired" | "development" {
  if (!val) return "retired";
  if (val.includes("現役") || val.includes("運用中")) return "active";
  if (val.includes("開発中") || val.includes("計画")) return "development";
  return "retired";
}

export async function getRockets(): Promise<Rocket[]> {
  try {
    const res = await fetch(CSV_URL, { cache: 'no-store' });
    const csvText = await res.text();

    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim(),
        complete: (results) => {
          const rows = results.data as Record<string, string>[];

          const rockets: Rocket[] = rows
            .filter((row) => row['ロケット名']?.trim())
            .map((row) => {
              const reading = row['読み方']?.trim() || '';
              const slug = row['id']?.trim() || reading || row['ロケット名']?.trim() || '';

              const links: { title: string; url: string }[] = [];
              if (row['公式ページ']?.trim())
                links.push({ title: '公式ページ', url: row['公式ページ'].trim() });
              if (row['参考サイト①']?.trim())
                links.push({ title: '参考サイト①', url: row['参考サイト①'].trim() });
              if (row['参考サイト②']?.trim())
                links.push({ title: '参考サイト②', url: row['参考サイト②'].trim() });
              if (row['参考サイト③']?.trim())
                links.push({ title: '参考サイト③', url: row['参考サイト③'].trim() });

              return {
                slug,
                name: row['ロケット名']?.trim() || '',
                reading,
                emoji: '🚀',
                catchCopy: row['キャッチコピー']?.trim() || '',
                intro: row['一言紹介']?.trim() || '',
                country: row['国']?.trim() || '',
                status: parseStatus(row['現役/退役'] || ''),
                category: row['分類']?.trim() || '',
                appearance: parseFloat(row['出現係数'] || '1') || 1,
                stats: {
                  power:         parseInt(row['パワー']       || '0', 10) || 0,
                  technology:    parseInt(row['技術']         || '0', 10) || 0,
                  history:       parseInt(row['歴史']         || '0', 10) || 0,
                  ace:           parseInt(row['エース']       || '0', 10) || 0,
                  challenge:     parseInt(row['挑戦']         || '0', 10) || 0,
                  individuality: parseInt(row['個性']         || '0', 10) || 0,
                  future:        parseInt(row['未来']         || '0', 10) || 0,
                  trust:         parseInt(row['信頼（現在）'] || '0', 10) || 0,
                },
                highlights: [
                  row['推しポイント1'],
                  row['推しポイント2'],
                  row['推しポイント3'],
                ].map((s) => s?.trim() || '').filter(Boolean),
                story: {
                  origin:   row['誕生の背景']?.trim() || '',
                  struggle: row['苦労したこと/課題']?.trim() || '',
                  today:    row['象徴するエピソード']?.trim() || row['一言紹介']?.trim() || '',
                },
                relatedRockets: [],
                articleLinks: links,
              } as Rocket;
            });

          const nameToSlug = new Map<string, string>();
          rockets.forEach((r) => nameToSlug.set(r.name, r.slug));

          const rowMap = new Map<string, Record<string, string>>();
          rows.forEach((row) => {
            const name = row['ロケット名']?.trim();
            if (name) rowMap.set(name, row);
          });

          rockets.forEach((r) => {
            const row = rowMap.get(r.name);
            if (!row) return;
            const related: string[] = [];
            [row['前世代ロケット'], row['後継ロケット']].forEach((field) => {
              if (!field?.trim() || field.trim() === 'なし') return;
              field.split(/[、,，]/).forEach((part) => {
                const s = nameToSlug.get(part.trim());
                if (s && !related.includes(s)) related.push(s);
              });
            });
            r.relatedRockets = related;
          });

          resolve(rockets);
        },
      });
    });
  } catch (err) {
    console.error('ロケットデータの取得に失敗しました:', err);
    return [];
  }
}

// Legacy static array kept for backward compatibility (empty — use getRockets() instead)
export const ROCKETS: Rocket[] = [];
