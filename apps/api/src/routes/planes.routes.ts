import { Router } from "express";
import {
  bulkInsertPlaneLive,
  bulkInsertPlaneRoute,
  bulkInsertPlaneSnapshot,
  createPlaneLive,
  createPlaneRoute,
  createPlaneSnapshot,
  createRegion,
  createSnapshot,
  deletePlaneLive,
  deletePlaneRoute,
  deletePlaneSnapshot,
  deleteRegion,
  deleteSnapshot,
  getAllLivePlanes,
  getFlightHistory,
  getLatestSnapshot,
  getLivePlanes,
  getLivePlanesSlovenia,
  getNearbyPlanes,
  getPlaneLiveByHex,
  getPlaneRouteById,
  getPlaneRoutes,
  getPlaneSnapshot,
  getPlaneSnapshotById,
  getRegionById,
  getRegions,
  getRouteInfo,
  getSnapshotById,
  getSnapshotNavigation,
  getSnapshots,
  getStats,
  updatePlaneLive,
  updatePlaneRoute,
  updatePlaneSnapshot,
  updateRegion,
  updateSnapshot,
} from "../controllers/planes.controller.js";
import { permissions } from "../auth/permissions.js";
import {
  requirePermission,
  requireUser,
  requireAccessPermission,
} from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /planes/app/live:
 *   get:
 *     tags:
 *       - Planes App
 *     summary: List live planes with route details for the web app
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Live planes returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     additionalProperties: true
 *       401:
 *         description: Unauthorized.
 */
router.get("/app/live", requireUser, getLivePlanes);

/**
 * @openapi
 * /planes/app/nearby:
 *   get:
 *     tags:
 *       - Planes App
 *     summary: List nearby planes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: latitude
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *       - name: longitude
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *       - name: radius
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Nearby planes returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/PlaneLive"
 *       400:
 *         description: Invalid query parameters.
 *       401:
 *         description: Unauthorized.
 */
router.get("/app/nearby", requireUser, getNearbyPlanes);

/**
 * @openapi
 * /planes/app/stats:
 *   get:
 *     tags:
 *       - Planes App
 *     summary: Get plane dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Plane statistics returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PlaneStatsResponse"
 *       401:
 *         description: Unauthorized.
 */
router.get("/app/stats", requireUser, getStats);

/**
 * @openapi
 * /planes/app/live/slovenia:
 *   get:
 *     tags:
 *       - Planes App
 *     summary: List live planes currently inside Slovenia
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Slovenian live planes returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/PlaneLive"
 *       401:
 *         description: Unauthorized.
 */
router.get("/app/live/slovenia", requireUser, getLivePlanesSlovenia);

/**
 * @openapi
 * /planes/app/snapshots/latest:
 *   get:
 *     tags:
 *       - Planes App
 *     summary: Get the latest plane snapshot
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest snapshot returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 latestSnapshot:
 *                   oneOf:
 *                     - $ref: "#/components/schemas/Snapshot"
 *                     - type: "null"
 *       401:
 *         description: Unauthorized.
 */
router.get("/app/snapshots/latest", requireUser, getLatestSnapshot);

/**
 * @openapi
 * /planes/app/snapshots/{id}:
 *   get:
 *     tags:
 *       - Planes App
 *     summary: Get a snapshot by ID for the web app
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
 *         description: Snapshot returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Snapshot"
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Snapshot not found.
 */
router.get("/app/snapshots/:id", requireUser, getSnapshotById);

/**
 * @openapi
 * /planes/app/snapshots/{id}/navigation:
 *   get:
 *     tags:
 *       - Planes App
 *     summary: Get previous and next snapshot IDs around a snapshot
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
 *         description: Snapshot navigation returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SnapshotNavigationResponse"
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Snapshot not found.
 */
router.get("/app/snapshots/:id/navigation", requireUser, getSnapshotNavigation);

/**
 * @openapi
 * /planes/app/snapshots:
 *   get:
 *     tags:
 *       - Planes App
 *     summary: List snapshots for the web app
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Snapshots returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Snapshot"
 *       401:
 *         description: Unauthorized.
 */
