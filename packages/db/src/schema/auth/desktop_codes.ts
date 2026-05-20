import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const desktopCodes = pgTable(
  "desktop_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    codeHash: varchar("code_hash", { length: 128 }).notNull(),
    userId: varchar("user_id", { length: 128 }).notNull(),
    orgId: varchar("org_id", { length: 128 }).notNull(),

    stateHash: varchar("state_hash", { length: 128 }).notNull(),
    redirectUri: varchar("redirect_uri", { length: 512 }).notNull(),
    codeChallenge: varchar("code_challenge", { length: 128 }).notNull(),
    codeMethod: varchar("code_method", { length: 16 })
      .notNull()
      .default("S256"),

    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("desktop_code_hash").on(t.codeHash),
    index("desktop_user_org").on(t.userId, t.orgId),
    index("desktop_code_expiry").on(t.expiresAt),
  ],
);
