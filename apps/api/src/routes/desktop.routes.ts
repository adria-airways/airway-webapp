import { Router } from "express";

import { permissions } from "../auth/permissions.js";
import {
  requirePermission,
  requireUser,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/login",
  requirePermission(permissions.desktopAccess),
  (req, res) => {
    res.status(501).json({
      message: "Caki se malo no!",
    });
  },
);

router.post("/exchange", (req, res) => {
  res.status(501).json({
    message: "Caki se malo no!",
  });
});

router.post("/refresh", (req, res) => {
  res.status(501).json({
    message: "Caki se malo no!",
  });
});

router.post("/revoke", (req, res) => {
  res.status(501).json({
    message: "Caki se malo no!",
  });
});

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
