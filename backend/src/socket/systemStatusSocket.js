import { getSystemStatus } from "../services/system.js";

export const setupSystemStatusSocket = (io) => {
  const clients = new Set();
  let statusInterval = null;

  const namespace = io.of("/system");

  namespace.on("connection", (socket) => {
    console.log("🔌 System client connected");
    clients.add(socket);

    async function runStatusUpdate() {
      try {
        const status = await getSystemStatus();
        for (const client of clients) {
          client.emit("statusUpdate", status);
        }
      } catch (err) {
        console.error("Error fetching system status:", err);
      }
    }

    if (!statusInterval) {
      runStatusUpdate();
      statusInterval = setInterval(runStatusUpdate, 2000);
    }

    socket.on("disconnect", () => {
      console.log("❌ System client disconnected");
      clients.delete(socket);
      if (clients.size === 0) {
        clearInterval(statusInterval);
        statusInterval = null;
      }
    });
  });
};
