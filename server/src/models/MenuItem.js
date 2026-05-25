import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      url: String,
      publicId: String,
    },
    available: {
      type: Boolean,
      default: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    tags: [String],
    vegetarian: Boolean,
    spicyLevel: {
      type: Number,
      min: 0,
      max: 5,
    },
    preparationTime: Number,
    allergens: [String],
    nutrition: {
      calories: Number,
      protein: String,
      carbs: String,
      fat: String,
    },
    addons: [
      {
        name: String,
        price: Number,
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

menItemSchema.index({ restaurant: 1, category: 1 });
menItemSchema.index({ restaurant: 1, available: 1 });

export default mongoose.model("MenuItem", menuItemSchema);
