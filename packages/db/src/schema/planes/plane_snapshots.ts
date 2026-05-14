import { bigint, index, unique, pgTable, timestamp, boolean, doublePrecision, text } from "drizzle-orm/pg-core";

import { snapshots } from "./snapshots.js";

export const planeSnapshots = pgTable(
    "plane_snapshots",
    {
        id: bigint("id", { mode: "number" })
        .primaryKey()
        .generatedAlwaysAsIdentity(),

        snapshotId: bigint("snapshot_id", {
            mode: "number",
        })
        .notNull()
        .references(() => snapshots.id, {
            onDelete: "cascade",
        }),

        snapshotTime: timestamp("snapshot_time", {
            withTimezone: true,
            mode: "date",
        }).notNull(),

        hex: text("hex").notNull(),

        callsign: text("callsign"),

        originCountry: text("origin_country"),

        latitude: doublePrecision("latitude"),

        longitude: doublePrecision("longitude"),

        baroAltitude: doublePrecision("baro_altitude"),

        onGround: boolean("on_ground").notNull(),

        groundSpeed: doublePrecision("ground_speed"),

        heading: doublePrecision("heading"),

        verticalRate: doublePrecision("vertical_rate"),

        spi: boolean("spi").notNull(),

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
    },
    (t) => [
        index("plane_snapshots_snapshot_id_index").on(t.snapshotId),
        index("plane_snapshots_snapshot_time_index").on(t.snapshotTime),
        unique("plane_snapshots_hex_time_unique").on(t.hex, t.snapshotTime)
    ],
);