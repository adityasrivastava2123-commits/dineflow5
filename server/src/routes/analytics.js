import express from "express";
import { getDashboardMetrics, getRevenueAnalytics, getTopSellingItems, getPeakHours, getCustomerMetrics } from "../controllers/analyticsCtrl.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, roleMiddleware(["admin", "manager"]), getDashboardMetrics);
router.get("/revenue", authMiddleware, roleMiddleware(["admin", "manager"]), getRevenueAnalytics);
router.get("/top-items", authMiddleware, roleMiddleware(["admin", "manager"]), getTopSellingItems);
router.get("/peak-hours", authMiddleware, roleMiddleware(["admin", "manager"]), getPeakHours);
router.get("/customers", authMiddleware, roleMiddleware(["admin", "manager"]), getCustomerMetrics);

export default router;
