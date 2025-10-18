// socket.js
import { Server } from "socket.io";
import { setupSystemStatusSocket } from "./socket/systemStatusSocket.js";
import { setupNotificationSocket } from "./socket/notificationSocket.js";
import { startNotificationCron } from "./services/notification.js";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

export const setupSockets = (io) => {
  setupSystemStatusSocket(io);
  setupNotificationSocket(io);
  startNotificationCron({ io });
};
