import type { VercelRequest, VercelResponse } from "@vercel/node";
import { parseCookies } from "./_cookie";
import { getUserFromSession } from "./_authStore";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const cookies = parseCookies(req.headers.cookie);
  const sid = cookies["bonded_session"];
  const user = getUserFromSession(sid);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  return res.status(200).json({ id: user.id, username: user.username, displayName: user.displayName, birthday: user.birthday });
}
