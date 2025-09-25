import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habit.js";
import weightRoutes from "./routes/weight.js";
import userRoutes from "./routes/user.js";
import meta from "./routes/meta.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/habits", authMiddleware, habitRoutes);
app.use("/api/weights", authMiddleware, weightRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/meta", authMiddleware, meta);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
