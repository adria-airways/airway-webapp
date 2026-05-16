import { Router } from "express";

import healthRoutes from "./health.routes.js";
import desktopRoutes from "./desktop.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/desktop", desktopRoutes);

export default router;
