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

  callsign: z.string().max(16).optional(),

  airline: z.string().max(64).optional(),

  flyingFromCountry: z.string().max(64).optional(),
  flyingFromLatitude: z.number().min(-90).max(90).optional(),
  flyingFromLongitude: z.number().min(-180).max(180).optional(),
  flyingFromCity: z.string().max(64).optional(),
  flyingFromAirport: z.string().max(64).optional(),

  flyingToCountry: z.string().max(64).optional(),
  flyingToLatitude: z.number().min(-90).max(90).optional(),
  flyingToLongitude: z.number().min(-180).max(180).optional(),
  flyingToCity: z.string().max(64).optional(),
  flyingToAirport: z.string().max(64).optional(),

  createdAt: z.coerce.date(),
});

export const createPlaneRouteSchema = planeRouteSchema.omit({
  id: true,
  createdAt: true,
});

export const updatePlaneRouteSchema = createPlaneRouteSchema.partial();

export const planeSchema = z.object({
  id: z.coerce.number().int().positive(),

  snapshotId: z.coerce.number().int().positive(),

  hex: z.string().max(16),

  snapshotTime: z.coerce.date(),

  callsign: z.string().max(16).optional(),

  originCountry: z.string().max(64).optional(),

  latitude: z.number().min(-90).max(90).optional(),

  longitude: z.number().min(-180).max(180).optional(),

  baroAltitude: z.number()
    .min(-500)
    .max(14000)
    .optional(),

  onGround: z.boolean().optional(),

  groundSpeed: z.number()
    .min(0)
    .max(1200)
    .optional(),

  heading: z.number()
    .min(0)
    .max(359)
    .optional(),

  verticalRate: z.number()
    .min(-200)
    .max(200)
    .optional(),

  spi: z.boolean().optional(),

  flyingToAirport: z.string()
    .max(64)
    .optional(),

  createdAt: z.coerce.date(),
});

export const createPlaneSchema = planeSchema.omit({
  id: true,
  createdAt: true,
});

export const updatePlaneSchema = createPlaneSchema.partial();

export const snapshotSchema = z.object({
  id: z.coerce.number().int().positive(),

  snapshotTime: z.coerce.date(),

  aircraftCount: z.number()
    .int()
    .min(0),
});

export const createSnapshotSchema =
  snapshotSchema.omit({
    id: true,
  });

export const updateSnapshotSchema = createSnapshotSchema.partial();

export const geoRegionSchema = z.object({
  id: z.coerce.number().int().positive(),

  name: z.string()
    .min(1)
    .max(64),

  geoJson: z.string(),

});

export const createGeoRegionSchema =
  geoRegionSchema.omit({
    id: true,
  });

export const updateRegionSchema = createGeoRegionSchema.partial();

export const bulkPlaneLiveSchema = z.object({
  planes: z.array(createPlaneSchema)
    .min(1)
    .max(10000),
});

export const bulkPlaneSnapshotSchema = z.object({
  snapshotId: z.coerce.number()
    .int()
    .positive(),

  planes: z.array(createPlaneSchema)
    .min(1)
    .max(10000),
});

export type PlaneHexParameter = z.infer<typeof planeHexParameterSchema>;
export type PlaneIdParameter = z.infer<typeof planeIdParameterSchema>;
export type PlaneRouteInput = z.infer<typeof createPlaneRouteSchema>;
export type UpdatePlaneRouteInput = z.infer<typeof updatePlaneRouteSchema>;
export type PlaneInput = z.infer<typeof createPlaneSchema>;
export type UpdatePlaneInput = z.infer<typeof updatePlaneSchema>;
export type SnapshotInput = z.infer<typeof createSnapshotSchema>;
export type GeoRegionInput = z.infer<typeof createGeoRegionSchema>;