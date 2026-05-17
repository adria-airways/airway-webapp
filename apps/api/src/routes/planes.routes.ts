import { Router } from "express";
import { getLivePlanes, getLatestSnapshot, getSnapshotById, getSnapshotNavigation, getLivePlanesSlovenia } from "../controllers/planes.controller.js";

const router = Router();

//web app

router.get("/app/live", getLivePlanes);

router.get("/app/live/slovenia", getLivePlanesSlovenia);

router.get("/app/snapshots/latest", getLatestSnapshot);

router.get("/app/snapshots/:id", getSnapshotById);

router.get("/app/snapshots/:id/navigation", getSnapshotNavigation);

//crud

export default router;