---
name: inngest-integration
description: "Use when integrating Inngest in TypeScript projects, especially Next.js App Router. Triggers: setup inngest client, create event schemas, add app/api/inngest route, register functions, add background email or workflow jobs."
---

# Inngest Integration

## Goal
Set up production-ready background workflows with:
- `inngest`
- `inngest/next` route handler
- typed event schemas
- function registration pattern that scales across modules

This skill should implement files and wiring, not just provide a plan.

## Bundled Reusable Templates

Use these templates as the default source when integrating into a Next.js App Router project:

- `templates/next-app-router/lib/inngest.ts`
- `templates/next-app-router/lib/_app.inngest.ts`
- `templates/next-app-router/lib/auth.inngest.ts`
- `templates/next-app-router/app/api/inngest/route.ts`
- `templates/next-app-router/README.md`

## Reference Implementation

Use this repo-specific reference when the target project follows the same conventions:

- `reference/sembilan-registry-radix-node/inngest.ts`
- `reference/sembilan-registry-radix-node/_app.inngest.ts`
- `reference/sembilan-registry-radix-node/auth.inngest.ts`
- `reference/sembilan-registry-radix-node/route.ts`

## Workflow

1. Detect project conventions before editing.
- Framework/runtime from `package.json`.
- Package manager from lockfiles.
- Path alias and folder layout from `tsconfig.json`.
- Existing logger, mailer, and auth/db access patterns.

2. Ensure dependencies exist.
- Runtime deps:
  - `inngest`
- Optional deps only if used by function code:
  - `@react-email/components`
  - `zod`

3. Create Inngest client foundation first.
- Add a single `inngest` client instance.
- Use typed schemas with `EventSchemas().fromSchema(...)`.
- Keep a helper to compose exported function groups (`createFunctions(...)`).
- Reuse the existing project logger when present.

4. Add function modules by domain.
- Create files such as `auth.inngest.ts`, `billing.inngest.ts`, `notifications.inngest.ts`.
- Use `inngest.createFunction(...)` with stable ids.
- Wrap side effects inside `step.run(...)` for retry-safe execution.
- Throw `NonRetriableError` for permanent failure states (missing records, invalid input).

5. Add root function registry.
- Aggregate module exports into a single `functions` array in `_app.inngest.ts`.
- Keep registration additive to avoid duplicate handlers.

6. Expose the Next.js route.
- Create `app/api/inngest/route.ts` using `serve({ client, functions })`.
- Export `GET`, `POST`, and `PUT` handlers.
- Keep endpoint path stable (`/api/inngest`) unless project standards require otherwise.

7. Wire event producers.
- When user-facing or API actions happen, call `inngest.send({ name, data })`.
- Keep event names domain-scoped (`app/user.created`, `billing/invoice.paid`).
- Validate payload shape at schema definition time.

8. Validate integration.
- Run type-check/lint commands available in the repo.
- Confirm route compiles and is reachable.
- Verify at least one function is registered and triggerable.

## Event Naming and Schema Rules

- Prefer namespaced event names with dot separators.
- Keep event payload keys stable and backward compatible.
- Use explicit primitives (`string`, `number`, `boolean`) unless nested objects are required.
- Do not silently rename existing events without migration notes.

## Implementation Rules

- Prefer existing project architecture and folder conventions.
- Keep edits minimal and additive.
- Do not duplicate Inngest client instances.
- Reuse existing db/mailer/logger helpers instead of introducing parallel utilities.
- If partial Inngest setup exists, fill missing pieces rather than rewriting everything.

## Completion Checklist

- `inngest` client exists with typed schemas.
- Domain function files exist and export `inngest.createFunction(...)` handlers.
- `_app.inngest.ts` aggregates all function modules.
- `app/api/inngest/route.ts` is wired with `serve(...)`.
- At least one event producer call path is identified or implemented.
- Type-check passes for changed files.
