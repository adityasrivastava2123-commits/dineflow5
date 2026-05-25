import express from "express";
import { getRestaurantBySlug, updateRestaurantSettings, getRestaurantStaff, addStaff } from "../controllers/restaurantCtrl.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:slug", getRestaurantBySlug);
router.put("/settings", authMiddleware, roleMiddleware(["admin", "manager"]), updateRestaurantSettings);
router.get("/staff", authMiddleware, roleMiddleware(["admin", "manager"]), getRestaurantStaff);
router.post("/staff", authMiddleware, roleMiddleware(["admin", "manager"]), addStaff);

export default router;
