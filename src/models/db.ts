import path from "path";
import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";

const defaultDBPath = path.join(process.cwd(), "data", "trail-guide.db");
const dbFile = process.env.DB_PATH || defaultDBPath;

let db: Database | null = null;

export async function connectDB(): Promise<Database> {
  db = await open({
    filename: dbFile,
    driver: sqlite3.Database,
  });

  return db;
}

export function getDB(): Database {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
}

export async function closeDB(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
