import { Router } from "express";

import { permissions } from "../auth/permissions.js";
import {
  requirePermission,
  requireUser,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/locations",
  requirePermission(permissions.locationsRead),
  (_req, res) => {
    res.json({
      message: "List all weather station locations.",
    });
  },
);

router.post(
  "/locations",
  requirePermission(permissions.locationsManage),
  (_req, res) => {
    res.status(201).json({
      message: "Create a new weather station.",
    });
  },
);

router.get(
  "/readings",
  requirePermission(permissions.weatherRead),
  (_req, res) => {
    res.json({
      message: "List all weather readings.",
    });
  },
);

router.post(
  "/locations/:id/readings/bulk",
  requirePermission(permissions.weatherManage),
  (_req, res) => {
    res.json({
      message: "Bulk upsert for weather readings.",
    });
  },
);

/* WEBAPP ENDPOINTS */

router.get("/app/locations", requireUser, (_req, res) => {
  res.json({
    message: "List all weather station locations.",
  });
});

router.get("/app/locations/:id/current", requireUser, (_req, res) => {
  res.json({
    message: "Get current weather.",
  });
});

router.get("/app/locations/:id/forecast", requireUser, (_req, res) => {
  res.json({
    message: "Get weather forecast.",
  });
});

export default router;
