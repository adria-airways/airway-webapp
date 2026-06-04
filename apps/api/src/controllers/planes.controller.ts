import { Request, Response } from "express";
import * as planesService from "../services/planes.service.js";
import { bulkPlaneLiveSchema, bulkPlaneRouteSchema, bulkPlaneSnapshotSchema, createGeoRegionSchema, createPlaneLiveSchema, createPlaneRouteSchema, createPlaneSnapshotSchema, createSnapshotSchema, flightHistoryRouteInfoQuerySchema, nearbyAircraftQuerySchema, planeHexParameterSchema, planeIdParameterSchema, updatePlaneLiveSchema, updatePlaneRouteSchema, updatePlaneSnapshotSchema, updateRegionSchema, updateSnapshotSchema } from "../validation/planes.validation.js";

export async function getLivePlanes(_req: Request, res: Response) {
  const data = await planesService.getLivePlanes();

  res.json({ data });
}

export async function getLivePlanesSlovenia(_req: Request, res: Response) {
  const data = await planesService.getLivePlanesSlovenia();

  res.json({ data });
}

export async function getLatestSnapshot(_req: Request, res: Response) {
  const latestSnapshot = await planesService.getLatestSnapshot();

  res.json({ latestSnapshot });
}

// export async function getSnapshotById(req: Request, res: Response) {
//   const id = Number(req.params.id);

//   if (Number.isNaN(id)) {
//     return res.status(400).json({
//       error: "Invalid id",
//     });
//   }

//   const data = await planesService.getSnapshotById(id);

//   if (!data || data.length === 0) {
//     return res.status(404).json({
//       error: "Snapshot not found",
//     });
//   }

//   res.json({ data });
// }

export async function getSnapshotNavigation(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: "Invalid id",
    });
  }

  const data = await planesService.getSnapshotNavigation(id);

  if (!data.currentSnapshot) {
    return res.status(404).json({
      error: "Snapshot not found",
    });
  }

  res.json({
    data: {
      previous: data.previous,
      next: data.next,
    },
  });
}

export async function getAllLivePlanes(_req: Request, res: Response) {
  const data = await planesService.getAllLivePlanes();

  res.json({ data });
}

export async function getPlaneLiveByHex(req: Request, res: Response) {
  const parsed = planeHexParameterSchema.safeParse(req.params);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid hex parameter",
      errors: parsed.error
    });
  }

  const { hex } = parsed.data;

  const plane = await planesService.getPlaneLiveByHex(hex);

  if(!plane){
    return res.status(404).json({
      message: "Plane not found.",
    });
  }

  res.json(plane);
}

export async function createPlaneLive(req: Request, res: Response) {
  const parsed = createPlaneLiveSchema.safeParse(req.body);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid body for createPlaneLive",
      errors: parsed.error
    });
  }

  const plane = await planesService.createPlaneLive(parsed.data);
  
  res.status(201).json(plane);
}

export async function updatePlaneLive(req: Request, res: Response) {
  const parsed = updatePlaneLiveSchema.safeParse(req.body);
  const params = planeHexParameterSchema.safeParse(req.params);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid body for updatePlaneLive",
      errors: parsed.error
    });
  }

  if(!params.success){
    return res.status(400).json({
      message: "Invalid hex parameter",
      errors: params.error
    });
  }

  const plane = await planesService.updatePlaneLive(params.data.hex, parsed.data);

  if(!plane){
    return res.status(404).json({
        message: "Plane with that hex not found!",
      });
  }
  
  res.json(plane);
}

export async function deletePlaneLive(req: Request, res: Response) {
  const params = planeHexParameterSchema.safeParse(req.params);

  if(!params.success){
    return res.status(400).json({
      message: "Invalid hex parameter",
      errors: params.error
    });
  }

  const plane = await planesService.deletePlaneLive(params.data.hex);

  if(!plane){
    return res.status(404).json({
        message: "Plane with that hex not found!",
      });
  }
  
  res.json(plane);
}

export async function getPlaneSnapshot(_req: Request, res: Response) {
  const data = await planesService.getPlaneSnapshot();

  res.json({ data });
}

export async function getPlaneSnapshotById(req: Request, res: Response) {
  const parsed = planeIdParameterSchema.safeParse(req.params);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid id parameter",
      errors: parsed.error
    });
  }

  const plane = await planesService.getPlaneSnapshotById(parsed.data.id);

  if(!plane){
    return res.status(404).json({
      message: "Plane not found.",
    });
  }

  res.json(plane);
}

