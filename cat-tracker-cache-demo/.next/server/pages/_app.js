/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ "swr":
/*!**********************!*\
  !*** external "swr" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = import("swr");;

/***/ }),

/***/ "?8873":
/*!***********************!*\
  !*** debug (ignored) ***!
  \***********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "../api-wrapper.mjs":
/*!**************************!*\
  !*** ../api-wrapper.mjs ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   API_URL: () => (/* binding */ API_URL),\n/* harmony export */   CatTrackerAPI: () => (/* binding */ CatTrackerAPI),\n/* harmony export */   catTrackerAPI: () => (/* binding */ catTrackerAPI),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   fetcher: () => (/* binding */ fetcher),\n/* harmony export */   getAllTokens: () => (/* binding */ getAllTokens),\n/* harmony export */   getMinterUtxoCount: () => (/* binding */ getMinterUtxoCount),\n/* harmony export */   getTokenMintInfo: () => (/* binding */ getTokenMintInfo)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"../node_modules/axios/index.js\");\n// API-Wrapper/api-wrapper.mjs\n\n\nconst API_URL =\n  process.env.NEXT_PUBLIC_API_URL || \"https://cat-tracker.ngrok.pizza\";\n\nconst fetcher = async (url) => {\n  console.log(\"Fetching:\", url);\n  try {\n    const response = await axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get(url);\n    console.log(\"Fetch response:\", response.data);\n    return response.data;\n  } catch (error) {\n    console.error(\"Fetch error:\", error);\n    throw error;\n  }\n};\n\nclass CatTrackerAPI {\n  constructor() {\n    this.api = axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].create({ baseURL: API_URL });\n  }\n\n  async checkHealth() {\n    try {\n      const response = await this.api.get(\"/\");\n      return response.data;\n    } catch (error) {\n      console.error(\"Error checking API health:\", error.message);\n      throw error;\n    }\n  }\n\n  async getAllTokens(limit = 10000, offset = 0) {\n    const url = `/api/tokens?limit=${limit}&offset=${offset}&v=1`;\n    return fetcher(`${API_URL}${url}`);\n  }\n\n  async getTokenInfo(tokenIdOrAddr) {\n    try {\n      const response = await this.api.get(`/tokens/${tokenIdOrAddr}`);\n      return this.transformTokenData(response.data);\n    } catch (error) {\n      console.error(`Error fetching info for token ${tokenIdOrAddr}:`, error);\n      throw error;\n    }\n  }\n\n  async getMinterUtxoCount(tokenIdOrAddr) {\n    try {\n      const response = await this.api.get(\n        `/minters/${tokenIdOrAddr}/utxoCount`\n      );\n      return response.data.count;\n    } catch (error) {\n      console.error(\n        `Error fetching minter UTXO count for token ${tokenIdOrAddr}:`,\n        error\n      );\n      throw error;\n    }\n  }\n\n  transformTokenData(token) {\n    console.log(\"Transforming token data:\", token);\n    const supply = parseFloat(token.supply);\n    const maxSupply = parseFloat(token.info.max);\n    const progress = ((supply / maxSupply) * 100).toFixed(2);\n\n    return {\n      name: token.name,\n      symbol: token.symbol,\n      tokenId: token.tokenId,\n      holders: token.holders,\n      supply: token.supply,\n      decimals: token.decimals,\n      revealHeight: token.revealHeight,\n      mintUtxoCount: token.mintUtxoCount,\n      info: {\n        max: token.info.max,\n        limit: token.info.limit || \"0\",\n        premine: token.info.premine,\n        minterMd5: token.info.minterMd5 || \"\",\n      },\n      // Additional transformed fields\n      currentSupply: this.formatNumber(supply),\n      maxSupply: this.formatNumber(maxSupply),\n      progress: `${progress}%`,\n      mintable: token.mintUtxoCount > 0,\n    };\n  }\n\n  formatNumber(num) {\n    if (num >= 1e6) {\n      return (num / 1e6).toFixed(2) + \"M\";\n    } else if (num >= 1e3) {\n      return (num / 1e3).toFixed(2) + \"K\";\n    }\n    return num.toString();\n  }\n}\n\nconst catTrackerAPI = new CatTrackerAPI();\n\nconst getAllTokens = (limit, offset) =>\n  catTrackerAPI.getAllTokens(limit, offset);\nconst getTokenMintInfo = (tokenId) =>\n  catTrackerAPI.getTokenInfo(tokenId);\nconst getMinterUtxoCount = (tokenId) =>\n  catTrackerAPI.getMinterUtxoCount(tokenId);\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (catTrackerAPI);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vYXBpLXdyYXBwZXIubWpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBO0FBQzBCOztBQUVuQjtBQUNQOztBQUVPO0FBQ1A7QUFDQTtBQUNBLDJCQUEyQixpREFBUztBQUNwQztBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQSxlQUFlLG9EQUFZLEdBQUcsa0JBQWtCO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUNBQXFDLE1BQU0sVUFBVSxPQUFPO0FBQzVELHNCQUFzQixRQUFRLEVBQUUsSUFBSTtBQUNwQzs7QUFFQTtBQUNBO0FBQ0EscURBQXFELGNBQWM7QUFDbkU7QUFDQSxNQUFNO0FBQ04scURBQXFELGNBQWM7QUFDbkU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixjQUFjO0FBQ2xDO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxzREFBc0QsY0FBYztBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsU0FBUztBQUM1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87O0FBRUE7QUFDUDtBQUNPO0FBQ1A7QUFDTztBQUNQOztBQUVBLGlFQUFlLGFBQWEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NhdC10cmFja2VyLWNhY2hlLWRlbW8vLi4vYXBpLXdyYXBwZXIubWpzPzMzMWQiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQVBJLVdyYXBwZXIvYXBpLXdyYXBwZXIubWpzXG5pbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmV4cG9ydCBjb25zdCBBUElfVVJMID1cbiAgcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1VSTCB8fCBcImh0dHBzOi8vY2F0LXRyYWNrZXIubmdyb2sucGl6emFcIjtcblxuZXhwb3J0IGNvbnN0IGZldGNoZXIgPSBhc3luYyAodXJsKSA9PiB7XG4gIGNvbnNvbGUubG9nKFwiRmV0Y2hpbmc6XCIsIHVybCk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQodXJsKTtcbiAgICBjb25zb2xlLmxvZyhcIkZldGNoIHJlc3BvbnNlOlwiLCByZXNwb25zZS5kYXRhKTtcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRmV0Y2ggZXJyb3I6XCIsIGVycm9yKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxuZXhwb3J0IGNsYXNzIENhdFRyYWNrZXJBUEkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFwaSA9IGF4aW9zLmNyZWF0ZSh7IGJhc2VVUkw6IEFQSV9VUkwgfSk7XG4gIH1cblxuICBhc3luYyBjaGVja0hlYWx0aCgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmFwaS5nZXQoXCIvXCIpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBjaGVja2luZyBBUEkgaGVhbHRoOlwiLCBlcnJvci5tZXNzYWdlKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdldEFsbFRva2VucyhsaW1pdCA9IDEwMDAwLCBvZmZzZXQgPSAwKSB7XG4gICAgY29uc3QgdXJsID0gYC9hcGkvdG9rZW5zP2xpbWl0PSR7bGltaXR9Jm9mZnNldD0ke29mZnNldH0mdj0xYDtcbiAgICByZXR1cm4gZmV0Y2hlcihgJHtBUElfVVJMfSR7dXJsfWApO1xuICB9XG5cbiAgYXN5bmMgZ2V0VG9rZW5JbmZvKHRva2VuSWRPckFkZHIpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmFwaS5nZXQoYC90b2tlbnMvJHt0b2tlbklkT3JBZGRyfWApO1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtVG9rZW5EYXRhKHJlc3BvbnNlLmRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBmZXRjaGluZyBpbmZvIGZvciB0b2tlbiAke3Rva2VuSWRPckFkZHJ9OmAsIGVycm9yKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdldE1pbnRlclV0eG9Db3VudCh0b2tlbklkT3JBZGRyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5hcGkuZ2V0KFxuICAgICAgICBgL21pbnRlcnMvJHt0b2tlbklkT3JBZGRyfS91dHhvQ291bnRgXG4gICAgICApO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEuY291bnQ7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgIGBFcnJvciBmZXRjaGluZyBtaW50ZXIgVVRYTyBjb3VudCBmb3IgdG9rZW4gJHt0b2tlbklkT3JBZGRyfTpgLFxuICAgICAgICBlcnJvclxuICAgICAgKTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHRyYW5zZm9ybVRva2VuRGF0YSh0b2tlbikge1xuICAgIGNvbnNvbGUubG9nKFwiVHJhbnNmb3JtaW5nIHRva2VuIGRhdGE6XCIsIHRva2VuKTtcbiAgICBjb25zdCBzdXBwbHkgPSBwYXJzZUZsb2F0KHRva2VuLnN1cHBseSk7XG4gICAgY29uc3QgbWF4U3VwcGx5ID0gcGFyc2VGbG9hdCh0b2tlbi5pbmZvLm1heCk7XG4gICAgY29uc3QgcHJvZ3Jlc3MgPSAoKHN1cHBseSAvIG1heFN1cHBseSkgKiAxMDApLnRvRml4ZWQoMik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogdG9rZW4ubmFtZSxcbiAgICAgIHN5bWJvbDogdG9rZW4uc3ltYm9sLFxuICAgICAgdG9rZW5JZDogdG9rZW4udG9rZW5JZCxcbiAgICAgIGhvbGRlcnM6IHRva2VuLmhvbGRlcnMsXG4gICAgICBzdXBwbHk6IHRva2VuLnN1cHBseSxcbiAgICAgIGRlY2ltYWxzOiB0b2tlbi5kZWNpbWFscyxcbiAgICAgIHJldmVhbEhlaWdodDogdG9rZW4ucmV2ZWFsSGVpZ2h0LFxuICAgICAgbWludFV0eG9Db3VudDogdG9rZW4ubWludFV0eG9Db3VudCxcbiAgICAgIGluZm86IHtcbiAgICAgICAgbWF4OiB0b2tlbi5pbmZvLm1heCxcbiAgICAgICAgbGltaXQ6IHRva2VuLmluZm8ubGltaXQgfHwgXCIwXCIsXG4gICAgICAgIHByZW1pbmU6IHRva2VuLmluZm8ucHJlbWluZSxcbiAgICAgICAgbWludGVyTWQ1OiB0b2tlbi5pbmZvLm1pbnRlck1kNSB8fCBcIlwiLFxuICAgICAgfSxcbiAgICAgIC8vIEFkZGl0aW9uYWwgdHJhbnNmb3JtZWQgZmllbGRzXG4gICAgICBjdXJyZW50U3VwcGx5OiB0aGlzLmZvcm1hdE51bWJlcihzdXBwbHkpLFxuICAgICAgbWF4U3VwcGx5OiB0aGlzLmZvcm1hdE51bWJlcihtYXhTdXBwbHkpLFxuICAgICAgcHJvZ3Jlc3M6IGAke3Byb2dyZXNzfSVgLFxuICAgICAgbWludGFibGU6IHRva2VuLm1pbnRVdHhvQ291bnQgPiAwLFxuICAgIH07XG4gIH1cblxuICBmb3JtYXROdW1iZXIobnVtKSB7XG4gICAgaWYgKG51bSA+PSAxZTYpIHtcbiAgICAgIHJldHVybiAobnVtIC8gMWU2KS50b0ZpeGVkKDIpICsgXCJNXCI7XG4gICAgfSBlbHNlIGlmIChudW0gPj0gMWUzKSB7XG4gICAgICByZXR1cm4gKG51bSAvIDFlMykudG9GaXhlZCgyKSArIFwiS1wiO1xuICAgIH1cbiAgICByZXR1cm4gbnVtLnRvU3RyaW5nKCk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGNhdFRyYWNrZXJBUEkgPSBuZXcgQ2F0VHJhY2tlckFQSSgpO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsVG9rZW5zID0gKGxpbWl0LCBvZmZzZXQpID0+XG4gIGNhdFRyYWNrZXJBUEkuZ2V0QWxsVG9rZW5zKGxpbWl0LCBvZmZzZXQpO1xuZXhwb3J0IGNvbnN0IGdldFRva2VuTWludEluZm8gPSAodG9rZW5JZCkgPT5cbiAgY2F0VHJhY2tlckFQSS5nZXRUb2tlbkluZm8odG9rZW5JZCk7XG5leHBvcnQgY29uc3QgZ2V0TWludGVyVXR4b0NvdW50ID0gKHRva2VuSWQpID0+XG4gIGNhdFRyYWNrZXJBUEkuZ2V0TWludGVyVXR4b0NvdW50KHRva2VuSWQpO1xuXG5leHBvcnQgZGVmYXVsdCBjYXRUcmFja2VyQVBJO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///../api-wrapper.mjs\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var swr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! swr */ \"swr\");\n/* harmony import */ var _api_wrapper_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../api-wrapper.mjs */ \"../api-wrapper.mjs\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([swr__WEBPACK_IMPORTED_MODULE_1__]);\nswr__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(swr__WEBPACK_IMPORTED_MODULE_1__.SWRConfig, {\n        value: {\n            fetcher: _api_wrapper_mjs__WEBPACK_IMPORTED_MODULE_2__.fetcher,\n            revalidateOnFocus: false,\n            revalidateOnReconnect: false\n        },\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/Users/alfredoflores/Documents/GitHub/API-Wrapper/cat-tracker-cache-demo/pages/_app.js\",\n            lineNumber: 13,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/alfredoflores/Documents/GitHub/API-Wrapper/cat-tracker-cache-demo/pages/_app.js\",\n        lineNumber: 6,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQWdDO0FBQ2dCO0FBRWhELFNBQVNFLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDckMscUJBQ0UsOERBQUNKLDBDQUFTQTtRQUNSSyxPQUFPO1lBQ0xKLFNBQVNBLHFEQUFPQTtZQUNoQkssbUJBQW1CO1lBQ25CQyx1QkFBdUI7UUFDekI7a0JBRUEsNEVBQUNKO1lBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7QUFHOUI7QUFFQSxpRUFBZUYsS0FBS0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NhdC10cmFja2VyLWNhY2hlLWRlbW8vLi9wYWdlcy9fYXBwLmpzP2UwYWQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU1dSQ29uZmlnIH0gZnJvbSBcInN3clwiO1xuaW1wb3J0IHsgZmV0Y2hlciB9IGZyb20gXCIuLi8uLi9hcGktd3JhcHBlci5tanNcIjtcblxuZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XG4gIHJldHVybiAoXG4gICAgPFNXUkNvbmZpZ1xuICAgICAgdmFsdWU9e3tcbiAgICAgICAgZmV0Y2hlcjogZmV0Y2hlcixcbiAgICAgICAgcmV2YWxpZGF0ZU9uRm9jdXM6IGZhbHNlLFxuICAgICAgICByZXZhbGlkYXRlT25SZWNvbm5lY3Q6IGZhbHNlLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgPC9TV1JDb25maWc+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IE15QXBwO1xuIl0sIm5hbWVzIjpbIlNXUkNvbmZpZyIsImZldGNoZXIiLCJNeUFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsInZhbHVlIiwicmV2YWxpZGF0ZU9uRm9jdXMiLCJyZXZhbGlkYXRlT25SZWNvbm5lY3QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/mime-db","vendor-chunks/axios","vendor-chunks/follow-redirects","vendor-chunks/form-data","vendor-chunks/asynckit","vendor-chunks/combined-stream","vendor-chunks/mime-types","vendor-chunks/proxy-from-env","vendor-chunks/delayed-stream"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();