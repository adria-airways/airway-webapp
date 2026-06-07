import cron from "node-cron";
import axios from "axios";
import { db, snapshots, planeSnapshots, planeLive, sql, planeRoutes } from "db";

const API_URL =
  "https://opensky-network.org/api/states/all?lamin=45&lomin=12.8&lamax=47.1&lomax=16.8";
const OPENSKY_TOKEN_URL =
  "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token";
const HTTP_TIMEOUT_MS = 10_000;
const STEP_TIMEOUT_MS = 25_000;

let isFetchingPlanes = false;
let openskyToken: string | null = null;
let openskyTokenExpiresAt = 0;

function toInt(value: unknown): number | null {
  if (value == null || value === "") {
    return null;
  }

  return Math.round(Number(value));
}

function toFloat(value: unknown): number | null {
  if (value == null || value === "") {
    return null;
  }

  return Number(value);
}

async function withTimeout<T>(
  promise: Promise<T>,
  label: string,
  timeoutMs = STEP_TIMEOUT_MS,
): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
          reject(new Error(`[planes-cron] ${label} timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

async function getOpenSkyToken() {
  const clientId = process.env.OPENSKY_CLIENT_ID;
  const clientSecret = process.env.OPENSKY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  if (openskyToken && Date.now() < openskyTokenExpiresAt - 60_000) {
    return openskyToken;
  }

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const { data } = await axios.post(OPENSKY_TOKEN_URL, params, {
    timeout: HTTP_TIMEOUT_MS,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  openskyToken = data.access_token;
  openskyTokenExpiresAt = Date.now() + (data.expires_in ?? 1800) * 1000;

  return openskyToken;
}

async function fetchOpenskyStates() {
  const token = await getOpenSkyToken();

  try {
    const { data } = await axios.get(API_URL, {
      timeout: HTTP_TIMEOUT_MS,
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    return data;
  } catch (error: any) {
    if (error.response?.status !== 401 || !token) {
      throw error;
    }
    openskyToken = null;
    openskyTokenExpiresAt = 0;

    const refreshedToken = await getOpenSkyToken();
    const { data } = await axios.get(API_URL, {
      timeout: HTTP_TIMEOUT_MS,
      headers: refreshedToken
        ? {
            Authorization: `Bearer ${refreshedToken}`,
          }
        : undefined,
    });

    return data;
  }
}

async function cleanSnapshots() {
  await db.execute(
    sql`DELETE FROM snapshots WHERE snapshot_time < NOW() - INTERVAL '5 days'`,
  );
}

async function cleanRoutes() {
  await db.execute(
    sql`DELETE FROM plane_routes WHERE created_at < NOW() - INTERVAL '5 days'`,
  );
}

async function fetchRoute(callsign: string) {
  try {
    const res = await axios.get(
      `https://api.adsbdb.com/v0/callsign/${callsign}`,
      {
        timeout: HTTP_TIMEOUT_MS,
      },
    );

    return res.data;
  } catch (err) {
    return null;
  }
}

