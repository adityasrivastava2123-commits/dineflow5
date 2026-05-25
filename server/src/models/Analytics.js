import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    date: {
      type: Date,
      default: () => new Date(),
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    averageOrderValue: {
      type: Number,
      default: 0,
    },
    topItems: [
      {
        menuItemId: mongoose.Schema.Types.ObjectId,
        name: String,
        quantity: Number,
        revenue: Number,
      },
    ],
    ordersByStatus: {
      pending: Number,
      accepted: Number,
      preparing: Number,
      ready: Number,
      delivered: Number,
      cancelled: Number,
    },
    customerMetrics: {
      newCustomers: Number,
      returningCustomers: Number,
      uniqueCustomers: Number,
    },
    peakHours: [
      {
        hour: Number,
        orders: Number,
      },
    ],
    paymentMethods: {
      upi: Number,
      card: Number,
      netbanking: Number,
      wallet: Number,
      cash: Number,
    },
    tableOccupancy: {
      totalTables: Number,
      occupiedTables: Number,
      occupancyRate: Number,
    },
    averageRating: Number,
    reviewCount: Number,
  },
  { timestamps: true }
);

analyticsSchema.index({ restaurant: 1, date: -1 });

export default mongoose.model("Analytics", analyticsSchema);
