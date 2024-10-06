// api-wrapper.js

const axios = require("axios");

class CatTrackerAPI {
  constructor(baseURL = "https://cat-tracker.ngrok.pizza/") {
    this.api = axios.create({ baseURL });
  }

  async getAllTokens(limit = 100, offset = 0) {
    try {
      const response = await this.api.get(
        `/tokens?limit=${limit}&offset=${offset}`
      );
      return this.transformPaginatedResponse(response.data);
    } catch (error) {
      console.error("Error fetching all tokens:", error);
      throw error;
    }
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
      return response.data.count; // Assuming the count is returned in this format
    } catch (error) {
      console.error(
        `Error fetching minter UTXO count for token ${tokenIdOrAddr}:`,
        error
      );
      throw error;
    }
  }

  transformPaginatedResponse(rawData) {
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
    const supply = parseFloat(token.supply);
    const maxSupply = parseFloat(token.info.max);
    const progress = ((supply / maxSupply) * 100).toFixed(2);

    return {
      name: token.name,
      symbol: token.symbol,
      holders: this.formatNumber(token.holders),
      tokenId: token.tokenId,
      supply: this.formatNumber(supply),
      maxSupply: this.formatNumber(maxSupply),
      progress: `${progress}%`,
      premine: parseInt(token.info.premine),
      created: token.revealHeight, // Assuming this corresponds to 'CREATED'
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

module.exports = CatTrackerAPI;
