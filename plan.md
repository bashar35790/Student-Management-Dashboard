# Student Management Dashboard — Implementation Plan

**Stack decisions** (based on your answers + your HireFlow-API experience):
- **Monorepo**: `server/` (Express 5 + TypeScript + Prisma + PostgreSQL) and `client/` (Next.js + TypeScript + Redux Toolkit + Tailwind).
- Backend mirrors HireFlow-API patterns you already know (Prisma 7 + pg adapter, Zod validation, `{ success, message, data, meta? }` response shape).
- **Bonus features**: server-side pagination, sorting, debounced search, and a `/students/[id]` details page.

---

## Phase 0 — Scaffolding & Git (15–20 min)

**Tasks:**
- [ ] Init git repo in `/student-management` (already has empty `client/`, `server/` folders).
- [ ] Root `.gitignore` (`node_modules`, `.env`, `dist`, `.next`).
- [ ] Root `README.md` skeleton (sections filled in Phase 4).
- [ ] First commit: `chore: scaffold monorepo structure`

---

## Phase 1 — Backend (`server/`) ~ 2.5–3 hours

### 1.1 Project init & config (20 min)
- [ ] `npm init`, install: `express@5 cors dotenv zod`, dev: `typescript tsx prisma @types/express @types/cors @types/node`.
- [ ] `@prisma/client` v7 + `@prisma/adapter-pg` + `pg`.
- [ ] `tsconfig.json`, scripts: `dev`, `build`, `start`.
- [ ] `.env.example` -> `DATABASE_URL=`, `PORT=5000`, `CLIENT_URL=http://localhost:3000`.
- [ ] Verify: `npm run dev` boots Express.

**Acceptance:** server starts; env loaded from `.env`.

### 1.2 Database schema & migration (25 min)
- [ ] `prisma/schema.prisma`:
  ```prisma
  enum StudentStatus { ACTIVE INACTIVE }
  model Student {
    id        String        @id @default(cuid())
    name      String
    email     String        @unique
    phone     String
    class     String
    status    StudentStatus @default(ACTIVE)
    createdAt DateTime      @default(now())
    updatedAt DateTime      @updatedAt
  }
  ```
- [ ] `prisma/migrations/` via `prisma migrate dev --name init`.
- [ ] `prisma/seed.ts` -> 25 realistic students across classes (`Grade 9A...12B`) & statuses.
- [ ] Scripts: `db:generate`, `db:migrate`, `db:deploy`, `db:seed`, `db:studio`.

**Acceptance:** `npm run db:migrate` + `db:seed` populate a local Postgres DB.

### 1.3 Core infrastructure (30 min)
- [ ] `src/config/env.ts` — validates env with Zod, throws early on missing vars.
- [ ] `src/lib/prisma.ts` — PrismaClient using `PrismaPg` driver adapter.
- [ ] `src/utils/`: `response.ts`, `asyncHandler.ts`, `pagination.ts`, `sanitize.ts`.
- [ ] `src/middleware/`: `error.ts` (central 400/404/409/500 handler, logs stack in dev), `notFound.ts` (404), `validate.ts` (Zod schema middleware).
- [ ] `src/app.ts` (cors with `CLIENT_URL`, json, routes, 404, error handler) + `src/server.ts` (listen).
- [ ] Consistent response shape: `{ success, message, data, meta? }`.

### 1.4 Student module (1–1.5 hours)
- [ ] `src/routes/student.routes.ts`.
- [ ] `src/services/student/schema.ts` — Zod create/update schemas (name, email valid + unique, phone, class, status required; partial for PATCH).
- [ ] `src/services/student/service.ts` — Prisma queries only (no HTTP logic).
- [ ] `src/services/student/controller.ts` — parse query params -> service -> response/error.

**Endpoints:**
| Method | Route | Behavior |
|---|---|---|
| GET | `/api/v1/students` | filter `status`, `class`; search `name`/`email` (case-insensitive `contains`); page/limit/total meta; sort by `name`/`createdAt`/`class` |
| GET | `/api/v1/students/:id` | 200 or 404 |
| POST | `/api/v1/students` | 201, 400 on invalid, 409 duplicate email |
| PATCH | `/api/v1/students/:id` | sanitize + partial update, 404/400/409 |
| DELETE | `/api/v1/students/:id` | 200 `{success}` (or 204), 404 |
| GET | `/api/v1/health` | health check |

- [ ] Guard invalid `:id` (cuid) and invalid sort fields -> 400.

### 1.5 Backend verification (15 min)
- [ ] `curl` every endpoint: list + search + filters + pagination + sort, create, get, update, delete; confirm 400/404/409/500 codes.
- [ ] `.env.example` committed; `.env` ignored.
- [ ] Commit: `feat(server): student CRUD API with Prisma, Zod & search/filter/pagination`

**Acceptance:** all smoke tests pass; clean error codes.

---

## Phase 2 — Frontend (`client/`) ~ 3.5 hours

