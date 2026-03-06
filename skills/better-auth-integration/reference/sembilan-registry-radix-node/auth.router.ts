import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { users } from "@/registry/base-mira/fullstack/lib/auth.db";
import {
  LoginInputSchema,
  OnboardInputSchema,
  RegisterInputSchema,
} from "@/registry/base-mira/fullstack/lib/auth.schema";
import auth from "@/registry/base-mira/fullstack/lib/auth.utils";
import db from "@/registry/base-mira/fullstack/lib/db";
import {
  protectedProcedure,
  publicProcedure,
} from "@/registry/base-mira/fullstack/lib/trpc";

export const getSession = publicProcedure.query(async ({ ctx }) => {
  return ctx.session;
});

export const register = publicProcedure
  .input(RegisterInputSchema)
  .mutation(
    async ({ ctx, input: { email, firstName, lastName, password } }) => {
      if (ctx.session) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are already logged in",
        });
      }

      await auth.api.signUpEmail({
        body: {
          email,
          password,
          firstName,
          name: lastName,
        },
        headers: await headers(),
      });
    },
  );

export const login = publicProcedure
  .input(LoginInputSchema)
  .mutation(async ({ ctx, input: { email, password } }) => {
    if (ctx.session) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are already logged in",
      });
    }

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });
  });

export const onboard = protectedProcedure
  .input(OnboardInputSchema)
  .mutation(async ({ ctx, input: { locale, timezone } }) => {
    await db
      .update(users)
      .set({
        locale,
        timezone,
        requiresOnboarding: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, ctx.session.user.id));
  });
