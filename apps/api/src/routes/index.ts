import { Router } from "express";

import healthRoutes from "./health.routes.js";
import planeRoutes from "./planes.routes.js";
import desktopRoutes from "./desktop.routes.js";
import weatherRoutes from "./weather.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/planes", planeRoutes);
router.use("/desktop", desktopRoutes);
router.use("/weather", weatherRoutes);

export default router;
