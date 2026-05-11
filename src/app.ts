import nunjucks from "nunjucks";
import express from "express";
import path from "node:path";
import { connectDB, closeDB } from "./models/db.js";
import websiteRouter from "./routes/websiteRoutes.js";
import { logger } from "./middleware/logger.js";
import adminRouter from "./routes/adminRoutes.js";
import apiRouter from "./routes/apiRoutes.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

const viewsDir = path.join(process.cwd(), "views");

nunjucks.configure(viewsDir, {
  autoescape: true,
  express: app,
});

await connectDB();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", adminRouter);
app.use("/", websiteRouter);
app.use("/api", apiRouter);

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
