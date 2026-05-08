import { type Request, type Response } from "express";
import { getAllTrails, getTrailBySlug } from "../models/trailModel";

export async function showAllTrails(req: Request, res: Response) {
  try {
    const trails = await getAllTrails();
    res.render("index.html", { trails });
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
    res.render("trail.html", { trail });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch the trail");
  }
}
