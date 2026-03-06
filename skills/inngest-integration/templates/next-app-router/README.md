# Next.js App Router Templates

These files are reusable starters for `Inngest` integration.

## Copy Map

- `lib/inngest.ts` -> `src/server/inngest/inngest.ts`
- `lib/_app.inngest.ts` -> `src/server/inngest/_app.inngest.ts`
- `lib/auth.inngest.ts` -> `src/server/inngest/auth.inngest.ts`
- `app/api/inngest/route.ts` -> `app/api/inngest/route.ts`

## Required Adjustments After Copy

1. Update import paths to your alias and folder conventions.
2. Replace sample event schemas with domain events used by your app.
3. Replace placeholder side effects in `auth.inngest.ts` with real db/mailer logic.
4. Ensure `INNGEST_ACCOUNT_ID` and any email/env vars are configured.
5. Add event producers where app actions should trigger async workflows.

## Optional Changes

- Split workflows into additional modules (`billing.inngest.ts`, `notifications.inngest.ts`).
- Add stricter schema validation with `zod` for complex nested event payloads.
- Add observability hooks for workflow duration and failure rate metrics.
