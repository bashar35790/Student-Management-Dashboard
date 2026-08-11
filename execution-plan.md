# Student Management Dashboard — Execution Plan

**Goal:** Build + commit the project in small, reviewable parts. Every task below maps to ONE logical commit so the git history reads cleanly.

**Repo layout:**
```
student-management/
├── client/     # Next.js + TS + Redux Toolkit + Tailwind
├── server/     # Express 5 + TypeScript + Prisma + PostgreSQL
├── plan.md           # high-level plan
├── execution-plan.md # this file (commit-by-commit checklist)
└── README.md
```

**Conventions:**
- Commit style: `type(scope): message` e.g. `feat(server): add student CRUD API`
- Always commit working, buildable code (test before each commit).
- After the chosen phase, commit and move to the next.

---

## PHASE 0 — Repo scaffolding (1 commit)

### Task 0.1 — Init repo & root files
- [ ] `git init`
- [ ] Root `.gitignore`: `node_modules/`, `.env`, `.env.local`, `dist/`, `.next/`, `.DS_Store`, `*.log`
- [ ] Root `README.md` skeleton (title + "see plan.md / execution-plan.md")
- [ ] Root `plan.md` + `execution-plan.md` already present

**Commit 1** → `chore: scaffold monorepo with README and gitignore`

---

## PHASE 1 — Backend setup (server/)

### Task 1.1 — Init server package
- [ ] `cd server && npm init -y`
- [ ] Install deps: `npm i express@5 cors dotenv zod`
- [ ] Install dev deps: `npm i -D typescript tsx prisma @types/express @types/cors @types/node`
- [ ] `npx tsc --init` with good TS config (`"target": "es2022"`, `"module": "nodenext"`, `"outDir": "dist"`, `"rootDir": "src"`, strict, `"moduleResolution": "nodenext"`)
- [ ] `package.json` scripts: `dev`, `build`, `start`, `db:generate`, `db:migrate`, `db:deploy`, `db:seed`, `db:studio`
- [ ] `.env.example`: `DATABASE_URL`, `PORT`, `CLIENT_URL`

**Commit 2** → `chore(server): init express + typescript project`

### Task 1.2 — Minimal bootable server
- [ ] `src/config/env.ts` — Zod-validated env (throws if missing)
- [ ] `src/app.ts` — express app with `cors(CLIENT_URL)`, `express.json()`
- [ ] `src/server.ts` — `app.listen(PORT)`
- [ ] Verify: `npm run dev` boots and `GET /` returns a hello response

**Commit 3** → `feat(server): add env config and bootable express app`

