# Student Management Server

## Project Overview
This is the server-side REST API implementation for the Student Management Dashboard. It is built using Node.js, Express 5, TypeScript, Prisma ORM, and PostgreSQL. It provides structured and validated endpoints for creating, reading, updating, and deleting student records, alongside search and pagination.

## Requirements
- Node.js 20+
- npm
- PostgreSQL 14+

## Installation
```bash
npm install
```

## Environment Variables
The application requires the following environment variables for configuration and database connectivity.
Example (`.env`):
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/student_management
CLIENT_URL=http://localhost:3000
```
*Do not commit real credentials or secrets.*

## Database Setup
Ensure PostgreSQL is running and create the database. Then run Prisma migrations to set up the schema and seed initial data:
```bash
createdb student_management
npx prisma migrate dev
npm run db:seed
```

## Running the Application
```bash
npm run dev
```

## Available Scripts
- `npm run dev`: Runs the API server in development mode with hot-reloading.
- `npm run build`: Generates the Prisma client and compiles the TypeScript code.
- `npm run start`: Runs the compiled server from `dist/server.js`.
- `npm run db:migrate`: Applies Prisma migrations to the database.
- `npm run db:seed`: Seeds the database with 20 demo student records.

## Additional Notes
The server architecture strictly separates controllers and services, using Zod for robust input validation. It adheres to a standard success/error response pattern to make parsing straightforward on the client.
