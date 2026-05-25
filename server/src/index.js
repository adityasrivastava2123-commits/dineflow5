import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initRedis } from "./config/redis.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    logger.info("MongoDB connected successfully");

    await initRedis();
    logger.info("Redis initialized successfully");

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`API URL: ${process.env.APP_URL}`);
    });

    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT signal received: closing HTTP server");
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