async function fetchPlaneData() {
  if (isFetchingPlanes) {
    console.log("[planes-cron] previous run still active, skipping");
    return;
  }

  isFetchingPlanes = true;

  try {
    console.log(`[planes-cron] Starting at ${new Date().toISOString()}`);

    const data = await withTimeout(fetchOpenskyStates(), "OpenSky fetch");

    if (!data?.states) {
      console.log("No data from openSky");
      return;
    }

    const time = data.time;
    const states = data.states;

    console.log(`[planes-cron] OpenSky returned ${states.length} states`);

    const snapshotRows = await withTimeout(
      db
        .insert(snapshots)
        .values({
          snapshotTime: new Date(time * 1000),
          aircraftCount: states.length,
        })
        .returning(),
      "snapshot insert",
    ) as Array<{ id: number }>;
    const [snapshot] = snapshotRows;

    const snapshotId = snapshot.id;

    const rows = [
      ...new Map(
        states
          .map((state: any[]) => {
            const hex = state[0]?.trim();

            if (!hex) {
              return null;
            }

            return {
              hex,
              snapshotTime: new Date(time * 1000),
              callsign: state[1]?.trim() ?? null,

              originCountry: state[2],
              latitude: toFloat(state[6]) ?? null,
              longitude: toFloat(state[5]) ?? null,
              baroAltitude: toFloat(state[7]) ?? null,
              onGround: state[8],
              groundSpeed: toFloat(state[9]) ?? null,
              heading: toFloat(state[10]) ?? null,
              verticalRate: toFloat(state[11]) ?? null,
              spi: state[15],
            };
          })
          .filter((row): row is NonNullable<typeof row> => row !== null)
          .map((row) => [row.hex, row]),
      ).values(),
    ];

    if (rows.length === 0) {
      console.log("empty readings");
      return;
    }

    type PlaneIdentifier = {
      hex: string;
      callsign: string;
    };

    const planes: PlaneIdentifier[] = [
      ...new Map<string, PlaneIdentifier>(
        rows
          .filter((r: any) => r.callsign)
          .map((r: any) => [
            `${r.hex}:${r.callsign}`,
            {
              hex: r.hex,
              callsign: r.callsign!,
            },
          ]),
      ).values(),
    ];

    const existingRoutes = await withTimeout(
      db
        .select({
          hex: planeRoutes.hex,
          callsign: planeRoutes.callsign,
        })
        .from(planeRoutes),
      "existing route lookup",
    ) as Array<{ hex: string; callsign: string }>;

    const existingSet = new Set(
      existingRoutes.map((r) => `${r.hex}:${r.callsign}`),
    );

    const missingRoutes = planes.filter(
      (p) => !existingSet.has(`${p.hex}:${p.callsign}`),
    );

    let failed = 0;

    const routeMap = new Map<string, any>();

    await withTimeout(
      (async () => {
        for (const missingRoute of missingRoutes) {
          const res = await fetchRoute(missingRoute.callsign);

          if (!res || !res.response?.flightroute) {
            failed++;
            continue;
          }

          routeMap.set(missingRoute.callsign, res.response.flightroute);
        }
      })(),
      "ADSBDB route enrichment",
    );

    const rowsWithRouteData = rows
      .filter((r: any) => r.callsign)
      .map((r: any) => {
        const route = routeMap.get(r.callsign);

        return {
          hex: r.hex,
          callsign: r.callsign,

          airline: route?.airline?.name ?? null,

          flyingFromCountry: route?.origin?.country_name ?? null,
          flyingFromLatitude: route?.origin?.latitude ?? null,
          flyingFromLongitude: route?.origin?.longitude ?? null,
          flyingFromCity: route?.origin?.municipality ?? null,
          flyingFromAirport: route?.origin?.name ?? null,

          flyingToCountry: route?.destination?.country_name ?? null,
          flyingToLatitude: route?.destination?.latitude ?? null,
          flyingToLongitude: route?.destination?.longitude ?? null,
          flyingToCity: route?.destination?.municipality ?? null,
          flyingToAirport: route?.destination?.name ?? null,
        };
      });

    await withTimeout(
      db.transaction(async (t) => {
        await t.delete(planeLive);
        await t.insert(planeLive).values(rows).onConflictDoNothing();
      }),
      "live plane update",
    );

    const historyRows = rows.map((r: any) => ({
      ...r,
      snapshotId,
    }));

    await withTimeout(
      db.insert(planeSnapshots).values(historyRows),
      "plane snapshot insert",
    );
    if (rowsWithRouteData.length > 0) {
      await withTimeout(
        db
          .insert(planeRoutes)
          .values(rowsWithRouteData)
          .onConflictDoNothing(),
        "route insert",
      );
    }

    await withTimeout(cleanSnapshots(), "snapshot cleanup");
    await withTimeout(cleanRoutes(), "route cleanup");

    console.log(
      `[planes-cron] adsbdb failed lookups: ${failed}/${missingRoutes.length}`,
    );
    console.log("[planes-cron] done");
  } finally {
    isFetchingPlanes = false;
  }
}

export function startPlanesCronjob() {
  cron.schedule("*/30 * * * * *", runPlaneCron);
}

function runPlaneCron() {
  fetchPlaneData().catch((error) => {
    console.error("[planes-cron] failed:", error);
  });
}

export { fetchPlaneData };
