import redis from "redis";
import logger from "../utils/logger.js";

let redisClient = null;

export const initRedis = async () => {
  try {
    if (redisClient && redisClient.isOpen) {
      return redisClient;
    }

    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

    redisClient = redis.createClient({
      url: redisUrl,
      password: process.env.REDIS_PASSWORD,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error("Max Redis reconnection attempts exceeded");
            return new Error("Max retries exceeded");
          }
          return retries * 50;
        },
      },
    });

    redisClient.on("error", (error) => {
      logger.error("Redis client error:", error);
    });

    redisClient.on("connect", () => {
      logger.info("Redis client connected");
    });

    await redisClient.connect();
    logger.info("Redis connected successfully");

    return redisClient;
  } catch (error) {
    logger.error("Redis initialization error:", error);
    throw error;
  }
};

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }
  return redisClient;
};

export const setCache = async (key, value, ttl = 3600) => {
  try {
    const client = getRedisClient();
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.error(`Cache set error for key ${key}:`, error);
  }
};

export const getCache = async (key) => {
  try {
    const client = getRedisClient();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Cache get error for key ${key}:`, error);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    logger.error(`Cache delete error for key ${key}:`, error);
  }
};

export const invalidatePattern = async (pattern) => {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    logger.error(`Cache invalidation error for pattern ${pattern}:`, error);
  }
};
