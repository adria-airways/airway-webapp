import { Router } from "express";
import { getLivePlanes, getLatestSnapshot, getSnapshotById, getSnapshotNavigation, getLivePlanesSlovenia } from "../controllers/planes.controller.js";
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
router.get("/live", requirePermission(permissions.planesRead), (_req, res) => {
  res.json({
    message: "List all planes in live snapshot.",
  });
});

router.get("/live/:hex", requirePermission(permissions.planesRead), (_req, res) => {
  res.json({
    message: "Get plane by hex from live snapshot.",
  });
});

router.post("/live", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Create new plane in live snapshot.",
  });
});

router.patch("/live/:hex", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Edit plane in live snapshot.",
  });
});

router.delete("/live/:hex", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Delete plane in live snapshot.",
  });
});


//plane_snapshots
router.get("/plane-snapshots", requirePermission(permissions.planesRead), (_req, res) => {
  res.json({
    message: "List all planes in plane_snapshot.",
  });
});

router.get("/plane-snapshots/:id", requirePermission(permissions.planesRead), (_req, res) => {
  res.json({
    message: "Get plane by id from plane_snapshot.",
  });
});

router.post("/plane-snapshots", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Create new plane in plane_snapshot.",
  });
});

router.patch("/plane-snapshots/:id", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Edit plane in plane_snapshot.",
  });
});

router.delete("/plane-snapshots/:id", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Delete plane in plane_snapshot.",
  });
});

//snapshots
router.get("/snapshots", requirePermission(permissions.planesRead), (_req, res) => {
  res.json({
    message: "List all snapshots.",
  });
});

router.get("/snapshots/:id", requirePermission(permissions.planesRead), (_req, res) => {
  res.json({
    message: "Get snapshot by id from snapshots.",
  });
});

router.post("/snapshots", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Create new snapshot in snapshots.",
  });
});

router.patch("/snapshots/:id", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Edit snapshot in snapshots.",
  });
});

router.delete("/snapshots/:id", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Delete snapshot in snapshots.",
  });
});

//plane_routes
router.get("/routes", requirePermission(permissions.planesRead), (_req, res) => {
  res.json({
    message: "List all routes.",
  });
});

router.get("/routes/:id", requirePermission(permissions.planesRead), (_req, res) => {
  res.json({
    message: "Get route by id from plane_routes.",
  });
});

router.post("/routes", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Create new route in plane_routes.",
  });
});

router.patch("/routes/:id", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Edit route in plane_routes.",
  });
});

router.delete("/routes/:id", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Delete route in plane_routes.",
  });
});

//geo_regions
router.get("/regions", requirePermission(permissions.planesRead), (_req, res) => {
  res.json({
    message: "List all regions.",
  });
});

router.get("/regions/:id", requirePermission(permissions.planesRead), (_req, res) => {
  res.json({
    message: "Get region by id from geo_regions.",
  });
});

router.post("/regions", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Create new region in geo_regions.",
  });
});

router.patch("/regions/:id", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Edit region in geo_regions.",
  });
});

router.delete("/regions/:id", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Delete region in geo_region.",
  });
});

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

router.post("/snapshots/bulk", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Bulk insert in snapshots.",
  });
});

router.post("/regions/bulk", requirePermission(permissions.planesManage), (_req, res) => {
  res.json({
    message: "Bulk insert in geo_regions.",
  });
});

export default router;