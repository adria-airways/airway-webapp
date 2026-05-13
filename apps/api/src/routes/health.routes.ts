import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ ok: true, message: "Healthy!" });
});

export default router;