### 2.1 Scaffold (25 min)
- [ ] Create Next.js App Router + TS app in `client/` with Tailwind CSS.
- [ ] Install: `@reduxjs/toolkit react-redux react-hook-form @hookform/resolvers zod`.
- [ ] `.env.local.example` -> `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1`.
- [ ] `lib/api.ts` — fetch wrapper with base URL + JSON error extraction.

### 2.2 Redux Toolkit (35 min)
- [ ] `redux/store.ts` configured with Redux Toolkit provider in root layout.
- [ ] **RTK Query** `redux/services/studentApi.ts`:
  `getStudents(queryParams)`, `getStudent(id)`, `createStudent`, `updateStudent`, `deleteStudent`.
- [ ] `redux/features/studentListSlice.ts` — holds **search text, status filter, class filter, page, sort** (persisted so list refetches cleanly). Local component state used for **form inputs** (shows Redux-judgment: server state in RTK, ephemeral form state local).

**Decision rationale (for README):** RTK Query is the idiomatic RTK data layer — cache + invalidation + `isLoading`/`isError` states for free; filters/sorting live in a small slice; form fields stay as local React state.

### 2.3 Types (10 min)
- [ ] `types/student.ts` — `Student`, `StudentInput`, `StudentStatus`, `Paginated<T>`, `QueryParams` mirroring server Zod schemas.

### 2.4 Reusable components (1 hour)
- [ ] `components/ui/`: `Button`, `Input`, `Select`, `Spinner`, `Alert`, `Badge`, `ConfirmDialog`, `Pagination`, `EmptyState`, `ErrorState`.
- [ ] `components/student/`:
  - `StudentForm.tsx` — shared add/edit form (RHF + Zod), per-field messages (`Email is required.`, `Please enter a valid email address.`), submitting state, success/error alert.
  - `StudentTable.tsx` — desktop table (Student, Email, Phone, Class, Status, Actions); **mobile card layout** (`sm:` breakpoints).
  - `SearchBar.tsx` — debounced input (~300ms).
  - `StatusFilter.tsx` / `ClassFilter.tsx` (class options from data).
  - `SortableHeader` for Name/Class/Created sort.

### 2.5 Pages (1.25 hours)
- [ ] `app/layout.tsx` — Redux provider, header nav.
- [ ] `app/page.tsx` — students page:
  - Loads list via `getStudents` hook; wiring search/filter/page/sort from slice -> refetch.
  - **Loading** -> spinner/skeleton (`Loading students...`). **Empty** -> `No students found.` **Error** -> `Unable to load students. Please try again.` + Retry button.
  - Pagination controls; delete button opens `ConfirmDialog` (`Are you sure you want to delete this student?`).
- [ ] `app/students/new/page.tsx` — add form -> POST -> redirect to list.
- [ ] `app/students/[id]/page.tsx` — details page (profile header, info grid, Edit link, Delete).
- [ ] `app/students/[id]/edit/page.tsx` — pre-filled edit form -> PATCH -> success state.

### 2.6 Frontend verification (20 min)
- [ ] Full CRUD flow test against running server; responsive check; lint + `next build`.
- [ ] Commit: `feat(client): student dashboard with RTK Query, forms, filters & states`

**Acceptance:** add/edit/delete works end-to-end; all loading/empty/error states visible; renders on mobile.

---

## Phase 3 — Deployment (optional but planned) ~ 30 min
- [ ] `server/render.yaml` (like HireFlow) — blueprints Postgres + API, sets `DATABASE_URL`, runs `db:deploy` on start.
- [ ] Client deployable to Vercel with `NEXT_PUBLIC_API_URL` -> Render API URL (document steps only).
- [ ] Document CORS origin and env vars per environment.

---

## Phase 4 — README & Submission Prep (40 min)
- [ ] README sections: **Overview** (stack + folder structure + why Express-vs-Next-API-routes), **Requirements**, **Installation**, **Environment Variables**, **Database Setup**, **Running**, **Available Scripts**, **Deployment**, **API summary**.
- [ ] **Short explanation** (Question 20):
  1. Most challenging part: server-side search/filter/pagination composition + keeping frontend sort/filter state in sync with URL.
  2. Proudest decision: RTK Query + a single query-params slice keeps list/filter/pagination logic testable and avoids prop-drilling.
  3. With 4 more hours: unit tests (Vitest) for service layer + RTL for the list page, e2e via Playwright.
  4. Before production: add auth (HTTP-only cookie, like HireFlow), rate limiting, helmet, audit logging, migrations check, and move to a hosted DB with backups.
- [ ] Final QA pass: fresh clone -> `npm install` -> migrate -> seed -> run both -> test.
- [ ] Commits: docs + final polish, pushed to GitHub.

---

## Deliverables
- Working `server/` (Express + Prisma + Postgres) & `client/` (Next.js + RTK + Tailwind).
- Git repo with phased commit history.
- `README.md` with all required sections + 4-answer explanation.
- Render/Vercel deploy steps (or live URLs).