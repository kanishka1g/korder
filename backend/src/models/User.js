import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
