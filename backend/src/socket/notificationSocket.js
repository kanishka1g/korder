import cron from "node-cron";

export const setupNotificationSocket = (io) => {
  const namespace = io.of("/notification");

  namespace.on("connection", (socket) => {
    console.log(`📡 Notification client connected: ${socket.id}`);

    // Manual trigger from frontend
    socket.on("trigger-notification", (data) => {
      namespace.emit("notification", {
        title: data.title || "Korder Update",
        body: data.body || "You have a new notification",
        createdAt: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log(`❌ Notification client disconnected: ${socket.id}`);
    });
  });

  // Scheduled notification every minute (change cron as needed)
  cron.schedule("* * * * *", () => {
    namespace.emit("notification", {
      title: "Korder Reminder",
      body: "Hey test! " + new Date(),
      createdAt: new Date(),
    });
  });
};
