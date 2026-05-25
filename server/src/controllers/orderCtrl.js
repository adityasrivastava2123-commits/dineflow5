import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import Payment from "../models/Payment.js";
import { generateOrderNumber, calculateOrderTotal, applyTax } from "../utils/orderUtils.js";
import logger from "../utils/logger.js";
import { io } from "../app.js";

export const createOrder = async (req, res) => {
  try {
    const { items, tableNumber, notes, specialInstructions } = req.body;
    const customerId = req.user.id;
    const restaurantId = req.headers["x-restaurant-id"] || req.query.restaurant;

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const menuItem = await MenuItem.findById(item.menuItemId);
        if (!menuItem) {
          throw new Error(`Menu item ${item.menuItemId} not found`);
        }
        return {
          menuItem: item.menuItemId,
          name: menuItem.name,
          price: menuItem.price,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
          addons: item.addons || [],
        };
      })
    );

    const subtotal = calculateOrderTotal(orderItems);
    const tax = applyTax(subtotal) - subtotal;
    const totalAmount = subtotal + tax;

    const order = new Order({
      orderNumber: generateOrderNumber(),
      customer: customerId,
      restaurant: restaurantId,
      tableNumber,
      items: orderItems,
      subtotal,
      tax,
      totalAmount,
      notes,
      status: "pending",
      paymentStatus: "pending",
    });

    await order.save();

    io.to(`restaurant-${restaurantId}`).emit("new-order", {
      orderId: order._id,
      orderNumber: order.orderNumber,
      tableNumber: order.tableNumber,
      totalAmount: order.totalAmount,
      itemCount: orderItems.length,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: { order },
    });
  } catch (error) {
    logger.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    const orders = await Order.find({ customer: customerId })
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { orders },
    });
  } catch (error) {
    logger.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("items.menuItem")
      .populate("payment");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { order },
    });
  } catch (error) {
    logger.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const restaurantId = req.headers["x-restaurant-id"];

    const validStatuses = ["pending", "accepted", "preparing", "ready", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status, startedAt: status === "preparing" ? new Date() : undefined },
      { new: true }
    );

    io.to(`restaurant-${restaurantId}`).emit("status-update", {
      orderId: order._id,
      status: order.status,
    });

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: { order },
    });
  } catch (error) {
    logger.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

export const getRestaurantOrders = async (req, res) => {
  try {
    const restaurantId = req.headers["x-restaurant-id"];
    const { status } = req.query;

    let query = { restaurant: restaurantId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { orders },
    });
  } catch (error) {
    logger.error("Get restaurant orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurant orders",
    });
  }
};
