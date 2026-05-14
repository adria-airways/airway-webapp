import cron from "node-cron";
import axios from "axios";
import { db, snapshots, planeSnapshots, planeLive, sql } from "db";

const API_URL = "https://opensky-network.org/api/states/all?lamin=45&lomin=12.8&lamax=47.1&lomax=16.8";

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

async function cleanReadings() {
  await db.execute(
    sql`DELETE FROM snapshots WHERE snapshot_time < NOW() - INTERVAL '5 days'`,
  );
}

async function fetchRoute(callsign: string) {
  try {
    const res = await axios.get(
      `https://api.adsbdb.com/v0/callsign/${callsign}`
    );

    return res.data;
  } catch (err) {
    return null;
  }
}

async function fetchPlaneData() {
  console.log(`[planes-cron] Starting at ${new Date().toISOString()}`);

  const { data } = await axios.get(API_URL);

  if (!data?.states) {
    console.log("No data from openSky");
    return;
  }

  const time = data.time;
  const states = data.states;

  const [snapshot] = await db
    .insert(snapshots)
    .values({
      snapshotTime: new Date(time * 1000),
      aircraftCount: states.length,
    })
    .returning();

  const snapshotId = snapshot.id;

  const rows = states.map((state: any[]) => {
    return {
      hex: state[0]?.trim(),
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

      airline: null,
      flyingFromCountry: null,
      flyingFromLatitude: null,
      flyingFromLongitude: null,
      flyingToCountry: null,
      flyingToLatitude: null,
      flyingToLongitude: null,
    };
  });

  if (rows.length === 0) {
    console.log("empty readings");
    return;
  }

  const callsigns = [
    ...new Set(
      rows
        .map((r: any) => r.callsign?.trim())
        .filter(Boolean) as string[]
    ),
  ];

  let failed = 0;

  const routeMap = new Map<string, any>();

  for (const callsign of callsigns) {
    const res = await fetchRoute(callsign);

    if (!res || !res.response?.flightroute) {
      failed++;
      continue;
    }

    routeMap.set(callsign, res.response.flightroute);
  }

  const rowsWithRouteData = rows.map((r: any) => {
    if (!r.callsign) {
      return r;
    }

    const route = routeMap.get(r.callsign);

    if (!route) {
      return r;
    }

    return {
      ...r,

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

  await db.transaction(async (t) => {
    await t.delete(planeLive);
    await t.insert(planeLive).values(rowsWithRouteData);
  });

  const historyRows = rowsWithRouteData.map((r: any) => ({
    ...r,
    snapshotId,
  }));

  await db.insert(planeSnapshots).values(historyRows);

  await cleanReadings();
  console.log(`[planes-cron] adsbdb failed lookups: ${failed}/${callsigns.length}`);
  console.log(`[planes-cron] done`);
}

export function startPlanesCronjob() {
  cron.schedule("*/5 * * * *", fetchPlaneData);
}

export { fetchPlaneData };
