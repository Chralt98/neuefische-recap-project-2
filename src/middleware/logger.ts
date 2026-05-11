import type { NextFunction, Request, Response } from "express";
import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";

const logsDir = path.join(process.cwd(), "logs");
const accessLogPath = path.join(logsDir, "access.log");

export function logger(req: Request, res: Response, next: NextFunction) {
  res.on("finish", async () => {
    const logEntry =
      [
        new Date().toISOString(),
        req.method,
        req.originalUrl,
        res.statusCode,
      ].join(" ") + "\n";

    try {
      await mkdir(logsDir, { recursive: true });
      await appendFile(accessLogPath, logEntry);
    } catch (error) {
      console.error("Failed to write access log:", error);
    }
  });

  next();
}
