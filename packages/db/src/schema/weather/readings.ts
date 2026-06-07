import {
  pgTable,
  serial,
  smallint,
  real,
  timestamp,
  varchar,
  char,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { locations } from "./locations.js";

export const readings = pgTable(
  "readings",
  {
    id: serial("id").primaryKey(),
    locationId: char("location_id", { length: 16 })
      .notNull()
      .references(() => locations.id),
    resolution: char("resolution", { length: 3 }).notNull(),
    validAt: timestamp("valid_at", { withTimezone: true }).notNull(),

    tempC: smallint("temp_c"),
    tempMinC: smallint("temp_min_c"),
    tempMaxC: smallint("temp_max_c"),
    rhPct: smallint("rh_pct"),
    mslHpa: smallint("msl_hpa"),
    windKmh: smallint("wind_kmh"),
    gustKmh: smallint("gust_kmh"),
    windDir: char("wind_dir", { length: 2 }),
    precipMm: real("precip_mm"),
    iconCode: varchar("icon_code", { length: 32 }),

    fetchedAt: timestamp("fetched_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique("unique_readings").on(t.locationId, t.resolution, t.validAt),
    index("idx_fetch").on(t.fetchedAt),
    index("idx_readings_location_time").on(t.locationId, t.validAt),
  ],
);
