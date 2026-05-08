import { type Request, type Response } from "express";

export function showAllTrails(req: Request, res: Response) {
  res.render("index.html");
}

export function showRegonizedTrailBySlug(
  req: Request<{ slug: string }>,
  res: Response,
) {
  res.render("index.html");
}
