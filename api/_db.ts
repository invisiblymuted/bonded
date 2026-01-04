import { Pool } from "pg";

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

function createMissingPool() {
  return {
    query: async () => {
      throw new Error("POSTGRES_URL (or DATABASE_URL) is not set. Set the env var in your deployment.");
    },
    connect: async () => {
      throw new Error("POSTGRES_URL (or DATABASE_URL) is not set. Set the env var in your deployment.");
    }
  } as any;
}

export const pool = connectionString
  ? new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  : createMissingPool();

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (schemaReady) return schemaReady;
  schemaReady = (async () => {
    // if no connection string, attempting to connect will throw a helpful error from pool
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
