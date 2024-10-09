import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { CatTrackerAPI, API_URL, fetcher } from "../api-wrapper.mjs";
import cacheMiddleware from "./cache-middleware.js";
import redisClient from "./redis-client.js";
import next from "next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();
const PORT = process.env.PORT || 3000;
const catTrackerAPI = new CatTrackerAPI();

nextApp.prepare().then(() => {
  // Middleware to log all requests
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Serve static files from the 'public' directory
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/api/health", cacheMiddleware(300), async (req, res) => {
    try {
      const health = await catTrackerAPI.checkHealth();
      res.json(health);
    } catch (error) {
      console.error("Error checking API health:", error);
      res
        .status(500)
        .json({ error: "API Health Check Failed", details: error.message });
    }
  });

  app.get("/api/tokens", cacheMiddleware(300), async (req, res) => {
    try {
      const { limit = 10000, offset = 0 } = req.query;
      console.log(`Fetching tokens with limit: ${limit}, offset: ${offset}`);
      const tokens = await fetcher(
        `${API_URL}/api/tokens?limit=${limit}&offset=${offset}&v=1`
      );
      res.json(tokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      res.status(500).json({
        error: "Error fetching tokens",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  });

  app.get("/api/token/:tokenId", cacheMiddleware(300), async (req, res) => {
    try {
      const { tokenId } = req.params;
      const tokenInfo = await catTrackerAPI.getTokenInfo(tokenId);
      res.json(tokenInfo);
    } catch (error) {
      console.error(
        `Error fetching token info for ${req.params.tokenId}:`,
        error
      );
      res
        .status(500)
        .json({ error: "Error fetching token info", details: error.message });
    }
  });

  app.get(
    "/api/minter/:tokenId/utxo-count",
    cacheMiddleware(300),
    async (req, res) => {
      try {
        const { tokenId } = req.params;
        const utxoCount = await catTrackerAPI.getMinterUtxoCount(tokenId);
        res.json({ utxoCount });
      } catch (error) {
        console.error(
          `Error fetching UTXO count for ${req.params.tokenId}:`,
          error
        );
        res
          .status(500)
          .json({ error: "Error fetching UTXO count", details: error.message });
      }
    }
  );

  app.get("/debug/cache", async (req, res) => {
    try {
      const keys = await redisClient.keys("*");
      const result = {};
      for (const key of keys) {
        const value = await redisClient.get(key);
        const ttl = await redisClient.ttl(key);
        result[key] = { value: JSON.parse(value), ttl };
      }
      res.json(result);
    } catch (error) {
      console.error("Error fetching cache data:", error);
      res.status(500).json({ error: "Error fetching cache data" });
    }
  });

  // Let Next.js handle all other routes
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error("Global error handler caught:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});
