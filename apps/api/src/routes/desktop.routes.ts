import { Router } from "express";

import { permissions } from "../auth/permissions.js";
import { requirePermission } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/ping",
  requirePermission(permissions.desktopAccess),
  (req, res) => {
    res.json({
      message: "Desktop app is ready!",
      userId: res.locals.userId,
      orgId: res.locals.orgId,
    });
  },
);

export default router;
