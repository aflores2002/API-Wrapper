import axios from "axios";

const API_URL = process.env.API_URL || "https://cat-tracker.ngrok.pizza";

export class CatTrackerAPI {
  constructor() {
    this.api = axios.create({ baseURL: API_URL });
  }

  async getAllTokens(limit = 10000, offset = 0) {
    try {
      const response = await this.api.get(
        `/api/tokens?limit=${limit}&offset=${offset}&v=1`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tokens:", error);
      throw error;
    }
  }

  // Add other API methods as needed, e.g.:
  async getTokenInfo(tokenId) {
    try {
      const response = await this.api.get(`/tokens/${tokenId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching token info:", error);
      throw error;
    }
  }

  async getMinterUtxoCount(tokenId) {
    try {
      const response = await this.api.get(`/minters/${tokenId}/utxoCount`);
      return response.data;
    } catch (error) {
      console.error("Error fetching minter UTXO count:", error);
      throw error;
    }
  }
}
