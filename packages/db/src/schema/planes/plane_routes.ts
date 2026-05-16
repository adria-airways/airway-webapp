import { bigint, index, integer, pgTable, timestamp, boolean, unique, doublePrecision, text } from "drizzle-orm/pg-core";

export const planeRoutes = pgTable(
  "plane_routes",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    hex: text("hex").notNull(),

    callsign: text("callsign").notNull(),

    airline: text("airline"),

    flyingFromCountry: text("flying_from_country"),
    flyingFromLatitude: doublePrecision("flying_from_latitude"),
    flyingFromLongitude: doublePrecision("flying_from_longitude"),
    flyingFromCity: text("flying_from_city"),
    flyingFromAirport: text("flying_from_airport"),

    flyingToCountry: text("flying_to_country"),
    flyingToLatitude: doublePrecision("flying_to_latitude"),
    flyingToLongitude: doublePrecision("flying_to_longitude"),
    flyingToCity: text("flying_to_city"),
    flyingToAirport: text("flying_to_airport"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow().notNull(),

  },
  (t) => [
    unique("plane_routes_hex_callsign_unique")
      .on(t.hex, t.callsign),

    index("plane_routes_hex_index").on(t.hex),
    index("plane_routes_callsign_index").on(t.callsign),
  ]
);