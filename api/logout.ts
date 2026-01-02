import type { VercelRequest, VercelResponse } from "@vercel/node";
import { parseCookies, clearSessionCookie } from "./_cookie";
import { deleteSession } from "./_authDb";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const cookies = parseCookies(req.headers.cookie);
  const sid = cookies["bonded_session"];
  if (sid) await deleteSession(sid);
  res.setHeader("Set-Cookie", clearSessionCookie());
  return res.status(200).json({ ok: true });
}