export async function createPlaneSnapshot(req: Request, res: Response) {
  const parsed = createPlaneSnapshotSchema.safeParse(req.body);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid body for createPlaneSnapshot",
      errors: parsed.error
    });
  }

  const plane = await planesService.createPlaneSnapshot(parsed.data);
  
  res.status(201).json(plane);
}

export async function updatePlaneSnapshot(req: Request, res: Response) {
  const parsed = updatePlaneSnapshotSchema.safeParse(req.body);
  const params = planeIdParameterSchema.safeParse(req.params);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid body for updatePlaneSnapshot",
      errors: parsed.error
    });
  }

  if(!params.success){
    return res.status(400).json({
      message: "Invalid id parameter",
      errors: params.error
    });
  }

  const plane = await planesService.updatePlaneSnapshot(params.data.id, parsed.data);

  if(!plane){
    return res.status(404).json({
        message: "Plane with that id not found!",
      });
  }
  
  res.json(plane);
}

export async function deletePlaneSnapshot(req: Request, res: Response) {
  const params = planeIdParameterSchema.safeParse(req.params);

  if(!params.success){
    return res.status(400).json({
      message: "Invalid id parameter",
      errors: params.error
    });
  }

  const plane = await planesService.deletePlaneSnapshot(params.data.id);

  if(!plane){
    return res.status(404).json({
        message: "Plane with that id not found!",
      });
  }
  
  res.json(plane);
}

export async function getSnapshots(_req: Request, res: Response) {
  const data = await planesService.getSnapshots();

  res.json({ data });
}

export async function getSnapshotById(req: Request, res: Response) {
  const parsed = planeIdParameterSchema.safeParse(req.params);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid id parameter",
      errors: parsed.error
    });
  }

  const snapshot = await planesService.getSnapshotById(parsed.data.id);

  if(!snapshot){
    return res.status(404).json({
      message: "Snapshot not found.",
    });
  }

  res.json(snapshot);
}

export async function createSnapshot(req: Request, res: Response) {
  const parsed = createSnapshotSchema.safeParse(req.body);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid body for createSnapshot",
      errors: parsed.error
    });
  }

  const snapshot = await planesService.createSnapshot(parsed.data);
  
  res.status(201).json(snapshot);
}

export async function updateSnapshot(req: Request, res: Response) {
  const parsed = updateSnapshotSchema.safeParse(req.body);
  const params = planeIdParameterSchema.safeParse(req.params);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid body for updateSnapshot",
      errors: parsed.error
    });
  }

  if(!params.success){
    return res.status(400).json({
      message: "Invalid id parameter",
      errors: params.error
    });
  }

  const snapshot = await planesService.updateSnapshot(params.data.id, parsed.data);

  if(!snapshot){
    return res.status(404).json({
        message: "Snapshot with that id not found!",
      });
  }
  
  res.json(snapshot);
}

export async function deleteSnapshot(req: Request, res: Response) {
  const params = planeIdParameterSchema.safeParse(req.params);

  if(!params.success){
    return res.status(400).json({
      message: "Invalid id parameter",
      errors: params.error
    });
  }

  const snapshot = await planesService.deleteSnapshot(params.data.id);

  if(!snapshot){
    return res.status(404).json({
        message: "Snapshot with that id not found!",
      });
  }
  
  res.json(snapshot);
}

export async function getPlaneRoutes(_req: Request, res: Response) {
  const data = await planesService.getPlaneRoutes();

  res.json({ data });
}

export async function getPlaneRouteById(req: Request, res: Response) {
  const parsed = planeIdParameterSchema.safeParse(req.params);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid id parameter",
      errors: parsed.error
    });
  }

  const planeRoute = await planesService.getPlaneRouteById(parsed.data.id);

  if(!planeRoute){
    return res.status(404).json({
      message: "Plane route not found.",
    });
  }

  res.json(planeRoute);
}

export async function createPlaneRoute(req: Request, res: Response) {
  const parsed = createPlaneRouteSchema.safeParse(req.body);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid body for createPlaneRoute",
      errors: parsed.error
    });
  }

  const planeRoute = await planesService.createPlaneRoute(parsed.data);
  
  res.status(201).json(planeRoute);
}

export async function updatePlaneRoute(req: Request, res: Response) {
  const parsed = updatePlaneRouteSchema.safeParse(req.body);
  const params = planeIdParameterSchema.safeParse(req.params);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid body for updatePlaneRoute",
      errors: parsed.error
    });
  }

  if(!params.success){
    return res.status(400).json({
      message: "Invalid id parameter",
      errors: params.error
    });
  }

  const planeRoute = await planesService.updatePlaneRoute(params.data.id, parsed.data);

  if(!planeRoute){
    return res.status(404).json({
        message: "Plane route with that id not found!",
      });
  }
  
  res.json(planeRoute);
}

