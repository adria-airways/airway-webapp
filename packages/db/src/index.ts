import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  max: Number(process.env.DB_POOL_MAX ?? 3),
  connect_timeout: 10,
  idle_timeout: 20,
  max_lifetime: 60 * 10,
  connection: {
    options:
      "-c statement_timeout=10000 -c idle_in_transaction_session_timeout=10000",
  },
});

export const db = drizzle({ client });
export * from "./schema.js";
export { sql, eq, and, lte, gte, desc, gt, asc, lt, or } from "drizzle-orm";
