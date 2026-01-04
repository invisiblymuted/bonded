import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getUserByUsername, verifyPin, createSession } from "./_authDb";
import { sessionCookie } from "./_cookie";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  // create server session for compatibility (optional)
  try {
    const sid = await createSession(user.id);
    res.setHeader("Set-Cookie", sessionCookie(sid));
  } catch (e) {
    // ignore session store errors in serverless
  }

  // sign JWT and return as HttpOnly cookie so browser can send it to serverless endpoints
  try {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "7d" });
    const cookieParts = [`bonded_jwt=${token}`, "Path=/", "HttpOnly", "SameSite=Lax", `Max-Age=${60 * 60 * 24 * 7}`];
    if (process.env.VERCEL === "1") cookieParts.push("Secure");
    res.setHeader("Set-Cookie", cookieParts.join('; '));
  } catch (e) {
    // failed to sign token — continue without JWT
  }

  return res.status(200).json({ id: user.id, username: user.username, displayName: user.displayName });
}
