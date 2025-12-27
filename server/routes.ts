import { createServer, type Server } from "http";
import type { Express } from "express";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import { insertChildSchema, children } from "@shared/schema";
import { users } from "@shared/models/auth";
import { db } from "./db";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.children.list.path, async (req, res) => {
    const children = await storage.getChildren();
    res.json(children);
  });

  app.get(api.children.listMine.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    const children = await storage.getChildrenByParent(userId);
    res.json(children);
  });

  app.get(api.children.get.path, async (req, res) => {
    const child = await storage.getChild(Number(req.params.id));
    if (!child) return res.sendStatus(404);
    res.json(child);
  });

  app.post(api.children.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    try {
      const data = insertChildSchema.omit({ parentId: true }).parse(req.body);
      const child = await storage.createChild({ ...data, parentId: userId });
      res.status(201).json(child);
    } catch (error) {
       if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.patch(api.children.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // In a real app, verify ownership
    try {
      const data = insertChildSchema.partial().omit({ parentId: true }).parse(req.body);
      const child = await storage.updateChild(Number(req.params.id), data);
      res.json(child);
    } catch (error) {
       if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.delete(api.children.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // In a real app, verify ownership
    await storage.deleteChild(Number(req.params.id));
    res.sendStatus(204);
  });

  // Seed data
  await seed();

  return httpServer;
}

async function seed() {
  const existingUsers = await db.select().from(users).limit(1);
  if (existingUsers.length === 0) {
    const [user] = await db.insert(users).values({
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      profileImageUrl: "https://github.com/shadcn.png"
    }).returning();

    await db.insert(children).values([
      {
        parentId: user.id,
        name: "Alex Doe",
        age: 10,
        description: "Wearing a red jacket and blue jeans. Loves dinosaurs.",
        lastSeenLocation: "Central Park, NY",
        status: "missing",
        photoUrl: "https://images.unsplash.com/photo-1503919545889-aef6d7a5180e?w=400&h=400&fit=crop"
      },
      {
        parentId: user.id,
        name: "Sarah Smith",
        age: 8,
        description: "Last seen near the school entrance. Has a pink backpack.",
        lastSeenLocation: "Springfield Elementary",
        status: "missing",
        photoUrl: "https://images.unsplash.com/photo-1519238263496-652d946ef236?w=400&h=400&fit=crop"
      },
      {
        parentId: user.id,
        name: "Mikey Johnson",
        age: 12,
        description: "Found wandering near the station. Safe now.",
        lastSeenLocation: "Union Station",
        status: "found",
        photoUrl: "https://images.unsplash.com/photo-1488161628813-99c974fc5b76?w=400&h=400&fit=crop"
      }
    ]);
    console.log("Seeding complete");
  }
}
