import { Notification } from "../models/Notification.js";
import clock from "../utils/clock.js";

export const setupNotificationSocket = (io) => {
  const namespace = io.of("/notification");

  namespace.on("connection", async (socket) => {
    console.log(`📡 Notification client connected`);

    // Emit pending notifications to the newly-connected client
    const pending = await Notification.find({ isSuccess: false });
    pending.forEach((n) => socket.emit("notification", n));

    socket.on("trigger-notification", async (data) => {
      const scheduledTime = data.scheduledAt
        ? new Date(data.scheduledAt)
        : new Date(clock.now);

      const notification = new Notification({
        title: data.title || "Korder Update",
        body: data.body || "You have a new notification",
        scheduledAt: scheduledTime,
        isSuccess: false,
      });

      await notification.save();

      // respond/ack if you like (not necessary)
      socket.emit("notification-saved", {
        id: notification._id,
        scheduledAt: notification.scheduledAt,
      });

      console.log(
        `📝 Notification saved: ${notification.title} at ${scheduledTime}`
      );
    });

    socket.on("disconnect", () => {
      console.log(`❌ Notification client disconnected: ${socket.id}`);
    });
  });
};
