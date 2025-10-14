import cron from "node-cron";

export const getNotifications = async (req, res) => {
  const notifications = [];

  cron.schedule("30 19 * * *", async () => {
    console.log("Sending daily 7:30 PM notification...");

    // Example notification payload
    const notification = {
      title: "Korder Reminder",
      body: "Hey legend! Time to check your daily tasks 💪",
      createdAt: new Date(),
    };

    // Store in DB or memory (optional)
    notifications.push(notification);
  });

  res.json(notifications);
};
