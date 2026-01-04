import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage, hashPin } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { signToken } from "./jwt";

const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "bonded_jwt";

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: "bonded-secret-key", // In a real app, this would be an env variable
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore, // This connects to your storage.ts
    cookie: { secure: app.get("env") === "production" }
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({ usernameField: "username", passwordField: "pin" }, async (username, pin, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !user.pinHash) {
          return done(null, false, { message: "User not found" });
        }

        const valid = user.pinHash === hashPin(pin);
        if (!valid) return done(null, false, { message: "Invalid PIN" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, (user as SelectUser).id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // API Route for Login — still use passport to validate credentials, but issue a JWT for production
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    try {
      const user = req.user as any;
      const token = signToken(user.id);
      // set HttpOnly cookie for browser to send automatically
      res.cookie(JWT_COOKIE_NAME, token, {
        httpOnly: true,
        secure: app.get("env") === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: "Failed to sign token" });
    }
  });

  // API Route for Logout
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      // clear JWT cookie as well
      res.clearCookie(JWT_COOKIE_NAME);
      res.sendStatus(200);
    });
  });

  // Check current session
  app.get("/api/user", (req, res) => {
    if (!(req as any).user) return res.sendStatus(401);
    res.json(req.user);
  });
}