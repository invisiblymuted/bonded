import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupAuth } from "./auth"; // This connects your auth logic
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware to help us debug
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let resBody: any;

  const originalResJson = res.json;
  res.json = function (body) {
    resBody = body;
    return originalResJson.apply(res, arguments as any);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (resBody) {
        logLine += ` :: ${JSON.stringify(resBody)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  // 1. Setup Auth FIRST so routes are protected
  setupAuth(app);

  // 2. Register API Routes
  const server = await registerRoutes(app);

  // 3. Error Handling
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // 4. Setup Vite for Development (The Bridge to your React App)
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 5. Start the engine on 5001
  const PORT = 5001;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();
// At the bottom of server/index.ts
export default app;