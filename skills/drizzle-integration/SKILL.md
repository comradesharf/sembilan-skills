---
name: drizzle-integration
description: "Use when adding Drizzle ORM + Drizzle Kit integration in TypeScript projects, especially Next.js App Router with PostgreSQL. Triggers: setup drizzle, configure drizzle-kit, add db client, add migrations, add schema files, add database scripts."
---

# Drizzle Integration

## Goal
Set up Drizzle ORM end-to-end with:
- `drizzle-orm`
- `drizzle-kit`
- `pg`
- project-aligned schema discovery, migration output, and runtime db client

This skill should implement files and scripts, not only propose a plan.

## Bundled Reusable Templates

Use these templates as the default source when integrating into a Next.js App Router project:

- `templates/next-app-router/drizzle.config.ts`
- `templates/next-app-router/.env.example`
- `templates/next-app-router/lib/db.ts`
- `templates/next-app-router/lib/schema.example.db.ts`
- `templates/next-app-router/package.scripts.snippet.json`
- `templates/next-app-router/drizzle/*.sql`
- `templates/next-app-router/drizzle/meta/*.json`
- `templates/next-app-router/README.md`

## Reference Implementation

Use this repo-specific reference when the target project follows the same conventions:

- `reference/sembilan-registry-radix-node/drizzle.config.ts`
- `reference/sembilan-registry-radix-node/lib/db.ts`
- `reference/sembilan-registry-radix-node/drizzle/*.sql`
- `reference/sembilan-registry-radix-node/drizzle/meta/*.json`
- `reference/sembilan-registry-radix-node/drizzle/README.md`
- `reference/sembilan-registry-radix-node/README.md`

## Workflow

1. Detect existing project conventions before editing.
- Framework/runtime (`next`, `vite`, `node`) from `package.json`.
- Package manager from lockfile.
- Existing alias/path conventions from `tsconfig.json`.
- Existing logging approach and env naming conventions.

2. Ensure required dependencies exist.
- Runtime deps: `drizzle-orm`, `pg`, `@types/pg` when TypeScript needs it.
- Dev deps: `drizzle-kit`.
- Use the repo package manager (`pnpm`, `npm`, `yarn`, or `bun`).

3. Add `drizzle.config.ts`.
- Load env values predictably (for Next.js, use `@next/env` + `loadEnvConfig`).
- Set `dialect: "postgresql"`.
- Set `schema` glob to where `*.db.ts` files live.
- Set migration output directory (`./drizzle` by default).
- Wire `dbCredentials.url` to `process.env.DATABASE_URL`.

4. Add a typed runtime db client.
- Create a pooled `pg` client.
- Create a `drizzle` client with imported schema modules.
- Keep pool tuning explicit (`max`, `idleTimeoutMillis`, `connectionTimeoutMillis`).
- Gate noisy logs behind env flags.

5. Add or align schema files.
- Keep schema in `*.db.ts` files to match drizzle-kit discovery.
- Export table objects for type-safe queries.
- Keep naming convention consistent (`snake_case` vs default).

6. Add migration and workflow scripts.
- Add scripts similar to:
  - `drizzle:generate`
  - `drizzle:migrate`
  - `drizzle:push`
  - `drizzle:studio`

7. Copy the baseline migration bundle into every target project.
- Always copy all files from `templates/next-app-router/drizzle/` to target `drizzle/`.
- Include both SQL migration files and `meta/` snapshot/journal files.
- Keep baseline filenames and ordering unchanged.
- If target already has migrations, append new migrations after baseline and do not rewrite existing history.

8. Generate first project-specific migration when appropriate.
- Run `drizzle-kit generate` only after baseline migrations are present.
- Review SQL output under `drizzle/`.
- Do not modify historical migrations unless explicitly requested.

9. Validate integration.
- Run type-check and lint commands available in the repo.
- Ensure at least one query compiles against imported schema.
- Verify `DATABASE_URL` is documented.

## Implementation Rules

- Prefer existing project patterns over introducing new architecture.
- Keep edits minimal and additive.
- Reuse project logger if present; otherwise keep db logging off by default.
- Keep migration history deterministic; never rewrite old migration files silently.
- If project already has partial Drizzle setup, fill missing pieces instead of duplicating.

## Completion Checklist

- `drizzle.config.ts` exists and resolves env values.
- Runtime db client exists and exports a typed Drizzle instance.
- Schema files are discoverable by the configured glob.
- Migration scripts are present in `package.json`.
- Baseline migration bundle exists in target `drizzle/` (`*.sql` + `meta/*.json`).
- Additional migrations are generated only after baseline is copied.
- Type-check passes for changed files.
