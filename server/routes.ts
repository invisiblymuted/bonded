import { createServer, type Server } from "http";
import type { Express } from "express";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Test Route
  app.get("/test", (_req, res) => {
    res.send("The server is alive!");
  });

  // User Route
  app.get("/api/users", async (req, res) => {
  const users = await storage.getUsers();
  res.json(users);
});

app.get("/api/relationships/:userId", async (req, res) => {
  const relationships = await storage.getRelationships(Number(req.params.userId));
  res.json(relationships);
});

  return httpServer;
}