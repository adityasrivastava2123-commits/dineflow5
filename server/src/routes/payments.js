import express from "express";
import { createPayment, verifyPayment, handleWebhook } from "../controllers/paymentCtrl.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createPayment);
router.post("/verify", authMiddleware, verifyPayment);
router.post("/webhook", handleWebhook);

export default router;
