import { createServer, type Server } from "http";
import type { Express } from "express";
import { storage, hashPin } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Test Route
  app.get("/test", (_req, res) => {
    res.send("The server is alive!");
  });

  // User Route - Get current logged-in user
  app.get("/api/user", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(req.user);
  });

  // List all users
  app.get("/api/users", async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  app.post("/api/signup", async (req, res, next) => {
    try {
      const { username, pin, birthday, displayName } = req.body ?? {};

      if (!username || typeof username !== "string") {
        return res.status(400).json({ message: "Username is required" });
      }
      if (!pin || typeof pin !== "string" || pin.length < 4) {
        return res.status(400).json({ message: "PIN must be at least 4 digits" });
      }
      if (!birthday || typeof birthday !== "string") {
        return res.status(400).json({ message: "Birthday is required" });
      }

      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({
        username,
        email: username,
        firstName: displayName || username,
        lastName: "",
        displayName: displayName || username,
        birthday,
        pinHash: hashPin(pin),
        password: null,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ id: user.id, username: user.username, birthday: user.birthday });
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", async (req, res, next) => {
    try {
      const { username, pin } = req.body ?? {};

      if (!username || typeof username !== "string") {
        return res.status(400).json({ message: "Username is required" });
      }
      if (!pin || typeof pin !== "string" || pin.length < 4) {
        return res.status(400).json({ message: "PIN must be at least 4 digits" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || !user.pinHash) {
        return res.status(401).json({ message: "Invalid username or PIN" });
      }

      const { verifyPin } = await import("./storage");
      const pinValid = verifyPin(pin, user.pinHash);
      
      if (!pinValid) {
        return res.status(401).json({ message: "Invalid username or PIN" });
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(200).json({ id: user.id, username: user.username, firstName: user.firstName });
      });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.redirect("/");
    });
  });

  // Get relationships for the current user
  app.get("/api/relationships", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const relationships = await storage.getRelationships(Number((req.user as any).id));
    res.json(relationships);
  });

  app.get("/api/relationships/:userId", async (req, res) => {
    const relationships = await storage.getRelationships(Number(req.params.userId));
    res.json(relationships);
  });

  return httpServer;
}