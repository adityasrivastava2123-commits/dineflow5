import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    description: String,
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    minimumOrderValue: {
      type: Number,
      default: 0,
    },
    maximumDiscount: Number,
    usageLimit: Number,
    usagePerUser: {
      type: Number,
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUpto: {
      type: Date,
      required: true,
    },
    applicableCategories: [String],
    applicableMenuItems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
    }],
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usedBy: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        usedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);
