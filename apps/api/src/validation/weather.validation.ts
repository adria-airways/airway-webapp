import { z } from "zod";

export const locationParameterSchema = z.object({
  id: z.string().min(1).max(16),
});

export const createLocationSchema = z.object({
  id: z.string().min(1).max(16),
  title: z.string().min(1).max(64),
  country: z.string().length(2),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const updateLocationSchema = createLocationSchema
  .omit({ id: true })
  .partial();

export const readingsQuerySchema = z.object({
  locationId: z.string().min(1).max(16).optional(),
  resolution: z.string().min(1).max(3).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(500).default(100),
});

export const readingIdParameterSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const readingDataSchema = z.object({
  validAt: z.coerce.date(),
  tempC: z.number().int().optional(),
  tempMinC: z.number().int().optional(),
  tempMaxC: z.number().int().optional(),
  rhPct: z.number().int().min(0).max(100).optional(),
  mslHpa: z.number().int().optional(),
  windKmh: z.number().int().min(0).optional(),
  gustKmh: z.number().int().min(0).optional(),
  windDir: z.string().max(2).optional(),
  precipMm: z.number().min(0).optional(),
  iconCode: z.string().max(32).optional(),
});

export const createReadingSchema = readingDataSchema.extend({
  locationId: z.string().min(1).max(16),
  resolution: z.string().min(1).max(3),
});

export const updateReadingSchema = readingDataSchema.partial();

export const bulkReadingsSchema = z.object({
  resolution: z.string().min(1).max(3),
  source: z.string().optional(),
  readings: z.array(readingDataSchema).min(1).max(500),
});

export type LocationParameters = z.infer<typeof locationParameterSchema>;
export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
export type ReadingsQueryInput = z.infer<typeof readingsQuerySchema>;
export type ReadingDataInput = z.infer<typeof readingDataSchema>;
export type BulkReadingsInput = z.infer<typeof bulkReadingsSchema>;

export type ReadingIdParameters = z.infer<typeof readingIdParameterSchema>;
export type CreateReadingInput = z.infer<typeof createReadingSchema>;
export type UpdateReadingInput = z.infer<typeof updateReadingSchema>;
