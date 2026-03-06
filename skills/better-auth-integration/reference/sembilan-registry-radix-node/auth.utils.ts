import {
  type BetterAuthOptions,
  type BetterAuthPlugin,
  betterAuth,
  type GenericEndpointContext,
} from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { deleteSessionCookie } from "better-auth/cookies";
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  createAuthEndpoint,
  createAuthMiddleware,
  twoFactor,
} from "better-auth/plugins";
import { getUnixTime } from "date-fns";
import { typeid } from "typeid-js";
import * as schema from "@/registry/base-mira/fullstack/lib/auth.db";
import db from "@/registry/base-mira/fullstack/lib/db";
import { inngest } from "@/registry/base-mira/fullstack/lib/inngest";
import { Timezones } from "@/registry/base-mira/fullstack/lib/timezones";

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

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
  experimental: {
    joins: true,
  },
  telemetry: {
    enabled: false,
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await inngest.send({
        name: "app/password.reset-requested",
        data: {
          user: user.id,
          url,
        },
      });
    },
  },
  emailVerification: {
    async sendVerificationEmail({ url, user }) {
      await inngest.send({
        name: "app/user.email.verify-requested",
        data: {
          user: user.id,
          url,
        },
      });
    },
  },
  user: {
    fields: {
      name: "lastName",
    },
    additionalFields: {
      requiresOnboarding: {
        required: true,
        input: false,
        type: "boolean",
        defaultValue: true,
      },
      firstName: {
        required: true,
        input: true,
        type: "string",
      },
      timezone: {
        required: true,
        input: true,
        type: Timezones as Mutable<typeof Timezones>,
        defaultValue: "America/New_York",
      },
      locale: {
        required: true,
        input: true,
        type: "string",
        defaultValue: "en-US",
      },
    },
  },
  advanced: {
    database: {
      generateId({ model }) {
        if (process.env.NODE_ENV === "development" && !model) {
          throw new Error(`Model name is required for ID generation: ${model}`);
        }
        return typeid(model!).toString();
      },
    },
  },
  appName: process.env.INNGEST_ACCOUNT_ID || "development",
  plugins: [
    admin(),
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ otp, user }) {
          await inngest.send({
            name: "app/otp.requested",
            data: {
              user: user.id,
              otp,
            },
          });
        },
      },
    }),
  ],
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  databaseHooks: {
    user: {
      create: {
        async after(user) {
          await inngest.send({
            name: "app/user.created",
            data: {
              user: user.id,
            },
          });
        },
      },
      update: {
        async after(user) {
          await inngest.send({
            name: "app/user.updated",
            data: {
              user: user.id,
            },
          });
        },
      },
    },
  },
} satisfies BetterAuthOptions;

export default betterAuth({
  ...options,
  plugins: [
    ...options.plugins,
    {
      id: "set-last-active-cookies",
      hooks: {
        after: [
          {
            matcher: (ctx) => ctx.path === "/get-session",
            handler: createAuthMiddleware(
              async (ctx: GenericEndpointContext) => {
                if (ctx.context.session) {
                  ctx.setCookie(
                    "better-auth.last-active",
                    `${getUnixTime(ctx.context.session.session.expiresAt)}`,
                    { httpOnly: false, maxAge: 60 * 10 },
                  );
                }
              },
            ),
          },
        ],
      },
    } as BetterAuthPlugin,
    /**
     * Sign out endpoint to delete session and clear cookie using get request
     */
    {
      id: "sign-out-endpoint",
      endpoints: {
        dashboardSignOut: createAuthEndpoint(
          "/dashboard/sign-out",
          {
            method: "GET",
          },
          async (ctx) => {
            const sessionCookieToken = await ctx.getSignedCookie(
              ctx.context.authCookies.sessionToken.name,
              ctx.context.secret,
            );

            if (sessionCookieToken) {
              try {
                await ctx.context.internalAdapter.deleteSession(
                  sessionCookieToken,
                );
              } catch (e) {
                ctx.context.logger.error(
                  "Failed to delete session from database",
                  e,
                );
              }
            }

            deleteSessionCookie(ctx);

            return ctx.redirect("/auth/login");
          },
        ),
      },
    } as BetterAuthPlugin,
    /**
     * @link https://www.better-auth.com/docs/integrations/next#server-action-cookies
     */
    nextCookies(),
  ],
});
