import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { headers } from "next/headers";
import { appRouter } from "@/server/trpc/app-router";
import { createTRPCContext } from "@/server/trpc/trpc";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () =>
      createTRPCContext({
        headers: await headers(),
      }),
    onError({ error, path, type }) {
      if (error.code === "UNAUTHORIZED") {
        return;
      }

      console.error("tRPC error", {
        code: error.code,
        message: error.message,
        path,
        type,
      });
    },
  });
};

export { handler as GET, handler as POST };
