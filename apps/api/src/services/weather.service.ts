import { db, eq, locations } from "db";

import type {
  CreateLocationInput,
  UpdateLocationInput,
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
