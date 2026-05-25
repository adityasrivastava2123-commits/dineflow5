import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },
        name: String,
        price: Number,
        quantity: Number,
        specialInstructions: String,
        addons: [
          {
            name: String,
            price: Number,
          },
        ],
      },
    ],
    subtotal: Number,
    tax: Number,
    discount: Number,
    discountCode: String,
    totalAmount: Number,
    status: {
      type: String,
      enum: ["pending", "accepted", "preparing", "ready", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    estimatedTime: Number,
    startedAt: Date,
    preparedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    rating: {
      score: Number,
      review: String,
      ratedAt: Date,
    },
    notes: String,
    isReplaceOrder: {
      type: Boolean,
      default: false,
    },
    originalOrderId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

orderSchema.index({ restaurant: 1, createdAt: -1 });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1, restaurant: 1 });

export default mongoose.model("Order", orderSchema);
