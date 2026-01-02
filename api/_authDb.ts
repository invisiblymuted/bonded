import { randomUUID, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { pool, ensureSchema } from "./_db";

export type DbUser = {
  id: string;
  username: string;
  display_name: string;
  birthday: string;
  pin_hash: string;
};

const SALT_LEN = 16;

export function hashPin(pin: string): string {
  const salt = randomBytes(SALT_LEN).toString("hex");
  const hash = scryptSync(pin, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPin(pin: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const hashed = scryptSync(pin, salt, 32).toString("hex");
  try {
    return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(hashed, "hex"));
  } catch {
    return false;
  }
}

export async function getUserByUsername(username: string): Promise<DbUser | null> {
  await ensureSchema();
  const { rows } = await pool.query<DbUser>(
    "SELECT * FROM app_users WHERE username = $1",
    [username.toLowerCase()]
  );
  return rows[0] || null;
}

export async function listUsers(): Promise<Array<Pick<DbUser, "id" | "username" | "display_name">>> {
  await ensureSchema();
  const { rows } = await pool.query<DbUser>(
    "SELECT id, username, display_name FROM app_users ORDER BY display_name"
  );
  return rows.map((r) => ({ id: r.id, username: r.username, display_name: r.display_name }));
}

export async function createUser(input: { username: string; displayName: string; birthday: string; pin: string }): Promise<DbUser> {
  await ensureSchema();
  const id = randomUUID();
  const username = input.username.toLowerCase();
  const pin_hash = hashPin(input.pin);
  const { rows } = await pool.query<DbUser>(
    `INSERT INTO app_users (id, username, display_name, birthday, pin_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [id, username, input.displayName, input.birthday, pin_hash]
  );
  return rows[0];
}

export async function createSession(userId: string): Promise<string> {
  await ensureSchema();
  const sid = randomUUID();
  await pool.query(`INSERT INTO app_sessions (id, user_id) VALUES ($1, $2)`, [sid, userId]);
  return sid;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await ensureSchema();
  await pool.query(`DELETE FROM app_sessions WHERE id = $1`, [sessionId]);
}

export async function getUserFromSession(sessionId: string): Promise<DbUser | null> {
  await ensureSchema();
  const { rows } = await pool.query<{ user_id: string }>(
    `SELECT user_id FROM app_sessions WHERE id = $1`,
    [sessionId]
  );
  const session = rows[0];
  if (!session) return null;
  const { rows: userRows } = await pool.query<DbUser>(`SELECT * FROM app_users WHERE id = $1`, [session.user_id]);
  return userRows[0] || null;
}
