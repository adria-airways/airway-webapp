import { bigint, index, pgTable, text } from "drizzle-orm/pg-core";

export const geoRegions = pgTable(
  "geo_regions",
  {
    id: bigint("id", {
      mode: "number",
    })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    name: text("name").notNull(),

    geoJson: text("geo_json").notNull(),
  },
);