import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd(), true);

export default defineConfig({
  out: "./drizzle",
  schema: "./src/server/schema/**/*.db.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
