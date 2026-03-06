# Drizzle Migration Reference

This project stores generated SQL migrations in `drizzle/`.

Current example migration sequence:
- `0000_0000_uuidv7.sql`
- `0001_0001_base32.sql`
- `0002_0002_typeid.sql`
- `0003_0003_operator.sql`

The `meta/` folder contains drizzle-kit snapshots and journal state.

## Commands

- Generate migration: `pnpm drizzle:generate`
- Run migration: `pnpm drizzle:migrate`
- Push schema directly: `pnpm drizzle:push`
- Open studio: `pnpm drizzle:studio`
