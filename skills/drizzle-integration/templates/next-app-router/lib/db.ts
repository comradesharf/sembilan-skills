import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@/src/server/schema/example.db";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 20,
  min: 0,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 5_000,
  keepAlive: true,
});

function logPoolEvent(event: string, err?: Error) {
  console.info("[PGPool]", {
    event,
    error: err?.message,
    idleCount: pool.idleCount,
    totalCount: pool.totalCount,
    waitingCount: pool.waitingCount,
  });
}

if (process.env.LOG_DB_POOL_EVENTS === "true") {
  pool.on("release", (err) => logPoolEvent("release", err));
  pool.on("error", (err) => logPoolEvent("error", err));
  pool.on("connect", () => logPoolEvent("connect"));
  pool.on("acquire", () => logPoolEvent("acquire"));
  pool.on("remove", () => logPoolEvent("remove"));
}

const db = drizzle({
  client: pool,
  schema,
  casing: "snake_case",
  logger:
    process.env.LOG_QUERIES === "true"
      ? {
          logQuery(query: string, params: unknown[]) {
            console.info("[SQL]", { query, params });
          },
        }
      : undefined,
});

export default db;
