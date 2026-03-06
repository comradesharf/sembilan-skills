import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  createTRPCOptionsProxy,
  type TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache, type PropsWithChildren } from "react";
import { makeQueryClient } from "@/client/query-client";
import { appRouter } from "@/server/trpc/app-router";
import { createTRPCContext } from "./trpc";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  router: appRouter,
  queryClient: getQueryClient,
  ctx: async () =>
    createTRPCContext({
      headers: await headers(),
    }),
});

export async function HydrateClient({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

export async function prefetch<
  T extends Array<ReturnType<TRPCQueryOptions<any>>>,
>(...queryOptions: T) {
  const queryClient = getQueryClient();

  for (const queryOption of queryOptions) {
    if (queryOption.queryKey[1]?.type === "infinite") {
      void queryClient.prefetchInfiniteQuery(queryOption as never);
    } else {
      void queryClient.prefetchQuery(queryOption);
    }
  }
}

export async function getCaller() {
  return appRouter.createCaller(
    await createTRPCContext({
      headers: await headers(),
    }),
  );
}
