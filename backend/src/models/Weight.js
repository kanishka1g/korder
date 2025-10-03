import mongoose from "mongoose";

const weightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    weight: { type: Number, required: true },
    burnedCalories: { type: Number, required: true },
    location: {
      type: String,
      enum: ["home", "gym"],
      default: "home",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Weight", weightSchema);
