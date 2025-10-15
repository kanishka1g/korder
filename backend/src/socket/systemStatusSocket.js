import { getSystemStatus } from "../services/system.js";
import cron from "node-cron";

export const setupSystemStatusSocket = (io) => {
  const clients = new Set();
  const namespace = io.of("/system");
  let cronJob = null;

  namespace.on("connection", (socket) => {
    console.log("🔌 System client connected");
    clients.add(socket);

    if (!cronJob) {
      cronJob = cron.schedule("*/2 * * * * *", async () => {
        try {
          const status = await getSystemStatus();
          namespace.emit("statusUpdate", status);
        } catch (err) {
          console.error("❌ Error fetching system status:", err);
        }
      });
    }

    socket.on("disconnect", () => {
      console.log("❌ System client disconnected:", socket.id);
      clients.delete(socket);

      if (clients.size === 0 && cronJob) {
        cronJob.stop();
        cronJob = null;
      }
    });
  });
};
