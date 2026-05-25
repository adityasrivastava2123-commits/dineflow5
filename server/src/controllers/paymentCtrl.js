import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import { createOrder as createRazorpayOrder, verifyPaymentSignature } from "../config/razorpay.js";
import logger from "../utils/logger.js";
import { io } from "../app.js";

export const createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const customerId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.customer.toString() !== customerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const razorpayOrder = await createRazorpayOrder(
      order.totalAmount,
      "INR",
      orderId,
      {
        orderId: order._id,
        customerId,
        tableNumber: order.tableNumber,
      }
    );

    const payment = new Payment({
      order: orderId,
      amount: order.totalAmount,
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
      currency: "INR",
    });

    await payment.save();

    res.status(201).json({
      success: true,
      data: {
        payment: {
          id: payment._id,
          razorpayOrderId: razorpayOrder.id,
          amount: order.totalAmount,
          currency: "INR",
        },
      },
    });
  } catch (error) {
    logger.error("Create payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    payment.status = "paid";
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.paidAt = new Date();
    await payment.save();

    const order = await Order.findById(payment.order);
    order.paymentStatus = "paid";
    order.payment = payment._id;
    order.status = "accepted";
    await order.save();

    const restaurantId = order.restaurant.toString();
    io.to(`restaurant-${restaurantId}`).emit("payment-done", {
      orderId: order._id,
      paymentId: payment._id,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: { orderId: payment.order },
    });
  } catch (error) {
    logger.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const { event, payload } = req.body;

    if (event === "payment.authorized" || event === "payment.captured") {
      const payment = await Payment.findOne({
        razorpayPaymentId: payload.payment.entity.id,
      });

      if (payment) {
        payment.status = "paid";
        payment.paidAt = new Date();
        await payment.save();

        const order = await Order.findById(payment.order);
        order.paymentStatus = "paid";
        order.status = "accepted";
        await order.save();
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error("Webhook handling error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook handling failed",
    });
  }
};
