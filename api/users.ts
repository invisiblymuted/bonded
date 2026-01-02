import type { VercelRequest, VercelResponse } from "@vercel/node";
import { listUsers } from "./_authStore";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json(listUsers());
}
