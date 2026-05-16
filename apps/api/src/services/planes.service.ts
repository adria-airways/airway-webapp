import { db, planeLive, planeRoutes, planeSnapshots, snapshots, sql } from "db";
import { asc, desc, eq, gt, lt } from "drizzle-orm";

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

export async function getSnapshotById(id: number) {
  return await db
    .select()
    .from(planeSnapshots)
    .leftJoin(
      planeRoutes,
      sql`
        ${planeSnapshots.hex} = ${planeRoutes.hex}
        AND ${planeSnapshots.callsign} = ${planeRoutes.callsign}
      `
    )
    .where(
      eq(planeSnapshots.snapshotId, id)
    );
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