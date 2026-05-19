import { Router } from "express";

import { permissions } from "../auth/permissions.js";
import { requirePermission } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /desktop/ping:
 *   get:
 *     tags:
 *       - Desktop
 *     summary: Check desktop app access
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Desktop app access confirmed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DesktopPingResponse"
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
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
