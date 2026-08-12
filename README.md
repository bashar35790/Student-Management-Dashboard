# Student Management Dashboard

A Student Management Dashboard built for the FlyNest Global PLC junior fullstack technical assignment. An administrator can view, search, filter, add, edit, and delete students, with data persisted in PostgreSQL.

## Overview

Fullstack monorepo with a REST API and a Next.js dashboard:

```
student-management/
├── client/     # Next.js (App Router) + TypeScript + Redux Toolkit (RTK Query) + Tailwind CSS
└── server/     # Express 5 + TypeScript + Prisma + PostgreSQL
```

**Stack decisions**

- **Backend — Express + Prisma**: a dedicated REST API (`server/`) mirrors the HireFlow-API patterns — Prisma 7 with the `pg` driver adapter, Zod validation, and a consistent `{ success, message, data, meta? }` response shape. Keeping the API separate from the Next.js app makes it deployable independently and testable in isolation.
- **Frontend — Next.js App Router + Redux Toolkit**: RTK Query manages all server state (caching, invalidation, `isLoading`/`isError` states) while a small slice holds list filters (search, status, class, page, sort). Form inputs stay as local React state via React Hook Form — server state in RTK, ephemeral UI state local.
- **Bonus features**: server-side pagination, sorting, debounced search, filtering by status/class, and a student details page.

## Requirements

- Node.js 20+ (developed on Node 24)
- npm
- PostgreSQL 14+ (local for development, or a hosted instance)

## Installation

Clone the repository and install dependencies for both apps:

```bash
git clone <repo-url> student-management
cd student-management

cd server && npm install && cd ..
cd client && npm install && cd ..
```

## Environment Variables

### Server (`server/.env`)

| Variable       | Description                  | Default                                                |
| -------------- | ---------------------------- | ------------------------------------------------------ |
| `NODE_ENV`     | `development` / `production` | `development`                                          |
| `DATABASE_URL` | PostgreSQL connection string | _required_                                             |
| `PORT`         | API port                     | `5000`                                                 |
| `CLIENT_URL`   | Allowed CORS origin          | `https://student-management-dashboard-iota.vercel.app` |

### Client (`client/.env.local`)

| Variable              | Description         | Default                                                   |
| --------------------- | ------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the API | `https://student-management-api-mpdp.onrender.com/api/v1` |

Both apps ship with committed example files (`.env.example` / `.env.local.example`) — copy them and fill in real values.

## Database Setup

```bash
cd server
createdb student_management          # or create via pgAdmin
npx prisma migrate dev               # apply migrations (db:migrate)
npm run db:seed                      # insert 20 demo students
npx prisma studio                    # (optional) browse the data
```

## Running the Application

Run both apps in two terminals:

```bash
# Terminal 1 — API (http://localhost:5000)
cd server
npm run dev

# Terminal 2 — Dashboard (http://localhost:3000)
cd client
npm run dev
```

## Available Scripts

### Server (`server/`)

| Script                | Description                            |
| --------------------- | -------------------------------------- |
| `npm run dev`         | Run API with hot reload                |
| `npm run build`       | Generate Prisma client + compile TS    |
| `npm run start`       | Run compiled server (`dist/server.js`) |
| `npm run db:migrate`  | Create/apply migrations                |
| `npm run db:deploy`   | Apply migrations (production)          |
| `npm run db:seed`     | Seed demo students                     |
| `npm run db:studio`   | Open Prisma Studio                     |
| `npm run db:generate` | Generate Prisma client                 |

### Client (`client/`)

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start Next.js dev server (port 3000) |
| `npm run build` | Production build                     |
| `npm run start` | Serve production build               |
| `npm run lint`  | Run ESLint                           |

## API Summary

Base URL: `https://student-management-api-mpdp.onrender.com/api/v1`

| Method | Path            | Description                                    |
| ------ | --------------- | ---------------------------------------------- |
| GET    | `/health`       | Health check                                   |
| GET    | `/students`     | List students (search, filter, paginate, sort) |
| GET    | `/students/:id` | Get a single student                           |
| POST   | `/students`     | Create a student (201)                         |
| PATCH  | `/students/:id` | Update a student (partial allowed)             |
| DELETE | `/students/:id` | Delete a student                               |

**Query params for `GET /students`**: `search` (name/email), `status` (`ACTIVE`/`INACTIVE`), `class`, `page`, `limit` (max 100), `sortBy` (`name`/`createdAt`/`class`), `sortOrder` (`asc`/`desc`).

**Error codes**: `400` validation, `404` not found, `409` duplicate email, `500` server error.

See [`server/API.md`](./server/API.md) for full request/response examples.

## Deployment

### Server — Render

The API deploys from the [`server/render.yaml`](./server/render.yaml) blueprint (Postgres + web service). Connect the `server/` directory as the service root or use the blueprint directly. `DATABASE_URL` is auto-set from the provisioned Postgres; set these env vars manually:

| Key          | Value                                                                            |
| ------------ | -------------------------------------------------------------------------------- |
| `NODE_ENV`   | `production`                                                                     |
| `PORT`       | `10000`                                                                          |
| `CLIENT_URL` | your Vercel app URL, e.g. `https://student-management-dashboard-iota.vercel.app` |

The start command runs `npm run db:deploy && npm run start`, so migrations are applied automatically on boot.

### Client — Vercel

Deploy the `client/` directory to Vercel (framework preset: Next.js). Set the environment variable:

| Key                   | Value                                                                          |
| --------------------- | ------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL` | your Render API URL, e.g. `https://student-management-api.onrender.com/api/v1` |

Steps:

1. Install the Vercel CLI: `npm i -g vercel`
2. `cd client && vercel link` and pick/create a project
3. Add the env var: `vercel env add NEXT_PUBLIC_API_URL production`
4. Deploy: `vercel deploy --prod`

After the Vercel app is live, update the server's `CLIENT_URL` env var on Render to the Vercel origin and redeploy so CORS allows the browser to call the API.

## Short Explanation

1. **Most challenging part**: composing server-side search, filtering, sorting, and pagination into a single Prisma query while keeping the frontend's sort/filter state in sync across refetches — getting the `where`/`orderBy`/`skip`/`take` combination right for every combination of params.
2. **Technical decision I'm most proud of**: using RTK Query for all server state plus a single query-params slice for the list page. Cache invalidation, `isLoading`/`isError` states, and automatic refetch on filter changes come for free, and it avoids prop-drilling the table's controls.
3. **What I'd improve with 4 more hours**: add unit tests (Vitest) for the service layer and component tests (React Testing Library) for the list page, plus an end-to-end Playwright suite covering the full CRUD flow.
4. **What I'd change before production**: add authentication (HTTP-only cookie, as in HireFlow), rate limiting and security headers (helmet), audit logging, and move to a managed hosted database with automated backups.
