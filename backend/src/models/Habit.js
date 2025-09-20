import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, unique: true },
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
    checkIns: [
      {
        date: { type: Date, required: true },
        missedNote: { type: String, default: null },
        checked: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);
