import { type Request, type Response, type NextFunction } from "express";

export function apiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const apiKey = req.header("x-api-key");

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}
