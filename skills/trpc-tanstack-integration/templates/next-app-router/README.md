# Next.js App Router Templates

These files are reusable starters for `tRPC + TanStack Query`.

## Copy Map

- `server/trpc.ts` -> `src/server/trpc/trpc.ts`
- `server/app-router.ts` -> `src/server/trpc/app-router.ts`
- `app/api/trpc/[trpc]/route.ts` -> `app/api/trpc/[trpc]/route.ts`
- `client/query-client.ts` -> `src/client/query-client.ts`
- `client/trpc-react.tsx` -> `src/client/trpc-react.tsx`
- `server/trpc-rsc.tsx` -> `src/server/trpc/trpc-rsc.tsx`

## Required Adjustments After Copy

1. Update import paths (`@/server/...`, `@/client/...`) to match your repo aliases.
2. Replace `Session` in `server/trpc.ts` with your real auth session type.
3. Implement real session lookup in `createTRPCContext`.
4. Mount `TRPCReactProvider` in your app provider tree.
5. Keep `/api/trpc` endpoint unless you intentionally use a different route.

## Optional Changes

- Replace `devalue` with `superjson` if your codebase uses that transformer.
- Add subscription link support in `client/trpc-react.tsx` if needed.
- Expand `app-router.ts` with feature routers and merge them into `appRouter`.
