import { Router } from "express";

import { permissions } from "../auth/permissions.js";
import {
  requirePermission,
  requireUser,
  requireAccessPermission,
} from "../middleware/auth.middleware.js";
import * as weatherController from "../controllers/weather.controller.js";

const router = Router();

/**
 * @openapi
 * /weather/locations:
 *   get:
 *     tags:
 *       - Weather
 *     summary: List weather locations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weather locations returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/WeatherLocation"
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
  "/locations",
  requireAccessPermission(permissions.locationsRead),
  weatherController.listLocations,
);

/**
 * @openapi
 * /weather/locations/{id}:
 *   get:
 *     tags:
 *       - Weather
 *     summary: Get a weather location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *     responses:
 *       200:
 *         description: Weather location returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeatherLocation"
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Weather location not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get(
  "/locations/:id",
  requireAccessPermission(permissions.locationsRead),
  weatherController.getLocation,
);

/**
 * @openapi
 * /weather/locations:
 *   post:
 *     tags:
 *       - Weather
 *     summary: Create a weather location
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateWeatherLocation"
 *     responses:
 *       201:
 *         description: Weather location created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeatherLocation"
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.post(
  "/locations",
  requireAccessPermission(permissions.locationsManage),
  weatherController.createLocation,
);

/**
 * @openapi
 * /weather/locations/{id}:
 *   patch:
 *     tags:
 *       - Weather
 *     summary: Update a weather location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateWeatherLocation"
 *     responses:
 *       200:
 *         description: Weather location updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeatherLocation"
 *       400:
 *         description: Invalid request body or path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Weather location not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.patch(
  "/locations/:id",
  requireAccessPermission(permissions.locationsManage),
  weatherController.updateLocation,
);

/**
 * @openapi
 * /weather/locations/{id}:
 *   delete:
 *     tags:
 *       - Weather
 *     summary: Delete a weather location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *     responses:
 *       200:
 *         description: Weather location deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeatherLocation"
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Weather location not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete(
  "/locations/:id",
  requireAccessPermission(permissions.locationsManage),
  weatherController.deleteLocation,
);

/**
 * @openapi
 * /weather/readings:
 *   get:
 *     tags:
 *       - Weather
 *     summary: List weather readings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: locationId
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *       - name: resolution
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 3
 *       - name: from
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: to
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 500
 *           default: 100
 *     responses:
 *       200:
 *         description: Weather readings returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/WeatherReading"
 *       400:
 *         description: Invalid query parameters.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
  "/readings",
  requireAccessPermission(permissions.weatherRead),
  weatherController.listReadings,
);

/**
 * @openapi
 * /weather/readings/{id}:
 *   get:
 *     tags:
 *       - Weather
 *     summary: Get a weather reading
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Weather reading returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeatherReading"
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Weather reading not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get(
  "/readings/:id",
  requireAccessPermission(permissions.weatherRead),
  weatherController.getReading,
);

/**
 * @openapi
 * /weather/readings:
 *   post:
 *     tags:
 *       - Weather
 *     summary: Create a weather reading
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateWeatherReading"
 *     responses:
 *       201:
 *         description: Weather reading created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeatherReading"
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.post(
  "/readings",
  requireAccessPermission(permissions.weatherManage),
  weatherController.createReading,
);

/**
 * @openapi
 * /weather/readings/{id}:
 *   patch:
 *     tags:
 *       - Weather
 *     summary: Update a weather reading
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateWeatherReading"
 *     responses:
 *       200:
 *         description: Weather reading updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeatherReading"
 *       400:
 *         description: Invalid request body or path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Weather reading not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.patch(
  "/readings/:id",
  requireAccessPermission(permissions.weatherManage),
  weatherController.updateReading,
);

/**
 * @openapi
 * /weather/readings/{id}:
 *   delete:
 *     tags:
 *       - Weather
 *     summary: Delete a weather reading
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Weather reading deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeatherReading"
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Weather reading not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete(
  "/readings/:id",
  requireAccessPermission(permissions.weatherManage),
  weatherController.deleteReading,
);

/**
 * @openapi
 * /weather/locations/{id}/readings/bulk:
 *   post:
 *     tags:
 *       - Weather
 *     summary: Bulk upsert readings for a weather location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BulkWeatherReadings"
 *     responses:
 *       200:
 *         description: Weather readings upserted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BulkWeatherReadingsResult"
 *       400:
 *         description: Invalid request body or path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Weather location not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post(
  "/locations/:id/readings/bulk",
  requireAccessPermission(permissions.weatherManage),
  weatherController.bulkUpsertForLocation,
);

/* WEBAPP ENDPOINTS */

/**
 * @openapi
 * /weather/app/locations:
 *   get:
 *     tags:
 *       - Weather App
 *     summary: List weather locations for the web app
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weather locations returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/WeatherLocation"
 *       401:
 *         description: Unauthorized.
 */
router.get("/app/locations", requireUser, weatherController.listAppLocations);

/**
 * @openapi
 * /weather/app/locations/{id}/current:
 *   get:
 *     tags:
 *       - Weather App
 *     summary: Get current weather for a location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *     responses:
 *       200:
 *         description: Current weather returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CurrentWeatherResponse"
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Weather location not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get(
  "/app/locations/:id/current",
  requireUser,
  weatherController.getCurrentWeatherForLocation,
);

/**
 * @openapi
 * /weather/app/locations/{id}/reading-near:
 *   get:
 *     tags:
 *       - Weather App
 *     summary: Get weather reading closest to a specific time for a location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *       - name: at
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Closest weather reading returned.
 *       400:
 *         description: Invalid path or query parameter.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Weather location not found.
 */
router.get(
  "/app/locations/:id/reading-near",
  requireUser,
  weatherController.getWeatherReadingNearTime,
);

/**
 * @openapi
 * /weather/app/locations/{id}/forecast:
 *   get:
 *     tags:
 *       - Weather App
 *     summary: Get weather forecast for a location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *     responses:
 *       200:
 *         description: Weather forecast returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ForecastWeatherResponse"
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Weather location not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get(
  "/app/locations/:id/forecast",
  requireUser,
  weatherController.getForecastForLocation,
);

export default router;
