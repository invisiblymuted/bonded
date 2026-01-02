#!/usr/bin/env node
import { Pool } from "pg";
import { randomUUID, createHash, randomBytes, scryptSync } from "crypto";

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("Error: POSTGRES_URL env var not set");
  process.exit(1);
}

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

function hashPin(pin: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pin, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

async function seedAdmin() {
  const client = await pool.connect();
  try {
    // Ensure schema
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

    // Insert admin
    const id = randomUUID();
    const username = "invisiblymuted";
    const displayName = "Peter";
    const birthday = "1995-01-01";
    const pin = "Infect531!";
    const pinHash = hashPin(pin);

    await client.query(
      `INSERT INTO app_users (id, username, display_name, birthday, pin_hash)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (username) DO NOTHING`,
      [id, username, displayName, birthday, pinHash]
    );

    console.log("✅ Admin account created: username=invisiblymuted, PIN=Infect531!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedAdmin();
