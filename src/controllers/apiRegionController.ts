import { type Request, type Response } from "express";
import { getAllRegions, getRegionBySlug } from "../models/regionModel";
import { getTrailsByRegionId } from "../models/trailModel";

export async function showAllRegions(req: Request, res: Response) {
  try {
    const regions = await getAllRegions();
    res.json({ regions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch regions" });
  }
}

export async function showTrailsByRegionSlug(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const regionSlug = req.params.slug;
  try {
    const region = await getRegionBySlug(regionSlug);
    if (!region) {
      return res.status(404).json({ error: "Region not found" });
    }
    const trails = await getTrailsByRegionId(region.id);
    res.json({ trails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch trails for the region" });
  }
}
