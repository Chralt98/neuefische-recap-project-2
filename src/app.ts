import nunjucks from "nunjucks";
import express from "express";
import path from "node:path";

const app = express();
const port = Number(process.env.PORT) || 3000;

const viewsDir = path.join(process.cwd(), "views");

nunjucks.configure(viewsDir, {
  autoescape: true,
  express: app,
});

app.get("/", (req, res) => {
  res.render("index.html");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
