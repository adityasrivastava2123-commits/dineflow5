import Razorpay from "razorpay";
import logger from "../utils/logger.js";
import crypto from "crypto";

let razorpayInstance = null;

export const initRazorpay = () => {
  try {
    if (razorpayInstance) {
      return razorpayInstance;
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    logger.info("Razorpay initialized successfully");
    return razorpayInstance;
  } catch (error) {
    logger.error("Razorpay initialization error:", error);
    throw error;
  }
};

export const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    return initRazorpay();
  }
  return razorpayInstance;
};

export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  try {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    logger.error("Payment signature verification error:", error);
    return false;
  }
};

export const createOrder = async (amount, currency = "INR", receipt, notes = {}) => {
  try {
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt,
      notes,
    });
    return order;
  } catch (error) {
    logger.error("Error creating Razorpay order:", error);
    throw error;
  }
};
