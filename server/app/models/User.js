import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    profilePic: { type: String },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: process.env.DEFAULT_ROLE,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
