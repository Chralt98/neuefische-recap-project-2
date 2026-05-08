import express from "express";
import * as regionController from "../controllers/regionController";
import * as trailController from "../controllers/trailController";

const router = express.Router();

router.get("/", trailController.showAllTrails);
router.get("/trails/:slug", trailController.showRegonizedTrailBySlug);
router.get("/regions", regionController.showAllRegions);
router.get("/regions/:slug", regionController.showRegionWithTrailsBySlug);

export default router;
