import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    scheduledAt: { type: Date, default: null },
    isSuccess: { type: Boolean, default: false },
    isProcessing: { type: Boolean, default: false },
    sentAt: { type: Date, default: null },
    retryCount: { type: Number, default: 0 },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
