import { Pool } from "pg";

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("POSTGRES_URL (or DATABASE_URL) is not set. Add it in Vercel envs.");
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (schemaReady) return schemaReady;
  schemaReady = (async () => {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS app_users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          display_name TEXT NOT NULL,
          birthday DATE NOT NULL,
          pin_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS app_sessions (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ DEFAULT now()
        );
      `);
    } finally {
      client.release();
    }
  })();
  return schemaReady;
}
