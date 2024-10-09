// API-Wrapper/cat-tracker-cache-demo/redis-client.js

const Redis = require("ioredis");

const redisHost = "redis-11238.c53.west-us.azure.redns.redis-cloud.com";
const redisPort = "11238";
const redisPassword = "74n6QggL5iXa7mbOgOKUsWSAXiihagmU";

const redisClient = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
});

module.exports = redisClient;
