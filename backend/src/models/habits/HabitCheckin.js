import mongoose from "mongoose";

const habitCheckinSchema = new mongoose.Schema(
  {
    habitCycleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HabitCycle",
      required: true,
    },
    date: { type: Date, required: true },
    checked: { type: Boolean, default: true },
    missedNote: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("HabitCheckin", habitCheckinSchema);
