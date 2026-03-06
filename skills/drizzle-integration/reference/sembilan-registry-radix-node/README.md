# Sembilan Drizzle Reference Implementation

This reference captures the Drizzle integration pattern used in this repository.

## Reference Files

- `drizzle.config.ts`: Next-aware env loading and broad schema discovery (`./**/lib/**/*.db.ts`).
- `lib/db.ts`: PostgreSQL pool + Drizzle client with optional query and pool-event logging.
- `drizzle/README.md`: migration folder conventions and scripts.

Use this reference when applying Drizzle to another project with similar layout:
- Next.js App Router
- PostgreSQL (`pg`)
- Shared schema modules under `lib/*.db.ts`
- Environment-based logging gates
