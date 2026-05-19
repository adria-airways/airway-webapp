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
  weatherController.listReadings,
);

router.get(
  "/readings/:id",
  requirePermission(permissions.weatherRead),
  weatherController.getReading,
);

router.post(
  "/readings",
  requirePermission(permissions.weatherManage),
  weatherController.createReading,
);

router.patch(
  "/readings/:id",
  requirePermission(permissions.weatherManage),
  weatherController.updateReading,
);

router.delete(
  "/readings/:id",
  requirePermission(permissions.weatherManage),
  weatherController.deleteReading,
);

router.post(
  "/locations/:id/readings/bulk",
  requirePermission(permissions.weatherManage),
  weatherController.bulkUpsertForLocation,
);

/* WEBAPP ENDPOINTS */

router.get("/app/locations", requireUser, weatherController.listAppLocations);

router.get(
  "/app/locations/:id/current",
  requireUser,
  weatherController.getCurrentWeatherForLocation,
);

router.get(
  "/app/locations/:id/forecast",
  requireUser,
  weatherController.getForecastForLocation,
);

export default router;
