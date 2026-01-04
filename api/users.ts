import type { VercelRequest, VercelResponse } from "@vercel/node";
import { listUsers } from "./_authDb";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json(listUsers());
}
