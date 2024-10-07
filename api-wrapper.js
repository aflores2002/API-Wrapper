// api-wrapper.js

import axios from 'axios';

class CatTrackerAPI {
        constructor(baseURL = 'https://cat-tracker.ngrok.pizza/') {
                this.api = axios.create({ baseURL });
        }

        async getAllTokens(limit = 100, offset = 0) {
                try {
                        const response = await this.api.get(`/tokens?limit=${limit}&offset=${offset}`);
                        return this.transformPaginatedResponse(response.data);
                } catch (error) {
                        console.error('Error fetching all tokens:', error);
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
                        const response = await this.api.get(`/minters/${tokenIdOrAddr}/utxoCount`);
                        return response.data.count;
                } catch (error) {
                        console.error(`Error fetching minter UTXO count for token ${tokenIdOrAddr}:`, error);
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
                        tokenId: token.tokenId,
                        holders: token.holders,
                        supply: token.supply,
                        decimals: token.decimals,
                        revealHeight: token.revealHeight,
                        mintUtxoCount: token.mintUtxoCount,
                        info: {
                                max: token.info.max,
                                limit: token.info.limit || '0',
                                premine: token.info.premine,
                                minterMd5: token.info.minterMd5 || '',
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
                        return (num / 1e6).toFixed(2) + 'M';
                } else if (num >= 1e3) {
                        return (num / 1e3).toFixed(2) + 'K';
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
        default: catTrackerAPI
};