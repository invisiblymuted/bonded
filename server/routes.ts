import { createServer, type Server } from "http";
import type { Express } from "express";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import {
  insertRelationshipSchema,
  insertMessageSchema,
  insertJournalEntrySchema,
  insertMediaSchema,
  insertEventSchema,
  relationships,
  messages,
  journalEntries,
  media,
  events,
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
    // Enrich with user info for display
    const enrichedRels = await Promise.all(
      rels.map(async (rel) => {
        const isParent = rel.parentId === userId;
        const otherUserId = isParent ? rel.childId : rel.parentId;
        const otherUser = await storage.getUser(otherUserId);
        // Determine the name to show for the other person
        let otherUserName: string;
        if (isParent) {
          // Current user created the connection - show the nickname they set
          otherUserName = rel.childName;
        } else {
          // Someone else added the current user - show the creator's name
          otherUserName = rel.parentName || otherUser?.firstName || otherUser?.email?.split('@')[0] || "Connection";
        }
        return {
          ...rel,
          otherUserName,
          otherUserImage: otherUser?.profileImageUrl,
          isParent,
        };
      })
    );
    res.json(enrichedRels);
  });

  app.post(api.relationships.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const currentUserId = (req.user as any).claims.sub;
    const currentUser = await storage.getUser(currentUserId);
    try {
      const data = insertRelationshipSchema.parse(req.body);
      
      // Validate that the target user exists
      const targetUser = await storage.getUser(data.childId);
      if (!targetUser) {
        return res.status(400).json({ 
          message: "User not found. Make sure they have logged into Bonded at least once and shared their correct User ID with you." 
        });
      }
      
      // Don't allow connecting to yourself
      if (data.childId === currentUserId) {
        return res.status(400).json({ message: "You cannot connect with yourself." });
      }
      
      // Check for existing connection (in either direction)
      const existingRels = await storage.getRelationships(currentUserId);
      const alreadyConnected = existingRels.some(
        r => (r.parentId === currentUserId && r.childId === data.childId) ||
             (r.parentId === data.childId && r.childId === currentUserId)
      );
      if (alreadyConnected) {
        return res.status(400).json({ message: "You are already connected with this person." });
      }
      
      // Set the parent's name so the other person sees who connected with them
      const parentName = currentUser?.firstName || currentUser?.email?.split('@')[0] || "Connection";
      const rel = await storage.createRelationship({ ...data, parentName });
      // Notify the other user
      await storage.createNotification({
        userId: data.childId,
        type: "connection",
        title: "New Connection",
        message: `${parentName} connected with you!`,
        relationshipId: rel.id,
        read: false,
      });
      res.status(201).json(rel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        console.error("Create relationship error:", error);
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

  app.delete(api.relationships.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    try {
      const relId = Number(req.params.id);
      console.log("Deleting relationship:", relId, "for user:", userId);
      const rel = await storage.getRelationshipById(relId);
      if (!rel) return res.status(404).json({ message: "Connection not found" });
      // Check user is part of the relationship
      if (rel.parentId !== userId && rel.childId !== userId) {
        return res.status(403).json({ message: "Not authorized to remove this connection" });
      }
      await storage.deleteRelationship(relId);
      console.log("Successfully deleted relationship:", relId);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete relationship error:", error);
      res.status(500).json({ message: "Failed to remove connection" });
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
    const currentUser = await storage.getUser(userId);
    const relationshipId = Number(req.params.relationshipId);
    try {
      const data = insertMessageSchema.omit({ relationshipId: true, senderId: true }).parse(req.body);
      const msg = await storage.createMessage({
        ...data,
        relationshipId,
        senderId: userId,
      });
      // Notify the other user
      const rel = await storage.getRelationshipById(relationshipId);
      if (rel) {
        const otherUserId = rel.parentId === userId ? rel.childId : rel.parentId;
        await storage.createNotification({
          userId: otherUserId,
          type: "message",
          title: "New Message",
          message: `${currentUser?.firstName || "Someone"} sent you a message`,
          relationshipId,
          read: false,
        });
      }
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
    const currentUser = await storage.getUser(userId);
    const relationshipId = Number(req.params.relationshipId);
    try {
      const data = insertJournalEntrySchema.omit({ relationshipId: true, authorId: true }).parse(req.body);
      const entry = await storage.createJournalEntry({
        ...data,
        relationshipId,
        authorId: userId,
      });
      // Notify the other user
      const rel = await storage.getRelationshipById(relationshipId);
      if (rel) {
        const otherUserId = rel.parentId === userId ? rel.childId : rel.parentId;
        await storage.createNotification({
          userId: otherUserId,
          type: "journal",
          title: "New Journal Entry",
          message: `${currentUser?.firstName || "Someone"} wrote: "${data.title}"`,
          relationshipId,
          read: false,
        });
      }
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
    const currentUser = await storage.getUser(userId);
    const relationshipId = Number(req.params.relationshipId);
    try {
      const data = api.media.create.input.parse(req.body);
      const m = await storage.createMedia({
        ...data,
        relationshipId,
        uploaderId: userId,
      });
      // Notify the other user
      const rel = await storage.getRelationshipById(relationshipId);
      if (rel) {
        const otherUserId = rel.parentId === userId ? rel.childId : rel.parentId;
        await storage.createNotification({
          userId: otherUserId,
          type: "media",
          title: "New Media",
          message: `${currentUser?.firstName || "Someone"} shared a ${data.type}`,
          relationshipId,
          read: false,
        });
      }
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

  // Notifications
  app.get(api.notifications.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    const notifs = await storage.getNotifications(userId);
    res.json(notifs);
  });

  app.patch(api.notifications.markRead.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    try {
      await storage.markNotificationRead(Number(req.params.notificationId), userId);
      res.json({ success: true });
    } catch (error) {
      res.status(404).json({ message: "Notification not found" });
    }
  });

  app.patch(api.notifications.markAllRead.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    try {
      await storage.markAllNotificationsRead(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Dashboard Preferences
  app.get("/api/dashboard/preferences", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    const prefs = await storage.getDashboardPreferences(userId);
    if (prefs) {
      res.json(prefs);
    } else {
      res.json({
        userId,
        widgetOrder: '["connections","recentMessages","quickActions"]',
        hiddenWidgets: '[]',
        layoutDensity: 'spacious',
      });
    }
  });

  app.patch("/api/dashboard/preferences", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    try {
      const updateSchema = z.object({
        widgetOrder: z.string().optional().refine(val => {
          if (!val) return true;
          try {
            const arr = JSON.parse(val);
            return Array.isArray(arr) && arr.every(w => ["connections", "recentMessages", "quickActions"].includes(w));
          } catch { return false; }
        }, "Invalid widget order"),
        hiddenWidgets: z.string().optional().refine(val => {
          if (!val) return true;
          try {
            const arr = JSON.parse(val);
            return Array.isArray(arr) && arr.every(w => ["connections", "recentMessages", "quickActions"].includes(w));
          } catch { return false; }
        }, "Invalid hidden widgets"),
        layoutDensity: z.enum(["compact", "spacious"]).optional(),
      });
      const validated = updateSchema.parse(req.body);
      const prefs = await storage.upsertDashboardPreferences({
        userId,
        ...(validated.widgetOrder !== undefined && { widgetOrder: validated.widgetOrder }),
        ...(validated.hiddenWidgets !== undefined && { hiddenWidgets: validated.hiddenWidgets }),
        ...(validated.layoutDensity !== undefined && { layoutDensity: validated.layoutDensity }),
      });
      res.json(prefs);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Events (Calendar)
  app.get(api.events.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const evts = await storage.getEvents(Number(req.params.relationshipId));
    res.json(evts);
  });

  app.post(api.events.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    const currentUser = await storage.getUser(userId);
    const relationshipId = Number(req.params.relationshipId);
    try {
      const data = api.events.create.input.parse(req.body);
      const event = await storage.createEvent({
        ...data,
        relationshipId,
        creatorId: userId,
      });
      // Notify the other user
      const rel = await storage.getRelationshipById(relationshipId);
      if (rel) {
        const otherUserId = rel.parentId === userId ? rel.childId : rel.parentId;
        await storage.createNotification({
          userId: otherUserId,
          type: "event",
          title: "New Event",
          message: `${currentUser?.firstName || "Someone"} added: "${data.title}"`,
          relationshipId,
          read: false,
        });
      }
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.patch(api.events.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    try {
      const eventId = Number(req.params.eventId);
      const event = await storage.getEventById(eventId);
      if (!event) return res.status(404).json({ message: "Event not found" });
      // Check user is part of the relationship
      const rel = await storage.getRelationshipById(event.relationshipId);
      if (!rel || (rel.parentId !== userId && rel.childId !== userId)) {
        return res.status(403).json({ message: "Not authorized" });
      }
      const data = api.events.update.input.parse(req.body);
      const updated = await storage.updateEvent(eventId, data);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.delete(api.events.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    try {
      const eventId = Number(req.params.eventId);
      const event = await storage.getEventById(eventId);
      if (!event) return res.status(404).json({ message: "Event not found" });
      // Check user is part of the relationship
      const rel = await storage.getRelationshipById(event.relationshipId);
      if (!rel || (rel.parentId !== userId && rel.childId !== userId)) {
        return res.status(403).json({ message: "Not authorized" });
      }
      const success = await storage.deleteEvent(eventId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Notification Settings
  app.get("/api/notification-settings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    const settings = await storage.getNotificationSettings(userId);
    if (settings) {
      res.json(settings);
    } else {
      res.json({
        userId,
        soundEnabled: true,
        soundType: "chime",
        vibrationEnabled: true,
        vibrationPattern: "short",
        messageNotifications: true,
        eventNotifications: true,
        journalNotifications: true,
        mediaNotifications: true,
      });
    }
  });

  app.patch("/api/notification-settings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = (req.user as any).claims.sub;
    try {
      const updateSchema = z.object({
        soundEnabled: z.boolean().optional(),
        soundType: z.enum(["chime", "bell", "pop", "gentle", "none"]).optional(),
        vibrationEnabled: z.boolean().optional(),
        vibrationPattern: z.enum(["short", "long", "double", "none"]).optional(),
        messageNotifications: z.boolean().optional(),
        eventNotifications: z.boolean().optional(),
        journalNotifications: z.boolean().optional(),
        mediaNotifications: z.boolean().optional(),
      });
      const validated = updateSchema.parse(req.body);
      const settings = await storage.upsertNotificationSettings({
        userId,
        ...validated,
      });
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
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
