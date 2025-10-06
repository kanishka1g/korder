export const dayPlanSocket = (io) => {
  const clients = new Set();
  let statusInterval = null;

  const namespace = io.of("/day-plan");

  namespace.on("connection", (socket) => {
    console.log("🔌 Day Plan client connected");
    clients.add(socket);
    //TODO: run this every once in a day
    async function runStatusUpdate() {
      try {
        const response = await fetch(
          "https://n8n.korder.cloud/webhook/day-paln"
        );
        const data = await response.json();
        for (const client of clients) {
          client.emit("statusUpdate", data);
        }
      } catch (err) {
        console.error("Error fetching system status:", err);
      }
    }

    if (!statusInterval) {
      runStatusUpdate();
      statusInterval = setInterval(runStatusUpdate, 60 * 60 * 1000);
    }

    socket.on("disconnect", () => {
      console.log("❌ Day Plan client disconnected");
      clients.delete(socket);
      if (clients.size === 0) {
        clearInterval(statusInterval);
        statusInterval = null;
      }
    });
  });
};
