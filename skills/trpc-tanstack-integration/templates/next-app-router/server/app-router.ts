import { z } from "zod";
import { createCallerFactory, createTRPCRouter, publicProcedure } from "./trpc";

const healthRouter = createTRPCRouter({
  ping: publicProcedure.query(() => ({ ok: true })),
  echo: publicProcedure
    .input(z.object({ message: z.string().min(1) }))
    .mutation(({ input }) => ({ message: input.message })),
});

export const appRouter = createTRPCRouter({
  health: healthRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
