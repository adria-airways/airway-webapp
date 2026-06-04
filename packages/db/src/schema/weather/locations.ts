import { pgTable, char, real, varchar } from "drizzle-orm/pg-core";

export const locations = pgTable("locations", {
  id: char("id", { length: 16 }).primaryKey(),
  title: varchar("title", { length: 64 }).notNull(),
  country: char("country", { length: 2 }).notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
});
