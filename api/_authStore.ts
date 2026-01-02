import { randomUUID, createHash } from "crypto";

export type UserRecord = {
  id: string;
  username: string;
  displayName: string;
  birthday: string;
  pinHash: string;
};

const users = new Map<string, UserRecord>();
const sessions = new Map<string, string>();

function seedUser(username: string, displayName: string, birthday = "1950-01-01", pin = "1234") {
  const id = randomUUID();
  users.set(username.toLowerCase(), {
    id,
    username: username.toLowerCase(),
    displayName,
    birthday,
    pinHash: hashPin(pin),
  });
}

// Seed a few sample users
seedUser("daddy", "Daddy");
seedUser("sarah", "Sarah");
seedUser("james", "James");
seedUser("emily", "Emily");

export function hashPin(pin: string) {
  return createHash("sha256").update(pin).digest("hex");
}

export function listUsers(): Array<Pick<UserRecord, "id" | "username" | "displayName">> {
  return Array.from(users.values()).map(({ id, username, displayName }) => ({ id, username, displayName }));
}

export function findUser(username: string): UserRecord | undefined {
  return users.get(username.toLowerCase());
}

export function createUser(input: { username: string; displayName: string; birthday: string; pin: string }): UserRecord {
  const { username, displayName, birthday, pin } = input;
  const user: UserRecord = {
    id: randomUUID(),
    username: username.toLowerCase(),
    displayName,
    birthday,
    pinHash: hashPin(pin),
  };
  users.set(user.username, user);
  return user;
}

export function createSession(userId: string): string {
  const sid = randomUUID();
  sessions.set(sid, userId);
  return sid;
}

export function getUserFromSession(sessionId: string | undefined | null): UserRecord | undefined {
  if (!sessionId) return undefined;
  const userId = sessions.get(sessionId);
  if (!userId) return undefined;
  const user = Array.from(users.values()).find((u) => u.id === userId);
  return user;
}

export function clearSession(sessionId: string | undefined | null) {
  if (!sessionId) return;
  sessions.delete(sessionId);
}