router.get("/app/snapshots", requireUser, getSnapshots);

/**
 * @openapi
 * /planes/app/flights/history:
 *   get:
 *     tags:
 *       - Planes App
 *     summary: Get flight history for a plane and callsign
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: hex
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *       - name: callsign
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *     responses:
 *       200:
 *         description: Flight history returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/PlaneSnapshot"
 *       400:
 *         description: Invalid query parameters.
 *       401:
 *         description: Unauthorized.
 */
router.get("/app/flights/history", requireUser, getFlightHistory);

/**
 * @openapi
 * /planes/app/routes/info:
 *   get:
 *     tags:
 *       - Planes App
 *     summary: Get route info for a plane and callsign
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: hex
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *       - name: callsign
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *     responses:
 *       200:
 *         description: Route info returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/PlaneRoute"
 *       400:
 *         description: Invalid query parameters.
 *       401:
 *         description: Unauthorized.
 */
router.get("/app/routes/info", requireUser, getRouteInfo);

/**
 * @openapi
 * /planes/live:
 *   get:
 *     tags:
 *       - Planes
 *     summary: List live planes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Live planes returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/PlaneLive"
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
  "/live",
  requireAccessPermission(permissions.planesRead),
  getAllLivePlanes,
);

/**
 * @openapi
 * /planes/live/{hex}:
 *   get:
 *     tags:
 *       - Planes
 *     summary: Get a live plane by hex
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: hex
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *     responses:
 *       200:
 *         description: Live plane returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PlaneLive"
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Plane not found.
 */
router.get(
  "/live/:hex",
  requireAccessPermission(permissions.planesRead),
  getPlaneLiveByHex,
);

/**
 * @openapi
 * /planes/live:
 *   post:
 *     tags:
 *       - Planes
 *     summary: Create a live plane
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PlaneLive"
 *     responses:
 *       201:
 *         description: Live plane created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PlaneLive"
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.post(
  "/live",
  requireAccessPermission(permissions.planesManage),
  createPlaneLive,
);

/**
 * @openapi
 * /planes/live/{hex}:
 *   patch:
 *     tags:
 *       - Planes
 *     summary: Update a live plane
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: hex
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
 *             $ref: "#/components/schemas/PlaneLive"
 *     responses:
 *       200:
 *         description: Live plane updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PlaneLive"
 *       400:
 *         description: Invalid request body or path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Plane not found.
 */
router.patch(
  "/live/:hex",
  requireAccessPermission(permissions.planesManage),
  updatePlaneLive,
);

/**
 * @openapi
 * /planes/live/{hex}:
 *   delete:
 *     tags:
 *       - Planes
 *     summary: Delete a live plane
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: hex
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *     responses:
 *       200:
 *         description: Live plane deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PlaneLive"
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Plane not found.
 */
router.delete(
  "/live/:hex",
  requireAccessPermission(permissions.planesManage),
  deletePlaneLive,
);

/**
 * @openapi
 * /planes/plane-snapshots:
 *   get:
 *     tags:
 *       - Plane Snapshots
 *     summary: List plane snapshots
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Plane snapshots returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/PlaneSnapshot"
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
  "/plane-snapshots",
  requireAccessPermission(permissions.planesRead),
  getPlaneSnapshot,
);

/**
 * @openapi
 * /planes/plane-snapshots/{id}:
 *   get:
 *     tags:
 *       - Plane Snapshots
 *     summary: Get a plane snapshot by ID
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
 *         description: Plane snapshot returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PlaneSnapshot"
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Plane snapshot not found.
 */
router.get(
  "/plane-snapshots/:id",
  requireAccessPermission(permissions.planesRead),
  getPlaneSnapshotById,
);

