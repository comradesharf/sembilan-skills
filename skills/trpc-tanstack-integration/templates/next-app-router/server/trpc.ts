import { initTRPC, TRPCError } from "@trpc/server";
import { parse, stringify } from "devalue";
import { z } from "zod";

// Replace this with your concrete session type from auth.
export type Session = unknown;

export type TRPCContext = {
  session: Session | null;
};

export async function createTRPCContext(opts: {
  headers: Headers;
  session?: Session | null;
}): Promise<TRPCContext> {
  // Keep this tiny and deterministic. Read cookies/headers in your auth layer.
  return {
    session: opts.session ?? null,
  };
}

const t = initTRPC.context<TRPCContext>().create({
  transformer: {
    serialize: (value: unknown) => stringify(value),
    deserialize: (value: string) => parse(value),
  },
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof z.ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});
