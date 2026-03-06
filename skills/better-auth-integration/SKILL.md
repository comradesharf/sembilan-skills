---
name: better-auth-integration
description: "Use when integrating Better Auth in TypeScript projects, especially Next.js App Router with Drizzle and optional Inngest hooks. Triggers: setup better-auth, create auth utils, wire auth route, configure plugins, add auth schema generation, connect auth flows to tRPC or server actions."
---

# Better Auth Integration

## Goal
Set up Better Auth end-to-end with:
- `better-auth`
- Drizzle adapter integration
- Next.js App Router route handler
- project-aligned plugin, session, and user field configuration
- optional event-based side effects (Inngest, email, 2FA)

This skill should implement files and wiring, not only provide a plan.

## Bundled Reusable Templates

Use these templates as the default source when integrating into a Next.js App Router project:

- `templates/next-app-router/lib/auth.utils.ts`
- `templates/next-app-router/lib/auth.schema.ts`
- `templates/next-app-router/lib/auth.router.ts`
- `templates/next-app-router/app/api/auth/[...all]/route.ts`
- `templates/next-app-router/package.scripts.snippet.json`
- `templates/next-app-router/.env.example`
- `templates/next-app-router/README.md`

## Reference Implementation

Use this repo-specific reference when the target project follows the same conventions:

- `reference/sembilan-registry-radix-node/auth.utils.ts`
- `reference/sembilan-registry-radix-node/auth.schema.ts`
- `reference/sembilan-registry-radix-node/auth.router.ts`
- `reference/sembilan-registry-radix-node/auth.inngest.ts`
- `reference/sembilan-registry-radix-node/route.ts`

## Workflow

1. Detect project conventions before editing.
- Framework/runtime from `package.json`.
- Package manager from lockfiles.
- Alias/path conventions from `tsconfig.json`.
- Existing auth, db, events, and mailer helpers.

2. Ensure required dependencies exist.
- Runtime deps:
  - `better-auth`
  - `better-auth/adapters/drizzle`
- Typical companion deps when used by project:
  - `zod`
  - `drizzle-orm`
  - `typeid-js`
  - `date-fns`
- Optional plugin-related deps only if required by implementation.

3. Create auth core (`auth.utils.ts`).
- Configure `betterAuth(...)` with a single exported instance.
- Wire Drizzle adapter to existing db client and generated auth schema tables.
- Keep telemetry disabled unless explicitly requested.
- Configure stable id generation in `advanced.database.generateId`.
- Configure user additional fields (`firstName`, `timezone`, `locale`, etc.) using project defaults.

4. Add auth features and plugins.
- Enable `emailAndPassword` and email verification when required.
- Add plugins only when needed (`admin`, `twoFactor`, `nextCookies`, custom middleware/plugin endpoints).
- Keep custom endpoint behavior deterministic and idempotent (for example, logout endpoint deleting session + cookie).

5. Wire event side effects.
- If Inngest is present, emit events inside auth callbacks/hooks (`user.created`, `user.updated`, `password.reset-requested`, `otp.requested`).
- Put side effects behind stable event names and typed payloads.
- Keep mail sending in background functions rather than inline auth handlers.

6. Add route handler.
- Create `app/api/auth/[...all]/route.ts`.
- Export handlers using `toNextJsHandler(auth)`.
- Preserve existing route conventions and avoid duplicate auth routes.

7. Add input schemas and app-facing procedures.
- Validate register/login/onboarding payloads with Zod.
- Reuse auth api methods in app-facing routers or server actions.
- Prevent invalid state transitions (for example, registering while already authenticated).

8. Add/align scripts.
- Add auth schema generation script in `package.json`:
  - `better-auth:generate`
- Keep drizzle and type-check scripts aligned with existing project commands.

9. Validate integration.
- Run type-check/lint commands available in repo.
- Confirm auth route compiles and returns expected handlers.
- Confirm at least one sign-up or sign-in path calls the auth client successfully.

## Implementation Rules

- Prefer existing project architecture and naming conventions.
- Keep edits minimal and additive.
- Reuse existing db, logger, mailer, and event clients.
- Do not create multiple Better Auth instances.
- If partial auth setup exists, complete missing pieces instead of rewriting everything.
- Avoid introducing plugin surface area that is not required by the user request.

## Completion Checklist

- `auth.utils.ts` exports a single configured Better Auth instance.
- Auth route exists at `app/api/auth/[...all]/route.ts`.
- Input schemas for app-auth flows are present and used.
- App-facing auth procedures/actions call Better Auth APIs.
- Optional side effects are event-driven and wired correctly.
- `better-auth:generate` script exists when schema generation is used.
- Type-check passes for changed files.
