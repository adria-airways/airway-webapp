import { z } from "zod";

export const planeHexParameterSchema = z.object({
  hex: z.string().min(1).max(16),
});

export const planeIdParameterSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const planeRouteSchema = z.object({
  id: z.coerce.number().int().positive(),
  hex: z.string().max(16),
  callsign: z.string().max(16),
  airline: z.string().max(64).optional(),
  flyingFromCountry: z.string().max(64).optional(),
  flyingFromLatitude: z.number().min(-90).max(90).optional(),
  flyingFromLongitude: z.number().min(-180).max(180).optional(),
  flyingFromCity: z.string().max(64).optional(),
  flyingFromAirport: z.string().max(200).optional(),
  flyingToCountry: z.string().max(64).optional(),
  flyingToLatitude: z.number().min(-90).max(90).optional(),
  flyingToLongitude: z.number().min(-180).max(180).optional(),
  flyingToCity: z.string().max(64).optional(),
  flyingToAirport: z.string().max(200).optional(),
  createdAt: z.coerce.date(),
});

export const createPlaneRouteSchema = planeRouteSchema.omit({
  id: true,
  createdAt: true,
});

export const updatePlaneRouteSchema = createPlaneRouteSchema.partial();

export const planeSnapshotSchema = z.object({
  id: z.coerce.number().int().positive(),
  snapshotId: z.coerce.number().int().positive(),
  hex: z.string().max(16),
  snapshotTime: z.coerce.date(),
  callsign: z.string().max(16).optional(),
  originCountry: z.string().max(64).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  baroAltitude: z.number().min(0).max(14000).optional(),
  onGround: z.boolean(),
  groundSpeed: z.number().min(0).max(1200).optional(),
  heading: z.number().min(0).max(360).optional(),
  verticalRate: z.number().min(-100).max(100).optional(),
  spi: z.boolean(),
});

export const createPlaneSnapshotSchema = planeSnapshotSchema.omit({
  id: true,
});

export const updatePlaneSnapshotSchema = createPlaneSnapshotSchema.partial();

export const planeLiveSchema = z.object({
  hex: z.string().max(16),
  snapshotTime: z.coerce.date(),
  callsign: z.string().max(16).optional(),
  originCountry: z.string().max(64).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  baroAltitude: z.number().min(0).max(14000).optional(),
  onGround: z.boolean(),
  groundSpeed: z.number().min(0).max(1200).optional(),
  heading: z.number().min(0).max(360).optional(),
  verticalRate: z.number().min(-100).max(100).optional(),
  spi: z.boolean(),
});

export const createPlaneLiveSchema = planeLiveSchema;

export const updatePlaneLiveSchema = createPlaneLiveSchema.partial();

export const snapshotSchema = z.object({
  id: z.coerce.number().int().positive(),
  snapshotTime: z.coerce.date(),
  aircraftCount: z.number().int().min(0),
});

export const createSnapshotSchema =
  snapshotSchema.omit({
    id: true,
  });

export const updateSnapshotSchema = createSnapshotSchema.partial();

export const geoRegionSchema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().min(1).max(64),
  geoJson: z.string(),
});

export const createGeoRegionSchema = geoRegionSchema.omit({
    id: true,
  });

export const updateRegionSchema = createGeoRegionSchema.partial();

export const bulkPlaneLiveSchema = z.object({
  planes: z.array(createPlaneLiveSchema).min(1).max(10000),
});

export const bulkPlaneSnapshotSchema = z.object({
  planes: z.array(createPlaneSnapshotSchema).min(1).max(10000),
});

export const bulkPlaneRouteSchema = z.object({
  routes: z.array(createPlaneRouteSchema).min(1).max(10000),
});

export type PlaneHexParameter = z.infer<typeof planeHexParameterSchema>;
export type PlaneIdParameter = z.infer<typeof planeIdParameterSchema>;
export type PlaneRouteInput = z.infer<typeof createPlaneRouteSchema>;
export type UpdatePlaneRouteInput = z.infer<typeof updatePlaneRouteSchema>;
export type PlaneLiveInput = z.infer<typeof createPlaneLiveSchema>;
export type UpdatePlaneLiveInput = z.infer<typeof updatePlaneLiveSchema>;
export type PlaneSnapshotInput = z.infer<typeof createPlaneSnapshotSchema>;
export type UpdatePlaneSnapshotInput = z.infer<typeof updatePlaneSnapshotSchema>;
export type SnapshotInput = z.infer<typeof createSnapshotSchema>;
export type GeoRegionInput = z.infer<typeof createGeoRegionSchema>;
export type UpdateSnapshotInput = z.infer<typeof updateSnapshotSchema>;
export type UpdateGeoRegionInput = z.infer<typeof updateRegionSchema>;
export type BulkPlaneLiveInput = z.infer<typeof bulkPlaneLiveSchema>;
export type BulkPlaneSnapshotInput = z.infer<typeof bulkPlaneSnapshotSchema>;
export type BulkPlaneRouteInput = z.infer<typeof bulkPlaneRouteSchema>;