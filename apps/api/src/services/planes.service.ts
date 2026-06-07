import { db, geoRegions, planeLive, planeRoutes, planeSnapshots, snapshots, sql, asc, desc, eq, gt, lt, and } from "db";
import { GeoRegionInput, PlaneLiveInput, PlaneRouteInput, PlaneSnapshotInput, SnapshotInput, UpdateGeoRegionInput, UpdatePlaneLiveInput, UpdatePlaneRouteInput, UpdatePlaneSnapshotInput, UpdateSnapshotInput } from "../validation/planes.validation";

export async function getLivePlanes() {
  return await db
    .select()
    .from(planeLive)
    .leftJoin(
      planeRoutes,
      sql`
        ${planeLive.hex} = ${planeRoutes.hex}
        AND ${planeLive.callsign} = ${planeRoutes.callsign}
      `
    );
}

export async function getLivePlanesSlovenia() {
  return await db.execute(
    `
    SELECT *
    FROM plane_live
    WHERE latitude IS NOT NULL
    AND longitude IS NOT NULL
    AND ST_Contains(
    ST_GeomFromGeoJSON(
      (
        SELECT geo_json
        FROM geo_regions
        WHERE name = 'Slovenia'
      )
    ),
    ST_SetSRID(
      ST_MakePoint(longitude, latitude),
      4326
    )
  );
    `
  )
}

export async function getLatestSnapshot() {
  const [latestSnapshot] = await db
    .select()
    .from(snapshots)
    .orderBy(
      desc(snapshots.snapshotTime)
    )
    .limit(1);

  return latestSnapshot ?? null;
}

export async function getSnapshotNavigation(id: number) {
  const [currentSnapshot] = await db
    .select()
    .from(snapshots)
    .where(eq(snapshots.id, id));

  if (!currentSnapshot) {
    return {
      currentSnapshot: null,
      previous: null,
      next: null,
    };
  }

  const [previous] = await db
    .select()
    .from(snapshots)
    .where(
      lt(
        snapshots.snapshotTime,
        currentSnapshot.snapshotTime
      )
    )
    .orderBy(
      desc(snapshots.snapshotTime)
    )
    .limit(1);

  const [next] = await db
    .select()
    .from(snapshots)
    .where(
      gt(
        snapshots.snapshotTime,
        currentSnapshot.snapshotTime
      )
    )
    .orderBy(
      asc(snapshots.snapshotTime)
    )
    .limit(1);

  return {
    currentSnapshot,
    previous: previous ?? null,
    next: next ?? null,
  };
}

export async function getAllLivePlanes() {
  return await db
    .select()
    .from(planeLive);
}

export async function getPlaneLiveByHex(hex: string) {
  const [plane] = await db
    .select()
    .from(planeLive)
    .where(eq(planeLive.hex, hex))
    .limit(1);

  return plane ?? null;
}

export async function createPlaneLive(input: PlaneLiveInput) {
  const [plane] = await db.insert(planeLive).values(input).returning();

  return plane ?? null;
}

export async function updatePlaneLive(hex: string, input: UpdatePlaneLiveInput) {
  const [plane] = await db
    .update(planeLive)
    .set(input)
    .where(eq(planeLive.hex, hex))
    .returning();

  return plane ?? null;
}

export async function deletePlaneLive(hex: string) {
  const [plane] = await db
    .delete(planeLive)
    .where(eq(planeLive.hex, hex))
    .returning();

  return plane ?? null;
}

export async function getPlaneSnapshot() {
  return await db
    .select()
    .from(planeSnapshots);
}

export async function getPlaneSnapshotById(id: number) {
  const [plane] = await db
    .select()
    .from(planeSnapshots)
    .where(eq(planeSnapshots.id, id))
    .limit(1);

  return plane ?? null;
}

export async function getPlanesFromSnapshotById(id: number) {
  return await db
    .select()
    .from(planeSnapshots)
    .where(eq(planeSnapshots.snapshotId, id));
}

export async function createPlaneSnapshot(input: PlaneSnapshotInput) {
  const [plane] = await db.insert(planeSnapshots).values(input).returning();

  return plane ?? null;
}

export async function updatePlaneSnapshot(id: number, input: UpdatePlaneSnapshotInput) {
  const [plane] = await db
    .update(planeSnapshots)
    .set(input)
    .where(eq(planeSnapshots.id, id))
    .returning();

  return plane ?? null;
}

export async function deletePlaneSnapshot(id: number) {
  const [plane] = await db
    .delete(planeSnapshots)
    .where(eq(planeSnapshots.id, id))
    .returning();

  return plane ?? null;
}

export async function getPlaneRoutes() {
  return await db
    .select()
    .from(planeRoutes);
}

export async function getPlaneRouteById(id: number) {
  const [planeRoute] = await db
    .select()
    .from(planeRoutes)
    .where(eq(planeRoutes.id, id))
    .limit(1);

  return planeRoute ?? null;
}

export async function createPlaneRoute(input: PlaneRouteInput) {
  const [planeRoute] = await db.insert(planeRoutes).values(input).returning();

  return planeRoute ?? null;
}

