import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { LoginInputSchema, RegisterInputSchema } from "@/src/lib/auth.schema";
import auth from "@/src/lib/auth.utils";
import { publicProcedure } from "@/src/lib/trpc";

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
