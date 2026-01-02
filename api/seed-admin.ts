import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createUser, getUserByUsername } from "./_authDb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const setupToken = process.env.ADMIN_SETUP_TOKEN || "setup123";
  const token = req.headers["x-setup-token"];

  if (token !== setupToken) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { username, displayName, birthday, pin } = req.body || {};

  if (!username || !displayName || !birthday || !pin) {
    return res.status(400).json({ message: "All fields required: username, displayName, birthday, pin" });
  }

  const existing = await getUserByUsername(username);
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await createUser({ username, displayName, birthday, pin });
  return res.status(201).json({ id: user.id, username: user.username, displayName: user.display_name });
}
