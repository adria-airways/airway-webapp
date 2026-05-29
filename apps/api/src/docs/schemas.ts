import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import {
  bulkReadingsSchema,
  createLocationSchema,
  createReadingSchema,
  readingsQuerySchema,
  updateLocationSchema,
  updateReadingSchema,
} from "../validation/weather.validation.js";

const healthResponseSchema = z
  .object({
    ok: z.boolean(),
    message: z.string(),
  })
  .meta({ id: "HealthResponse" });

const schemas = [
  healthResponseSchema,
  createLocationSchema.meta({ id: "CreateLocation" }),
  updateLocationSchema.meta({ id: "UpdateLocation" }),
  readingsQuerySchema.meta({ id: "ReadingsQuery" }),
  createReadingSchema.meta({ id: "CreateReading" }),
  updateReadingSchema.meta({ id: "UpdateReading" }),
  bulkReadingsSchema.meta({ id: "BulkReadings" }),
];

const generator = new OpenApiGeneratorV31(schemas);

export const openApiComponents =
  generator.generateComponents().components ?? {};
