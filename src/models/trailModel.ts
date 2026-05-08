import { getDB } from "./db";

export interface Trail {
  id: number;
  regionId: number;
  title: string;
  slug: string;
  difficulty: "easy" | "moderate" | "hard";
  distanceKm: number;
  description: string;
  imageUrl: string;
  createdAt: number;
}

export async function getAllTrails(): Promise<Trail[]> {
  const db = getDB();
  return await db.all<Trail[]>(`SELECT * FROM trails`);
}

export async function getTrailBySlug(slug: string): Promise<Trail | undefined> {
  const db = getDB();
  return await db.get<Trail>(`SELECT * FROM trails WHERE slug = @slug`, {
    "@slug": slug,
  });
}
