import nunjucks from "nunjucks";
import express from "express";
import path from "node:path";
import { connectDB, closeDB } from "./models/db.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

const viewsDir = path.join(process.cwd(), "views");

nunjucks.configure(viewsDir, {
  autoescape: true,
  express: app,
});

await connectDB();

app.get("/", (req, res) => {
  res.render("index.html");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Closing database connection...");
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing database connection...");
  await closeDB();
  process.exit(0);
});
