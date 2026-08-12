# Student Management Client

## Project Overview
This is the client-side implementation of the Student Management Dashboard, built using Next.js (App Router), TypeScript, Tailwind CSS, and Redux Toolkit. It features a premium, modern "glassmorphism" design system and consumes a REST API for comprehensive CRUD operations with sorting, filtering, and pagination.

## Requirements
- Node.js 20+
- npm

## Installation
```bash
npm install
```

## Environment Variables
The application requires an environment variable to point to the backend API.
Example (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```
*Do not commit real credentials or secrets.*

## Database Setup
The client application does not directly connect to a database. See the server directory for database setup instructions.

## Running the Application
```bash
npm run dev
```

## Available Scripts
- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Serves the production build.
- `npm run lint`: Runs ESLint for code quality.

## Additional Notes
The application state is managed using Redux Toolkit Query (RTK Query) for efficient server state caching and automated data fetching, while relying on Tailwind v4 CSS for dynamic styling and glassmorphism theming.
