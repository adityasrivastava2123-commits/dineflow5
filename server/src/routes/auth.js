import express from "express";
import { register, login, logout, getProfile, updateProfile, refreshAccessToken, seedDemoData } from "../controllers/authCtrl.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { strictRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/register", strictRateLimit, register);
router.post("/login", strictRateLimit, login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/seed-demo", authMiddleware, seedDemoData);

export default router;
