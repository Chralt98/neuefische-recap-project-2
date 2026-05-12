import { type Request, type Response } from "express";
import {
  getTrailBySlug,
  getTrailsWithFilters,
  addTrail,
  patchTrail,
  deleteTrail as deleteTrailById,
  type Trail,
} from "../models/trailModel";
import { buildTrailFormData, isTrailDifficulty } from "../utils/trailInput";

export async function showAllTrails(req: Request, res: Response) {
  const regionSlug = req.query.region as string | undefined;
  const difficulty = req.query.difficulty as Trail["difficulty"] | undefined;
  if (difficulty && !isTrailDifficulty(difficulty)) {
    return res.status(400).json({ error: "Invalid difficulty value" });
  }
  try {
    const trails = await getTrailsWithFilters(regionSlug, difficulty);
    res.json({ trails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch trails" });
  }
}

export async function showTrailWithRegionBySlug(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const slug = req.params.slug;
  try {
    const trails = await getTrailBySlug(slug);
    if (!trails) {
      return res.status(404).json({ error: "Trail not found" });
    }
    res.json({ trails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch trails" });
  }
}

export async function createTrail(req: Request, res: Response) {
  const body = req.body as Omit<Trail, "id" | "createdAt">;
  if (
    !body.title ||
    !body.description ||
    !body.difficulty ||
    !body.regionId ||
    !body.distanceKm ||
    !body.imageUrl ||
    !body.slug
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!isTrailDifficulty(body.difficulty)) {
    return res.status(400).json({ error: "Invalid difficulty value" });
  }

  try {
    const newTrail = await addTrail(buildTrailFormData(body, "preserve"));
    res.status(201).json({ trail: newTrail });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "Failed to create trail, error" +
        " details: " +
        (error instanceof Error ? error.message : String(error)),
    });
  }
}

export async function updateTrail(req: Request, res: Response) {
  const id = Number(req.params.id);
  const body = req.body as Partial<Omit<Trail, "id" | "createdAt">>;

  if (Object.keys(body).length === 0) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  if (body.difficulty && !isTrailDifficulty(body.difficulty)) {
    return res.status(400).json({ error: "Invalid difficulty value" });
  }

  try {
    const updated = await patchTrail(id, body);
    if (!updated) {
      return res.status(404).json({ error: "Trail not found" });
    }
    res.status(200).json({ trail: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update trail" });
  }
}

export async function deleteTrail(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const deleted = await deleteTrailById(id);
    if (!deleted) {
      return res.status(404).json({ error: "Trail not found" });
    }
    res.status(204).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete trail" });
  }
}
