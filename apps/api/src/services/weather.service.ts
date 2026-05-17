import { db, eq, locations, and, gte, lte, readings } from "db";

import {
  type CreateLocationInput,
  type CreateReadingInput,
  type ReadingsQueryInput,
  type UpdateLocationInput,
  type UpdateReadingInput,
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
