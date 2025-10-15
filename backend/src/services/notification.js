import cron from "node-cron";
import { Notification } from "../models/Notification.js";
import clock from "../utils/clock.js";

export const startNotificationCron = ({ io, claimBatch = 10 }) => {
  const namespace = io.of("/notification");

  // every minute at :00
  cron.schedule(
    "*/1 * * * *",
    async () => {
      try {
        const now = clock.now;

        // Loop to pick up multiple due notifications (batch size avoid large memory)
        for (let i = 0; i < claimBatch; i++) {
          // Atomically claim one due notification
          const doc = await Notification.findOneAndUpdate(
            {
              scheduledAt: { $lte: now },
              isSuccess: false,
              isProcessing: { $ne: true },
            },
            {
              $set: { isProcessing: true },
            },
            { new: true }
          ).exec();

          if (!doc) break;

          try {
            // Are there any connected clients?
            const clientCount = namespace.sockets ? namespace.sockets.size : 0;

            if (clientCount > 0) {
              namespace.emit("notification", doc);

              await Notification.findByIdAndUpdate(doc._id, {
                $set: {
                  isSuccess: true,
                  sentAt: new Date(),
                  isProcessing: false,
                  note: "Sent by cron",
                },
              }).exec();

              console.log(
                `✅ Sent notification (cron): ${
                  doc.title
                } (${doc._id.toString()})`
              );
            } else {
              await Notification.findByIdAndUpdate(doc._id, {
                $set: { isProcessing: false },
              }).exec();
              console.log(
                `ℹ️ No clients connected; leaving notification pending: ${doc._id.toString()}`
              );
              break;
            }
          } catch (innerErr) {
            // Failed to emit or save — unclaim and increase retryCount
            await Notification.findByIdAndUpdate(doc._id, {
              $set: { isProcessing: false },
              $inc: { retryCount: 1 },
              $setOnInsert: {},
              $currentDate: { lastAttemptAt: true },
              note: innerErr.message,
            }).exec();

            console.error(
              "❌ Error processing notification",
              doc._id.toString(),
              innerErr
            );
          }
        }
      } catch (err) {
        console.error("❌ Notification cron failed", err);
      }
    },
    {
      timezone: "UTC", // choose timezone that suits you. Prefer UTC internally.
    }
  );

  console.log("⏰ Notification cron scheduled (runs every minute).");
};
