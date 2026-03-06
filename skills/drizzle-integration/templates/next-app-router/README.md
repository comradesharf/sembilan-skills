# Next.js App Router Drizzle Templates

These files are reusable starters for `Drizzle ORM + PostgreSQL`.

## Copy Map

- `drizzle.config.ts` -> `drizzle.config.ts`
- `.env.example` -> `.env.example`
- `lib/db.ts` -> `src/server/db.ts` (or your server lib path)
- `lib/schema.example.db.ts` -> `src/server/schema/example.db.ts`
- `package.scripts.snippet.json` -> merge into `package.json` scripts
- `drizzle/*.sql` -> `drizzle/*.sql`
- `drizzle/meta/*.json` -> `drizzle/meta/*.json`

## Required Adjustments After Copy

1. Update import aliases in `lib/db.ts` to match your project.
2. Replace the sample schema import with your real `*.db.ts` modules.
3. Verify the `schema` glob in `drizzle.config.ts` matches your repo layout.
4. Set `DATABASE_URL` in your local env.
5. Keep migration output in `./drizzle` unless your project uses another location.
6. Copy the full baseline migration bundle (`drizzle/*.sql` and `drizzle/meta/*.json`) before generating any new migrations.

## Optional Changes

- Enable query logging by setting `LOG_QUERIES=true` in development.
- Add pool event logging with `LOG_DB_POOL_EVENTS=true` for debugging.
- Add additional db modules and spread them into the `schema` object.
