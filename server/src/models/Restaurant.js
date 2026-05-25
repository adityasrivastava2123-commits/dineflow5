import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    phone: String,
    email: String,
    logo: {
      url: String,
      publicId: String,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    tables: {
      type: Number,
      required: true,
      default: 10,
    },
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    cuisineType: [String],
    subscriptionPlan: {
      type: String,
      enum: ["basic", "pro", "enterprise"],
      default: "basic",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
    features: {
      analytics: { type: Boolean, default: true },
      advancedOffers: { type: Boolean, default: false },
      kitchenDisplay: { type: Boolean, default: true },
      multiLanguage: { type: Boolean, default: false },
      whatsappIntegration: { type: Boolean, default: false },
    },
    settings: {
      currency: { type: String, default: "INR" },
      taxPercent: { type: Number, default: 5 },
      deliveryCharges: Number,
      minimumOrderValue: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    monthlyRevenue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
