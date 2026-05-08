import { bigint, index, unique, pgTable, timestamp, boolean, doublePrecision, text } from "drizzle-orm/pg-core";

import { snapshots } from "./snapshots";

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
    },
    (t) => [
        index("plane_snapshots_snapshot_id_index").on(t.snapshotId),
        index("plane_snapshots_snapshot_time_index").on(t.snapshotTime),
        unique("plane_snapshots_hex_time_unique").on(t.hex, t.snapshotTime)
    ],
);