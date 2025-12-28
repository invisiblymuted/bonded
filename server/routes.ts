import { createServer, type Server } from "http";
import type { Express } from "express";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import {
  insertRelationshipSchema,
  insertMessageSchema,
  insertJournalEntrySchema,
  insertMediaSchema,
  relationships,
  messages,
  journalEntries,
  media,
} from "@shared/schema";
import { users } from "@shared/models/auth";
import { db } from "./db";
import { api } from "@shared/routes";
import { z } from "zod";
import { eq } from "drizzle-orm";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  // User Search
  app.get(api.users.search.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const query = req.query.q as string;
    if (!query) return res.json([]);
    const results = await storage.searchUsers(query);
    res.json(results);
  });

  // Relationships
  app.get(api.relationships.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    const rels = await storage.getRelationships(userId);
    res.json(rels);
  });

  app.post(api.relationships.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const data = insertRelationshipSchema.parse(req.body);
      const rel = await storage.createRelationship(data);
      res.status(201).json(rel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.patch(api.relationships.accept.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const rel = await storage.acceptRelationship(Number(req.params.id));
      res.json(rel);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Messages
  app.get(api.messages.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const msgs = await storage.getMessages(Number(req.params.relationshipId));
    res.json(msgs);
  });

  app.post(api.messages.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    try {
      const data = insertMessageSchema.omit({ relationshipId: true, senderId: true }).parse(req.body);
      const msg = await storage.createMessage({
        ...data,
        relationshipId: Number(req.params.relationshipId),
        senderId: userId,
      });
      res.status(201).json(msg);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Journal
  app.get(api.journal.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const entries = await storage.getJournalEntries(Number(req.params.relationshipId));
    res.json(entries);
  });

  app.post(api.journal.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    try {
      const data = insertJournalEntrySchema.omit({ relationshipId: true, authorId: true }).parse(req.body);
      const entry = await storage.createJournalEntry({
        ...data,
        relationshipId: Number(req.params.relationshipId),
        authorId: userId,
      });
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.patch(api.journal.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const data = insertJournalEntrySchema.partial().omit({ relationshipId: true, authorId: true }).parse(req.body);
      const entry = await storage.updateJournalEntry(Number(req.params.entryId), data);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Media
  app.get(api.media.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const m = await storage.getMedia(Number(req.params.relationshipId));
    res.json(m);
  });

  app.post(api.media.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    try {
      const data = api.media.create.input.parse(req.body);
      const m = await storage.createMedia({
        ...data,
        relationshipId: Number(req.params.relationshipId),
        uploaderId: userId,
      });
      res.status(201).json(m);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.delete(api.media.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const success = await storage.deleteMedia(Number(req.params.mediaId));
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  await seed();
  return httpServer;
}

async function seed() {
  const existing = await db.select().from(users).limit(1);
  if (existing.length === 0) {
    const [parent] = await db
      .insert(users)
      .values({
        email: "parent@example.com",
        firstName: "Sarah",
        lastName: "Parent",
        profileImageUrl: "https://github.com/shadcn.png",
      })
      .returning();

    const [child] = await db
      .insert(users)
      .values({
        email: "child@example.com",
        firstName: "Alex",
        lastName: "Child",
        profileImageUrl: "https://github.com/vercel.png",
      })
      .returning();

    const [rel] = await db
      .insert(relationships)
      .values({
        parentId: parent.id,
        childId: child.id,
        childName: "Alex",
      })
      .returning();

    await db.insert(messages).values([
      {
        relationshipId: rel.id,
        senderId: parent.id,
        content: "Hi sweetheart! How was your day?",
      },
      {
        relationshipId: rel.id,
        senderId: child.id,
        content: "Great! I made a new drawing for you today!",
      },
    ]);

    await db.insert(journalEntries).values({
      relationshipId: rel.id,
      authorId: parent.id,
      title: "Missing You",
      content: "Today I thought about all the fun times we share. Can't wait to see you again.",
      mood: "thoughtful",
    });

    await db.insert(media).values({
      relationshipId: rel.id,
      uploaderId: child.id,
      type: "drawing",
      url: "https://images.unsplash.com/photo-1564399579883-451a5adb02d5?w=500&h=500&fit=crop",
      filename: "drawing.jpg",
      caption: "My drawing of our family!",
    });

    console.log("Seeding complete");
  }
}
