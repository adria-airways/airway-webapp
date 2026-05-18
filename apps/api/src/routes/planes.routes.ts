import { Router } from "express";
import { getLivePlanes, getLatestSnapshot, getSnapshotById, getSnapshotNavigation, getLivePlanesSlovenia, getPlaneLiveByHex,
   createPlaneLive, updatePlaneLive, deletePlaneLive, getPlaneSnapshotById, createPlaneSnapshot, getAllLivePlanes, getPlaneSnapshot,
   updatePlaneSnapshot, deletePlaneSnapshot, getSnapshots, createSnapshot, updateSnapshot, deleteSnapshot, getPlaneRoutes,
   getPlaneRouteById, createPlaneRoute, updatePlaneRoute, deletePlaneRoute, getRegions, getRegionById, createRegion,
   updateRegion, deleteRegion, } from "../controllers/planes.controller.js";
import { permissions } from "../auth/permissions.js";
import {
  requirePermission,
  requireUser,
} from "../middleware/auth.middleware.js";

const router = Router();

//web app

router.get("/app/live", requireUser, getLivePlanes);
router.get("/app/live/slovenia", requireUser, getLivePlanesSlovenia);
router.get("/app/snapshots/latest", requireUser, getLatestSnapshot);
router.get("/app/snapshots/:id", requireUser, getSnapshotById);
router.get("/app/snapshots/:id/navigation", requireUser, getSnapshotNavigation);

//crud

//plane_live
router.get("/live", requirePermission(permissions.planesRead), getAllLivePlanes);
router.get("/live/:hex", requirePermission(permissions.planesRead), getPlaneLiveByHex);
router.post("/live", requirePermission(permissions.planesManage), createPlaneLive);
router.patch("/live/:hex", requirePermission(permissions.planesManage), updatePlaneLive);
router.delete("/live/:hex", requirePermission(permissions.planesManage), deletePlaneLive);

//plane_snapshots
router.get("/plane-snapshots", requirePermission(permissions.planesRead), getPlaneSnapshot);
router.get("/plane-snapshots/:id", requirePermission(permissions.planesRead), getPlaneSnapshotById);
router.post("/plane-snapshots", requirePermission(permissions.planesManage), createPlaneSnapshot);
router.patch("/plane-snapshots/:id", requirePermission(permissions.planesManage), updatePlaneSnapshot);
router.delete("/plane-snapshots/:id", requirePermission(permissions.planesManage), deletePlaneSnapshot);

//snapshots
router.get("/snapshots", requirePermission(permissions.planesRead), getSnapshots);
router.get("/snapshots/:id", requirePermission(permissions.planesRead), getSnapshotById);
router.post("/snapshots", requirePermission(permissions.planesManage), createSnapshot);
router.patch("/snapshots/:id", requirePermission(permissions.planesManage), updateSnapshot);
router.delete("/snapshots/:id", requirePermission(permissions.planesManage), deleteSnapshot);

//plane_routes
router.get("/routes", requirePermission(permissions.planesRead), getPlaneRoutes);
router.get("/routes/:id", requirePermission(permissions.planesRead), getPlaneRouteById);
router.post("/routes", requirePermission(permissions.planesManage), createPlaneRoute);
router.patch("/routes/:id", requirePermission(permissions.planesManage), updatePlaneRoute);
router.delete("/routes/:id", requirePermission(permissions.planesManage), deletePlaneRoute);

//geo_regions
router.get("/regions", requirePermission(permissions.planesRead), getRegions);
router.get("/regions/:id", requirePermission(permissions.planesRead), getRegionById);
router.post("/regions", requirePermission(permissions.planesManage), createRegion);
router.patch("/regions/:id", requirePermission(permissions.planesManage), updateRegion);
router.delete("/regions/:id", requirePermission(permissions.planesManage), deleteRegion);

//bulk insert

router.post("/live/bulk", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Bulk insert in plane_live.",
  });
});
router.post("/plane-snapshots/bulk", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Bulk insert in plane_snapshots.",
  });
});
router.post("/routes/bulk", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Bulk insert in plane_routes.",
  });
});


export default router;