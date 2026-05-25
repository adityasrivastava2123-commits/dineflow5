import express from "express";
import { createOrder, getOrders, getOrderById, updateOrderStatus, getRestaurantOrders } from "../controllers/orderCtrl.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrderById);
router.patch("/:id/status", authMiddleware, roleMiddleware(["admin", "manager", "kitchen", "staff"]), updateOrderStatus);
router.get("/restaurant/all", authMiddleware, roleMiddleware(["admin", "manager", "kitchen", "staff"]), getRestaurantOrders);

export default router;
