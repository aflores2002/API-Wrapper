// API-Wrapper/cat-tracker-cache-demo/cache-middleware.js

const redisClient = require("./redis-client");

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    redisClient.get(key, (error, cachedData) => {
      if (error) throw error;
      if (cachedData !== null) {
        return res.json(JSON.parse(cachedData));
      } else {
        res.sendResponse = res.json;
        res.json = (body) => {
          redisClient.setex(key, duration, JSON.stringify(body));
          res.sendResponse(body);
        };
        next();
      }
    });
  };
};

module.exports = cacheMiddleware;
