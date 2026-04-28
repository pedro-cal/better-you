# Better You — Next Steps

## How to use this file

1. Read `STATUS.md` for full project context and tech stack.
2. Read `PRODUCT_FOUNDATIONS.md` for domain rules, entities, and API surface (authoritative).
3. Find the first phase below where status is `[ ]` and all prerequisites are `[x]`.
4. Mark it `[~]`, implement only what's listed, mark it `[x]` when done.
5. Verify with `pnpm typecheck && pnpm lint` from the repo root before finishing.

---

## Status
- `[ ]` Not started · `[~]` In progress · `[x]` Complete

---

## B1 — Backend Scaffold `[x]`
**Prerequisites**: none  
**Scope**: Create the `backend/` package. No business logic yet.

- Init `backend/` as a Next.js 15 App Router + TypeScript package named `@better-you/backend`
- `pnpm-workspace.yaml` already lists it — just needs the folder and `package.json`
- Add `@better-you/shared: workspace:*` as a dependency
- Match ESLint/Prettier config style from root
- `backend/.env.example`: `DATABASE_URL`, `JWT_SECRET`, `PORT=3000`
- `backend/app/api/health/route.ts`: returns `{ ok: true }` — only route needed for this phase
- Run `pnpm install` from root after creating `package.json`

---

## B2 — Database Schema & Migrations `[x]`
**Prerequisites**: B1 `[x]`  
**Scope**: PostgreSQL schema using entities from `PRODUCT_FOUNDATIONS.md §8`.

- ORM: **Drizzle** (`drizzle-orm` + `drizzle-kit` + `postgres` driver)
- Tables: `users`, `availability`, `goals`, `paths`, `steps`, `checkins`, `checkpoints`, `journeys`, `path_templates`
- Import TypeScript types from `@better-you/shared` — do not redeclare
- Add scripts: `db:generate`, `db:migrate`, `db:studio`
- Run `db:generate` to emit the initial migration

---

## B3 — Auth Endpoints `[x]`
**Prerequisites**: B2 `[x]`  
**Scope**: JWT auth designed to be replaced by Auth0/Clerk later.

- Packages: `bcryptjs`, `jsonwebtoken` + types
- `backend/lib/auth.ts`: `signJwt` / `verifyJwt` helpers
- `backend/lib/withAuth.ts`: route handler wrapper → injects `userId`, returns 401 if invalid
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/me`, `PATCH /api/me/preferences` (both protected)
- Reuse/extend Zod schemas from `shared/src/schemas.ts`
- All responses: `{ data: T }` on success, `{ error: string }` on failure

---

## B4 — Goals & Steps CRUD `[x]`
**Prerequisites**: B3 `[x]`  
**Scope**: Core APIs. Rules in `PRODUCT_FOUNDATIONS.md §7` (state machine) and `§Quick Reference`.

- `GET /api/goals`, `POST /api/goals` (include capacity/overload check on create)
- `POST /api/goals/:id/transition`
- `GET /api/goals/:id/steps`, `POST /api/goals/:goalId/steps`, `PATCH /api/steps/:id`

---

## B5 — Check-ins & Checkpoints `[x]`
**Prerequisites**: B4 `[x]`  
**Scope**: Daily loop and weekly reflection. Rules in `PRODUCT_FOUNDATIONS.md §Quick Reference`.

- `POST /api/checkins` — idempotent by `(step_id, date)`; immutability rules enforced server-side
- `GET /api/checkins`
- `POST /api/checkpoints`, `POST /api/adjustments`

---

## B6 — Path Templates `[x]`
**Prerequisites**: B2 `[x]`  *(can run parallel to B3–B5)*  
**Scope**: Read-only template catalog.

- Seed `path_templates` with a few entries per `LifeDomain`
- `GET /api/path-templates`, `GET /api/path-templates/:id`
- `POST /api/goals/from-template` — create goal + path + steps in one transaction

---

## F1 — API Client & Auth (Mobile) `[ ]`
**Prerequisites**: B3 `[x]`  
**Scope**: Replace mocks with real API calls; add auth gate.

- `mobile/src/lib/apiClient.ts` — typed fetch wrapper using `API_BASE_URL` (already in `mobile/src/lib/env.ts`)
- Store JWT in MMKV; attach to every request
- `mobile/src/features/auth/useAuth.ts` — login/register React Query hooks
- `mobile/app/auth/login.tsx`, `mobile/app/auth/register.tsx`
- Gate `(tabs)` layout behind auth in `mobile/app/_layout.tsx`

---

## F2 — Goals Screen (Real Data) `[ ]`
**Prerequisites**: F1 `[x]`, B4 `[x]`  
**Scope**: Remove mock imports from `mobile/app/(tabs)/goals.tsx`.

- `mobile/src/features/goals/useGoals.ts` — `GET /api/goals`
- `mobile/src/features/goals/useMutateGoal.ts` — create/transition mutations
- Wire the "GOALS" / "JOURNEYS" tab selector to actually filter content
- Fix `BottomNav` `case "act"` on Goals tab (currently a no-op `break`)

---

## F3 — Home/Act Screen (Real Data) `[ ]`
**Prerequisites**: F1 `[x]`, B5 `[x]`  
**Scope**: Remove mock imports from `mobile/app/(tabs)/index.tsx`.

- `mobile/src/features/checkins/useCheckins.ts` — today's steps + status
- `mobile/src/features/checkins/useSubmitCheckin.ts` — `POST /api/checkins`
- Implement the two `TODO` handlers in `index.tsx` (step action + step detail navigation)

---

## F4 — Goal Creation Flow `[ ]`
**Prerequisites**: F2 `[x]`, B6 `[x]`  
**Scope**: New screens for creating a goal from a template.

- `mobile/app/goals/new.tsx` — template browser
- `mobile/app/goals/confirm.tsx` — review + overload warning (utilization >0.9)
- Use `mobile/utils/estimateCompletion.ts` for projected completion date

---

## F5 — Metrics Screen (Real Data) `[ ]`
**Prerequisites**: F1 `[x]`, B5 `[x]`  
**Scope**: Remove mock imports from `mobile/app/(tabs)/metrics.tsx`.

- `mobile/src/features/metrics/useDomainStats.ts`
- Wire domain tab selector to filter displayed stats

---

## F6 — Push Notifications `[ ]`
**Prerequisites**: F1 `[x]`  
**Scope**: Fix the stub in `mobile/src/lib/notifications.ts` (permission always returns `true`).

- Real permission request flow
- Register Expo push token via `PATCH /api/me/preferences`
- Daily reminder at user-configured time

---

## X1 — Weekly Checkpoint Flow `[ ]`
**Prerequisites**: F3 `[x]`, B5 `[x]`  
**Scope**: In-app checkpoint UX per `PRODUCT_FOUNDATIONS.md §11`.

- Checkpoint screen with 3 prompts → `POST /api/checkpoints`
- Soft-gate new goal creation behind incomplete checkpoint (non-punitive — can dismiss)
