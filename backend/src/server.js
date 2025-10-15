import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habit.js";
import weightRoutes from "./routes/weight.js";
import userRoutes from "./routes/user.js";
import metaRoutes from "./routes/meta.js";
import workdeskRoutes from "./routes/workdesk.js";

import { authMiddleware } from "./middleware/authMiddleware.js";
import { initSocket, setupSockets } from "./socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = initSocket(server);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/habits", authMiddleware, habitRoutes);
app.use("/api/weights", authMiddleware, weightRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/meta", authMiddleware, metaRoutes);
app.use("/api/workdesk", authMiddleware, workdeskRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is running");
});

setupSockets(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
