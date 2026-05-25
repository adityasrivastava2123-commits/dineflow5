import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "netbanking", "wallet", "cash"],
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    failureReason: String,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
    },
    refundReason: String,
    notes: String,
    metadata: mongoose.Schema.Types.Mixed,
    processingFee: Number,
    netAmount: Number,
    paidAt: Date,
    refundedAt: Date,
  },
  { timestamps: true }
);

paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ order: 1 });

export default mongoose.model("Payment", paymentSchema);
