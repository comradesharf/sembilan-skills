# Better Auth Templates (Next.js App Router)

Use these files as the default baseline when wiring Better Auth in a Next.js App Router project.

## Suggested Destination Mapping

- `templates/next-app-router/lib/auth.utils.ts` -> `src/lib/auth.utils.ts` or project auth lib path
- `templates/next-app-router/lib/auth.schema.ts` -> `src/lib/auth.schema.ts`
- `templates/next-app-router/lib/auth.router.ts` -> `src/lib/auth.router.ts`
- `templates/next-app-router/app/api/auth/[...all]/route.ts` -> `app/api/auth/[...all]/route.ts`
- `templates/next-app-router/package.scripts.snippet.json` -> merge into `package.json` scripts
- `templates/next-app-router/.env.example` -> merge into project `.env.example`

Adjust imports, aliases, and auth/db paths to match the target repository conventions.
