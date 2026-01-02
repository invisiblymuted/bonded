import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createUser, findUser, createSession } from "./_authStore";
import { sessionCookie } from "./_cookie";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, displayName, birthday, pin } = req.body || {};

  if (!username || typeof username !== "string") {
    return res.status(400).json({ message: "Username is required" });
  }
  if (!displayName || typeof displayName !== "string") {
    return res.status(400).json({ message: "Display name is required" });
  }
  if (!birthday || typeof birthday !== "string") {
    return res.status(400).json({ message: "Birthday is required" });
  }
  if (!pin || typeof pin !== "string" || pin.length < 4) {
    return res.status(400).json({ message: "PIN must be at least 4 digits" });
  }

  const existing = findUser(username);
  if (existing) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const user = createUser({ username, displayName, birthday, pin });
  const sid = createSession(user.id);

  res.setHeader("Set-Cookie", sessionCookie(sid));
  return res.status(201).json({ id: user.id, username: user.username, displayName: user.displayName });
}
