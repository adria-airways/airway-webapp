import { Router } from "express";

import healthRoutes from "./health.routes.js";
import planeRoutes from "./planes.routes.js";

const router = Router();
router.use("/health", healthRoutes);
router.use("/planes", planeRoutes);

export default router;
