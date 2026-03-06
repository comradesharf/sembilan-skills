import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, twoFactor } from "better-auth/plugins";
import * as schema from "@/src/lib/auth.db";
import db from "@/src/lib/db";

const options = {
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    transaction: true,
    schema: {
      users: schema.users,
      sessions: schema.sessions,
      accounts: schema.accounts,
      verifications: schema.verifications,
      twoFactors: schema.twoFactors,
    },
  }),
  telemetry: {
    enabled: false,
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin(),
    twoFactor({
      skipVerificationOnEnable: true,
    }),
    nextCookies(),
  ],
} satisfies BetterAuthOptions;

export default betterAuth(options);
