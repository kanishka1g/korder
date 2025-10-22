import mongoose from "mongoose";

const habitCycleSchema = new mongoose.Schema(
  {
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    weekdays: [
      {
        type: String,
        enum: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("HabitCycle", habitCycleSchema);
