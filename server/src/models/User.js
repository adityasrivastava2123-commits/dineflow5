import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "admin", "manager", "staff", "kitchen"],
      default: "customer",
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: function () {
        return this.role !== "customer";
      },
    },
    visitHistory: [
      {
        restaurantId: mongoose.Schema.Types.ObjectId,
        tableNumber: Number,
        visitDate: Date,
      },
    ],
    preferences: {
      language: {
        type: String,
        default: "en",
        enum: ["en", "hi"],
      },
      theme: {
        type: String,
        default: "light",
        enum: ["light", "dark"],
      },
      notifications: {
        type: Boolean,
        default: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