export async function deletePlaneRoute(req: Request, res: Response) {
  const params = planeIdParameterSchema.safeParse(req.params);

  if(!params.success){
    return res.status(400).json({
      message: "Invalid id parameter",
      errors: params.error
    });
  }

  const planeRoute = await planesService.deletePlaneRoute(params.data.id);

  if(!planeRoute){
    return res.status(404).json({
        message: "Plane route with that id not found!",
      });
  }
  
  res.json(planeRoute);
}

export async function getRegions(_req: Request, res: Response) {
  const data = await planesService.getRegions();

  res.json({ data });
}

export async function getRegionById(req: Request, res: Response) {
  const parsed = planeIdParameterSchema.safeParse(req.params);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid id parameter",
      errors: parsed.error
    });
  }

  const region = await planesService.getRegionById(parsed.data.id);

  if(!region){
    return res.status(404).json({
      message: "Region not found.",
    });
  }

  res.json(region);
}

export async function createRegion(req: Request, res: Response) {
  const parsed = createGeoRegionSchema.safeParse(req.body);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid body for createRegion",
      errors: parsed.error
    });
  }

  const region = await planesService.createRegion(parsed.data);
  
  res.status(201).json(region);
}

export async function updateRegion(req: Request, res: Response) {
  const parsed = updateRegionSchema.safeParse(req.body);
  const params = planeIdParameterSchema.safeParse(req.params);

  if(!parsed.success){
    return res.status(400).json({
      message: "Invalid body for updateRegion",
      errors: parsed.error
    });
  }

  if(!params.success){
    return res.status(400).json({
      message: "Invalid id parameter",
      errors: params.error
    });
  }

  const region = await planesService.updateRegion(params.data.id, parsed.data);

  if(!region){
    return res.status(404).json({
        message: "Region with that id not found!",
      });
  }
  
  res.json(region);
}

export async function deleteRegion(req: Request, res: Response) {
  const params = planeIdParameterSchema.safeParse(req.params);

  if(!params.success){
    return res.status(400).json({
      message: "Invalid id parameter",
      errors: params.error
    });
  }

  const region = await planesService.deleteRegion(params.data.id);

  if(!region){
    return res.status(404).json({
        message: "Region with that id not found!",
      });
  }
  
  res.json(region);
}

export async function bulkInsertPlaneLive(req: Request, res: Response) {
  const parsed = bulkPlaneLiveSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid bulk payload",
      errors: parsed.error,
    });
  }

  const result = await planesService.bulkInsertPlaneLive(parsed.data.planes);

  res.status(201).json({
    inserted: result.length,
  });
}

export async function bulkInsertPlaneSnapshot(req: Request, res: Response) {
  const parsed = bulkPlaneSnapshotSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid bulk payload",
      errors: parsed.error,
    });
  }

  const result = await planesService.bulkInsertPlaneSnapshot(parsed.data.planes);

  res.status(201).json({
    inserted: result.length,
  });
}

export async function bulkInsertPlaneRoute(req: Request, res: Response) {
  const parsed = bulkPlaneRouteSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid bulk payload",
      errors: parsed.error,
    });
  }

  const result = await planesService.bulkInsertPlaneRoute(parsed.data.routes);

  res.status(201).json({
    inserted: result.length,
  });
}

export async function getFlightHistory(req: Request, res: Response) {
  const parsed = flightHistoryRouteInfoQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid query params for flight history",
      errors: parsed.error,
    });
  }

  const { hex, callsign } = parsed.data;

  const data = await planesService.getFlightHistory(hex, callsign);

  res.json({ data });
}

export async function getRouteInfo(req: Request, res: Response) {
  const parsed = flightHistoryRouteInfoQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid query params for route info",
      errors: parsed.error,
    });
  }

  const { hex, callsign } = parsed.data;

  const data = await planesService.getRouteInfo(hex, callsign);

  res.json({ data });
}

export async function getNearbyPlanes(req: Request, res: Response) {
  const parsed = nearbyAircraftQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid query params for nearby planes",
      errors: parsed.error,
    });
  }

  const { latitude, longitude, radius } = parsed.data;

  const data = await planesService.getNearbyPlanes(longitude, latitude, radius);

  res.json({ data });
}

export async function getStats(req: Request, res: Response) {
  const data = await planesService.getStats();

  res.json({ data });
}