import { type Request, type Response } from "express";

export function showAllRegions(req: Request, res: Response) {
  res.render("index.html");
}

export function showRegionWithTrailsBySlug(
  req: Request<{ slug: string }>,
  res: Response,
) {}
