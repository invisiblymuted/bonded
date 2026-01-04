import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { storage } from "./storage";

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";

declare global {
  namespace Express {
    interface Request {
      jwtPayload?: any;
    }
  }
}

export async function jwtMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.bonded_jwt || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) return next();

    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (!payload || !payload.userId) return next();

    const user = await storage.getUser(payload.userId);
    if (user) {
      (req as any).user = user;
      req.jwtPayload = payload;
    }
  } catch (err) {
    // ignore invalid token
  }
  return next();
}

export function signToken(userId: string) {
  const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}
