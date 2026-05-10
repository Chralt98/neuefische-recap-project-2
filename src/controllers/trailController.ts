import { type Request, type Response } from "express";
import {
  getAllTrails,
  getTrailBySlug,
  type RegionizedTrail,
} from "../models/trailModel";
import { formatDate } from "../utils/formatDate";

type TrailViewModel = RegionizedTrail & {
  formattedCreatedAt: string;
};

function toTrailViewModel(trail: RegionizedTrail): TrailViewModel {
  return {
    ...trail,
    formattedCreatedAt: formatDate(trail.createdAt),
  };
}

export async function showAllTrails(req: Request, res: Response) {
  try {
    const trails = await getAllTrails();
    res.render("index.html", { trails: trails.map(toTrailViewModel) });
  } catch (error) {
    console.error(error);
    res.send("Failed to fetch all trails");
  }
}

export async function showRegonizedTrailBySlug(
  req: Request<{ slug: string }>,
  res: Response,
) {
  try {
    const trail = await getTrailBySlug(req.params.slug);
    if (!trail) {
      return res.status(404).send("Trail not found");
    }
    res.render("trail.html", { trail: toTrailViewModel(trail) });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch the trail");
  }
}