/**
 * @openapi
 * /planes/plane-snapshots:
 *   post:
 *     tags:
 *       - Plane Snapshots
 *     summary: Create a plane snapshot
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PlaneSnapshot"
 *     responses:
 *       201:
 *         description: Plane snapshot created.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.post(
  "/plane-snapshots",
  requireAccessPermission(permissions.planesManage),
  createPlaneSnapshot,
);

/**
 * @openapi
 * /planes/plane-snapshots/{id}:
 *   patch:
 *     tags:
 *       - Plane Snapshots
 *     summary: Update a plane snapshot
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
 *             $ref: "#/components/schemas/PlaneSnapshot"
 *     responses:
 *       200:
 *         description: Plane snapshot updated.
 *       400:
 *         description: Invalid request body or path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Plane snapshot not found.
 */
router.patch(
  "/plane-snapshots/:id",
  requireAccessPermission(permissions.planesManage),
  updatePlaneSnapshot,
);

/**
 * @openapi
 * /planes/plane-snapshots/{id}:
 *   delete:
 *     tags:
 *       - Plane Snapshots
 *     summary: Delete a plane snapshot
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
 *         description: Plane snapshot deleted.
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Plane snapshot not found.
 */
router.delete(
  "/plane-snapshots/:id",
  requireAccessPermission(permissions.planesManage),
  deletePlaneSnapshot,
);

/**
 * @openapi
 * /planes/snapshots:
 *   get:
 *     tags:
 *       - Snapshots
 *     summary: List snapshots
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Snapshots returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Snapshot"
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
  "/snapshots",
  requireAccessPermission(permissions.planesRead),
  getSnapshots,
);

/**
 * @openapi
 * /planes/snapshots/{id}:
 *   get:
 *     tags:
 *       - Snapshots
 *     summary: Get a snapshot by ID
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
 *         description: Snapshot returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Snapshot"
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Snapshot not found.
 */
router.get(
  "/snapshots/:id",
  requireAccessPermission(permissions.planesRead),
  getSnapshotById,
);

/**
 * @openapi
 * /planes/snapshots:
 *   post:
 *     tags:
 *       - Snapshots
 *     summary: Create a snapshot
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateSnapshot"
 *     responses:
 *       201:
 *         description: Snapshot created.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.post(
  "/snapshots",
  requireAccessPermission(permissions.planesManage),
  createSnapshot,
);

/**
 * @openapi
 * /planes/snapshots/{id}:
 *   patch:
 *     tags:
 *       - Snapshots
 *     summary: Update a snapshot
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
 *             $ref: "#/components/schemas/CreateSnapshot"
 *     responses:
 *       200:
 *         description: Snapshot updated.
 *       400:
 *         description: Invalid request body or path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Snapshot not found.
 */
router.patch(
  "/snapshots/:id",
  requireAccessPermission(permissions.planesManage),
  updateSnapshot,
);

/**
 * @openapi
 * /planes/snapshots/{id}:
 *   delete:
 *     tags:
 *       - Snapshots
 *     summary: Delete a snapshot
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
 *         description: Snapshot deleted.
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Snapshot not found.
 */
router.delete(
  "/snapshots/:id",
  requireAccessPermission(permissions.planesManage),
  deleteSnapshot,
);

/**
 * @openapi
 * /planes/routes:
 *   get:
 *     tags:
 *       - Plane Routes
 *     summary: List plane routes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Plane routes returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/PlaneRoute"
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
  "/routes",
  requireAccessPermission(permissions.planesRead),
  getPlaneRoutes,
);

/**
 * @openapi
 * /planes/routes/{id}:
 *   get:
 *     tags:
 *       - Plane Routes
 *     summary: Get a plane route by ID
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
 *         description: Plane route returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PlaneRoute"
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Plane route not found.
 */
router.get(
  "/routes/:id",
  requireAccessPermission(permissions.planesRead),
  getPlaneRouteById,
);