### Task 1.3 — Prisma schema & migration
- [ ] Install: `npm i @prisma/client` + `npm i -D prisma @prisma/adapter-pg pg @types/pg`
- [ ] `prisma/schema.prisma`:
  ```prisma
  generator client { provider = "prisma-client-js" }
  datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

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
- [ ] Create local DB: `createdb student_management` (or via pgAdmin)
- [ ] Add `DATABASE_URL='postgresql://<user>:<pass>@localhost:5432/student_management'` to `.env`
- [ ] `npx prisma migrate dev --name init`
- [ ] `src/lib/prisma.ts` — PrismaClient instance with `PrismaPg` adapter
- [ ] Verify: `npx prisma studio` opens with empty `Student` table

**Commit 4** → `feat(server): prisma schema and initial migration`

### Task 1.4 — Seed data
- [ ] `prisma/seed.ts` — 8–12 students across classes (`Grade 9A`…`Grade 12B`), mixed statuses, realistic names/emails/phones
- [ ] Wire seed script in `package.json` (`prisma db seed` via tsx)
- [ ] Run `npm run db:seed`; verify rows exist

**Commit 5** → `feat(server): seed script with demo students`

### Task 1.5 — Shared infrastructure
- [ ] `src/utils/response.ts` — `sendSuccess`, `sendData`, `sendError` helpers with consistent `{ success, message, data, meta? }` shape
- [ ] `src/utils/asyncHandler.ts` — wraps async route handlers, forwards errors
- [ ] `src/utils/pagination.ts` — `parsePagination(query)` -> `{ page, limit, skip }`
- [ ] `src/middleware/errorHandler.ts` — central 400/404/409/409/500 handler, logs stack in dev
- [ ] `src/middleware/notFound.ts` — 404 for unknown routes
- [ ] `src/middleware/validate.ts` — Zod schema middleware (create `req.body` validation)

**Commit 6** → `feat(server): response helpers, async handler and error middleware`

### Task 1.6 — Student schema & validation
- [ ] `src/services/student/schema.ts` — Zod:
  - `createStudentSchema`: name (min 1), email (valid format), phone (min 1), class (min 1), status enum
  - `updateStudentSchema`: all fields optional
  - `querySchema`: `search`, `status`, `class`, `page`, `limit`, `sortBy`, `sortOrder`
- [ ] Export inferred TS types

**Commit 7** → `feat(server): zod schemas for student create/update/query`

### Task 1.7 — Student service & controller
- [ ] `src/services/student/service.ts` — Prisma-only functions:
  - `listStudents({ search, status, class, page, limit, sortBy, sortOrder })` with:
    - `where` with `name`/`email` contains (case-insensitive) + status/class filters
    - `orderBy` from validated sort + `findMany`/`count` for pagination meta
  - `getStudentById(id)`, `createStudent(data)` (catch `P2002` at controller), `updateStudent(id, data)`, `deleteStudent(id)`
- [ ] `src/services/student/controller.ts` — map request -> service -> response, map Prisma `P2002` to 409, invalid id to 400

**Commit 8** → `feat(server): student service and controller`

### Task 1.8 — Routes & wiring
- [ ] `src/routes/student.routes.ts` with `validate()` middleware
- [ ] Wire routes in `app.ts` under `/api/v1`
- [ ] `GET /api/v1/health`
- [ ] Endpoints:
  - `GET /api/v1/students` (search? status? class? page? limit? sortBy? sortOrder?)
  - `GET /api/v1/students/:id`
  - `POST /api/v1/students`
  - `PATCH /api/v1/students/:id`
  - `DELETE /api/v1/students/:id`
- [ ] 404 handler + error handler registered last

**Commit 9** → `feat(server): student API routes wired into app`

### Task 1.9 — Backend smoke test
- [ ] `npm run dev`
- [ ] `curl` tests:
  - `GET /api/v1/students` -> `{ success, data, meta }`
  - `GET /api/v1/students?search=alice` -> filtered
  - `GET /api/v1/students?status=ACTIVE&class=Grade%209A`
  - `GET /api/v1/students?page=2&limit=5&sortBy=name&sortOrder=asc`
  - `POST /api/v1/students` valid -> 201
  - `POST /api/v1/students` invalid email -> 400
  - `POST` duplicate email -> 409
  - `GET /api/v1/students/<bad-id>` -> 404
  - `PATCH` update -> 200
  - `DELETE` -> 200, then GET -> 404
- [ ] Fix any issues before committing

**Commit 10** → `chore(server): document API smoke test results` (or fix commit)

---

## PHASE 2 — Frontend setup (client/)

### Task 2.1 — Scaffold Next.js
- [ ] `cd client && npx create-next-app@latest . --ts --eslint --tailwind --app --src-dir=false --import-alias "@/*"`
- [ ] Verify Tailwind config + `next dev` runs on port 3000
- [ ] `.env.local.example` -> `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1`
- [ ] Add `.env.local` (gitignored) with the same value

**Commit 11** → `chore(client): scaffold create-next-app with tailwind`

### Task 2.2 — Install Redux + forms packages
- [ ] `npm i @reduxjs/toolkit react-redux react-hook-form @hookform/resolvers zod`

**Commit 12** → `chore(client): install redux toolkit and react-hook-form`

### Task 2.3 — API client & types
- [ ] `lib/api.ts` — typed `fetch` wrapper (base URL from `NEXT_PUBLIC_API_URL`, JSON body, throws parsed error message)
- [ ] `types/student.ts`:
  - `StudentStatus = 'ACTIVE' | 'INACTIVE'`
  - `Student` (id, name, email, phone, class, status, createdAt, updatedAt)
  - `StudentInput` (create payload)
  - `StudentQuery` (search, status, class, page, limit, sortBy, sortOrder)
  - `Paginated<T>` (data, meta: { total, page, limit, totalPages })

**Commit 13** → `feat(client): api client and shared student types`

### Task 2.4 — Redux store + RTK Query
- [ ] `redux/store.ts` — `configureStore({ reducer: { studentApi, studentList } })`
- [ ] `redux/hooks.ts` — typed `useAppDispatch`, `useAppSelector`
- [ ] `redux/services/studentApi.ts` — RTK Query slice:
  - `getStudents: { search, page, limit } | StudentQuery`
  - `getStudent: { id }`
  - `createStudent: StudentInput`
  - `updateStudent: { id } & Partial<StudentInput>`
  - `deleteStudent: { id }`
  - tags: `{ type: 'Student', id: 'LIST' }` + per-id; invalidate LIST on create/update/delete
- [ ] `redux/features/studentListSlice.ts` — holds `search`, `status`, `class`, `page`, `sortBy`, `sortOrder`
- [ ] Wrap `<App/>` in Redux `Provider` in `app/providers.tsx` + `layout.tsx`

**Commit 14** → `feat(client): redux store with rtk query student api`

### Task 2.5 — UI primitives
- [ ] `components/ui/Button.tsx` (variants: primary/secondary/danger/ghost, `loading` prop)
- [ ] `components/ui/Input.tsx` (label + error message slot)
- [ ] `components/ui/Select.tsx` (options + error slot)
- [ ] `components/ui/Spinner.tsx`
- [ ] `components/ui/Alert.tsx` (success/error/danger variants)
- [ ] `components/ui/Badge.tsx` (status coloring)
- [ ] `components/ui/ConfirmDialog.tsx` (confirm/cancel, danger styling)
- [ ] `components/ui/Pagination.tsx` (prev/next + page indicator)
- [ ] `components/ui/EmptyState.tsx` (`No students found.`)
- [ ] `components/ui/ErrorState.tsx` (`Unable to load students. Please try again.` + Retry button)
- [ ] `components/ui/LoadingState.tsx` (`Loading students...` + skeleton rows)

**Commit 15** → `feat(client): reusable ui primitives palette`

### Task 2.6 — Student form component
- [ ] `components/student/StudentForm.tsx`:
  - Uses `react-hook-form` + `zodResolver` with the same rules as the API
  - Fields: name, email, phone, class, status (select)
  - Client validation messages: `Email is required.`, `Please enter a valid email address.`, etc.
  - Props: `initialValues?` (edit mode), `onSubmit(data)`, `isSubmitting`, `error?`
  - Success/error alert display
- [ ] Used by both `new` and `edit` pages later

**Commit 16** → `feat(client): shared student form with react-hook-form + zod`

### Task 2.7 — Table + list controls
- [ ] `components/student/StudentTable.tsx`:
  - Desktop: `<table>` with columns Student (avatar+name+email), Phone, Class, Status, Actions (Edit link, Delete button)
  - Mobile: card-style list (`hidden md:table` / `md:hidden` cards)
  - Empty/loading/error slots handled by parent
- [ ] `components/student/SearchBar.tsx` — debounced input (~300ms), controlled by slice
- [ ] `components/student/StatusFilter.tsx` — All / Active / Inactive, controlled by slice
- [ ] `components/student/ClassFilter.tsx` — `All classes` + options derived from fetched data, controlled by slice
- [ ] Sort toggle in table header for Name / Class / Created

**Commit 17** → `feat(client): student table, debounced search and filters`

### Task 2.8 — Students list page (`/`)
- [ ] `app/page.tsx`:
  - Reads filters from `studentListSlice`
  - `useGetStudentsQuery(filters)` -> `data`, `isLoading`, `isError`, `refetch`
  - Renders `LoadingState` / `ErrorState` + Retry / `EmptyState` / table + `Pagination`
  - Header with "Add Student" button -> `/students/new`
  - Delete: opens `ConfirmDialog` (`Are you sure you want to delete this student?`), on confirm `useDeleteStudentMutation` -> shows success toast/alert
- [ ] `app/layout.tsx` — global nav header with title

**Commit 18** → `feat(client): students list page with all states and delete flow`

### Task 2.9 — Add student page
- [ ] `app/students/new/page.tsx` — renders `StudentForm`, on submit `useCreateStudentMutation`, on success alert + redirect to `/`, on error show server message

**Commit 19** → `feat(client): add student page`

### Task 2.10 — Student details page
- [ ] `app/students/[id]/page.tsx`:
  - `useGetStudentQuery(id)`, loading/error/empty states
  - Profile card: name, email, phone, class, status badge, createdAt
  - Actions: Edit -> `/students/[id]/edit`, Delete (ConfirmDialog + mutation, redirect to `/`)

**Commit 20** → `feat(client): student details page`

### Task 2.11 — Edit student page
- [ ] `app/students/[id]/edit/page.tsx`:
  - `useGetStudentQuery(id)` to prefill form
  - `useUpdateStudentMutation` on submit (only changed fields)
  - Success alert + redirect; error alert on failure

**Commit 21** → `feat(client): edit student page`

### Task 2.12 — Frontend smoke test
- [ ] Both servers running (`npm run dev`)
- [ ] Manual checks:
  - List loads with seed data
  - Search narrows list; filters combine; pagination works; sort toggles
  - Add -> appears in list
  - Edit -> updates in list
  - Delete -> confirm dialog -> removed
  - Refresh `/students/123` bad id -> error/not found state
- [ ] `npm run lint` + `npm run build` pass
- [ ] Mobile viewport (DevTools) renders cards not a broken table

**Commit 22** → `chore(client): verify e2e flows and responsiveness`

---

## PHASE 3 — Deployment (optional)

### Task 3.1 — Server deploy config
- [ ] `server/render.yaml` (blueprint: Postgres + web service, `DATABASE_URL` auto-set, start command `npm run db:deploy && npm run start`)
- [ ] `server/build` + `start` scripts verified locally

**Commit 23** → `chore(server): add render deployment blueprint`

### Task 3.2 — Client deploy config
- [ ] Document Vercel deploy steps in README (set `NEXT_PUBLIC_API_URL` to Render URL, CORS origin to Vercel URL)

**Commit 24** → `chore(client): document vercel deployment`

---

## PHASE 4 — README & final polish

### Task 4.1 — README content
- [ ] Project overview (stack, folder structure, key decisions: Express+Prisma vs Next.js API routes)
- [ ] Requirements, Installation, Environment Variables (both apps), Database setup (create DB, migrate, seed)
- [ ] Running the application (two terminals)
- [ ] Available scripts (server + client)
- [ ] Deployment notes (Render + Vercel)
- [ ] API summary table
- [ ] Short explanation (Q20):
  1. Most challenging part
  2. Technical decision most proud of
  3. What to improve with 4 more hours
  4. What to change before production

**Commit 25** → `docs: complete README`

### Task 4.2 — Final QA
- [ ] Fresh clone test in `/tmp`: install both, migrate, seed, run, full CRUD
- [ ] `npm run build` passes in both apps
- [ ] Lint clean

**Commit 26** → `chore: final verification and cleanup`

---

## Commit summary (26 commits)
| # | Message |
|---|---|
| 1 | `chore: scaffold monorepo with README and gitignore` |
| 2 | `chore(server): init express + typescript project` |
| 3 | `feat(server): add env config and bootable express app` |
| 4 | `feat(server): prisma schema and initial migration` |
| 5 | `feat(server): seed script with demo students` |
| 6 | `feat(server): response helpers, async handler and error middleware` |
| 7 | `feat(server): zod schemas for student create/update/query` |
| 8 | `feat(server): student service and controller` |
| 9 | `feat(server): student API routes wired into app` |
| 10 | `chore(server): document api smoke test results` |
| 11 | `chore(client): scaffold create-next-app with tailwind` |
| 12 | `chore(client): install redux toolkit and react-hook-form` |
| 13 | `feat(client): api client and shared student types` |
| 14 | `feat(client): redux store with rtk query student api` |
| 15 | `feat(client): reusable ui primitives palette` |
| 16 | `feat(client): shared student form with react-hook-form + zod` |
| 17 | `feat(client): student table, debounced search and filters` |
| 18 | `feat(client): students list page with all states and delete flow` |
| 19 | `feat(client): add student page` |
| 20 | `feat(client): student details page` |
| 21 | `feat(client): edit student page` |
| 22 | `chore(client): verify e2e flows and responsiveness` |
| 23 | `chore(server): add render deployment blueprint` |
| 24 | `chore(client): document vercel deployment` |
| 25 | `docs: complete README` |
| 26 | `chore: final verification and cleanup` |