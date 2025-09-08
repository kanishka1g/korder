import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }, // optional: roles like admin/user
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
