import type { VercelRequest, VercelResponse } from "@vercel/node";
import { parseCookies, clearSessionCookie } from "./_cookie";
import { clearSession } from "./_authStore";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const cookies = parseCookies(req.headers.cookie);
  clearSession(cookies["bonded_session"]);
  res.setHeader("Set-Cookie", clearSessionCookie());
  return res.status(200).json({ ok: true });
}
