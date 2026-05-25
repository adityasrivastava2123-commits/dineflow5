import express from "express";
import http from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payments.js";
import analyticsRoutes from "./routes/analytics.js";
import offerRoutes from "./routes/offers.js";
import restaurantRoutes from "./routes/restaurant.js";

import { socketHandler } from "./socket/socket.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { tenantMiddleware } from "./middleware/tenantMiddleware.js";
import { rateLimitMiddleware } from "./middleware/rateLimit.js";
import logger from "./utils/logger.js";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: process.env.SOCKET_TRANSPORTS?.split(",") || ["websocket"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg) } }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(rateLimitMiddleware);
app.use(tenantMiddleware);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/ready", (_req, res) => {
  res.status(200).json({ status: "READY" });
});

app.get("/api/live", (_req, res) => {
  res.status(200).json({ status: "LIVE" });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/restaurant", restaurantRoutes);

socketHandler(io);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

export default httpServer;
export { io };
