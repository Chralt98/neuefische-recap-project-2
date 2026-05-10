import { type Request, type Response } from "express";
import { getAllRegions, getRegionBySlug } from "../models/regionModel";
import { getTrailsByRegionId } from "../models/trailModel";
import { formatDate } from "../utils/formatDate";

export async function showAllRegions(req: Request, res: Response) {
  try {
    const regions = await getAllRegions();
    res.render("regions.html", { regions });
  } catch (error) {
    console.error(error);
    res.send("Failed to fetch all regions");
  }
}

// shows a single region with its trails
export async function showRegionWithTrailsBySlug(
  req: Request<{ slug: string }>,
  res: Response,
) {
  try {
    const region = await getRegionBySlug(req.params.slug);
    if (!region) {
      return res.status(404).send("Region not found");
    }
    const trails = await getTrailsByRegionId(region.id);
    res.render("region.html", {
      region,
      trails: trails.map((trail) => ({
        ...trail,
        formattedCreatedAt: formatDate(trail.createdAt),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch the region with trails");
  }
}
