const express = require("express");
const path = require("path");
const { CatTrackerAPI } = require("../api-wrapper");
const cacheMiddleware = require("./cache-middleware");

const app = express();
const PORT = process.env.PORT || 3000;
const catTrackerAPI = new CatTrackerAPI();

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", async (req, res) => {
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
    const { limit = 100, offset = 0 } = req.query;
    const tokens = await catTrackerAPI.getAllTokens(limit, offset);
    res.json(tokens);
  } catch (error) {
    console.error("Error fetching tokens:", error);
    res
      .status(500)
      .json({ error: "Error fetching tokens", details: error.message });
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

// Catch-all route to serve the frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
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
