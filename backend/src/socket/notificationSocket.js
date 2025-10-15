import { Notification } from "../models/Notification.js";
import clock from "../utils/clock.js";

export const setupNotificationSocket = (io) => {
  const namespace = io.of("/notification");

  namespace.on("connection", async (socket) => {
    console.log(`📡 Notification client connected`);

    const pending = await Notification.find({ isSuccess: false });
    pending.forEach((n) => socket.emit("notification", n));

    socket.on("trigger-notification", async (data) => {
      const scheduledTime = new Date(data.scheduledAt || clock.now);

      const notification = new Notification({
        title: data.title || "Korder Update",
        body: data.body || "You have a new notification",
        scheduledAt: scheduledTime,
        isSuccess: false,
        note: "",
      });

      await notification.save();

      const delay = scheduledTime.getTime() - clock.now.getTime();

      if (delay <= 0) {
        sendNotification(notification, namespace);
      } else {
        setTimeout(() => sendNotification(notification, namespace), delay);
      }

      console.log(
        `📝 Notification scheduled: ${notification.title} at ${scheduledTime}`
      );
    });

    socket.on("disconnect", () => {
      console.log(`❌ Notification client disconnected: ${socket.id}`);
    });
  });
};

// --- helper to send and update DB ---
async function sendNotification(notification, namespace) {
  try {
    namespace.emit("notification", notification);
    notification.isSuccess = true;
    notification.note = "Sent successfully";
    await notification.save();
    console.log(`✅ Notification sent: ${notification.title}`);
  } catch (err) {
    notification.isSuccess = false;
    notification.note = err.message;
    await notification.save();
    console.error(`❌ Failed to send notification: ${notification.title}`, err);
  }
}
