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
      // In development, default to user ID 1 (daddy)
      const relationships = await storage.getRelationships(1);
      return res.json(relationships);
    }
    const relationships = await storage.getRelationships(Number((req.user as any).id));
    res.json(relationships);
  });

  app.get("/api/relationships/:userId", async (req, res) => {
    const relationships = await storage.getRelationships(Number(req.params.userId));
    res.json(relationships);
  });

  // Messages for a relationship
  app.get('/api/relationships/:relationshipId/messages', async (req, res) => {
    const msgs = await storage.getMessagesForRelationship(Number(req.params.relationshipId));
    res.json(msgs);
  });

  app.post('/api/relationships/:relationshipId/messages', async (req, res) => {
    const { content } = req.body ?? {};
    if (!content || typeof content !== 'string') return res.status(400).json({ message: 'Content required' });
    const relationshipId = Number(req.params.relationshipId);
    const senderId = (req.user as any)?.id || 1;
    const msg = await storage.createMessage(relationshipId, senderId, content);
    res.status(201).json(msg);
  });

  // Journal endpoints
  app.get('/api/relationships/:relationshipId/journal', async (req, res) => {
    const entries = await storage.getJournalEntriesForRelationship(Number(req.params.relationshipId));
    res.json(entries);
  });

  app.post('/api/relationships/:relationshipId/journal', async (req, res) => {
    const { title, content } = req.body ?? {};
    if (!title || typeof title !== 'string') return res.status(400).json({ message: 'Title required' });
    const relationshipId = Number(req.params.relationshipId);
    const authorId = (req.user as any)?.id || 1;
    const entry = await storage.createJournalEntry(relationshipId, authorId, { title, content: content || '' });
    res.status(201).json(entry);
  });

  // Media endpoints
  app.get('/api/relationships/:relationshipId/media', async (req, res) => {
    const items = await storage.getMediaForRelationship(Number(req.params.relationshipId));
    res.json(items);
  });

  app.post('/api/relationships/:relationshipId/media', async (req, res) => {
    const { type, url, filename, caption } = req.body ?? {};
    if (!type || !url || !filename) return res.status(400).json({ message: 'type, url and filename required' });
    const relationshipId = Number(req.params.relationshipId);
    const item = await storage.createMediaForRelationship(relationshipId, { type, url, filename, caption });
    res.status(201).json(item);
  });

  // Events
  app.get('/api/relationships/:relationshipId/events', async (req, res) => {
    const evts = await storage.getEventsForRelationship(Number(req.params.relationshipId));
    res.json(evts);
  });

  app.post('/api/relationships/:relationshipId/events', async (req, res) => {
    const { title, eventDate, eventType } = req.body ?? {};
    if (!title || !eventDate) return res.status(400).json({ message: 'title and eventDate required' });
    const relationshipId = Number(req.params.relationshipId);
    const creatorId = (req.user as any)?.id || 1;
    const ev = await storage.createEventForRelationship(relationshipId, creatorId, { title, eventDate, eventType });
    res.status(201).json(ev);
  });

  // Update current user's profile
  app.patch("/api/user", async (req, res) => {
    if (!req.user) {
      console.log('[PATCH /api/user] Unauthorized request - no req.user');
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Debug logging to help diagnose client save failures
      try {
        const contentLength = req.headers['content-length'];
        console.log(`[PATCH /api/user] headers content-length=${contentLength}`);
        const bodyStr = JSON.stringify(req.body || {});
        console.log(`[PATCH /api/user] body length=${bodyStr.length} preview=${bodyStr.slice(0,300)}`);
      } catch (e) {
        console.log('[PATCH /api/user] failed to stringify body for debug', e);
      }

      const { firstName, lastName, profileImageUrl, email, displayName } = req.body ?? {};
      const user = req.user as any;

      if (typeof firstName === "string") user.firstName = firstName;
      if (typeof lastName === "string") user.lastName = lastName;
      if (typeof profileImageUrl === "string") user.profileImageUrl = profileImageUrl;
      if (typeof email === "string") user.email = email;
      if (typeof displayName === "string") user.displayName = displayName;

      user.updatedAt = new Date();

      res.json(user);
    } catch (err: any) {
      console.error('[PATCH /api/user] update failed', err);
      res.status(500).json({ message: err?.message || "Failed to update user" });
    }
  });

  return httpServer;
}