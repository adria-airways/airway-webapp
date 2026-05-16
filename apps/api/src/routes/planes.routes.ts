import { Router } from "express";
import { getLivePlanes, getLatestSnapshot, getSnapshotById, getSnapshotNavigation } from "../controllers/planes.controller.js";

const router = Router();

router.get("/live", getLivePlanes);

router.get("/snapshots/latest", getLatestSnapshot);

router.get("/snapshots/:id", getSnapshotById);

router.get("/snapshots/:id/navigation", getSnapshotNavigation);

export default router;