/**
 * @openapi
 * /planes/routes:
 *   post:
 *     tags:
 *       - Plane Routes
 *     summary: Create a plane route
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PlaneRoute"
 *     responses:
 *       201:
 *         description: Plane route created.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.post(
  "/routes",
  requireAccessPermission(permissions.planesManage),
  createPlaneRoute,
);

/**
 * @openapi
 * /planes/routes/{id}:
 *   patch:
 *     tags:
 *       - Plane Routes
 *     summary: Update a plane route
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
 *             $ref: "#/components/schemas/PlaneRoute"
 *     responses:
 *       200:
 *         description: Plane route updated.
 *       400:
 *         description: Invalid request body or path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Plane route not found.
 */
router.patch(
  "/routes/:id",
  requireAccessPermission(permissions.planesManage),
  updatePlaneRoute,
);

/**
 * @openapi
 * /planes/routes/{id}:
 *   delete:
 *     tags:
 *       - Plane Routes
 *     summary: Delete a plane route
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
 *         description: Plane route deleted.
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Plane route not found.
 */
router.delete(
  "/routes/:id",
  requireAccessPermission(permissions.planesManage),
  deletePlaneRoute,
);

/**
 * @openapi
 * /planes/regions:
 *   get:
 *     tags:
 *       - Geo Regions
 *     summary: List geo regions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Geo regions returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/GeoRegion"
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
  "/regions",
  requireAccessPermission(permissions.planesRead),
  getRegions,
);

/**
 * @openapi
 * /planes/regions/{id}:
 *   get:
 *     tags:
 *       - Geo Regions
 *     summary: Get a geo region by ID
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
 *         description: Geo region returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/GeoRegion"
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Geo region not found.
 */
router.get(
  "/regions/:id",
  requireAccessPermission(permissions.planesRead),
  getRegionById,
);

/**
 * @openapi
 * /planes/regions:
 *   post:
 *     tags:
 *       - Geo Regions
 *     summary: Create a geo region
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateGeoRegion"
 *     responses:
 *       201:
 *         description: Geo region created.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.post(
  "/regions",
  requireAccessPermission(permissions.planesManage),
  createRegion,
);

/**
 * @openapi
 * /planes/regions/{id}:
 *   patch:
 *     tags:
 *       - Geo Regions
 *     summary: Update a geo region
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
 *             $ref: "#/components/schemas/CreateGeoRegion"
 *     responses:
 *       200:
 *         description: Geo region updated.
 *       400:
 *         description: Invalid request body or path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Geo region not found.
 */
router.patch(
  "/regions/:id",
  requireAccessPermission(permissions.planesManage),
  updateRegion,
);

/**
 * @openapi
 * /planes/regions/{id}:
 *   delete:
 *     tags:
 *       - Geo Regions
 *     summary: Delete a geo region
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
 *         description: Geo region deleted.
 *       400:
 *         description: Invalid path parameter.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Geo region not found.
 */
router.delete(
  "/regions/:id",
  requireAccessPermission(permissions.planesManage),
  deleteRegion,
);

/**
 * @openapi
 * /planes/live/bulk:
 *   post:
 *     tags:
 *       - Planes
 *     summary: Bulk insert live planes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BulkPlaneLive"
 *     responses:
 *       201:
 *         description: Live planes inserted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BulkInsertResult"
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.post(
  "/live/bulk",
  requireAccessPermission(permissions.planesManage),
  bulkInsertPlaneLive,
);

/**
 * @openapi
 * /planes/plane-snapshots/bulk:
 *   post:
 *     tags:
 *       - Plane Snapshots
 *     summary: Bulk insert plane snapshots
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BulkPlaneSnapshot"
 *     responses:
 *       201:
 *         description: Plane snapshots inserted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BulkInsertResult"
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.post(
  "/plane-snapshots/bulk",
  requireAccessPermission(permissions.planesManage),
  bulkInsertPlaneSnapshot,
);

/**
 * @openapi
 * /planes/routes/bulk:
 *   post:
 *     tags:
 *       - Plane Routes
 *     summary: Bulk insert plane routes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BulkPlaneRoute"
 *     responses:
 *       201:
 *         description: Plane routes inserted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BulkInsertResult"
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.post(
  "/routes/bulk",
  requireAccessPermission(permissions.planesManage),
  bulkInsertPlaneRoute,
);

export default router;
