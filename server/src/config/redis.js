import redis from "redis";
import logger from "../utils/logger.js";

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  password: process.env.REDIS_PASSWORD,
});

client.on("error", (err) => logger.error("Redis error:", err));
client.on("connect", () => logger.info("Redis connected"));

await client.connect();

export const getCache = async (key) => {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error("Cache get error:", error);
    return null;
  }
};

export const setCache = async (key, value, ttl = 3600) => {
  try {
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.error("Cache set error:", error);
  }
};

export const deleteCache = async (key) => {
  try {
    await client.del(key);
  } catch (error) {
    logger.error("Cache delete error:", error);
  }
};

export const invalidatePattern = async (pattern) => {
  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    logger.error("Cache invalidate pattern error:", error);
  }
};

export default client;
