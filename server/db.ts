import pg from 'pg';
const { Pool } = pg;
import { drizzle } from 'drizzle-orm/node-postgres';

// This tells the app: "Use the URL I just put in the .env file"
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool);