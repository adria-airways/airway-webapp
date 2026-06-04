import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Check API health
 *     responses:
 *       200:
 *         description: API is healthy.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/HealthResponse"
 */
router.get("/", (_req, res) => {
  res.json({ ok: true, message: "Healthy!" });
});

export default router;
