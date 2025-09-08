import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, unique: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    checkIns: [
      {
        date: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);
