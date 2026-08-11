# Student Management Dashboard

A Student Management Dashboard built for the FlyNest Global PLC junior fullstack technical assignment. An administrator can view, search, filter, add, edit, and delete students, with data persisted in PostgreSQL.

> See [`plan.md`](./plan.md) for the high-level plan and [`execution-plan.md`](./execution-plan.md) for the commit-by-commit execution checklist.

## Layout

```
student-management/
├── client/     # Next.js + TypeScript + Redux Toolkit + Tailwind CSS
└── server/     # Express 5 + TypeScript + Prisma + PostgreSQL

```

## Deployment

### Server — Render

The API deploys from the [`server/render.yaml`](./server/render.yaml) blueprint (Postgres + web service). Connect the `server/` directory as the service root or use the blueprint directly. `DATABASE_URL` is auto-set from the provisioned Postgres; set these env vars manually:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `CLIENT_URL` | your Vercel app URL, e.g. `https://student-management-dashboard-iota.vercel.app` |

The start command runs `npm run db:deploy && npm run start`, so migrations are applied automatically on boot.

### Client — Vercel

Deploy the `client/` directory to Vercel (framework preset: Next.js). Set the environment variable:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | your Render API URL, e.g. `https://student-management-api.onrender.com/api/v1` |

Steps:

1. Install the Vercel CLI: `npm i -g vercel`
2. `cd client && vercel link` and pick/create a project
3. Add the env var: `vercel env add NEXT_PUBLIC_API_URL production`
4. Deploy: `vercel deploy --prod`

After the Vercel app is live, update the server's `CLIENT_URL` env var on Render to the Vercel origin and redeploy so CORS allows the browser to call the API.