import express, { type Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes.ts";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS if needed (optional)
app.use(
  cors({
    origin: "*", // Replace with your actual deployed frontend URL
  }),
);

// MongoDB Connection
(async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      "mongodb+srv://helloyourwebsitedesign:NQMOEQPEOynSzjNk@cluster0.0bhjtbu.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0";
    if (!mongoUri) {
      console.error("❌ MONGODB_URI environment variable is not set.");
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Atlas connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
})();

// Request logger for API routes
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  // Wrap res.json to capture the response body for logging
  const originalResJson = res.json.bind(res);
  res.json = (bodyJson, ...args) => {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Main app setup inside an async function
(async () => {
  const server = createServer(app);
  await registerRoutes(app);

  // Setup Vite dev server or serve static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Global error handler middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    // Do NOT throw after sending response, just log error
    console.error("Unhandled error:", err);
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 5000;

  server.listen(port, "0.0.0.0", () => {
    log(`Server is running on http://0.0.0.0:${port}`);
  });

  // Graceful shutdown handlers
  const shutdown = async () => {
    console.log("\nShutting down gracefully...");
    await mongoose.disconnect();
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
})();
