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

  const observation = data.observation?.features?.[0]?.properties?.days ?? [];

  for (const day of observation) {
    for (const entry of day.timeline ?? []) {
      if (!entry.valid) {
        continue;
      }

      rows.push({
        locationId,
        resolution: "obs",
        validAt: new Date(entry.valid),
        tempC: toInt(entry.t),
        tempMinC: null,
        tempMaxC: null,
        rhPct: toInt(entry.rh),
        mslHpa: toInt(entry.msl),
        windKmh: toInt(entry.ff_val),
        gustKmh: toInt(entry.ffmax_val),
        windDir: entry.dd_shortText ?? null,
        precipMm: null,
        iconCode: entry.clouds_icon_wwsyn_icon ?? null,
      });
    }
  }

  const keys = [
    { key: "forecast3h", res: "3h" },
    { key: "forecast6h", res: "6h" },
    { key: "forecast24h", res: "24h" },
  ];

  for (const { key, res } of keys) {
    const days = data[key]?.features?.[0]?.properties?.days ?? [];

    for (const day of days) {
      for (const entry of day.timeline ?? []) {
        if (!entry.valid) {
          continue;
        }

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
          gustKmh: toInt(entry.ffmax_val),
          windDir: entry.dd_shortText ?? null,
          precipMm: toFloat(entry.tp_acc ?? entry.tp_24h_acc),
          iconCode: entry.clouds_icon_wwsyn_icon ?? null,
        });
      }
    }
  }

  return rows;
}

async function cleanReadings() {
  await db.execute(sql`
    DELETE FROM readings
    WHERE resolution = 'obs'
    AND valid_at < NOW() - INTERVAL '5 days'
  `);

  await db.execute(sql`
    DELETE FROM readings
    WHERE resolution <> 'obs'
    AND valid_at < date_trunc('day', NOW())
  `);
}

async function fetchLocationData(locationId: string, title: string) {
  const { data } = await axios.get(API_URL, {
    params: { location: title },
  });

  const rows = parseReadings(data, locationId);
  if (rows.length === 0) {
    console.log("[weather-cron] no readings!");
    return;
  }

  await db
    .insert(readings)
    .values(rows)
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
        fetchedAt: sql`now()`,
      },
    });
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
