import { bigint, index, integer, pgTable, timestamp, boolean, doublePrecision, text } from "drizzle-orm/pg-core";

export const planeLive = pgTable(
    "plane_live",
    {
        hex: text("hex").primaryKey(),

        snapshotTime: timestamp("snapshot_time", {
            withTimezone: true,
            mode: "date",
        }).notNull(),

        callsign: text("calsign"),

        originCountry: text("origin_country"),

        latitude: doublePrecision("latitude"),

        longitude: doublePrecision("longitude"),

        baroAltitude: doublePrecision("baro_altitude"),

        onGround: boolean("on_ground"),

        groundSpeed: doublePrecision("ground_speed"),

        heading: doublePrecision("heading"),

        verticalRate: doublePrecision("vertical_rate"),

        spi: boolean("spi"),
    },
    (t) => [
        index("plane_live_snapshot_time_index").on(t.snapshotTime),
    ],
);