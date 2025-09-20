import express from "express";
import {
  addHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  checkHabitForDay,
  getTodaysHabits,
} from "../controllers/habitController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addHabit);
router.get("/", getHabits);
router.get("/today", getTodaysHabits);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);
router.post("/:id/check", checkHabitForDay);

export default router;
