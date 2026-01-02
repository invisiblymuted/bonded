import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getUserByUsername, verifyPin, createSession } from "./_authDb";
import { sessionCookie } from "./_cookie";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, pin } = req.body || {};

  if (!username || typeof username !== "string") {
    return res.status(400).json({ message: "Username is required" });
  }
  if (!pin || typeof pin !== "string" || pin.length < 4) {
    return res.status(400).json({ message: "PIN must be at least 4 digits" });
  }

  const user = await getUserByUsername(username);
  if (!user) return res.status(401).json({ message: "User not found" });

  const valid = verifyPin(pin, user.pin_hash);
  if (!valid) return res.status(401).json({ message: "Invalid PIN" });

  const sid = createSession(user.id);
  res.setHeader("Set-Cookie", sessionCookie(sid));
  return res.status(200).json({ id: user.id, username: user.username, displayName: user.displayName });
}
