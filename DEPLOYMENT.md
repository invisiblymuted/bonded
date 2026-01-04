Deployment notes (Vercel + Cloudinary)
=====================================

This project uses a client (client/) and a server (server/) during local development.
For production on Vercel we recommend deploying the client as the frontend and using Cloudinary
for image storage so uploads don't send large base64 blobs to serverless functions.

Required environment variables (set these in the Vercel project Settings → Environment Variables):

- `VITE_CLOUDINARY_CLOUD_NAME` — your Cloudinary cloud name (used by client to upload images).
- `VITE_CLOUDINARY_UPLOAD_PRESET` — an unsigned upload preset in Cloudinary (or use signed server uploads).
- `POSTGRES_URL` or `DATABASE_URL` — if using the Postgres-backed APIs in `api/` or `server/`.
- Any other secret used by server (e.g., `SESSION_SECRET`, `JWT_SECRET`, `UPSTASH_REDIS_URL`, etc.)

Basic steps to deploy:

1. Connect the Git repository to Vercel (via the Vercel dashboard) and create a new project.
2. In Project Settings → Environment Variables add the variables above (use Production values).
3. For a simple deploy, deploy the client folder as the frontend:
   - In the Vercel project, set the Root Directory to `client`.
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. If you need the server routes on Vercel, ensure the API routes are present in the repository's
   `api/` directory (Vercel Functions). Server code under `server/` is an Express app (long-running)
   which is better suited to Render/Fly or a dedicated Node host — or convert the routes to Vercel
   serverless functions.

Cloudinary quick setup:

1. Sign up at https://cloudinary.com and create a new account (free tier available).
2. Create an unsigned upload preset in Settings → Upload → Upload presets → Add upload preset.
3. Add the `cloud name` and `upload preset` to the Vercel env vars listed above.

Notes on sessions and auth:

- Vercel serverless functions are ephemeral and cannot rely on in-memory session stores. Use JWTs
  or an external store (Redis/Upstash or Postgres) for session persistence.
- For the fastest route, use direct uploads from the client to Cloudinary and send the returned
  `secure_url` to your API to save on the user record.

Deploy from CLI (optional):

If you have the Vercel CLI configured locally you can run:

```bash
npx vercel --prod
```

If the CLI requires authentication you can create a token in Vercel (Account → Tokens) and run:

```bash
npx vercel --token $VERCEL_TOKEN --prod
```

If you'd like, I can attempt a CLI deploy now (I may need a Vercel token or interactive login).
