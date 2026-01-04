import type { VercelRequest, VercelResponse } from "@vercel/node";
import { parseCookies } from "./_cookie";
import { getUserFromSession, getUserById } from "./_authDb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cookies = parseCookies(req.headers.cookie);

  // Try session-based auth first (legacy)
  const sid = cookies["bonded_session"];
  if (sid) {
    const user = await getUserFromSession(sid);
    if (user) return res.status(200).json({ id: user.id, username: user.username, displayName: (user as any).display_name || (user as any).displayName, birthday: (user as any).birthday });
  }

  // Fallback to JWT cookie
  const token = cookies["bonded_jwt"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };
    if (!decoded || !decoded.userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await getUserById(decoded.userId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    return res.status(200).json({ id: user.id, username: user.username, displayName: (user as any).display_name || (user as any).displayName, birthday: (user as any).birthday });
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