export async function updatePlaneRoute(id: number, input: UpdatePlaneRouteInput) {
  const [planeRoute] = await db
    .update(planeRoutes)
    .set(input)
    .where(eq(planeRoutes.id, id))
    .returning();

  return planeRoute ?? null;
}

export async function deletePlaneRoute(id: number) {
  const [planeRoute] = await db
    .delete(planeRoutes)
    .where(eq(planeRoutes.id, id))
    .returning();

  return planeRoute ?? null;
}

export async function getSnapshots() {
  const recentSnapshots = await db
    .select()
    .from(snapshots)
    .orderBy(desc(snapshots.snapshotTime))
    .limit(720);

  return recentSnapshots.reverse();
}

export async function getSnapshotById(id: number) {
  const [snapshot] = await db
    .select()
    .from(snapshots)
    .where(eq(snapshots.id, id))
    .limit(1);

  return snapshot ?? null;
}

export async function createSnapshot(input: SnapshotInput) {
  const [snapshot] = await db.insert(snapshots).values(input).returning();

  return snapshot ?? null;
}

export async function updateSnapshot(id: number, input: UpdateSnapshotInput) {
  const [snapshot] = await db
    .update(snapshots)
    .set(input)
    .where(eq(snapshots.id, id))
    .returning();

  return snapshot ?? null;
}

export async function deleteSnapshot(id: number) {
  const [snapshot] = await db
    .delete(snapshots)
    .where(eq(snapshots.id, id))
    .returning();

  return snapshot ?? null;
}

export async function getRegions() {
  return await db
    .select()
    .from(geoRegions);
}

export async function getRegionById(id: number) {
  const [region] = await db
    .select()
    .from(geoRegions)
    .where(eq(geoRegions.id, id))
    .limit(1);

  return region ?? null;
}

export async function createRegion(input: GeoRegionInput) {
  const [region] = await db.insert(geoRegions).values(input).returning();

  return region ?? null;
}

export async function updateRegion(id: number, input: UpdateGeoRegionInput) {
  const [region] = await db
    .update(geoRegions)
    .set(input)
    .where(eq(geoRegions.id, id))
    .returning();

  return region ?? null;
}

export async function deleteRegion(id: number) {
  const [region] = await db
    .delete(geoRegions)
    .where(eq(geoRegions.id, id))
    .returning();

  return region ?? null;
}

export async function bulkInsertPlaneLive(planes: PlaneLiveInput[]) {
  return await db
    .insert(planeLive)
    .values(planes)
    .onConflictDoNothing()
    .returning();
}

export async function bulkInsertPlaneSnapshot(planes: PlaneSnapshotInput[]) {
  return await db
    .insert(planeSnapshots)
    .values(planes)
    .onConflictDoNothing()
    .returning();
}

export async function bulkInsertPlaneRoute(routes: PlaneRouteInput[]) {
  return await db
    .insert(planeRoutes)
    .values(routes)
    .onConflictDoNothing()
    .returning();
}

export async function getFlightHistory(hex: string, callsign: string) {
  return await db
    .select()
    .from(planeSnapshots)
    .where(
      and(
        eq(planeSnapshots.hex, hex),
        eq(planeSnapshots.callsign, callsign)
      )
    )
    .orderBy(
      desc(planeSnapshots.snapshotTime)
    )
}

export async function getRouteInfo(hex: string, callsign: string) {
  return await db
    .select()
    .from(planeRoutes)
    .where(
      and(
        eq(planeRoutes.hex, hex),
        eq(planeRoutes.callsign, callsign)
      )
    )
    .limit(1);
}

export async function getNearbyPlanes(lon: number, lat: number, radius: number) {
  return await db.execute(
    `
    SELECT *
    FROM plane_live
    WHERE latitude IS NOT NULL
    AND longitude IS NOT NULL
    AND ST_DWithin(
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
    ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography,
    ${radius}
  );
    `
  );
}

export async function getStats() {
  const [live] = await db.execute(`SELECT COUNT(*) FROM plane_live`);

  const [slovenia] = await db.execute(
    `
    SELECT COUNT(*)
    FROM plane_live
    WHERE latitude IS NOT NULL
      AND longitude IS NOT NULL
      AND ST_Contains(
      ST_GeomFromGeoJSON(
      (
        SELECT geo_json
        FROM geo_regions
        WHERE name = 'Slovenia'
      )
      ),
      ST_SetSRID(
      ST_MakePoint(longitude, latitude),
      4326
    )
  );
  `
);

  const [last24hSnapshotInfo] = await db.execute(
    `
    SELECT
      COUNT(*) as snapshots,
      ROUND(AVG(aircraft_count)) as avg_planes,
      MAX(aircraft_count) as max_planes,
      MIN(aircraft_count) as min_planes
    FROM snapshots
    WHERE snapshot_time >= NOW() - INTERVAL '24 hours';
  `);

  return {
    live: {
      planes_count: live.count,
    },
    slovenia: {
      planes_count: slovenia.count,
    },
    last24h_snapshot_info: last24hSnapshotInfo,
  };
}
