import { Router } from "express";

import { permissions } from "../auth/permissions.js";
import {
  requirePermission,
  requireUser,
} from "../middleware/auth.middleware.js";
import * as weatherController from "../controllers/weather.controller.js";

const router = Router();

router.get(
  "/locations",
  requirePermission(permissions.locationsRead),
  weatherController.listLocations,
);

router.get(
  "/locations/:id",
  requirePermission(permissions.locationsRead),
  weatherController.getLocation,
);

router.post(
  "/locations",
  requirePermission(permissions.locationsManage),
  weatherController.createLocation,
);

router.patch(
  "/locations/:id",
  requirePermission(permissions.locationsManage),
  weatherController.updateLocation,
);

router.delete(
  "/locations/:id",
  requirePermission(permissions.locationsManage),
  weatherController.deleteLocation,
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
