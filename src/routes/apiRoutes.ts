import express from "express";
import * as apiRegionController from "../controllers/apiRegionController";
import * as apiTrailController from "../controllers/apiTrailController";
import { apiKeyMiddleware } from "../middleware/apiKey";

const router = express.Router();

router.get("/trails", apiTrailController.showAllTrails);
router.get("/trails/:slug", apiTrailController.showTrailWithRegionBySlug);
router.get("/regions", apiRegionController.showAllRegions);
router.get("/regions/:slug/trails", apiRegionController.showTrailsByRegionSlug);

router.use(apiKeyMiddleware); // Apply API key middleware to all routes below

router.post("/trails", apiTrailController.createTrail);
router.patch("/trails/:id", apiTrailController.updateTrail);
router.delete("/trails/:id", apiTrailController.deleteTrail);

export default router;
