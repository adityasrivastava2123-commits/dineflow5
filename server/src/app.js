import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import logger from "./utils/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { generalRateLimit } from "./middleware/rateLimit.js";
import { socketHandler } from "./socket/socket.js";

// Import routes
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payments.js";
import analyticsRoutes from "./routes/analytics.js";
import offerRoutes from "./routes/offers.js";
import restaurantRoutes from "./routes/restaurant.js";

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","),
    credentials: true,
  })
);

app.use(generalRateLimit);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/restaurant", restaurantRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use(errorHandler);

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","),
      credentials: true,
    },
    transports: (process.env.SOCKET_TRANSPORTS || "websocket,polling").split(","),
  });

  socketHandler(io);
  logger.info("Socket.io initialized");

  return io;
};

export default app;
