import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const desktopSessions = pgTable(
  "desktop_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("user_id", { length: 128 }).notNull(),
    orgId: varchar("org_id", { length: 128 }).notNull(),

    tokenHash: varchar("token_hash", { length: 128 }).notNull(),
    deviceName: varchar("device_name", { length: 128 }),
    appVersion: varchar("app_version", { length: 64 }),

    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("desktop_sessions_token_hash").on(t.tokenHash),
    index("desktop_sessions_user_org").on(t.userId, t.orgId),
    index("desktop_sessions_expires_at").on(t.expiresAt),
    index("desktop_sessions_revoked_at").on(t.revokedAt),
  ],
);
