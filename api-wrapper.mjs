// API-Wrapper/api-wrapper.mjs
import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://cat-tracker.ngrok.pizza";

export const fetcher = async (url) => {
  console.log("Fetching:", url);
  try {
    const response = await axios.get(url);
    console.log("Fetch response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export class CatTrackerAPI {
  constructor() {
    this.api = axios.create({ baseURL: API_URL });
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

  async getAllTokens(limit = 10000, offset = 0) {
    const url = `/api/tokens?limit=${limit}&offset=${offset}&v=1`;
    return fetcher(`${API_URL}${url}`);
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

export const catTrackerAPI = new CatTrackerAPI();

export const getAllTokens = (limit, offset) =>
  catTrackerAPI.getAllTokens(limit, offset);
export const getTokenMintInfo = (tokenId) =>
  catTrackerAPI.getTokenInfo(tokenId);
export const getMinterUtxoCount = (tokenId) =>
  catTrackerAPI.getMinterUtxoCount(tokenId);

export default catTrackerAPI;
