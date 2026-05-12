import cron from "node-cron";
import axios from "axios";
import { db, locations, readings, sql } from "db";

const API_URL = "https://vreme.arso.gov.si/api/1.0/location/";

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

function parseReadings(data: Record<string, any>, locationId: string) {
  const rows = [];
  const keys = [
    { key: "forecast3h", res: "3h" },
    { key: "forecast6h", res: "6h" },
    { key: "forecast24h", res: "24h" },
  ];

  for (const { key, res } of keys) {
    const days = data[key]?.features?.[0]?.properties?.days ?? [];

    for (const day of days) {
      for (const entry of day.timeline) {
        rows.push({
          locationId,
          resolution: res,
          validAt: new Date(entry.valid),
          tempC: toInt(entry.t),
          tempMinC: toInt(entry.tnsyn),
          tempMaxC: toInt(entry.txsyn),
          rhPct: toInt(entry.rh),
          mslHpa: toInt(entry.msl),
          windKmh: toInt(entry.ff_val),
          gustKmh: toInt(entry.ff_max),
          windDir: entry.dd_shortText ?? null,
          precipMm: toFloat(entry.tp_acc),
          iconCode: entry.clouds_icon_wwsyn_icon ?? null,
        });
      }
    }
  }

  return rows;
}

async function cleanReadings() {
  await db.execute(
    sql`DELETE FROM readings WHERE fetched_at < NOW() - INTERVAL '5 days'`,
  );
}

async function fetchLocationData(locationId: string, title: string) {
  const { data } = await axios.get(API_URL, {
    params: { location: title },
  });

  const rows = parseReadings(data, locationId);
  if (rows.length === 0) {
    console.log("empty readings");
    return;
  }

  await db.insert(readings).values(rows).onConflictDoNothing();
}

async function fetchWeatherData() {
  console.log(`[weather-cron] Starting at ${new Date().toISOString()}`);

  const locs = await db.select().from(locations);
  let success = 0;
  let failed = 0;

  for (const loc of locs) {
    try {
      await fetchLocationData(loc.id, loc.title);
      success++;
    } catch (err) {
      console.error(`[weather-cron] Failed for ${loc.title}:`, err);
      failed++;
    }
  }

  await cleanReadings();
  console.log(`[weather-cron] ${success} success, ${failed} failed`);
}

export function startCronjob() {
  cron.schedule("0 * * * *", fetchWeatherData);
}

export { fetchWeatherData };
