import express from "express";
import * as adminController from "../controllers/adminController";

const router = express.Router();

router.get("/", adminController.showAdminTrailList);
router.get("/trails/new", adminController.showNewTrailForm);
router.post("/trails", adminController.createTrail);
router.get("/trails/:id/edit", adminController.showEditTrailForm);
router.post("/trails/:id", adminController.saveTrail);
router.post("/trails/:id/delete", adminController.removeTrail);

export default router;
