import express from "express";
import { CatTrackerAPI } from "./src/api-wrapper.js";

const app = express();
const port = process.env.PORT || 3000;
const catTrackerAPI = new CatTrackerAPI();

// Serve static files
app.use(express.static("public"));

// API routes
app.get("/api/tokens", async (req, res) => {
  try {
    const { limit = 10000, offset = 0 } = req.query;
    const tokens = await catTrackerAPI.getAllTokens(limit, offset);
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tokens" });
  }
});

// Add other API routes as needed, e.g.:
app.get("/api/token/:tokenId", async (req, res) => {
  try {
    const { tokenId } = req.params;
    const tokenInfo = await catTrackerAPI.getTokenInfo(tokenId);
    res.json(tokenInfo);
  } catch (error) {
    res.status(500).json({ error: "Error fetching token info" });
  }
});

app.get("/api/minter/:tokenId/utxo-count", async (req, res) => {
  try {
    const { tokenId } = req.params;
    const utxoCount = await catTrackerAPI.getMinterUtxoCount(tokenId);
    res.json(utxoCount);
  } catch (error) {
    res.status(500).json({ error: "Error fetching UTXO count" });
  }
});

// Serve the main HTML file for all other routes
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
