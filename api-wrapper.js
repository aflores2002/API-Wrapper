// API-Wrapper/api-wrapper.js

const axios = require("axios");

class CatTrackerAPI {
  constructor(baseURL = "https://tracker.catprotocol.org/api/") {
    this.api = axios.create({ baseURL });
  }

  async checkHealth() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error("Error checking API health:", error.message);
      throw error;
    }
  }

  async getAllTokens(limit = 100, offset = 0) {
    const endpoints = [
      `/tokens?offset=${offset}&limit=${limit}`,
      `/api/tokens?offset=${offset}&limit=${limit}`,
      `/v1/tokens?offset=${offset}&limit=${limit}`,
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Attempting to fetch tokens from: ${endpoint}`);
        const response = await this.api.get(endpoint);
        console.log("API response received:", response.data);
        return this.transformPaginatedResponse(response.data);
      } catch (error) {
        console.error(`Error fetching tokens from ${endpoint}:`, error.message);
        if (error.response && error.response.status !== 404) {
          throw error; // If it's not a 404, it's an unexpected error, so we throw it
        }
        // If it's a 404, we continue to the next endpoint
      }
    }

    throw new Error("Unable to fetch tokens from any known endpoint");
  }

  async getTokenInfo(tokenIdOrAddr) {
    try {
      const response = await this.api.get(`/tokens/${tokenIdOrAddr}`);
      return this.transformTokenData(response.data);
    } catch (error) {
      console.error(`Error fetching info for token ${tokenIdOrAddr}:`, error);
      throw error;
    }
  }

  async getMinterUtxoCount(tokenIdOrAddr) {
    try {
      const response = await this.api.get(
        `/minters/${tokenIdOrAddr}/utxoCount`
      );
      return response.data.count;
    } catch (error) {
      console.error(
        `Error fetching minter UTXO count for token ${tokenIdOrAddr}:`,
        error
      );
      throw error;
    }
  }

  transformPaginatedResponse(rawData) {
    console.log("Transforming paginated response:", rawData);
    return {
      code: rawData.code,
      msg: rawData.msg,
      data: {
        tokens: rawData.data.tokens.map(this.transformTokenData),
        total: rawData.data.total,
      },
    };
  }

  transformTokenData(token) {
    console.log("Transforming token data:", token);
    const supply = parseFloat(token.supply);
    const maxSupply = parseFloat(token.info.max);
    const progress = ((supply / maxSupply) * 100).toFixed(2);

    return {
      name: token.name,
      symbol: token.symbol,
      tokenId: token.tokenId,
      holders: token.holders,
      supply: token.supply,
      decimals: token.decimals,
      revealHeight: token.revealHeight,
      mintUtxoCount: token.mintUtxoCount,
      info: {
        max: token.info.max,
        limit: token.info.limit || "0",
        premine: token.info.premine,
        minterMd5: token.info.minterMd5 || "",
      },
      // Additional transformed fields
      currentSupply: this.formatNumber(supply),
      maxSupply: this.formatNumber(maxSupply),
      progress: `${progress}%`,
      mintable: token.mintUtxoCount > 0,
    };
  }

  formatNumber(num) {
    if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + "M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + "K";
    }
    return num.toString();
  }
}

const catTrackerAPI = new CatTrackerAPI();

module.exports = {
  CatTrackerAPI,
  getAllTokens: (limit, offset) => catTrackerAPI.getAllTokens(limit, offset),
  getTokenMintInfo: (tokenId) => catTrackerAPI.getTokenInfo(tokenId),
  getMinterUtxoCount: (tokenId) => catTrackerAPI.getMinterUtxoCount(tokenId),
  default: catTrackerAPI,
};
