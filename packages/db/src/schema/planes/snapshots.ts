import { bigint, index, integer, pgTable, timestamp } from "drizzle-orm/pg-core";

export const snapshots = pgTable(
    "snapshots",
    {
        id: bigint("id", { mode: "number" })
        .primaryKey()
        .generatedAlwaysAsIdentity(),

        snapshotTime: timestamp("snapshot_time", {
            withTimezone: true,
            mode: "date",
        })
        .notNull()
        .unique(),

        aircraftCount: integer("aircraft_count").notNull(),
    },
    (t) => [
        index("snapshots_time_index").on(t.snapshotTime),
    ],
);