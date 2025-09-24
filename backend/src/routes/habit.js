import express from "express";
import {
  addHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  checkHabitForDay,
  getDayList,
  getStats,
} from "../controllers/habitController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addHabit);
router.get("/", getHabits);
router.get("/day-list", getDayList);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);
router.post("/:id/check", checkHabitForDay);
router.get("/stats", getStats);
export default router;
