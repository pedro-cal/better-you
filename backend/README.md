# @better-you/backend

Next.js 15 App Router API server for the Better You platform.

## Architecture overview

```
backend/
├── app/
│   └── api/          # Route handlers (Next.js App Router)
│       └── health/   # GET /api/health → { ok: true }
├── src/
│   └── db/
│       └── schema.ts # Drizzle table definitions (source of truth)
├── drizzle/          # Generated SQL migrations (do not edit manually)
├── drizzle.config.ts # Drizzle CLI config (schema path, DB dialect)
└── .env              # Local env vars (not committed)
```

### How the pieces fit together

| Layer | Tool | Role |
|---|---|---|
| HTTP routing | Next.js App Router | `app/api/**` route handlers handle requests |
| Database access | `drizzle-orm` | Type-safe query builder used inside route handlers |
| Schema management | `drizzle-kit` | Reads `schema.ts`, generates and runs SQL migrations |
| Database | PostgreSQL | Hosted anywhere — resolved via `DATABASE_URL` |
| Shared types | `@better-you/shared` | TypeScript types imported by both backend and mobile |

### Data flow

```
Mobile app
  → POST /api/goals
    → route handler in app/api/goals/route.ts   (not yet created — B4)
      → drizzle-orm query against Postgres
        → returns { data: Goal } | { error: string }
```

### Schema

`src/db/schema.ts` defines all 9 tables using Drizzle's TypeScript DSL:

| Table | Entity |
|---|---|
| `users` | Accounts + preferences |
| `availability` | Weekly minutes/day capacity plan |
| `journeys` | Optional goal containers by life domain |
| `path_templates` | Reusable curated paths (system/AI) |
| `goals` | User goals, state-machine driven |
| `paths` | PathInstance — one per goal, optionally from a template |
| `steps` | StepInstance — recurring or one-time tasks inside a path |
| `checkins` | Daily done/partial/skipped records per step |
| `checkpoints` | Weekly reflections per goal |

Domain enum values (`LifeDomain`) are imported from `@better-you/shared` — not redeclared here.

### Migration workflow

```
Edit schema.ts  →  pnpm db:generate  →  new .sql file in drizzle/
                →  pnpm db:migrate   →  applied to the database
```

Never edit files inside `drizzle/` by hand.

---

## Local dev setup

### 1. Start a local Postgres (Docker)

```bash
docker run --name betteryou-db \
  -e POSTGRES_PASSWORD=pw \
  -e POSTGRES_DB=betteryou \
  -p 5432:5432 \
  -d postgres
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and set:
# DATABASE_URL=postgresql://postgres:pw@localhost:5432/betteryou
```

### 3. Apply migrations

```bash
pnpm db:migrate
```

### 4. Verify the schema (visual UI)

```bash
pnpm db:studio
# Opens https://local.drizzle.studio — browse tables, run queries
```

---

## Available scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Start Next.js dev server on port 3000 |
| `pnpm typecheck` | TypeScript check (no emit) |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Diff schema.ts → emit new SQL migration |
| `pnpm db:migrate` | Apply pending migrations to `DATABASE_URL` |
| `pnpm db:studio` | Open Drizzle Studio (visual DB browser) |
