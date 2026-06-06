import {
  db,
  eq,
  locations,
  and,
  gte,
  lte,
  readings,
  sql,
  desc,
  asc,
  or,
} from "db";

import {
  type CreateLocationInput,
  type CreateReadingInput,
  type ReadingsQueryInput,
  type UpdateLocationInput,
  type UpdateReadingInput,
  type BulkReadingsInput,
  type weatherReadingNearQuerySchema,
} from "../validation/weather.validation.js";

export async function listLocations() {
  return db.select().from(locations);
}

export async function getLocationWithId(id: string) {
  const [location] = await db
    .select()
    .from(locations)
    .where(eq(locations.id, id))
    .limit(1);

  return location ?? null;
}

export async function createLocation(input: CreateLocationInput) {
  const [location] = await db.insert(locations).values(input).returning();

  return location;
}

export async function updateLocation(id: string, input: UpdateLocationInput) {
  const [location] = await db
    .update(locations)
    .set(input)
    .where(eq(locations.id, id))
    .returning();

  return location ?? null;
}

export async function deleteLocation(id: string) {
  const [location] = await db
    .delete(locations)
    .where(eq(locations.id, id))
    .returning();

  return location ?? null;
}

export async function listReadings(input: ReadingsQueryInput) {
  const filters = [
    input.locationId ? eq(readings.locationId, input.locationId) : undefined,
    input.resolution ? eq(readings.resolution, input.resolution) : undefined,
    input.from ? gte(readings.validAt, input.from) : undefined,
    input.to ? lte(readings.validAt, input.to) : undefined,
  ].filter((filter) => filter !== undefined);

  return db
    .select()
    .from(readings)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .limit(input.limit);
}

export async function getReadingWithId(id: number) {
  const [reading] = await db
    .select()
    .from(readings)
    .where(eq(readings.id, id))
    .limit(1);

  return reading ?? null;
}

export async function createReading(input: CreateReadingInput) {
  const [reading] = await db.insert(readings).values(input).returning();

  return reading;
}

export async function updateReading(id: number, input: UpdateReadingInput) {
  const [reading] = await db
    .update(readings)
    .set(input)
    .where(eq(readings.id, id))
    .returning();

  return reading ?? null;
}

export async function deleteReading(id: number) {
  const [reading] = await db
    .delete(readings)
    .where(eq(readings.id, id))
    .returning();

  return reading ?? null;
}

export async function bulkUpsertReadingsForLocation(
  locationId: string,
  input: BulkReadingsInput,
) {
  const location = await getLocationWithId(locationId);

  if (!location) {
    return null;
  }
  const fetchedAt = new Date();

  await db
    .insert(readings)
    .values(
      input.readings.map((reading) => ({
        locationId,
        resolution: input.resolution,
        validAt: reading.validAt,
        tempC: reading.tempC,
        tempMinC: reading.tempMinC,
        tempMaxC: reading.tempMaxC,
        rhPct: reading.rhPct,
        mslHpa: reading.mslHpa,
        windKmh: reading.windKmh,
        gustKmh: reading.gustKmh,
        windDir: reading.windDir,
        precipMm: reading.precipMm,
        iconCode: reading.iconCode,
        fetchedAt,
      })),
    )
    .onConflictDoUpdate({
      target: [readings.locationId, readings.resolution, readings.validAt],
      set: {
        tempC: sql`excluded.temp_c`,
        tempMinC: sql`excluded.temp_min_c`,
        tempMaxC: sql`excluded.temp_max_c`,
        rhPct: sql`excluded.rh_pct`,
        mslHpa: sql`excluded.msl_hpa`,
        windKmh: sql`excluded.wind_kmh`,
        gustKmh: sql`excluded.gust_kmh`,
        windDir: sql`excluded.wind_dir`,
        precipMm: sql`excluded.precip_mm`,
        iconCode: sql`excluded.icon_code`,
        fetchedAt,
      },
    });

  return {
    locationId,
    resolution: input.resolution,
    upserted: input.readings.length,
  };
}

export async function listAppLocations() {
  return listLocations();
}

export async function getCurrentWeatherForLocation(locationId: string) {
  const location = await getLocationWithId(locationId);

  if (!location) {
    return null;
  }

  const [current] = await db
    .select()
    .from(readings)
    .where(
      and(
        eq(readings.locationId, locationId),
        eq(readings.resolution, "obs"),
        lte(readings.validAt, new Date()),
      ),
    )
    .orderBy(desc(readings.validAt))
    .limit(1);

  return {
    location,
    current: current ?? null,
  };
}

export async function getWeatherReadingNearTime(
  locationId: string,
  input: weatherReadingNearQuerySchema,
) {
  const location = await getLocationWithId(locationId);
  if (!location) {
    return null;
  }

  const windowStart = new Date(input.at.getTime() - 3 * 60 * 60 * 1000);
  const windowEnd = new Date(input.at.getTime() + 3 * 60 * 60 * 1000);

  const [reading] = await db
    .select()
    .from(readings)
    .where(
      and(
        eq(readings.locationId, locationId),
        gte(readings.validAt, windowStart),
        lte(readings.validAt, windowEnd),
      ),
    )
    .orderBy(sql`ABS(EXTRACT(EPOCH FROM (${readings.validAt} - ${input.at})))`)
    .limit(1);

  return {
    location,
    reading: reading ?? null,
  };
}

export async function getForecastForLocation(locationId: string) {
  const location = await getLocationWithId(locationId);

  if (!location) {
    return null;
  }
  const now = new Date();

  const forecast = await db
    .select()
    .from(readings)
    .where(and(eq(readings.locationId, locationId), gte(readings.validAt, now)))
    .orderBy(readings.validAt)
    .limit(48);

  return {
    location,
    forecast,
  };
}
