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

export type RegionizedTrail = Omit<Trail, "regionId"> & {
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
    trails.description,
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

export async function getTrailsWithFilters(
  regionSlug?: string,
  difficulty?: Trail["difficulty"],
): Promise<RegionizedTrail[]> {
  const db = getDB();
  let query = trailsSelect;
  const params: Record<string, unknown> = {};

  if (regionSlug) {
    query += " WHERE trails.slug = @regionSlug";
    params["@regionSlug"] = regionSlug;
  }

  if (difficulty) {
    query += regionSlug ? " AND" : " WHERE";
    query += " trails.difficulty = @difficulty";
    params["@difficulty"] = difficulty;
  }

  return await db.all<RegionizedTrail[]>(query, params);
}

export async function getTrailBySlug(
  slug: string,
): Promise<RegionizedTrail | undefined> {
  const db = getDB();
  return await db.get<RegionizedTrail>(
    `${trailsSelect} WHERE trails.slug = @slug`,
    {
      "@slug": slug,
    },
  );
}

export async function getTrailsByRegionId(
  regionId: number,
): Promise<RegionizedTrail[]> {
  const db = getDB();
  return await db.all<RegionizedTrail[]>(
    `${trailsSelect} WHERE trails.region_id = @regionId`,
    {
      "@regionId": regionId,
    },
  );
}

export type TrailFormData = {
  regionId: number;
  title: string;
  slug: string;
  difficulty: Trail["difficulty"];
  distanceKm: number;
  description: string;
  imageUrl: string;
};

export async function getTrailById(
  id: number,
): Promise<RegionizedTrail | undefined> {
  const db = getDB();
  return await db.get<RegionizedTrail>(
    `${trailsSelect} WHERE trails.id = @id`,
    {
      "@id": id,
    },
  );
}

export async function addTrail(
  data: TrailFormData,
): Promise<Trail | undefined> {
  const db = getDB();
  await db.run(
    `
    INSERT INTO trails (
      region_id,
      title,
      slug,
      difficulty,
      distance_km,
      description,
      image_url,
      created_at
    ) VALUES (
      @regionId,
      @title,
      @slug,
      @difficulty,
      @distanceKm,
      @description,
      @imageUrl,
      @createdAt
    )
    `,
    {
      "@regionId": data.regionId,
      "@title": data.title,
      "@slug": data.slug,
      "@difficulty": data.difficulty,
      "@distanceKm": data.distanceKm,
      "@description": data.description,
      "@imageUrl": data.imageUrl,
      "@createdAt": Math.floor(Date.now() / 1000),
    },
  );

  const createdTrail = await db.get<Trail>(
    `SELECT * FROM trails WHERE slug = @slug`,
    { "@slug": data.slug },
  );

  return createdTrail;
}

export async function updateTrail(
  id: number,
  data: TrailFormData,
): Promise<void> {
  const db = getDB();
  await db.run(
    `
    UPDATE trails
    SET
      region_id = @regionId,
      title = @title,
      slug = @slug,
      difficulty = @difficulty,
      distance_km = @distanceKm,
      description = @description,
      image_url = @imageUrl
    WHERE id = @id
    `,
    {
      "@id": id,
      "@regionId": data.regionId,
      "@title": data.title,
      "@slug": data.slug,
      "@difficulty": data.difficulty,
      "@distanceKm": data.distanceKm,
      "@description": data.description,
      "@imageUrl": data.imageUrl,
    },
  );
}

export async function deleteTrail(id: number): Promise<boolean> {
  const db = getDB();
  const result = await db.run(`DELETE FROM trails WHERE id = @id`, {
    "@id": id,
  });
  return (result.changes ?? 0) > 0;
}

export async function patchTrail(
  id: number,
  data: Partial<Omit<Trail, "id" | "createdAt">>,
): Promise<Trail | undefined> {
  const db = getDB();
  const fields: string[] = [];
  const params: Record<string, unknown> = { "@id": id };

  if (data.regionId !== undefined) {
    fields.push("region_id = @regionId");
    params["@regionId"] = data.regionId;
  }

  if (data.title !== undefined) {
    fields.push("title = @title");
    params["@title"] = data.title;
  }

  if (data.slug !== undefined) {
    fields.push("slug = @slug");
    params["@slug"] = data.slug;
  }

  if (data.difficulty !== undefined) {
    fields.push("difficulty = @difficulty");
    params["@difficulty"] = data.difficulty;
  }

  if (data.distanceKm !== undefined) {
    fields.push("distance_km = @distanceKm");
    params["@distanceKm"] = data.distanceKm;
  }

  if (data.description !== undefined) {
    fields.push("description = @description");
    params["@description"] = data.description;
  }

  if (data.imageUrl !== undefined) {
    fields.push("image_url = @imageUrl");
    params["@imageUrl"] = data.imageUrl;
  }

  const setClause = fields.join(", ");

  if (!setClause) {
    return undefined;
  }

  const result = await db.run(
    `UPDATE trails SET ${setClause} WHERE id = @id`,
    params,
  );

  if ((result.changes ?? 0) === 0) {
    return undefined;
  }

  const updatedTrail = await db.get<Trail>(
    `SELECT * FROM trails WHERE id = @id`,
    { "@id": id },
  );

  return updatedTrail;
}
