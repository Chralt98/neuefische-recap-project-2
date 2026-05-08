import { getDB } from "./db";

export type Trail = {
  id: number;
  regionId: number;
  title: string;
  slug: string;
  difficulty: "easy" | "moderate" | "hard";
  distanceKm: number;
  description: string;
  imageUrl: string;
  createdAt: number;
};

export type RegionizedTrail = Trail & {
  regionName: string;
  regionCountry: string;
};

const trailsSelect = `
SELECT 
    trails.id AS id,
    trails.region_id AS regionId,
    trails.title,
    trails.slug,
    trails.difficulty,
    trails.distance_km AS distanceKm,
    trails.image_url AS imageUrl,
    trails.created_at AS createdAt,
    regions.name AS regionName,
    regions.country AS regionCountry
FROM trails
INNER JOIN regions ON trails.region_id = regions.id
`;

export async function getAllTrails(): Promise<RegionizedTrail[]> {
  const db = getDB();
  return await db.all<RegionizedTrail[]>(trailsSelect);
}

export async function getTrailBySlug(
  slug: string,
): Promise<RegionizedTrail | undefined> {
  const db = getDB();
  return await db.get<RegionizedTrail>(`${trailsSelect} WHERE slug = @slug`, {
    "@slug": slug,
  });
}

export async function getTrailsByRegionId(
  regionId: number,
): Promise<RegionizedTrail[]> {
  const db = getDB();
  return await db.all<RegionizedTrail[]>(
    `${trailsSelect} WHERE regionId = @regionId`,
    {
      "@regionId": regionId,
    },
  );
}
