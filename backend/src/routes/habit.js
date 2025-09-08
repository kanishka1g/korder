import express from "express";
import {
  addHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  dailyCheck,
} from "../controllers/habitController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // all routes protected

router.post("/", addHabit); // Add habit
router.get("/", getHabits); // Get all habits
router.put("/:id", updateHabit); // Update habit
router.delete("/:id", deleteHabit); // Delete habit
router.post("/:id/check", dailyCheck); //Daily check

export default router;
