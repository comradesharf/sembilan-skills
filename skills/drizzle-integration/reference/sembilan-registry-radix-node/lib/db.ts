// @ts-nocheck
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as auth from "@/registry/base-mira/fullstack/lib/auth.db";
import { Log } from "@/registry/base-mira/fullstack/lib/logger";

const log = Log.child(
  {
    from: "drizzle",
  },
  {
    msgPrefix: "SQL",
  },
);

const client = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 40,
  min: 0,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 5_000,
  keepAlive: true,
});

function logEvent(event: string, err?: Error) {
  Log.info({
    err: err ? err : undefined,
    msg: `[PGPool] ${event}`,
    expiredCount: client.expiredCount,
    idleCount: client.idleCount,
    totalCount: client.totalCount,
    waitingCount: client.waitingCount,
    type: "pgpool_event",
  });
}

if (process.env.LOG_DB_POOL_EVENTS === "true") {
  client.on("release", (err) => logEvent("release", err));

  client.on("error", (err) => logEvent("error", err));

  client.on("connect", () => logEvent("connect"));

  client.on("acquire", () => logEvent("acquire"));

  client.on("remove", () => logEvent("remove"));
}

export default drizzle({
  client,
  schema: {
    ...auth,
  },
  casing: "snake_case",
  logger:
    process.env.LOG_QUERIES === "true"
      ? {
          logQuery(query: string, params: unknown[]) {
            log.info({
              msg: query,
              params,
            });
          },
        }
      : undefined,
});
