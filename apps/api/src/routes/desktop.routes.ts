import { Router } from "express";

import { permissions } from "../auth/permissions.js";
import { requirePermission } from "../middleware/auth.middleware.js";

import {
  exchangeCode,
  login,
  refreshAppToken,
  revokeAppToken,
} from "../controllers/desktop-auth.controller.js";

const router = Router();

router.get("/login", requirePermission(permissions.desktopAccess), login);

router.post("/exchange", exchangeCode);

router.post("/refresh", refreshAppToken);

router.post("/revoke", revokeAppToken);

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
