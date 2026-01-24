Summary

This repo is a full-stack TypeScript app with a Vite React client and an Express-based server plus optional Vercel-style `api/` functions. Use this file to quickly understand how to run, change, and extend the project.

Key architecture
- **Frontend:** [client](client) — Vite + React. Dev: `cd client && npm run dev`. Build: `npm run build` in `client`.
- **Backend (dev / standalone):** [server/index.ts](server/index.ts) — Express server used in `npm run dev` (root). Dev runner uses `tsx` (see root `package.json` script `dev`). Server listens on port 5001.
- **Serverless / Deploy APIs:** [api/](api) — a set of serverless-style endpoint handlers (used for Vercel deployments). These mirror many routes provided by the Express server locally.
- **Database / ORM:** Drizzle ORM. Table schema and types live in [shared/schema.ts](shared/schema.ts). Connection setup is in [server/db.ts](server/db.ts) and [api/_db.ts](api/_db.ts). Migrations use `drizzle-kit` and `drizzle.config.ts`.

Important workflows & commands
- Local full-stack dev (server + client): `npm run dev:all` from repo root — runs the Express server and Vite client concurrently.
- Backend-only dev: `npm run dev` from root (runs `tsx server/index.ts`).
- Production build (client): `cd client && npm run build` or run root `npm run build` which forwards to `npx vite build`.
- DB migrations: `npm run db:push` (uses `drizzle-kit`). Ensure `POSTGRES_URL` or `DATABASE_URL` is set.

Environment hints
- The server expects a Postgres URL in `POSTGRES_URL` or `DATABASE_URL`. If not set, `api/_db.ts` and `server/db.ts` will throw a helpful error during connection.
- Dev port: Express server uses port `5001`. Vite typically serves at `5173`.
- Request body limit: the Express JSON/body parsers are configured with `limit: "20mb"` (base64 image uploads supported) — see [server/index.ts](server/index.ts).

Project-specific patterns & conventions
- Routes: backend API endpoints live under `/api/*`. The canonical, authoritative route definitions live in [server/routes.ts](server/routes.ts) for local/server builds and are mirrored by handlers in `api/` for serverless deployments.
- Storage abstraction: route handlers call a `storage` abstraction (see [server/storage.ts]) — prefer using the storage API rather than raw SQL inside route handlers.
- Auth: auth setup is centralized in [server/auth.ts] and `jwt` support is wired in via `jwtMiddleware` in [server/index.ts]. When changing auth flows, update both `server/` and any `api/` handlers that must match.
- DB schema location: canonical table definitions and type exports are in [shared/schema.ts](shared/schema.ts). Use the exported `Insert*` types when accepting or validating payloads.
- Drizzle usage: the project uses `drizzle-orm` + `drizzle-zod`. See `shared/schema.ts` for `createInsertSchema` usage patterns.

Quick code examples (search-and-edit patterns)
- Add a new API route: add route in [server/routes.ts](server/routes.ts) and, if deploying serverless, add a matching handler in `api/`.
- Use typed inserts: import `InsertMessage` / `InsertRelationship` from [shared/schema.ts](shared/schema.ts) when creating new rows with Drizzle.

Files to inspect first when debugging
- [server/index.ts](server/index.ts) — startup, middleware, vite bridge.
- [server/routes.ts](server/routes.ts) — all server-side API route logic.
- [server/storage.ts] and [api/_db.ts] — DB connection and storage helpers.
- [shared/schema.ts](shared/schema.ts) — table definitions and Zod-based insert schemas.
- [drizzle.config.ts](drizzle.config.ts) — where `drizzle-kit` looks for the schema and DB credentials.

Testing & safety notes
- There are no dedicated test scripts in the repo. Run TypeScript checks with `npm run check` (root) to catch type issues.
- When editing DB migrations, run `npm run db:push` against a dev database and confirm `shared/schema.ts` types remain compatible.

When in doubt
- Follow the storage abstraction and the types in `shared/schema.ts` rather than inlining SQL in routes.
- Prefer editing [server/routes.ts](server/routes.ts) for local server changes; mirror those changes into `api/` handlers only if you intend to deploy serverless.

If anything here is incorrect or you want extra examples (e.g. common storage helpers, auth flow diagrams), tell me which area to expand.
