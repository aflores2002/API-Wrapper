import Redis from "ioredis";

const redisClient = new Redis({
  host: "redis-11238.c53.west-us.azure.redns.redis-cloud.com",
  port: "11238",
  password: "74n6QggL5iXa7mbOgOKUsWSAXiihagmU",
});

export default redisClient;
